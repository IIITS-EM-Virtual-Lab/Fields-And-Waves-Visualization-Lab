import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * PlaneWaveExplainer — crisp, pedagogical 2D SVG model
 * - E(z,t) along x̂, H(z,t) along ŷ, propagation +ẑ
 * - Lossless or lossy (α, θη) with |η|
 * - Probe at z* with live readout
 * - Phasor wheel showing H lag
 *
 * No three.js; pure SVG so labels & axes stay crystal clear.
 */

type Knobs = {
  E0: number;      // V/m
  f: number;       // Hz
  etaMag: number;  // |η| in Ω
  etaPhase: number;// θη in deg
  alpha: number;   // Np/m
  eps: number;     // F/m
  mu: number;      // H/m
};

const WIDTH = 980;
const HEIGHT = 480;
const PAD = { l: 80, r: 280, t: 36, b: 52 }; // extra right space for panels
const VIEW_W = WIDTH - PAD.l - PAD.r;
const VIEW_H = HEIGHT - PAD.t - PAD.b;

function deg2rad(d: number) { return (d * Math.PI) / 180; }
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

export default function PlaneWaveExplainer(): JSX.Element {
  const [k, setK] = useState<Knobs>({
    E0: 50,
    f: 1e9,
    etaMag: 377,
    etaPhase: 0,
    alpha: 0.0,
    eps: 8.854e-12,
    mu: 4e-7 * Math.PI,
  });
  const [lossy, setLossy] = useState<boolean>(false);
  const [zProbe, setZProbe] = useState<number>(0.5); // meters (mapped to view)
  const [paused, setPaused] = useState<boolean>(false);

  const omega = 2 * Math.PI * k.f;
  const beta = omega * Math.sqrt(k.eps * k.mu);
  const theta = deg2rad(lossy ? k.etaPhase : 0);
  const alpha = lossy ? k.alpha : 0;

  // z range shown in the plot (meters)
  const zMax = 2.0; // 2 m span
  const zMin = 0.0;

  // time
  const tRef = useRef(0);
  useEffect(() => {
    let af: number;
    const loop = (now: number) => {
      // keep animation pleasantly slow regardless of GHz frequency
      tRef.current = now * 0.001; // seconds
      af = requestAnimationFrame(loop);
    };
    if (!paused) af = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(af);
  }, [paused]);

  // scale helpers
  const z2x = (z: number) => PAD.l + (z - zMin) * (VIEW_W / (zMax - zMin));
  const val2y = (v: number) => {
    // vertical midline for E/H plot
    const mid = PAD.t + VIEW_H * 0.55;
    const scale = VIEW_H * 0.3; // visual scale
    return mid - v * scale;
  };

  // generate polyline paths for E and H each frame
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setTick((s) => s + 1), 30);
    return () => clearInterval(id);
  }, [paused]);

  // normalized amplitude so it never becomes a "red wall"
  const eNorm = clamp(k.E0 / 100, 0.15, 2.0);

  const { ePath, hPath, sArrows } = useMemo(() => {
    const n = 500;
    let ePts = "";
    let hPts = "";
    const arrows: Array<{ x: number; y: number; dir: 1 | -1; len: number }> = [];
    for (let i = 0; i <= n; i++) {
      const z = zMin + (i / n) * (zMax - zMin);
      const env = Math.exp(-alpha * z);
      const phase = omega * tRef.current - beta * z;
      const Ex = eNorm * env * Math.cos(phase);
      const Hy = (k.E0 / Math.max(1e-9, k.etaMag)) * env * Math.cos(phase - theta);
      const x = z2x(z);
      const yE = val2y(Ex);
      const yH = val2y(Hy);
      ePts += `${x},${yE} `;
      hPts += `${x},${yH} `;

      // S = E*H along ±z -> draw little green arrows above the axis at a coarse stride
      if (i % 40 === 0) {
        const S = Ex * Hy;
        arrows.push({
          x,
          y: val2y(0) - 24,
          dir: S >= 0 ? 1 : -1,
          len: clamp(Math.abs(S) * 40, 8, 50),
        });
      }
    }
    return { ePath: ePts.trim(), hPath: hPts.trim(), sArrows: arrows };
  }, [tick, alpha, beta, eNorm, k.E0, k.etaMag, theta]);

  // probe readout at z*
  const envP = Math.exp(-alpha * zProbe);
  const phaseP = omega * tRef.current - beta * zProbe;
  const ExP = k.E0 * envP * Math.cos(phaseP);
  const HyP = (k.E0 / Math.max(1e-9, k.etaMag)) * envP * Math.cos(phaseP - theta);
  const Sinst = ExP * HyP;
  const Savg = (k.E0 * k.E0) / (2 * Math.max(1e-9, k.etaMag)) * Math.exp(-2 * alpha * zProbe) * Math.cos(theta);

  // phasor wheel positions
  const phR = 40;
  const cx = WIDTH - PAD.r / 2;
  const cy = PAD.t + 95;

  const hAng = -theta; // H lags E by θ (clockwise)

  return (
    <div style={{ width: "100%", maxWidth: 1100, margin: "0 auto" }}>
      {/* Controls */}
      <div style={{
        display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10,
        border: "1px solid #e5e7eb", borderRadius: 12, padding: 10, marginBottom: 8
      }}>
        <label>Mode:</label>
        <button onClick={() => setLossy(false)} style={{
          padding: "6px 10px", borderRadius: 8, border: "1px solid #cbd5e1",
          background: lossy ? "#fff" : "#e0f2fe", fontWeight: 700
        }}>Lossless</button>
        <button onClick={() => setLossy(true)} style={{
          padding: "6px 10px", borderRadius: 8, border: "1px solid #cbd5e1",
          background: lossy ? "#fee2e2" : "#fff", fontWeight: 700
        }}>Lossy</button>

        <Knob label="E₀ (V/m)" value={k.E0} min={1} max={300} step={1} onChange={(v)=>setK(s=>({...s,E0:v}))} />
        <Knob label="f (Hz)" value={k.f} min={1e6} max={5e9} step={1e6}
              format={(v)=>v.toExponential(2)} onChange={(v)=>setK(s=>({...s,f:v}))} />

        {lossy && (
          <>
            <Knob label="α (Np/m)" value={k.alpha} min={0} max={1} step={0.01} onChange={(v)=>setK(s=>({...s,alpha:v}))} />
            <Knob label="|η| (Ω)" value={k.etaMag} min={10} max={1200} step={1} onChange={(v)=>setK(s=>({...s,etaMag:v}))} />
            <Knob label="θη (deg)" value={k.etaPhase} min={-90} max={90} step={1} onChange={(v)=>setK(s=>({...s,etaPhase:v}))} />
          </>
        )}

        <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <label>z* (m):</label>
          <input type="range" min={zMin} max={zMax} step={0.01}
                 value={zProbe} onChange={(e)=>setZProbe(+e.target.value)} />
          <input type="number" value={zProbe.toFixed(2)} onChange={(e)=>setZProbe(clamp(+e.target.value, zMin, zMax))}
                 style={{ width: 70, padding: 6, border: "1px solid #cbd5e1", borderRadius: 8 }}/>
        </div>

        <button onClick={()=>setPaused(p=>!p)} style={{
          padding:"8px 12px", borderRadius: 10, border:"1px solid #1f2937",
          background: paused ? "#16a34a22" : "#ef444422", fontWeight: 800
        }}>{paused ? "▶ Play" : "⏸ Pause"}</button>
      </div>

      {/* Main SVG */}
      <svg width={WIDTH} height={HEIGHT} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12 }}>
        {/* Axes box */}
        <rect x={PAD.l} y={PAD.t} width={VIEW_W} height={VIEW_H} fill="#ffffff" stroke="#e5e7eb" />

        {/* z-axis ticks & label */}
        {Array.from({ length: 5 }).map((_, i) => {
          const z = zMin + (i / 4) * (zMax - zMin);
          const x = z2x(z);
          return (
            <g key={i}>
              <line x1={x} y1={PAD.t + VIEW_H} x2={x} y2={PAD.t + VIEW_H + 6} stroke="#94a3b8" />
              <text x={x} y={PAD.t + VIEW_H + 22} fontSize={12} textAnchor="middle" fill="#111">{z.toFixed(2)}</text>
            </g>
          );
        })}
        <text x={PAD.l + VIEW_W / 2} y={HEIGHT - 8} fontSize={14} textAnchor="middle" fontWeight={800} fill="#000">z (m)</text>

        {/* E/H zero line */}
        <line x1={PAD.l} y1={val2y(0)} x2={PAD.l + VIEW_W} y2={val2y(0)} stroke="#e5e7eb" />

        {/* E and H curves */}
        <polyline points={ePath} fill="none" stroke="#ef4444" strokeWidth={2.5} />
        <polyline points={hPath} fill="none" stroke="#3b82f6" strokeWidth={2.0} strokeDasharray="6 4" />

        {/* S arrows */}
        {sArrows.map((a, idx) => (
          <g key={idx} transform={`translate(${a.x},${a.y})`}>
            <line x1={0} y1={0} x2={a.dir * a.len} y2={0} stroke="#22c55e" strokeWidth={3} />
            <polygon
              points={`${a.dir * a.len},0 ${a.dir * a.len - 8 * a.dir},-5 ${a.dir * a.len - 8 * a.dir},5`}
              fill="#22c55e"
            />
          </g>
        ))}

        {/* axis/legend labels */}
        <g>
          <rect x={WIDTH - PAD.r + 14} y={PAD.t + 10} width={PAD.r - 28} height={112} rx={10} fill="#fff" stroke="#e5e7eb" />
          <text x={WIDTH - PAD.r + 26} y={PAD.t + 30} fontWeight={900} fontSize={13} fill="#000">Legend</text>
          <LegendSwatch y={PAD.t + 50} color="#ef4444" label="E(z,t) (x̂)" />
          <LegendSwatch y={PAD.t + 70} color="#3b82f6" label="H(z,t) (ŷ)" dash />
          <LegendSwatch y={PAD.t + 90} color="#22c55e" label="S = E×H (ẑ, inst.)" />
        </g>

        {/* Probe marker */}
        <line x1={z2x(zProbe)} y1={PAD.t} x2={z2x(zProbe)} y2={PAD.t + VIEW_H} stroke="#f59e0b" strokeDasharray="4 4" />
        <text x={z2x(zProbe)} y={PAD.t - 8} textAnchor="middle" fontSize={12} fill="#f59e0b">z*</text>

        {/* Probe readout panel */}
        <g>
          <rect x={WIDTH - PAD.r + 14} y={PAD.t + 136} width={PAD.r - 28} height={118} rx={10} fill="#fff" stroke="#e5e7eb" />
          <text x={WIDTH - PAD.r + 26} y={PAD.t + 156} fontWeight={900} fontSize={13} fill="#000">
            Probe @ z* = {zProbe.toFixed(2)} m
          </text>
          <ReadoutRow y={PAD.t + 176} label="E(z*,t) [V/m]" value={ExP.toFixed(3)} />
          <ReadoutRow y={PAD.t + 194} label="H(z*,t) [A/m]" value={HyP.toFixed(5)} />
          <ReadoutRow y={PAD.t + 212} label="S_inst [W/m²]" value={Sinst.toFixed(3)} />
          <ReadoutRow y={PAD.t + 230} label="⟨S⟩ [W/m²]" value={Savg.toFixed(3)} />
        </g>

        {/* Phasor wheel */}
        <g>
          <rect x={WIDTH - PAD.r + 14} y={PAD.t + 266} width={PAD.r - 28} height={170} rx={10} fill="#fff" stroke="#e5e7eb" />
          <text x={WIDTH - PAD.r + 26} y={PAD.t + 286} fontWeight={900} fontSize={13} fill="#000">
            Phasor (E ref, H lag = θη)
          </text>
          <circle cx={cx} cy={cy} r={phR} fill="#fff" stroke="#94a3b8" />
          {/* E reference at angle 0 */}
          <line x1={cx} y1={cy} x2={cx + phR} y2={cy} stroke="#ef4444" strokeWidth={3} />
          {/* H with lag -θη */}
          <line
            x1={cx}
            y1={cy}
            x2={cx + phR * Math.cos(hAng)}
            y2={cy - phR * Math.sin(hAng)}
            stroke="#3b82f6"
            strokeWidth={3}
          />
          <text x={cx} y={cy + phR + 18} fontSize={12} textAnchor="middle" fill="#000">
            θη = {lossy ? k.etaPhase.toFixed(0) : 0}°
          </text>
        </g>

        {/* Axis orientation text */}
        <text x={PAD.l - 44} y={val2y(0)} fontSize={12} textAnchor="end" fill="#000">x̂ (E)</text>
        <text x={PAD.l - 44} y={PAD.t + 14} fontSize={12} textAnchor="end" fill="#000">ŷ (H)</text>
        <text x={PAD.l + VIEW_W + 10} y={PAD.t + VIEW_H / 2} fontSize={12} fill="#000">+ẑ</text>
      </svg>
      <p style={{ marginTop: 8, color: "#334155" }}>
        Tip: switch to <b>Lossy</b> and increase <b>α</b> to see the envelope decay. Adjust <b>θη</b> to see why ⟨S⟩ scales with <b>cos θη</b>.
      </p>
    </div>
  );
}

