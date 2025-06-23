import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Text } from '@react-three/drei';
import { Line } from '@react-three/drei';
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

function AxisTicks({ axis = 'x', length = 5, interval = 1, color = 'gray' }) {
  const ticks = [];
  for (let i = -length; i <= length; i += interval) {
    if (i === 0) continue; // skip origin
    let pos = [0, 0, 0];
    let tickStart = [0, 0, 0];
    let tickEnd = [0, 0, 0];
    if (axis === 'x') {
      pos = [i, 0, 0];
      tickStart = [i, -0.1, 0];
      tickEnd = [i, 0.1, 0];
    } else if (axis === 'y') {
      pos = [0, i, 0];
      tickStart = [-0.1, i, 0];
      tickEnd = [0.1, i, 0];
    } else if (axis === 'z') {
      pos = [0, 0, i];
      tickStart = [0, 0, i - 0.1];
      tickEnd = [0, 0, i + 0.1];
    }
    ticks.push(
      <group key={i}>
        {/* Tick mark */}
        <line>
          <bufferGeometry
            attach="geometry"
            setFromPoints={[
              new THREE.Vector3(...tickStart),
              new THREE.Vector3(...tickEnd),
            ]}
          />
          <lineBasicMaterial attach="material" color={color} />
        </line>
        {/* Label */}
        <Text position={pos} fontSize={0.25} color={color}>
          {i}
        </Text>
      </group>
    );
  }
  return <>{ticks}</>;
}

function VectorProjections({ vector }) {
  const [x, y, z] = vector;
  return (
    <>
      {/* To X axis */}
      <Line
        points={[[x, y, z], [x, 0, 0]]}
        color="red"
        lineWidth={1}
        dashed
        dashSize={0.2}
        gapSize={0.1}
      />
      {/* To Y axis */}
      <Line
        points={[[x, y, z], [0, y, 0]]}
        color="green"
        lineWidth={1}
        dashed
        dashSize={0.2}
        gapSize={0.1}
      />
      {/* To Z axis */}
      <Line
        points={[[x, y, z], [0, 0, z]]}
        color="blue"
        lineWidth={1}
        dashed
        dashSize={0.2}
        gapSize={0.1}
      />
    </>
  );
}
// Axis label component
// function AxisLabel({ position, text, color = 'black' }) {
//   return (
//     <mesh position={position}>
//       <textGeometry args={[text, { size: 0.3, height: 0.05 }]} />
//       <meshBasicMaterial color={color} />
//     </mesh>
//   );
// }

function VectorVisualizer() {
  const [x, setX] = useState(2);
  const [y, setY] = useState(2);
  const [z, setZ] = useState(2);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div style={{ border: '2px solid #2563eb', borderRadius: 8, display: 'inline-block' }}>
        <Canvas style={{ height: 500, width: 800 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls />
          {/* X-axis line */}
          <Line points={[[-20, 0, 0], [20, 0, 0]]} color="red" lineWidth={1} />

          {/* Y-axis line */}
          <Line points={[[0, -20, 0], [0, 20, 0]]} color="green" lineWidth={1} />

          {/* Z-axis line */}
          <Line points={[[0, 0, -20], [0, 0, 20]]} color="blue" lineWidth={1} />

          <AxisTicks axis="x" length={20} interval={1} color="red" />
          <AxisTicks axis="y" length={20} interval={1} color="green" />
          <AxisTicks axis="z" length={20} interval={1} color="blue" />
          {/* Axis Labels */}
          <Text position={[5.5, 0, 0]} color="red" fontSize={0.5}>X</Text>
          <Text position={[-5.5, 0, 0]} color="red" fontSize={0.5}>-X</Text>
          <Text position={[0, 5.5, 0]} color="green" fontSize={0.5}>Y</Text>
          <Text position={[0, -5.5, 0]} color="green" fontSize={0.5}>-Y</Text>
          <Text position={[0, 0, 5.5]} color="blue" fontSize={0.5}>Z</Text>
          <Text position={[0, 0, -5.5]} color="blue" fontSize={0.5}>-Z</Text>
          <VectorArrow vector={[x, y, z]} />
          <VectorProjections vector={[x, y, z]} />
        </Canvas>
      </div>
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

export default VectorVisualizer;