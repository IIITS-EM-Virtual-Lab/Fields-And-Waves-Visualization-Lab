import React, { useState, useMemo, useEffect } from "react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Sliders,
  Maximize2,
  Radio,
  Zap,
  Target,
} from "lucide-react";
import "./wave_reflection.css";

/* ================= Constant definitions & math helpers ================= */
const ETA0 = 376.730313668; // Free space intrinsic impedance in Ohms (≈ 120π)
const deg2rad = (d: number) => (d * Math.PI) / 180;
const rad2deg = (r: number) => (r * 180) / Math.PI;
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

type Polarization = "s" | "p";

interface Preset {
  name: string;
  desc: string;
  thetaI: number;
  pol: Polarization;
  er1: number;
  mr1: number;
  er2: number;
  mr2: number;
  pec: boolean;
}

const PRESETS: Preset[] = [
  {
    name: "Air → Glass (Dielectric Refraction)",
    desc: "n₁=1.0, n₂=1.5 (εr2=2.25). Standard partial reflection and transmission.",
    thetaI: 45,
    pol: "p",
    er1: 1.0,
    mr1: 1.0,
    er2: 2.25,
    mr2: 1.0,
    pec: false,
  },
  {
    name: "Brewster Angle Demo (Air → Glass)",
    desc: "Vertical (V / ∥) polarization at exact θB = 56.31° has zero reflection (Γ_V = 0) and 100% transmission.",
    thetaI: 56.31,
    pol: "p",
    er1: 1.0,
    mr1: 1.0,
    er2: 2.25,
    mr2: 1.0,
    pec: false,
  },
  {
    name: "Glass → Air (Total Internal Reflection)",
    desc: "Denser to rarer medium (n₁=1.5, n₂=1.0) with Critical Angle θc ≈ 41.8°.",
    thetaI: 55,
    pol: "s",
    er1: 2.25,
    mr1: 1.0,
    er2: 1.0,
    mr2: 1.0,
    pec: false,
  },
  {
    name: "Dielectric → Perfect Conductor (PEC)",
    desc: "Reflection from conductor (η₂=0, Γ=-1) forming a pure stationary standing wave.",
    thetaI: 0,
    pol: "s",
    er1: 1.0,
    mr1: 1.0,
    er2: 1.0,
    mr2: 1.0,
    pec: true,
  },
  {
    name: "Air → Water (High Contrast)",
    desc: "n₁=1.0, n₂=9.0 (εr2=81). Demonstrates strong reflection at interface.",
    thetaI: 30,
    pol: "p",
    er1: 1.0,
    mr1: 1.0,
    er2: 81.0,
    mr2: 1.0,
    pec: false,
  },
  {
    name: "Matched Media (Zero Reflection)",
    desc: "Equal intrinsic impedance (η₁ = η₂) resulting in Γ = 0 and perfect match.",
    thetaI: 30,
    pol: "p",
    er1: 2.25,
    mr1: 1.0,
    er2: 2.25,
    mr2: 1.0,
    pec: false,
  },
];

/* ================= Physics calculations ================= */
function useWaveReflectionPhysics(
  thetaI_deg: number,
  er1: number,
  er2: number,
  mr1: number,
  mr2: number,
  pol: Polarization,
  pec: boolean
) {
  return useMemo(() => {
    const validEr1 = Math.max(0.01, er1);
    const validEr2 = Math.max(0.01, er2);
    const validMr1 = Math.max(0.01, mr1);
    const validMr2 = Math.max(0.01, mr2);

    const thI = deg2rad(thetaI_deg);
    const n1 = Math.sqrt(validEr1 * validMr1);
    const n2 = Math.sqrt(validEr2 * validMr2);
    const eta1 = ETA0 * Math.sqrt(validMr1 / validEr1);
    const eta2 = pec ? 0 : ETA0 * Math.sqrt(validMr2 / validEr2);

    const sinI = Math.sin(thI);
    const cosI = Math.cos(thI);

    // Critical angle check (sin(theta_c) = n2 / n1 for n1 > n2)
    const hasCritical = !pec && n1 > n2;
    const thetaC_rad = hasCritical ? Math.asin(clamp(n2 / n1, 0, 1)) : NaN;
    const thetaC_deg = hasCritical ? rad2deg(thetaC_rad) : NaN;

    // Snell's Law of Refraction: n1 * sin(theta_i) = n2 * sin(theta_t)
    const sinT = (n1 / Math.max(n2, 1e-9)) * sinI;
    const isTIR = !pec && sinT > 1.0;

    let thetaT_rad = 0;
    let cosT = 0;
    if (!pec) {
      if (isTIR) {
        thetaT_rad = Math.PI / 2;
        cosT = 0;
      } else {
        thetaT_rad = Math.asin(clamp(sinT, 0, 1));
        cosT = Math.cos(thetaT_rad);
      }
    }
    const thetaT_deg = isTIR || pec ? NaN : rad2deg(thetaT_rad);

    // Reflection coefficient (Gamma) and Transmission coefficient (tau)
    let Gamma = 0;
    let tau = 0;

    if (pec) {
      // Perfect Conductor boundary (eta2 = 0)
      Gamma = -1.0;
      tau = 0.0;
    } else if (isTIR) {
      // Total Internal Reflection (|Gamma| = 1)
      Gamma = 1.0;
      tau = 0.0;
    } else {
      if (pol === "s") {
        // Perpendicular Polarization (TE / s-pol)
        // Gamma_perp = (eta2*cos(theta_i) - eta1*cos(theta_t)) / (eta2*cos(theta_i) + eta1*cos(theta_t))
        const num = eta2 * cosI - eta1 * cosT;
        const den = eta2 * cosI + eta1 * cosT;
        Gamma = Math.abs(den) < 1e-12 ? 1 : num / den;
        tau = Math.abs(den) < 1e-12 ? 0 : (2 * eta2 * cosI) / den;
      } else {
        // Parallel Polarization (TM / p-pol)
        // Gamma_par = (eta2*cos(theta_t) - eta1*cos(theta_i)) / (eta2*cos(theta_t) + eta1*cos(theta_i))
        const num = eta2 * cosT - eta1 * cosI;
        const den = eta2 * cosT + eta1 * cosI;
        Gamma = Math.abs(den) < 1e-12 ? 1 : num / den;
        tau = Math.abs(den) < 1e-12 ? 0 : (2 * eta2 * cosI) / den;
      }
    }

    // Power Reflectance R and Transmittance T: R = |Gamma|^2, T = 1 - R
    const R = clamp(Gamma * Gamma, 0, 1);
    let T = 0;
    if (!pec && !isTIR && cosI > 1e-6) {
      T = clamp(1 - R, 0, 1);
    }

    // Standing Wave Ratio (SWR / s): s = (1 + |Gamma|) / (1 - |Gamma|)
    const gammaMag = Math.abs(Gamma);
    const swr = gammaMag >= 0.999 ? Infinity : (1 + gammaMag) / Math.max(1e-6, 1 - gammaMag);

    // Brewster Angle (theta_B): tan(theta_B) = sqrt(er2 / er1) = n2 / n1 (for non-magnetic media)
    const hasBrewster = !pec && Math.abs(validMr1 - validMr2) < 1e-4;
    const thetaB_rad = hasBrewster ? Math.atan(n2 / n1) : NaN;
    const thetaB_deg = hasBrewster ? rad2deg(thetaB_rad) : NaN;
    const isAtBrewster = hasBrewster && pol === "p" && Math.abs(thetaI_deg - thetaB_deg) < 0.8;
    const isExactBrewster = hasBrewster && pol === "p" && Math.abs(thetaI_deg - thetaB_deg) < 0.05;

    // Relative wavelengths: lambda = lambda0 / n
    const lambda1 = 1 / Math.max(n1, 1e-4);
    const lambda2 = 1 / Math.max(n2, 1e-4);

    return {
      n1,
      n2,
      eta1,
      eta2,
      thI,
      cosI,
      sinI,
      thetaT_rad,
      thetaT_deg,
      cosT,
      sinT,
      Gamma,
      tau,
      R,
      T,
      swr,
      isTIR,
      hasCritical,
      thetaC_deg,
      hasBrewster,
      thetaB_deg,
      isAtBrewster,
      isExactBrewster,
      lambda1,
      lambda2,
    };
  }, [thetaI_deg, er1, er2, mr1, mr2, pol, pec]);
}

