import { useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Axes from './Axes';
import VectorArrow from './VectorArrow';

function AmpereLawVisualizer() {
    const [current, setCurrent] = useState(5); // Amperes
    const [radius, setRadius] = useState(2);   // Meters
    const mu0 = 4 * Math.PI * 1e-7;

    const Bmag = useMemo(() => (mu0 * current) / (2 * Math.PI * radius), [current, radius]);
    const lineIntegral = useMemo(() => Bmag * 2 * Math.PI * radius, [Bmag, radius]);
    const rightSide = useMemo(() => mu0 * current, [mu0, current]);

    const Bvectors = useMemo(() => {
        const vectors = [];
        const segments = 16;
        for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * 2 * Math.PI;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        const dirX = -Math.sin(angle);
        const dirY = Math.cos(angle);
        vectors.push({ origin: [x, y, 0], vector: [dirX * Bmag, dirY * Bmag, 0] });
        }
        return vectors;
    }, [radius, Bmag]);

    const Ivector = useMemo(() => {
        const vectors = [];
        vectors.push([0, 0, 0])
        if(Bmag > 0)
            vectors.push([0, 0, 6])
        else if(Bmag < 0)
            vectors.push([0, 0, -6])
        else
            vectors.push([0, 0, 0])

        return vectors;
    }, [Bmag]);

    return (
        <div className="flex flex-col items-center gap-4 p-4">
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h2 className="font-bold mb-2">Input Parameters:</h2>
                    <label className="block mb-2">
                        Current (I) [A]:
                        <input type="number" value={current} onChange={(e) => setCurrent(Number(e.target.value))} className="border px-2 py-1 w-28 ml-2" />
                    </label>
                    <label className="block mb-2">
                        Loop Radius (r) [m]:
                        <input type="number" value={radius} min={0.1} step={0.1} onChange={(e) => setRadius(Number(e.target.value))} className="border px-2 py-1 w-28 ml-2" />
                    </label>

                    <div className="mt-4 bg-white border p-3 rounded shadow">
                        <div><strong>B</strong> = {Bmag.toExponential(3)} T</div>
                        <div><strong>∮B⋅dl</strong> = {lineIntegral.toExponential(3)} T·m</div>
                        <div><strong>μ₀I</strong> = {rightSide.toExponential(3)} T·m</div>
                    </div>
                </div>
            </div>
            <div className="mt-4 relative overflow-hidden rounded-lg border-2 border-blue-600" style={{ height: 500, width: 800, zIndex: 0 }}>
                <Canvas camera={{ position: [5, 6, 5], fov: 50 }}>
                    <ambientLight intensity={0.6} />
                    <pointLight position={[10, 10, 10]} />
                    <OrbitControls />

                    <Axes length={20} width={3} interval={1} fontPosition={4.5} />

                    {/* Vertical wire */}
                    <mesh position={[0, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
                        <cylinderGeometry args={[0.05, 0.05, 10, 32]} />
                        <meshStandardMaterial color="green" />
                    </mesh>

                    <VectorArrow vector={Ivector[1] as [number, number, number]} origin={Ivector[0] as [number, number, number]} color='purple' label='I' />

                    {/* Ampèrian loop */}
                    <mesh rotation={[0, 0, 0]}>
                        <torusGeometry args={[radius, 0.02, 16, 100]} />
                        <meshStandardMaterial color="orange" />
                    </mesh>

                    {/* Magnetic Field Vectors */}
                    {Bvectors.map((vec, idx) => (
                        <VectorArrow
                        key={idx}
                        origin={vec.origin as [number, number, number]}
                        vector={vec.vector as [number, number, number]}
                        color="blue"
                        />
                    ))}
                </Canvas>
            </div>
        </div>
    );
}

export default AmpereLawVisualizer;