import React, { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Line as DreiLine, Html } from "@react-three/drei";
import * as THREE from "three";

/**
 * Waves Lab — Bigger visual + Play/Pause
 * Modules:
 *  1) EM plane wave (E–H–k, polarization)
 *  2) Standing wave (nodes/antinodes)
 *  3) Longitudinal wave (compression/rarefaction)
 *  4) Attenuated traveling wave (lossy medium)
 */

function Axes({ size = 2.2 }: { size?: number }) {
  return <axesHelper args={[size]} />;
}

function GroundGrid() {
  return <gridHelper args={[24, 24, "#334155", "#1f2937"]} position={[0, -0.001, 0]} />;
}

function Arrow({
  from = new THREE.Vector3(0, 0, 0),
  dir = new THREE.Vector3(1, 0, 0),
  color = "#ffffff",
  length = 1,
  headLength = 0.2,
  headWidth = 0.12,
}: {
  from?: THREE.Vector3;
  dir?: THREE.Vector3;
  color?: THREE.ColorRepresentation;
  length?: number;
  headLength?: number;
  headWidth?: number;
}) {
  const arrow = useMemo(
    () =>
      new THREE.ArrowHelper(
        dir.clone().normalize(),
        from.clone(),
        length,
        new THREE.Color(color).getHex(),
        headLength,
        headWidth
      ),
    [from.x, from.y, from.z, dir.x, dir.y, dir.z, length, color, headLength, headWidth]
  );
  return <primitive object={arrow} />;
}

/* ------------------------- Module 1: EM Plane Wave ------------------------- */

function EMPlaneWave({
  freq,
  k,
  E0,
  eta,
  pol,
  paused,
}: {
  freq: number;
  k: number;
  E0: number;
  eta: number;
  pol: "linear" | "circular" | "elliptical";
  paused: boolean;
}) {
  const timeRef = useRef(0);
  useFrame((_, d) => {
    if (!paused) timeRef.current += d;
  });
  const omega = 2 * Math.PI * freq;

  const zSamples = useMemo(() => {
    const arr: number[] = [];
    for (let z = -7.5; z <= 7.5; z += 0.5) arr.push(z);
    return arr;
  }, []);

  const [Ex0, Ey0, delta] = useMemo(() => {
    switch (pol) {
      case "linear":
        return [E0, 0, 0];
      case "circular":
        return [E0, E0, Math.PI / 2];
      case "elliptical":
        return [E0, 0.5 * E0, Math.PI / 3];
      default:
        return [E0, 0, 0];
    }
  }, [E0, pol]);

  return (
    <group>
      <GroundGrid />
      <Axes size={3.2} />
      <Arrow from={new THREE.Vector3(0, 0, -6.5)} dir={new THREE.Vector3(0, 0, 1)} color="#22c55e" length={1.4} />
      <Text position={[0, 0.35, -5.6]} fontSize={0.36} color="#ffffff" anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor="#000">
        k (+z)
      </Text>

      {zSamples.map((z) => (
        <EMTriadAtZ
          key={z}
          z={z}
          timeRef={timeRef}
          omega={omega}
          k={k}
          Ex0={Ex0}
          Ey0={Ey0}
          delta={delta}
          eta={eta}
        />
      ))}

      <PolarizationPad timeRef={timeRef} omega={omega} Ex0={Ex0} Ey0={Ey0} delta={delta} paused={paused} />
      <Html position={[0, 3.2, -7.2]} transform sprite style={{ pointerEvents: "none" }}>
        <div style={legendBox}>
          <div style={legendTitleDark}>EM Plane Wave</div>
          <div>• <b>E</b> ⟂ <b>H</b> ⟂ <b>k</b> (transverse)</div>
          <div>• <b>S</b> = <b>E</b> × <b>H</b> → +z</div>
          <div>• Polarization via Ex/Ey phase</div>
        </div>
      </Html>
    </group>
  );
}

