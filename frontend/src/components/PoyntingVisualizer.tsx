import React, { useEffect, useMemo, useState } from "react";

/**
 * PlaneWaveExplainer — crisp, pedagogical 2D SVG model
 * - E(z,t) along x-axis, H(z,t) along y-axis, propagation +z-axis
 * - Lossless or lossy (alpha, theta_eta) with |eta|
 * - Probe at z* with live readout
 * - Phasor wheel showing H lag
 * - Readouts positioned cleanly below the graph
 */

type Knobs = {
  E0: number; // V/m
  f: number; // Hz
  etaMag: number; // |eta| in Ohms
  etaPhase: number; // theta_eta in deg
  alpha: number; // Np/m
  eps: number; // F/m
  mu: number; // H/m
};

const WIDTH = 980;
const HEIGHT = 420; // Reduced height since readouts moved out
const PAD = { l: 80, r: 220, t: 36, b: 52 }; // Reduced right padding
const VIEW_W = WIDTH - PAD.l - PAD.r;
const omegaVis = 2 * Math.PI * 1; // 1 Hz visual wave

function deg2rad(d: number) {
  return (d * Math.PI) / 180;
}
function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

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
  const [time, setTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [showInstant, setShowInstant] = useState(false);

  const omega = 2 * Math.PI * k.f;
  const beta = omega * Math.sqrt(k.eps * k.mu);
  const theta = deg2rad(lossy ? k.etaPhase : 0);
  const alpha = lossy ? k.alpha : 0;

  // z range shown in the plot (meters)
  const zMax = 2.0; // 2 m span
  const zMin = 0.0;

  const VIEW_H_FIXED = HEIGHT - PAD.t - PAD.b;

  // time loop
  useEffect(() => {
    let af: number;
    let last = performance.now();

    const loop = (now: number) => {
      if (!paused) {
        const dt = (now - last) * 0.001; // seconds
        setTime((t) => t + dt * speed);
      }
      last = now;
      af = requestAnimationFrame(loop);
    };

    af = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(af);
  }, [paused, speed]);

  // scale helpers
  const z2x = (z: number) => PAD.l + (z - zMin) * (VIEW_W / (zMax - zMin));
  const val2y = (v: number) => {
    const mid = PAD.t + VIEW_H_FIXED * 0.55;
    const scale = VIEW_H_FIXED * 0.3;
    return mid - v * scale;
  };

  // generate polyline paths for E and H each frame
  const eNorm = clamp(k.E0 / 100, 0.15, 2.0);

  const { ePath, hPath } = useMemo(() => {
    const n = 500;
    let ePts = "";
    let hPts = "";
    for (let i = 0; i <= n; i++) {
      const z = zMin + (i / n) * (zMax - zMin);
      const env = Math.exp(-alpha * z);
      const phase = omegaVis * time - beta * z;

      const Ex = eNorm * env * Math.cos(phase);
      const Hy =
        (k.E0 / Math.max(1e-9, k.etaMag)) * env * Math.cos(phase - theta);
      const x = z2x(z);
      const yE = val2y(Ex);
      const yH = val2y(Hy);
      ePts += `${x},${yE} `;
      hPts += `${x},${yH} `;
    }
    return { ePath: ePts.trim(), hPath: hPts.trim() };
  }, [time, alpha, beta, eNorm, k.E0, k.etaMag, theta]);

  // probe readout at z*
  const envP = Math.exp(-alpha * zProbe);
  const phaseP = omegaVis * time - beta * zProbe;

  const S_scale_factor = (k.E0 * k.E0) / (k.etaMag || 377);

  const ExP = k.E0 * envP * Math.cos(phaseP);
  const HyP =
    (k.E0 / Math.max(1e-9, k.etaMag)) * envP * Math.cos(phaseP - theta);
  const Sinst = ExP * HyP;
  const Savg =
    ((k.E0 * k.E0) / (2 * Math.max(1e-9, k.etaMag))) *
    Math.exp(-2 * alpha * zProbe) *
    Math.cos(theta);

  // RMS values
  const Erms = (k.E0 / Math.sqrt(2)) * envP;
  const Hrms = (k.E0 / (Math.sqrt(2) * Math.max(1e-9, k.etaMag))) * envP;

  // visual length for Poynting arrow
  const visualScale = 120;
  const dx = (Sinst / S_scale_factor) * visualScale;
  const yArrow = val2y(0) - 60;

  // Right Panel positioning
  const LEGEND_Y = PAD.t + 10;
  const PHASOR_Y = LEGEND_Y + 112 + 12;

  const panelX = WIDTH - PAD.r + 14;
  const panelW = PAD.r - 28;

  const rmsRows = [
    { label: "E_rms [V/m]", value: Erms.toFixed(2) },
    { label: "H_rms [A/m]", value: Hrms.toFixed(4) },
    { label: "⟨S⟩ [W/m²]", value: Savg.toFixed(2) },
  ];

  const instRows = [
    { label: "E(z*,t) [inst]", value: ExP.toFixed(3) },
    { label: "H(z*,t) [inst]", value: HyP.toFixed(5) },
    { label: "S_inst [W/m²]", value: Sinst.toFixed(3) },
  ];

  return (
    <div style={{ width: "100%", maxWidth: 1100, margin: "0 auto", fontFamily: "sans-serif" }}>
      {/* Controls */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 10,
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 10,
          marginBottom: 12,
          fontSize: 14,
        }}
      >
        <label>Mode:</label>
        <button
          onClick={() => setLossy(false)}
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            border: "1px solid #cbd5e1",
            background: lossy ? "#fff" : "#e0f2fe",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Lossless
        </button>
        <button
          onClick={() => setLossy(true)}
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            border: "1px solid #cbd5e1",
            background: lossy ? "#fee2e2" : "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Lossy
        </button>

        <Knob label="E₀ (V/m)" value={k.E0} min={1} max={300} step={1} onChange={(v) => setK((s) => ({ ...s, E0: v }))} />
        <Knob label="f (Hz)" value={k.f} min={1e6} max={5e9} step={1e6} format={(v) => v.toExponential(2)} onChange={(v) => setK((s) => ({ ...s, f: v }))} />

        {lossy && (
          <>
            <Knob label="α (Np/m)" value={k.alpha} min={0} max={1} step={0.01} onChange={(v) => setK((s) => ({ ...s, alpha: v }))} />
            <Knob label="|η| (Ω)" value={k.etaMag} min={10} max={1200} step={1} onChange={(v) => setK((s) => ({ ...s, etaMag: v }))} />
            <Knob label="θη (deg)" value={k.etaPhase} min={-90} max={90} step={1} onChange={(v) => setK((s) => ({ ...s, etaPhase: v }))} />
          </>
        )}

        <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <label>z* (m):</label>
          <input type="range" min={zMin} max={zMax} step={0.01} value={zProbe} onChange={(e) => setZProbe(+e.target.value)} />
          <input
            type="number"
            value={zProbe.toFixed(2)}
            onChange={(e) => setZProbe(clamp(+e.target.value, zMin, zMax))}
            style={{ width: 60, padding: 6, border: "1px solid #cbd5e1", borderRadius: 8 }}
          />
        </div>

        <button
          onClick={() => setPaused((p) => !p)}
          style={{
            padding: "8px 12px",
            borderRadius: 10,
            border: "1px solid #1f2937",
            background: paused ? "#16a34a22" : "#ef444422",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          {paused ? "▶ Play" : "⏸ Pause"}
        </button>

        <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <label>Speed:</label>
          <input type="range" min={0.1} max={3} step={0.1} value={speed} onChange={(e) => setSpeed(+e.target.value)} />
          <span style={{ minWidth: 36, fontWeight: 700 }}>{speed.toFixed(1)}×</span>
        </div>

        <label style={{ display: "flex", gap: 6, alignItems: "center", cursor: "pointer", marginLeft: "auto" }}>
          <input
            type="checkbox"
            checked={showInstant}
            onChange={() => {
              setShowInstant((s) => {
                const next = !s;
                if (next) setPaused(true);
                return next;
              });
            }}
          />
          Show instantaneous panel
        </label>
      </div>

      {/* Main SVG Visualization */}
      <svg width={WIDTH} height={HEIGHT} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12 }}>
        {/* Axes box */}
        <rect x={PAD.l} y={PAD.t} width={VIEW_W} height={VIEW_H_FIXED} fill="#ffffff" stroke="#e5e7eb" />

        <defs>
          <marker id="poyntingArrow" markerWidth="12" markerHeight="8" refX="10" refY="4" orient="auto" markerUnits="strokeWidth">
            <polygon points="0 0, 12 4, 0 8" fill="#16a34a" />
          </marker>
          <marker id="phasorArrow" markerWidth="4" markerHeight="4" refX="3.5" refY="2" orient="auto" markerUnits="strokeWidth">
            <polygon points="0 0, 4 2, 0 4" fill="currentColor" />
          </marker>
        </defs>

        {/* z-axis ticks & label */}
        {Array.from({ length: 5 }).map((_, i) => {
          const z = zMin + (i / 4) * (zMax - zMin);
          const x = z2x(z);
          return (
            <g key={i}>
              <line x1={x} y1={PAD.t + VIEW_H_FIXED} x2={x} y2={PAD.t + VIEW_H_FIXED + 6} stroke="#94a3b8" />
              <text x={x} y={PAD.t + VIEW_H_FIXED + 22} fontSize={12} textAnchor="middle" fill="#111">{z.toFixed(2)}</text>
            </g>
          );
        })}
        <text x={PAD.l + VIEW_W / 2} y={PAD.t + VIEW_H_FIXED + 36} fontSize={14} textAnchor="middle" fontWeight={800} fill="#000">z (m)</text>

        {/* E/H zero line */}
        <line x1={PAD.l} y1={val2y(0)} x2={PAD.l + VIEW_W} y2={val2y(0)} stroke="#e5e7eb" />

        {/* E and H curves */}
        <polyline points={ePath} fill="none" stroke="#ef4444" strokeWidth={2.5} />
        <polyline points={hPath} fill="none" stroke="#3b82f6" strokeWidth={2.0} strokeDasharray="6 4" />

        {/* Instantaneous Poynting Vector Arrow S(z*,t) */}
        <g transform={`translate(${z2x(zProbe)}, ${yArrow - 40})`}>
          <line x1={0} y1={0} x2={dx} y2={0} stroke="#16a34a" strokeWidth={2} markerEnd={Math.abs(dx) > 5 ? "url(#poyntingArrow)" : ""} />
          <text x={dx > 0 ? dx + 10 : dx - 50} y={5} fontSize={12} fontWeight={700} fill="#166534">S(inst)</text>
        </g>

        {/* Probe marker */}
        <line x1={z2x(zProbe)} y1={PAD.t} x2={z2x(zProbe)} y2={PAD.t + VIEW_H_FIXED} stroke="#f59e0b" strokeDasharray="4 4" />
        <text x={z2x(zProbe)} y={PAD.t - 8} textAnchor="middle" fontSize={12} fill="#f59e0b" fontWeight={700}>z*</text>

        {/* Legend */}
        <g>
          <rect x={panelX} y={LEGEND_Y} width={panelW} height={112} rx={10} fill="#fff" stroke="#e5e7eb" />
          <text x={panelX + 12} y={LEGEND_Y + 24} fontWeight={900} fontSize={13} fill="#000">Legend</text>
          <LegendSwatch x={panelX + 12} y={LEGEND_Y + 44} color="#ef4444" label="E(z,t) (x̂)" />
          <LegendSwatch x={panelX + 12} y={LEGEND_Y + 68} color="#3b82f6" label="H(z,t) (ŷ)" dash />
          <LegendSwatch x={panelX + 12} y={LEGEND_Y + 92} color="#22c55e" label="S = E×H (ẑ, inst.)" />
        </g>

        {/* Phasor wheel */}
        <g>
          {(() => {
            const panelH = 170;
            const cxP = panelX + panelW / 2;
            const cyP = PHASOR_Y + panelH / 2 + 8;
            const R = 46;
            const hAng = -theta; // H lags E by theta_eta
            return (
              <>
                <rect x={panelX} y={PHASOR_Y} width={panelW} height={panelH} rx={10} fill="#fff" stroke="#e5e7eb" />
                <text x={panelX + 12} y={PHASOR_Y + 24} fontWeight={900} fontSize={13} fill="#000">Phasor Reference</text>

                {/* Grid & Circle */}
                <circle cx={cxP} cy={cyP} r={R} fill="#fff" stroke="#94a3b8" />
                <line x1={cxP - R} y1={cyP} x2={cxP + R} y2={cyP} stroke="#e5e7eb" />
                <line x1={cxP} y1={cyP - R} x2={cxP} y2={cyP + R} stroke="#e5e7eb" />
                <circle cx={cxP} cy={cyP} r={2.5} fill="#334155" />

                {/* E Reference */}
                <line x1={cxP} y1={cyP} x2={cxP + R} y2={cyP} stroke="#ef4444" strokeWidth={3} markerEnd="url(#phasorArrow)" />
                <text x={cxP + R + 8} y={cyP + 4} fontSize={12} fill="#ef4444" fontWeight={700}>E</text>

                {/* H Lagging */}
                <line x1={cxP} y1={cyP} x2={cxP + R * Math.cos(hAng)} y2={cyP - R * Math.sin(hAng)} stroke="#3b82f6" strokeWidth={3} markerEnd="url(#phasorArrow)" />
                <text x={cxP + (R + 10) * Math.cos(hAng)} y={cyP - (R + 10) * Math.sin(hAng)} fontSize={12} fill="#3b82f6" fontWeight={700}>H</text>

                <text x={cxP} y={PHASOR_Y + panelH - 12} fontSize={12} textAnchor="middle" fill="#000">
                  θη = {lossy ? k.etaPhase.toFixed(0) : 0}°
                </text>
              </>
            );
          })()}
        </g>

        {/* Axis orientation text */}
        <text x={PAD.l - 44} y={val2y(0)} fontSize={12} textAnchor="end" fill="#000">x̂ (E)</text>
        <text x={PAD.l - 44} y={PAD.t + 14} fontSize={12} textAnchor="end" fill="#000">ŷ (H)</text>
        <text x={PAD.l + VIEW_W + 10} y={PAD.t + VIEW_H_FIXED / 2} fontSize={12} fill="#000">+ẑ</text>
      </svg>

      {/* HTML Bottom Readout Panels */}
      <div style={{ display: "grid", gridTemplateColumns: showInstant ? "1fr 1fr" : "1fr", gap: "16px", marginTop: "16px" }}>
        
        {/* RMS / Time-Average Card */}
        <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 12, padding: "16px 24px" }}>
          <h3 style={{ margin: "0 0 16px 0", fontSize: 15, color: "#0369a1", fontWeight: 800 }}>
            RMS / Time-Average @ z* = {zProbe.toFixed(2)} m
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {rmsRows.map((row, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", borderBottom: i < 2 ? "1px solid #e0f2fe" : "none", paddingBottom: i < 2 ? 8 : 0 }}>
                <span style={{ color: "#334155", fontSize: 14 }}>{row.label}</span>
                <span style={{ color: "#000", fontSize: 14, fontWeight: 700 }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Instantaneous Card */}
        {showInstant && (
          <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 12, padding: "16px 24px" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: 15, color: "#9a3412", fontWeight: 800 }}>
              Instantaneous (paused)
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {instRows.map((row, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", borderBottom: i < 2 ? "1px solid #ffedd5" : "none", paddingBottom: i < 2 ? 8 : 0 }}>
                  <span style={{ color: "#334155", fontSize: 14 }}>{row.label}</span>
                  <span style={{ color: "#000", fontSize: 14, fontWeight: 700 }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Helpers
function Knob({ label, value, min, max, step, onChange, format }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; format?: (v: number) => string }) {
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span>{label}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} />
      <input
        type="text"
        value={format ? format(value) : value}
        onChange={(e) => onChange(+e.target.value)}
        style={{ width: 70, padding: 6, border: "1px solid #cbd5e1", borderRadius: 8 }}
      />
    </label>
  );
}

function LegendSwatch({ x, y, color, label, dash }: { x: number; y: number; color: string; label: string; dash?: boolean }) {
  return (
    <g>
      <line x1={x} y1={y} x2={x + 24} y2={y} stroke={color} strokeWidth={3} strokeDasharray={dash ? "6 4" : undefined} />
      <text x={x + 32} y={y + 4} fontSize={12} fill="#000">{label}</text>
    </g>
  );
}