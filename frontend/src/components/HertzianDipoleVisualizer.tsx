import React, { useEffect, useMemo, useRef, useState } from "react";
import { renderScene } from "./hertzianScene";
import "./HertzianDipoleVisualizer.css";

const C0 = 299792458;
const MU0 = 4 * Math.PI * 1e-7;
const EPS0 = 1 / (MU0 * C0 * C0);
const ETA0 = Math.sqrt(MU0 / EPS0);
const TWO_PI = 2 * Math.PI;

type Complex = { re: number; im: number };

type Params = {
  frequency: number;
  current: number;
  lengthRatio: number;
  distanceRatio: number;
  theta: number;
  phi: number;
  phase: number;
  speed: number;
  playing: boolean;
  showE: boolean;
  showH: boolean;
  buildup: boolean;
};

const multiply = (a: Complex, b: Complex): Complex => ({
  re: a.re * b.re - a.im * b.im,
  im: a.re * b.im + a.im * b.re,
});

const magnitude = (a: Complex) => Math.hypot(a.re, a.im);

const phaseDeg = (a: Complex) => (Math.atan2(a.im, a.re) * 180) / Math.PI;

const format = (n: number, digits = 4) =>
  Number.isFinite(n)
    ? n.toLocaleString(undefined, { maximumSignificantDigits: digits })
    : "—";

/**
 * Analytical Hertzian dipole fields in free space.
 *
 * Time convention: Re{F exp(j omega t)}
 * Source phasor: I0, peak current.
 * All distances supplied to this function are in metres.
 */
function calculateFields(
  current: number,
  length: number,
  frequency: number,
  distance: number,
  theta: number,
) {
  const omega = TWO_PI * frequency;
  const lambda = C0 / frequency;
  const beta = TWO_PI / lambda;
  const r = Math.max(distance, lambda * 1e-8);
  const sinTheta = Math.sin(theta);
  const cosTheta = Math.cos(theta);

  // exp(-j beta r)
  const propagation: Complex = {
    re: Math.cos(beta * r),
    im: -Math.sin(beta * r),
  };

  // H_phi = I0 dl sin(theta)/(4 pi)
  //         * (j beta/r + 1/r^2) exp(-j beta r)
  const hFactor: Complex = {
    re: 1 / (r * r),
    im: beta / r,
  };

  const Hphi = multiply(propagation, {
    re: (current * length * sinTheta * hFactor.re) / (4 * Math.PI),
    im: (current * length * sinTheta * hFactor.im) / (4 * Math.PI),
  });

  // E_r = eta I0 dl cos(theta)/(2 pi)
  //       * (1/r^2 - j/(beta r^3)) exp(-j beta r)
  const erFactor: Complex = {
    re: 1 / (r * r),
    im: -1 / (beta * r * r * r),
  };

  const Er = multiply(propagation, {
    re: (ETA0 * current * length * cosTheta * erFactor.re) / (2 * Math.PI),
    im: (ETA0 * current * length * cosTheta * erFactor.im) / (2 * Math.PI),
  });

  // E_theta = eta I0 dl sin(theta)/(4 pi)
  //           * (j beta/r + 1/r^2 - j/(beta r^3))
  //           * exp(-j beta r)
  const etFactor: Complex = {
    re: 1 / (r * r),
    im: beta / r - 1 / (beta * r * r * r),
  };

  const Etheta = multiply(propagation, {
    re: (ETA0 * current * length * sinTheta * etFactor.re) / (4 * Math.PI),
    im: (ETA0 * current * length * sinTheta * etFactor.im) / (4 * Math.PI),
  });

  return { Er, Etheta, Hphi, lambda, beta, omega, r };
}