function EMTriadAtZ({
  z,
  timeRef,
  omega,
  k,
  Ex0,
  Ey0,
  delta,
  eta,
}: {
  z: number;
  timeRef: React.MutableRefObject<number>;
  omega: number;
  k: number;
  Ex0: number;
  Ey0: number;
  delta: number;
  eta: number;
}) {
  const eAH = useMemo(
    () => new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, z), 1.2, 0xef4444, 0.18, 0.1),
    [z]
  );
  const hAH = useMemo(
    () => new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, z), 1.2, 0x3b82f6, 0.18, 0.1),
    [z]
  );
  const sAH = useMemo(
    () => new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, z), 1.2, 0x22c55e, 0.18, 0.1),
    [z]
  );

  useFrame(() => {
    const t = timeRef.current;
    const phase = omega * t - k * z;
    const Ex = Ex0 * Math.sin(phase);
    const Ey = Ey0 * Math.sin(phase + delta);

    const Evec = new THREE.Vector3(Ex, Ey, 0);
    const Emag = Math.max(0.02, Evec.length());
    eAH.setDirection(Evec.length() === 0 ? new THREE.Vector3(1, 0, 0) : Evec.clone().normalize());
    eAH.setLength(Emag, Math.max(0.06, Emag * 0.25), Math.max(0.06, Emag * 0.15));

    // H = (1/η) k̂ × E ; k̂=+z → (-Ey, Ex, 0)/η
    const Hvec = new THREE.Vector3(-Ey / Math.max(1e-9, eta), Ex / Math.max(1e-9, eta), 0);
    const Hmag = Math.max(0.02, Hvec.length());
    hAH.setDirection(Hvec.length() === 0 ? new THREE.Vector3(0, 1, 0) : Hvec.clone().normalize());
    hAH.setLength(Hmag, Math.max(0.06, Hmag * 0.25), Math.max(0.06, Hmag * 0.15));

    const S = (Evec.length() ** 2) / Math.max(1e-9, eta);
    const Smag = Math.max(0.02, S);
    sAH.setDirection(new THREE.Vector3(0, 0, 1));
    sAH.setLength(Smag * 0.6, Math.max(0.06, Smag * 0.15), Math.max(0.06, Smag * 0.1));
  });

  return (
    <group>
      <primitive object={eAH} />
      <primitive object={hAH} />
      <primitive object={sAH} />
      <mesh position={[0, 0, z]}>
        <sphereGeometry args={[0.024, 10, 10]} />
        <meshStandardMaterial color="#0ea5e9" />
      </mesh>
    </group>
  );
}

function PolarizationPad({
  timeRef,
  omega,
  Ex0,
  Ey0,
  delta,
  paused,
}: {
  timeRef: React.MutableRefObject<number>;
  omega: number;
  Ex0: number;
  Ey0: number;
  delta: number;
  paused: boolean;
}) {
  const trail = useRef<THREE.Vector3[]>([]);
  const maxTrail = 200;
  const [, setTick] = useState(0);

  useFrame(() => {
    if (paused) return;
    const t = timeRef.current;
    const phase = omega * t;
    const Ex = Ex0 * Math.sin(phase);
    const Ey = Ey0 * Math.sin(phase + delta);
    const p = new THREE.Vector3(Ex, Ey, 0);
    trail.current.push(p);
    if (trail.current.length > maxTrail) trail.current.shift();
    setTick((s) => (s + 1) % 1_000_000);
  });

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]}>
        <planeGeometry args={[3.4, 3.4, 10, 10]} />
        <meshBasicMaterial color="#0b1220" wireframe opacity={0.35} transparent />
      </mesh>
      {trail.current.length > 1 && <DreiLine points={trail.current} color="#fbbf24" lineWidth={1.8} dashed={false} />}
      {trail.current.length > 0 && (
        <mesh position={trail.current[trail.current.length - 1]}>
          <sphereGeometry args={[0.05, 18, 18]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.45} />
        </mesh>
      )}
      <Text position={[1.95, 0.06, 0]} fontSize={0.22} color="#ffffff" anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor="#000">
        E-tip (x–y)
      </Text>
    </group>
  );
}

/* ------------------------- Module 2: Standing Wave ------------------------- */

function StandingWave({ A, k, freq, paused }: { A: number; k: number; freq: number; paused: boolean }) {
  const timeRef = useRef(0);
  useFrame((_, d) => {
    if (!paused) timeRef.current += d;
  });
  const omega = 2 * Math.PI * freq;

  const zMin = -8;
  const zMax = 8;
  const N = 300;

  const nodes = useMemo(() => {
    const arr: number[] = [];
    for (let n = -20; n <= 20; n++) {
      const z = ((2 * n + 1) * Math.PI) / (2 * k);
      if (z >= zMin && z <= zMax) arr.push(z);
    }
    return arr;
  }, [k]);

  const points = useRef<THREE.Vector3[]>([]);
  const [, setTick] = useState(0);

  useFrame(() => {
    if (paused) return;
    const t = timeRef.current;
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < N; i++) {
      const z = zMin + (i / (N - 1)) * (zMax - zMin);
      const y = 2 * A * Math.sin(omega * t) * Math.cos(k * z);
      pts.push(new THREE.Vector3(0, y, z));
    }
    points.current = pts;
    setTick((s) => (s + 1) % 1_000_000);
  });

  return (
    <group>
      <Axes size={3.2} />
      <GroundGrid />
      {points.current.length > 1 && <DreiLine points={points.current} color="#14b8a6" lineWidth={2.2} />}
      {nodes.map((z) => (
        <mesh key={z} position={[0, 0, z]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
      ))}
      <Html position={[0, 3.0, -8.2]} transform sprite style={{ pointerEvents: "none" }}>
        <div style={legendBox}>
          <div style={legendTitleDark}>Standing Wave</div>
          <div>Nodes (red): y = 0 for all t</div>
          <div>Antinodes at |cos(kz)| = 1</div>
          <div>y(z,t) = 2A sin(ωt) cos(kz)</div>
        </div>
      </Html>
    </group>
  );
}

