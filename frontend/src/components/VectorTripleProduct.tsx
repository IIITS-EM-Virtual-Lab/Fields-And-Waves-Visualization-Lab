import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Axes from './Axes';
import VectorArrow from './VectorArrow';
import * as THREE from 'three';

function VectorTripleProduct() {
  const [x1, setX1] = useState(3);
  const [y1, setY1] = useState(3);
  const [z1, setZ1] = useState(3);
  const [x2, setX2] = useState(2);
  const [y2, setY2] = useState(2);
  const [z2, setZ2] = useState(2);
  const [x3, setX3] = useState(1);
  const [y3, setY3] = useState(1);
  const [z3, setZ3] = useState(1);

  const crossAB = new THREE.Vector3(x1, y1, z1).cross(new THREE.Vector3(x2, y2, z2)).toArray();
  const dotAB = x1 * x2 + y1 * y2 + z1 * z2;
  const dotAC = x1 * x3 + y1 * y3 + z1 * z3;

  const stp = x3 * crossAB[0] + y3 * crossAB[1] + z3 * crossAB[2];
  const vtp = new THREE.Vector3(x2, y2, z2).multiplyScalar(dotAC).sub(new THREE.Vector3(x3, y3, z3).multiplyScalar(dotAB)).toArray();



  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div style={{ border: '2px solid #2563eb', borderRadius: 8 }}>
        <Canvas style={{ height: 500, width: 800 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls />
          <Axes length={20} width={3} fontPosition={5.5} fontSize={0.5} interval={1} xcolor="black" ycolor="black" zcolor="black" />
          <VectorArrow vector={[x1, y1, z1]} color='red' label='A'/>
          <VectorArrow vector={[x2, y2, z2]} color='blue' label='B'/>
          <VectorArrow vector={[x3, y3, z3]} color='purple' label='C'/>
          <VectorArrow vector={vtp} color="green" label='A x (B x C)'/>
        </Canvas>
      </div>
      <div className="flex gap-4 text-sm mt-4">
        <h1>Input Coordinates for Vector-A:</h1>
        <label>
          X:
          <input type="number" value={x1} onChange={(e) => setX1(Number(e.target.value))} className="border p-1 ml-1 w-20" />
        </label>
        <label>
          Y:
          <input type="number" value={y1} onChange={(e) => setY1(Number(e.target.value))} className="border p-1 ml-1 w-20" />
        </label>
        <label>
          Z:
          <input type="number" value={z1} onChange={(e) => setZ1(Number(e.target.value))} className="border p-1 ml-1 w-20" />
        </label>
      </div>
      <div className="flex gap-4 text-sm mt-4">
        <h1>Input Coordinates for Vector-B:</h1>
        <label>
          X:
          <input type="number" value={x2} onChange={(e) => setX2(Number(e.target.value))} className="border p-1 ml-1 w-20" />
        </label>
        <label>
          Y:
          <input type="number" value={y2} onChange={(e) => setY2(Number(e.target.value))} className="border p-1 ml-1 w-20" />
        </label>
        <label>
          Z:
          <input type="number" value={z2} onChange={(e) => setZ2(Number(e.target.value))} className="border p-1 ml-1 w-20" />
        </label>
      </div>
      <div className="flex gap-4 text-sm mt-4">
        <h1>Input Coordinates for Vector-C:</h1>
        <label>
          X:
          <input type="number" value={x3} onChange={(e) => setX3(Number(e.target.value))} className="border p-1 ml-1 w-20" />
        </label>
        <label>
          Y:
          <input type="number" value={y3} onChange={(e) => setY3(Number(e.target.value))} className="border p-1 ml-1 w-20" />
        </label>
        <label>
          Z:
          <input type="number" value={z3} onChange={(e) => setZ3(Number(e.target.value))} className="border p-1 ml-1 w-20" />
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