import { useState, useEffect, useMemo, useRef } from "react";
import { Settings2, Activity, Cpu, AlertTriangle, Info } from "lucide-react";
import type * as PlotlyType from "plotly.js";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    Plotly: typeof PlotlyType;
  }
}

// Complex Number Utility
const C = {
  make: (r: number, i: number) => ({ r, i }),
  polar: (mag: number, angDeg: number) => ({
    r: mag * Math.cos((angDeg * Math.PI) / 180),
    i: mag * Math.sin((angDeg * Math.PI) / 180),
  }),
  mag: (c: { r: number; i: number }) => Math.sqrt(c.r * c.r + c.i * c.i),
  magSq: (c: { r: number; i: number }) => c.r * c.r + c.i * c.i,
  phase: (c: { r: number; i: number }) => (Math.atan2(c.i, c.r) * 180) / Math.PI,
  add: (a: { r: number; i: number }, b: { r: number; i: number }) => ({ r: a.r + b.r, i: a.i + b.i }),
  sub: (a: { r: number; i: number }, b: { r: number; i: number }) => ({ r: a.r - b.r, i: a.i - b.i }),
  mul: (a: { r: number; i: number }, b: { r: number; i: number }) => ({
    r: a.r * b.r - a.i * b.i,
    i: a.r * b.i + a.i * b.r,
  }),
  div: (a: { r: number; i: number }, b: { r: number; i: number }) => {
    const den = b.r * b.r + b.i * b.i;
    return { r: (a.r * b.r + a.i * b.i) / den, i: (a.i * b.r - a.r * b.i) / den };
  },
  conj: (a: { r: number; i: number }) => ({ r: a.r, i: -a.i }),
  toString: (c: { r: number; i: number }, prec = 3) =>
    `${C.mag(c).toFixed(prec)} ∠ ${C.phase(c).toFixed(1)}°`,
};

