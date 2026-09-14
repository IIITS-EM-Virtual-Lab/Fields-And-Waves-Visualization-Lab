import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Axes from './Axes';
import VectorArrow from './VectorArrow';
import * as THREE from 'three';

function VectorTripleProduct() {
  const [x1, setX1] = useState("3");
  const [y1, setY1] = useState("3");
  const [z1, setZ1] = useState("3");
  const [x2, setX2] = useState("2");
  const [y2, setY2] = useState("2");
  const [z2, setZ2] = useState("2");
  const [x3, setX3] = useState("1");
  const [y3, setY3] = useState("1");
  const [z3, setZ3] = useState("1");

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

  const vectorC: [number, number, number] = [
    Number(x3) || 0,
    Number(y3) || 0,
    Number(z3) || 0,
  ];

  const crossAB: [number, number, number] = new THREE.Vector3(...vectorA)
    .cross(new THREE.Vector3(...vectorB))
    .toArray() as [number, number, number];

  const dotAB =
    vectorA[0] * vectorB[0] + vectorA[1] * vectorB[1] + vectorA[2] * vectorB[2];

  const dotAC =
    vectorA[0] * vectorC[0] + vectorA[1] * vectorC[1] + vectorA[2] * vectorC[2];

  const stp =
    vectorC[0] * crossAB[0] + vectorC[1] * crossAB[1] + vectorC[2] * crossAB[2];

  const vtp: [number, number, number] = new THREE.Vector3(...vectorB)
    .multiplyScalar(dotAC)
    .sub(new THREE.Vector3(...vectorC).multiplyScalar(dotAB))
    .toArray() as [number, number, number];

  const isAOrigin = vectorA.every((value) => value === 0);
  const isBOrigin = vectorB.every((value) => value === 0);
  const isCOrigin = vectorC.every((value) => value === 0);
  const isVtpOrigin = vtp.every((value) => value === 0);

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
          {isAOrigin ? (
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshBasicMaterial color="black" />
            </mesh>
          ) : (
            <VectorArrow vector={vectorA} color="black" label="A" />
          )}

          {isBOrigin ? (
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshBasicMaterial color="black" />
            </mesh>
          ) : (
            <VectorArrow vector={vectorB} color="black" label="B" />
          )}

          {isCOrigin ? (
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshBasicMaterial color="black" />
            </mesh>
          ) : (
            <VectorArrow vector={vectorC} color="black" label="C" />
          )}

          {isVtpOrigin ? (
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshBasicMaterial color="purple" />
            </mesh>
          ) : (
            <VectorArrow vector={vtp} color="purple" label="A × (B × C)" />
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
      <div className="flex gap-4 text-sm mt-4">
        <h1>Input Coordinates for Vector-C:</h1>
        <label>
          X:
          <input type="number" value={x3} onChange={(e) => setX3(e.target.value)} className="border p-1 ml-1 w-20" />
        </label>
        <label>
          Y:
          <input type="number" value={y3} onChange={(e) => setY3(e.target.value)} className="border p-1 ml-1 w-20" />
        </label>
        <label>
          Z:
          <input type="number" value={z3} onChange={(e) => setZ3(e.target.value)} className="border p-1 ml-1 w-20" />
        </label>
      </div>
      <div className="mt-2 text-center text-lg">
        Resultant Vector of Vector Triple Product:{" "}
        <span className="font-bold">
          {vtp[0] >= 0 ? '+' : '-'} {Math.abs(vtp[0]).toFixed(2)} <span className="italic text-black-600">î</span>{" "}
          {vtp[1] >= 0 ? '+' : '-'} {Math.abs(vtp[1]).toFixed(2)} <span className="italic text-black-600">ĵ</span>{" "}
          {vtp[2] >= 0 ? '+' : '-'} {Math.abs(vtp[2]).toFixed(2)} <span className="italic text-black-600">k̂</span>
        </span>
      </div>

      <div className="mt-4 text-center text-lg">
        Value of Scalar Triple Product: <span className="font-bold">{stp.toFixed(2)}</span>
      </div>

    </div>
  );
}

export default VectorTripleProduct;