import React, { useMemo, useState, useEffect } from "react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import "./wave_reflection.css";

/* ============================================================
   Inline LaTeX helper (no new files needed)
   Usage: math={tex`\Gamma = \frac{Z_2 - Z_1}{Z_2 + Z_1}`}
============================================================ */
const tex = (lits: TemplateStringsArray, ...subs: any[]) => String.raw(lits, ...subs);

/* ============================================================
   Inline 2D visualization (SVG) — WaveReflection2D
   (no separate file; everything lives here)
============================================================ */
const ETA0 = 376.730313668; // Ω
const deg2rad = (d: number) => (d * Math.PI) / 180;
const rad2deg = (r: number) => (r * 180) / Math.PI;
type Pol = "s" | "p";

function useFresnel(thetaI_deg: number, er1: number, er2: number, mr1: number, mr2: number, pol: Pol, pec: boolean) {
  return useMemo(() => {
    const thI = deg2rad(thetaI_deg);
    const n1 = Math.sqrt(er1 * mr1);
    const n2 = Math.sqrt(er2 * mr2);
    const eta1 = ETA0 * Math.sqrt(mr1 / er1);
    const eta2 = pec ? 0 : ETA0 * Math.sqrt(mr2 / er2);

    const si = Math.sin(thI);
    const ci = Math.cos(thI);

    // Snell
    let st = (n1 / Math.max(n2, 1e-9)) * si;
    let tir = false;
    if (st > 1 && !pec) { st = 1; tir = true; }
    const ct = tir ? 0 : Math.sqrt(Math.max(0, 1 - st * st));
    const thetaT = tir ? NaN : Math.asin((n1 / Math.max(n2, 1e-9)) * si);

    // Fresnel (field)
    let Gamma = 0, t = 0;
    if (pec) { Gamma = -1; t = 0; }
    else if (pol === "p") {
      const num = eta2 * ct - eta1 * ci;
      const den = eta2 * ct + eta1 * ci;
      Gamma = den === 0 ? 1 : num / den;
      t     = den === 0 ? 0 : (2 * eta2 * ci) / den;
    } else {
      const num = eta2 * ci - eta1 * ct;
      const den = eta2 * ci + eta1 * ct;
      Gamma = den === 0 ? 1 : num / den;
      t     = den === 0 ? 0 : (2 * eta2 * ci) / den;
    }

    const R = Math.min(1, Math.max(0, Gamma * Gamma));
    let T = 0;
    if (!pec && !tir) T = (n2 * ct) / (n1 * ci) * (t * t);

    // Brewster (p-pol; common μr1=μr2)
    const brewsterP = mr1 === mr2 ? Math.atan(Math.sqrt((er2 * mr2) / (er1 * mr1))) : NaN;

    // λ ∝ 1/n (same frequency)
    const lambda1 = 1 / Math.max(n1, 1e-6);
    const lambda2 = 1 / Math.max(n2, 1e-6);

    // Critical angle
    const hasCritical = n1 > n2;
    const thetaC = hasCritical ? Math.asin(Math.min(1, n2 / n1)) : NaN;

    return { n1, n2, eta1, eta2, thetaT, R, T, Gamma, t, tir, brewsterP, lambda1, lambda2, thetaC, hasCritical };
  }, [thetaI_deg, er1, er2, mr1, mr2, pol, pec]);
}

type Pt = { x: number; y: number };
const pt = (x: number, y: number): Pt => ({ x, y });

function endPointFromNormal(origin: Pt, angleFromNormalRad: number, len: number, horizontalSign: 1 | -1): Pt {
  // Angle measured from upward normal. SVG y increases downward.
  const a = angleFromNormalRad;
  const dx = Math.sin(a) * horizontalSign;
  const dy = Math.cos(a);
  return pt(origin.x + dx * len, origin.y + dy * len);
}