export default function MicrowaveAmplifierDesignVisualization() {
  // S-Parameter States
  const [s11M, setS11M] = useState("0.869");
  const [s11P, setS11P] = useState("-159");
  const [s12M, setS12M] = useState("0.031");
  const [s12P, setS12P] = useState("-9");
  const [s21M, setS21M] = useState("4.250");
  const [s21P, setS21P] = useState("61");
  const [s22M, setS22M] = useState("0.507");
  const [s22P, setS22P] = useState("-117");

  // Environmental States
  const [z0, setZ0] = useState("50");
  const [freq, setFreq] = useState("1.9");
  const [freqUnit, setFreqUnit] = useState("GHz");

  // Terminations
  const [gsM, setGsM] = useState("0");
  const [gsP, setGsP] = useState("0");
  const [glM, setGlM] = useState("0");
  const [glP, setGlP] = useState("0");

  const [plotlyLoaded, setPlotlyLoaded] = useState(false);
  const plotRef = useRef<HTMLDivElement>(null);

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
    const S11 = C.polar(parseFloat(s11M) || 0, parseFloat(s11P) || 0);
    const S12 = C.polar(parseFloat(s12M) || 0, parseFloat(s12P) || 0);
    const S21 = C.polar(parseFloat(s21M) || 0, parseFloat(s21P) || 0);
    const S22 = C.polar(parseFloat(s22M) || 0, parseFloat(s22P) || 0);
    
    const GS = C.polar(parseFloat(gsM) || 0, parseFloat(gsP) || 0);
    const GL = C.polar(parseFloat(glM) || 0, parseFloat(glP) || 0);
    
    const ONE = C.make(1, 0);

    // Determinant
    const Delta = C.sub(C.mul(S11, S22), C.mul(S12, S21));
    const DeltaMag = C.mag(Delta);

    // Rollet Factor (K)
    const K_den = 2 * C.mag(S12) * C.mag(S21);
    const K = K_den > 1e-9 ? (1 - C.magSq(S11) - C.magSq(S22) + C.magSq(Delta)) / K_den : Infinity;

    // Edwards-Sinsky
    const mu_den = C.mag(C.sub(S22, C.mul(Delta, C.conj(S11)))) + C.mag(C.mul(S12, S21));
    const mu = mu_den > 1e-9 ? (1 - C.magSq(S11)) / mu_den : Infinity;

    const muP_den = C.mag(C.sub(S11, C.mul(Delta, C.conj(S22)))) + C.mag(C.mul(S12, S21));
    const muPrime = muP_den > 1e-9 ? (1 - C.magSq(S22)) / muP_den : Infinity;

    const unconditionallyStable = K > 1 && DeltaMag < 1;

    // Output Stability Circle (Gamma L plane)
    const CL_num = C.conj(C.sub(S22, C.mul(Delta, C.conj(S11))));
    const CL_den = C.magSq(S22) - C.magSq(Delta);
    let CL = { r: 0, i: 0 }, RL = 0, outputDegenerate = true;
    if (Math.abs(CL_den) > 1e-6) {
      CL = { r: CL_num.r / CL_den, i: CL_num.i / CL_den };
      RL = Math.abs(C.mag(C.mul(S12, S21)) / CL_den);
      outputDegenerate = false;
    }

    // Input Stability Circle (Gamma S plane)
    const CS_num = C.conj(C.sub(S11, C.mul(Delta, C.conj(S22))));
    const CS_den = C.magSq(S11) - C.magSq(Delta);
    let CS = { r: 0, i: 0 }, RS = 0, inputDegenerate = true;
    if (Math.abs(CS_den) > 1e-6) {
      CS = { r: CS_num.r / CS_den, i: CS_num.i / CS_den };
      RS = Math.abs(C.mag(C.mul(S12, S21)) / CS_den);
      inputDegenerate = false;
    }

    // Gains
    const G_in = C.add(S11, C.div(C.mul(C.mul(S12, S21), GL), C.sub(ONE, C.mul(S22, GL))));
    const G_out = C.add(S22, C.div(C.mul(C.mul(S12, S21), GS), C.sub(ONE, C.mul(S11, GS))));

    const denG = (1 - C.magSq(G_in)) * C.magSq(C.sub(ONE, C.mul(S22, GL)));
    const GainOp = denG > 1e-9 ? (C.magSq(S21) * (1 - C.magSq(GL))) / denG : 0;

    const denGA = (1 - C.magSq(G_out)) * C.magSq(C.sub(ONE, C.mul(S11, GS)));
    const GainAv = denGA > 1e-9 ? (C.magSq(S21) * (1 - C.magSq(GS))) / denGA : 0;

    const denGT = C.magSq(C.sub(ONE, C.mul(GS, G_in))) * C.magSq(C.sub(ONE, C.mul(S22, GL)));
    const GainTr = denGT > 1e-9 ? (C.magSq(S21) * (1 - C.magSq(GS)) * (1 - C.magSq(GL))) / denGT : 0;

    return {
      S11, S12, S21, S22, Delta, DeltaMag, K, mu, muPrime, unconditionallyStable,
      CL, RL, outputDegenerate, CS, RS, inputDegenerate,
      G_in, G_out, GainOp, GainAv, GainTr, GS, GL
    };
  }, [s11M, s11P, s12M, s12P, s21M, s21P, s22M, s22P, gsM, gsP, glM, glP]);

  const chartData = useMemo(() => {
    const toZ = (u: number, v: number) => {
      const denom = (1 - u) * (1 - u) + v * v;
      if (denom < 1e-5) return null;
      return { r: (1 - u * u - v * v) / denom, x: (2 * v) / denom };
    };

    const getCircleTrace = (Center: {r: number, i: number}, Radius: number, color: string, name: string) => {
      const cR = [], cX = [];
      for (let i = 0; i <= 200; i++) {
        const theta = (i / 200) * 2 * Math.PI;
        const u = Center.r + Radius * Math.cos(theta);
        const v = Center.i + Radius * Math.sin(theta);
        const z = toZ(u, v);
        if (z) { cR.push(z.r); cX.push(z.x); }
        else { cR.push(null); cX.push(null); }
      }
      return {
        type: "scattersmith",
        mode: "lines",
        name,
        real: cR,
        imag: cX,
        line: { color, width: 2 },
        hoverinfo: "skip",
      } as unknown as PlotlyType.Data;
    };

    const getShadingTrace = (isInput: boolean, color: string, name: string) => {
      const sR = [], sX = [];
      // Generate passive domain test points
      for(let r = 0; r <= 1; r += 0.05) {
        for(let a = 0; a < 360; a += 10) {
          const u = r * Math.cos(a * Math.PI/180);
          const v = r * Math.sin(a * Math.PI/180);
          
          let isStable = false;
          if (isInput) {
            const GS_test = C.make(u, v);
            const G_out_test = C.add(results.S22, C.div(C.mul(C.mul(results.S12, results.S21), GS_test), C.sub(C.make(1,0), C.mul(results.S11, GS_test))));
            isStable = C.mag(G_out_test) < 1;
          } else {
            const GL_test = C.make(u, v);
            const G_in_test = C.add(results.S11, C.div(C.mul(C.mul(results.S12, results.S21), GL_test), C.sub(C.make(1,0), C.mul(results.S22, GL_test))));
            isStable = C.mag(G_in_test) < 1;
          }
          
          if (!isStable) {
            const z = toZ(u, v);
            if (z) { sR.push(z.r); sX.push(z.x); }
          }
        }
      }
      return {
        type: "scattersmith",
        mode: "markers",
        name,
        real: sR,
        imag: sX,
        marker: { color, size: 3, opacity: 0.3 },
        hoverinfo: "skip",
      } as unknown as PlotlyType.Data;
    };

    const traces: PlotlyType.Data[] = [];
    
    // Input Stability Circle & Terminating Point (Gamma S)
    if (!results.inputDegenerate) {
      traces.push(getCircleTrace(results.CS, results.RS, "#ef4444", "Input Stability Circle"));
      if (!results.unconditionallyStable) {
        traces.push(getShadingTrace(true, "#ef4444", "Input Unstable Region"));
      }
    }
    const gsZ = toZ(results.GS.r, results.GS.i);
    if (gsZ) {
      traces.push({
        type: "scattersmith",
        mode: "markers+text",
        name: "ΓS",
        real: [gsZ.r],
        imag: [gsZ.x],
        text: ["ΓS"],
        textposition: "bottom center",
        marker: { color: "#b91c1c", size: 10, symbol: "circle" }
      } as unknown as PlotlyType.Data);
    }

    // Output Stability Circle & Terminating Point (Gamma L)
    if (!results.outputDegenerate) {
      traces.push(getCircleTrace(results.CL, results.RL, "#3b82f6", "Output Stability Circle"));
      if (!results.unconditionallyStable) {
        traces.push(getShadingTrace(false, "#3b82f6", "Output Unstable Region"));
      }
    }
    const glZ = toZ(results.GL.r, results.GL.i);
    if (glZ) {
      traces.push({
        type: "scattersmith",
        mode: "markers+text",
        name: "ΓL",
        real: [glZ.r],
        imag: [glZ.x],
        text: ["ΓL"],
        textposition: "top center",
        marker: { color: "#1d4ed8", size: 10, symbol: "diamond" }
      } as unknown as PlotlyType.Data);
    }

    return traces;
  }, [results]);

  useEffect(() => {
    if (!plotlyLoaded || !plotRef.current || !window.Plotly) return;
    const layout = {
      paper_bgcolor: "#ffffff",
      plot_bgcolor: "#ffffff",
      autosize: true,
      height: 520,
      width: 520,
      margin: { l: 20, r: 20, t: 40, b: 20 },
      smith: {
        realaxis: { tickcolor: "#94a3b8", gridcolor: "#e2e8f0", linecolor: "#cbd5e1" },
        imagaxis: { tickcolor: "#94a3b8", gridcolor: "#e2e8f0", linecolor: "#cbd5e1" },
      },
      showlegend: true,
      legend: { orientation: "h", x: 0.5, xanchor: "center", y: 1.1, yanchor: "bottom" },
    };
    window.Plotly.react(plotRef.current, chartData, layout as any, { responsive: true, displayModeBar: false });
  }, [chartData, plotlyLoaded]);

  return (
    <div className="w-full bg-slate-50 text-slate-900 font-sans p-4 md:p-6 flex flex-col gap-6 rounded-2xl border border-slate-200">
      <div className="flex flex-col xl:flex-row gap-6">
        
        {/* Left Panel: Inputs */}
        <div className="w-full xl:w-[400px] flex flex-col gap-4">
          
          {/* S-Parameters Card */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-[15px] font-semibold flex items-center gap-2 text-slate-800">
                <Settings2 className="w-4 h-4 text-slate-500" /> S-Parameters
              </h2>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { id: "S11", m: s11M, p: s11P, setM: setS11M, setP: setS11P },
                { id: "S12", m: s12M, p: s12P, setM: setS12M, setP: setS12P },
                { id: "S21", m: s21M, p: s21P, setM: setS21M, setP: setS21P },
                { id: "S22", m: s22M, p: s22P, setM: setS22M, setP: setS22P }
              ].map((s) => (
                <div key={s.id} className="border border-slate-200 rounded-xl p-3 bg-slate-50/30">
                  <label className="text-[13px] font-semibold text-slate-700 mb-2 block">{s.id}</label>
                  <div className="flex gap-2">
                    <div className="w-1/2">
                      <label className="text-[11px] text-slate-500 mb-1 block">Magnitude</label>
                      <input 
                        type="number" 
                        value={s.m} 
                        onChange={e => s.setM(e.target.value)} 
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 h-9 text-[13px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white transition-shadow" 
                      />
                    </div>
                    <div className="w-1/2">
                      <label className="text-[11px] text-slate-500 mb-1 block">Phase (°)</label>
                      <input 
                        type="number" 
                        value={s.p} 
                        onChange={e => s.setP(e.target.value)} 
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 h-9 text-[13px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white transition-shadow" 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-3">
              {[
                { id: "ΓS (Source)", m: gsM, p: gsP, setM: setGsM, setP: setGsP },
                { id: "ΓL (Load)", m: glM, p: glP, setM: setGlM, setP: setGlP }
              ].map((g) => (
                <div key={g.id} className="border border-slate-200 rounded-xl p-3 bg-slate-50/30">
                  <label className="text-[13px] font-semibold text-slate-700 mb-2 block">{g.id}</label>
                  <div className="flex gap-2">
                    <div className="w-1/2">
                      <label className="text-[11px] text-slate-500 mb-1 block">Magnitude</label>
                      <input 
                        type="number" 
                        value={g.m} 
                        onChange={e => g.setM(e.target.value)} 
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 h-9 text-[13px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white transition-shadow" 
                      />
                    </div>
                    <div className="w-1/2">
                      <label className="text-[11px] text-slate-500 mb-1 block">Phase (°)</label>
                      <input 
                        type="number" 
                        value={g.p} 
                        onChange={e => g.setP(e.target.value)} 
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 h-9 text-[13px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white transition-shadow" 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Line Impedance & Frequency Section */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <div className="mb-4">
              <label className="text-[13px] font-semibold text-slate-700 mb-2 block">Line Characteristic Impedance (Z₀)</label>
              <div className="flex items-center gap-3">
                <input 
                  type="number" 
                  value={z0} 
                  onChange={e => setZ0(e.target.value)} 
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 h-9 text-[13px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white transition-shadow" 
                />
                <span className="text-slate-400 font-medium text-sm pr-2">Ω</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[13px] font-semibold text-slate-700 mb-2 block">Frequency (f)</label>
                <input 
                  type="number" 
                  value={freq} 
                  onChange={e => setFreq(e.target.value)} 
                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 h-9 text-[13px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white transition-shadow" 
                />
              </div>
              <div>
                <label className="text-[13px] font-semibold text-slate-700 mb-2 block">Unit</label>
                <select 
                  value={freqUnit} 
                  onChange={e => setFreqUnit(e.target.value)} 
                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 h-9 text-[13px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white transition-shadow appearance-none cursor-pointer"
                >
                  <option value="MHz">MHz</option>
                  <option value="GHz">GHz</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stability Metrics Card */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
             <h2 className="text-base font-semibold flex items-center gap-2 text-slate-800 mb-4">
                <Activity className="w-5 h-5 text-slate-400" /> Stability Metrics
              </h2>
              {results.unconditionallyStable ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg mb-4 font-medium text-sm flex items-center gap-2">
                  Unconditionally Stable (K &gt; 1, |Δ| &lt; 1)
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-lg mb-4 font-medium text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Potentially Unstable
                </div>
              )}
              <div className="grid grid-cols-2 gap-3 text-[13px]">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center">
                  <span className="text-slate-500 font-medium">|Δ|</span><span className="font-mono text-slate-800 font-semibold">{results.DeltaMag.toFixed(3)}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center">
                  <span className="text-slate-500 font-medium">K</span><span className="font-mono text-slate-800 font-semibold">{results.K.toFixed(3)}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center">
                  <span className="text-slate-500 font-medium">μ (Input)</span><span className="font-mono text-slate-800 font-semibold">{results.mu.toFixed(3)}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center">
                  <span className="text-slate-500 font-medium">μ' (Output)</span><span className="font-mono text-slate-800 font-semibold">{results.muPrime.toFixed(3)}</span>
                </div>
              </div>
          </div>
        </div>

        {/* Right Panel: Chart & Gains */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center gap-4">
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="text-center">
                <h2 className="text-base font-semibold text-slate-800">
                  Smith Chart
                </h2>
              </div>
              <div className="relative flex justify-center items-center w-full min-h-[520px]">
                {!plotlyLoaded && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10 rounded-2xl">
                    <Cpu className="w-8 h-8 text-blue-500 animate-pulse mb-2" />
                    <p className="text-sm text-slate-500 font-medium">
                      Loading Smith Chart Engine...
                    </p>
                  </div>
                )}
                <div
                  ref={plotRef}
                  className="w-[520px] h-[520px] max-w-full"
                  style={{
                    opacity: plotlyLoaded ? 1 : 0,
                    transition: "opacity 0.3s ease-in-out",
                  }}
                />
              </div>
              <Button
                size="sm"
                variant="outline"
                className="mt-5"
                onClick={() => {
                  if (plotRef.current && window.Plotly) {
                    window.Plotly.downloadImage(plotRef.current, {
                      format: "png",
                      filename: "microwave_amplifier_combined_smith_chart",
                      height: 700,
                      width: 700,
                    });
                  }
                }}
              >
                Download
              </Button>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
             <h2 className="text-base font-semibold text-slate-800 mb-4">Power Gains</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="text-[13px] text-slate-500 mb-1 font-semibold">Operating (G)</div>
                  <div className="font-mono text-xl font-medium text-slate-800 mb-1">{results.GainOp > 0 ? (10 * Math.log10(results.GainOp)).toFixed(2) : "--"} <span className="text-sm text-slate-500 font-sans font-normal">dB</span></div>
                  <div className="text-[11px] text-slate-400 mt-2 leading-tight">Depends on ΓL.<br/>Independent of ΓS.</div>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="text-[13px] text-slate-500 mb-1 font-semibold">Available (GA)</div>
                  <div className="font-mono text-xl font-medium text-slate-800 mb-1">{results.GainAv > 0 ? (10 * Math.log10(results.GainAv)).toFixed(2) : "--"} <span className="text-sm text-slate-500 font-sans font-normal">dB</span></div>
                  <div className="text-[11px] text-slate-400 mt-2 leading-tight">Depends on ΓS.<br/>Independent of ΓL.</div>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="text-[13px] text-slate-500 mb-1 font-semibold">Transducer (GT)</div>
                  <div className="font-mono text-xl font-medium text-slate-800 mb-1">{results.GainTr > 0 ? (10 * Math.log10(results.GainTr)).toFixed(2) : "--"} <span className="text-sm text-slate-500 font-sans font-normal">dB</span></div>
                  <div className="text-[11px] text-slate-400 mt-2 leading-tight">Actual gain delivered to load.</div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