/* ---------- small helpers (UI) ---------- */

function Knob({
  label, value, min, max, step, onChange, format,
}: { label: string; value: number; min: number; max: number; step: number;
     onChange: (v:number)=>void; format?:(v:number)=>string }) {
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span>{label}</span>
      <input type="range" min={min} max={max} step={step} value={value}
             onChange={(e)=>onChange(+e.target.value)} />
      <input type="text" value={format ? format(value) : value}
             onChange={(e)=>onChange(+e.target.value)}
             style={{ width: 84, padding: 6, border: "1px solid #cbd5e1", borderRadius: 8 }} />
    </label>
  );
}

function LegendSwatch({ y, color, label, dash }: { y: number; color: string; label: string; dash?: boolean }) {
  return (
    <g>
      <line x1={WIDTH - 240} y1={y} x2={WIDTH - 210} y2={y}
            stroke={color} strokeWidth={3} strokeDasharray={dash ? "6 4" : undefined} />
      <text x={WIDTH - 204} y={y + 4} fontSize={12} fill="#000">{label}</text>
    </g>
  );
}

function ReadoutRow({ y, label, value }: { y: number; label: string; value: string }) {
  return (
    <g>
      <text x={WIDTH - 240} y={y} fontSize={12} fill="#334155">{label}</text>
      <text x={WIDTH - 120} y={y} fontSize={12} fill="#000" fontWeight={800} textAnchor="end">{value}</text>
    </g>
  );
}
