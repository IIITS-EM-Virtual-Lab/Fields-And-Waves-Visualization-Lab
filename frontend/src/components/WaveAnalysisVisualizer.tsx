// filepath: src/components/WaveAnalysisVisualizer.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";

type Medium = "Free Space" | "Lossless Dielectric" | "Good Conductor";

const EPS0 = 8.854e-12;
const MU0 = 4 * Math.PI * 1e-7;

const W = 1100;
const H = 560;
const PAD = { l: 90, r: 300, t: 40, b: 60 };

const vw = W - PAD.l - PAD.r;
const vh = H - PAD.t - PAD.b;

// panel geometry
const A_HEIGHT = vh / 2 - 14;
const B_HEIGHT = vh / 2 - 34;
const A_TOP = PAD.t;
const B_TOP = PAD.t + (vh / 2 + 24);
const A_MID = A_TOP + A_HEIGHT / 2;
const B_MID = B_TOP + B_HEIGHT / 2;

// seconds shown along t in panel (b)
const tSpan = 2e-9;

function rad(d: number) { return (d * Math.PI) / 180; }
function t2x(t: number) { return PAD.l + (t / tSpan) * vw; }

// map normalized amplitude [-1..1] to y coordinate in a panel
function normToY_A(v: number, scale: number) { return A_MID - v * scale; }
function normToY_B(v: number, scale: number) { return B_MID - v * scale; }

// grid helper: draw y grid/ticks & x grid/ticks for a panel
function YAxis({
  panel,
  yTop,
  height,
  scale,
}: {
  panel: "A" | "B";
  yTop: number;
  height: number;
  scale: number;
}) {
  const ticks = [-1, -0.5, 0, 0.5, 1];
  const yFromNorm = panel === "A" ? (v: number) => normToY_A(v, scale) : (v: number) => normToY_B(v, scale);
  return (
    <g>
      {/* y-axis line */}
      <line x1={PAD.l} y1={yTop} x2={PAD.l} y2={yTop + height} stroke="#1f2937" strokeWidth={2} />
      {/* ticks + labels + grid */}
      {ticks.map((t, i) => {
        const y = yFromNorm(t);
        return (
          <g key={`${panel}-y-${i}`}>
            <line x1={PAD.l} y1={y} x2={PAD.l + vw} y2={y} stroke="#e5e7eb" />
            <line x1={PAD.l - 6} y1={y} x2={PAD.l} y2={y} stroke="#1f2937" />
            <text x={PAD.l - 10} y={y + 4} fontSize={12} fill="#000" textAnchor="end">
              {t.toFixed(1)}
            </text>
          </g>
        );
      })}
      <text
        x={PAD.l - 56}
        y={yTop + height / 2}
        fontSize={12}
        fill="#000"
        transform={`rotate(-90 ${PAD.l - 56} ${yTop + height / 2})`}
        style={{ fontWeight: 800 }}
      >
        Normalized amplitude
      </text>
    </g>
  );
}

function XAxisZ({ zMax, z2x }: { zMax: number; z2x: (z: number) => number }) {
  const zMin = 0;
  return (
    <g>
      <line x1={PAD.l} y1={A_TOP + A_HEIGHT} x2={PAD.l + vw} y2={A_TOP + A_HEIGHT} stroke="#1f2937" strokeWidth={2} />
      {Array.from({ length: 5 }).map((_, i) => {
        const z = zMin + (i / 4) * (zMax - zMin);
        const x = z2x(z);
        return (
          <g key={`az${i}`}>
            <line x1={x} y1={A_TOP} x2={x} y2={A_TOP + A_HEIGHT} stroke="#e5e7eb" />
            <line x1={x} y1={A_TOP + A_HEIGHT} x2={x} y2={A_TOP + A_HEIGHT + 6} stroke="#1f2937" />
            <text x={x} y={A_TOP + A_HEIGHT + 20} fontSize={12} textAnchor="middle" fill="#000">
              {z.toPrecision(2)}
            </text>
          </g>
        );
      })}
      <text x={PAD.l + vw / 2} y={A_TOP + A_HEIGHT + 40} fontSize={13} textAnchor="middle" fill="#000" style={{ fontWeight: 800 }}>
        z (m)
      </text>
    </g>
  );
}