/* ================= Main Page Component ================= */
const WaveReflection: React.FC = () => {
  // Primary Control State
  const [thetaI, setThetaI] = useState<number>(45);
  const [pol, setPol] = useState<Polarization>("p");
  const [er1, setEr1] = useState<number>(1.0);
  const [er2, setEr2] = useState<number>(2.25);
  const [mr1, setMr1] = useState<number>(1.0);
  const [mr2, setMr2] = useState<number>(1.0);
  const [pec, setPec] = useState<boolean>(false);

  // Visualization View State
  const [showWavefronts, setShowWavefronts] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1.0);
  const [time, setTime] = useState<number>(0);

  // Physics calculation
  const phys = useWaveReflectionPhysics(thetaI, er1, er2, mr1, mr2, pol, pec);

  // Animation ticker
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      if (isPlaying) {
        const dt = (now - lastTime) * 0.001;
        setTime((t) => (t + dt * speed * 2.5) % 10000);
      }
      lastTime = now;
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, speed]);

  const [selectedPreset, setSelectedPreset] = useState<string>("Air → Glass (Dielectric Refraction)");

  const applyPreset = (p: Preset) => {
    setSelectedPreset(p.name);
    setThetaI(p.thetaI);
    setPol(p.pol);
    setEr1(p.er1);
    setMr1(p.mr1);
    setEr2(p.er2);
    setMr2(p.mr2);
    setPec(p.pec);
  };

  /* ------------------- 2D SVG Ray & Wavefront Geometry ------------------- */
  const svgW = 920;
  const svgH = 460;
  const midX = svgW / 2;
  const midY = svgH / 2; // interface line at y = midY

  const rayLength = 220;

  // Incident ray from top-left: dx = -sin(thI), dy = -cos(thI)
  const incStartX = midX - Math.sin(phys.thI) * rayLength;
  const incStartY = midY - Math.cos(phys.thI) * rayLength;

  // Reflected ray into Medium 1 (top-right): dx = +sin(thI), dy = -cos(thI)
  const refEndX = midX + Math.sin(phys.thI) * rayLength;
  const refEndY = midY - Math.cos(phys.thI) * rayLength;

  // Transmitted ray into Medium 2 (bottom-right): dx = +sin(thT), dy = +cos(thT)
  const trnEndX = midX + Math.sin(phys.thetaT_rad) * rayLength;
  const trnEndY = midY + Math.cos(phys.thetaT_rad) * rayLength;

  // Wavefront parameters
  const baseWf = 36;
  const wfSpacing1 = Math.max(14, baseWf * (phys.lambda1 / 1.0));
  const wfSpacing2 = Math.max(14, baseWf * (phys.lambda2 / 1.0));

  // Right-angle marker size at (midX, midY) during Brewster condition
  const perpSize = 24;
  const p1X = midX + Math.sin(phys.thI) * perpSize;
  const p1Y = midY - Math.cos(phys.thI) * perpSize;
  const p2X = midX + (Math.sin(phys.thI) + Math.sin(phys.thetaT_rad)) * perpSize;
  const p2Y = midY + (-Math.cos(phys.thI) + Math.cos(phys.thetaT_rad)) * perpSize;
  const p3X = midX + Math.sin(phys.thetaT_rad) * perpSize;
  const p3Y = midY + Math.cos(phys.thetaT_rad) * perpSize;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col border-t border-slate-300">
      {/* Page Title */}
      <div className="text-xl sm:text-2xl lg:text-3xl font-black uppercase text-center py-10 tracking-wide">
        Reflection &amp; Transmission of Plane Waves
      </div>

      {/* Intro Overview Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8 text-slate-700 leading-relaxed shadow-sm">
        When a uniform plane wave propagating in Medium 1 (<InlineMath math="\epsilon_1, \mu_1, \eta_1" />) meets a planar boundary with Medium 2 (<InlineMath math="\epsilon_2, \mu_2, \eta_2" />), boundary continuity of tangential <InlineMath math="\mathbf{E}" /> and <InlineMath math="\mathbf{H}" /> fields determines how the wave splits into a <b>reflected wave</b> and a <b>transmitted (refracted) wave</b>.
      </div>

      {/* Interactive Demo Section */}
      <div className="pb-10">
        <div className="text-xl font-black uppercase text-center py-4 tracking-wide">
          INTERACTIVE SIMULATION LAB
        </div>



        {/* Quick Presets Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Sparkles size={14} className="text-amber-500" />
            Quick Benchmark Presets
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p, idx) => {
              const isSelected = selectedPreset === p.name;
              return (
                <button
                  key={idx}
                  onClick={() => applyPreset(p)}
                  className={`px-3.5 py-1.5 rounded-lg border text-xs transition-all shadow-sm ${
                    isSelected
                      ? "bg-blue-600 border-blue-600 text-white font-bold shadow-blue-200"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-semibold"
                  }`}
                  title={p.desc}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Visualizer Card Container */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-md mb-6">
          {/* Main Visualizer Area (Clean White Themed Canvas) */}
          <div className="relative w-full rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm">
            <svg
                viewBox={`0 0 ${svgW} ${svgH}`}
                className="w-full h-auto block select-none bg-white"
                style={{ maxHeight: "540px" }}
              >
                <defs>
                  {/* Arrow markers */}
                  <marker id="arr-blue" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                    <polygon points="0 0, 8 4, 0 8" fill="#2563eb" />
                  </marker>
                  <marker id="arr-green" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                    <polygon points="0 0, 8 4, 0 8" fill="#059669" />
                  </marker>
                  <marker id="arr-orange" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                    <polygon points="0 0, 8 4, 0 8" fill="#d97706" />
                  </marker>

                  {/* Metallic hatch pattern for PEC */}
                  <pattern id="pecHatchLight" width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                    <rect width="12" height="12" fill="#f1f5f9" />
                    <line x1="0" y1="0" x2="0" y2="12" stroke="#94a3b8" strokeWidth="3" />
                  </pattern>
                </defs>

                {/* Medium 1 Background (Top Half) */}
                <rect x="0" y="0" width={svgW} height={midY} fill="#f0f7ff" />

                {/* Medium 2 Background (Bottom Half) */}
                {pec ? (
                  <rect x="0" y={midY} width={svgW} height={midY} fill="url(#pecHatchLight)" />
                ) : (
                  <rect x="0" y={midY} width={svgW} height={midY} fill="#fff7ed" />
                )}

                {/* Boundary Interface Line */}
                <line
                  x1="0"
                  y1={midY}
                  x2={svgW}
                  y2={midY}
                  stroke="#334155"
                  strokeWidth={pec ? "3" : "2"}
                />

                {/* Interface Label Badges */}
                <g transform={`translate(24, ${midY - 14})`}>
                  <rect x="0" y="-12" width="220" height="24" rx="6" fill="#ffffff" stroke="#bfdbfe" strokeWidth="1" />
                  <text x="10" y="4" fill="#1e40af" fontSize="11" fontWeight="700">
                    Medium 1: n₁ = {phys.n1.toFixed(2)} (η₁ = {phys.eta1.toFixed(1)} Ω)
                  </text>
                </g>

                <g transform={`translate(24, ${midY + 22})`}>
                  <rect x="0" y="-12" width="240" height="24" rx="6" fill="#ffffff" stroke={pec ? "#cbd5e1" : "#fed7aa"} strokeWidth="1" />
                  {pec ? (
                    <text x="10" y="4" fill="#475569" fontSize="11" fontWeight="700">
                      Medium 2: Perfect Conductor (PEC, η₂ = 0)
                    </text>
                  ) : (
                    <text x="10" y="4" fill="#9a3412" fontSize="11" fontWeight="700">
                      Medium 2: n₂ = {phys.n2.toFixed(2)} (η₂ = {phys.eta2.toFixed(1)} Ω)
                    </text>
                  )}
                </g>

                {/* Normal Dashed Line */}
                <line
                  x1={midX}
                  y1={24}
                  x2={midX}
                  y2={svgH - 24}
                  stroke="#64748b"
                  strokeDasharray="6 6"
                  strokeWidth="1.5"
                />
                <text x={midX + 8} y="38" fill="#475569" fontSize="11" fontWeight="700">
                  Normal Axis
                </text>

                {/* Source at Infinity (Equiphase Wavefronts) Badge */}
                {showWavefronts && (
                  <g transform="translate(24, 24)">
                    <rect x="0" y="0" width="275" height="26" rx="6" fill="#ffffff" stroke="#93c5fd" strokeWidth="1" />
                    <text x="10" y="17" fill="#1e40af" fontSize="11" fontWeight="700">
                      🌊 Equiphase Fronts (Source at ∞)
                    </text>
                  </g>
                )}

                {/* Uniform Plane Wave (UPW) Equiphase Vector Arrays (Source at Infinity) */}
                {showWavefronts && (
                  <g>
                    {/* 1. Incident Wave: Array of Synchronized Parallel Direction Vectors */}
                    {Array.from({ length: 7 }).map((_, i) => {
                      const totalL = rayLength + 40;
                      // Distance d from interface
                      const d = ((i * wfSpacing1 - time * 45) % totalL + totalL) % totalL;
                      const cx = midX - d * Math.sin(phys.thI);
                      const cy = midY - d * Math.cos(phys.thI);
                      
                      // Tangential direction across the beam: (-cos, sin)
                      const halfWidth = 80;
                      const tx = -Math.cos(phys.thI);
                      const ty = Math.sin(phys.thI);

                      // 5 parallel arrows in this equiphase rank
                      const arrowOffsets = [-0.8, -0.4, 0, 0.4, 0.8];
                      const arrowLen = 14;
                      const kx = Math.sin(phys.thI);
                      const ky = Math.cos(phys.thI);

                      return (
                        <g key={`inc-upw-${i}`} opacity={Math.max(0.2, 0.95 - (d / totalL) * 0.45)}>
                          {arrowOffsets.map((u, j) => {
                            const startX = cx + u * halfWidth * tx;
                            const startY = cy + u * halfWidth * ty;
                            const tipX = startX + kx * arrowLen;
                            const tipY = startY + ky * arrowLen;
                            if (startY > midY || tipY > midY || startY < 15) return null;

                            // Arrowhead wing points
                            const w1X = tipX - kx * 6 - tx * 4.5;
                            const w1Y = tipY - ky * 6 - ty * 4.5;
                            const w2X = tipX - kx * 6 + tx * 4.5;
                            const w2Y = tipY - ky * 6 + ty * 4.5;

                            return (
                              <g key={`inc-arr-${i}-${j}`}>
                                <line
                                  x1={startX}
                                  y1={startY}
                                  x2={tipX - kx * 3}
                                  y2={tipY - ky * 3}
                                  stroke="#2563eb"
                                  strokeWidth="2.2"
                                  strokeLinecap="round"
                                />
                                <polygon
                                  points={`${tipX},${tipY} ${w1X},${w1Y} ${w2X},${w2Y}`}
                                  fill="#2563eb"
                                />
                              </g>
                            );
                          })}
                        </g>
                      );
                    })}

                    {/* 2. Reflected Wave: Array of Synchronized Parallel Direction Vectors */}
                    {phys.R > 0.005 &&
                      Array.from({ length: 7 }).map((_, i) => {
                        const totalL = rayLength + 40;
                        const d = ((i * wfSpacing1 + time * 45) % totalL + totalL) % totalL;
                        const cx = midX + d * Math.sin(phys.thI);
                        const cy = midY - d * Math.cos(phys.thI);

                        const halfWidth = 80;
                        const tx = Math.cos(phys.thI);
                        const ty = Math.sin(phys.thI);

                        const arrowOffsets = [-0.8, -0.4, 0, 0.4, 0.8];
                        const arrowLen = 14;
                        const kx = Math.sin(phys.thI);
                        const ky = -Math.cos(phys.thI);

                        return (
                          <g
                            key={`ref-upw-${i}`}
                            opacity={Math.max(0.2, phys.R * (1 - (d / totalL) * 0.5))}
                          >
                            {arrowOffsets.map((u, j) => {
                              const startX = cx + u * halfWidth * tx;
                              const startY = cy + u * halfWidth * ty;
                              const tipX = startX + kx * arrowLen;
                              const tipY = startY + ky * arrowLen;
                              if (startY > midY || tipY > midY || startY < 15) return null;

                              const w1X = tipX - kx * 6 - tx * 4.5;
                              const w1Y = tipY - ky * 6 - ty * 4.5;
                              const w2X = tipX - kx * 6 + tx * 4.5;
                              const w2Y = tipY - ky * 6 + ty * 4.5;

                              return (
                                <g key={`ref-arr-${i}-${j}`}>
                                  <line
                                    x1={startX}
                                    y1={startY}
                                    x2={tipX - kx * 3}
                                    y2={tipY - ky * 3}
                                    stroke="#059669"
                                    strokeWidth="2.2"
                                    strokeLinecap="round"
                                  />
                                  <polygon
                                    points={`${tipX},${tipY} ${w1X},${w1Y} ${w2X},${w2Y}`}
                                    fill="#059669"
                                  />
                                </g>
                              );
                            })}
                          </g>
                        );
                      })}

                    {/* 3. Transmitted Wave: Array of Synchronized Parallel Direction Vectors */}
                    {!pec &&
                      !phys.isTIR &&
                      phys.T > 0.01 &&
                      Array.from({ length: 7 }).map((_, i) => {
                        const totalL = rayLength + 40;
                        const speed2 = 45 * (phys.n1 / phys.n2);
                        const d = ((i * wfSpacing2 + time * speed2) % totalL + totalL) % totalL;
                        const cx = midX + d * Math.sin(phys.thetaT_rad);
                        const cy = midY + d * Math.cos(phys.thetaT_rad);

                        const halfWidth = 80;
                        const tx = -Math.cos(phys.thetaT_rad);
                        const ty = Math.sin(phys.thetaT_rad);

                        const arrowOffsets = [-0.8, -0.4, 0, 0.4, 0.8];
                        const arrowLen = 14;
                        const kx = Math.sin(phys.thetaT_rad);
                        const ky = Math.cos(phys.thetaT_rad);

                        return (
                          <g
                            key={`trn-upw-${i}`}
                            opacity={Math.max(0.2, phys.T * (1 - (d / totalL) * 0.5))}
                          >
                            {arrowOffsets.map((u, j) => {
                              const startX = cx + u * halfWidth * tx;
                              const startY = cy + u * halfWidth * ty;
                              const tipX = startX + kx * arrowLen;
                              const tipY = startY + ky * arrowLen;
                              if (startY < midY || tipY < midY || startY > svgH - 15) return null;

                              const w1X = tipX - kx * 6 - tx * 4.5;
                              const w1Y = tipY - ky * 6 - ty * 4.5;
                              const w2X = tipX - kx * 6 + tx * 4.5;
                              const w2Y = tipY - ky * 6 + ty * 4.5;

                              return (
                                <g key={`trn-arr-${i}-${j}`}>
                                  <line
                                    x1={startX}
                                    y1={startY}
                                    x2={tipX - kx * 3}
                                    y2={tipY - ky * 3}
                                    stroke="#d97706"
                                    strokeWidth="2.2"
                                    strokeLinecap="round"
                                  />
                                  <polygon
                                    points={`${tipX},${tipY} ${w1X},${w1Y} ${w2X},${w2Y}`}
                                    fill="#d97706"
                                  />
                                </g>
                              );
                            })}
                          </g>
                        );
                      })}
                  </g>
                )}

                {/* Traveling Energy Pulse Dots along the Center Rays */}
                {Array.from({ length: 4 }).map((_, i) => {
                  const pulsePhase = ((time * 45 + i * 65) % rayLength) / rayLength;
                  
                  const incDotX = incStartX + pulsePhase * (midX - incStartX);
                  const incDotY = incStartY + pulsePhase * (midY - incStartY);

                  const refDotX = midX + pulsePhase * (refEndX - midX);
                  const refDotY = midY + pulsePhase * (refEndY - midY);

                  const trnDotX = midX + pulsePhase * (trnEndX - midX);
                  const trnDotY = midY + pulsePhase * (trnEndY - midY);

                  return (
                    <g key={`pulses-${i}`}>
                      <circle cx={incDotX} cy={incDotY} r="3.5" fill="#1d4ed8" opacity="0.9" />
                      {phys.R > 0.01 && (
                        <circle cx={refDotX} cy={refDotY} r={Math.max(2, 3.5 * Math.sqrt(phys.R))} fill="#047857" opacity={phys.R} />
                      )}
                      {!pec && !phys.isTIR && phys.T > 0.01 && (
                        <circle cx={trnDotX} cy={trnDotY} r={Math.max(2, 3.5 * Math.sqrt(phys.T))} fill="#b45309" opacity={phys.T} />
                      )}
                    </g>
                  );
                })}

                {/* Primary Rays */}
                {/* 1. Incident Ray */}
                <line
                  x1={incStartX}
                  y1={incStartY}
                  x2={midX}
                  y2={midY}
                  stroke="#2563eb"
                  strokeWidth="3.5"
                  markerEnd="url(#arr-blue)"
                />
                <text x={incStartX - 10} y={incStartY - 10} fill="#1d4ed8" fontSize="13" fontWeight="800">
                  Incident Wave (kᵢ)
                </text>

                {/* 2. Reflected Ray */}
                {phys.R > 0.005 ? (
                  <>
                    <line
                      x1={midX}
                      y1={midY}
                      x2={refEndX}
                      y2={refEndY}
                      stroke="#059669"
                      strokeWidth={Math.max(1.5, 4 * Math.sqrt(phys.R))}
                      markerEnd="url(#arr-green)"
                    />
                    <text x={refEndX + 8} y={refEndY - 10} fill="#047857" fontSize="13" fontWeight="800">
                      Reflected Wave (kᵣ) [R = {(phys.R * 100).toFixed(1)}%]
                    </text>
                  </>
                ) : (
                  // Ghost dashed line when reflected ray has vanished at Brewster Angle
                  <>
                    <line
                      x1={midX}
                      y1={midY}
                      x2={refEndX}
                      y2={refEndY}
                      stroke="#10b981"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      opacity="0.35"
                    />
                    <text x={refEndX + 8} y={refEndY - 10} fill="#059669" fontSize="12" fontWeight="700" opacity="0.8">
                      Reflected Ray: Vanished (R = 0%)
                    </text>
                  </>
                )}

                {/* 3. Transmitted Ray */}
                {!pec && !phys.isTIR && phys.T > 0.001 && (
                  <>
                    <line
                      x1={midX}
                      y1={midY}
                      x2={trnEndX}
                      y2={trnEndY}
                      stroke="#d97706"
                      strokeWidth={Math.max(1.5, 4 * Math.sqrt(phys.T))}
                      markerEnd="url(#arr-orange)"
                    />
                    <text x={trnEndX + 8} y={trnEndY + 18} fill="#b45309" fontSize="13" fontWeight="800">
                      Transmitted Wave (kₜ) [T = {(phys.T * 100).toFixed(1)}%]
                    </text>
                  </>
                )}

                {/* Brewster 90-degree Right Angle Symbol */}
                {phys.isAtBrewster && !pec && !phys.isTIR && (
                  <g>
                    <path
                      d={`M ${p1X} ${p1Y} L ${p2X} ${p2Y} L ${p3X} ${p3Y}`}
                      fill="none"
                      stroke="#059669"
                      strokeWidth="2"
                    />
                    <text
                      x={midX + 34}
                      y={midY - 4}
                      fill="#065f46"
                      fontSize="11"
                      fontWeight="800"
                    >
                      90° (θB + θt = 90°)
                    </text>
                  </g>
                )}

                {/* TIR Indicator */}
                {phys.isTIR && (
                  <g transform={`translate(${midX + 40}, ${midY + 40})`}>
                    <rect x="0" y="0" width="220" height="42" rx="6" fill="#fff1f2" stroke="#f43f5e" strokeWidth="1" />
                    <text x="12" y="18" fill="#9f1239" fontSize="12" fontWeight="700">
                      Total Internal Reflection (TIR)
                    </text>
                    <text x="12" y="32" fill="#be123c" fontSize="10">
                      θᵢ &gt; θc (T = 0%, R = 100%)
                    </text>
                  </g>
                )}

                {/* Angle Arcs - rendered cleanly only for oblique angles (thetaI >= 3 deg) */}
                {thetaI >= 3.0 ? (
                  <>
                    {/* theta_i Arc */}
                    <path
                      d={`M ${midX} ${midY} L ${midX - Math.sin(phys.thI) * 55} ${midY - Math.cos(phys.thI) * 55} A 55 55 0 0 1 ${midX} ${midY - 55} Z`}
                      fill="#3b82f6"
                      opacity="0.18"
                    />
                    <text x={midX - Math.sin(phys.thI / 2) * 72 - 6} y={midY - Math.cos(phys.thI / 2) * 72} fill="#1e40af" fontSize="12" fontWeight="800">
                      θᵢ={thetaI.toFixed(1)}°
                    </text>

                    {/* theta_r Arc */}
                    <path
                      d={`M ${midX} ${midY} L ${midX} ${midY - 55} A 55 55 0 0 1 ${midX + Math.sin(phys.thI) * 55} ${midY - Math.cos(phys.thI) * 55} Z`}
                      fill="#10b981"
                      opacity={phys.isAtBrewster ? 0.08 : 0.18}
                    />
                    <text x={midX + Math.sin(phys.thI / 2) * 72 - 8} y={midY - Math.cos(phys.thI / 2) * 72} fill="#065f46" fontSize="12" fontWeight="800">
                      θᵣ={thetaI.toFixed(1)}°
                    </text>

                    {/* theta_t Arc */}
                    {!pec && !phys.isTIR && (
                      <>
                        <path
                          d={`M ${midX} ${midY} L ${midX} ${midY + 55} A 55 55 0 0 0 ${midX + Math.sin(phys.thetaT_rad) * 55} ${midY + Math.cos(phys.thetaT_rad) * 55} Z`}
                          fill="#f59e0b"
                          opacity="0.18"
                        />
                        <text x={midX + Math.sin(phys.thetaT_rad / 2) * 72 - 8} y={midY + Math.cos(phys.thetaT_rad / 2) * 72 + 10} fill="#92400e" fontSize="12" fontWeight="800">
                          θₜ={phys.thetaT_deg.toFixed(1)}°
                        </text>
                      </>
                    )}
                  </>
                ) : (
                  // Clean Normal Incidence indicator badge
                  <g transform={`translate(${midX - 90}, 50)`}>
                    <rect x="0" y="0" width="180" height="24" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
                    <text x="90" y="16" fill="#334155" fontSize="11" fontWeight="700" textAnchor="middle">
                      Normal Incidence (θᵢ = 0°)
                    </text>
                  </g>
                )}

                {/* Brewster and Critical Angle Badges */}
                {phys.isAtBrewster && (
                  <g transform={`translate(${svgW - 290}, 24)`}>
                    <rect x="0" y="0" width="270" height="52" rx="8" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
                    <text x="12" y="19" fill="#065f46" fontSize="12" fontWeight="800">
                      🌟 Brewster Angle Active (θB = {phys.thetaB_deg.toFixed(2)}°)
                    </text>
                    <text x="12" y="34" fill="#047857" fontSize="11" fontWeight="600">
                      Parallel Pol: Γ∥ = 0.000, Reflected Power R = 0%
                    </text>
                    <text x="12" y="46" fill="#065f46" fontSize="10">
                      Perpendicular condition: θB + θt = 90.0°
                    </text>
                  </g>
                )}

                {/* PEC Conductor Highlight Badge */}
                {pec && (
                  <g transform={`translate(${svgW - 300}, 24)`}>
                    <rect x="0" y="0" width="280" height="48" rx="8" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
                    <text x="12" y="18" fill="#1e293b" fontSize="11" fontWeight="800">
                      🛡️ Conductor Boundary (PEC, η₂ = 0)
                    </text>
                    <text x="12" y="32" fill="#475569" fontSize="10">
                      Total Reflection: Γ = -1.0, τ = 0.0 (R = 100%)
                    </text>
                    <text x="12" y="44" fill="#047857" fontSize="10" fontWeight="600">
                      Forms pure stationary standing wave (s = ∞)
                    </text>
                  </g>
                )}

                {phys.hasCritical && !isNaN(phys.thetaC_deg) && (
                  <g transform={`translate(24, ${svgH - 42})`}>
                    <rect x="0" y="0" width="210" height="26" rx="6" fill="#ffffff" stroke="#fca5a5" strokeWidth="1" />
                    <text x="10" y="17" fill="#991b1b" fontSize="11" fontWeight="700">
                      Critical Angle: θc = {phys.thetaC_deg.toFixed(2)}°
                    </text>
                  </g>
                )}

                {/* Polarization Label */}
                <g transform={`translate(${svgW - 170}, ${svgH - 42})`}>
                  <rect x="0" y="0" width="150" height="26" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
                  <text x="10" y="17" fill="#334155" fontSize="11" fontWeight="700">
                    Pol: {pol === "s" ? "Horizontal (H, ⊥)" : "Vertical (V, ∥)"}
                  </text>
                </g>
              </svg>
          </div>

          {/* Interactive Controls & Live Metrics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            {/* Left 7 Columns: Interactive Sliders & Parameters */}
            <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                  <Sliders size={16} className="text-blue-600" />
                  Wave &amp; Media Parameters
                </div>
                {/* Play / Pause / Reset Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1.5 rounded-md bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
                    title={isPlaying ? "Pause Simulation" : "Play Simulation"}
                  >
                    {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                  </button>
                  <button
                    onClick={() => {
                      setTime(0);
                    }}
                    className="p-1.5 rounded-md bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
                    title="Reset Time"
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>
              </div>

              {/* Angle Slider */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                  <span>Incidence Angle (θᵢ)</span>
                  <div className="flex items-center gap-2">
                    {phys.hasBrewster && (
                      <button
                        onClick={() => {
                          setThetaI(parseFloat(phys.thetaB_deg.toFixed(2)));
                          setPol("p");
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded transition"
                        title="Snap directly to Brewster Angle"
                      >
                        <Target size={12} />
                        Snap to θB ({phys.thetaB_deg.toFixed(1)}°)
                      </button>
                    )}
                    <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {thetaI.toFixed(1)}°
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="89"
                  step="0.1"
                  value={thetaI}
                  onChange={(e) => setThetaI(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Polarization Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Polarization State
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPol("s")}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                      pol === "s"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <Radio size={14} />
                    Horizontal (H / ⊥ / TE)
                  </button>
                  <button
                    onClick={() => setPol("p")}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                      pol === "p"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <Radio size={14} />
                    Vertical (V / ∥ / TM)
                  </button>
                </div>
              </div>

              {/* Media Constitutive Properties */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                {/* Medium 1 */}
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <div className="text-xs font-bold text-blue-700 mb-2">Medium 1 (Incident)</div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>Relative Permittivity (εr₁)</span>
                        <span className="font-bold">{er1.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="16"
                        step="0.25"
                        value={er1}
                        onChange={(e) => setEr1(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>Relative Permeability (μr₁)</span>
                        <span className="font-bold">{mr1.toFixed(1)}</span>
                      </div>
                      <input
                        type="number"
                        min="0.1"
                        max="10"
                        step="0.1"
                        value={mr1}
                        onChange={(e) => setMr1(Math.max(0.1, parseFloat(e.target.value) || 1))}
                        className="w-full text-xs p-1 border rounded"
                      />
                    </div>
                  </div>
                </div>

                {/* Medium 2 */}
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-bold text-amber-700">Medium 2 (Transmitted)</div>
                    <label className="inline-flex items-center gap-1 cursor-pointer text-xs font-bold text-slate-600">
                      <input
                        type="checkbox"
                        checked={pec}
                        onChange={(e) => setPec(e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 accent-blue-600"
                      />
                      PEC Conductor
                    </label>
                  </div>
                  {!pec ? (
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs text-slate-600">
                          <span>Relative Permittivity (εr₂)</span>
                          <span className="font-bold">{er2.toFixed(2)}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="25"
                          step="0.25"
                          value={er2}
                          onChange={(e) => setEr2(parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-amber-600"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-slate-600">
                          <span>Relative Permeability (μr₂)</span>
                          <span className="font-bold">{mr2.toFixed(1)}</span>
                        </div>
                        <input
                          type="number"
                          min="0.1"
                          max="10"
                          step="0.1"
                          value={mr2}
                          onChange={(e) => setMr2(Math.max(0.1, parseFloat(e.target.value) || 1))}
                          className="w-full text-xs p-1 border rounded"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 py-4 text-center">
                      Perfect Conductor (PEC, σ₂ = ∞) active. Electric field inside is zero (<InlineMath math="\mathbf{E}_2 = 0" />).
                    </div>
                  )}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs text-slate-600">
                <label className="inline-flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={showWavefronts}
                    onChange={(e) => setShowWavefronts(e.target.checked)}
                    className="accent-blue-600 rounded"
                  />
                  Show Equiphase Wavefronts (Source at ∞)
                </label>
                <div className="flex items-center gap-2">
                  <span>Speed:</span>
                  <input
                    type="range"
                    min="0.2"
                    max="2.5"
                    step="0.1"
                    value={speed}
                    onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    className="w-20 h-1.5 bg-slate-200 rounded accent-blue-600"
                  />
                  <span className="font-bold">{speed.toFixed(1)}x</span>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Real-Time Diagnostic Dashboard */}
            <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm border-b border-slate-200 pb-3 mb-4">
                  <Zap size={16} className="text-amber-500" />
                  Real-Time Physical Quantities
                </div>

                {/* Power Split Gauge */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                    <span>Power Fractions: R vs T</span>
                    <span>
                      R: {(phys.R * 100).toFixed(1)}% | T: {(phys.T * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden flex border border-slate-300">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-200 flex items-center justify-center text-[10px] text-white font-bold"
                      style={{ width: `${phys.R * 100}%` }}
                    >
                      {phys.R > 0.15 ? `R ${(phys.R * 100).toFixed(0)}%` : ""}
                    </div>
                    <div
                      className="bg-amber-500 h-full transition-all duration-200 flex items-center justify-center text-[10px] text-white font-bold"
                      style={{ width: `${phys.T * 100}%` }}
                    >
                      {phys.T > 0.15 ? `T ${(phys.T * 100).toFixed(0)}%` : ""}
                    </div>
                  </div>
                </div>

                {/* Metric Badges Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="text-slate-500 block">Reflection Coeff (Γ)</span>
                    <span className="font-bold text-slate-800 text-sm">
                      {phys.Gamma.toFixed(3)}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="text-slate-500 block">Transmission Coeff (τ)</span>
                    <span className="font-bold text-slate-800 text-sm">
                      {pec ? "0.000" : phys.tau.toFixed(3)}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="text-slate-500 block">Refraction Angle (θₜ)</span>
                    <span className="font-bold text-slate-800 text-sm">
                      {pec ? "N/A (PEC)" : phys.isTIR ? "90° (TIR)" : `${phys.thetaT_deg.toFixed(1)}°`}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="text-slate-500 block">Standing Wave Ratio (s)</span>
                    <span className="font-bold text-slate-800 text-sm">
                      {phys.swr === Infinity ? "∞" : phys.swr.toFixed(2)}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="text-slate-500 block">Brewster Angle (θB)</span>
                    <span className="font-bold text-slate-800 text-sm">
                      {phys.hasBrewster ? `${phys.thetaB_deg.toFixed(1)}°` : "N/A"}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="text-slate-500 block">Critical Angle (θc)</span>
                    <span className="font-bold text-slate-800 text-sm">
                      {phys.hasCritical ? `${phys.thetaC_deg.toFixed(1)}°` : "None (n₁ ≤ n₂)"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status summary callout */}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 leading-relaxed">
                {phys.isAtBrewster ? (
                  <span className="font-semibold text-emerald-800">
                    🌟 Brewster condition met: The parallel-polarized wave has zero reflection (<InlineMath math="\Gamma_\parallel = 0" />). Reflected and refracted rays are perpendicular (<InlineMath math="\theta_B + \theta_t = 90^\circ" />).
                  </span>
                ) : phys.isTIR ? (
                  <span className="font-semibold text-rose-800">
                    ⚡ Total Internal Reflection: <InlineMath math="\theta_i > \theta_c" />. 100% of power is reflected.
                  </span>
                ) : pec ? (
                  <span className="font-semibold text-slate-800">
                    🛡️ Conductor Boundary: Tangential <InlineMath math="\mathbf{E} = 0" /> gives <InlineMath math="\Gamma = -1" /> and pure standing wave (s = ∞).
                  </span>
                ) : (
                  <span>
                    Adheres to Snell&apos;s Law: <InlineMath math="n_1 \sin\theta_i = n_2 \sin\theta_t" /> with power conservation <InlineMath math="R + T = 1" />.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          THEORY & MATHEMATICAL DERIVATIONS
      ========================================================================= */}

      {/* 1. Plane Wave at Normal Incidence */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 mb-10 shadow-sm">
        <h2 className="text-lg sm:text-xl font-black mb-4">
          1. Plane Waves at Normal Incidence (<InlineMath math="\theta_i = 0^\circ" />)
        </h2>
        <p className="mb-3">
          Consider a uniform plane wave traveling in the <InlineMath math="+z" /> direction in Medium 1 (<InlineMath math="\epsilon_1, \mu_1, \eta_1" />) normally incident (<InlineMath math="\theta_i = 0^\circ" />) on a planar boundary at <InlineMath math="z = 0" />:
        </p>

        <div className="bg-white border rounded-lg p-4 sm:p-6 my-4 flex flex-col items-center gap-4">
          <BlockMath math={"\\mathbf{E}_i(z,t) = E_{io} \\cos(\\omega t - \\beta_1 z)\\,\\mathbf{a}_x, \\qquad \\mathbf{H}_i(z,t) = \\frac{E_{io}}{\\eta_1} \\cos(\\omega t - \\beta_1 z)\\,\\mathbf{a}_y"} />
          <BlockMath math={"\\mathbf{E}_r(z,t) = E_{ro} \\cos(\\omega t + \\beta_1 z)\\,\\mathbf{a}_x, \\qquad \\mathbf{H}_r(z,t) = -\\frac{E_{ro}}{\\eta_1} \\cos(\\omega t + \\beta_1 z)\\,\\mathbf{a}_y"} />
          <BlockMath math={"\\mathbf{E}_t(z,t) = E_{to} \\cos(\\omega t - \\beta_2 z)\\,\\mathbf{a}_x, \\qquad \\mathbf{H}_t(z,t) = \\frac{E_{to}}{\\eta_2} \\cos(\\omega t - \\beta_2 z)\\,\\mathbf{a}_y"} />
        </div>

        <p className="mb-2">
          Applying boundary conditions at <InlineMath math="z = 0" /> (continuity of tangential <InlineMath math="\mathbf{E}" /> and <InlineMath math="\mathbf{H}" /> fields):
        </p>

        <div className="bg-white border rounded-lg p-4 sm:p-6 my-4 flex flex-col items-center gap-4">
          <BlockMath math={"E_{io} + E_{ro} = E_{to} \\implies 1 + \\Gamma = \\tau"} />
          <BlockMath math={"\\Gamma = \\frac{E_{ro}}{E_{io}} = \\frac{\\eta_2 - \\eta_1}{\\eta_2 + \\eta_1} \\qquad \\text{(Reflection Coefficient)}"} />
          <BlockMath math={"\\tau = \\frac{E_{to}}{E_{io}} = \\frac{2\\eta_2}{\\eta_2 + \\eta_1} = 1 + \\Gamma \\qquad \\text{(Transmission Coefficient)}"} />
        </div>

        <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-md mt-4">
          <p className="font-semibold mb-2">Power Reflection &amp; Transmission Relations:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>
              <b>Reflectance (R):</b> <InlineMath math="R = \frac{P_{r,avg}}{P_{i,avg}} = |\Gamma|^2" />
            </li>
            <li>
              <b>Transmittance (T):</b> <InlineMath math="T = \frac{P_{t,avg}}{P_{i,avg}} = \frac{\eta_1}{\eta_2} |\tau|^2 = 1 - R" />
            </li>
          </ul>
        </div>
      </div>

      {/* 2. Standing Wave Ratio (SWR) & Total Reflection at PEC */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 mb-10 shadow-sm">
        <h2 className="text-lg sm:text-xl font-black mb-4">
          2. Standing Waves &amp; Standing Wave Ratio (SWR)
        </h2>
        <p className="mb-3">
          The superposition of the forward-traveling incident wave and backward-traveling reflected wave in Medium 1 produces a standing wave. The ratio of the maximum to minimum electric field magnitude defines the <b>Standing Wave Ratio (<InlineMath math="s" />)</b>:
        </p>

        <div className="bg-white border rounded-lg p-4 sm:p-6 my-4 flex flex-col items-center gap-4">
          <BlockMath math={"|E_1|_{max} = E_{io}\\,(1 + |\\Gamma|), \\qquad |E_1|_{min} = E_{io}\\,(1 - |\\Gamma|)"} />
          <BlockMath math={"s = \\frac{|E_1|_{max}}{|E_1|_{min}} = \\frac{1 + |\\Gamma|}{1 - |\\Gamma|}"} />
        </div>

        <p className="mt-4 font-semibold text-slate-800">
          Special Case: Reflection from a Perfect Electric Conductor (PEC, <InlineMath math="\eta_2 = 0" />)
        </p>
        <p className="mt-2 text-sm">
          When Medium 2 is a perfect conductor (<InlineMath math="\sigma_2 = \\infty \\implies \\eta_2 = 0" />), total reflection occurs (<InlineMath math="\Gamma = -1" /> and <InlineMath math="\tau = 0" />). The total fields in Medium 1 become a pure stationary standing wave:
        </p>

        <div className="bg-white border rounded-lg p-4 sm:p-6 my-4 flex flex-col items-center gap-4">
          <BlockMath math={"\\mathbf{E}_1(z,t) = 2 E_{io} \\sin(\\beta_1 z) \\sin(\\omega t)\\,\\mathbf{a}_x"} />
          <BlockMath math={"\\mathbf{H}_1(z,t) = \\frac{2 E_{io}}{\\eta_1} \\cos(\\beta_1 z) \\cos(\\omega t)\\,\\mathbf{a}_y"} />
        </div>

        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-md mt-4 text-sm text-amber-900">
          <b>Key Property:</b> Because <InlineMath math="\mathbf{E}_1" /> and <InlineMath math="\mathbf{H}_1" /> are in time quadrature (90° out of phase), the time-average power flow is identically zero (<InlineMath math="\mathbf{P}_{avg} = \\mathbf{0}" />). The standing wave ratio is infinite (<InlineMath math="s = \\infty" />). Nodes of <InlineMath math="\mathbf{E}_1" /> occur at <InlineMath math="z = -n\lambda_1/2" />.
        </div>
      </div>

      {/* 3. Plane Waves at Oblique Incidence & Snell's Law */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 mb-10 shadow-sm">
        <h2 className="text-lg sm:text-xl font-black mb-4">
          3. Oblique Incidence &amp; Snell’s Law
        </h2>
        <p className="mb-3">
          For a plane wave incident at an angle <InlineMath math="\theta_i" /> relative to the normal of the interface, phase matching along the boundary requires:
        </p>

        <div className="bg-white border rounded-lg p-4 sm:p-6 my-4 flex flex-col items-center gap-4">
          <BlockMath math={"\\beta_1 \\sin\\theta_i = \\beta_2 \\sin\\theta_t"} />
          <BlockMath math={"n_1 \\sin\\theta_i = n_2 \\sin\\theta_t \\qquad \\text{(Snell's Law of Refraction)}"} />
          <BlockMath math={"\\theta_r = \\theta_i \\qquad \\text{(Law of Reflection)}"} />
        </div>
      </div>

      {/* 4. Fresnel Reflection & Transmission Coefficients */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 mb-10 shadow-sm">
        <h2 className="text-lg sm:text-xl font-black mb-4">
          4. Horizontal (H / ⊥) vs. Vertical (V / ∥) Polarization (Fresnel Formulas)
        </h2>

        {/* Horizontal Polarization */}
        <div className="mb-6">
          <h3 className="font-bold text-slate-800 mb-2">
            A) Horizontal Polarization (<InlineMath math="\mathbf{E}_H" />, <InlineMath math="\perp" />, TE wave):
          </h3>
          <p className="text-sm mb-2 text-slate-600">
            Electric field <InlineMath math="\mathbf{E}" /> is perpendicular to the plane of incidence (horizontal / parallel to the boundary plane):
          </p>
          <div className="bg-white border rounded-lg p-4 sm:p-6 my-3 flex flex-col items-center gap-4">
            <BlockMath math={"\\Gamma_H = \\Gamma_\\perp = \\frac{E_{ro}}{E_{io}} = \\frac{\\eta_2 \\cos\\theta_i - \\eta_1 \\cos\\theta_t}{\\eta_2 \\cos\\theta_i + \\eta_1 \\cos\\theta_t}"} />
            <BlockMath math={"\\tau_H = \\tau_\\perp = \\frac{E_{to}}{E_{io}} = \\frac{2\\eta_2 \\cos\\theta_i}{\\eta_2 \\cos\\theta_i + \\eta_1 \\cos\\theta_t} = 1 + \\Gamma_H"} />
          </div>
        </div>

        {/* Vertical Polarization */}
        <div>
          <h3 className="font-bold text-slate-800 mb-2">
            B) Vertical Polarization (<InlineMath math="\mathbf{E}_V" />, <InlineMath math="\parallel" />, TM wave):
          </h3>
          <p className="text-sm mb-2 text-slate-600">
            Electric field <InlineMath math="\mathbf{E}" /> lies within the plane of incidence (has a vertical component relative to the boundary):
          </p>
          <div className="bg-white border rounded-lg p-4 sm:p-6 my-3 flex flex-col items-center gap-4">
            <BlockMath math={"\\Gamma_V = \\Gamma_\\parallel = \\frac{E_{ro}}{E_{io}} = \\frac{\\eta_2 \\cos\\theta_t - \\eta_1 \\cos\\theta_i}{\\eta_2 \\cos\\theta_t + \\eta_1 \\cos\\theta_i}"} />
            <BlockMath math={"\\tau_V = \\tau_\\parallel = \\frac{E_{to}}{E_{io}} = \\frac{2\\eta_2 \\cos\\theta_i}{\\eta_2 \\cos\\theta_t + \\eta_1 \\cos\\theta_i}"} />
          </div>
        </div>
      </div>

      {/* 5. Brewster Angle & Total Internal Reflection */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 mb-10 shadow-sm">
        <h2 className="text-lg sm:text-xl font-black mb-4">
          5. Brewster Angle &amp; Total Internal Reflection (TIR)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Brewster Angle Card */}
          <div className="bg-white p-5 rounded-lg border border-slate-200">
            <h3 className="font-black text-slate-800 mb-2 flex items-center gap-2">
              <Sparkles size={16} className="text-emerald-600" />
              Brewster Angle (<InlineMath math="\theta_B" />)
            </h3>
            <p className="text-xs text-slate-600 mb-3">
              The angle of incidence for Vertical (<InlineMath math="\mathbf{E}_V" /> / <InlineMath math="\parallel" />) polarization where the reflection coefficient is zero (<InlineMath math="\Gamma_V = 0" />).
            </p>
            <div className="flex justify-center my-2">
              <BlockMath math={"\\tan\\theta_B = \\sqrt{\\frac{\\epsilon_2}{\\epsilon_1}} = \\frac{n_2}{n_1} \\quad (\\mu_1 = \\mu_2)"} />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              At Brewster&apos;s angle, the reflected and transmitted rays are perpendicular: <InlineMath math="\theta_B + \theta_t = 90^\circ" />.
            </p>
          </div>

          {/* Critical Angle Card */}
          <div className="bg-white p-5 rounded-lg border border-slate-200">
            <h3 className="font-black text-slate-800 mb-2 flex items-center gap-2">
              <Zap size={16} className="text-rose-600" />
              Critical Angle (<InlineMath math="\theta_c" />) &amp; TIR
            </h3>
            <p className="text-xs text-slate-600 mb-3">
              When a wave travels from an optically denser to a rarer medium (<InlineMath math="n_1 > n_2" />), the refraction angle reaches 90° at <InlineMath math="\theta_c" />:
            </p>
            <div className="flex justify-center my-2">
              <BlockMath math={"\\sin\\theta_c = \\frac{n_2}{n_1} \\implies \\theta_c = \\arcsin\\left(\\frac{n_2}{n_1}\\right)"} />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              For <InlineMath math="\theta_i > \theta_c" />, Total Internal Reflection occurs with 100% power reflected back into Medium 1.
            </p>
          </div>
        </div>
      </div>

      {/* 6. Summary Reference Table */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 mb-10 shadow-sm">
        <h2 className="text-lg sm:text-xl font-black mb-4">
          6. Summary Reference Table
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-slate-200 rounded-lg overflow-hidden text-xs sm:text-sm">
            <thead className="bg-slate-100 border-b border-slate-200 text-slate-800 font-bold">
              <tr>
                <th className="py-3 px-4 text-left">Case</th>
                <th className="py-3 px-4 text-left">Condition</th>
                <th className="py-3 px-4 text-left">Key Formula</th>
                <th className="py-3 px-4 text-left">Physical Interpretation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              <tr>
                <td className="py-3 px-4 font-semibold">Normal Incidence</td>
                <td className="py-3 px-4"><InlineMath math="\theta_i = 0^\circ" /></td>
                <td className="py-3 px-4"><InlineMath math="\Gamma = \frac{\eta_2 - \eta_1}{\eta_2 + \eta_1}, \\; \tau = \frac{2\eta_2}{\eta_2 + \eta_1}" /></td>
                <td className="py-3 px-4">Partial reflection &amp; transmission. Standing wave in Medium 1.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">PEC Boundary</td>
                <td className="py-3 px-4"><InlineMath math="\eta_2 = 0" /></td>
                <td className="py-3 px-4"><InlineMath math="\Gamma = -1, \\; \tau = 0, \\; s = \\infty" /></td>
                <td className="py-3 px-4">Pure stationary standing wave. Zero average power transmitted.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">Brewster Angle</td>
                <td className="py-3 px-4">Parallel Pol, <InlineMath math="\theta_i = \theta_B" /></td>
                <td className="py-3 px-4"><InlineMath math="\tan\theta_B = \sqrt{\epsilon_2/\epsilon_1} = n_2/n_1" /></td>
                <td className="py-3 px-4">Zero reflected power (<InlineMath math="\Gamma_\parallel = 0, R = 0" />). Total transmission.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">Total Internal Reflection</td>
                <td className="py-3 px-4"><InlineMath math="n_1 > n_2, \\; \theta_i > \theta_c" /></td>
                <td className="py-3 px-4"><InlineMath math="\sin\theta_c = n_2/n_1, \\; R = 1" /></td>
                <td className="py-3 px-4">100% of power reflected back into denser medium.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WaveReflection;