function useTicker() {
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf = 0;
    const tick = () => { setT((x) => (x + 1) % 100000); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return t;
}

interface WaveReflection2DProps {
  thetaI?: number; er1?: number; er2?: number; mr1?: number; mr2?: number; pol?: Pol; pec?: boolean;
  showWavefronts?: boolean; width?: number; height?: number;
}

const WaveReflection2D: React.FC<WaveReflection2DProps> = ({
  thetaI = 30, er1 = 1, er2 = 2.25, mr1 = 1, mr2 = 1, pol = "p", pec = false, showWavefronts = true,
  width = 980, height = 480,
}) => {
  const midX = width / 2;
  const midY = height / 2; // interface
  const normalTop = pt(midX, 28);
  const hit = pt(midX, midY);

  const f = useFresnel(thetaI, Math.max(0.01, er1), Math.max(0.01, er2), mr1, mr2, pol, pec);

  const thI = deg2rad(thetaI);
  const thT = f.tir || pec || isNaN(f.thetaT) ? 0 : f.thetaT!;

  // Rays
  const incStart = endPointFromNormal(hit, thI, 200, -1);
  const refEnd   = endPointFromNormal(hit, thI, 200, +1);
  const trnEnd   = endPointFromNormal(hit, thT, 200, -1);

  // Energy arrows (visual)
  const refLen = Math.max(24, Math.sqrt(Math.max(0, f.R))) * 80;
  const trnLen = Math.max(24, Math.sqrt(Math.max(0, f.T))) * 80;

  const ticker = useTicker();

  // Wavefront spacing (px) — scaled by λ
  const wf1 = Math.max(10, f.lambda1 * 110);
  const wf2 = Math.max(10, f.lambda2 * 110);

  const atBrewster = pol === "p" && !f.tir && !pec && Math.abs(f.Gamma) < 0.05;
  const showθc = f.hasCritical && !isNaN(f.thetaC);

  return (
    <svg className="wave2d-svg" width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        {/* Arrowheads */}
        <marker id="ah-blue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="#2563eb" />
        </marker>
        <marker id="ah-green" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="#10b981" />
        </marker>
        <marker id="ah-orange" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="#f59e0b" />
        </marker>

        {/* Wavefront dash patterns */}
        <pattern id="wf1" width={wf1} height="6" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="2" height="6" fill="#3b82f6" opacity="0.85" />
        </pattern>
        <pattern id="wf2" width={wf2} height="6" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="2" height="6" fill="#f59e0b" opacity="0.85" />
        </pattern>
      </defs>

      {/* Tinted media */}
      <rect x="0" y="0" width={width} height={midY} fill="#eef5ff" />
      <rect x="0" y={midY} width={width} height={midY} fill="#fff7ea" />

      {/* Interface */}
      <line x1="0" y1={midY} x2={width} y2={midY} stroke="#111827" strokeWidth="2" />
      <text x={midX - 160} y={midY - 10} className="badge">Medium 1 (n₁={f.n1.toFixed(2)})</text>
      <text x={midX - 160} y={midY + 20} className="badge">Medium 2 (n₂={f.n2.toFixed(2)})</text>

      {/* Surface normal */}
      <line x1={midX} y1={midY} x2={midX} y2={normalTop.y} stroke="#6b7280" strokeDasharray="6 6" strokeWidth="2" />
      <text x={midX + 6} y={normalTop.y + 14} className="badge">Normal</text>

      {/* Incident */}
      <line x1={incStart.x} y1={incStart.y} x2={hit.x} y2={hit.y}
            stroke="#2563eb" strokeWidth="3" markerEnd="url(#ah-blue)" />
      <text x={incStart.x + 10} y={incStart.y + 18} className="tag" fill="#2563eb">Incident</text>

      {/* Reflected */}
      <line x1={hit.x} y1={hit.y} x2={refEnd.x} y2={refEnd.y}
            stroke="#10b981" strokeWidth="3" markerEnd="url(#ah-green)" />
      <text x={hit.x + 14} y={hit.y - 10} className="tag" fill="#10b981">Reflected</text>

      {/* Transmitted */}
      {!f.tir && !pec && (
        <>
          <line x1={hit.x} y1={hit.y} x2={trnEnd.x} y2={trnEnd.y}
                stroke="#f59e0b" strokeWidth="3" markerEnd="url(#ah-orange)" />
          <text x={hit.x + 14} y={hit.y + 18} className="tag" fill="#f59e0b">Transmitted</text>
        </>
      )}

      {/* Angles */}
      {/* θi */}
      <path d={`M ${midX} ${midY}
                A 60 60 0 0 1 ${midX - Math.sin(thI) * 60} ${midY - Math.cos(thI) * 60}`}
            fill="none" stroke="#111" strokeWidth="2" />
      <text x={midX - Math.sin(thI) * 72} y={midY - Math.cos(thI) * 72} className="tag">θᵢ</text>

      {/* θt */}
      {!f.tir && !pec && (
        <>
          <path d={`M ${midX} ${midY}
                    A 60 60 0 0 0 ${midX - Math.sin(thT) * 60} ${midY + Math.cos(thT) * 60}`}
                fill="none" stroke="#111" strokeWidth="2" />
          <text x={midX - Math.sin(thT) * 72} y={midY + Math.cos(thT) * 72} className="tag">θₜ</text>
        </>
      )}

      {/* Energy (Poynting) arrows */}
      <line x1={hit.x} y1={hit.y}
            x2={hit.x + (refEnd.x - hit.x) * (refLen / 200)}
            y2={hit.y + (refEnd.y - hit.y) * (refLen / 200)}
            stroke="#10b981" strokeWidth="6" opacity="0.35" markerEnd="url(#ah-green)" />
      {!f.tir && !pec && (
        <line x1={hit.x} y1={hit.y}
              x2={hit.x + (trnEnd.x - hit.x) * (trnLen / 200)}
              y2={hit.y + (trnEnd.y - hit.y) * (trnLen / 200)}
              stroke="#f59e0b" strokeWidth="6" opacity="0.35" markerEnd="url(#ah-orange)" />
      )}

      {/* Wavefront stripes */}
      {showWavefronts && (
        <>
          {/* Region 1 (incident) */}
          {Array.from({ length: 9 }).map((_, i) => {
            const phase = ((i * wf1 + (ticker % 1000)) % (wf1 * 9));
            const y = midY - 180 + phase * (Math.cos(thI) || 1);
            if (y > midY - 8) return null;
            const dx = Math.tan(thI) * (midY - y);
            return (
              <line key={`wf1-${i}`}
                    x1={midX - 320 - dx} y1={y}
                    x2={midX + 320 - dx} y2={y}
                    stroke="url(#wf1)" strokeWidth="3" />
            );
          })}
          {/* Region 2 (transmitted) */}
          {!f.tir && !pec && Array.from({ length: 9 }).map((_, i) => {
            const phase = ((i * wf2 + (ticker % 1000)) % (wf2 * 9));
            const y = midY + 12 + phase * (Math.cos(thT) || 1);
            if (y > height - 20) return null;
            const dx = Math.tan(thT) * (y - midY);
            return (
              <line key={`wf2-${i}`}
                    x1={midX - 320 - dx} y1={y}
                    x2={midX + 320 - dx} y2={y}
                    stroke="url(#wf2)" strokeWidth="3" />
            );
          })}
        </>
      )}

      {/* Badges */}
      {f.tir && (
        <g>
          <rect x={midX + 200} y={28} width="136" height="26" rx="6" fill="#fee2e2" stroke="#fecaca" />
          <text x={midX + 210} y={46} className="badge" fill="#991b1b">TIR: No transmission</text>
        </g>
      )}
      {(!f.tir && atBrewster) && (
        <g>
          <rect x={midX + 200} y={28} width="160" height="26" rx="6" fill="#dcfce7" stroke="#bbf7d0" />
          <text x={midX + 210} y={46} className="badge" fill="#065f46">Brewster (p): Γ≈0</text>
        </g>
      )}
      {showθc && (
        <text x={midX - 60} y={24} className="badge">θ_c = {rad2deg(f.thetaC!).toFixed(2)}°</text>
      )}

      {/* R/T bars */}
      <g transform={`translate(${midX - 320}, ${height - 64})`}>
        <text x={0} y={0} className="legend">Power split</text>
        <g transform="translate(0,10)">
          <text x={0} y={14} className="legend">R</text>
          <rect x={20} y={6} width={400} height={10} rx={5} fill="#eef2f7" />
          <rect x={20} y={6} width={Math.max(2, 400 * f.R)} height={10} rx={5} fill="#10b981" />
          <text x={430} y={14} className="legend">{(f.R * 100).toFixed(1)}%</text>
        </g>
        <g transform="translate(0,30)">
          <text x={0} y={14} className="legend">T</text>
          <rect x={20} y={6} width={400} height={10} rx={5} fill="#eef2f7" />
          <rect x={20} y={6} width={Math.max(2, 400 * f.T)} height={10} rx={5} fill="#f59e0b" />
          <text x={430} y={14} className="legend">{(f.T * 100).toFixed(1)}%</text>
        </g>
      </g>

      {/* Polarization label */}
      <text x={midX + 210} y={height - 20} className="badge">Pol: {pol.toUpperCase()}</text>
    </svg>
  );
};

/* ============================================================
   Main page component — uses inline 2D viz + correct LaTeX
============================================================ */
const WaveReflection: React.FC = () => {
  const [thetaI, setThetaI] = useState(30);
  const [pol, setPol] = useState<Pol>("p");
  const [er1, setEr1] = useState(1.0);
  const [er2, setEr2] = useState(2.25);
  const [mr1, setMr1] = useState(1.0);
  const [mr2, setMr2] = useState(1.0);
  const [pec, setPec] = useState(false);

  const num = (v: string, fallback: number) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };

  return (
    <div className="wave-container">
      <div className="text-2xl font-extrabold uppercase text-center py-6 text-gray-900">
        Wave Reflection in Electromagnetism
      </div>

      {/* Controls + 2D Visual */}
      <div className="visualizer-container">
        <div className="controls">
          <div className="font-bold mb-2">Controls</div>

          <label className="block text-sm mb-1">
            Angle θᵢ (deg):
            <input
              type="range" min={0} max={89} value={thetaI}
              onChange={(e) => setThetaI(Number(e.target.value))}
              style={{ width: 160, marginLeft: 8 }}
            />
            <span className="ml-2">{thetaI}°</span>
          </label>

          <label className="block text-sm mb-1">
            Polarization:
            <select value={pol} onChange={(e) => setPol(e.target.value as Pol)} style={{ marginLeft: 8 }}>
              <option value="s">s (⊥)</option>
              <option value="p">p (∥)</option>
            </select>
          </label>

          <div className="text-sm mb-1">εr / μr:</div>
          <div className="text-xs space-y-2">
            <div>
              Medium 1:
              <input type="number" step="0.01" value={er1} onChange={(e) => setEr1(num(e.target.value, er1))}
                     style={{ width: 72, marginLeft: 6 }} />
              <span className="ml-1">εr₁</span>
              <input type="number" step="0.01" value={mr1} onChange={(e) => setMr1(num(e.target.value, mr1))}
                     style={{ width: 72, marginLeft: 8 }} />
              <span className="ml-1">μr₁</span>
            </div>
            <div>
              Medium 2:
              <input type="number" step="0.01" value={er2} onChange={(e) => setEr2(num(e.target.value, er2))}
                     style={{ width: 72, marginLeft: 6 }} />
              <span className="ml-1">εr₂</span>
              <input type="number" step="0.01" value={mr2} onChange={(e) => setMr2(num(e.target.value, mr2))}
                     style={{ width: 72, marginLeft: 8 }} />
              <span className="ml-1">μr₂</span>
            </div>
          </div>

          <label className="block text-sm mt-2">
            <input type="checkbox" checked={pec} onChange={(e) => setPec(e.target.checked)} />
            <span className="ml-1">Treat Medium 2 as PEC</span>
          </label>

          <div className="current-medium">Tip: choose p-pol and vary θᵢ to see Brewster angle.</div>
        </div>

        <WaveReflection2D
          thetaI={thetaI}
          pol={pol}
          er1={er1} er2={er2}
          mr1={mr1} mr2={mr2}
          pec={pec}
          showWavefronts
          width={980}
          height={480}
        />
      </div>

      {/* ---------- Theory with correct LaTeX ---------- */}
      <div className="topic">
        <div className="text-xl font-bold text-gray-900 mt-8 mb-4">
          Reflection of a Plane Wave at Normal Incidence
        </div>

        <div className="text-lg leading-relaxed mb-6">
          The reflection coefficient <InlineMath math={tex`\Gamma`} /> and the transmission coefficient{" "}
          <InlineMath math={tex`t`} /> describe field amplitudes.
        </div>

        <div className="text-2xl"><BlockMath math={tex`\Gamma = \frac{Z_2 - Z_1}{Z_2 + Z_1}`} /></div>
        <div className="text-2xl"><BlockMath math={tex`t = \frac{2 Z_2}{Z_2 + Z_1}`} /></div>
      </div>

      <div className="topic">
        <div className="text-xl font-bold text-gray-900 mt-8 mb-4">
          Oblique Incidence (Fresnel)
        </div>

        <div className="text-lg leading-relaxed mb-2">Snell’s law:</div>
        <div className="text-2xl"><BlockMath math={tex`n_1 \sin\theta_i = n_2 \sin\theta_t`} /></div>

        <div className="text-lg leading-relaxed mb-4 mt-4">Fresnel coefficients (lossless):</div>
        <div className="text-2xl"><BlockMath math={tex`\Gamma_\perp = \frac{\eta_2\cos\theta_i - \eta_1\cos\theta_t}{\eta_2\cos\theta_i + \eta_1\cos\theta_t}`} /></div>
        <div className="text-2xl"><BlockMath math={tex`\Gamma_\parallel = \frac{\eta_2\cos\theta_t - \eta_1\cos\theta_i}{\eta_2\cos\theta_t + \eta_1\cos\theta_i}`} /></div>
        <div className="text-2xl"><BlockMath math={tex`t_\perp = \frac{2\eta_2\cos\theta_i}{\eta_2\cos\theta_i + \eta_1\cos\theta_t}`} /></div>
        <div className="text-2xl"><BlockMath math={tex`t_\parallel = \frac{2\eta_2\cos\theta_i}{\eta_2\cos\theta_t + \eta_1\cos\theta_i}`} /></div>

        <div className="text-lg leading-relaxed mb-4 mt-4">Power relations:</div>
        <div className="text-2xl"><BlockMath math={tex`R = |\Gamma|^2,\quad T = \frac{n_2\cos\theta_t}{n_1\cos\theta_i}\,|t|^2`} /></div>
      </div>
    </div>
  );
};

export default WaveReflection;