function XAxisT() {
  return (
    <g>
      <line x1={PAD.l} y1={B_TOP + B_HEIGHT} x2={PAD.l + vw} y2={B_TOP + B_HEIGHT} stroke="#1f2937" strokeWidth={2} />
      {Array.from({ length: 5 }).map((_, i) => {
        const t = (i / 4) * tSpan;
        const x = t2x(t);
        return (
          <g key={`bt${i}`}>
            <line x1={x} y1={B_TOP} x2={x} y2={B_TOP + B_HEIGHT} stroke="#e5e7eb" />
            <line x1={x} y1={B_TOP + B_HEIGHT} x2={x} y2={B_TOP + B_HEIGHT + 6} stroke="#1f2937" />
            <text x={x} y={B_TOP + B_HEIGHT + 20} fontSize={12} textAnchor="middle" fill="#000">
              {(t * 1e9).toFixed(2)} ns
            </text>
          </g>
        );
      })}
      <text x={PAD.l + vw / 2} y={H - 8} fontSize={13} textAnchor="middle" fill="#000" style={{ fontWeight: 800 }}>
        t (s) at z = 0
      </text>
    </g>
  );
}

export default function WaveAnalysisVisualizer(): JSX.Element {
  const [medium, setMedium] = useState<Medium>("Lossless Dielectric");
  const [E0, setE0] = useState(1.6);
  const [f, setF] = useState(1.38e9);
  const [epsr, setEpsr] = useState(4.0);
  const [sigma, setSigma] = useState(5.8e7);
  const [overlayH, setOverlayH] = useState(true);

  const omega = 2 * Math.PI * f;
  const eps = medium === "Lossless Dielectric" ? EPS0 * epsr : EPS0;
  const mu = MU0;

  const { alpha, beta, etaMag, etaPhaseDeg, skinDepth } = useMemo(() => {
    if (medium === "Free Space") {
      const c = 1 / Math.sqrt(mu * eps);
      return { alpha: 0, beta: omega / c, etaMag: Math.sqrt(mu / eps), etaPhaseDeg: 0, skinDepth: Infinity };
    }
    if (medium === "Lossless Dielectric") {
      return { alpha: 0, beta: omega * Math.sqrt(mu * eps), etaMag: Math.sqrt(mu / eps), etaPhaseDeg: 0, skinDepth: Infinity };
    }
    // Good conductor
    const a = Math.sqrt((Math.PI * f * mu * sigma) / 2);
    const b = a;
    const eta = Math.sqrt((omega * mu) / (2 * sigma)); // |η|, arg ~ 45°
    return { alpha: a, beta: b, etaMag: eta, etaPhaseDeg: 45, skinDepth: 1 / a };
  }, [medium, eps, mu, omega, f, sigma]);

  // ========= DYNAMIC Z-RANGE =========
  const zMin = 0;
  const zMax = useMemo(() => {
    if (medium !== "Good Conductor") return 2.0;
    if (!Number.isFinite(skinDepth)) return 2.0;
    return Math.max(5e-6, Math.min(0.1, 8 * skinDepth));
  }, [medium, skinDepth]);

  const z2x = useMemo(() => {
    const scale = vw / (zMax - zMin);
    return (z: number) => PAD.l + (z - zMin) * scale;
  }, [zMax]);

  // ===== ADAPTIVE SAMPLING =====
  const pointCountZ = useMemo(() => {
    const cycles = beta * (zMax - zMin) / (2 * Math.PI);
    return Math.max(600, Math.ceil(cycles * 40));
  }, [beta, zMax]);

  // animation clock (panel b)
  const tRef = useRef(0);
  const [, setTick] = useState(0);
  useEffect(() => {
    let raf = 0;
    const loop = (ms: number) => {
      tRef.current = ms * 1e-3;
      setTick((s) => s + 1);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // vertical amplitude scales per panel
  const A_SCALE = A_HEIGHT * 0.42;
  const B_SCALE = B_HEIGHT * 0.42;

  // ===== ADAPTIVE STYLING TO AVOID "BLUE BARS" =====
  const cyclesZ = useMemo(() => beta * (zMax - zMin) / (2 * Math.PI), [beta, zMax]);
  const cyclesT = useMemo(() => f * tSpan, [f]);

  const HStyleZ = useMemo(() => {
    // many cycles → solid thin, semi-transparent
    if (cyclesZ > 18) return { dash: "none", width: 1.4, opacity: 0.55 };
    // moderate cycles → longer dash (less busy)
    if (cyclesZ > 8) return { dash: "10 8", width: 1.8, opacity: 0.9 };
    // few cycles → original short dash
    return { dash: "6 4", width: 2, opacity: 1 };
  }, [cyclesZ]);

  const HStyleT = useMemo(() => {
    if (cyclesT > 8) return { dash: "none", width: 1.4, opacity: 0.55 };
    if (cyclesT > 4) return { dash: "10 8", width: 1.8, opacity: 0.9 };
    return { dash: "6 4", width: 2, opacity: 1 };
  }, [cyclesT]);

  // (a) E,H vs z at t=0 — uses A_MID and A_SCALE
  const { aE, aH } = useMemo(() => {
    const n = pointCountZ;
    let ePts = "", hPts = "";
    const theta = rad(etaPhaseDeg);
    const Hfactor = overlayH ? etaMag : 1;

    for (let i = 0; i <= n; i++) {
      const z = zMin + (i / n) * (zMax - zMin);
      const env = Math.exp(-alpha * z);
      const ExN = Math.cos(-beta * z) * env;           // normalized by E0
      const HyN = Math.cos(-beta * z - theta) * env;   // normalized by H0

      const x = z2x(z);
      const yE = normToY_A(ExN, A_SCALE);
      const yH = normToY_A(HyN * Hfactor, A_SCALE);

      ePts += `${x},${yE} `;
      hPts += `${x},${yH} `;
    }
    return { aE: ePts.trim(), aH: hPts.trim() };
  }, [alpha, beta, etaMag, etaPhaseDeg, overlayH, pointCountZ, zMax, z2x]);

  // (b) E,H vs t at z = 0 — uses B_MID and B_SCALE
  const { bE, bH } = useMemo(() => {
    const n = 500;
    let ePts = "", hPts = "";
    const theta = rad(etaPhaseDeg);
    const Hfactor = overlayH ? etaMag : 1;

    for (let i = 0; i <= n; i++) {
      const t = (-tSpan / 2) + (i / n) * tSpan;
      const ExN = Math.cos(omega * (tRef.current + t));                    // normalized
      const HyN = Math.cos(omega * (tRef.current + t) - theta);            // normalized

      const x = t2x(t + tSpan / 2);
      const yE = normToY_B(ExN, B_SCALE);
      const yH = normToY_B(HyN * Hfactor, B_SCALE);

      ePts += `${x},${yE} `;
      hPts += `${x},${yH} `;
    }
    return { bE: ePts.trim(), bH: hPts.trim() };
  }, [etaMag, etaPhaseDeg, omega, overlayH]);

  const etaStr = etaMag < 0.1 ? etaMag.toExponential(2) : etaMag.toFixed(1);

  return (
    <div style={{ width: "100%", maxWidth: 1200, margin: "0 auto" }}>
      {/* Controls */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center",
        border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, marginBottom: 8, background: "#fff" }}>
        <strong>Medium:</strong>
        <select value={medium} onChange={(e) => setMedium(e.target.value as Medium)}
                style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: 8 }}>
          <option>Free Space</option>
          <option>Lossless Dielectric</option>
          <option>Good Conductor</option>
        </select>

        <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          E₀ (V/m)
          <input type="range" min={0.2} max={3} step={0.01} value={E0} onChange={(e) => setE0(+e.target.value)} />
          <span style={{ fontSize: 12, padding: "3px 8px", border: "1px solid #cbd5e1", borderRadius: 8, background: "#f8fafc" }}>
            {E0.toFixed(2)}
          </span>
        </label>

        <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          f (Hz)
          <input type="range" min={1e6} max={5e9} step={1e6} value={f} onChange={(e) => setF(+e.target.value)} />
          <span style={{ fontSize: 12, padding: "3px 8px", border: "1px solid #cbd5e1", borderRadius: 8, background: "#f8fafc" }}>
            {f.toExponential(2)}
          </span>
        </label>

        {medium === "Lossless Dielectric" && (
          <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            εᵣ
            <input type="range" min={1} max={10} step={0.1} value={epsr} onChange={(e) => setEpsr(+e.target.value)} />
            <span style={{ fontSize: 12, padding: "3px 8px", border: "1px solid #cbd5e1", borderRadius: 8, background: "#f8fafc" }}>
              {epsr.toFixed(2)}
            </span>
          </label>
        )}

        {medium === "Good Conductor" && (
          <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            σ (S/m)
            <input type="range" min={1e5} max={1e8} step={1e5} value={sigma} onChange={(e) => setSigma(+e.target.value)} />
            <span style={{ fontSize: 12, padding: "3px 8px", border: "1px solid #cbd5e1", borderRadius: 8, background: "#f8fafc" }}>
              {sigma.toExponential(2)}
            </span>
          </label>
        )}

        <label style={{ display: "inline-flex", alignItems: "center", gap: 6, marginLeft: 8 }}>
          <input type="checkbox" checked={overlayH} onChange={(e) => setOverlayH(e.target.checked)} />
          scale H by |η| (overlay shapes)
        </label>
      </div>

      {/* SVG */}
      <svg
        width={W}
        height={H}
        style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12 }}
        shapeRendering="geometricPrecision"
      >
        {/* (a) top panel frame */}
        <g>
          <rect x={PAD.l} y={A_TOP} width={vw} height={A_HEIGHT} fill="#ffffff" stroke="#e5e7eb" />
          <YAxis panel="A" yTop={A_TOP} height={A_HEIGHT} scale={A_SCALE} />
          <XAxisZ zMax={zMax} z2x={z2x} />

          {/* zero line */}
          <line x1={PAD.l} y1={A_MID} x2={PAD.l + vw} y2={A_MID} stroke="#9ca3af" strokeWidth={1.6} />

          {/* curves */}
          <polyline points={aE} fill="none" stroke="#ef4444" strokeWidth={2.2} />
          <polyline
            points={aH}
            fill="none"
            stroke="#3b82f6"
            strokeWidth={HStyleZ.width}
            strokeDasharray={HStyleZ.dash}
            opacity={HStyleZ.opacity}
          />

          {/* title */}
          <text x={PAD.l + 8} y={A_TOP + 18} fontSize={13} fontWeight={800} fill="#000">
            (a) E(z), H(z) at t = 0
          </text>

          {/* Skin depth marker for conductors */}
          {Number.isFinite(skinDepth) && skinDepth < zMax && (
            <g>
              <line x1={z2x(skinDepth)} y1={A_TOP} x2={z2x(skinDepth)} y2={A_TOP + A_HEIGHT} stroke="#22c55e" strokeDasharray="4 4" />
              <text x={z2x(skinDepth)} y={A_TOP + 14} textAnchor="middle" fontSize={12} fill="#16a34a">
                δ = {skinDepth.toExponential(2)} m
              </text>
              <text x={z2x(skinDepth)} y={A_TOP + 30} textAnchor="middle" fontSize={11} fill="#16a34a">
                {"exp(-αz) = e^-1 ≈ 0.368"}
              </text>
            </g>
          )}
        </g>

        {/* right legend */}
        <g>
          <rect x={W - PAD.r + 12} y={PAD.t + 8} width={PAD.r - 24} height={130} rx={10} fill="#fff" stroke="#e5e7eb" />
          <text x={W - PAD.r + 24} y={PAD.t + 28} fontWeight={900} fontSize={13} fill="#000">Legend</text>
          <line x1={W - PAD.r + 24} y1={PAD.t + 50} x2={W - PAD.r + 54} y2={PAD.t + 50} stroke="#ef4444" strokeWidth={3} />
          <text x={W - PAD.r + 62} y={PAD.t + 54} fontSize={12} fill="#000">E</text>
          <line x1={W - PAD.r + 24} y1={PAD.t + 72} x2={W - PAD.r + 54} y2={PAD.t + 72} stroke="#3b82f6" strokeWidth={3} strokeDasharray="8 6" />
          <text x={W - PAD.r + 62} y={PAD.t + 76} fontSize={12} fill="#000">H{overlayH ? " (×|η|)" : ""}</text>
          <text x={W - PAD.r + 24} y={PAD.t + 100} fontSize={12} fill="#000">|η| = {etaStr} Ω,  θη = {etaPhaseDeg}°</text>
          <text x={W - PAD.r + 24} y={PAD.t + 118} fontSize={12} fill="#000">β = {beta.toExponential(2)} m⁻¹</text>
        </g>

        {/* (b) bottom panel frame */}
        <g>
          <rect x={PAD.l} y={B_TOP} width={vw} height={B_HEIGHT} fill="#ffffff" stroke="#e5e7eb" />
          <YAxis panel="B" yTop={B_TOP} height={B_HEIGHT} scale={B_SCALE} />
          <XAxisT />

          {/* zero line */}
          <line x1={PAD.l} y1={B_MID} x2={PAD.l + vw} y2={B_MID} stroke="#9ca3af" strokeWidth={1.6} />

          {/* curves */}
          <polyline points={bE} fill="none" stroke="#ef4444" strokeWidth={2.2} />
          <polyline
            points={bH}
            fill="none"
            stroke="#3b82f6"
            strokeWidth={HStyleT.width}
            strokeDasharray={HStyleT.dash}
            opacity={HStyleT.opacity}
          />
          <text x={PAD.l + 8} y={B_TOP + 18} fontSize={13} fontWeight={800} fill="#000">
            (b) E(t), H(t) at z = 0
          </text>
        </g>
      </svg>

      {/* small figure caption */}
      <div style={{ color: "#334155", fontSize: 13, marginTop: 6 }}>
        High-frequency aliasing fix: when many cycles are visible, the H curve switches to a thin, semi-transparent solid.
        At moderate cycles the dash spacing increases. This avoids the “vertical blue bars” while preserving information.
      </div>
    </div>
  );
}
