import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import VectorArrow from './VectorArrow';
import Axes from './Axes';

// ─── Constants ────────────────────────────────────────────────────────────────
const k = 9e9;

// I_ROT is a visual scaling factor so motion is visible.
// It is recomputed whenever q, sep, or eMag changes — see getIRot().
// Formula: I = p * E * sin(θ₀) so that α = 1 rad/s² at start → visible in ~3 s
const getIRot = (q: number, sep: number, eMag: number, startAngle: number) => {
const raw = q * sep * eMag * Math.abs(Math.sin(startAngle));
return raw < 1e-20 ? 1e-20 : raw; // guard against div-by-zero
};

// ─── Physics state ────────────────────────────────────────────────────────────
interface PhysicsState {
running: boolean;
angle:   number;   // dipole angle in XZ plane (rad)
omega:   number;   // angular velocity (rad/s)
sep:     number;   // charge separation (m)
q:       number;   // charge magnitude (C)
eMag:    number;   // |E_ext| (V/m) — 0 when field off
iRot:    number;   // effective moment of inertia (visual scale)
}

// ─── DipoleScene — inside <Canvas>, owns useFrame ────────────────────────────
interface DipoleSceneProps {
phys:             React.MutableRefObject<PhysicsState>;
onTick:           (angle: number, omega: number) => void;
showDipoleVector: boolean;
showField:        boolean;
showLines:        boolean;
showPotential:    boolean;
showUniformE:     boolean;
testParticle:     THREE.Vector3;
q:                number;
}

