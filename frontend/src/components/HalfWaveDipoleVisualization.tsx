import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import "./HalfWaveDipoleVisualization.css";

type Mode = "field" | "power";
type RGB = [number, number, number];
type V3 = [number, number, number];

type Params = {
  frequency: number; // GHz
  current: number; // A, peak I0
  distance: number; // r / lambda
  theta: number; // deg
  phi: number; // deg
  mode: Mode;
  cut: number; // deg of the shell cut away
  grid: boolean;
  spin: boolean;
  showPoint: boolean;
  showHertz: boolean;
  showHPBW: boolean;
  showCurrent: boolean;
  animate: boolean;
};

const DEFAULTS: Params = {
  frequency: 1,
  current: 1,
  distance: 10,
  theta: 60,
  phi: 30,
  mode: "field",
  cut: 0,
  grid: true,
  spin: false,
  showPoint: true,
  showHertz: false,
  showHPBW: false,
  showCurrent: true,
  animate: true,
};

const C0 = 299792458;
const ETA = 120 * Math.PI; // Sadiku uses eta = 120*pi (free space) in eq. (13.21)
const TWO_PI = Math.PI * 2;

/* ------------------------------ physics ------------------------------ */

// Sadiku eq. (13.19): |E| ∝ cos((π/2)cosθ) / sinθ   (peak = 1 at θ = 90°)
export const fieldPattern = (theta: number): number => {
  const s = Math.sin(theta);
  if (Math.abs(s) < 1e-6) return 0;
  return Math.cos((Math.PI / 2) * Math.cos(theta)) / s;
};

// Hertzian dipole for comparison: |E| ∝ sinθ
const hertzPattern = (theta: number): number => Math.abs(Math.sin(theta));

const patternValue = (kind: "half" | "hertz", mode: Mode, t: number): number => {
  const v = kind === "half" ? fieldPattern(t) : hertzPattern(t);
  return mode === "power" ? v * v : v;
};

// ∫0^π cos²((π/2)cosθ)/sinθ dθ  (eq. 13.21), Simpson's rule. ≈ 1.2188
const RAD_INTEGRAL = (() => {
  const n = 2000;
  const h = Math.PI / n;
  const g = (t: number) => {
    const s = Math.sin(t);
    if (s < 1e-9) return 0;
    const c = Math.cos((Math.PI / 2) * Math.cos(t));
    return (c * c) / s;
  };
  let sum = g(0) + g(Math.PI);
  for (let i = 1; i < n; i++) sum += g(i * h) * (i % 2 ? 4 : 2);
  return (sum * h) / 3;
})();

// θ where the field falls to 1/√2 (= half power), found by bisection. ≈ 50.96°
const HP_THETA = (() => {
  let lo = 1e-3;
  let hi = Math.PI / 2;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (fieldPattern(mid) < Math.SQRT1_2) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
})();

const HPBW_DEG = 180 - 2 * ((HP_THETA * 180) / Math.PI);
const R_RAD = 60 * RAD_INTEGRAL; // = 2 P_rad / I0²  (eq. 13.27), ≈ 73 Ω
const DIRECTIVITY = 2 / RAD_INTEGRAL; // 4π U_max / P_rad from eqs. (13.20) and (13.26)

const format = (n: number, digits = 4) =>
  Number.isFinite(n) ? n.toLocaleString(undefined, { maximumSignificantDigits: digits }) : "—";

const wrapDeg = (d: number) => {
  const x = ((d % 360) + 360) % 360;
  return x > 180 ? x - 360 : x;
};

/* ------------------------------ 3D helpers ------------------------------ */

// "jet"-style colormap (0 = dark blue, 1 = dark red)
const clamp = (v: number): number => Math.min(1, Math.max(0, v));
const jet = (t: number): RGB => [
  clamp(1.5 - Math.abs(4 * t - 3)),
  clamp(1.5 - Math.abs(4 * t - 2)),
  clamp(1.5 - Math.abs(4 * t - 1)),
];

const N_THETA = 60;
const N_PHI = 72;
const SCALE = 2; // radius of the pattern at its maximum
const WIRE_HALF = 0.45; // half-length of the drawn dipole (schematic, not to scale)
const N_CURRENT = 48;

