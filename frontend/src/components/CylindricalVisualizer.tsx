import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line, Html } from '@react-three/drei';
import Axes from './Axes';
import VectorArrow from './VectorArrow';

function CylindricalVisualizer() {
  const [x, setX] = useState(2);
  const [y, setY] = useState(2);
  const [z, setZ] = useState(2);
  const [rho, setRho] = useState(0);
  const [phi, setPhi] = useState(0);
  const [lastChanged, setLastChanged] = useState<'cartesian' | 'cylindrical'>('cartesian');

  useEffect(() => {
    if (lastChanged === 'cartesian') {
      const newRho = Math.sqrt(x * x + y * y);
      const newPhi = Math.atan2(y, x);
      setRho(newRho);
      setPhi(newPhi);
    }
  }, [x, y]);

  useEffect(() => {
    if (lastChanged === 'cylindrical') {
      const newX = rho * Math.cos(phi);
      const newY = rho * Math.sin(phi);
      setX(newX);
      setY(newY);
    }
  }, [rho, phi]);

  const phiArcPoints: [number, number, number][] = [];
  const segments = 32;
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.min(Math.abs(phi), Math.PI * 2);
    const xPos = 0.5 * Math.cos(angle);
    const yPos = 0.5 * Math.sin(angle);
    phiArcPoints.push([xPos, yPos, 0]);
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="relative overflow-hidden rounded-lg border-2 border-blue-600" style={{ height: 500, width: 800, zIndex: 0 }}>
        <Canvas style={{ height: '100%', width: '100%' }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls />
          <Axes length={20} width={3} fontPosition={5.5} interval={1} xcolor="black" ycolor="black" zcolor="black" />

          <mesh position={[0, 0, z / 2]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[rho, rho, z, 64]} />
            <meshStandardMaterial color="#60a5fa" transparent opacity={0.6} />
          </mesh>

          <VectorArrow vector={[x, y, z]} color='red' label='P' />
          <Line points={[[0, 0, 0], [x, y, 0]]} color="blue" dashed dashSize={0.2} gapSize={0.1} />
          <Line points={[[x, y, 0], [x, y, z]]} color="green" dashed dashSize={0.2} gapSize={0.1} />
          <Line points={[[0, 0, 0], [x, y, 0]]} color="purple" />
          <Line points={phiArcPoints} color="blue" />

          <Html position={[x / 2, y / 2, 0]} center distanceFactor={8}>
            <div style={{ color: 'purple', whiteSpace: 'nowrap', userSelect: 'none', fontSize: '20px' }}>&rho; = {rho.toFixed(2)}</div>
          </Html>
          <Html position={[0.7 * Math.cos(phi / 2), 0.7 * Math.sin(phi / 2), 0]} center distanceFactor={8}>
            <div style={{ color: 'blue', whiteSpace: 'nowrap', userSelect: 'none', fontSize: '20px' }}>&phi; = {(phi * 180 / Math.PI).toFixed(1)}°</div>
          </Html>
          <Html position={[x, y, z / 2]} center distanceFactor={8}>
            <div style={{ color: 'green', whiteSpace: 'nowrap', userSelect: 'none', fontSize: '20px' }}>z = {z.toFixed(2)}</div>
          </Html>
        </Canvas>
      </div>

      <div className="flex gap-8 text-sm mt-4">
        <div>
          <h2 className="font-bold mb-2">Cartesian Coordinates:</h2>
          <div className="flex gap-4">
            <label>X: <input type="number" value={x} onChange={(e) => { setX(Number(e.target.value)); setLastChanged('cartesian'); }} className="border p-1 ml-1 w-20" /></label>
            <label>Y: <input type="number" value={y} onChange={(e) => { setY(Number(e.target.value)); setLastChanged('cartesian'); }} className="border p-1 ml-1 w-20" /></label>
            <label>Z: <input type="number" value={z} onChange={(e) => { setZ(Number(e.target.value)); setLastChanged('cartesian'); }} className="border p-1 ml-1 w-20" /></label>
          </div>
        </div>

        <div>
          <h2 className="font-bold mb-2">Cylindrical Coordinates:</h2>
          <div className="flex gap-4">
            <label>&rho;: <input type="number" value={rho.toFixed(2)} onChange={(e) => { setRho(Number(e.target.value)); setLastChanged('cylindrical'); }} className="border p-1 ml-1 w-20" /></label>
            <label>&phi;&deg;: <input type="number" value={(phi * 180 / Math.PI).toFixed(2)} onChange={(e) => { setPhi(Number(e.target.value) * Math.PI / 180); setLastChanged('cylindrical'); }} className="border p-1 ml-1 w-20" /></label>
            <label>Z: <input type="number" value={z} onChange={(e) => { setZ(Number(e.target.value)); setLastChanged('cylindrical'); }} className="border p-1 ml-1 w-20" /></label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CylindricalVisualizer;