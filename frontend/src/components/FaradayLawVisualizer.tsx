import { useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Axes from './Axes';
import VectorArrow from './VectorArrow';

function TimeUpdater({ setTime }: { setTime: React.Dispatch<React.SetStateAction<number>> }) {
    useFrame((_, delta) => {
        setTime((prev) => prev + delta);
    });
    return null;
}

function FaradayVisualizer() {
    const [bMagnitude, setBMagnitude] = useState(1);
    const [theta, setTheta] = useState(0);
    const [animateField, setAnimateField] = useState(false);
    const [animateRing, setAnimateRing] = useState(false);
    const [time, setTime] = useState(0);
    const [radius, setRadius] = useState(1);

    const area = useMemo(() => Math.PI * radius * radius, [radius]);

    const angleRad = useMemo(() => animateRing ? time : (theta * Math.PI) / 180, [theta, time, animateRing]);

    const B = useMemo(() => {
        const magnitude = animateField ? Math.sin(time) : bMagnitude;
        return new THREE.Vector3(0, 0, magnitude);
    }, [bMagnitude, animateField, time]);

    const areaVector = useMemo(() => {
        return new THREE.Vector3(0, Math.sin(angleRad), Math.cos(angleRad));
    }, [angleRad]);

    const flux = useMemo(() => B.clone().multiplyScalar(Math.cos(theta)).multiplyScalar(area).dot(areaVector), [B, area, areaVector, theta]);

    const emf = useMemo(() => {
        if (animateField) return -Math.cos(time);
        if (animateRing) return -B.z * Math.sin(time);
        return 0;
    }, [animateField, animateRing, time, B.z]);

    const ringQuaternion = useMemo(() => {
        const defaultNormal = new THREE.Vector3(0, 0, 1);
        const q = new THREE.Quaternion();
        q.setFromUnitVectors(defaultNormal, areaVector.clone().normalize());
        return q;
    }, [areaVector]);

    return (
        <div className="flex flex-col items-center gap-4 p-4 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-5xl">
                <div>
                    <h2 className="font-bold mb-2">Magnetic Field (B):</h2>
                    <label className="block mb-2">
                        Magnitude:
                        <input
                            type="range"
                            min="-5"
                            max="5"
                            step="0.1"
                            value={bMagnitude}
                            onChange={(e) => setBMagnitude(Number(e.target.value))}
                            className="w-full"
                            disabled={animateField}
                        />
                        <span className="ml-2">{bMagnitude.toFixed(2)}</span>
                    </label>
                    <label className="block mb-2">
                        Angle (θ) between B and A:
                        <input
                            type="range"
                            min="0"
                            max="180"
                            step="1"
                            value={theta}
                            onChange={(e) => setTheta(Number(e.target.value))}
                            className="w-full"
                            disabled={animateField || animateRing}
                        />
                        <span className="ml-2">{theta}&deg;</span>
                    </label>
                    <label className="block mb-2">
                        Radius of the ring(r):
                        <input
                            type="range"
                            min="1"
                            max="5"
                            step="1"
                            value={radius}
                            onChange={(e) => setRadius(Number(e.target.value))}
                            className="w-full"
                            disabled={animateField || animateRing}
                        />
                        <span className="ml-2">{radius}</span>
                    </label>
                    {animateField && (
                        <div className="mt-4 bg-white border p-4 rounded shadow text-sm leading-loose">
                            <h2 className="font-bold mb-2">Time-Varying Field Equations (when animated):</h2>
                            <div><strong>B(t)</strong> = sin(t) ẑ</div>
                            <div><strong>Φ(t)</strong> = sin(t)</div>
                            <div><strong>Ɛ(t)</strong> = -cos(t)</div>
                            <div>At time t = {time.toFixed(2)} s</div>
                            <div>Φ(t) = {Math.sin(time).toFixed(3)} Wb</div>
                            <div>Ɛ(t) = {-Math.cos(time).toFixed(3)} V</div>
                        </div>
                    )}
                    {animateRing && (
                        <div className="mt-4 bg-white border p-4 rounded shadow text-sm leading-loose">
                            <h2 className="font-bold mb-2">Rotating Ring Equations:</h2>
                            <div><strong>A(t)</strong> = A [0, sin(t), cos(t)]</div>
                            <div><strong>Φ(t)</strong> = B·A = Bz * cos(t)</div>
                            <div><strong>Ɛ(t)</strong> = Bz * sin(t)</div>
                            <div>At time t = {time.toFixed(2)} s</div>
                            <div>Φ(t) = {(B.z * Math.cos(time)).toFixed(3)} Wb</div>
                            <div>Ɛ(t) = {(B.z * Math.sin(time)).toFixed(3)} V</div>
                        </div>
                    )}
                    <label className="block">
                        <input
                            type="checkbox"
                            checked={animateField}
                            onChange={(e) => {
                                setAnimateField(e.target.checked);
                                if (e.target.checked) setAnimateRing(false);
                            }}
                        />{' '}
                        Animate Magnetic Field
                    </label>
                    <label className="block">
                        <input
                            type="checkbox"
                            checked={animateRing}
                            onChange={(e) => {
                                setAnimateRing(e.target.checked);
                                if (e.target.checked) setAnimateField(false);
                            }}
                        />{' '}
                        Animate Ring (Loop)
                    </label>
                </div>

                <div className="bg-white border rounded p-4 shadow">
                    <h2 className="font-bold mb-2">Flux & EMF</h2>
                    <div>Magnetic Flux (Φ): {flux.toExponential(3)} Wb</div>
                    <div>Induced EMF (ℰ): {emf.toFixed(3)} V</div>
                </div>
            </div>

            <div className="mt-4 relative overflow-hidden rounded-lg border-2 border-blue-600 w-full max-w-4xl aspect-video bg-white" style={{ zIndex: 0 }}>
                <Canvas className="!h-full !w-full" camera={{position: [5, 2, 5]}}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <OrbitControls />

                    <Axes length={20} width={3} fontPosition={4.5} interval={1} />

                    <VectorArrow vector={B.toArray()} color="blue" label="B" origin={[0, 0, 0]} />
                    <VectorArrow vector={areaVector.toArray()} color="green" label="A" origin={[0, 0, 0]} />

                    {(animateField || animateRing) && <TimeUpdater setTime={setTime} />}

                    <mesh quaternion={ringQuaternion} rotation={[0, 0, Math.PI/2]}>
                        <torusGeometry args={[radius, 0.02, 16, 100]} />
                        <meshStandardMaterial color="orange" />
                    </mesh>
                </Canvas>
            </div>
        </div>
    );
}

export default FaradayVisualizer;