function DipoleScene({
phys, onTick,
showDipoleVector, showField, showLines, showPotential, showUniformE,
testParticle, q,
}: DipoleSceneProps) {


const posRef = useRef<THREE.Mesh>(null!);
const negRef = useRef<THREE.Mesh>(null!);

// vizAngle drives React-rendered visuals at ~10 Hz (field lines, vectors)
const [vizAngle, setVizAngle] = useState(phys.current.angle);
const tickAcc = useRef(0);

useFrame((_, delta) => {
    const p  = phys.current;
    const dt = Math.min(delta, 0.05);

    if (p.running && p.eMag > 0) {
        // τ = −p·E·sin(θ),  α = τ / I_ROT  (no damping — pure pendulum)
        const alpha = -(p.q * p.sep * p.eMag * Math.sin(p.angle)) / p.iRot;
        p.omega += alpha * dt;   // no damping multiplier — energy conserved
        p.angle += p.omega * dt;
    }

    // Move meshes imperatively — zero React overhead
    const hs = p.sep / 2;
    const px = Math.cos(p.angle) * hs;
    const pz = Math.sin(p.angle) * hs;
    posRef.current?.position.set( px, 0,  pz);
    negRef.current?.position.set(-px, 0, -pz);

    // Throttle React updates to ~10 Hz for field lines / readout
    tickAcc.current += dt;
    if (tickAcc.current >= 0.1) {
        tickAcc.current = 0;
        setVizAngle(p.angle);
        onTick(p.angle, p.omega);
    }
});

// ── Geometry at vizAngle (~10 Hz) ──
const sep = phys.current.sep;

const posCharge = useMemo(() => new THREE.Vector3(
    Math.cos(vizAngle) * sep / 2, 0, Math.sin(vizAngle) * sep / 2
), [vizAngle, sep]);

const negCharge = useMemo(() => new THREE.Vector3(
    -Math.cos(vizAngle) * sep / 2, 0, -Math.sin(vizAngle) * sep / 2
), [vizAngle, sep]);

const computeE = useCallback((point: THREE.Vector3): THREE.Vector3 => {
    const field = (r: THREE.Vector3, pos: THREE.Vector3, charge: number) => {
        const d = r.clone().sub(pos);
        const m = d.length();
        if (m < 0.1) return new THREE.Vector3();
        return d.normalize().multiplyScalar(k * charge / (m * m));
    };
    return field(point, posCharge, q).add(field(point, negCharge, -q));
}, [posCharge, negCharge, q]);

const computeV = useCallback((point: THREE.Vector3): number => {
    const r1 = point.clone().sub(posCharge).length();
    const r2 = point.clone().sub(negCharge).length();
    if (r1 < 0.05 || r2 < 0.05) return 0;
    return k * q / r1 - k * q / r2;
}, [posCharge, negCharge, q]);

const pVec = useMemo(() => new THREE.Vector3(
    Math.cos(vizAngle), 0, Math.sin(vizAngle)
).multiplyScalar(q * sep), [vizAngle, sep, q]);

const E_total = useMemo(() => computeE(testParticle), [testParticle, computeE]);

const fieldLines = useMemo(() => {
    if (!showLines) return null;
    const lines: JSX.Element[] = [];
    for (let i = 0; i < 12; i++) {
        const theta = (i / 12) * 2 * Math.PI;
        let cur = new THREE.Vector3(
            posCharge.x + 0.3 * Math.cos(theta),
            posCharge.y,
            posCharge.z + 0.3 * Math.sin(theta)
        );
        const pts: THREE.Vector3[] = [cur.clone()];
        for (let j = 0; j < 200; j++) {
            const E = computeE(cur);
            if (E.length() < 1e-6) break;
            cur = cur.clone().add(E.normalize().multiplyScalar(0.05));
            pts.push(cur.clone());
            if (cur.distanceTo(negCharge) < 0.2) break;
            if (cur.length() > 10) break;
        }
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        const mat = new THREE.LineBasicMaterial({ color: 'white', opacity: 0.55, transparent: true });
        lines.push(<primitive key={i} object={new THREE.Line(geo, mat)} />);
    }
    return lines;
}, [posCharge, negCharge, computeE, showLines]);

const potentialMap = useMemo(() => {
    if (!showPotential) return null;
    const step = 0.4;
    const raw: { x: number; z: number; V: number }[] = [];
    let Vmax = 1e-10;
    for (let x = -3; x <= 3; x += step) {
        for (let z = -3; z <= 3; z += step) {
            const V = computeV(new THREE.Vector3(x, 0, z));
            raw.push({ x, z, V });
            if (Math.abs(V) > Vmax) Vmax = Math.abs(V);
        }
    }
    return raw.map(({ x, z, V }, i) => {
        const opacity = Math.min(Math.abs(V) / Vmax, 1) * 0.85;
        return (
            <mesh key={i} position={[x, 0, z]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[step * 0.9, step * 0.9]} />
                <meshBasicMaterial
                    color={V > 0 ? 'red' : 'blue'}
                    transparent opacity={opacity} depthWrite={false}
                />
            </mesh>
        );
    });
}, [posCharge, negCharge, computeV, showPotential]);

const uniformEArrows = useMemo(() => {
    if (!showUniformE) return null;
    const positions: [number, number, number][] = [
        [-3, -1, -3], [-3, -1, 0], [-3, -1, 3],
        [ 0, -1, -3],              [ 0, -1,  3],
        [ 3, -1, -3], [ 3, -1, 0], [ 3, -1, 3],
    ];
    return positions.map((pos, i) => (
        <VectorArrow key={`ue-${i}`} vector={[0, 1, 0]} origin={pos} color="yellow" />
    ));
}, [showUniformE]);

return (
    <>
        <mesh ref={posRef}>
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshStandardMaterial color="red" />
        </mesh>
        <mesh ref={negRef}>
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshStandardMaterial color="blue" />
        </mesh>

        {showDipoleVector && (
            <VectorArrow
                vector={pVec.toArray() as [number, number, number]}
                origin={negCharge.toArray() as [number, number, number]}
                color="purple"
            />
        )}
        {showField && (
            <VectorArrow
                vector={E_total.toArray() as [number, number, number]}
                origin={testParticle.toArray() as [number, number, number]}
                color="orange"
            />
        )}

        {fieldLines}
        {potentialMap}
        {uniformEArrows}

        <mesh position={testParticle.toArray()}>
            <sphereGeometry args={[0.1, 32, 32]} />
            <meshStandardMaterial color="green" />
        </mesh>
        <Html position={[testParticle.x, testParticle.y + 0.3, testParticle.z]}>
            <div style={{ color: 'green', fontSize: 12 }}>P</div>
        </Html>
    </>
);


}

