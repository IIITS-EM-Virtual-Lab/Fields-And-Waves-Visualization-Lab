// function ElectricDipoleVisualizer() {
//   const [q, setQ] = useState(1e-9);

//   const [showField, setShowField] = useState(true);
//   const [showDipoleVector, setShowDipoleVector] = useState(true);
//   const [showPotential, setShowPotential] = useState(true);

//   const posCharge = useMemo(() => new THREE.Vector3(0, 0, d / 2), [d]);
//   const negCharge = useMemo(() => new THREE.Vector3(0, 0, -d / 2), [d]);
//   const testPosition = useMemo(() => new THREE.Vector3(testX, testY, testZ), [testX, testY, testZ]);

//   // Calculate field at test point
//   const fieldAtTestPoint = useMemo(() => {
//     const r1 = testPosition.clone().sub(posCharge);
//     const r2 = testPosition.clone().sub(negCharge);
//     const E1 = r1.clone().normalize().multiplyScalar(k * q / Math.pow(r1.length(), 2));
//     const E2 = r2.clone().normalize().multiplyScalar(-k * q / Math.pow(r2.length(), 2));
//     return E1.add(E2);
//   }, [testPosition, posCharge, negCharge, q]);

//   const potential = useMemo(() => {
//     const r1 = testPosition.clone().sub(posCharge).length();
//     const r2 = testPosition.clone().sub(negCharge).length();
//     return (k * q / r1) + (-k * q / r2);
//   }, [testPosition, posCharge, negCharge, q]);

//   const dipoleVector = useMemo(() => posCharge.clone().sub(negCharge), [posCharge, negCharge]);

//   return (
//     <div className="flex flex-col items-center gap-4 p-4">
//       <div className="grid grid-cols-1 gap-4">
//         <div>
//           <h2 className="font-bold mb-1">Dipole Settings</h2>
//           <label>Charge (q): <input type="number" value={q} step={1e-9} onChange={(e) => setQ(parseFloat(e.target.value))} className="border px-2 py-1 w-24 ml-1" /> C</label>
//           <label className="ml-4">Distance (d): <input type="number" value={d} min={0} step={0.1} onChange={(e) => setD(Number(e.target.value))} className="border px-2 py-1 w-20 ml-1" /></label>
//         </div>
//         <div>
//           <h2 className="font-bold mb-1">Test Particle Position</h2>
//           <label>X: <input type="number" value={testX} onChange={(e) => setTestX(Number(e.target.value))} className="border px-2 py-1 w-20 ml-1" /></label>
//           <label className="ml-2">Y: <input type="number" value={testY} onChange={(e) => setTestY(Number(e.target.value))} className="border px-2 py-1 w-20 ml-1" /></label>
//           <label className="ml-2">Z: <input type="number" value={testZ} onChange={(e) => setTestZ(Number(e.target.value))} className="border px-2 py-1 w-20 ml-1" /></label>
//         </div>
        
//       </div>

//       <div className="relative overflow-hidden rounded-lg border-2 border-blue-600 mt-6" style={{ height: 500, width: 800 }}>
//         <Canvas style={{ height: '100%', width: '100%' }}>
//           <ambientLight intensity={0.5} />
//           <pointLight position={[10, 10, 10]} />
//           <OrbitControls />

//           <Axes length={10} width={2} fontPosition={4.5} interval={1} />

//           {/* Positive and Negative Charges */}
//           <mesh position={posCharge.toArray()}>
//             <sphereGeometry args={[0.2, 32, 32]} />
//             <meshStandardMaterial color='red' />
//             <Html position={[0, 0.4, 0]} center><div style={{ color: 'red' }}>+q</div></Html>
//           </mesh>
//           <mesh position={negCharge.toArray()}>
//             <sphereGeometry args={[0.2, 32, 32]} />
//             <meshStandardMaterial color='blue' />
//             <Html position={[0, 0.4, 0]} center><div style={{ color: 'blue' }}>-q</div></Html>
//           </mesh>

//           {/* Dipole moment vector */}
//           {showDipoleVector && (
//             <VectorArrow vector={dipoleVector.toArray()} origin={negCharge.toArray()} color="green" label="p" />
//           )}