function buildPattern(kind: "half" | "hertz", mode: Mode, cutDeg: number) {
  const phiMax = TWO_PI - (cutDeg * Math.PI) / 180; // open wedge = cutDeg
  const pos: number[] = [];
  const col: number[] = [];
  const idx: number[] = [];

  for (let i = 0; i <= N_THETA; i++) {
    const th = (i / N_THETA) * Math.PI;
    const r = patternValue(kind, mode, th);
    const [cr, cg, cb] = jet(r);
    for (let j = 0; j <= N_PHI; j++) {
      const ph = (j / N_PHI) * phiMax;
      pos.push(
        SCALE * r * Math.sin(th) * Math.cos(ph),
        SCALE * r * Math.sin(th) * Math.sin(ph),
        SCALE * r * Math.cos(th),
      );
      col.push(cr, cg, cb);
    }
  }
  for (let i = 0; i < N_THETA; i++) {
    for (let j = 0; j < N_PHI; j++) {
      const a = i * (N_PHI + 1) + j;
      const b = a + N_PHI + 1;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const surface = new THREE.BufferGeometry();
  surface.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  surface.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  surface.setIndex(idx);
  surface.computeVertexNormals();
  return surface;
}

function clearGroup(g: THREE.Group) {
  [...g.children].forEach((o) => {
    o.traverse((n) => {
      const m = n as THREE.Mesh;
      m.geometry?.dispose();
      const mat = m.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else mat?.dispose();
    });
    g.remove(o);
  });
}

function makeLabel(text: string, color: string): THREE.Sprite {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 64;
  const g = c.getContext("2d")!;
  g.font = "bold 40px sans-serif";
  g.fillStyle = color;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(text, 128, 32);
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), depthTest: false, transparent: true }),
  );
  sprite.scale.set(1.2, 0.3, 1);
  return sprite;
}

const dirVec = (thetaDeg: number, phiDeg: number, len: number): V3 => {
  const th = (thetaDeg * Math.PI) / 180;
  const ph = (phiDeg * Math.PI) / 180;
  return [len * Math.sin(th) * Math.cos(ph), len * Math.sin(th) * Math.sin(ph), len * Math.cos(th)];
};

/* ------------------------------ UI pieces ------------------------------ */

function RangeControl(props: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  hint: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="hwd-control">
      <div className="hwd-control__title">
        <label>{props.label}</label>
        <output>{props.display}</output>
      </div>
      <input
        type="range"
        min={props.min}
        max={props.max}
        step={props.step}
        value={props.value}
        onChange={(e) => props.onChange(Number(e.target.value))}
      />
      <div className="hwd-control__hint">Changes: {props.hint}</div>
    </div>
  );
}

/* ------------------------------ component ------------------------------ */

