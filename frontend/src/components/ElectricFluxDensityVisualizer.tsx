import { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import VectorArrow from './VectorArrow';
import Axes from './Axes';

function ElectricFluxDensityVisualizer() {
    const [Ex, setEx] = useState(2);
    const [Ey, setEy] = useState(2);
    const [Ez, setEz] = useState(0);
    const [nx, setNx] = useState(0);
    const [ny, setNy] = useState(1);
    const [nz, setNz] = useState(0);
    const [planeLength, setPlaneLength] = useState(2);
    const [planeWidth, setPlaneWidth] = useState(2);

    const epsilon0 = 8.854e-12;

    const E = useMemo(() => new THREE.Vector3(Ex, Ey, Ez), [Ex, Ey, Ez]);
    const n = useMemo(() => new THREE.Vector3(nx, ny, nz).normalize(), [nx, ny, nz]);
    const D = useMemo(() => E.clone().multiplyScalar(epsilon0), [E]);
    const Dmag = useMemo(() => D.length(), [D]);
    const area = useMemo(() => planeLength * planeWidth, [planeLength, planeWidth]);
    const flux = useMemo(() => D.dot(n.clone().multiplyScalar(area)), [D, n, area]);

    // Create plane rotation from normal vector
    const planeQuaternion = useMemo(() => {
        const defaultNormal = new THREE.Vector3(0, 0, 1);
        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(defaultNormal, n);
        return quaternion;
    }, [n]);

    return (
        <div className="flex flex-col items-center gap-4 p-4">
            <div className="w-full max-w-4xl flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h2 className="font-bold mb-1">Electric Field (E):</h2>
                        <label>X: <input type="number" value={Ex} onChange={(e) => setEx(Number(e.target.value))} className="border px-2 py-1 w-20" /></label>
                        <label className="ml-2">Y: <input type="number" value={Ey} onChange={(e) => setEy(Number(e.target.value))} className="border px-2 py-1 w-20" /></label>
                        <label className="ml-2">Z: <input type="number" value={Ez} onChange={(e) => setEz(Number(e.target.value))} className="border px-2 py-1 w-20" /></label>
                    </div>
                    <div>
                        <h2 className="font-bold mb-1">Plane Normal (n):</h2>
                        <div className="flex flex-col gap-2">
                            <label>
                            X: {nx.toFixed(2)}
                            <input
                                type="range"
                                min={-1}
                                max={1}
                                step={1}
                                value={nx}
                                onChange={(e) => setNx(parseFloat(e.target.value))}
                                className="w-64 ml-2"
                            />
                            </label>
                            <label>
                            Y: {ny.toFixed(2)}
                            <input
                                type="range"
                                min={-1}
                                max={1}
                                step={1}
                                value={ny}
                                onChange={(e) => setNy(parseFloat(e.target.value))}
                                className="w-64 ml-2"
                            />
                            </label>
                            <label>
                            Z: {nz.toFixed(2)}
                            <input
                                type="range"
                                min={-1}
                                max={1}
                                step={1}
                                value={nz}
                                onChange={(e) => setNz(parseFloat(e.target.value))}
                                className="w-64 ml-2"
                            />
                            </label>
                        </div>
                    </div>

                    <div>
                        <h2 className="font-bold mb-1">Plane Size (Length & Width):</h2>
                        <label>Length: <input type="number" value={planeLength} min={0} onChange={(e) => setPlaneLength(Number(e.target.value))} className="border px-2 py-1 w-20" /></label>
                        <label className='ml-2'>Width: <input type="number" value={planeWidth} min={0} onChange={(e) => setPlaneWidth(Number(e.target.value))} className="border px-2 py-1 w-20" /></label>
                    </div>
                </div>
            </div>

            <div className="mt-4 text-lg bg-white border p-2 rounded shadow select-none whitespace-nowrap">
                D = ({D.getComponent(0)}, {D.getComponent(1)}, {D.getComponent(2)})
                <br/> 
                |D| = {Dmag.toExponential(3)} C/m² <br/>
                Ψ (Electric Flux) = {flux.toExponential(3)} C
            </div>

            <div className="relative overflow-hidden rounded-lg border-2 border-blue-600 mt-6" style={{ height: 500, width: 800, zIndex: 0 }}>
                <Canvas style={{ height: '100%', width: '100%' }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <OrbitControls />

                    <Axes length={10} width={2} fontPosition={4.5} interval={1} xcolor="black" ycolor="black" zcolor="black" />

                    {/* Electric Field vector */}
                    <VectorArrow vector={[Ex, Ey, Ez]} color="red" label="E" />
                    <VectorArrow vector={[D.x, D.y, D.z]} color="blue" label="D" />
                    <VectorArrow vector={[n.x, n.y, n.z]} color="green" label="n (Normal)" />

                    {/* Plane */}
                    <mesh position={[0, 0, 0]} quaternion={planeQuaternion}>
                        <planeGeometry args={[planeLength, planeWidth]} />
                        <meshStandardMaterial color="blue" opacity={0.4} transparent side={THREE.DoubleSide} />
                    </mesh>
                </Canvas>
            </div>
        </div>
    );
}

export default ElectricFluxDensityVisualizer;