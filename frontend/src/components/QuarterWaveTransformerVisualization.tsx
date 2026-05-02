import React, { useState, useEffect, useMemo, useRef } from "react";
import { Settings2, Cpu, Activity } from "lucide-react";
import type * as PlotlyType from "plotly.js";

declare global {
  interface Window {
    Plotly: typeof PlotlyType;
  }
}

export default function QuarterWaveTransformerVisualization() {
  const [z0, setZ0] = useState<string>("50");
  const [zL, setZL] = useState<string>("120");
  const [plotlyLoaded, setPlotlyLoaded] = useState<boolean>(false);

  // Ref for the Smith Chart
  const plotRef = useRef<HTMLDivElement>(null);
  // Ref for the new Frequency Response Chart
  const freqPlotRef = useRef<HTMLDivElement>(null);

  // Refs for the animated SVG paths
  const instMisRef = useRef<SVGPathElement>(null);
  const instMatRef = useRef<SVGPathElement>(null);

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

  // Compute all static wave boundaries and parameters
  const results = useMemo(() => {
    const numZ0 = parseFloat(z0) || 1;
    const numZL = parseFloat(zL) || 1;

    const z0Prime = Math.sqrt(numZ0 * numZL);
    const gammaMismatch = (numZL - numZ0) / (numZL + numZ0);
    const vswrMismatch =
      (1 + Math.abs(gammaMismatch)) / (1 - Math.abs(gammaMismatch));

    const zLNorm = numZL / numZ0;
    const gammaQWT = (numZL - z0Prime) / (numZL + z0Prime);

    // --- Wave Animation Math ---
    const lambda = 160;
    const beta = (2 * Math.PI) / lambda;

    // Arrays for envelope bounds
    const envMisU = [],
      envMisL = [];
    const envMatU = [],
      envMatL = [];

    // Constant C for QWT amplitude matching
    const cQWT = 1 / (1 - gammaQWT);

    // Calculate Envelopes
    for (let x = 0; x <= 160; x++) {
      const d = 160 - x;

      // Mismatched
      const magMis = Math.sqrt(
        1 +
          gammaMismatch * gammaMismatch +
          2 * gammaMismatch * Math.cos(2 * beta * d),
      );
      envMisU.push(magMis);
      envMisL.push(-magMis);

      // Matched (with QWT)
      if (x >= 120) {
        // Inside QWT
        const magQWT =
          Math.abs(cQWT) *
          Math.sqrt(
            1 + gammaQWT * gammaQWT + 2 * gammaQWT * Math.cos(2 * beta * d),
          );
        envMatU.push(magQWT);
        envMatL.push(-magQWT);
      } else {
        // Main Line (Perfectly Matched = Constant amplitude 1)
        envMatU.push(1);
        envMatL.push(-1);
      }
    }

    // Determine visual scale based on max amplitude so both plots share exactly the same Y-axis
    const maxAmplitude = Math.max(...envMisU, ...envMatU, 1.0);
    const scaleY = 45 / maxAmplitude; // Fit within +/- 45px of center
    const cy = 60; // Center Y

    // Construct SVG Path Strings for Envelopes
    let pathMisArea = "";
    let pathMisOutline = "";
    for (let x = 0; x <= 160; x++) {
      pathMisOutline += `${x === 0 ? "M" : "L"} ${x} ${cy - envMisU[x] * scaleY} `;
      pathMisArea += `${x === 0 ? "M" : "L"} ${x} ${cy - envMisU[x] * scaleY} `;
    }
    for (let x = 160; x >= 0; x--) {
      pathMisArea += `L ${x} ${cy - envMisL[x] * scaleY} `;
    }
    pathMisArea += "Z";

    let pathMatArea = "";
    let pathMatOutline = "";
    for (let x = 0; x <= 160; x++) {
      pathMatOutline += `${x === 0 ? "M" : "L"} ${x} ${cy - envMatU[x] * scaleY} `;
      pathMatArea += `${x === 0 ? "M" : "L"} ${x} ${cy - envMatU[x] * scaleY} `;
    }
    for (let x = 160; x >= 0; x--) {
      pathMatArea += `L ${x} ${cy - envMatL[x] * scaleY} `;
    }
    pathMatArea += "Z";

    return {
      z0Prime,
      gammaMismatch,
      vswrMismatch,
      zLNorm,
      gammaQWT,
      beta,
      cQWT,
      scaleY,
      cy,
      pathMisArea,
      pathMisOutline,
      pathMatArea,
      pathMatOutline,
    };
  }, [z0, zL]);

  // Real-time animation loop for the instantaneous wave
  useEffect(() => {
    let animationFrameId: number;
    let t = 0;
    const { gammaMismatch, gammaQWT, beta, cQWT, scaleY, cy } = results;

    const renderLoop = () => {
      t += 0.08; // Wave animation speed
      let pathMis = "";
      let pathMat = "";

      for (let x = 0; x <= 160; x++) {
        const d = 160 - x;

        // 1. Mismatched Wave Equation
        const vMis =
          Math.cos(t + beta * d) + gammaMismatch * Math.cos(t - beta * d);
        const yMis = cy - vMis * scaleY;
        pathMis += `${x === 0 ? "M" : "L"} ${x} ${yMis} `;

        // 2. Matched Wave Equation
        let vMat = 0;
        if (x >= 120) {
          // Inside QWT: Phase shifted to maintain boundary continuity
          vMat =
            cQWT *
            (Math.cos(t + beta * d - Math.PI / 2) +
              gammaQWT * Math.cos(t - beta * d - Math.PI / 2));
        } else {
          // Main line: Pure traveling wave
          vMat = Math.cos(t + beta * (120 - x));
        }
        const yMat = cy - vMat * scaleY;
        pathMat += `${x === 0 ? "M" : "L"} ${x} ${yMat} `;
      }

      // Bypass React state for 60fps performance
      if (instMisRef.current) instMisRef.current.setAttribute("d", pathMis);
      if (instMatRef.current) instMatRef.current.setAttribute("d", pathMat);

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [results]);

  useEffect(() => {
    if (!plotlyLoaded || !window.Plotly) return;

    // --- 1. SMITH CHART ---
    if (plotRef.current) {
      const traces: PlotlyType.Data[] = [];
      const gammaMag = Math.abs(results.gammaMismatch);

      // 1. VSWR Circle
      if (gammaMag > 0.001 && gammaMag < 0.999) {
        const swrR = [],
          swrX = [];
        for (let i = 0; i <= 100; i++) {
          const theta = (i / 100) * 2 * Math.PI;
          const u = gammaMag * Math.cos(theta);
          const v = gammaMag * Math.sin(theta);
          const denom = Math.pow(1 - u, 2) + Math.pow(v, 2);
          swrR.push((1 - u * u - v * v) / denom);
          swrX.push((2 * v) / denom);
        }
        traces.push({
          type: "scattersmith",
          mode: "lines",
          name: `VSWR = ${results.vswrMismatch.toFixed(2)}`,
          real: swrR,
          imag: swrX,
          line: { color: "#22c55e", width: 2, dash: "dash" }, // Matched Smith Chart's green
          hoverinfo: "skip",
        } as unknown as PlotlyType.Data);
      }

      // 2. Load Point
      traces.push({
        type: "scattersmith",
        mode: "markers+text",
        name: "Normalized Load (z_L)",
        real: [results.zLNorm],
        imag: [0],
        textposition: "top center",
        marker: {
          color: "#3b82f6",
          size: 12,
          symbol: "circle",
          line: { color: "white", width: 1 },
        }, // Matched styling
      } as unknown as PlotlyType.Data);

      // 3. Matched Point
      traces.push({
        type: "scattersmith",
        mode: "markers+text",
        name: "Matched Input (z_in = 1))",
        real: [1],
        imag: [0],
        textposition: "top center",
        marker: {
          color: "#ef4444",
          size: 12,
          symbol: "diamond",
          line: { color: "white", width: 1 },
        }, // Matched styling
      } as unknown as PlotlyType.Data);

      const layout = {
        paper_bgcolor: "#ffffff",
        plot_bgcolor: "#ffffff",
        autosize: true,
        height: 650,
        width: 650,
        margin: { l: 40, r: 40, t: 80, b: 40 },
        smith: {
          realaxis: {
            tickcolor: "#94a3b8",
            tickangle: 0,
            gridcolor: "#e2e8f0",
            linecolor: "#cbd5e1",
            tickfont: { color: "#64748b" },
          },
          imagaxis: {
            tickcolor: "#94a3b8",
            gridcolor: "#e2e8f0",
            linecolor: "#cbd5e1",
            tickfont: { color: "#3b82f6" },
          },
        },
        showlegend: true,
        legend: {
          orientation: "v",
          x: 0.5,
          xanchor: "center",
          y: 1.3,
          yanchor: "top",
          font: { color: "#475569", size: 14 },
          bgcolor: "rgba(255,255,255,0)",
        },
      };

      const config = {
        responsive: true,
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: [
          "lasso2d",
          "select2d",
          "toImage",
        ] as PlotlyType.ModeBarDefaultButtons[],
      };

      window.Plotly.newPlot(
        plotRef.current,
        traces,
        layout as unknown as PlotlyType.Layout,
        config,
      );
    }

    // --- 2. FREQUENCY RESPONSE CHART ---
    if (freqPlotRef.current) {
      const numZ0 = parseFloat(z0) || 1;
      const numZL = parseFloat(zL) || 1;
      const { z0Prime } = results;
      const f_norm = [];
      const gamma_mag = [];

      for (let i = 0; i <= 400; i++) {
        const f = i / 100; // 0.0 to 4.0
        f_norm.push(f);

        const theta = (Math.PI * f) / 2;
        const c = Math.cos(theta);
        const s = Math.sin(theta);

        const nr = numZL * c;
        const ni = z0Prime * s;
        const dr = z0Prime * c;
        const di = numZL * s;

        const den = dr * dr + di * di;
        const zin_r = (z0Prime * (nr * dr + ni * di)) / den;
        const zin_i = (z0Prime * (ni * dr - nr * di)) / den;

        const g_num_r = zin_r - numZ0;
        const g_num_i = zin_i;
        const g_den_r = zin_r + numZ0;
        const g_den_i = zin_i;

        const g_mag = Math.sqrt(
          (g_num_r * g_num_r + g_num_i * g_num_i) /
            (g_den_r * g_den_r + g_den_i * g_den_i),
        );

        gamma_mag.push(g_mag);
      }

      const traceFreq: PlotlyType.Data = {
        x: f_norm,
        y: gamma_mag,
        type: "scatter",
        mode: "lines",
        name: "|Γ|",
        line: { color: "#0f172a", width: 2.5 },
      };

      const layoutFreq = {
        paper_bgcolor: "#ffffff",
        plot_bgcolor: "#ffffff",
        autosize: true,
        height: 400,
        margin: { l: 60, r: 40, t: 40, b: 60 },
        xaxis: {
          title: {
            text: "Normalized Frequency (f/f₀)",
            font: { color: "#64748b" },
          },
          tickcolor: "#94a3b8",
          gridcolor: "#f1f5f9",
          linecolor: "#cbd5e1",
          tickfont: { color: "#475569" },
          zeroline: false,
        },
        yaxis: {
          title: {
            text: "Reflection Coefficient |Γ|",
            font: { color: "#64748b" },
          },
          tickcolor: "#94a3b8",
          gridcolor: "#f1f5f9",
          linecolor: "#cbd5e1",
          tickfont: { color: "#475569" },
          range: [0, Math.max(...gamma_mag) + 0.05],
          zeroline: false,
        },
        showlegend: false,
      };

      window.Plotly.newPlot(
        freqPlotRef.current,
        [traceFreq],
        layoutFreq as unknown as PlotlyType.Layout,
        { responsive: true, displayModeBar: false },
      );
    }
  }, [results, plotlyLoaded, z0, zL]);

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setter(e.target.value);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8 flex flex-col gap-6">
      <style>{`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button { opacity: 1 !important; display: flex !important; }
      `}</style>

      {/* TOP SECTION: Split Layout with Matching Heights */}
      <div className="flex flex-col md:flex-row gap-6 items-stretch">
        {/* LEFT COLUMN: Controls & Analysis */}
        <div className="w-full md:w-96 flex flex-col gap-6">
          {/* Parameters Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-2">
              <Settings2 className="w-5 h-5 text-slate-400" />
              <h2 className="text-lg font-semibold text-slate-800">
                Parameters
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Main Line (Z<sub>0</sub>)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={z0}
                    onChange={handleInputChange(setZ0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-4 pr-12 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                  />
                  <span className="absolute right-4 top-2 text-slate-400 pointer-events-none">
                    Ω
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Load (Z<sub>L</sub>)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={zL}
                    onChange={handleInputChange(setZL)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-4 pr-12 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                  />
                  <span className="absolute right-4 top-2 text-slate-400 pointer-events-none">
                    Ω
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-4 flex-1">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-2">
              <Activity className="w-5 h-5 text-slate-400" />
              <h2 className="text-lg font-semibold text-slate-800">Analysis</h2>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                <span className="text-slate-600 text-sm">
                  Req. Transformer (Z<sub>0</sub>')
                </span>
                <span className="font-mono text-blue-600 font-bold">
                  {results.z0Prime.toFixed(2)} Ω
                </span>
              </div>

              <div className="flex justify-between items-center bg-red-50/50 p-3 rounded-lg border border-red-100">
                <span className="text-slate-600 text-sm">
                  Normalized Load (z<sub>L</sub>)
                </span>
                <span className="font-mono text-red-600 font-medium">
                  {results.zLNorm.toFixed(3)}
                </span>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-slate-600 text-sm">
                  Mismatch Refl. (Γ)
                </span>
                <span className="font-mono text-emerald-600 font-medium">
                  {Math.abs(results.gammaMismatch).toFixed(3)}
                </span>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-slate-600 text-sm">Mismatch VSWR</span>
                <span className="font-mono text-slate-900 font-medium">
                  {results.vswrMismatch === Infinity
                    ? "∞"
                    : results.vswrMismatch.toFixed(2)}{" "}
                  : 1
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Smith Chart */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center min-h-[600px] relative p-6">
          {!plotlyLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 rounded-2xl">
              <Cpu className="w-10 h-10 text-blue-500 animate-pulse mb-4" />
              <p className="text-slate-500 font-medium">
                Loading Chart Engine...
              </p>
            </div>
          )}

          <div className="flex flex-col items-center gap-3 w-full">
            <h2 className="text-lg font-semibold text-slate-700 text-center mt-2">
              Smith Chart Visualization
            </h2>
            <div
              ref={plotRef}
              className="w-[650px] h-[650px] max-w-full"
              style={{
                opacity: plotlyLoaded ? 1 : 0,
                transition: "opacity 0.3s ease-in-out",
              }}
            />
          </div>
        </div>
      </div>

      {/* FREQUENCY RESPONSE SECTION */}
      <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center shadow-sm relative">
        {!plotlyLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 rounded-2xl">
            <Cpu className="w-10 h-10 text-blue-500 animate-pulse mb-4" />
            <p className="text-slate-500 font-medium">
              Loading Chart Engine...
            </p>
          </div>
        )}
        <h3 className="text-slate-800 font-bold mb-2 text-center w-full">
          Frequency Response of Quarter-Wave Transformer
        </h3>
        <div
          ref={freqPlotRef}
          className="w-full min-h-[400px]"
          style={{ opacity: plotlyLoaded ? 1 : 0, transition: "opacity 0.3s" }}
        />
      </div>

      {/* BOTTOM SECTION: Voltage Standing-Wave Pattern */}
      {/*
      <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 flex flex-col shadow-sm">
        <h3 className="text-slate-800 font-bold mb-6 text-center">
          Voltage Standing-Wave Dynamics
        </h3>

        <div className="flex flex-col lg:flex-row w-full gap-8 lg:gap-4 items-center justify-center">

          <div className="flex-1 flex flex-col items-center w-full lg:border-r border-slate-100 lg:pr-4">
            <svg
              viewBox="-10 0 200 180"
              className="w-full h-auto max-w-[550px]"
            >

              <line
                x1="0"
                y1={results.cy}
                x2="160"
                y2={results.cy}
                stroke="#cbd5e1"
                strokeWidth="1"
                strokeDasharray="4 4"
              />

              <path d={results.pathMisArea} fill="#eff6ff" opacity="0.8" />
              <path
                d={results.pathMisOutline}
                fill="none"
                stroke="#93c5fd"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />

              <path
                ref={instMisRef}
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
              />

              <g transform="translate(0, 130)">
                <line
                  x1="0"
                  y1="0"
                  x2="160"
                  y2="0"
                  stroke="#94a3b8"
                  strokeWidth="2"
                />
                <line
                  x1="0"
                  y1="10"
                  x2="160"
                  y2="10"
                  stroke="#94a3b8"
                  strokeWidth="2"
                />
                <rect
                  x="160"
                  y="-10"
                  width="12"
                  height="30"
                  fill="#f8fafc"
                  stroke="#475569"
                  strokeWidth="2"
                  rx="2"
                />

                <text
                  x="80"
                  y="28"
                  fill="#64748b"
                  fontSize="10"
                  textAnchor="middle"
                  fontStyle="italic"
                >
                  Z
                  <tspan dy="2" fontSize="7">
                    0
                  </tspan>
                </text>
                <text
                  x="166"
                  y="32"
                  fill="#475569"
                  fontSize="10"
                  textAnchor="middle"
                  fontStyle="italic"
                  fontWeight="bold"
                >
                  Z
                  <tspan dy="2" fontSize="7">
                    L
                  </tspan>
                </text>
              </g>

              <text
                x="80"
                y="175"
                fill="#334155"
                fontSize="6"
                textAnchor="middle"
                fontWeight="bold"
              >
                (a) Without Transformer
              </text>
            </svg>
          </div>

          <div className="flex-1 flex flex-col items-center w-full lg:pl-4">
            <svg
              viewBox="-10 0 200 180"
              className="w-full h-auto max-w-[550px]"
            >
              <line
                x1="0"
                y1={results.cy}
                x2="160"
                y2={results.cy}
                stroke="#cbd5e1"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <line
                x1="120"
                y1="10"
                x2="120"
                y2="120"
                stroke="#cbd5e1"
                strokeWidth="1"
                strokeDasharray="2 4"
              />

              <path d={results.pathMatArea} fill="#eff6ff" opacity="0.8" />
              <path
                d={results.pathMatOutline}
                fill="none"
                stroke="#93c5fd"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />

              <path
                ref={instMatRef}
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
              />

              <g transform="translate(0, 130)">
                <line
                  x1="0"
                  y1="0"
                  x2="120"
                  y2="0"
                  stroke="#94a3b8"
                  strokeWidth="2"
                />
                <line
                  x1="0"
                  y1="10"
                  x2="120"
                  y2="10"
                  stroke="#94a3b8"
                  strokeWidth="2"
                />

                <rect
                  x="120"
                  y="-3"
                  width="40"
                  height="16"
                  fill="#bfdbfe"
                  stroke="#60a5fa"
                  strokeWidth="1.5"
                  rx="1.5"
                />
                <rect
                  x="160"
                  y="-10"
                  width="12"
                  height="30"
                  fill="#f8fafc"
                  stroke="#475569"
                  strokeWidth="2"
                  rx="2"
                />

                <line
                  x1="120"
                  y1="-12"
                  x2="160"
                  y2="-12"
                  stroke="#94a3b8"
                  strokeWidth="1"
                />
                <line
                  x1="120"
                  y1="-15"
                  x2="120"
                  y2="-9"
                  stroke="#94a3b8"
                  strokeWidth="1"
                />
                <line
                  x1="160"
                  y1="-15"
                  x2="160"
                  y2="-9"
                  stroke="#94a3b8"
                  strokeWidth="1"
                />
                <text
                  x="140"
                  y="-16"
                  fill="#64748b"
                  fontSize="8"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  λ/4
                </text>

                <text
                  x="60"
                  y="28"
                  fill="#64748b"
                  fontSize="10"
                  textAnchor="middle"
                  fontStyle="italic"
                >
                  Z
                  <tspan dy="2" fontSize="7">
                    0
                  </tspan>
                </text>
                <text
                  x="140"
                  y="28"
                  fill="#3b82f6"
                  fontSize="10"
                  textAnchor="middle"
                  fontStyle="italic"
                  fontWeight="bold"
                >
                  Z
                  <tspan dy="2" fontSize="7">
                    0
                  </tspan>
                  <tspan dy="-2">'</tspan>
                </text>
                <text
                  x="166"
                  y="32"
                  fill="#475569"
                  fontSize="10"
                  textAnchor="middle"
                  fontStyle="italic"
                  fontWeight="bold"
                >
                  Z
                  <tspan dy="2" fontSize="7">
                    L
                  </tspan>
                </text>
              </g>

              <text
                x="80"
                y="175"
                fill="#334155"
                fontSize="6"
                textAnchor="middle"
                fontWeight="bold"
              >
                (b) With λ/4 Transformer
              </text>
            </svg>
          </div>
        </div>
      </div>
      */}

      {/* MIDDLE SECTION: Circuit Schematic */}
      <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center shadow-sm">
        <h3 className="text-slate-800 font-bold mb-4 text-center">
          Circuit Schematic
        </h3>
        <div className="w-full flex items-center justify-center py-4">
          <svg viewBox="0 0 400 160" className="w-full h-auto max-w-xl mx-auto">
            {/* Main Line */}
            <line
              x1="20"
              y1="40"
              x2="200"
              y2="40"
              stroke="#64748b"
              strokeWidth="2.5"
            />
            <line
              x1="20"
              y1="100"
              x2="200"
              y2="100"
              stroke="#64748b"
              strokeWidth="2.5"
            />
            <text
              x="110"
              y="65"
              fill="#475569"
              fontSize="16"
              textAnchor="middle"
              fontStyle="italic"
            >
              Z
              <tspan dy="4" fontSize="12">
                0
              </tspan>
            </text>

            {/* Transformer section */}
            <rect
              x="200"
              y="35"
              width="120"
              height="10"
              fill="#3b82f6"
              rx="2"
            />
            <rect
              x="200"
              y="95"
              width="120"
              height="10"
              fill="#3b82f6"
              rx="2"
            />
            <text
              x="260"
              y="65"
              fill="#2563eb"
              fontSize="16"
              textAnchor="middle"
              fontStyle="italic"
              fontWeight="bold"
            >
              Z
              <tspan dy="4" fontSize="12">
                0
              </tspan>
              <tspan dy="-4">'</tspan>
            </text>

            {/* Load */}
            <rect
              x="320"
              y="20"
              width="24"
              height="100"
              fill="#f8fafc"
              stroke="#334155"
              strokeWidth="2.5"
              rx="3"
            />
            <text
              x="365"
              y="75"
              fill="#0f172a"
              fontSize="16"
              textAnchor="middle"
              fontStyle="italic"
              fontWeight="bold"
            >
              Z
              <tspan dy="4" fontSize="12">
                L
              </tspan>
            </text>

            {/* Dimension Line */}
            <line
              x1="200"
              y1="140"
              x2="320"
              y2="140"
              stroke="#94a3b8"
              strokeWidth="1.5"
            />
            <line
              x1="200"
              y1="135"
              x2="200"
              y2="145"
              stroke="#94a3b8"
              strokeWidth="1.5"
            />
            <line
              x1="320"
              y1="135"
              x2="320"
              y2="145"
              stroke="#94a3b8"
              strokeWidth="1.5"
            />
            <polygon points="200,140 206,137 206,143" fill="#94a3b8" />
            <polygon points="320,140 314,137 314,143" fill="#94a3b8" />
            <text
              x="260"
              y="132"
              fill="#64748b"
              fontSize="14"
              textAnchor="middle"
              fontWeight="bold"
            >
              λ / 4
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}
