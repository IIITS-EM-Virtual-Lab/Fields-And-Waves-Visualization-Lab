import { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Axes from './Axes';
import VectorArrow from './VectorArrow';
import * as THREE from 'three';
import TrianglePlane from './TrianglePlane';
import CanvasControlsToolbar from './CanvasControlsToolbar';

const getInterval = (maxVal: number) => {
  if (maxVal > 90) return 30;
  if (maxVal > 60) return 20;
  if (maxVal > 30) return 10;
  if (maxVal > 20) return 5;
  if (maxVal > 14) return 3;
  if (maxVal > 5) return 2;
  return 1;
};

const getScaleFactor = (maxVal: number) => {
  if (maxVal > 90) return 30;
  if (maxVal > 60) return 20;
  if (maxVal > 30) return 10;
  if (maxVal > 20) return 5;
  if (maxVal > 14) return 3;
  if (maxVal > 5) return 2;
  return 2; 
};

function VectorMultiplier() {
  const [x1, setX1] = useState("2");
  const [y1, setY1] = useState("2");
  const [z1, setZ1] = useState("2");
  const [x2, setX2] = useState("1");
  const [y2, setY2] = useState("1");
  const [z2, setZ2] = useState("1");

  const [vectorA, setVectorA] = useState<[number, number, number]>([2, 2, 2]);
  const [vectorB, setVectorB] = useState<[number, number, number]>([1, 1, 1]);

  const [interactionMode, setInteractionMode] = useState<'rotate' | 'pan'>('rotate');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);

  const isOutOfBounds = (val: string) => {
    if (val === "" || val === "-") return false; 
    const num = Number(val);
    return isNaN(num) || num < -100 || num > 100;
  };

  const hasError = [x1, y1, z1, x2, y2, z2].some(isOutOfBounds);

  useEffect(() => {
    if (!hasError) {
      setVectorA([Number(x1) || 0, Number(y1) || 0, Number(z1) || 0]);
      setVectorB([Number(x2) || 0, Number(y2) || 0, Number(z2) || 0]);
    }
  }, [x1, y1, z1, x2, y2, z2, hasError]);

  const cross: [number, number, number] = new THREE.Vector3(...vectorA)
    .cross(new THREE.Vector3(...vectorB))
    .toArray() as [number, number, number];

  const dot =
    vectorA[0] * vectorB[0] + vectorA[1] * vectorB[1] + vectorA[2] * vectorB[2];

  const maxX = Math.max(5, Math.abs(vectorA[0]), Math.abs(vectorB[0]), Math.abs(cross[0]));
  const maxY = Math.max(5, Math.abs(vectorA[1]), Math.abs(vectorB[1]), Math.abs(cross[1]));
  const maxZ = Math.max(5, Math.abs(vectorA[2]), Math.abs(vectorB[2]), Math.abs(cross[2]));

  const intX = getInterval(maxX);
  const intY = getInterval(maxY);
  const intZ = getInterval(maxZ);

  const lenX = Math.ceil(maxX / intX) * intX + intX;
  const lenY = Math.ceil(maxY / intY) * intY + intY;
  const lenZ = Math.ceil(maxZ / intZ) * intZ + intZ;

  const maxGlobal = Math.max(maxX, maxY, maxZ);
  const scaleFactor = getScaleFactor(maxGlobal);

  const visualA: [number, number, number] = [
    vectorA[0] / scaleFactor,
    vectorA[1] / scaleFactor,
    vectorA[2] / scaleFactor,
  ];

  const visualB: [number, number, number] = [
    vectorB[0] / scaleFactor,
    vectorB[1] / scaleFactor,
    vectorB[2] / scaleFactor,
  ];

  const visualCross: [number, number, number] = [
    cross[0] / scaleFactor,
    cross[1] / scaleFactor,
    cross[2] / scaleFactor,
  ];

  const isAOrigin = vectorA.every((value) => value === 0);
  const isBOrigin = vectorB.every((value) => value === 0);
  const isCrossOrigin = cross.every((value) => value === 0);

  // --- NEW: Zoom and Reset Handlers ---
  const handleZoomIn = () => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      camera.zoom *= 1.2;
      camera.updateProjectionMatrix();
    }
  };

  const handleZoomOut = () => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      camera.zoom /= 1.2;
      camera.updateProjectionMatrix();
    }
  };

  const resetCamera = () => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      camera.zoom = 1; // Reset any programmatic zoom applied
      camera.updateProjectionMatrix();
      controlsRef.current.reset(); // Snap back to initial position and angle
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div
        className="relative overflow-hidden rounded-lg border-2 border-blue-600 bg-gray-50" 
        style={{ height: 500, width: 800, zIndex: 0 }}
      >
        <CanvasControlsToolbar
          interactionMode={interactionMode}
          setInteractionMode={setInteractionMode}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={resetCamera}
        />

        <Canvas style={{ height: '100%', width: '100%' }} camera={{ position: [1.5, 0.5, 3] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          
          <OrbitControls 
            ref={controlsRef}
            makeDefault
            mouseButtons={{
              LEFT: interactionMode === 'rotate' ? THREE.MOUSE.ROTATE : THREE.MOUSE.PAN,
              MIDDLE: THREE.MOUSE.DOLLY,
              RIGHT: interactionMode === 'rotate' ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE,
            }}
          />
          
          <Axes 
            xLength={lenX} yLength={lenY} zLength={lenZ}
            xInterval={intX} yInterval={intY} zInterval={intZ}
            width={3} 
            scaleFactor={scaleFactor} 
          />
          
          {isAOrigin ? (
             <mesh position={[0, 0, 0]}><sphereGeometry args={[0.12, 16, 16]} /><meshBasicMaterial color="#a855f7" transparent opacity={0.25} side={THREE.DoubleSide} /></mesh>
          ) : (
            <VectorArrow vector={visualA} color="black" label="A" />
          )}

          {isBOrigin ? (
            <mesh position={[0, 0, 0]}><sphereGeometry args={[0.12, 16, 16]} /><meshBasicMaterial color="#a855f7" transparent opacity={0.25} side={THREE.DoubleSide} /></mesh>
          ) : (
            <VectorArrow vector={visualB} color="black" label="B" />
          )}

          {isCrossOrigin ? (
            <mesh position={[0, 0, 0]}><sphereGeometry args={[0.15, 16, 16]} /><meshBasicMaterial color="#a855f7" transparent opacity={0.25} side={THREE.DoubleSide} /></mesh>
          ) : (
            <VectorArrow vector={visualCross} color="purple" label="A × B" />
          )}
          <TrianglePlane a={visualA} b={visualB} color="#a855f7" />
        </Canvas>
      </div>

      <div className="flex justify-center items-center gap-8 py-3 bg-gray-50 border-t text-sm font-medium w-full max-w-[800px]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span><span>X-axis</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500"></span><span>Y-axis</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500"></span><span>Z-axis</span>
        </div>
      </div>

      <div className="flex gap-4 text-sm mt-4">
        <h1>Input Coordinates for Vector-A:</h1>
        <label>X: <input type="number" value={x1} onChange={(e) => setX1(e.target.value)} className="border p-1 ml-1 w-20" /></label>
        <label>Y: <input type="number" value={y1} onChange={(e) => setY1(e.target.value)} className="border p-1 ml-1 w-20" /></label>
        <label>Z: <input type="number" value={z1} onChange={(e) => setZ1(e.target.value)} className="border p-1 ml-1 w-20" /></label>
      </div>
      
      <div className="flex gap-4 text-sm mt-2">
        <h1>Input Coordinates for Vector-B:</h1>
        <label>X: <input type="number" value={x2} onChange={(e) => setX2(e.target.value)} className="border p-1 ml-1 w-20" /></label>
        <label>Y: <input type="number" value={y2} onChange={(e) => setY2(e.target.value)} className="border p-1 ml-1 w-20" /></label>
        <label>Z: <input type="number" value={z2} onChange={(e) => setZ2(e.target.value)} className="border p-1 ml-1 w-20" /></label>
      </div>

      {hasError && (
        <div className="text-red-500 font-medium text-sm mt-2">
          Warning: Coordinate values must be between -100 and 100.
        </div>
      )}

      <div className="mt-2 text-center text-lg">
        Resultant Vector of Cross Product:{" "}
        <span className="font-bold">
          {cross[0] >= 0 ? '+' : '-'} {Math.abs(cross[0]).toFixed(2)} <span className="italic text-black-600">î</span>{" "}
          {cross[1] >= 0 ? '+' : '-'} {Math.abs(cross[1]).toFixed(2)} <span className="italic text-black-600">ĵ</span>{" "}
          {cross[2] >= 0 ? '+' : '-'} {Math.abs(cross[2]).toFixed(2)} <span className="italic text-black-600">k̂</span>
        </span>
      </div>

      <div className="mt-2 text-center text-lg">
        Value of Dot Product: <span className="font-bold">{dot.toFixed(2)}</span>
      </div>

    </div>
  );
}

export default VectorMultiplier;