import React, { useState, useEffect, useMemo, useRef } from "react";
import { Settings2, Cpu, Activity } from "lucide-react";

export default function App() {
  const [z0, setZ0] = useState("50");
  const [rL, setRL] = useState("100");
  const [xL, setXL] = useState("50");
  const [stubType, setStubType] = useState("short");

  const [plotlyLoaded, setPlotlyLoaded] = useState(false);
  const plotRef = useRef(null);

  useEffect(() => {
    if (document.getElementById("plotly-script")) {
      if (window.Plotly) setPlotlyLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "plotly-script";
    script.src = "https://cdn.plot.ly/plotly-2.27.0.min.js";
    script.async = true;
    script.onload = () => setPlotlyLoaded(true);
    document.body.appendChild(script);
  }, []);

  const results = useMemo(() => {
    const EPS = 1e-9;

    const Z0 = parseFloat(z0) || 50;
    const RL = parseFloat(rL) || 50;
    const XL = parseFloat(xL) || 0;

    // 1. Normalized impedance
    const zL_r = RL / Z0;
    const zL_i = XL / Z0;

    const denZ = zL_r * zL_r + zL_i * zL_i;

    const yL_r = denZ < EPS ? 1e6 : zL_r / denZ;
    const yL_i = denZ < EPS ? 0 : -zL_i / denZ;

    // 2. Reflection coefficient Γ_L
    const denG = (zL_r + 1) ** 2 + zL_i ** 2 + EPS;
    const GammaL_r = (zL_r ** 2 + zL_i ** 2 - 1) / denG;
    const GammaL_i = (2 * zL_i) / denG;

    const rho = Math.sqrt(GammaL_r ** 2 + GammaL_i ** 2);
    const vswr = rho < 1 - EPS ? (1 + rho) / (1 - rho) : Infinity;

    const calcL = (b) => {
      if (Math.abs(b) < EPS) return 0;
      let bl = Math.atan(stubType === "short" ? -1 / b : b);
      if (bl < 0) bl += Math.PI;
      return bl / (2 * Math.PI);
    };

    const sol1 = { d: 0, l: 0, y_d_i: 0, b_stub: 0 };
    const sol2 = { d: 0, l: 0, y_d_i: 0, b_stub: 0 };

    // 3. Exact Analytical Solution
    if (rho > 1e-6) {
      const u = -rho * rho;
      const v_mag = rho * Math.sqrt(1 - rho * rho);

      let v1 = v_mag;
      let v2 = -v_mag;

      const theta_d1 = Math.atan2(v1, u);
      const theta_d2 = Math.atan2(v2, u);
      
      const theta_L = Math.atan2(GammaL_i, GammaL_r);

      let d1 = (theta_L - theta_d1) / (4 * Math.PI);
      d1 = (d1 % 0.5 + 0.5) % 0.5;

      let d2 = (theta_L - theta_d2) / (4 * Math.PI);
      d2 = (d2 % 0.5 + 0.5) % 0.5;

      if (d1 > d2) {
        const tempD = d1;
        d1 = d2;
        d2 = tempD;

        const tempV = v1;
        v1 = v2;
        v2 = tempV;
      }

      // Sol 1 (Shortest distance)
      sol1.d = d1;
      sol1.y_d_i = (-2 * v1) / (1 - rho * rho);
      sol1.b_stub = -sol1.y_d_i;
      sol1.l = calcL(sol1.b_stub);

      // Sol 2 (Longer distance)
      sol2.d = d2;
      sol2.y_d_i = (-2 * v2) / (1 - rho * rho);
      sol2.b_stub = -sol2.y_d_i;
      sol2.l = calcL(sol2.b_stub);
    }

    return { yL_r, yL_i, rho, vswr, sol1, sol2 };
  }, [z0, rL, xL, stubType]);

  // Plotly Smith Chart
  useEffect(() => {
    if (!plotlyLoaded || !plotRef.current || !window.Plotly) return;

    const plotData = [];

    // 1. VSWR Circle
    if (results.rho > 0.001 && results.rho < 0.999) {
      const swrR = [], swrX = [];
      for (let i = 0; i <= 100; i++) {
        const theta = (i / 100) * 2 * Math.PI;
        const u = results.rho * Math.cos(theta);
        const v = results.rho * Math.sin(theta);
        const denom = Math.pow(1 - u, 2) + Math.pow(v, 2);
        swrR.push((1 - u * u - v * v) / denom);
        swrX.push((2 * v) / denom);
      }
      plotData.push({
        type: "scattersmith",
        mode: "lines",
        name: `VSWR = ${results.vswr.toFixed(2)}`,
        real: swrR,
        imag: swrX,
        line: { color: "#94a3b8", width: 1.5, dash: "dash" },
        hoverinfo: "skip",
      });
    }

    // 2. g = 1 Circle
    const g1R = [], g1X = [];
    for (let i = 0; i <= 100; i++) {
      const theta = (i / 100) * 2 * Math.PI;
      const u = -0.5 + 0.5 * Math.cos(theta);
      const v = 0.5 * Math.sin(theta);
      const denom = Math.pow(1 - u, 2) + Math.pow(v, 2);
      if (denom > 1e-5) {
        g1R.push((1 - u * u - v * v) / denom);
        g1X.push((2 * v) / denom);
      }
    }
    
    const toImpedance = (yr, yi) => {
      const den = yr * yr + yi * yi;
      return { r: yr / den, x: -yi / den };
    };

    plotData.push({
      type: "scattersmith",
      mode: "lines",
      name: "g = 1 Circle",
      real: g1R,
      imag: g1X,
      line: { color: "#fca5a5", width: 2 },
      hoverinfo: "skip",
    });

    // 3. Load Admittance
    const zL = toImpedance(results.yL_r, results.yL_i);
    plotData.push({
      type: "scattersmith",
      mode: "markers+text",
      name: "Load (y_L)",
      real: [zL.r],
      imag: [zL.x],
      text: ["y_L"],
      textposition: "bottom center",
      marker: { color: "#ef4444", size: 10, symbol: "circle", line: { color: "white", width: 1 } },
    });

    // 4. Stub Attachment Point 1 (Solution 1)
    const z_d1 = toImpedance(1, results.sol1.y_d_i);
    plotData.push({
      type: "scattersmith",
      mode: "markers+text",
      name: "Sol 1: y(d1)",
      real: [z_d1.r],
      imag: [z_d1.x],
      text: ["y(d1)"],
      textposition: "top right",
      marker: { color: "#eab308", size: 10, symbol: "diamond", line: { color: "white", width: 1 } },
    });

    // 5. Stub Attachment Point 2 (Solution 2)
    const z_d2 = toImpedance(1, results.sol2.y_d_i);
    plotData.push({
      type: "scattersmith",
      mode: "markers+text",
      name: "Sol 2: y(d2)",
      real: [z_d2.r],
      imag: [z_d2.x],
      text: ["y(d2)"],
      textposition: "bottom left",
      marker: { color: "#a855f7", size: 10, symbol: "diamond", line: { color: "white", width: 1 } },
    });

    // 6. Center (Matched)
    plotData.push({
      type: "scattersmith",
      mode: "markers+text",
      name: "Matched (Center)",
      real: [1],
      imag: [0],
      text: ["1 + j0"],
      textposition: "middle right",
      marker: { color: "#22c55e", size: 12, symbol: "star", line: { color: "white", width: 1 } },
    });

    const layout = {
      paper_bgcolor: "#ffffff",
      plot_bgcolor: "#ffffff",
      autosize: true,
      height: 650,
      width: 650,
      margin: { l: 40, r: 40, t: 80, b: 40 },
      smith: {
        realaxis: { tickcolor: "#94a3b8", gridcolor: "#e2e8f0", linecolor: "#cbd5e1", tickangle: 0, },
        imagaxis: { tickcolor: "#94a3b8", gridcolor: "#e2e8f0", linecolor: "#cbd5e1" },
      },
      showlegend: true,
      legend: {
      orientation: "h",          // Set to horizontal
      entrywidth: 150,           // Adjust this value to control column spacing
      entrywidthmode: "pixels",  // Forces each legend item to take up specific width
      x: 0.5,
      xanchor: "center",
      y: 1.20,                   // Adjusted to move legend slightly closer to the title
      yanchor: "top",
      font: { color: "#475569", size: 12 },
      bgcolor: "rgba(255,255,255,0)",
        },
    };

    const config = { responsive: true, displayModeBar: false };
    window.Plotly.newPlot(plotRef.current, plotData, layout, config);
  }, [results, plotlyLoaded]);

  const handleInputChange = (setter) => (e) => setter(e.target.value);

  // Schematic scaling calculations (Using Sol 1 for drawing)
  const schematicD = (results.sol1.d / 0.5) * 160; 
  const schematicL = (results.sol1.l / 0.5) * 60;  

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8 flex flex-col gap-6">
      <style>{`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button { opacity: 1 !important; display: flex !important; }
      `}</style>

      <div className="flex flex-col xl:flex-row gap-6 items-stretch">
        
        {/* LEFT COLUMN: Controls & Analysis */}
        <div className="w-full xl:w-[450px] flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-2">
              <Settings2 className="w-5 h-5 text-slate-400" />
              <h2 className="text-lg font-semibold text-slate-800">Parameters</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Characteristic Imp. (Z<sub>0</sub>)</label>
                <div className="relative">
                  <input type="number" value={z0} onChange={handleInputChange(setZ0)} className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-4 pr-12 py-2 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all" />
                  <span className="absolute right-4 top-2 text-slate-400">Ω</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Load R<sub>L</sub></label>
                  <input type="number" value={rL} onChange={handleInputChange(setRL)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Load X<sub>L</sub></label>
                  <input type="number" value={xL} onChange={handleInputChange(setXL)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all" />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <label className="block text-sm font-medium text-slate-600 mb-1">Stub Termination</label>
                <select value={stubType} onChange={(e) => setStubType(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 transition-all">
                  <option value="short">Shorted Stub</option>
                  <option value="open">Open Stub</option>
                </select>
              </div>
            </div>
          </div>

          {/* Analysis Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-4 flex-1">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-2">
              <Activity className="w-5 h-5 text-slate-400" />
              <h2 className="text-lg font-semibold text-slate-800">Tuning Solutions</h2>
            </div>

            <div className="flex flex-col gap-6">
              {/* Solution 1 */}
              <div className="flex flex-col gap-3">
                <h3 className="font-semibold text-slate-700 flex items-center gap-2 text-sm px-1">
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span> Solution 1
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-slate-600 text-sm">Norm. Admittance y(d₁)</span>
                    <span className="font-mono text-slate-800 text-sm">1 {results.sol1.y_d_i >= 0 ? "+" : "-"} j{Math.abs(results.sol1.y_d_i).toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between items-center bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
                    <span className="text-emerald-700 text-sm font-medium">Distance (d)</span>
                    <span className="font-mono text-emerald-700 font-bold">{results.sol1.d.toFixed(4)} λ</span>
                  </div>
                  <div className="flex justify-between items-center bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                    <span className="text-blue-700 text-sm font-medium">Stub Length (l)</span>
                    <span className="font-mono text-blue-700 font-bold">{results.sol1.l.toFixed(4)} λ</span>
                  </div>
                </div>
              </div>

              <div className="w-full h-px bg-slate-100"></div>

              {/* Solution 2 */}
              <div className="flex flex-col gap-3">
                <h3 className="font-semibold text-slate-700 flex items-center gap-2 text-sm px-1">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span> Solution 2
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-slate-600 text-sm">Norm. Admittance y(d₂)</span>
                    <span className="font-mono text-slate-800 text-sm">1 {results.sol2.y_d_i >= 0 ? "+" : "-"} j{Math.abs(results.sol2.y_d_i).toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between items-center bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
                    <span className="text-emerald-700 text-sm font-medium">Distance (d)</span>
                    <span className="font-mono text-emerald-700 font-bold">{results.sol2.d.toFixed(4)} λ</span>
                  </div>
                  <div className="flex justify-between items-center bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                    <span className="text-blue-700 text-sm font-medium">Stub Length (l)</span>
                    <span className="font-mono text-blue-700 font-bold">{results.sol2.l.toFixed(4)} λ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Smith Chart & Circuit Schematic */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center min-h-[600px] relative p-6 gap-8">
          {!plotlyLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10 rounded-2xl">
              <Cpu className="w-10 h-10 text-emerald-500 animate-pulse mb-4" />
              <p className="text-slate-500 font-medium">Loading Chart Engine...</p>
            </div>
          )}

          {/* Smith Chart */}
          <div className="flex flex-col items-center gap-1 w-full">
            <h2 className="text-lg font-semibold text-slate-700 text-center mt-2">
              Admittance Smith Chart View
            </h2>
            <p className="text-center text-xs text-slate-500 mb-1">
              (Impedance grid where the left red circle acts as g=1)
            </p>
            <div
              ref={plotRef}
              className="w-[550px] h-[550px] max-w-full"
              style={{
                opacity: plotlyLoaded ? 1 : 0,
                transition: "opacity 0.3s ease-in-out",
              }}
            />
          </div>

          <div className="w-full h-px bg-slate-100"></div>

          {/* Circuit Schematic */}
          <div className="w-full flex flex-col items-center">
            <div className="flex flex-col items-center mb-4">
              <h3 className="text-slate-800 font-bold text-center">Circuit Schematic</h3>
            </div>
            
            <div className="w-full flex items-center justify-center">
              <svg viewBox="0 0 500 160" className="w-full h-auto max-w-2xl mx-auto">
                {/* Main Line */}
                <line x1="20" y1="40" x2="420" y2="40" stroke="#64748b" strokeWidth="2.5" />
                <line x1="20" y1="80" x2="420" y2="80" stroke="#64748b" strokeWidth="2.5" />
                <text x="60" y="55" fill="#475569" fontSize="14" fontStyle="italic">Z<tspan dy="3" fontSize="10">0</tspan></text>
                
                {/* Load */}
                <rect x="420" y="20" width="24" height="80" fill="#f8fafc" stroke="#334155" strokeWidth="2.5" rx="3" />
                <text x="465" y="65" fill="#0f172a" fontSize="16" fontStyle="italic" fontWeight="bold">Z<tspan dy="4" fontSize="12">L</tspan></text>
                
                {/* Stub Attachment */}
                <g transform={`translate(${420 - schematicD}, 0)`}>
                  <line x1="0" y1="40" x2="0" y2={80 + schematicL} stroke="#3b82f6" strokeWidth="2.5" />
                  <line x1="20" y1="80" x2="20" y2={80 + schematicL} stroke="#3b82f6" strokeWidth="2.5" />
                  
                  {stubType === "short" ? (
                    <line x1="0" y1={80 + schematicL} x2="20" y2={80 + schematicL} stroke="#1d4ed8" strokeWidth="3" />
                  ) : (
                    <line x1="0" y1={80 + schematicL} x2="20" y2={80 + schematicL} stroke="transparent" strokeWidth="3" />
                  )}
                  
                  <text x="35" y={80 + schematicL/2} fill="#3b82f6" fontSize="14" fontStyle="italic">l</text>
                </g>

                {/* Distance Dimension 'd' */}
                <line x1={420 - schematicD} y1="100" x2="420" y2="100" stroke="#94a3b8" strokeWidth="1.5" />
                <line x1={420 - schematicD} y1="95" x2={420 - schematicD} y2="105" stroke="#94a3b8" strokeWidth="1.5" />
                <line x1="420" y1="95" x2="420" y2="105" stroke="#94a3b8" strokeWidth="1.5" />
                <text x={420 - schematicD/2} y="115" fill="#64748b" fontSize="14" textAnchor="middle" fontStyle="italic">d</text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}