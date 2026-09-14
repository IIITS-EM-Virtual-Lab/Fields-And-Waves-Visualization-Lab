import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import Axes from './Axes';
import VectorArrow from './VectorArrow';
import * as THREE from 'three';

function VectorSubtraction() {
  const [x1, setX1] = useState("2");
  const [y1, setY1] = useState("0");
  const [z1, setZ1] = useState("0");
  const [x2, setX2] = useState("0");
  const [y2, setY2] = useState("2");
  const [z2, setZ2] = useState("0");

  const vectorA: [number, number, number] = [
    Number(x1) || 0,
    Number(y1) || 0,
    Number(z1) || 0,
  ];

  const vectorB: [number, number, number] = [
    Number(x2) || 0,
    Number(y2) || 0,
    Number(z2) || 0,
  ];

  const sub: [number, number, number] = new THREE.Vector3(...vectorA)
    .sub(new THREE.Vector3(...vectorB))
    .toArray() as [number, number, number];

  const isAOrigin = vectorA.every((value) => value === 0);
  const isBOrigin = vectorB.every((value) => value === 0);
  const isSumOrigin = sub.every((value) => value === 0);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div
        className="relative overflow-hidden rounded-lg border-2 border-blue-600" 
        style={{ height: 500, width: 800, zIndex: 0 }}
      >
        <Canvas
          style={{ height: "100%", width: "100%" }}
          camera={{ position: [3, 1, 5] }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls />
          <Axes length={20} width={3} fontPosition={5.5} interval={1} />
          {isAOrigin ? (
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshBasicMaterial color="red" />
            </mesh>
          ) : (
            <VectorArrow vector={vectorA} color="black" label="A" />
          )}
          {isBOrigin ? (
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshBasicMaterial color="blue" />
            </mesh>
          ) : (
            <VectorArrow vector={vectorB} color="black" label="B" />
          )}
          {isSumOrigin ? (
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshBasicMaterial color="green" />
            </mesh>
          ) : (
            <VectorArrow vector={sub} color="purple" label="A - B" />
          )}

          {!isAOrigin && !isSumOrigin && (
            <Line
              points={[vectorA, sub]}
              color="black"
              lineWidth={1}
              dashed
              dashSize={0.15}
              gapSize={0.1}
            />
          )}

          {!isBOrigin && !isSumOrigin && (
            <Line
              points={[vectorB, sub]}
              color="black"
              lineWidth={1}
              dashed
              dashSize={0.15}
              gapSize={0.1}
            />
          )}
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
        <h1>Input Coordinates for Vector-A:</h1>
        <label>
          X:
          <input type="number" value={x1} onChange={(e) => setX1(e.target.value)} className="border p-1 ml-1 w-20" />
        </label>
        <label>
          Y:
          <input type="number" value={y1} onChange={(e) => setY1(e.target.value)} className="border p-1 ml-1 w-20" />
        </label>
        <label>
          Z:
          <input type="number" value={z1} onChange={(e) => setZ1(e.target.value)} className="border p-1 ml-1 w-20" />
        </label>
      </div>
      <div className="flex gap-4 text-sm mt-4">
        <h1>Input Coordinates for Vector-B:</h1>
        <label>
          X:
          <input type="number" value={x2} onChange={(e) => setX2(e.target.value)} className="border p-1 ml-1 w-20" />
        </label>
        <label>
          Y:
          <input type="number" value={y2} onChange={(e) => setY2(e.target.value)} className="border p-1 ml-1 w-20" />
        </label>
        <label>
          Z:
          <input type="number" value={z2} onChange={(e) => setZ2(e.target.value)} className="border p-1 ml-1 w-20" />
        </label>
      </div>
      <div className="mt-2 text-center text-lg">
        Resultant Vector:{" "}
        <span className="font-bold">
          {sub[0] >= 0 ? '+' : '-'} {Math.abs(sub[0]).toFixed(2)} <span className="italic text-black-600">î</span>{" "}
          {sub[1] >= 0 ? '+' : '-'} {Math.abs(sub[1]).toFixed(2)} <span className="italic text-black-600">ĵ</span>{" "}
          {sub[2] >= 0 ? '+' : '-'} {Math.abs(sub[2]).toFixed(2)} <span className="italic text-black-600">k̂</span>
        </span>
      </div>

    </div>
  );
}

export default VectorSubtraction;