import { useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import Axes from './Axes';
import VectorArrow from './VectorArrow';

const epsilon0 = 8.854e-12;

function GaussLawVisualizer() {
  const [chargeValue, setChargeValue] = useState(1e-9); // 1nC
  const [chargePosition, setChargePosition] = useState([0, 0, 0]);
  const [surfaceRadius, setSurfaceRadius] = useState(2);

  const charge = useMemo(() => new THREE.Vector3(...chargePosition), [chargePosition]);

  // Flux = Q / ε₀
  const flux = useMemo(() => chargeValue / epsilon0, [chargeValue]);

  // Generate outward field lines from point charge
  const fieldVectors = useMemo(() => {
    const vectors: { from: [number, number, number]; to: [number, number, number] }[] = [];
  
    const directions = [
      [1, 1, 1],
      [-1, 1, 1],
      [1, -1, 1],
      [1, 1, -1],
      [1, -1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
      [-1, -1, -1],
    ];
  
    for (const [dx, dy, dz] of directions) {
      const dir = new THREE.Vector3(dx, dy, dz).normalize();
      const from = chargeValue > 0
        ? charge.toArray()
        : dir.clone().multiplyScalar(surfaceRadius).add(charge).toArray();
      const to = chargeValue > 0
        ? dir.clone().multiplyScalar(surfaceRadius).add(charge).toArray()
        : charge.toArray();
      vectors.push({ from, to });
    }
  
    return vectors;
  }, [charge, surfaceRadius, chargeValue]);

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl w-full">
        <div>
          <h2 className="font-bold mb-1">Point Charge:</h2>
          <label>Charge (C):
            <input type="number" value={chargeValue} onChange={(e) => setChargeValue(Number(e.target.value))} className="border px-2 py-1 w-32 max-w-full ml-2" step="1e-9" />
          </label>
          <div className="mt-2 flex flex-col sm:flex-row gap-2 sm:gap-2">
            <label className="flex items-center">X: <input type="number" value={chargePosition[0]} onChange={(e) => setChargePosition([+e.target.value, chargePosition[1], chargePosition[2]])} className="border w-20 max-w-full px-2 py-1 ml-1" /></label>
            <label className="flex items-center">Y: <input type="number" value={chargePosition[1]} onChange={(e) => setChargePosition([chargePosition[0], +e.target.value, chargePosition[2]])} className="border w-20 max-w-full px-2 py-1 ml-1" /></label>
            <label className="flex items-center">Z: <input type="number" value={chargePosition[2]} onChange={(e) => setChargePosition([chargePosition[0], chargePosition[1], +e.target.value])} className="border w-20 max-w-full px-2 py-1 ml-1" /></label>
          </div>
        </div>

        <div>
          <h2 className="font-bold mb-1">Gaussian Surface:</h2>
          <label>Radius: <input type="range" min="0.5" max="5" step="0.1" value={surfaceRadius} onChange={(e) => setSurfaceRadius(+e.target.value)} className="w-full" /></label>
          <div className="mt-2">r = {surfaceRadius.toFixed(1)} m</div>
        </div>
      </div>

      <div className="mt-4 text-lg bg-white border p-2 rounded shadow select-none">
        <span className="font-bold">Electric Flux: </span>Φ = {flux.toExponential(3)} N.m²/C
      </div>

      <div className="relative overflow-hidden rounded-lg border-2 border-blue-600 mt-6 w-full max-w-4xl aspect-video bg-white" style={{ zIndex: 0 }}>
        <Canvas className="!h-full !w-full">
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls />

          <Axes length={20} width={3} fontPosition={4.5} interval={1} xcolor="black" ycolor="black" zcolor="black" />

          {/* Charge */}
          <mesh position={charge.toArray()}>
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshStandardMaterial color={chargeValue > 0 ? 'red' : 'blue'} />
          </mesh>

          {/* Flux surface */}
          <mesh position={charge.toArray()}>
            <sphereGeometry args={[surfaceRadius, 32, 32]} />
            <meshStandardMaterial color={chargeValue > 0 ? 'red' : 'blue'} opacity={0.5} transparent />
          </mesh>

          {/* Field lines */}
          {fieldVectors.map((vec, i) => (
            <VectorArrow
              key={i}
              vector={[vec.to[0] - vec.from[0], vec.to[1] - vec.from[1], vec.to[2] - vec.from[2]]}
              origin={vec.from}
              color={chargeValue > 0 ? 'red' : 'blue'}
            />
          ))}

          {/* Flux label */}
          <Html position={[charge.x, charge.y + surfaceRadius + 0.5, charge.z]} center distanceFactor={8}>
            <div style={{ fontSize: '20px', background: 'white', padding: '6px 10px', borderRadius: '10px', whiteSpace: 'nowrap', userSelect: 'none' }}>
              Φ = {flux.toExponential(3)} N.m²/C
            </div>
          </Html>
        </Canvas>
      </div>
    </div>
  );
}

export default GaussLawVisualizer;