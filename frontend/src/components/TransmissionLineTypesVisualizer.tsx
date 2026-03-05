import React, { useEffect, useMemo, useState } from "react";

type LineMode = "Lossless" | "Distortionless" | "Lossy";

const WIDTH = 980;
const HEIGHT = 520;
const PAD = { l: 80, r: 280, t: 40, b: 60 };
const VIEW_W = WIDTH - PAD.l - PAD.r;
const VIEW_H = HEIGHT - PAD.t - PAD.b;

export default function TransmissionLineTypesVisualizer(): JSX.Element {
  const [mode, setMode] = useState<LineMode>("Lossless");
  
  const [R, setR] = useState(0.0);
  const [L, setL] = useState(1.0);
  const [G, setG] = useState(0.0);
  const [C, setC] = useState(1.0);
  const [freq, setFreq] = useState(1.0);

  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (mode === "Lossless") {
      setR(0); setG(0); setL(1.0); setC(1.0);
    } else if (mode === "Distortionless") {
      setR(0.15); setG(0.15); setL(1.0); setC(1.0);
    } else if (mode === "Lossy") {
      setR(0.8); setG(0.1); setL(1.0); setC(1.0);
    }
  }, [mode]);

  const { alpha, beta, u, Z0_mag, Z0_phase } = useMemo(() => {
    const omega = 2 * Math.PI * freq;
    
    // Complex Impedance Z = R + jwL
    const Z_re = R;
    const Z_im = omega * L;
    
    // Complex Admittance Y = G + jwC
    const Y_re = G;
    const Y_im = omega * C;

    // Gamma = sqrt(Z * Y)
    const gammaSq_re = (R * G) - (omega * omega * L * C);
    const gammaSq_im = omega * (L * G + R * C);
    
    // Complex sqrt of Gamma^2 to get alpha + jbeta
    const mag = Math.sqrt(gammaSq_re * gammaSq_re + gammaSq_im * gammaSq_im);
    const angle = Math.atan2(gammaSq_im, gammaSq_re);
    
    const a = Math.sqrt(mag) * Math.cos(angle / 2);
    const b = Math.sqrt(mag) * Math.sin(angle / 2);

    // Phase velocity u = omega / beta
    const velocity = b === 0 ? 0 : omega / b;

    // Characteristic Impedance Z0 = sqrt(Z/Y)
    const zMag = Math.sqrt(Z_re**2 + Z_im**2);
    const zAng = Math.atan2(Z_im, Z_re);
    const yMag = Math.sqrt(Y_re**2 + Y_im**2);
    const yAng = Math.atan2(Y_im, Y_re);
    
    const Z0_m = Math.sqrt(zMag / yMag);
    const Z0_p = (zAng - yAng) / 2;

    return { alpha: a, beta: b, u: velocity, Z0_mag: Z0_m, Z0_phase: (Z0_p * 180 / Math.PI) };
  }, [R, L, G, C, freq]);

  useEffect(() => {
    let af: number;
    let last = performance.now();
    const loop = (now: number) => {
      if (!paused) {
        const dt = (now - last) * 0.001;
        setTime((t) => t + dt * speed * 2);
      }
      last = now;
      af = requestAnimationFrame(loop);
    };
    af = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(af);
  }, [paused, speed]);

  const zMax = 10.0;
  const z2x = (z: number) => PAD.l + (z / zMax) * VIEW_W;
  const val2y = (v: number) => (PAD.t + VIEW_H / 2) - v * (VIEW_H * 0.35);

  const { vPath, envUpper, envLower } = useMemo(() => {
    const n = 300;
    let vPts = "", uPts = "", lPts = "";
    for (let i = 0; i <= n; i++) {
      const z = (i / n) * zMax;
      const atten = Math.exp(-alpha * z);
      const phase = (2 * Math.PI * freq * time) - beta * z;
      
      const vInst = 1.0 * atten * Math.cos(phase);
      const x = z2x(z);
      const yV = val2y(vInst);
      
      vPts += `${x},${yV} `;
      uPts += `${x},${val2y(atten)} `;
      lPts += `${x},${val2y(-atten)} `;
    }
    return { vPath: vPts.trim(), envUpper: uPts.trim(), envLower: lPts.trim() };
  }, [time, alpha, beta, freq]);

  return (
    <div style={{ width: "100%", maxWidth: 1100, margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12,
        padding: 16, background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 12, marginBottom: 10
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontWeight: 800, fontSize: 12, color: "#475569" }}>MODE PRESETS</span>
          <div style={{ display: "flex", gap: 4 }}>
            {(["Lossless", "Distortionless", "Lossy"] as LineMode[]).map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, padding: "6px", borderRadius: 6, border: "1px solid #cbd5e1",
                background: mode === m ? "#6366f1" : "#fff", color: mode === m ? "#fff" : "#475569",
                fontSize: 11, fontWeight: 700, cursor: "pointer"
              }}>{m}</button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
            <button onClick={() => setPaused(!paused)} style={{
              flex: 1, padding: "8px", borderRadius: 6, border: "1px solid #1e293b",
              background: paused ? "#dcfce7" : "#fee2e2", fontWeight: 800, cursor: "pointer"
            }}>{paused ? "▶ Play" : "⏸ Pause"}</button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Knob label="R (Ω/m)" value={R} min={0} max={2} step={0.01} onChange={setR} />
          <Knob label="L (H/m)" value={L} min={0.1} max={5} step={0.1} onChange={setL} />
          <Knob label="G (S/m)" value={G} min={0} max={2} step={0.01} onChange={setG} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Knob label="C (F/m)" value={C} min={0.1} max={5} step={0.1} onChange={setC} />
          <Knob label="Freq (Hz)" value={freq} min={0.1} max={5} step={0.1} onChange={setFreq} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11 }}>
            <span style={{ fontWeight: 700, width: 50 }}>Speed</span>
            <input type="range" min={0.1} max={3} step={0.1} value={speed} onChange={(e) => setSpeed(+e.target.value)} />
          </div>
        </div>
      </div>

      <svg width={WIDTH} height={HEIGHT} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12 }}>
        <rect x={PAD.l} y={PAD.t} width={VIEW_W} height={VIEW_H} fill="#fff" stroke="#f1f5f9" />
        <line x1={PAD.l} y1={val2y(0)} x2={PAD.l + VIEW_W} y2={val2y(0)} stroke="#e2e8f0" />

        {alpha > 0.01 && <polyline points={envUpper} fill="none" stroke="#ef4444" strokeWidth={1} strokeDasharray="4 4" opacity={0.4} />}
        {alpha > 0.01 && <polyline points={envLower} fill="none" stroke="#ef4444" strokeWidth={1} strokeDasharray="4 4" opacity={0.4} />}
        <polyline points={vPath} fill="none" stroke="#6366f1" strokeWidth={2.5} />

        <text x={PAD.l + VIEW_W/2} y={HEIGHT - 20} fontSize={13} textAnchor="middle" fontWeight={800}>Distance z (m)</text>

        <g transform={`translate(${WIDTH - PAD.r + 20}, ${PAD.t})`}>
          <rect width={PAD.r - 40} height={80} rx={8} fill="#f8fafc" stroke="#e2e8f0" />
          <text x={12} y={22} fontSize={12} fontWeight={800}>Legend</text>
          <LegendItem y={45} color="#6366f1" label="Voltage V(z,t)" />
          <LegendItem y={65} color="#ef4444" label="Attenuation Envelope" dashed />

          <g transform="translate(0, 95)">
            <rect width={PAD.r - 40} height={190} rx={8} fill="#f0f9ff" stroke="#bae6fd" />
            <text x={12} y={22} fontSize={12} fontWeight={800} fill="#0369a1">Calculated Propagation</text>
            <ReadoutRow y={50} label="α (Attenuation):" value={`${alpha.toFixed(4)} Np/m`} />
            <ReadoutRow y={75} label="β (Phase Const):" value={`${beta.toFixed(4)} rad/m`} />
            <ReadoutRow y={100} label="u (Wave Velocity):" value={`${u.toFixed(4)} m/s`} color="#0891b2" />
            <ReadoutRow y={125} label="|Z0| (Impedance):" value={`${Z0_mag.toFixed(2)} Ω`} />
            <ReadoutRow y={150} label="∠Z0 (Phase):" value={`${Z0_phase.toFixed(1)}°`} />
            <ReadoutRow y={175} label="Wavelength (λ):" value={`${(2*Math.PI/beta).toFixed(2)} m`} />
          </g>
          
          <foreignObject y={300} width={PAD.r - 40} height={120}>
            <div style={{ fontSize: 11, color: "#475569", padding: "0 5px" }}>
              <strong>Physics Note:</strong> In a <i>Lossless</i> line, u = 1/√(LC). In a <i>Lossy</i> line, velocity depends on frequency, causing dispersion.
            </div>
          </foreignObject>
        </g>
      </svg>
    </div>
  );
}

