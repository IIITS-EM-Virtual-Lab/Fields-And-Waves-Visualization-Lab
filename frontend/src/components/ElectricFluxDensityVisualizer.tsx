import { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import VectorArrow from './VectorArrow';
import Axes from './Axes';

const epsilon0 = 8.854e-12;
const k = 1 / (4 * Math.PI * epsilon0);

function ElectricFluxDensityVisualizer() {
    // Charge details
    const [chargeValue, setChargeValue] = useState(1e-9); // 1 nC
    const [chargePos, setChargePos] = useState([0, 0, 2]); // Above plate by default

    // Plane normal
    const [nx, setNx] = useState(0);
    const [ny, setNy] = useState(1);
    const [nz, setNz] = useState(0);

    // Plane size
    const [planeLength, setPlaneLength] = useState(2);
    const [planeWidth, setPlaneWidth] = useState(2);

    // Compute vectors
    const planeCenter = useMemo(() => new THREE.Vector3(0, 0, 0), []);
    const charge = useMemo(() => new THREE.Vector3(...chargePos), [chargePos]);
    const n = useMemo(() => new THREE.Vector3(nx, ny, nz).normalize(), [nx, ny, nz]);

    // Compute E at plate center using Coulomb's law
    const E = useMemo(() => {
        const rVec = planeCenter.clone().sub(charge);
        const r = rVec.length();
        if (r === 0) return new THREE.Vector3(0, 0, 0);
        return rVec.normalize().multiplyScalar(k * chargeValue / (r * r));
    }, [charge, planeCenter, chargeValue]);

    // Compute D = ε0 * E
    const D = useMemo(() => E.clone().multiplyScalar(epsilon0), [E]);

    const Dmag = useMemo(() => D.length(), [D]);
    const area = useMemo(() => planeLength * planeWidth, [planeLength, planeWidth]);
    const flux = useMemo(() => D.dot(n.clone().multiplyScalar(area)), [D, n, area]);

    // Plane visibility check
    const isValidNormal = !(nx === 0 && ny === 0 && nz === 0);

    // Plane quaternion (only computed when normal is valid)
    const planeQuaternion = useMemo(() => {
        if (!isValidNormal) return new THREE.Quaternion();
        const defaultNormal = new THREE.Vector3(0, 0, 1);
        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(defaultNormal, n);
        return quaternion;
    }, [n, isValidNormal]);


    return (
        <div className="flex flex-col items-center gap-4 p-2 sm:p-4 w-full">
            <div className="w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                    
                    {/* Charge Inputs */}
                    <div>
                        <h2 className="font-bold mb-1">Point Charge:</h2>
                        <label>q (C): 
                            <input type="number" value={chargeValue} onChange={(e) => setChargeValue(Number(e.target.value))} className="border px-2 py-1 w-32 ml-2" step="1e-9" />
                        </label>
                        <div className="mt-2">
                            <label>X: <input type="number" value={chargePos[0]} onChange={(e) => setChargePos([+e.target.value, chargePos[1], chargePos[2]])} className="border w-20 ml-1" /></label>
                            <label className="ml-2">Y: <input type="number" value={chargePos[1]} onChange={(e) => setChargePos([chargePos[0], +e.target.value, chargePos[2]])} className="border w-20 ml-1" /></label>
                            <label className="ml-2">Z: <input type="number" value={chargePos[2]} onChange={(e) => setChargePos([chargePos[0], chargePos[1], +e.target.value])} className="border w-20 ml-1" /></label>
                        </div>
                    </div>

                    {/* Plane Normal Sliders */}
                    <div>
                        <h2 className="font-bold mb-1">Plane Normal (n):</h2>
                        <div className="flex flex-col gap-2">
                            <label>
                                X: {nx.toFixed(2)}
                                <input type="range" min={-1} max={1} step={1} value={nx} onChange={(e) => setNx(parseFloat(e.target.value))} className="w-64 ml-2" />
                            </label>
                            <label>
                                Y: {ny.toFixed(2)}
                                <input type="range" min={-1} max={1} step={1} value={ny} onChange={(e) => setNy(parseFloat(e.target.value))} className="w-64 ml-2" />
                            </label>
                            <label>
                                Z: {nz.toFixed(2)}
                                <input type="range" min={-1} max={1} step={1} value={nz} onChange={(e) => setNz(parseFloat(e.target.value))} className="w-64 ml-2" />
                            </label>
                        </div>
                    </div>

                    {/* Plane Size */}
                    <div>
                        <h2 className="font-bold mb-1">Plane Size:</h2>
                        <label>Length: <input type="number" value={planeLength} min={0} onChange={(e) => setPlaneLength(Number(e.target.value))} className="border px-2 py-1 w-20" /></label>
                        <label className='ml-2'>Width: <input type="number" value={planeWidth} min={0} onChange={(e) => setPlaneWidth(Number(e.target.value))} className="border px-2 py-1 w-20" /></label>
                    </div>
                </div>
            </div>

            {/* Flux Results */}
            <div className="mt-4 text-lg bg-white border p-4 rounded shadow select-none whitespace-nowrap">
                <div><b>E:</b> ({E.x.toExponential(3)}, {E.y.toExponential(3)}, {E.z.toExponential(3)}) N/C</div>
                <div><b>D:</b> ({D.x.toExponential(3)}, {D.y.toExponential(3)}, {D.z.toExponential(3)}) C/m²</div>
                <div>|D| = {Dmag.toExponential(3)} C/m²</div>
                <div>Ψ (Flux) = {flux.toExponential(3)} C</div>
            </div>

            {/* Canvas */}
            <div className="relative overflow-hidden rounded-lg border-2 border-blue-600 mt-6" style={{ height: 500, width: 800 }}>
                <Canvas style={{ height: '100%', width: '100%' }} camera={{position: [3, 1, 3]}}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <OrbitControls />

                    <Axes length={20} width={3} fontPosition={4.5} interval={1} xcolor="black" ycolor="black" zcolor="black" />

                    {/* Plane */}
                    {isValidNormal && (
                        <mesh position={[0, 0, 0]} quaternion={planeQuaternion}>
                            <planeGeometry args={[planeLength, planeWidth]} />
                            <meshStandardMaterial color="blue" opacity={0.4} transparent side={THREE.DoubleSide} />
                        </mesh>
                    )}


                    {/* Charge */}
                    <mesh position={charge.toArray()}>
                        <sphereGeometry args={[0.15, 32, 32]} />
                        <meshStandardMaterial color={chargeValue > 0 ? 'red' : 'blue'} />
                    </mesh>

                    {/* Vectors */}
                    <VectorArrow vector={[E.x, E.y, E.z]} color="red" label="E" origin={[0, 0, 0]} />
                    <VectorArrow vector={[D.x, D.y, D.z]} color="blue" label="D" origin={[0, 0, 0]} />
                    <VectorArrow vector={[n.x, n.y, n.z]} color="green" label="n" origin={[0, 0, 0]} />
                </Canvas>
            </div>
        </div>
    );
}

export default ElectricFluxDensityVisualizer;