import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line, Html } from '@react-three/drei';
import Axes from './Axes';
import VectorArrow from './VectorArrow';

function SphericalVisualizer() {
  const [x, setX] = useState(2);
  const [y, setY] = useState(2);
  const [z, setZ] = useState(2);
  const [r, setR] = useState(0);
  const [theta, setTheta] = useState(0); // inclination
  const [phi, setPhi] = useState(0);    // azimuth
  const [lastChanged, setLastChanged] = useState<'cartesian' | 'spherical'>('cartesian');

  useEffect(() => {
    if (lastChanged === 'cartesian') {
      const radius = Math.sqrt(x * x + y * y + z * z);
      const inclination = radius !== 0 ? Math.acos(z / radius) : 0;
      const azimuth = Math.atan2(y, x);
      setR(radius);
      setTheta(inclination);
      setPhi(azimuth);
    }
  }, [x, y, z]);

  useEffect(() => {
    if (lastChanged === 'spherical') {
      const newX = r * Math.sin(theta) * Math.cos(phi);
      const newY = r * Math.sin(theta) * Math.sin(phi);
      const newZ = r * Math.cos(theta);
      setX(newX);
      setY(newY);
      setZ(newZ);
    }
  }, [r, theta, phi]);

  const segments = 32;

  const thetaArcPoints: [number, number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * theta;
    const rProj = 0.5;
    const xPos = rProj * Math.sin(angle) * Math.cos(phi);
    const yPos = rProj * Math.sin(angle) * Math.sin(phi);
    const zPos = rProj * Math.cos(angle);
    thetaArcPoints.push([xPos, yPos, zPos]);
  }

  const phiArcPoints: [number, number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * phi;
    const xPos = 0.5 * Math.cos(angle);
    const yPos = 0.5 * Math.sin(angle);
    phiArcPoints.push([xPos, yPos, 0]);
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="relative overflow-hidden rounded-lg border-2 border-blue-600" style={{ height: 500, width: 800, zIndex: 0 }}>
        <Canvas style={{ height: '100%', width: '100%' }} camera={{position: [5, 2, 5]}}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls />
          <Axes length={20} width={3} fontPosition={5.5} interval={1} xcolor="black" ycolor="black" zcolor="black" />

          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[r, 64, 64]} />
            <meshStandardMaterial color="#60a5fa" transparent opacity={0.6} />
          </mesh>

          <VectorArrow vector={[x, y, z]} color='red' label='P' />
          <Line points={[[0, 0, 0], [x, y, 0]]} color="blue" dashed dashSize={0.2} gapSize={0.1} />
          <Line points={[[x, y, 0], [x, y, z]]} color="blue" dashed dashSize={0.2} gapSize={0.1} />
          <Line points={thetaArcPoints} color="red" />
          <Line points={phiArcPoints} color="blue" />

          <Html position={[x / 2, y / 2, z / 2]} center distanceFactor={8}>
            <div style={{ color: 'red', whiteSpace: 'nowrap', userSelect: 'none', fontSize: '20px' }}>r = {r.toFixed(2)}</div>
          </Html>
          <Html position={[0.7 * Math.sin(theta / 2), 0, 0.7 * Math.cos(theta / 2)]} center distanceFactor={8}>
            <div style={{ color: 'red', whiteSpace: 'nowrap', userSelect: 'none', fontSize: '20px' }}>&theta; = {(theta * 180 / Math.PI).toFixed(1)}&deg;</div>
          </Html>
          <Html position={[0.7 * Math.cos(phi / 2), 0.7 * Math.sin(phi / 2), 0]} center distanceFactor={8}>
            <div style={{ color: 'blue', whiteSpace: 'nowrap', userSelect: 'none', fontSize: '20px' }}>&phi; = {(phi * 180 / Math.PI).toFixed(1)}&deg;</div>
          </Html>
        </Canvas>
      </div>

      <div className="flex gap-8 text-sm mt-4">
        <div>
          <h2 className="font-bold mb-2">Cartesian Coordinates:</h2>
          <div className="flex gap-4">
            <label>X: <input type="number" value={x.toFixed(2)} onChange={(e) => { setX(Number(e.target.value)); setLastChanged('cartesian'); }} className="border p-1 ml-1 w-20" /></label>
            <label>Y: <input type="number" value={y.toFixed(2)} onChange={(e) => { setY(Number(e.target.value)); setLastChanged('cartesian'); }} className="border p-1 ml-1 w-20" /></label>
            <label>Z: <input type="number" value={z.toFixed(2)} onChange={(e) => { setZ(Number(e.target.value)); setLastChanged('cartesian'); }} className="border p-1 ml-1 w-20" /></label>
          </div>
        </div>

        <div>
          <h2 className="font-bold mb-2">Spherical Coordinates:</h2>
          <div className="flex gap-4">
            <label>r: <input type="number" value={r.toFixed(2)} onChange={(e) => { setR(Number(e.target.value)); setLastChanged('spherical'); }} className="border p-1 ml-1 w-20" /></label>
            <label>&theta;&deg;: <input type="number" value={(theta * 180 / Math.PI).toFixed(2)} onChange={(e) => { setTheta(Number(e.target.value) * Math.PI / 180); setLastChanged('spherical'); }} className="border p-1 ml-1 w-20" /></label>
            <label>&phi;&deg;: <input type="number" value={(phi * 180 / Math.PI).toFixed(2)} onChange={(e) => { setPhi(Number(e.target.value) * Math.PI / 180); setLastChanged('spherical'); }} className="border p-1 ml-1 w-20" /></label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SphericalVisualizer;