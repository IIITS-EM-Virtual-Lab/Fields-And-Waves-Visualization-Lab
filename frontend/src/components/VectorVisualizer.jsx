import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function VectorArrow({ vector }) {
  const arrowHelper = useMemo(() => {
    const dir = new THREE.Vector3(...vector).normalize();
    const length = new THREE.Vector3(...vector).length();
    const color = new THREE.Color('hotpink');
    return new THREE.ArrowHelper(dir, new THREE.Vector3(0, 0, 0), length, color);
  }, [vector]);

  return <primitive object={arrowHelper} />;
}

export default function VectorVisualizer() {
  const [x, setX] = useState(1);
  const [y, setY] = useState(2);
  const [z, setZ] = useState(1);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <Canvas style={{ height: 500, width: 800 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />
        <primitive object={new THREE.AxesHelper(5)} />
        <VectorArrow vector={[x, y, z]} />
      </Canvas>

      <div className="flex gap-4 text-sm">
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