// ─── Main component ───────────────────────────────────────────────────────────
function ElectricDipoleVisualizer() {


// UI state
const [angle,        setAngle]        = useState(0.8);
const [sep,          setSep]          = useState(2);
const [qExp,         setQExp]         = useState(-9);    // q = 10^qExp C
const [eMagVal,      setEMagVal]      = useState(5);     // E = 10^eMagVal V/m
const [testX,        setTestX]        = useState(0);
const [testY,        setTestY]        = useState(2);
const [testZ,        setTestZ]        = useState(0);
const [showField,        setShowField]        = useState(true);
const [showDipoleVector, setShowDipoleVector] = useState(true);
const [showLines,        setShowLines]        = useState(true);
const [showPotential,    setShowPotential]    = useState(true);
const [showUniformE,     setShowUniformE]     = useState(false);
const [displayOmega,     setDisplayOmega]     = useState(0);

// Derived physical values
const q    = Math.pow(10, qExp);
const eMag = Math.pow(10, eMagVal);

// Physics ref bag — mutated every frame, never triggers re-render
const phys = useRef<PhysicsState>({
    running: false,
    angle:   0.8,
    omega:   0,
    sep:     2,
    q,
    eMag:    0,
    iRot:    getIRot(q, 2, eMag, 0.8),
});

// Keep phys in sync with UI sliders
useEffect(() => { phys.current.sep = sep; }, [sep]);
useEffect(() => {
    phys.current.q = q;
    // Recompute iRot whenever q changes so speed stays visually consistent
    phys.current.iRot = getIRot(phys.current.q, phys.current.sep, phys.current.eMag || eMag, phys.current.angle || 0.8);
}, [q]);
useEffect(() => {
    if (phys.current.running) {
        phys.current.eMag = eMag;
        phys.current.iRot = getIRot(phys.current.q, phys.current.sep, eMag, phys.current.angle || 0.8);
    }
}, [eMag]);

// onTick — reassigned each render so setters stay fresh
const onTickRef = useRef<(a: number, w: number) => void>(() => {});
onTickRef.current = (a: number, w: number) => {
    setAngle(a);
    setDisplayOmega(w);
};
const onTick = useCallback((a: number, w: number) => onTickRef.current(a, w), []);

// Toggle Uniform E field — starts / stops physics immediately
const handleToggleUniformE = useCallback(() => {
    setShowUniformE(prev => {
        const next = !prev;
        if (next) {
            // Turning ON: set eMag, recompute iRot, start running
            phys.current.eMag    = eMag;
            phys.current.iRot    = getIRot(phys.current.q, phys.current.sep, eMag, phys.current.angle || 0.8);
            phys.current.omega   = 0;
            phys.current.running = true;
        } else {
            // Turning OFF: zero eMag and omega immediately so dipole freezes
            phys.current.eMag    = 0;
            phys.current.omega   = 0;
            phys.current.running = false;
        }
        return next;
    });
}, [eMag]);

// Initial angle slider (only usable when field is off)
const handleAngleSlider = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    phys.current.angle = val;
    phys.current.omega = 0;
    setAngle(val);
}, []);

const handleSepSlider = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    phys.current.sep = val;
    setSep(val);
}, []);

const handleQSlider = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQExp(Number(e.target.value));
}, []);

const handleESlider = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setEMagVal(val);
    if (phys.current.running) {
        const newE = Math.pow(10, val);
        phys.current.eMag = newE;
        phys.current.iRot = getIRot(phys.current.q, phys.current.sep, newE, phys.current.angle || 0.8);
    }
}, []);

const testParticle = useMemo(
    () => new THREE.Vector3(testX, testY, testZ),
    [testX, testY, testZ]
);