/* ------------------------- Module 3: Longitudinal Wave ------------------------- */

function LongitudinalWave({ A, k, freq, paused }: { A: number; k: number; freq: number; paused: boolean }) {
  const timeRef = useRef(0);
  useFrame((_, d) => {
    if (!paused) timeRef.current += d;
  });
  const omega = 2 * Math.PI * freq;

  const zSamples = useMemo(() => {
    const arr: number[] = [];
    for (let z = -8; z <= 8; z += 0.4) arr.push(z);
    return arr;
  }, []);

  return (
    <group>
      <Axes size={3.2} />
      <GroundGrid />
      {zSamples.map((z) => (
        <LongitudinalParticle key={z} z={z} A={A} omega={omega} k={k} timeRef={timeRef} paused={paused} />
      ))}
      <Html position={[0, 3.0, -8.2]} transform sprite style={{ pointerEvents: "none" }}>
        <div style={legendBox}>
          <div style={legendTitleDark}>Longitudinal Wave</div>
          <div>Compression / rarefaction along z</div>
          <div>Particle displacement ∥ propagation</div>
        </div>
      </Html>
    </group>
  );
}

function LongitudinalParticle({
  z,
  A,
  omega,
  k,
  timeRef,
  paused,
}: {
  z: number;
  A: number;
  omega: number;
  k: number;
  timeRef: React.MutableRefObject<number>;
  paused: boolean;
}) {
  const sphereRef = useRef<THREE.Mesh>(null!);
  const arrow = useMemo(
    () => new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, z), 0.6, 0x93c5fd, 0.14, 0.1),
    [z]
  );

  useFrame(() => {
    const t = timeRef.current;
    const disp = A * Math.sin(omega * t - k * z);
    const vel = A * omega * Math.cos(omega * t - k * z);
    const pos = new THREE.Vector3(0, 0, z + disp);

    sphereRef.current.position.copy(pos);
    const density = 0.5 + 0.5 * Math.cos(omega * t - k * (z + 0.18));
    const s = 0.25 + 0.25 * density;
    sphereRef.current.scale.setScalar(0.2 + s);
    (sphereRef.current.material as THREE.MeshStandardMaterial).color.set(
      new THREE.Color().setHSL(0.58, 0.7, 0.35 + 0.3 * (1 - density))
    );

    const vdir = new THREE.Vector3(0, 0, Math.sign(vel) || 1);
    arrow.setDirection(vdir);
    arrow.position.set(0, 0, z);
    arrow.setLength(Math.max(0.05, Math.abs(vel) * 0.07), 0.09, 0.06);
  });

  return (
    <group>
      <primitive object={arrow} />
      <mesh ref={sphereRef}>
        <sphereGeometry args={[0.14, 18, 18]} />
        <meshStandardMaterial color="#60a5fa" />
      </mesh>
    </group>
  );
}

/* ------------------------- Module 4: Attenuated Traveling Wave ------------------------- */