function RangeControl({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
  minLabel,
  maxLabel,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (value: number) => void;
  minLabel: string;
  maxLabel: string;
}) {
  return (
    <div className="hd-control">
      <div className="hd-control-title">
        <label>{label}</label>
        <output>{display}</output>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />

      <div className="hd-range">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}

const DEFAULTS: Params = {
  frequency: 1,
  current: 1,
  lengthRatio: 0.02,
  distanceRatio: 1,
  theta: 60,
  phi: 30,
  phase: 0,
  speed: 1,
  playing: true,
  showE: true,
  showH: true,
  buildup: false,
};

const VIEW_OPTIONS = [
  { label: "Both", e: true, h: true },
  { label: "E only", e: true, h: false },
  { label: "H only", e: false, h: true },
];

const HertzianDipoleVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const paramsRef = useRef<Params>(DEFAULTS);
  const timeRef = useRef(0);
  const viewRef = useRef({ az: -1.12, el: 0.35 });
  const dragRef = useRef<{ x: number; y: number } | null>(null);

  const [params, setParams] = useState<Params>({ ...DEFAULTS });

  paramsRef.current = params;

  const update = (patch: Partial<Params>) => {
    setParams((previous) => ({ ...previous, ...patch }));
  };

  const frequency = params.frequency * 1e9;
  const lambda = C0 / frequency;
  const length = params.lengthRatio * lambda;
  const distance = params.distanceRatio * lambda;
  const theta = (params.theta * Math.PI) / 180;

  const fields = useMemo(
    () => calculateFields(params.current, length, frequency, distance, theta),
    [
      params.current,
      params.frequency,
      params.lengthRatio,
      params.distanceRatio,
      params.theta,
    ],
  );

  const erMagnitude = magnitude(fields.Er);
  const etMagnitude = magnitude(fields.Etheta);
  const hMagnitude = magnitude(fields.Hphi);

  const radiationResistance = 80 * Math.PI ** 2 * params.lengthRatio ** 2;

  // I0 is peak current, so average radiated power = 1/2 I0^2 Rrad.
  const radiatedPower = 0.5 * params.current ** 2 * radiationResistance;

  const reset = () => {
    setParams({ ...DEFAULTS });
    timeRef.current = 0;
    viewRef.current = { az: -1.12, el: 0.35 };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let last = performance.now();
    let width = 800;
    let height = 420;

    const resize = () => {
      const rect = wrapper.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(300, Math.floor(rect.width));
      height = Math.max(300, Math.floor(rect.height));
      const pw = Math.round(width * dpr);
      const ph = Math.round(height * dpr);
      if (canvas.width !== pw || canvas.height !== ph) {
        canvas.width = pw;
        canvas.height = ph;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(wrapper);

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const p = paramsRef.current;
      if (p.playing) timeRef.current += dt * p.speed * TWO_PI * 0.35;
      renderScene(ctx, width, height, p, timeRef.current, viewRef.current);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <section className="hd-root">
      <header className="hd-header">
        <div>
          <div className="hd-eyebrow">ELECTROMAGNETICS / ANTENNAS</div>
          <h1>Hertzian Dipole</h1>
          <p>
            Analytical electromagnetic fields of an ideal infinitesimal current
            element in free space.
          </p>
        </div>

        <div className="hd-header-badge">
          <span className="hd-live-dot" />
          ANALYTICAL MODEL
        </div>
      </header>

      <div className="hd-layout">
        <main className="hd-main-column">
          <section className="hd-panel">
            <div className="hd-panel-head">
              <div>
                <h2>Electromagnetic field visualization</h2>
                <p>
                  Drag the canvas to rotate. Field calculations use the selected
                  physical parameters.
                </p>
              </div>

              <div className="hd-legend">
                <span>
                  <i className="hd-dot hd-orange" /> E
                </span>
                <span>
                  <i className="hd-dot hd-cyan" /> H
                </span>
              </div>
            </div>

            <div
              className="hd-toggle-group"
              style={{ display: "inline-flex", marginBottom: 12 }}
            >
              {VIEW_OPTIONS.map((o) => (
                <button
                  key={o.label}
                  type="button"
                  className={
                    params.showE === o.e && params.showH === o.h ? "active" : ""
                  }
                  onClick={() => update({ showE: o.e, showH: o.h })}
                >
                  {o.label}
                </button>
              ))}
            </div>

            <div className="hd-canvas-wrap" ref={wrapperRef}>
              <canvas
                ref={canvasRef}
                aria-label="Interactive Hertzian dipole field visualization"
                onPointerDown={(e) => {
                  dragRef.current = {
                    x: e.clientX,
                    y: e.clientY,
                  };
                  e.currentTarget.setPointerCapture(e.pointerId);
                }}
                onPointerMove={(e) => {
                  if (!dragRef.current) return;

                  const dx = e.clientX - dragRef.current.x;
                  const dy = e.clientY - dragRef.current.y;

                  dragRef.current = {
                    x: e.clientX,
                    y: e.clientY,
                  };

                  viewRef.current.az += dx * 0.008;
                  viewRef.current.el = Math.max(
                    0,
                    Math.min(1.35, viewRef.current.el + dy * 0.006),
                  );
                }}
                onPointerUp={() => {
                  dragRef.current = null;
                }}
                onPointerCancel={() => {
                  dragRef.current = null;
                }}
              />

              <span className="hd-canvas-hint">Drag to rotate</span>
            </div>

            <div className="hd-scene-footer">
              <span>
                Axis: <b>z-directed dipole</b>
              </span>
              <span>
                Time: <b>Re{`{F e^{jωt}}`}</b>
              </span>
              <span>
                Free space: <b>η₀ ≈ 376.73 Ω</b>
              </span>
            </div>

            <div className="hd-phase-actions">
              <button
                type="button"
                onClick={() => update({ playing: !params.playing })}
              >
                {params.playing ? "Pause" : "Play"}
              </button>

              <button
                type="button"
                onClick={() => {
                  timeRef.current = 0;
                  update({ phase: 0 });
                }}
              >
                Restart phase
              </button>

              <label className="hd-speed">
                Speed
                <input
                  type="range"
                  min={0.25}
                  max={2}
                  step={0.25}
                  value={params.speed}
                  onChange={(e) => update({ speed: Number(e.target.value) })}
                />
                <span>{params.speed.toFixed(2)}×</span>
              </label>
            </div>
          </section>

          <section className="hd-panel">
            <div className="hd-panel-head">
              <div>
                <h2>Field at observation point P</h2>
                <p>
                  Phasor amplitudes (peak values) at the selected r, θ and
                  source parameters.
                </p>
              </div>
            </div>

            <div className="hd-metric-grid">
              <div className="hd-metric">
                <div className="hd-metric-label">|Eᵣ|</div>
                <strong>{format(erMagnitude)}</strong>
                <small>V/m · phase {phaseDeg(fields.Er).toFixed(1)}°</small>
              </div>

              <div className="hd-metric">
                <div className="hd-metric-label">|Eθ|</div>
                <strong>{format(etMagnitude)}</strong>
                <small>
                  V/m · phase {phaseDeg(fields.Etheta).toFixed(1)}°
                </small>
              </div>

              <div className="hd-metric">
                <div className="hd-metric-label">|Hφ|</div>
                <strong>{format(hMagnitude)}</strong>
                <small>A/m · phase {phaseDeg(fields.Hphi).toFixed(1)}°</small>
              </div>
            </div>

            <div className="hd-note">
              These are the peak amplitudes of the phasors. The actual field at
              any instant is Re{`{E e^{jωt}}`}, which swings between −|E| and
              +|E|.
            </div>

            <div className="hd-derived-row">
              <span>|Eθ| / |Hφ|</span>
              <b>{format(etMagnitude / Math.max(hMagnitude, 1e-30))} Ω</b>
            </div>

            <div className="hd-note">
              This ratio approaches η₀ in the far field; it is not generally
              equal to η₀ in the near field.
            </div>
          </section>
        </main>

        <aside className="hd-controls-column">
          <section className="hd-panel hd-controls">
            <div className="hd-panel-head">
              <div>
                <h2>Simulation controls</h2>
                <p>Adjust a parameter to update the calculations.</p>
              </div>

              <button type="button" className="hd-reset" onClick={reset}>
                Reset
              </button>
            </div>

            <RangeControl
              label="Frequency f"
              value={params.frequency}
              min={0.1}
              max={5}
              step={0.1}
              display={`${params.frequency.toFixed(1)} GHz`}
              minLabel="0.1 GHz"
              maxLabel="5 GHz"
              onChange={(v) => update({ frequency: v })}
            />

            <RangeControl
              label="Peak current I₀"
              value={params.current}
              min={0.1}
              max={5}
              step={0.1}
              display={`${params.current.toFixed(1)} A`}
              minLabel="0.1 A"
              maxLabel="5 A"
              onChange={(v) => update({ current: v })}
            />

            <RangeControl
              label="Element length dl / λ"
              value={params.lengthRatio}
              min={0.001}
              max={0.1}
              step={0.001}
              display={params.lengthRatio.toFixed(3)}
              minLabel="0.001 λ"
              maxLabel="0.1 λ"
              onChange={(v) => update({ lengthRatio: v })}
            />

            <RangeControl
              label="Distance r / λ"
              value={params.distanceRatio}
              min={0.05}
              max={10}
              step={0.05}
              display={`${params.distanceRatio.toFixed(2)} λ`}
              minLabel="0.05 λ"
              maxLabel="10 λ"
              onChange={(v) => update({ distanceRatio: v })}
            />

            <RangeControl
              label="Polar angle θ"
              value={params.theta}
              min={0}
              max={180}
              step={1}
              display={`${params.theta}°`}
              minLabel="0°"
              maxLabel="180°"
              onChange={(v) => update({ theta: v })}
            />

            <RangeControl
              label="Azimuth angle φ"
              value={params.phi}
              min={0}
              max={360}
              step={1}
              display={`${params.phi}°`}
              minLabel="0°"
              maxLabel="360°"
              onChange={(v) => update({ phi: v })}
            />

            <RangeControl
              label="Source phase (animation)"
              value={params.phase}
              min={0}
              max={360}
              step={1}
              display={`${params.phase}°`}
              minLabel="0°"
              maxLabel="360°"
              onChange={(v) => update({ phase: v })}
            />

            <div className="hd-visibility">
              <span>Visible quantities</span>

              <label>
                <input
                  type="checkbox"
                  checked={params.showE}
                  onChange={(e) => update({ showE: e.target.checked })}
                />
                Electric field E
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={params.showH}
                  onChange={(e) => update({ showH: e.target.checked })}
                />
                Magnetic field H
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={params.buildup}
                  onChange={(e) => update({ buildup: e.target.checked })}
                />
                Wave start-up transient
              </label>
            </div>
          </section>

          <section className="hd-panel">
            <div className="hd-panel-head">
              <div>
                <h2>Derived quantities</h2>
                <p>Calculated from the selected parameters.</p>
              </div>
            </div>

            <div className="hd-derived-row">
              <span>Wavelength λ</span>
              <b>{format(lambda)} m</b>
            </div>

            <div className="hd-derived-row">
              <span>Phase constant β</span>
              <b>{format(fields.beta)} rad/m</b>
            </div>

            <div className="hd-derived-row">
              <span>Angular frequency ω</span>
              <b>{format(fields.omega)} rad/s</b>
            </div>

            <div className="hd-derived-row">
              <span>Physical length dl</span>
              <b>{format(length)} m</b>
            </div>

            <div className="hd-derived-row">
              <span>Physical distance r</span>
              <b>{format(distance)} m</b>
            </div>

            <div className="hd-derived-row">
              <span>Electrical distance βr</span>
              <b>{format(fields.beta * distance)}</b>
            </div>

            <div className="hd-derived-row">
              <span>Radiation resistance</span>
              <b>{format(radiationResistance)} Ω</b>
            </div>

            <div className="hd-derived-row">
              <span>Average radiated power</span>
              <b>{format(radiatedPower)} W</b>
            </div>

            <div className="hd-derived-row">
              <span>Normalized power pattern</span>
              <b>{format(Math.sin(theta) ** 2)}</b>
            </div>

            <div className="hd-note">
              The short-dipole approximation assumes dl is much smaller than λ.
              This control is limited to dl/λ ≤ 0.1.
            </div>
          </section>

          <section className="hd-panel">
            <div className="hd-panel-head">
              <div>
                <h2>Field equations</h2>
                <p>Free space · eʲωᵗ convention</p>
              </div>
            </div>

            <div className="hd-equation-list">
              <div>
                <span className="hd-eq-name">Magnetic field</span>
                <code>Hφ = I₀dl sinθ/(4π) · (jβ/r + 1/r²)e⁻ʲᵝʳ</code>
                <span className="hd-eq-terms">
                  Induction and radiation terms
                </span>
              </div>

              <div>
                <span className="hd-eq-name">Radial electric field</span>
                <code>Eᵣ = η₀I₀dl cosθ/(2π) · (1/r² − j/(βr³))e⁻ʲᵝʳ</code>
                <span className="hd-eq-terms">
                  Reactive and induction terms
                </span>
              </div>

              <div>
                <span className="hd-eq-name">Polar electric field</span>
                <code>
                  Eθ = η₀I₀dl sinθ/(4π) · (jβ/r + 1/r² − j/(βr³))e⁻ʲᵝʳ
                </code>
                <span className="hd-eq-terms">
                  Reactive, induction, and radiation terms
                </span>
              </div>
            </div>

            <div className="hd-equation-foot">
              Far field: |Eθ| / |Hφ| → η₀ ≈ 376.73 Ω
              <br />
              Rrad = 80π²(dl/λ)²
              <br />
              Prad = ½ I₀²Rrad
            </div>
          </section>
        </aside>
      </div>

      <footer className="hd-footer">
        Ideal Hertzian dipole in free space. The numerical readouts use
        analytical field equations. The canvas is a qualitative visualization,
        not a full-wave numerical electromagnetic solver.
      </footer>
    </section>
  );
};

export default HertzianDipoleVisualizer;