//           {/* Electric field vector */}
//           {showField && (
//             <VectorArrow vector={fieldAtTestPoint.toArray()} origin={testPosition.toArray()} color="orange" label="E" />
//           )}

//           {/* Vector from charge to test particle */}
//           <VectorArrow vector={testPosition.clone().sub(posCharge).toArray()} origin={posCharge.toArray()} color='purple' label='V' />

//           {/* Test Particle */}
//           <mesh position={testPosition.toArray()}>
//             <sphereGeometry args={[0.1, 32, 32]} />
//             <meshStandardMaterial color='black' />
//             {showPotential && (
//               <Html position={[0, 0.3, 0]} center>
//                 <div style={{ fontSize: '16px', background: 'white', padding: '4px 8px', borderRadius: '8px' }}>
//                   V = {potential === Infinity ? '∞' : potential.toExponential(3)} V
//                 </div>
//               </Html>
//             )}
//           </mesh>
//         </Canvas>
//       </div>
//     </div>
//   );
// }

// export default ElectricDipoleVisualizer;


import { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import VectorArrow from './VectorArrow';
import Axes from './Axes';

function ElectricDipoleVisualizer() {
    const [posX, setPosX] = useState(-1);
    const [posY, setPosY] = useState(0);
    const [posZ, setPosZ] = useState(0);

    const [negX, setNegX] = useState(1);
    const [negY, setNegY] = useState(0);
    const [negZ, setNegZ] = useState(0);

    const [testX, setTestX] = useState(0);
    const [testY, setTestY] = useState(2);
    const [testZ, setTestZ] = useState(0);

    const [posq, setPosQ] = useState(1e-9);
    const [negq, setNegQ] = useState(-1e-9);

    const [showField, setShowField] = useState(true);
    const [showDipoleVector, setShowDipoleVector] = useState(true);

    const k = 9e9; // Coulomb's constant

    const positiveCharge = useMemo(() => new THREE.Vector3(posX, posY, posZ), [posX, posY, posZ]);
    const negativeCharge = useMemo(() => new THREE.Vector3(negX, negY, negZ), [negX, negY, negZ]);
    const testParticle = useMemo(() => new THREE.Vector3(testX, testY, testZ), [testX, testY, testZ]);

    const dipoleVector = useMemo(() => negativeCharge.clone().sub(positiveCharge), [positiveCharge, negativeCharge]);

    const E_pos = useMemo(() => {
        const r = testParticle.clone().sub(positiveCharge);
        const mag = k * posq / Math.pow(r.length(), 3);
        return r.multiplyScalar(mag);
    }, [positiveCharge, testParticle, posq]);

    const E_neg = useMemo(() => {
        const r = testParticle.clone().sub(negativeCharge);
        const mag = k * negq / Math.pow(r.length(), 3);
        return r.multiplyScalar(mag);
    }, [negativeCharge, testParticle, negq]);

    const E_total = useMemo(() => E_pos.clone().add(E_neg), [E_pos, E_neg]);

    const V_pos = useMemo(() => k * posq / testParticle.clone().sub(positiveCharge).length(), [positiveCharge, testParticle, posq]);
    const V_neg = useMemo(() => k * negq / testParticle.clone().sub(negativeCharge).length(), [negativeCharge, testParticle, negq]);
    const V_total = useMemo(() => V_pos + V_neg, [V_pos, V_neg]);

    return (
        <div className="flex flex-col items-center gap-4 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl w-full">
                <div>
                    <h2 className="font-bold mb-1">Charges:</h2>
                    <label>+q: <input type="number" value={posq} min={0} step={1e-9} onChange={(e) => setPosQ(parseFloat(e.target.value))} className="border px-2 py-1 w-24 ml-1" /> C</label>
                    <label className='ml-4'>-q: <input type="number" value={negq} max={0} step={1e-9} onChange={(e) => setNegQ(parseFloat(e.target.value))} className="border px-2 py-1 w-24 ml-1" /> C</label>
                </div>
                <div>
                    <h2 className="font-bold mb-1">Test Particle Position(P):</h2>
                    <label>X: <input type="number" value={testX} onChange={(e) => setTestX(Number(e.target.value))} className="border px-2 py-1 w-20" /></label>
                    <label className="ml-2">Y: <input type="number" value={testY} onChange={(e) => setTestY(Number(e.target.value))} className="border px-2 py-1 w-20" /></label>
                    <label className="ml-2">Z: <input type="number" value={testZ} onChange={(e) => setTestZ(Number(e.target.value))} className="border px-2 py-1 w-20" /></label>
                </div>
                <div>
                    <h2 className="font-bold mb-1">Positive Charge Position:</h2>
                    <label>X: <input type="number" value={posX} onChange={(e) => setPosX(Number(e.target.value))} className="border px-2 py-1 w-20" /></label>
                    <label className="ml-2">Y: <input type="number" value={posY} onChange={(e) => setPosY(Number(e.target.value))} className="border px-2 py-1 w-20" /></label>
                    <label className="ml-2">Z: <input type="number" value={posZ} onChange={(e) => setPosZ(Number(e.target.value))} className="border px-2 py-1 w-20" /></label>
                </div>

                <div>
                    <h2 className="font-bold mb-1">Negative Charge Position:</h2>
                    <label>X: <input type="number" value={negX} onChange={(e) => setNegX(Number(e.target.value))} className="border px-2 py-1 w-20" /></label>
                    <label className="ml-2">Y: <input type="number" value={negY} onChange={(e) => setNegY(Number(e.target.value))} className="border px-2 py-1 w-20" /></label>
                    <label className="ml-2">Z: <input type="number" value={negZ} onChange={(e) => setNegZ(Number(e.target.value))} className="border px-2 py-1 w-20" /></label>
                </div>

                <div className="flex gap-4">
                    <label><input type="checkbox" checked={showField} onChange={(e) => setShowField(e.target.checked)} /> Show Electric Field</label>
                    <label><input type="checkbox" checked={showDipoleVector} onChange={(e) => setShowDipoleVector(e.target.checked)} /> Show Dipole Vector</label>
                </div>
            </div>

            <div>
                <label>Electric Dipole = ({dipoleVector.getComponent(0).toFixed(2)}, {dipoleVector.getComponent(1).toFixed(2)}, {dipoleVector.getComponent(2).toFixed(2)})</label>
                <br />
                <label>Electric Field at point P due to Electric Dipole (E) = ({E_total.getComponent(0).toFixed(2)}, {E_total.getComponent(1).toFixed(2)}, {E_total.getComponent(2).toFixed(2)})</label>
                <br />
                <label>Electric Field at point P due to Electric Dipole (V) = {V_total}</label>
            </div>

            <div className="relative overflow-hidden rounded-lg border-2 border-blue-600 mt-6" style={{ height: 500, width: 800, zIndex: 0 }}>
                <Canvas style={{ height: '100%', width: '100%' }} camera={{position: [2, 4, 5]}}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <OrbitControls />

                    <Axes length={20} width={3} fontPosition={4.5} interval={1} xcolor="black" ycolor="black" zcolor="black" />

                    {/* Charges */}
                    <mesh position={positiveCharge.toArray()}>
                        <sphereGeometry args={[0.2, 32, 32]} />
                        <meshStandardMaterial color="red" />
                    </mesh>
                    <mesh position={negativeCharge.toArray()}>
                        <sphereGeometry args={[0.2, 32, 32]} />
                        <meshStandardMaterial color="blue" />
                    </mesh>

                    {/* Dipole vector */}
                    { showDipoleVector && (<VectorArrow vector={dipoleVector.toArray()} origin={positiveCharge.toArray()} color="purple" label="Dipole" />
                    )}

                    {/* Field vector */}
                    { showField && (<VectorArrow vector={E_total.toArray()} origin={testParticle.toArray()} color="orange" label="E" />
                    )}


                    {/* Test Particle */}
                    <mesh position={testParticle.toArray()}>
                        <sphereGeometry args={[0.1, 32, 32]} />
                        <meshStandardMaterial color='green' />
                    </mesh>
                    <Html position={[testParticle.x+0.1, testParticle.y+0.2, testParticle.z+0.1]} center distanceFactor={8}>
                        <div style={{ color: 'green', fontSize: '20px', userSelect: 'none', whiteSpace: 'nowrap' }}>
                            P
                        </div>
                    </Html>
                </Canvas>
            </div>
        </div>
    );
}

export default ElectricDipoleVisualizer;