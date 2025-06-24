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
    <div className="flex flex-col items-center gap-4 p-4">
      <div style={{ border: '2px solid #2563eb', borderRadius: 8 }}>
        <Canvas style={{ height: 500, width: 800 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls />
          <Axes length={20} width={3} fontPosition={5.5} fontSize={0.5} interval={1} xcolor="black" ycolor="black" zcolor="black" />
          <VectorArrow vector={[x, y, z]} color='red' />
          <VectorProjections vector={[x, y, z]} xcolor='black' ycolor='black' zcolor='black' dashSize={0.2} gapSize={0.1} />
        </Canvas>
      </div>
      <div className="flex gap-4 text-sm mt-4">
        <label>
          X:
          <input type="number" value={x} onChange={(e) => setX(Number(e.target.value))} className="border p-1 ml-1 w-20" />
        </label>
        <label>
          Y:
          <input type="number" value={y} onChange={(e) => setY(Number(e.target.value))} className="border p-1 ml-1 w-20" />
        </label>
        <label>
          Z:
          <input type="number" value={z} onChange={(e) => setZ(Number(e.target.value))} className="border p-1 ml-1 w-20" />
        </label>
      </div>
    </div>
  );
}

export default VectorVisualizer;