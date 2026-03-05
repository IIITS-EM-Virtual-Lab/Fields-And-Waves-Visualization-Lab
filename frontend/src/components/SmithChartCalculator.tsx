import React, { useState, useEffect, useMemo, useRef } from "react";
import { Activity, Cpu, Settings2 } from "lucide-react";
import type * as PlotlyType from "plotly.js";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    Plotly: typeof PlotlyType;
  }
}

export default function SmithChartCalculator() {
  const [z0, setZ0] = useState<string>("50");
  const [rL, setRL] = useState<string>("50");
  const [xL, setXL] = useState<string>("25");
  const [lengthWL, setLengthWL] = useState<string>("0.125");
  const [plotlyLoaded, setPlotlyLoaded] = useState<boolean>(false);

  const plotRef = useRef<HTMLDivElement>(null);

  // Plotly Initialization
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

  // Calculations
  const results = useMemo(() => {
    const numZ0 = parseFloat(z0);
    const safeZ0 = isNaN(numZ0) || numZ0 <= 0 ? 1 : numZ0;

    const numRL = parseFloat(rL);
    const safeRL = isNaN(numRL) ? 0 : numRL;

    const numXL = parseFloat(xL);
    const safeXL = isNaN(numXL) ? 0 : numXL;

    const numLen = parseFloat(lengthWL);
    const safeLen = isNaN(numLen) || numLen < 0 ? 0 : numLen;

    // 1. Normalized Load Impedance
    const r = safeRL / safeZ0;
    const x = safeXL / safeZ0;

    // 2. Reflection Coefficient (Gamma) at Load
    // Gamma = (z - 1) / (z + 1)
    const numReal = r - 1;
    const numImag = x;
    const denReal = r + 1;
    const denImag = x;

    const denMagSq = denReal * denReal + denImag * denImag;
    const gammaReal = (numReal * denReal + numImag * denImag) / denMagSq;
    const gammaImag = (numImag * denReal - numReal * denImag) / denMagSq;

    const gammaMag = Math.sqrt(gammaReal * gammaReal + gammaImag * gammaImag);
    const gammaPhaseRad = Math.atan2(gammaImag, gammaReal);
    const gammaPhaseDeg = gammaPhaseRad * (180 / Math.PI);

    // 3. VSWR & Return Loss
    let vswr = (1 + gammaMag) / (1 - gammaMag);
    if (gammaMag >= 1 || vswr > 999) vswr = Infinity;

    let returnLoss = -20 * Math.log10(gammaMag);
    if (gammaMag === 0) returnLoss = Infinity;

    // 4. Input Impedance (Z_in)
    // Moving towards the generator rotates Gamma clockwise by 4*pi*(l/lambda)
    const phaseShift = -4 * Math.PI * safeLen;
    const gammaInPhaseRad = gammaPhaseRad + phaseShift;

    const gammaInReal = gammaMag * Math.cos(gammaInPhaseRad);
    const gammaInImag = gammaMag * Math.sin(gammaInPhaseRad);

    // Convert Gamma_in back to normalized z_in = (1 + Gamma_in) / (1 - Gamma_in)
    const zInNumReal = 1 + gammaInReal;
    const zInNumImag = gammaInImag;
    const zInDenReal = 1 - gammaInReal;
    const zInDenImag = -gammaInImag;

    const zInDenMagSq = zInDenReal * zInDenReal + zInDenImag * zInDenImag;
    let zinNormR = Infinity;
    let zinNormX = Infinity;

    if (zInDenMagSq > 1e-10) {
      zinNormR =
        (zInNumReal * zInDenReal + zInNumImag * zInDenImag) / zInDenMagSq;
      zinNormX =
        (zInNumImag * zInDenReal - zInNumReal * zInDenImag) / zInDenMagSq;
    }

    const zinAbsR = zinNormR === Infinity ? Infinity : zinNormR * safeZ0;
    const zinAbsX = zinNormX === Infinity ? Infinity : zinNormX * safeZ0;

    return {
      r,
      x,
      gammaMag,
      gammaPhaseDeg,
      gammaPhaseRad,
      vswr,
      returnLoss,
      safeLen,
      safeZ0,
      zinNormR,
      zinNormX,
      zinAbsR,
      zinAbsX,
    };
  }, [z0, rL, xL, lengthWL]);

  // Generate Chart Data
  const chartData = useMemo(() => {
    const swrCircleR: number[] = [];
    const swrCircleX: number[] = [];
    const arcR: number[] = [];
    const arcX: number[] = [];

    if (results.gammaMag > 0.001 && results.gammaMag < 0.999) {
      // 1. Full SWR Circle
      for (let i = 0; i <= 100; i++) {
        const theta = (i / 100) * 2 * Math.PI;
        const u = results.gammaMag * Math.cos(theta);
        const v = results.gammaMag * Math.sin(theta);
        const denom = Math.pow(1 - u, 2) + Math.pow(v, 2);

        if (denom > 1e-8) {
          swrCircleR.push((1 - u * u - v * v) / denom);
          swrCircleX.push((2 * v) / denom);
        }
      }

      // 2. Arc toward Generator (from Z_L to Z_in)
      if (results.safeLen > 0) {
        const effectiveLen = Math.min(results.safeLen, 0.5);
        const numPoints = Math.max(20, Math.floor(effectiveLen * 200));

        for (let i = 0; i <= numPoints; i++) {
          const shift = (i / numPoints) * (4 * Math.PI * effectiveLen);
          const phi = results.gammaPhaseRad - shift;
          const u = results.gammaMag * Math.cos(phi);
          const v = results.gammaMag * Math.sin(phi);
          const denom = Math.pow(1 - u, 2) + Math.pow(v, 2);

          if (denom > 1e-8) {
            arcR.push((1 - u * u - v * v) / denom);
            arcX.push((2 * v) / denom);
          }
        }
      }
    }
    return { swrCircleR, swrCircleX, arcR, arcX };
  }, [results]);

  useEffect(() => {
    if (!plotlyLoaded || !plotRef.current || !window.Plotly) return;

    const traces: PlotlyType.Data[] = [];

    // 1. SWR Circle (Dashed Green)
    if (chartData.swrCircleR.length > 0) {
      traces.push({
        type: "scattersmith",
        mode: "lines",
        name: `SWR = ${results.vswr === Infinity ? "∞" : results.vswr.toFixed(2)}`,
        real: chartData.swrCircleR,
        imag: chartData.swrCircleX,
        line: { color: "#22c55e", width: 2, dash: "dash" },
        hoverinfo: "skip",
      } as unknown as PlotlyType.Data);
    }

    // 2. Rotation Arc (Thick Red)
    if (chartData.arcR.length > 0) {
      traces.push({
        type: "scattersmith",
        mode: "lines",
        name: "WTG Rotation",
        real: chartData.arcR,
        imag: chartData.arcX,
        line: { color: "#ef4444", width: 3 },
        hoverinfo: "skip",
      } as unknown as PlotlyType.Data);
    }

    // 3. Normalised Load Impedance z_load Point
    traces.push({
      type: "scattersmith",
      mode: "markers",
      name: "Normalised Load (z_load) ",
      real: [results.r],
      imag: [results.x],
      marker: {
        color: "#3b82f6",
        size: 12,
        symbol: "circle",
        line: { color: "white", width: 1 },
      },
      hovertemplate: `<b>z_load</b><br>Real: %{real:.3f} <br>Imag: %{imag:.3f} <extra></extra>`,
    } as unknown as PlotlyType.Data);

    // 4. Normlalised Input Impedance z_in Point
    if (results.safeLen > 0) {
      traces.push({
        type: "scattersmith",
        mode: "markers",
        name: "Normalised Input (z_in)",
        real: [results.zinNormR],
        imag: [results.zinNormX],
        marker: {
          color: "#ef4444",
          size: 12,
          symbol: "diamond",
          line: { color: "white", width: 1 },
        },
        hovertemplate: `<b>z_in</b><br>Real: %{real:.3f} <br>Imag: %{imag:.3f} <extra></extra>`,
      } as unknown as PlotlyType.Data);
    }

    const layout = {
      paper_bgcolor: "#ffffff",
      plot_bgcolor: "#ffffff",
      autosize: true,
      height: 650,
      width: 650,
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
      margin: { l: 40, r: 40, t: 110, b: 40 },
      showlegend: true,
      legend: {
        orientation: "v",
        x: 0.5,
        xanchor: "center",
        y: 1.27,
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
  }, [results, chartData, plotlyLoaded]);

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setter(e.target.value);

  const formatComplex = (real: number, imag: number, isNorm = false) => {
    if (!isFinite(real) || !isFinite(imag)) return "∞";
    const rStr = real.toFixed(isNorm ? 3 : 1);
    const iStr = Math.abs(imag).toFixed(isNorm ? 3 : 1);
    const sign = imag >= 0 ? "+" : "-";
    return `${rStr} ${sign} j${iStr}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8 flex flex-col md:flex-row gap-6">
      <style>{`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button { opacity: 1 !important; display: flex !important; }
      `}</style>

      <div className="w-full md:w-96 flex flex-col gap-6">
        {/* Inputs */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-2">
            <Settings2 className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-800">Parameters</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Characteristic Impedance (Z₀)
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Load Res. (R<sub>L</sub>)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={rL}
                    onChange={handleInputChange(setRL)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-4 pr-12 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                  <span className="absolute right-4 top-2 text-slate-400 pointer-events-none">
                    Ω
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Load React. (X<sub>L</sub>)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={xL}
                    onChange={handleInputChange(setXL)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-4 pr-12 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                  <span className="absolute right-4 top-2 text-slate-400 pointer-events-none">
                    Ω
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Line Length (l)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  value={lengthWL}
                  onChange={handleInputChange(setLengthWL)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-4 pr-12 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-colors"
                />
                <span className="absolute right-4 top-2 text-slate-400 pointer-events-none">
                  λ
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-2">
            <Activity className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-800">Analysis</h2>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center bg-blue-50/50 p-3 rounded-lg border border-blue-100">
              <span className="text-slate-600 text-sm">
                Normalised Load (z<sub>L</sub>)
              </span>
              <span className="font-mono text-blue-600 font-medium">
                {formatComplex(results.r, results.x, true)}
              </span>
            </div>

            <div className="flex justify-between items-center bg-red-50/50 p-3 rounded-lg border border-red-100">
              <span className="text-slate-600 text-sm">
                Input (Z<sub>in</sub>)
              </span>
              <span className="font-mono text-red-600 font-bold">
                {formatComplex(results.zinAbsR, results.zinAbsX, false)} Ω
              </span>
            </div>

            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-slate-600 text-sm">Refl. Coeff. (Γ)</span>
              <span className="font-mono text-emerald-600 font-medium">
                {results.gammaMag.toFixed(3)} ∠{" "}
                {results.gammaPhaseDeg.toFixed(1)}°
              </span>
            </div>

            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-slate-600 text-sm">VSWR</span>
              <span className="font-mono text-slate-900 font-medium">
                {results.vswr === Infinity ? "∞" : results.vswr.toFixed(2)} : 1
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Smith Chart */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center min-h-[600px]">
        {!plotlyLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
            <Cpu className="w-10 h-10 text-blue-500 animate-pulse mb-4" />
            <p className="text-slate-500 font-medium">
              Loading Chart Engine...
            </p>
          </div>
        )}

        <div className="flex flex-col items-center gap-3 mb-4">
          <div
            ref={plotRef}
            className="w-[650px] h-[650px] max-w-full"
            style={{
              opacity: plotlyLoaded ? 1 : 0,
              transition: "opacity 0.3s ease-in-out",
            }}
          />

          <Button
            size="sm"
            onClick={() => {
              if (plotRef.current && window.Plotly) {
                window.Plotly.downloadImage(plotRef.current, {
                  format: "png",
                  filename: "smith_chart",
                  height: 800,
                  width: 800,
                });
              }
            }}
          >
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}