// Readout quantities (derived from throttled angle state ~10 Hz)
const posCharge = useMemo(() => new THREE.Vector3(
    Math.cos(angle) * sep / 2, 0, Math.sin(angle) * sep / 2
), [angle, sep]);
const negCharge = useMemo(() => new THREE.Vector3(
    -Math.cos(angle) * sep / 2, 0, -Math.sin(angle) * sep / 2
), [angle, sep]);

const computeE = useCallback((point: THREE.Vector3): THREE.Vector3 => {
    const field = (r: THREE.Vector3, pos: THREE.Vector3, charge: number) => {
        const d = r.clone().sub(pos);
        const m = d.length();
        if (m < 0.1) return new THREE.Vector3();
        return d.normalize().multiplyScalar(k * charge / (m * m));
    };
    return field(point, posCharge, q).add(field(point, negCharge, -q));
}, [posCharge, negCharge, q]);

const computeV = useCallback((point: THREE.Vector3): number => {
    const r1 = point.clone().sub(posCharge).length();
    const r2 = point.clone().sub(negCharge).length();
    if (r1 < 0.05 || r2 < 0.05) return 0;
    return k * q / r1 - k * q / r2;
}, [posCharge, negCharge, q]);

const pVec = useMemo(
    () => new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle)).multiplyScalar(q * sep),
    [angle, sep, q]
);
const uniformEVec = showUniformE ? new THREE.Vector3(0, eMag, 0) : new THREE.Vector3();
const torque      = new THREE.Vector3().crossVectors(pVec, uniformEVec);
const energy      = -pVec.dot(uniformEVec);
const E_total     = useMemo(() => computeE(testParticle), [testParticle, computeE]);
const V_probe     = useMemo(() => computeV(testParticle), [testParticle, computeV]);

const thetaDeg  = ((angle * 180 / Math.PI) % 360 + 360) % 360;
const sliderVal = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

