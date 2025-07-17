import { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import Axes from './Axes';
import VectorArrow from './VectorArrow';

const k = 9e9; // Coulomb constant

function ElectricPotentialVisualizer() {
  const [q, setQ] = useState(1e-9); // in Coulombs
  const [qx, setQx] = useState(0);
  const [qy, setQy] = useState(0);
  const [qz, setQz] = useState(0);

  const [px, setPx] = useState(2);
  const [py, setPy] = useState(2);
  const [pz, setPz] = useState(0);

  const chargePosition = useMemo(() => new THREE.Vector3(qx, qy, qz), [qx, qy, qz]);
  const pointPosition = useMemo(() => new THREE.Vector3(px, py, pz), [px, py, pz]);

  const displacement = useMemo(() => pointPosition.clone().sub(chargePosition), [pointPosition, chargePosition]);
  const distance = useMemo(() => displacement.length(), [displacement]);

  const potential = useMemo(() => {
    if (distance === 0) return Infinity;
    return (k * q) / distance;
  }, [q, distance]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="grid grid-cols-1 gap-4 w-full max-w-4xl">
        <div>
          <h2 className="font-bold mb-1">Point Charge:</h2>
          <label>q (C): <input type="number" value={q} step={1e-9} onChange={(e) => setQ(Number(e.target.value))} className="border px-2 py-1 w-32" /></label>
          <label className="ml-2">X: <input type="number" value={qx} onChange={(e) => setQx(Number(e.target.value))} className="border px-2 py-1 w-20" /></label>
          <label className="ml-2">Y: <input type="number" value={qy} onChange={(e) => setQy(Number(e.target.value))} className="border px-2 py-1 w-20" /></label>
          <label className="ml-2">Z: <input type="number" value={qz} onChange={(e) => setQz(Number(e.target.value))} className="border px-2 py-1 w-20" /></label>
        </div>

        <div>
          <h2 className="font-bold mb-1">Test Particle Position(P):</h2>
          <label>X: <input type="number" value={px} onChange={(e) => setPx(Number(e.target.value))} className="border px-2 py-1 w-20" /></label>
          <label className="ml-2">Y: <input type="number" value={py} onChange={(e) => setPy(Number(e.target.value))} className="border px-2 py-1 w-20" /></label>
          <label className="ml-2">Z: <input type="number" value={pz} onChange={(e) => setPz(Number(e.target.value))} className="border px-2 py-1 w-20" /></label>
        </div>

        <div className="mt-2 text-lg bg-white border p-2 rounded shadow">
          Electric Potential V = {potential === Infinity ? '∞' : potential.toExponential(3)} V
        </div>
      </div>

      <div className="relative overflow-hidden rounded-lg border-2 border-blue-600 mt-6" style={{ height: 500, width: 800, zIndex: 0 }}>
        <Canvas style={{ height: '100%', width: '100%' }} camera={{position: [2, 4, 5]}}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls />
          <Axes length={20} width={3} fontPosition={4.5} interval={1} xcolor="black" ycolor="black" zcolor="black" />

          {/* Point charge */}
          <mesh position={chargePosition}>
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshStandardMaterial color={q > 0 ? 'red' : 'blue'} />
          </mesh>
          <Html position={[chargePosition.x+0.1, chargePosition.y+0.3, chargePosition.z+0.1]} center distanceFactor={8}>
            <div style={{ color: q > 0 ? 'red' : 'blue', fontSize: '20px', userSelect: 'none', whiteSpace: 'nowrap' }}>
              Charge
            </div>
          </Html>

          <mesh position={chargePosition}>
            <sphereGeometry args={[1, 64, 64]} />
            <meshStandardMaterial color={q > 0 ? 'red' : 'blue'} transparent opacity={0.5} depthWrite={false} />
          </mesh>


          <VectorArrow 
            vector={pointPosition.clone().sub(chargePosition).toArray()} 
            origin={chargePosition.toArray()} 
            color={q > 0 ? 'red' : 'blue'} 
            label={`V = ${potential === Infinity ? '∞' : potential.toExponential(3)}V`}
            />

          {/* Test particle */}
          <mesh position={pointPosition}>
            <sphereGeometry args={[0.1, 32, 32]} />
            <meshStandardMaterial color='gold' />
          </mesh>
          <Html position={[pointPosition.x+0.1, pointPosition.y-0.2, pointPosition.z+0.1]} center distanceFactor={8}>
            <div style={{ color: 'gold', fontSize: '20px', userSelect: 'none', whiteSpace: 'nowrap' }}>
              P
            </div>
          </Html>
        </Canvas>
      </div>
    </div>
  );
}

export default ElectricPotentialVisualizer;