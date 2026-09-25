import React, { useState, useMemo, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import Axes from './Axes';
import VectorArrow from './VectorArrow';
import CanvasControlsToolbar from './CanvasControlsToolbar';
import * as THREE from 'three';

const k = 9e9; // Coulomb constant

function ElectricPotentialVisualizer() {
  const [interactionMode, setInteractionMode] = useState<'rotate' | 'pan'>('rotate');
  const controlsRef = useRef<any>(null);

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
      camera.zoom = 1;
      camera.updateProjectionMatrix();
      controlsRef.current.reset();
    }
  };

  // Keep state as strings to allow typing "-" 
  const [q, setQ] = useState('1e-9'); // in Coulombs
  const [qx, setQx] = useState('0');
  const [qy, setQy] = useState('0');
  const [qz, setQz] = useState('0');

  const [px, setPx] = useState('2');
  const [py, setPy] = useState('2');
  const [pz, setPz] = useState('0');

  // Safely parse input strings to numbers. If it's NaN (like just "-"), fallback to 0.
  const numericQ = parseFloat(q) || 0;

  const chargePosition = useMemo(() => new THREE.Vector3(
    parseFloat(qx) || 0, 
    parseFloat(qy) || 0, 
    parseFloat(qz) || 0
  ), [qx, qy, qz]);
  
  const pointPosition = useMemo(() => new THREE.Vector3(
    parseFloat(px) || 0, 
    parseFloat(py) || 0, 
    parseFloat(pz) || 0
  ), [px, py, pz]);

  const displacement = useMemo(() => pointPosition.clone().sub(chargePosition), [pointPosition, chargePosition]);
  const distance = useMemo(() => displacement.length(), [displacement]);

  const potential = useMemo(() => {
    if (distance === 0) return Infinity;
    return (k * numericQ) / distance;
  }, [numericQ, distance]);

  return (
    <div className="flex flex-col items-center gap-4 p-4 min-h-screen bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">Electric Potential Visualizer</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          {/* Charge Input Section */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
            <h2 className="font-bold text-gray-700 border-b pb-2">Source Charge (Q)</h2>
            <div className="flex items-center">
              <label className="text-sm font-medium w-24">Charge (C):</label>
              <input 
                type="text" 
                value={q} 
                onChange={(e) => setQ(e.target.value)} 
                className="border-2 border-gray-300 rounded px-3 py-1.5 w-full focus:border-purple-500 focus:outline-none" 
                placeholder="1e-9"
              />
            </div>
            
            <div className="flex items-center gap-2">
               <span className="text-sm font-medium text-gray-600">Position:</span>
               <div className="flex gap-2">
                 <label className="flex items-center"><span className="font-bold mr-1 text-xs">X</span> 
                   <input type="text" value={qx} onChange={(e) => setQx(e.target.value)} className="border border-gray-300 rounded px-2 py-1 w-16 text-center focus:border-purple-500 focus:outline-none" />
                 </label>
                 <label className="flex items-center"><span className="font-bold mr-1 text-xs">Y</span> 
                   <input type="text" value={qy} onChange={(e) => setQy(e.target.value)} className="border border-gray-300 rounded px-2 py-1 w-16 text-center focus:border-purple-500 focus:outline-none" />
                 </label>
                 <label className="flex items-center"><span className="font-bold mr-1 text-xs">Z</span> 
                   <input type="text" value={qz} onChange={(e) => setQz(e.target.value)} className="border border-gray-300 rounded px-2 py-1 w-16 text-center focus:border-purple-500 focus:outline-none" />
                 </label>
               </div>
            </div>
          </div>

          <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
            <h2 className="font-bold text-gray-700 border-b pb-2">Test Point (P)</h2>
            
            <div className="flex items-center gap-2 mt-4">
               <span className="text-sm font-medium text-gray-600">Position:</span>
               <div className="flex gap-2">
                 <label className="flex items-center"><span className="text-red-500 font-bold mr-1 text-xs">X</span> 
                   <input type="text" value={px} onChange={(e) => setPx(e.target.value)} className="border border-gray-300 rounded px-2 py-1 w-16 text-center focus:border-yellow-500 focus:outline-none" />
                 </label>
                 <label className="flex items-center"><span className="text-green-600 font-bold mr-1 text-xs">Y</span> 
                   <input type="text" value={py} onChange={(e) => setPy(e.target.value)} className="border border-gray-300 rounded px-2 py-1 w-16 text-center focus:border-yellow-500 focus:outline-none" />
                 </label>
                 <label className="flex items-center"><span className="text-blue-500 font-bold mr-1 text-xs">Z</span> 
                   <input type="text" value={pz} onChange={(e) => setPz(e.target.value)} className="border border-gray-300 rounded px-2 py-1 w-16 text-center focus:border-yellow-500 focus:outline-none" />
                 </label>
               </div>
            </div>
          </div>
        </div>

        <div className="text-center bg-blue-50 text-blue-900 border border-blue-200 p-4 rounded-lg shadow-inner mb-6">
          <span className="font-semibold mr-2">Electric Potential V at point P:</span>
          <span className="text-xl font-mono">
            {potential === Infinity ? '∞' : potential.toExponential(3)} V
          </span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-gray-300 shadow-lg bg-white" style={{ height: 500, width: '100%', maxWidth: 800, zIndex: 0 }}>
        <CanvasControlsToolbar
          interactionMode={interactionMode}
          setInteractionMode={setInteractionMode}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={resetCamera}
        />
        <Canvas camera={{position: [5, 5, 8], fov: 45}}>
          <color attach="background" args={['#f8fafc']} />
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <OrbitControls
            ref={controlsRef}
            makeDefault
            mouseButtons={{
              LEFT: interactionMode === 'rotate' ? THREE.MOUSE.ROTATE : THREE.MOUSE.PAN,
              MIDDLE: THREE.MOUSE.DOLLY,
              RIGHT: interactionMode === 'rotate' ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE,
            }}
          />
          
          <gridHelper args={[20, 20, '#e5e7eb', '#f3f4f6']} position={[0, -0.01, 0]} />
          
          <Axes length={10} width={2} fontPosition={10.5} interval={1} />

          {/* Point charge */}
          <mesh position={chargePosition}>
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshStandardMaterial color={numericQ > 0 ? 'purple' : 'blue'} />
          </mesh>
          <Html position={[chargePosition.x, chargePosition.y + 0.4, chargePosition.z]} center distanceFactor={10}>
            <div className="font-bold drop-shadow-md" style={{ color: numericQ > 0 ? 'purple' : 'blue', fontSize: '16px', userSelect: 'none', whiteSpace: 'nowrap' }}>
              Q
            </div>
          </Html>

          {/* Equipotential visualization (semi-transparent sphere) */}
          <mesh position={chargePosition}>
            <sphereGeometry args={[distance, 64, 64]} />
            <meshStandardMaterial color={numericQ > 0 ? 'purple' : 'blue'} transparent opacity={0.15} depthWrite={false} side={THREE.DoubleSide}/>
          </mesh>

          {/* Arrow pointing from Charge to Test Point */}
          <VectorArrow 
            vector={pointPosition.clone().sub(chargePosition).toArray()} 
            origin={chargePosition.toArray()} 
            color={numericQ > 0 ? '#9333ea' : '#2563eb'} 
            label={`r = ${distance.toFixed(2)}m`}
          />

          {/* Test particle */}
          <mesh position={pointPosition}>
            <sphereGeometry args={[0.15, 32, 32]} />
            <meshStandardMaterial color='#eab308' emissive="#ca8a04" emissiveIntensity={0.5} />
          </mesh>
          <Html position={[pointPosition.x, pointPosition.y - 0.3, pointPosition.z]} center distanceFactor={10}>
            <div className="font-bold text-yellow-600 drop-shadow-sm" style={{ fontSize: '18px', userSelect: 'none', whiteSpace: 'nowrap' }}>
              P
            </div>
          </Html>
        </Canvas>
      </div>

      <div className="flex justify-center items-center gap-6 py-4 px-6 mt-4 bg-white rounded-full shadow-sm border border-gray-200 text-sm font-medium w-full max-w-lg">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span className="text-gray-700">X-axis</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span className="text-gray-700">Y-axis</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500"></span>
          <span className="text-gray-700">Z-axis</span>
        </div>
      </div>
    </div>
  );
}

export default ElectricPotentialVisualizer;