function AttenuatedWave({
  A,
  k,
  alpha,
  freq,
  paused,
}: {
  A: number;
  k: number;
  alpha: number;
  freq: number;
  paused: boolean;
}) {
  const timeRef = useRef(0);
  useFrame((_, d) => {
    if (!paused) timeRef.current += d;
  });
  const omega = 2 * Math.PI * freq;

  const zMin = 0;
  const zMax = 12;
  const N = 320;

  const pts = useRef<THREE.Vector3[]>([]);
  const [, setTick] = useState(0);

  useFrame(() => {
    if (paused) return;
    const t = timeRef.current;
    const arr: THREE.Vector3[] = [];
    for (let i = 0; i < N; i++) {
      const z = zMin + (i / (N - 1)) * (zMax - zMin);
      const env = Math.exp(-alpha * z);
      const y = A * env * Math.sin(omega * t - k * z);
      arr.push(new THREE.Vector3(0, y, z));
    }
    pts.current = arr;
    setTick((s) => (s + 1) % 1_000_000);
  });

  const envPos: THREE.Vector3[] = useMemo(() => {
    const arr: THREE.Vector3[] = [];
    for (let i = 0; i < N; i++) {
      const z = zMin + (i / (N - 1)) * (zMax - zMin);
      const env = Math.exp(-alpha * z);
      arr.push(new THREE.Vector3(0, A * env, z));
    }
    return arr;
  }, [A, alpha]);

  const envNeg: THREE.Vector3[] = useMemo(() => envPos.map((p) => p.clone().multiplyScalar(-1)), [envPos]);

  return (
    <group>
      <Axes size={3.2} />
      <GroundGrid />
      {pts.current.length > 1 && <DreiLine points={pts.current} color="#f472b6" lineWidth={2.2} />}
      <DreiLine points={envPos} color="#f59e0b" lineWidth={1.2} />
      <DreiLine points={envNeg} color="#f59e0b" lineWidth={1.2} />
      <Html position={[0, 3.0, 0]} transform sprite style={{ pointerEvents: "none" }}>
        <div style={legendBox}>
          <div style={legendTitleDark}>Attenuated Traveling Wave</div>
          <div>E(z,t) = A e<sup>-αz</sup> sin(ωt − kz)</div>
          <div>Amplitude decays with α</div>
        </div>
      </Html>
    </group>
  );
}

/* ------------------------- Main exported component ------------------------- */

