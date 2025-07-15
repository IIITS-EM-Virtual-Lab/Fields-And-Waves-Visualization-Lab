import { useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import Axes from './Axes';
import VectorArrow from './VectorArrow';

const epsilon0 = 8.854e-12;

function GaussApplicationVisualizer() {
  const [chargeValue, setChargeValue] = useState(1e-9); // 1nC
  const [chargePosition, setChargePosition] = useState([0, 0, 0]);
  const [surfaceRadius, setSurfaceRadius] = useState(2);

  const charge = useMemo(() => new THREE.Vector3(...chargePosition), [chargePosition]);
  const surfaceCenter = new THREE.Vector3(0, 0, 0);

  const isEnclosed = charge.distanceTo(surfaceCenter) <= surfaceRadius;
  const totalFlux = useMemo(() => (isEnclosed ? chargeValue / epsilon0 : 0), [isEnclosed, chargeValue]);

  const numericalFlux = useMemo(() => {
    const n = 20; // grid resolution
    let fluxSum = 0;

    for (let theta = 0; theta < Math.PI; theta += Math.PI / n) {
      for (let phi = 0; phi < 2 * Math.PI; phi += Math.PI / n) {
        const x = surfaceRadius * Math.sin(theta) * Math.cos(phi);
        const y = surfaceRadius * Math.sin(theta) * Math.sin(phi);
        const z = surfaceRadius * Math.cos(theta);

        const dS = new THREE.Vector3(x, y, z).normalize().multiplyScalar(surfaceRadius ** 2 * Math.sin(theta) * Math.PI ** 2 / (n ** 2));

        const rVec = new THREE.Vector3(x, y, z).sub(charge);
        const rMag = rVec.length();
        if (rMag === 0) continue;

        const D = rVec.clone().normalize().multiplyScalar(chargeValue / (4 * Math.PI * epsilon0 * rMag ** 2));
        fluxSum += D.dot(dS);
      }
    }
    return fluxSum;
  }, [charge, surfaceRadius, chargeValue]);

  const area = useMemo(() => 4 * Math.PI * surfaceRadius ** 2, [surfaceRadius]);
  const dS = {
    xy: new THREE.Vector3(0, 0, 1),
    yz: new THREE.Vector3(1, 0, 0),
    zx: new THREE.Vector3(0, 1, 0),
  };

  const displacement = useMemo(() => {
    const r = charge.clone().sub(surfaceCenter);
    const rMag = r.length();
    return r.divideScalar(rMag ** 3).multiplyScalar(chargeValue / (4 * Math.PI * epsilon0));
  }, [charge, chargeValue]);

  const psi = useMemo(() => {
    return {
      xy: displacement.dot(dS.xy) * area,
      yz: displacement.dot(dS.yz) * area,
      zx: displacement.dot(dS.zx) * area,
    };
  }, [displacement, dS, area]);

  const fieldVectors = useMemo(() => {
    const vectors = [];
    const directions = [
      [1, 1, 1], [-1, 1, 1], [1, -1, 1], [1, 1, -1],
      [1, -1, -1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1]
    ];

    for (const [dx, dy, dz] of directions) {
      const dir = new THREE.Vector3(dx, dy, dz).normalize();
      const from = chargeValue > 0 ? charge.toArray() : dir.clone().multiplyScalar(surfaceRadius).add(charge).toArray();
      const to = chargeValue > 0 ? dir.clone().multiplyScalar(surfaceRadius).add(charge).toArray() : charge.toArray();
      vectors.push({ from, to });
    }
    return vectors;
  }, [charge, surfaceRadius, chargeValue]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="grid grid-cols-2 gap-4 max-w-4xl w-full">
        <div>
          <h2 className="font-bold mb-1">Point Charge:</h2>
          <label>Charge (C):
            <input type="number" value={chargeValue} onChange={(e) => setChargeValue(Number(e.target.value))} className="border px-2 py-1 w-32 ml-2" step="1e-9" />
          </label>
          <div className="mt-2">
            <label>X: <input type="number" value={chargePosition[0]} onChange={(e) => setChargePosition([+e.target.value, chargePosition[1], chargePosition[2]])} className="border w-20 px-2 py-1 ml-1" /></label>
            <label className="ml-2">Y: <input type="number" value={chargePosition[1]} onChange={(e) => setChargePosition([chargePosition[0], +e.target.value, chargePosition[2]])} className="border w-20 px-2 py-1 ml-1" /></label>
            <label className="ml-2">Z: <input type="number" value={chargePosition[2]} onChange={(e) => setChargePosition([chargePosition[0], chargePosition[1], +e.target.value])} className="border w-20 px-2 py-1 ml-1" /></label>
          </div>
        </div>

        <div>
          <h2 className="font-bold mb-1">Gaussian Surface:</h2>
          <label>Radius: <input type="range" min="0.5" max="5" step="0.1" value={surfaceRadius} onChange={(e) => setSurfaceRadius(+e.target.value)} className="w-full" /></label>
          <div className="mt-2">r = {surfaceRadius.toFixed(1)} m</div>
        </div>
      </div>

      <div className="mt-4 bg-white border p-4 rounded shadow select-none text-lg">
        <div><b>Total Flux:</b> Φ = {totalFlux.toExponential(3)} N·m²/C</div>
        <div><b>Numerical ∮D·dS:</b> ≈ {numericalFlux.toExponential(3)} N·m²/C</div>
        <div className="mt-2 text-sm">
          <div>ψ (XY plane) = {psi.xy.toExponential(3)} N·m²/C</div>
          <div>ψ (YZ plane) = {psi.yz.toExponential(3)} N·m²/C</div>
          <div>ψ (ZX plane) = {psi.zx.toExponential(3)} N·m²/C</div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-lg border-2 border-blue-600 mt-6" style={{ height: 500, width: 800, zIndex: 0 }}>
        <Canvas style={{ height: '100%', width: '100%' }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls />

          <Axes length={20} width={3} fontPosition={4.5} interval={1} xcolor="black" ycolor="black" zcolor="black" />

          <mesh position={charge.toArray()}>
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshStandardMaterial color={chargeValue > 0 ? 'red' : 'blue'} />
          </mesh>

          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[surfaceRadius, 64, 64]} />
            <meshStandardMaterial color={chargeValue > 0 ? 'red' : 'blue'} opacity={0.3} transparent />
          </mesh>

          {fieldVectors.map((vec, i) => (
            <VectorArrow
              key={i}
              vector={[vec.to[0] - vec.from[0], vec.to[1] - vec.from[1], vec.to[2] - vec.from[2]]}
              origin={vec.from}
              color={chargeValue > 0 ? 'red' : 'blue'}
            />
          ))}
        </Canvas>
      </div>
    </div>
  );
}

export default GaussApplicationVisualizer;