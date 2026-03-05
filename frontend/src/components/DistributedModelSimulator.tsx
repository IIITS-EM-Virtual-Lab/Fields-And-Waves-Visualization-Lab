import { useState, useMemo } from "react";
import {
  calculateDerivedValues,
  magnitude,
  phase,
} from "../pages/transmission-line/transmissionLineMath";

import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function DistributedModelSimulator() {
  const [R, setR] = useState(0.5);
  const [L, setL] = useState(2e-7);
  const [C, setC] = useState(100e-12);
  const [G, setG] = useState(0.01);
  const [frequency, setFrequency] = useState(1e6);
  const [lossless, setLossless] = useState(false);

  const results = useMemo(() => {
    return calculateDerivedValues(R, L, G, C, frequency, lossless);
  }, [R, L, G, C, frequency, lossless]);

  const graphData = useMemo(() => {
    const data = [];
    for (let f = 1e5; f <= 1e8; f *= 1.15) {
      const res = calculateDerivedValues(R, L, G, C, f, lossless);
      data.push({
        frequency: f,
        alpha: res.alpha,
        vp: res.vp,
      });
    }
    return data;
  }, [R, L, G, C, lossless]);

  return (
    <div style={{ display: "flex", padding: "2rem", gap: "2rem" }}>
      
      {/* LEFT PANEL */}
      <div style={{ width: "320px" }}>
        <h2>Distributed Line Controls</h2>

        <label>
          <input
            type="checkbox"
            checked={lossless}
            onChange={() => setLossless(!lossless)}
          />
          Lossless Mode
        </label>

        {!lossless && (
          <>
            <p>R (Ω/m)</p>
            <input type="range" min="0" max="5" step="0.1"
              value={R} onChange={e => setR(Number(e.target.value))} />

            <p>G (S/m)</p>
            <input type="range" min="0" max="0.1" step="0.001"
              value={G} onChange={e => setG(Number(e.target.value))} />
          </>
        )}

        <p>L (H/m)</p>
        <input type="range" min="1e-9" max="1e-6" step="1e-9"
          value={L} onChange={e => setL(Number(e.target.value))} />

        <p>C (F/m)</p>
        <input type="range" min="1e-12" max="1e-9" step="1e-12"
          value={C} onChange={e => setC(Number(e.target.value))} />

        <p>Frequency (Hz)</p>
        <input type="range" min="1e5" max="1e8" step="1e5"
          value={frequency}
          onChange={e => setFrequency(Number(e.target.value))} />
      </div>

      {/* RIGHT PANEL */}
      <div style={{ flex: 1 }}>
        <h2>Transmission Line Equations</h2>

        {!lossless ? (
          <BlockMath math={"Z_0 = \\sqrt{\\frac{R + j\\omega L}{G + j\\omega C}}"} />
        ) : (
          <BlockMath math={"Z_0 = \\sqrt{\\frac{L}{C}}"} />
        )}

        <h2>Computed Results</h2>
        <p>Z₀ = {results.Z0.re.toFixed(3)} + j{results.Z0.im.toFixed(3)} Ω</p>
        <p>|Z₀|: {magnitude(results.Z0).toFixed(3)} Ω</p>
        <p>∠Z₀: {(phase(results.Z0) * 180 / Math.PI).toFixed(3)}°</p>
        <p>α: {results.alpha.toExponential(3)} Np/m</p>
        <p>β: {results.beta.toExponential(3)} rad/m</p>
        <p>Phase Velocity: {results.vp.toExponential(3)} m/s</p>
        <p>Wavelength: {results.wavelength.toExponential(3)} m</p>

        <h3>Attenuation vs Frequency</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="frequency" tickFormatter={(v)=>v.toExponential(1)} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="alpha" stroke="#ff0000" dot={false} />
          </LineChart>
        </ResponsiveContainer>

        <h3>Phase Velocity vs Frequency</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={graphData}  margin={{ top: 20, right: 30, left: 60, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="frequency" tickFormatter={(v)=>v.toExponential(1)} />
            <YAxis
  tickFormatter={(v) => (v / 1e6).toFixed(1)}
  label={{
    value: "Phase Velocity (Mm/s)",
    angle: -90,
    position: "insideLeft"
  }}
/>

<Tooltip
  formatter={(value) => [(Number(value) / 1e6).toFixed(2) + " Mm/s"]}
/>


            <Line type="monotone" dataKey="vp" stroke="#0000ff" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
