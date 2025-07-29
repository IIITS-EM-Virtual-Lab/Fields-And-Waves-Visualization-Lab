import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Axes from './Axes';
import VectorArrow from './VectorArrow';
import * as THREE from 'three';
import TrianglePlane from './TrianglePlane';

function VectorMultiplier() {
  const [x1, setX1] = useState(2);
  const [y1, setY1] = useState(2);
  const [z1, setZ1] = useState(2);
  const [x2, setX2] = useState(1);
  const [y2, setY2] = useState(1);
  const [z2, setZ2] = useState(1);

  const cross = new THREE.Vector3(x1, y1, z1).cross(new THREE.Vector3(x2, y2, z2)).toArray();
  const dot = x1 * x2 + y1 * y2 + z1 * z2;



  return (
    <div className="flex flex-col items-center gap-4 p-2 sm:p-4">
      <div
        className="relative overflow-hidden rounded-lg border-2 border-blue-600 w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl aspect-video"
        style={{ zIndex: 0 }}
      >
        <Canvas style={{ height: '100%', width: '100%' }} camera={{position: [0, 3, 4]}}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls />
          <Axes length={20} width={3} fontPosition={5.5} interval={1} xcolor="black" ycolor="black" zcolor="black" />
          <VectorArrow vector={[x1, y1, z1]} color='red' label='A'/>
          <VectorArrow vector={[x2, y2, z2]} color='blue' label='B'/>
          <VectorArrow vector={cross} color="green" label='A x B'/>
          <TrianglePlane a={[x1, y1, z1]} b={[x2, y2, z2]} color='orange'/>
        </Canvas>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm mt-4 w-full max-w-md">
        <h1 className="w-full sm:w-auto font-semibold mb-2 sm:mb-0">Input Coordinates for Vector-A:</h1>
        <label className="flex-1 flex items-center">
          <span className="mr-1">X:</span>
          <input type="number" value={x1} onChange={(e) => setX1(Number(e.target.value))} className="border p-1 w-full min-w-0" />
        </label>
        <label className="flex-1 flex items-center">
          <span className="mr-1">Y:</span>
          <input type="number" value={y1} onChange={(e) => setY1(Number(e.target.value))} className="border p-1 w-full min-w-0" />
        </label>
        <label className="flex-1 flex items-center">
          <span className="mr-1">Z:</span>
          <input type="number" value={z1} onChange={(e) => setZ1(Number(e.target.value))} className="border p-1 w-full min-w-0" />
        </label>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm mt-4 w-full max-w-md">
        <h1 className="w-full sm:w-auto font-semibold mb-2 sm:mb-0">Input Coordinates for Vector-B:</h1>
        <label className="flex-1 flex items-center">
          <span className="mr-1">X:</span>
          <input type="number" value={x2} onChange={(e) => setX2(Number(e.target.value))} className="border p-1 w-full min-w-0" />
        </label>
        <label className="flex-1 flex items-center">
          <span className="mr-1">Y:</span>
          <input type="number" value={y2} onChange={(e) => setY2(Number(e.target.value))} className="border p-1 w-full min-w-0" />
        </label>
        <label className="flex-1 flex items-center">
          <span className="mr-1">Z:</span>
          <input type="number" value={z2} onChange={(e) => setZ2(Number(e.target.value))} className="border p-1 w-full min-w-0" />
        </label>
      </div>
      <div className="mt-2 text-center text-lg">
        Resultant Vector of Cross Product:{" "}
        <span className="font-bold">
          {cross[0] >= 0 ? '+' : '-'} {Math.abs(cross[0]).toFixed(2)} <span className="italic text-black-600">î</span>{" "}
          {cross[1] >= 0 ? '+' : '-'} {Math.abs(cross[1]).toFixed(2)} <span className="italic text-black-600">ĵ</span>{" "}
          {cross[2] >= 0 ? '+' : '-'} {Math.abs(cross[2]).toFixed(2)} <span className="italic text-black-600">k̂</span>
        </span>
      </div>
      <div className="mt-4 text-center text-lg">
        Value of Dot Product: <span className="font-bold">{dot.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default VectorMultiplier;