return (
    <div className="flex flex-col items-center gap-4 p-4">

        {/* ── Controls ── */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">

            {/* Separation */}
            <div>
                <label className="block text-sm mb-1">Separation: {sep.toFixed(1)} m</label>
                <input type="range" min="0.5" max="4" step="0.1"
                    value={sep} onChange={handleSepSlider} className="w-full" />
            </div>

            {/* Initial angle — disabled while field is on */}
            <div>
                <label className="block text-sm mb-1">
                    Initial θ: {thetaDeg.toFixed(1)}°
                    {showUniformE && (
                        <span className="ml-2 text-xs text-yellow-400">⚙ physics running</span>
                    )}
                </label>
                <input type="range" min="0.01" max="6.27" step="0.01"
                    value={sliderVal}
                    disabled={showUniformE}
                    onChange={handleAngleSlider}
                    className="w-full"
                    style={{ opacity: showUniformE ? 0.4 : 1 }}
                />
            </div>

            {/* Charge magnitude (log scale) */}
            <div>
                <label className="block text-sm mb-1">
                    Charge q = 10<sup>{qExp}</sup> C &nbsp;
                    <span className="text-gray-400">({q.toExponential(1)})</span>
                </label>
                <input type="range" min="-12" max="-6" step="1"
                    value={qExp} onChange={handleQSlider} className="w-full" />
            </div>

            {/* E field magnitude (log scale) — only editable when field is off */}
            <div>
                <label className="block text-sm mb-1">
                    E field = 10<sup>{eMagVal}</sup> V/m &nbsp;
                    <span className="text-gray-400">({eMag.toExponential(1)})</span>
                </label>
                <input type="range" min="3" max="8" step="0.5"
                    value={eMagVal} onChange={handleESlider} className="w-full" />
            </div>

            {/* Test probe */}
            <div>
                <label className="block text-sm mb-1">Test X</label>
                <input type="number" value={testX}
                    onChange={e => setTestX(Number(e.target.value))}
                    className="border px-2 py-1 w-full" />
            </div>
            <div>
                <label className="block text-sm mb-1">Test Y</label>
                <input type="number" value={testY}
                    onChange={e => setTestY(Number(e.target.value))}
                    className="border px-2 py-1 w-full" />
            </div>
            <div>
                <label className="block text-sm mb-1">Test Z</label>
                <input type="number" value={testZ}
                    onChange={e => setTestZ(Number(e.target.value))}
                    className="border px-2 py-1 w-full" />
            </div>

            {/* Toggles */}
            <div className="col-span-2 grid grid-cols-3 gap-3">
                <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={showField}
                        onChange={() => setShowField(v => !v)} />
                    Field at probe
                </label>
                <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={showDipoleVector}
                        onChange={() => setShowDipoleVector(v => !v)} />
                    Dipole vector
                </label>
                <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={showLines}
                        onChange={() => setShowLines(v => !v)} />
                    Field lines
                </label>
                <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={showPotential}
                        onChange={() => setShowPotential(v => !v)} />
                    Potential map
                </label>
                {/* Single toggle — controls both field visibility AND physics */}
                <label className="flex items-center gap-2 text-sm font-semibold text-yellow-300">
                    <input type="checkbox" checked={showUniformE}
                        onChange={handleToggleUniformE} />
                    Uniform E field
                </label>
            </div>

            {!showUniformE && (
                <p className="col-span-2 text-xs text-gray-400">
                    ⚡ Enable <strong>Uniform E field</strong> to apply torque τ = p × E.
                    Set initial θ above first, then toggle the field.
                </p>
            )}
        </div>

        {/* ── Physics readout ── */}
        <div className="grid grid-cols-2 gap-2 w-full max-w-2xl text-sm font-mono text-green-400 p-3 rounded bg-black/20">
            <div>
                <span className="text-gray-400">E at probe</span><br />
                ({E_total.x.toExponential(2)}, {E_total.y.toExponential(2)}, {E_total.z.toExponential(2)}) V/m
            </div>
            <div>
                <span className="text-gray-400">V at probe</span><br />
                {V_probe.toExponential(2)} V
            </div>
            <div>
                <span className="text-gray-400">Torque τ = p × E_ext</span><br />
                ({torque.x.toExponential(2)}, {torque.y.toExponential(2)}, {torque.z.toExponential(2)}) N·m
            </div>
            <div>
                <span className="text-gray-400">Energy U = −p · E_ext</span><br />
                {energy.toExponential(2)} J
            </div>
            <div>
                <span className="text-gray-400">E_ext</span><br />
                {showUniformE ? `(0, ${eMag.toExponential(1)} V/m, 0)` : 'OFF'}
            </div>
            <div>
                <span className="text-gray-400">ω (angular vel.)</span><br />
                {displayOmega.toFixed(4)} rad/s
            </div>
            <div>
                <span className="text-gray-400">|p| dipole moment</span><br />
                {(q * sep).toExponential(2)} C·m
            </div>
            <div>
                <span className="text-gray-400">θ current</span><br />
                {thetaDeg.toFixed(2)}°
            </div>
        </div>

        {/* ── Canvas ── */}
        <div className="border-2 border-blue-500 rounded" style={{ height: 500, width: 800 }}>
            <Canvas camera={{ position: [4, 4, 6] }}>
                <ambientLight intensity={0.6} />
                <pointLight position={[10, 10, 10]} />
                <OrbitControls />
                <Axes length={20} width={2} />
                <DipoleScene
                    phys={phys}
                    onTick={onTick}
                    showDipoleVector={showDipoleVector}
                    showField={showField}
                    showLines={showLines}
                    showPotential={showPotential}
                    showUniformE={showUniformE}
                    testParticle={testParticle}
                    q={q}
                />
            </Canvas>
        </div>
    </div>
);


}

export default ElectricDipoleVisualizer;

/*

| Concept        | Formula                      |
| -------------- | ---------------------------- |
| Electric field | (E = kq/r^2)                 |
| Potential      | (V = kq/r)                   |
| Dipole moment  | (p = qd)                     |
| Torque         | τ=p×E         |
| Angular motion | τ=Iα            | α=−pEsinθ / I
	​

| Energy         | (U = -p . E)             |
| 
*/