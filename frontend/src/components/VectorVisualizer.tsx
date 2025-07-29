import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Axes from './Axes';
import VectorArrow from './VectorArrow';
import VectorProjections from './VectorProjections';

function VectorVisualizer() {
  const [x, setX] = useState(2);
  const [y, setY] = useState(2);
  const [z, setZ] = useState(2);

  return (
    <div className="flex flex-col items-center gap-4 p-2 sm:p-4">
      <div
        className="relative overflow-hidden rounded-lg border-2 border-blue-600 w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl aspect-video"
        style={{ zIndex: 0 }}
      >
        <Canvas style={{ height: '100%', width: '100%' }} camera={{ position: [3, 1, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls />
          <Axes length={20} width={3} fontPosition={5.5} interval={1} xcolor="black" ycolor="black" zcolor="black" />
          <VectorArrow vector={[x, y, z]} color='red' />
          <VectorProjections vector={[x, y, z]} xcolor='black' ycolor='black' zcolor='black' dashSize={0.2} gapSize={0.1} />
        </Canvas>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm mt-4 w-full max-w-md">
        <label className="flex-1 flex items-center">
          <span className="mr-1">X:</span>
          <input type="number" value={x} onChange={(e) => setX(Number(e.target.value))} className="border p-1 w-full min-w-0" />
        </label>
        <label className="flex-1 flex items-center">
          <span className="mr-1">Y:</span>
          <input type="number" value={y} onChange={(e) => setY(Number(e.target.value))} className="border p-1 w-full min-w-0" />
        </label>
        <label className="flex-1 flex items-center">
          <span className="mr-1">Z:</span>
          <input type="number" value={z} onChange={(e) => setZ(Number(e.target.value))} className="border p-1 w-full min-w-0" />
        </label>
      </div>
    </div>
  );
}

export default VectorVisualizer;