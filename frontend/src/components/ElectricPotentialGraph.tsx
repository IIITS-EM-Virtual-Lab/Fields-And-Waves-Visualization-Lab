import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const k = 9e9; // Coulomb's constant in N·m²/C²

function ElectricPotentialGraph() {
  const [q, setQ] = useState(2e-9); // in Coulombs
  const [r, setR] = useState(1); // distance in meters

  const V = useMemo(() => (r !== 0 ? (k * q) / r : Infinity), [q, r]);

  const data = useMemo(() => {
    const result = [];
    for (let i = 0.1; i <= 10; i += 0.1) {
      result.push({
        r: parseFloat(i.toFixed(1)),
        V: (k * q) / i,
      });
    }
    return result;
  }, [q]);

  return (
    <div className="flex flex-col items-center gap-6 p-2 sm:p-4 md:p-6 w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center">Electric Potential vs Distance Graph</h2>

      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center w-full">
          <label className="font-semibold">Charge (q in C):</label>
          <input
            type="number"
            step="1e-9"
            value={q}
            onChange={(e) => setQ(parseFloat(e.target.value))}
            className="border px-2 py-1 w-full sm:w-32 min-w-0"
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="font-semibold">Distance (r in meters): {r.toFixed(1)}</label>
          <input
            type="range"
            min={0.1}
            max={10}
            step={0.1}
            value={r}
            onChange={(e) => setR(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="bg-white border rounded p-2 shadow text-lg w-full text-center">
          V(r) = {V === Infinity ? '\u221e' : V.toExponential(3)} V
        </div>

        <div className="w-full h-[200px] sm:h-[300px] overflow-x-auto">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: 70, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="r" label={{ value: 'r (m)', position: 'insideBottomRight', offset: -5 }} />
              <YAxis label={{ value: 'V (V)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => (typeof value === 'number' ? value.toExponential(2) : value )} />
              <Line type="monotone" dataKey="V" stroke="#8884d8" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default ElectricPotentialGraph;