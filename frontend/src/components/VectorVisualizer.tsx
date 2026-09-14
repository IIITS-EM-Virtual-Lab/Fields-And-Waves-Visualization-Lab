import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Axes from './Axes';
import VectorArrow from './VectorArrow';
import VectorProjections from './VectorProjections';

function VectorVisualizer() {
const [x, setX] = useState("2");
  const [y, setY] = useState("2");
  const [z, setZ] = useState("2");

  const vector = [Number(x) || 0, Number(y) || 0, Number(z) || 0] as [
    number,
    number,
    number,
  ];

  const isOrigin = vector[0] === 0 && vector[1] === 0 && vector[2] === 0;

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div
        className="relative overflow-hidden rounded-lg border-2 border-blue-600" 
        style={{ height: 500, width: 800, zIndex: 0 }}
      >
          <Canvas style={{ height: '100%', width: '100%' }} camera={{ position: [3, 1, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls />
          <Axes length={20} width={3} fontPosition={5.5} interval={1} />
          {isOrigin ? (
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshBasicMaterial color="black" />
            </mesh>
          ) : (
            <VectorArrow vector={vector} color="black" />
          )}
          <VectorProjections
            vector={[Number(x) || 0, Number(y) || 0, Number(z) || 0]}
            xcolor="black"
            ycolor="black"
            zcolor="black"
            dashSize={0.2}
            gapSize={0.1}
          />
        </Canvas>
      </div>
      <div className="flex justify-center items-center gap-8 py-3 bg-gray-50 border-t text-sm font-medium">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span>X-axis</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span>Y-axis</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500"></span>
          <span>Z-axis</span>
        </div>
      </div>
      <div className="flex gap-4 text-sm mt-4">
        <label>
          X:
          <input type="number" value={x} onChange={(e) => setX(e.target.value)} className="border p-1 ml-1 w-20" />
        </label>
        <label>
          Y:
          <input type="number" value={y} onChange={(e) => setY(e.target.value)} className="border p-1 ml-1 w-20" />
        </label>
        <label>
          Z:
          <input type="number" value={z} onChange={(e) => setZ(e.target.value)} className="border p-1 ml-1 w-20" />
        </label>
      </div>
    </div>
  );
}

export default VectorVisualizer;