export default function WavesLab(): JSX.Element {
  const [moduleKey, setModuleKey] = useState<"em" | "standing" | "longitudinal" | "attenuated">("em");
  const [paused, setPaused] = useState(false);

  // Shared knobs
  const [freq, setFreq] = useState(1.0);
  const [k, setK] = useState(2.0);

  // EM specific
  const [E0, setE0] = useState(1.2);
  const [eta, setEta] = useState(377);
  const [pol, setPol] = useState<"linear" | "circular" | "elliptical">("linear");

  // Standing
  const [Astand, setAstand] = useState(0.8);

  // Longitudinal
  const [Along, setAlong] = useState(0.6);

  // Attenuation
  const [Aatt, setAatt] = useState(1.0);
  const [alpha, setAlpha] = useState(0.18);

  // Spacebar toggles pause
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setPaused((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div style={{ width: "100%", maxWidth: 1400, margin: "0 auto", padding: 12 }}>
      <Header />
      <ControlsBar>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <label style={label}>
            Module:
            <select value={moduleKey} onChange={(e) => setModuleKey(e.target.value as any)} style={select}>
              <option value="em">EM Plane Wave (E–H–k, Polarization)</option>
              <option value="standing">Standing Wave (Nodes/Antinodes)</option>
              <option value="longitudinal">Longitudinal Wave (Compression)</option>
              <option value="attenuated">Attenuated Traveling Wave</option>
            </select>
          </label>

          <label style={label}>
            f (Hz)
            <input type="range" min={0.2} max={3} step={0.05} value={freq} onChange={(e) => setFreq(+e.target.value)} />
            <span style={valueTag}>{freq.toFixed(2)}</span>
          </label>

          <label style={label}>
            k (rad/m)
            <input type="range" min={0.5} max={6} step={0.1} value={k} onChange={(e) => setK(+e.target.value)} />
            <span style={valueTag}>{k.toFixed(2)}</span>
          </label>

          {moduleKey === "em" && (
            <>
              <label style={label}>
                E0
                <input type="range" min={0.2} max={2.5} step={0.05} value={E0} onChange={(e) => setE0(+e.target.value)} />
                <span style={valueTag}>{E0.toFixed(2)}</span>
              </label>
              <label style={label}>
                η
                <input type="number" value={eta} onChange={(e) => setEta(+e.target.value || 377)} style={{ width: 96, marginLeft: 6 }} />
              </label>
              <label style={label}>
                Polarization
                <select value={pol} onChange={(e) => setPol(e.target.value as any)} style={select}>
                  <option value="linear">Linear</option>
                  <option value="circular">Circular</option>
                  <option value="elliptical">Elliptical</option>
                </select>
              </label>
            </>
          )}

          {moduleKey === "standing" && (
            <label style={label}>
              Amplitude A
              <input type="range" min={0.2} max={1.8} step={0.05} value={Astand} onChange={(e) => setAstand(+e.target.value)} />
              <span style={valueTag}>{Astand.toFixed(2)}</span>
            </label>
          )}

          {moduleKey === "longitudinal" && (
            <label style={label}>
              Amplitude A
              <input type="range" min={0.2} max={1.5} step={0.05} value={Along} onChange={(e) => setAlong(+e.target.value)} />
              <span style={valueTag}>{Along.toFixed(2)}</span>
            </label>
          )}

          {moduleKey === "attenuated" && (
            <>
              <label style={label}>
                Amplitude A
                <input type="range" min={0.2} max={2} step={0.05} value={Aatt} onChange={(e) => setAatt(+e.target.value)} />
                <span style={valueTag}>{Aatt.toFixed(2)}</span>
              </label>
              <label style={label}>
                α (Np/m)
                <input type="range" min={0} max={0.6} step={0.01} value={alpha} onChange={(e) => setAlpha(+e.target.value)} />
                <span style={valueTag}>{alpha.toFixed(2)}</span>
              </label>
            </>
          )}
        </div>

        {/* Play/Pause button */}
        <button
          onClick={() => setPaused((p) => !p)}
          title="Spacebar also toggles"
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            border: "1px solid #1f2937",
            background: paused ? "rgba(34,197,94,0.18)" : "rgba(239,68,68,0.18)",
            color: "#e5e7eb",
            cursor: "pointer",
            fontSize: 14,
            minWidth: 110,
          }}
        >
          {paused ? "▶ Play" : "⏸ Pause"}
        </button>
      </ControlsBar>

      <div style={{ border: "1px solid #e6e6e6", borderRadius: 14, overflow: "hidden" }}>
        <Canvas
          style={{ height: 680, background: "linear-gradient(#0b1220, #0b1220)" }}
          camera={{ position: [6.6, 4.2, 12.8], fov: 52 }}
        >
          <ambientLight intensity={0.75} />
          <directionalLight position={[12, 12, 12]} intensity={0.95} />
          <OrbitControls enablePan enableZoom enableRotate />

          {moduleKey === "em" && <EMPlaneWave freq={freq} k={k} E0={E0} eta={eta} pol={pol} paused={paused} />}
          {moduleKey === "standing" && <StandingWave A={Astand} k={k} freq={freq} paused={paused} />}
          {moduleKey === "longitudinal" && <LongitudinalWave A={Along} k={k} freq={freq} paused={paused} />}
          {moduleKey === "attenuated" && <AttenuatedWave A={Aatt} k={k} alpha={alpha} freq={freq} paused={paused} />}

          <Text position={[0, 3.4, -8.4]} fontSize={0.34} color="#ffffff" anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor="#000">
            z (propagation)
          </Text>
        </Canvas>
      </div>
    </div>
  );
}

/* ------------------------- UI bits ------------------------- */

function Header() {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: -0.3, color: "#000" }}>
        Waves in General — Visual Lab
      </div>
      <div style={{ color: "#e5e7eb", fontSize: 15 }}>
        Explore transverse EM waves (E–H–k), polarization, standing waves, longitudinal waves, and attenuation.
      </div>
    </div>
  );
}

function ControlsBar({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        marginBottom: 12,
        border: "1px solid #1f2937",
        background: "rgba(2,6,23,0.6)",
        color: "#e5e7eb",
        borderRadius: 14,
        padding: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      {children}
    </div>
  );
}

const label: React.CSSProperties = {
  fontSize: 14,
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
};

const valueTag: React.CSSProperties = {
  marginLeft: 6,
  fontSize: 12,
  padding: "2px 6px",
  borderRadius: 6,
  background: "rgba(148,163,184,0.15)",
  border: "1px solid rgba(148,163,184,0.3)",
};

const select: React.CSSProperties = {
  marginLeft: 6,
  height: 30,
  borderRadius: 10,
  background: "rgba(2,6,23,0.8)",
  color: "#e5e7eb",
  border: "1px solid #1f2937",
  padding: "0 10px",
  fontSize: 14,
};

const legendBox: React.CSSProperties = {
  background: "rgba(255,255,255,0.95)", // brighter card for readability on any theme
  color: "#0b1220",
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #cbd5e1",
  boxShadow: "0 8px 18px rgba(0,0,0,0.25)",
  fontSize: 13,
  minWidth: 240,
};

const legendTitleDark: React.CSSProperties = { marginBottom: 6, fontWeight: 900, color: "#000" };