export default function HalfWaveDipoleVisualization() {
  const mountRef = useRef<HTMLDivElement>(null);
  const patternRef = useRef<THREE.Group | null>(null);
  const markerRef = useRef<THREE.Group | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const currentLineRef = useRef<THREE.Line | null>(null);

  const [p, setP] = useState<Params>({ ...DEFAULTS });
  const update = (patch: Partial<Params>) => setP((prev) => ({ ...prev, ...patch }));

  const flags = useRef({ showCurrent: p.showCurrent, animate: p.animate });
  flags.current = { showCurrent: p.showCurrent, animate: p.animate };

  /* ---------- one-time scene setup ---------- */
  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.up.set(0, 0, 1); // z is the dipole axis, like the book
    camera.position.set(5.5, -5.5, 3.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotateSpeed = 1.2;
    controlsRef.current = controls;

    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const sun = new THREE.DirectionalLight(0xffffff, 0.6);
    sun.position.set(4, -3, 6);
    scene.add(sun);

    // axes with labels
    scene.add(new THREE.AxesHelper(3.2));
    const lx = makeLabel("x", "#dc2626");
    lx.position.set(3.6, 0, 0);
    const ly = makeLabel("y", "#16a34a");
    ly.position.set(0, 3.6, 0);
    const lz = makeLabel("z (dipole axis)", "#2563eb");
    lz.position.set(0, 0, 3.6);
    scene.add(lx, ly, lz);

    // the λ/2 dipole with its feed point (schematic length)
    const dipole = new THREE.Group();
    const wire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, WIRE_HALF * 2, 16),
      new THREE.MeshStandardMaterial({ color: 0x111111 }),
    );
    wire.rotation.x = Math.PI / 2;
    const feed = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 20, 20),
      new THREE.MeshStandardMaterial({ color: 0xffffff }),
    );
    dipole.add(wire, feed);
    scene.add(dipole);

    // current distribution I(z) = I0 cos(βz), drawn beside the wire
    const cGeo = new THREE.BufferGeometry();
    cGeo.setAttribute("position", new THREE.Float32BufferAttribute(new Array((N_CURRENT + 1) * 3).fill(0), 3));
    const currentLine = new THREE.Line(cGeo, new THREE.LineBasicMaterial({ color: 0xdc2626 }));
    scene.add(currentLine);
    currentLineRef.current = currentLine;

    const pattern = new THREE.Group();
    const marker = new THREE.Group();
    scene.add(pattern, marker);
    patternRef.current = pattern;
    markerRef.current = marker;

    const resize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    let raf = 0;
    const t0 = performance.now();
    const loop = () => {
      const f = flags.current;
      currentLine.visible = f.showCurrent;
      if (f.showCurrent) {
        const t = f.animate ? (performance.now() - t0) / 1000 : 0;
        const timeFactor = Math.cos(TWO_PI * 0.5 * t); // cos(ωt), slowed down for viewing
        const arr = (currentLine.geometry.getAttribute("position") as THREE.BufferAttribute);
        for (let i = 0; i <= N_CURRENT; i++) {
          const z = -WIRE_HALF + (2 * WIRE_HALF * i) / N_CURRENT;
          const betaZ = (Math.PI / 2) * (z / WIRE_HALF); // βz runs from −π/2 to +π/2
          arr.setXYZ(i, 0.35 * Math.cos(betaZ) * timeFactor, 0, z);
        }
        arr.needsUpdate = true;
      }
      controls.update();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      clearGroup(pattern);
      clearGroup(marker);
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  /* ---------- rebuild pattern + overlays ---------- */
  useEffect(() => {
    const group = patternRef.current;
    if (!group) return;
    clearGroup(group);

    const surface = buildPattern("half", p.mode, p.cut);
    group.add(
      new THREE.Mesh(
        surface,
        new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, roughness: 0.6 }),
      ),
    );
    if (p.grid) {
      group.add(
        new THREE.Mesh(
          surface,
          new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true, transparent: true, opacity: 0.22 }),
        ),
      );
    }
    if (p.showHertz) {
      group.add(
        new THREE.Mesh(
          buildPattern("hertz", p.mode, p.cut),
          new THREE.MeshBasicMaterial({ color: 0x2563eb, wireframe: true, transparent: true, opacity: 0.45 }),
        ),
      );
    }
    if (p.showHPBW) {
      const phiMax = TWO_PI - (p.cut * Math.PI) / 180;
      for (const th of [HP_THETA, Math.PI - HP_THETA]) {
        const rs = SCALE * patternValue("half", p.mode, th);
        const pts: THREE.Vector3[] = [];
        for (let j = 0; j <= 128; j++) {
          const ph = (j / 128) * phiMax;
          pts.push(new THREE.Vector3(rs * Math.sin(th) * Math.cos(ph), rs * Math.sin(th) * Math.sin(ph), rs * Math.cos(th)));
        }
        group.add(
          new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x111111 })),
        );
      }
    }
  }, [p.mode, p.cut, p.grid, p.showHertz, p.showHPBW]);

  /* ---------- observation direction (θ, φ) ---------- */
  useEffect(() => {
    const g = markerRef.current;
    if (!g) return;
    clearGroup(g);
    if (!p.showPoint) return;

    const rs = SCALE * patternValue("half", p.mode, (p.theta * Math.PI) / 180);
    const [x, y, z] = dirVec(p.theta, p.phi, rs);
    const P = new THREE.Vector3(x, y, z);

    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 20, 20),
      new THREE.MeshBasicMaterial({ color: 0x2563eb }),
    );
    dot.position.copy(P);
    g.add(dot);

    // solid ray to the pattern surface = value of the pattern in this direction
    g.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), P]),
        new THREE.LineBasicMaterial({ color: 0x2563eb }),
      ),
    );
    // dashed continuation: P lies far away along this direction
    const [fx, fy, fz] = dirVec(p.theta, p.phi, 3.2);
    const far = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([P, new THREE.Vector3(fx, fy, fz)]),
      new THREE.LineDashedMaterial({ color: 0x2563eb, dashSize: 0.1, gapSize: 0.08 }),
    );
    far.computeLineDistances();
    g.add(far);
    const lp = makeLabel("P", "#2563eb");
    lp.position.set(fx, fy, fz + 0.2);
    lp.scale.set(0.5, 0.125, 1);
    g.add(lp);
  }, [p.theta, p.phi, p.mode, p.showPoint]);

  useEffect(() => {
    if (controlsRef.current) controlsRef.current.autoRotate = p.spin;
  }, [p.spin]);

  /* ---------- numbers shown in the panels ---------- */
  const lambda = C0 / (p.frequency * 1e9);
  const length = lambda / 2;
  const beta = TWO_PI / lambda;
  const rMeters = p.distance * lambda;
  const th = (p.theta * Math.PI) / 180;
  const F = fieldPattern(th);

  // eq. (13.19):  Hφ = j I0 e^{-jβr} cos((π/2)cosθ) / (2π r sinθ),   Eθ = η Hφ
  const hMag = (p.current * F) / (TWO_PI * rMeters);
  const eMag = ETA * hMag;
  const phaseDeg = wrapDeg(90 - (beta * rMeters * 180) / Math.PI); // j · e^{-jβr}
  // eq. (13.20):  S_ave = ½ η |Hφ|²
  const sAve = 0.5 * ETA * hMag * hMag;
  // eq. (13.21)-(13.26):  P_rad = η I0² /(4π) · ∫ ... dθ = 36.56 I0²
  const pRad = ((ETA * p.current ** 2) / (4 * Math.PI)) * RAD_INTEGRAL;

  return (
    <div className="hwd-viz">
      <div className="hwd-viz__layout">
        {/* ---------------- left: scene + readouts ---------------- */}
        <div className="hwd-viz__main">
          <div className="hwd-viz__stage">
            <div ref={mountRef} className="hwd-viz__canvas" aria-label="3D radiation pattern of a half-wave dipole" />
            <div className="hwd-viz__legend">
              <span>{p.mode === "field" ? "Normalized field pattern" : "Normalized power pattern"}</span>
              <div className="hwd-viz__bar" />
              <div className="hwd-viz__ticks">
                <span>1</span>
                <span>0.5</span>
                <span>0</span>
              </div>
            </div>
            <div className="hwd-viz__key">
              <div>Radius of the shape = pattern value in that direction</div>
              {p.showPoint && <div><i style={{ background: "#2563eb" }} /> direction to P</div>}
              {p.showHertz && <div><i style={{ background: "#2563eb", opacity: 0.45 }} /> Hertzian sin θ (comparison)</div>}
              {p.showHPBW && <div><i style={{ background: "#111" }} /> half-power angles</div>}
              {p.showCurrent && <div><i style={{ background: "#dc2626" }} /> current I(z) = I₀ cos βz</div>}
            </div>
          </div>

          <div className="hwd-viz__controls">
            <div className="hwd-viz__seg" role="group" aria-label="Pattern type">
              <button className={p.mode === "field" ? "is-on" : ""} onClick={() => update({ mode: "field" })}>
                Field |E|
              </button>
              <button className={p.mode === "power" ? "is-on" : ""} onClick={() => update({ mode: "power" })}>
                Power |E|²
              </button>
            </div>
            <div className="hwd-viz__seg" role="group" aria-label="Shape">
              <button className={p.cut === 0 ? "is-on" : ""} onClick={() => update({ cut: 0 })}>
                Full donut
              </button>
              <button className={p.cut !== 0 ? "is-on" : ""} onClick={() => update({ cut: 180 })}>
                Hollow cut
              </button>
            </div>
            <label>
              Cut {p.cut}°
              <input type="range" min={0} max={300} step={15} value={p.cut} onChange={(e) => update({ cut: Number(e.target.value) })} />
            </label>
            <label>
              <input type="checkbox" checked={p.grid} onChange={(e) => update({ grid: e.target.checked })} /> Mesh lines
            </label>
            <label>
              <input type="checkbox" checked={p.spin} onChange={(e) => update({ spin: e.target.checked })} /> Auto-rotate
            </label>
          </div>

          <section className="hwd-panel">
            <div className="hwd-panel__head">
              <h2>Far field at observation point P</h2>
              <p>Sadiku eq. (13.19)–(13.20). Peak (phasor) amplitudes, valid for r ≫ l.</p>
            </div>
            <div className="hwd-metrics">
              <div className="hwd-metric">
                <div className="hwd-metric__label">|Hφ|</div>
                <strong>{format(hMag)}</strong>
                <small>A/m · phase {phaseDeg.toFixed(1)}°</small>
              </div>
              <div className="hwd-metric">
                <div className="hwd-metric__label">|Eθ| = η|Hφ|</div>
                <strong>{format(eMag)}</strong>
                <small>V/m · same phase as Hφ</small>
              </div>
              <div className="hwd-metric">
                <div className="hwd-metric__label">P<sub>ave</sub> = ½η|Hφ|²</div>
                <strong>{format(sAve)}</strong>
                <small>W/m²</small>
              </div>
            </div>
            <div className="hwd-row">
              <span>Pattern value at P: F(θ) = cos((π/2)cosθ)/sinθ</span>
              <b>{F.toFixed(3)}</b>
            </div>
            <div className="hwd-row">
              <span>Power pattern F²(θ)</span>
              <b>{(F * F).toFixed(3)}</b>
            </div>
            <div className="hwd-note">
              Eθ and Hφ are in time phase and orthogonal, so Eθ/Hφ = η = 120π ≈ 377 Ω (radiation terms only; the 1/r² and 1/r³
              terms are discarded).
            </div>
          </section>
        </div>

        {/* ---------------- right: controls + derived ---------------- */}
        <aside className="hwd-viz__side">
          <section className="hwd-panel">
            <div className="hwd-panel__head hwd-panel__head--row">
              <div>
                <h2>Simulation controls</h2>
                <p>Each slider lists exactly what it changes.</p>
              </div>
              <button type="button" className="hwd-btn" onClick={() => setP({ ...DEFAULTS })}>
                Reset
              </button>
            </div>

            <RangeControl
              label="Frequency f"
              value={p.frequency}
              min={0.1}
              max={5}
              step={0.1}
              display={`${p.frequency.toFixed(1)} GHz`}
              hint="λ, wire length l = λ/2, β. Not the pattern shape."
              onChange={(v) => update({ frequency: v })}
            />
            <RangeControl
              label="Peak current I₀"
              value={p.current}
              min={0.1}
              max={5}
              step={0.1}
              display={`${p.current.toFixed(1)} A`}
              hint="|Hφ|, |Eθ| ∝ I₀ and P_rad ∝ I₀². Not the shape."
              onChange={(v) => update({ current: v })}
            />
            <RangeControl
              label="Distance r / λ"
              value={p.distance}
              min={2}
              max={100}
              step={1}
              display={`${p.distance} λ`}
              hint="|Hφ|, |Eθ| ∝ 1/r, S ∝ 1/r², phase −βr. Not the shape."
              onChange={(v) => update({ distance: v })}
            />
            <RangeControl
              label="Polar angle θ"
              value={p.theta}
              min={0}
              max={180}
              step={1}
              display={`${p.theta}°`}
              hint="where P is on the pattern, F(θ), and every field value."
              onChange={(v) => update({ theta: v })}
            />
            <RangeControl
              label="Azimuth angle φ"
              value={p.phi}
              min={0}
              max={360}
              step={1}
              display={`${p.phi}°`}
              hint="only the position of P. Nothing else: no φ dependence."
              onChange={(v) => update({ phi: v })}
            />

            <div className="hwd-checks">
              <span>Show</span>
              <label>
                <input type="checkbox" checked={p.showPoint} onChange={(e) => update({ showPoint: e.target.checked })} /> Direction to P
              </label>
              <label>
                <input type="checkbox" checked={p.showHPBW} onChange={(e) => update({ showHPBW: e.target.checked })} /> Half-power angles
              </label>
              <label>
                <input type="checkbox" checked={p.showHertz} onChange={(e) => update({ showHertz: e.target.checked })} /> Compare with Hertzian dipole
              </label>
              <label>
                <input type="checkbox" checked={p.showCurrent} onChange={(e) => update({ showCurrent: e.target.checked })} /> Current distribution
              </label>
              <label>
                <input type="checkbox" checked={p.animate} disabled={!p.showCurrent} onChange={(e) => update({ animate: e.target.checked })} /> Animate current (× cos ωt)
              </label>
            </div>
          </section>

          <section className="hwd-panel">
            <div className="hwd-panel__head">
              <h2>Derived quantities</h2>
              <p>Computed from the equations in Sadiku §13.3.</p>
            </div>
            <div className="hwd-row"><span>Wavelength λ</span><b>{format(lambda)} m</b></div>
            <div className="hwd-row"><span>Dipole length l = λ/2</span><b>{format(length)} m</b></div>
            <div className="hwd-row"><span>Phase constant β</span><b>{format(beta)} rad/m</b></div>
            <div className="hwd-row"><span>Distance r</span><b>{format(rMeters)} m</b></div>
            <div className="hwd-row"><span>∫ cos²((π/2)cosθ)/sinθ dθ  (13.21)</span><b>{RAD_INTEGRAL.toFixed(4)}</b></div>
            <div className="hwd-row"><span>Radiated power P_rad = 36.56 I₀²</span><b>{format(pRad)} W</b></div>
            <div className="hwd-row"><span>Radiation resistance R_rad = 2P_rad/I₀²</span><b>{R_RAD.toFixed(1)} Ω</b></div>
            <div className="hwd-row"><span>Half-power angle θ</span><b>{((HP_THETA * 180) / Math.PI).toFixed(1)}°</b></div>
            <div className="hwd-row"><span>Half-power beamwidth</span><b>{HPBW_DEG.toFixed(1)}°</b></div>
            <div className="hwd-row"><span>Directivity (from 13.20 and 13.26)</span><b>{DIRECTIVITY.toFixed(2)} ({(10 * Math.log10(DIRECTIVITY)).toFixed(2)} dBi)</b></div>
            <div className="hwd-row"><span>Input impedance (text, l = λ/2)</span><b>73 + j42.5 Ω</b></div>
            <div className="hwd-note">
              Compare: a Hertzian dipole of length λ/50 has R_rad = 80π²(dl/λ)² ≈ 0.32 Ω and D = 1.5. The half-wave dipole radiates
              far more power for the same current.
            </div>
          </section>

          <section className="hwd-panel">
            <div className="hwd-panel__head">
              <h2>Key equations</h2>
              <p>Sadiku, Chapter 13</p>
            </div>
            <div className="hwd-eqs">
              <div><b>Current</b><code>I = I₀ cos βz,  −λ/4 ≤ z ≤ λ/4</code></div>
              <div><b>Far field (13.19)</b><code>Hφ = j I₀ e^(−jβr) cos((π/2)cosθ) / (2π r sinθ)</code><code>Eθ = η Hφ</code></div>
              <div><b>Power density (13.20)</b><code>S_ave = η I₀² cos²((π/2)cosθ) / (8π² r² sin²θ)</code></div>
              <div><b>Radiated power (13.26)</b><code>P_rad ≈ 36.56 I₀²</code></div>
              <div><b>Radiation resistance (13.27)</b><code>R_rad = 2P_rad / I₀² ≈ 73 Ω</code></div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}