import { useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import Axes from './Axes';
import VectorArrow from './VectorArrow';

function TimeUpdater({ setTime }: { setTime: React.Dispatch<React.SetStateAction<number>> }) {
    useFrame((_, delta) => {
        setTime((prev) => prev + delta);
    });
    return null;
}

function DisplacementCurrentVisualizer() {
    const [animate, setAnimate] = useState(true);
    const [time, setTime] = useState(0);
    const [plateDistance, setPlateDistance] = useState(2);
    const [voltageAmplitude, setVoltageAmplitude] = useState(5);
    const [frequency, setFrequency] = useState(1);

    const epsilon0 = 8.854e-12;
    const plateArea = 1; // m^2

    const voltage = useMemo(() => voltageAmplitude * Math.sin(2 * Math.PI * frequency * time), [time, voltageAmplitude, frequency]);
    const electricField = useMemo(() => voltage / plateDistance, [voltage, plateDistance]);
    const flux = useMemo(() => electricField * plateArea, [electricField]);
    const dFluxDt = useMemo(() => {
        const omega = 2 * Math.PI * frequency;
        return voltageAmplitude * omega * Math.cos(omega * time) * (plateArea / plateDistance);
    }, [time, voltageAmplitude, frequency, plateArea, plateDistance]);
    const displacementCurrent = useMemo(() => epsilon0 * dFluxDt, [dFluxDt]);

    return (
        <div className="flex flex-col items-center gap-4 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-5xl">
                <div>
                    <h2 className="font-bold mb-2">Capacitor Settings:</h2>
                    <label className="block mb-2">
                        Plate Distance (d):
                        <input
                        type="range"
                        min="0.5"
                        max="5"
                        step="0.1"
                        value={plateDistance}
                        onChange={(e) => setPlateDistance(Number(e.target.value))}
                        className="w-full"
                        />
                        <span className="ml-2">{plateDistance.toFixed(2)} m</span>
                    </label>
                    <label className="block mb-2">
                        Voltage Amplitude (V₀):
                        <input
                        type="range"
                        min="1"
                        max="10"
                        step="0.1"
                        value={voltageAmplitude}
                        onChange={(e) => setVoltageAmplitude(Number(e.target.value))}
                        className="w-full"
                        />
                        <span className="ml-2">{voltageAmplitude.toFixed(1)} V</span>
                    </label>
                    <label className="block mb-2">
                        Frequency (Hz):
                        <input
                        type="range"
                        min="0.1"
                        max="5"
                        step="0.1"
                        value={frequency}
                        onChange={(e) => setFrequency(Number(e.target.value))}
                        className="w-full"
                        />
                        <span className="ml-2">{frequency.toFixed(1)} Hz</span>
                    </label>
                    <label className="block">
                        <input
                        type="checkbox"
                        checked={animate}
                        onChange={(e) => setAnimate(e.target.checked)}
                        />{' '}
                        Animate
                    </label>
                </div>

                <div className="bg-white border rounded p-4 shadow text-sm">
                <h2 className="font-bold mb-2">Real-Time Values:</h2>
                <div><strong>t</strong> = {time.toFixed(2)} s</div>
                <div><strong>V(t)</strong> = {voltage.toFixed(3)} V</div>
                <div><strong>E(t)</strong> = {electricField.toExponential(3)} V/m</div>
                <div><strong>Φ(t)</strong> = {flux.toExponential(3)} Wb</div>
                <div><strong>dΦ/dt</strong> = {dFluxDt.toExponential(3)} Wb/s</div>
                <div><strong>I<sub>d</sub></strong> = {displacementCurrent.toExponential(3)} A</div>
                </div>
            </div>

            <div className="mt-6 border-2 border-blue-600 rounded-lg overflow-hidden" style={{ height: 500, width: 800, zIndex: 0 }}>
                <Canvas camera={{ position: [5, 0, 5], fov: 45 }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <OrbitControls />

                    <Axes length={20} width={3} fontPosition={4.5} interval={1} />

                    {/* Plates */}
                    <mesh position={[0, plateDistance / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
                        <planeGeometry args={[2, 2]} />
                        <meshStandardMaterial color="red" side={THREE.DoubleSide} />
                    </mesh>
                    <mesh position={[0, -plateDistance / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
                        <planeGeometry args={[2, 2]} />
                        <meshStandardMaterial color="blue" side={THREE.DoubleSide} />
                    </mesh>

                    {/* Positive Plate Label */}
                    <Html position={[0, (plateDistance/2) + 0.3, 0.3]} center distanceFactor={10}>
                        <div style={{ color: 'red', fontWeight: 'bold', fontSize: '24px', whiteSpace: 'nowrap', userSelect: 'none' }}>+</div>
                    </Html>

                    {/* Negative Plate Label */}
                    <Html position={[0, -(plateDistance/2 + 0.3), 0.3]} center distanceFactor={10}>
                        <div style={{ color: 'blue', fontWeight: 'bold', fontSize: '24px', whiteSpace: 'nowrap', userSelect: 'none' }}>−</div>
                    </Html>

                    {animate && <TimeUpdater setTime={setTime} />}

                    {/* E-field arrows */}
                    {Array.from({ length: 5 }).map((_, i) => (
                        <VectorArrow
                        key={i}
                        origin={[i * 0.4 - 0.8, 0, 0]}
                        vector={[0, electricField * 0.1, 0]}
                        color="orange"
                        label={i === 0 ? 'E' : ''}
                        />
                    ))}

                    {/* Displacement current arrow */}
                    <VectorArrow origin={[0, 0, 0]} vector={[0, 1, 0]} color="blue" label="I_d" />
                </Canvas>
            </div>
        </div>
    );
}

export default DisplacementCurrentVisualizer;