interface KnobProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

function Knob({ label, value, min, max, step, onChange }: KnobProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, fontSize: 11 }}>
      <span style={{ fontWeight: 700, color: "#475569", width: 60 }}>{label}</span>
      <input 
        type="number" 
        min={min} 
        max={max} 
        step={step} 
        value={value} 
        onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))} 
        style={{ 
          flex: 1, 
          padding: "4px 8px", 
          border: "1px solid #cbd5e1", 
          borderRadius: "4px", 
          fontFamily: "monospace",
          fontSize: 12,
          outline: "none"
        }} 
      />
    </div>
  );
}

interface LegendItemProps {
  y: number;
  color: string;
  label: string;
  dashed?: boolean;
}

function LegendItem({ y, color, label, dashed }: LegendItemProps) {
  return (
    <g transform={`translate(12, ${y})`}>
      <line x1={0} y1={-4} x2={20} y2={-4} stroke={color} strokeWidth={2} strokeDasharray={dashed ? "3 2" : "none"} />
      <text x={28} y={0} fontSize={11} fill="#334155">{label}</text>
    </g>
  );
}

interface ReadoutRowProps {
  y: number;
  label: string;
  value: string;
  color?: string;
}

function ReadoutRow({ y, label, value, color = "#334155" }: ReadoutRowProps) {
  return (
    <g transform={`translate(12, ${y})`}>
      <text fontSize={10} fill="#64748b">{label}</text>
      <text x={PAD.r - 65} fontSize={10} fontWeight={800} fill={color} textAnchor="end">{value}</text>
    </g>
  );
}