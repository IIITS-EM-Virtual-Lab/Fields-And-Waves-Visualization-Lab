import React, { useState, useEffect, useMemo, useRef } from "react";
import { Settings2, Activity } from "lucide-react";

const cx = (r: number, i: number) => ({ r, i });
const cxAdd = (a: { r: number; i: number }, b: { r: number; i: number }) => cx(a.r + b.r, a.i + b.i);
const cxSub = (a: { r: number; i: number }, b: { r: number; i: number }) => cx(a.r - b.r, a.i - b.i);
const cxDiv = (a: { r: number; i: number }, b: { r: number; i: number }) => {
  const den = b.r * b.r + b.i * b.i;
  return cx((a.r * b.r + a.i * b.i) / den, (a.i * b.r - a.r * b.i) / den);
};
const cxMag = (a: { r: number; i: number }) => Math.sqrt(a.r * a.r + a.i * a.i);
const cxArg = (a: { r: number; i: number }) => Math.atan2(a.i, a.r);

export default function TerminatedTransmissionLineVisualizer() {
  // Input States
  const [z0, setZ0] = useState<string>("50");
  const [rL, setRL] = useState<string>("150");
  const [xL, setXL] = useState<string>("0");
  const [lineLength, setLineLength] = useState<string>("2.0");
  const [loadType, setLoadType] = useState<"Matched" | "Short" | "Open" | "Custom">("Custom");
  const [speed, setSpeed] = useState<number>(1.0);

  const [showIncident, setShowIncident] = useState<boolean>(true);
  const [showReflected, setShowReflected] = useState<boolean>(true);
  const [showTotal, setShowTotal] = useState<boolean>(true);
  const [showEnvelope, setShowEnvelope] = useState<boolean>(true);
  
  const instTotRef = useRef<SVGPathElement>(null);
  const instIncRef = useRef<SVGPathElement>(null);
  const instRefRef = useRef<SVGPathElement>(null);
  const tRef = useRef<number>(0);
  const speedRef = useRef<number>(1.0);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  // SVG Canvas Constants
  const svgW = 900;
  const svgH = 360;
  const centerY = svgH / 2;
  const scaleY = 70;

  const applyPreset = (type: "Matched" | "Short" | "Open") => {
    setLoadType(type);
    if (type === "Matched") {
      setRL(z0);
      setXL("0");
    } else if (type === "Short") {
      setRL("0");
      setXL("0");
    } else if (type === "Open") {
      setRL("99999");
      setXL("0");
    }
  };

  const handleCustomChange = (setter: React.Dispatch<React.SetStateAction<string>>) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLoadType("Custom");
      setter(e.target.value);
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
  };

  const results = useMemo(() => {
    const numZ0 = Math.max(0.1, parseFloat(z0) || 50);
    const numRL = parseFloat(rL) || 0;
    const numXL = parseFloat(xL) || 0;
    const numLen = Math.max(0.1, parseFloat(lineLength) || 2.0);

    const Z0 = cx(numZ0, 0);
    const ZL = cx(numRL, numXL);

    // Reflection Coefficient Gamma_L = (ZL - Z0) / (ZL + Z0)
    const gammaL = cxDiv(cxSub(ZL, Z0), cxAdd(ZL, Z0));
    const gammaMag = cxMag(gammaL);
    let gammaAng = cxArg(gammaL);
    if (gammaAng < 0) gammaAng += 2 * Math.PI; // Normalize 0 to 2pi

    // VSWR
    const vswr = gammaMag < 0.999 ? (1 + gammaMag) / (1 - gammaMag) : Infinity;

    // Calculate Nodes (Minima) and Antinodes (Maxima)
    const nodes: number[] = [];
    const antinodes: number[] = [];
    
    if (gammaMag > 0.01) {
      for (let n = -2; n <= Math.ceil(numLen * 2); n++) {
        const d_anti = (gammaAng / (4 * Math.PI)) + (n / 2);
        if (d_anti >= 0 && d_anti <= numLen) antinodes.push(d_anti);

        const d_node1 = d_anti + 0.25;
        const d_node2 = d_anti - 0.25;
        if (d_node1 >= 0 && d_node1 <= numLen) nodes.push(d_node1);
        if (d_node2 >= 0 && d_node2 <= numLen) nodes.push(d_node2);
      }
    }

    const uniqueNodes = [...new Set(nodes.map(n => Number(n.toFixed(4))))].sort((a,b)=>a-b);
    const uniqueAntinodes = [...new Set(antinodes.map(n => Number(n.toFixed(4))))].sort((a,b)=>a-b);

    // Generate Static Envelope Path
    const N = 400;
    let pathEnvOutline = "";
    let pathEnvArea = "";

    // Top Boundary
    for (let i = 0; i <= N; i++) {
      const d = numLen * (N - i) / N; // Map x=0 (Generator) to x=svgW (Load)
      const x = (i / N) * svgW;
      const mag = Math.sqrt(1 + gammaMag*gammaMag + 2*gammaMag*Math.cos(gammaAng - 4*Math.PI*d));
      const y = centerY - scaleY * mag;
      pathEnvOutline += `${i === 0 ? "M" : "L"} ${x} ${y} `;
      pathEnvArea += `${i === 0 ? "M" : "L"} ${x} ${y} `;
    }
    
    // Bottom Boundary
    for (let i = N; i >= 0; i--) {
      const d = numLen * (N - i) / N;
      const x = (i / N) * svgW;
      const mag = Math.sqrt(1 + gammaMag*gammaMag + 2*gammaMag*Math.cos(gammaAng - 4*Math.PI*d));
      const y = centerY + scaleY * mag;
      pathEnvOutline += `L ${x} ${y} `;
      pathEnvArea += `L ${x} ${y} `;
    }
    pathEnvOutline += "Z";
    pathEnvArea += "Z";

    return {
      gammaMag, gammaAng, vswr, numLen, N,
      uniqueNodes, uniqueAntinodes,
      pathEnvOutline, pathEnvArea
    };
  }, [z0, rL, xL, lineLength, centerY]);

  useEffect(() => {
    let animationFrameId: number;

    const renderLoop = () => {
      tRef.current += 0.05 * speedRef.current; 
      const t = tRef.current;

      let pathTot = "";
      let pathInc = "";
      let pathRef = "";

      for (let i = 0; i <= results.N; i++) {
        const d = results.numLen * (results.N - i) / results.N; 
        const x = (i / results.N) * svgW;
        
        // Incident Wave
        const vInc = Math.cos(t + 2 * Math.PI * d);
        const yInc = centerY - scaleY * vInc;
        
        // Reflected Wave
        const vRef = results.gammaMag * Math.cos(t - 2 * Math.PI * d + results.gammaAng);
        const yRef = centerY - scaleY * vRef;

        // Superposition
        const yTot = centerY - scaleY * (vInc + vRef);

        pathInc += `${i === 0 ? "M" : "L"} ${x} ${yInc} `;
        pathRef += `${i === 0 ? "M" : "L"} ${x} ${yRef} `;
        pathTot += `${i === 0 ? "M" : "L"} ${x} ${yTot} `;
      }

      if (instIncRef.current) instIncRef.current.setAttribute("d", showIncident ? pathInc : "");
      if (instRefRef.current) instRefRef.current.setAttribute("d", showReflected ? pathRef : "");
      if (instTotRef.current) instTotRef.current.setAttribute("d", showTotal ? pathTot : "");

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [centerY, results, showIncident, showReflected, showTotal]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8 flex flex-col gap-6">
      <style>{`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button { opacity: 1 !important; display: flex !important; }
      `}</style>

      {/* TOP ROW: Parameters & Analysis Side-by-Side */}
      <div className="flex flex-col xl:flex-row gap-6 items-stretch">
        
        {/* LEFT CARD: Parameters */}
        <div className="w-full xl:w-1/2 flex flex-col">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-4 flex-1">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-2">
              <Settings2 className="w-5 h-5 text-slate-400" />
              <h2 className="text-lg font-semibold text-slate-800">Parameters</h2>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-lg mb-2">
              {(["Matched", "Short", "Open"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => applyPreset(type)}
                  className={`flex-1 text-sm py-1.5 rounded-md font-medium transition-colors ${
                    loadType === type ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Characteristic Imp. (Z<sub>0</sub>)</label>
                <div className="relative">
                  <input type="number" value={z0} onChange={handleInputChange(setZ0)} className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-4 pr-12 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors text-slate-900" />
                  <span className="absolute right-4 top-2 text-slate-400 pointer-events-none">Ω</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Load R<sub>L</sub></label>
                  <div className="relative">
                    <input type="number" value={rL} onChange={handleCustomChange(setRL)} className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-4 pr-12 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors text-slate-900" />
                    <span className="absolute right-4 top-2 text-slate-400 pointer-events-none">Ω</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Load X<sub>L</sub></label>
                  <div className="relative">
                    <input type="number" value={xL} onChange={handleCustomChange(setXL)} className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-4 pr-12 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors text-slate-900" />
                    <span className="absolute right-4 top-2 text-slate-400 pointer-events-none">Ω</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Line Length (l)</label>
                <div className="relative">
                  <input type="number" step="0.1" min="0" value={lineLength} onChange={handleInputChange(setLineLength)} className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-4 pr-12 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors text-slate-900" />
                  <span className="absolute right-4 top-2 text-slate-400 pointer-events-none">λ</span>
                </div>
              </div>
            </div>

            <div className="mt-2 pt-4 border-t border-slate-100">
              <label className="block text-sm font-medium text-slate-600 mb-3">Animation Speed</label>
              <div className="flex items-center gap-4 px-1">
                <span className="text-xs font-semibold text-slate-400 w-6 text-right">0.1x</span>
                <input 
                  type="range" 
                  min="0.1" 
                  max="3" 
                  step="0.1" 
                  value={speed} 
                  onChange={(e) => setSpeed(parseFloat(e.target.value))} 
                  className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                />
                <span className="text-xs font-semibold text-slate-400 w-6">3x</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT CARD: Analysis */}
        <div className="w-full xl:w-1/2 flex flex-col">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-4 flex-1">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-2">
              <Activity className="w-5 h-5 text-slate-400" />
              <h2 className="text-lg font-semibold text-slate-800">Analysis</h2>
            </div>

            <div className="space-y-4 mt-2">
              <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-slate-600 font-medium">Voltage Standing Wave Ratio (VSWR)</span>
                <span className="font-mono text-slate-900 font-bold text-lg">
                  {results.vswr === Infinity ? "∞" : results.vswr.toFixed(2)} : 1
                </span>
              </div>

              <div className="flex justify-between items-center bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <span className="text-slate-600 font-medium">Reflection Magnitude |Γ|</span>
                <span className="font-mono text-blue-700 font-bold text-lg">
                  {results.gammaMag.toFixed(3)}
                </span>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-slate-600 font-medium">Reflection Phase ∠Γ</span>
                <span className="font-mono text-slate-900 font-bold text-lg">
                  {(results.gammaAng * 180 / Math.PI).toFixed(1)}°
                </span>
              </div>
              
              {results.vswr > 1.01 && (
                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-slate-600 font-medium">First Min (Node) Distance</span>
                  <span className="font-mono text-slate-900 font-bold text-lg">
                    {results.uniqueNodes.length > 0 ? `${results.uniqueNodes[0]} λ` : "N/A"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM ROW: Wave Simulation */}
      <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
        <div className="flex items-center justify-between mb-4">
           <h3 className="text-lg font-semibold text-slate-800">Wave Simulation</h3>
        </div>

        <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-6 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" checked={showTotal} onChange={() => setShowTotal(!showTotal)} className="w-4 h-4 accent-slate-800" />
            <span className="text-sm font-medium text-slate-800 group-hover:text-slate-950">Total Wave</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" checked={showIncident} onChange={() => setShowIncident(!showIncident)} className="w-4 h-4 accent-blue-500" />
            <span className="text-sm font-medium text-slate-800 group-hover:text-slate-950">Incident</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" checked={showReflected} onChange={() => setShowReflected(!showReflected)} className="w-4 h-4 accent-red-500" />
            <span className="text-sm font-medium text-slate-800 group-hover:text-slate-950">Reflected</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" checked={showEnvelope} onChange={() => setShowEnvelope(!showEnvelope)} className="w-4 h-4 accent-slate-400" />
            <span className="text-sm font-medium text-slate-800 group-hover:text-slate-950">VSWR Envelope</span>
          </label>
        </div>

        <div className="w-full overflow-hidden flex justify-center items-center flex-1 bg-white rounded-xl border border-slate-200 py-4">
          <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto max-w-[1200px]">
            
            {/* Axes and Grid */}
            <line x1="0" y1={centerY} x2={svgW} y2={centerY} stroke="#e2e8f0" strokeWidth="2" strokeDasharray="4 4" />
            <line x1={svgW} y1="20" x2={svgW} y2={svgH - 20} stroke="#64748b" strokeWidth="3" /> {/* Load Plane */}
            <line x1="0" y1="20" x2="0" y2={svgH - 20} stroke="#cbd5e1" strokeWidth="2" strokeDasharray="2 2" /> {/* Gen Plane */}
            
            <text x={svgW + -10} y="30" fill="#334155" fontSize="14" textAnchor="end" fontStyle="italic" fontWeight="600">Z<tspan dy="4" fontSize="10">L</tspan></text>
            <text x="10" y="30" fill="#94a3b8" fontSize="14" textAnchor="start" fontStyle="italic" fontWeight="600">Generator</text>
            <text x={svgW/2} y={svgH - 10} fill="#64748b" fontSize="12" textAnchor="middle" fontStyle="italic">
              Line length (l) = {results.numLen.toFixed(1)} λ
            </text>

            {/* Envelope */}
            {showEnvelope && (
              <g>
                <path d={results.pathEnvArea} fill="#eff6ff" opacity="0.8" />
                <path d={results.pathEnvOutline} fill="none" stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="3 3" />
                
                {/* Nodes & Antinodes Markers */}
                {results.uniqueAntinodes.map((d, i) => {
                  const x = (1 - d / results.numLen) * svgW;
                  const yTop = centerY - scaleY * (1 + results.gammaMag);
                  const yBot = centerY + scaleY * (1 + results.gammaMag);
                  return (
                    <g key={`anti-${i}`}>
                      <line x1={x} y1={yTop} x2={x} y2={yBot} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 4" />
                      <circle cx={x} cy={yTop} r="4" fill="#ef4444" opacity="0.8" />
                      <circle cx={x} cy={yBot} r="4" fill="#ef4444" opacity="0.8" />
                    </g>
                  );
                })}

                {results.uniqueNodes.map((d, i) => {
                  const x = (1 - d / results.numLen) * svgW;
                  const yTop = centerY - scaleY * (1 - results.gammaMag);
                  const yBot = centerY + scaleY * (1 - results.gammaMag);
                  return (
                    <g key={`node-${i}`}>
                      <line x1={x} y1={yTop} x2={x} y2={yBot} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 4" />
                      <circle cx={x} cy={yTop} r="4" fill="#3b82f6" opacity="0.8" />
                      <circle cx={x} cy={yBot} r="4" fill="#3b82f6" opacity="0.8" />
                    </g>
                  );
                })}
              </g>
            )}

            {/* Animated Wave Paths */}
            <path ref={instIncRef} fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.7" />
            <path ref={instRefRef} fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.7" />
            <path ref={instTotRef} fill="none" stroke="#0f172a" strokeWidth="3.5" />
          </svg>
        </div>

        {/* Legend / Info Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 px-4 py-3 bg-slate-50 rounded-xl text-sm border border-slate-100">
          <div className="flex items-center gap-6 mb-2 sm:mb-0">
            <span className="flex items-center gap-2 text-slate-600"><div className="w-2 h-2 rounded-full bg-red-500 opacity-80" /><span>Antinodes (V_max)</span></span>
            <span className="flex items-center gap-2 text-slate-600"><div className="w-2 h-2 rounded-full bg-blue-500 opacity-80" /><span>Nodes (V_min)</span></span>
          </div>
          <div className="text-slate-500 text-xs sm:text-sm">
            Distance between consecutive nodes is <span className="font-mono text-slate-700 font-semibold">λ/2</span>.
          </div>
        </div>

      </div>
    </div>
  );
}