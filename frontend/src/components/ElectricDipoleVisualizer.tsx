import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import VectorArrow from './VectorArrow';
import Axes from './Axes';

// ─── Constants ────────────────────────────────────────────────────────────────
const k = 9e9;

// Visual scaling factor for dipole pendulum inertia
const getIRot = (q: number, sep: number, eMag: number) => {
  const raw = q * sep * (eMag > 0 ? eMag : 1);
  return raw <= 0 ? 1 : raw;
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
  phys,
  onTick,
  showDipoleVector,
  showField,
  showLines,
  showPotential,
  showUniformE,
  testParticle,
  q,
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
      // τ = −p·E·sin(θ) around Y-axis, α = τ / I_ROT
      const alpha = -(p.q * p.sep * p.eMag * Math.sin(p.angle)) / p.iRot;
      p.omega += alpha * dt;
      p.angle += p.omega * dt;
    }

    // Move meshes imperatively
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

  const E_total = useMemo(() => computeE(testParticle), [testParticle, computeE]);

  const visualE = useMemo(() => {
    const len = E_total.length();
    if (len < 1e-4) return [0, 0, 0] as [number, number, number];
    const displayLen = Math.min(Math.max(Math.log10(len + 1) * 0.5, 0.4), 2.2);
    const dir = E_total.clone().normalize().multiplyScalar(displayLen);
    return [dir.x, dir.y, dir.z] as [number, number, number];
  }, [E_total]);

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
      const mat = new THREE.LineBasicMaterial({ color: '#38bdf8', opacity: 0.65, transparent: true });
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
            color={V > 0 ? '#ef4444' : '#3b82f6'}
            transparent opacity={opacity} depthWrite={false}
          />
        </mesh>
      );
    });
  }, [computeV, showPotential]);

  const uniformEArrows = useMemo(() => {
    if (!showUniformE) return null;
    const positions: [number, number, number][] = [
      [-3, 0, -3], [-3, 0, -1.5], [-3, 0, 0], [-3, 0, 1.5], [-3, 0, 3],
      [ 0, 0, -3], [ 0, 0, -1.5], [ 0, 0, 0], [ 0, 0, 1.5], [ 0, 0, 3],
      [ 3, 0, -3], [ 3, 0, -1.5], [ 3, 0, 0], [ 3, 0, 1.5], [ 3, 0, 3],
    ];
    return positions.map((pos, i) => (
      <VectorArrow key={`ue-${i}`} vector={[1.5, 0, 0]} origin={pos} color="#eab308" />
    ));
  }, [showUniformE]);

  return (
    <>
      <mesh ref={posRef} position={[posCharge.x, posCharge.y, posCharge.z]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      <mesh ref={negRef} position={[negCharge.x, negCharge.y, negCharge.z]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>

      {showDipoleVector && (
        <VectorArrow
          vector={[posCharge.x - negCharge.x, posCharge.y - negCharge.y, posCharge.z - negCharge.z]}
          origin={[negCharge.x, negCharge.y, negCharge.z]}
          color="#a855f7"
          label="p"
        />
      )}
      {showField && (
        <VectorArrow
          vector={visualE}
          origin={[testParticle.x, testParticle.y, testParticle.z]}
          color="#f97316"
          label="E"
        />
      )}

      {fieldLines}
      {potentialMap}
      {uniformEArrows}

      <mesh position={[testParticle.x, testParticle.y, testParticle.z]}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>
      <Html position={[testParticle.x, testParticle.y + 0.3, testParticle.z]}>
        <div style={{ color: '#16a34a', fontSize: 13, fontWeight: '700' }}>P</div>
      </Html>
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
function ElectricDipoleVisualizer() {
  // UI state
  const [angle,            setAngle]            = useState(0.8);
  const [sep,              setSep]              = useState(2);
  const [qExp,             setQExp]             = useState(-9);    // q = 10^qExp C
  const [eMagVal,          setEMagVal]          = useState(5);     // E = 10^eMagVal V/m
  const [testX,            setTestX]            = useState(0);
  const [testY,            setTestY]            = useState(2);
  const [testZ,            setTestZ]            = useState(0);
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
    iRot:    getIRot(q, 2, eMag),
  });

  // Keep phys in sync with UI sliders
  useEffect(() => { phys.current.sep = sep; }, [sep]);
  useEffect(() => {
    phys.current.q = q;
    phys.current.iRot = getIRot(phys.current.q, phys.current.sep, phys.current.eMag || eMag);
  }, [q, eMag]);
  useEffect(() => {
    if (phys.current.running) {
      phys.current.eMag = eMag;
      phys.current.iRot = getIRot(phys.current.q, phys.current.sep, eMag);
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
        phys.current.iRot    = getIRot(phys.current.q, phys.current.sep, eMag);
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
      phys.current.iRot = getIRot(phys.current.q, phys.current.sep, newE);
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
  // External E-field along +X axis in the XZ plane of oscillation
  const uniformEVec = showUniformE ? new THREE.Vector3(eMag, 0, 0) : new THREE.Vector3();
  const torque      = new THREE.Vector3().crossVectors(pVec, uniformEVec);
  const energy      = -pVec.dot(uniformEVec);
  const E_total     = useMemo(() => computeE(testParticle), [testParticle, computeE]);
  const V_probe     = useMemo(() => computeV(testParticle), [testParticle, computeV]);

  const thetaDeg  = ((angle * 180 / Math.PI) % 360 + 360) % 360;
  const sliderVal = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

  return (
    <div className="flex flex-col items-center gap-4 p-4">

      {/* ── Controls ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl bg-white p-4 rounded-xl shadow-sm border border-gray-200">

        {/* Separation */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Separation: {sep.toFixed(1)} m</label>
          <input type="range" min="0.5" max="4" step="0.1"
            value={sep} onChange={handleSepSlider} className="w-full accent-blue-600" />
        </div>

        {/* Initial angle — disabled while field is on */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            Initial θ: {thetaDeg.toFixed(1)}°
            {showUniformE && (
              <span className="ml-2 text-xs text-amber-600 font-bold">⚙ physics running</span>
            )}
          </label>
          <input type="range" min="0.01" max="6.27" step="0.01"
            value={sliderVal}
            disabled={showUniformE}
            onChange={handleAngleSlider}
            className="w-full accent-blue-600"
            style={{ opacity: showUniformE ? 0.4 : 1 }}
          />
        </div>

        {/* Charge magnitude (log scale) */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            Charge q = 10<sup>{qExp}</sup> C &nbsp;
            <span className="text-gray-500 font-normal">({q.toExponential(1)})</span>
          </label>
          <input type="range" min="-12" max="-6" step="1"
            value={qExp} onChange={handleQSlider} className="w-full accent-blue-600" />
        </div>

        {/* E field magnitude (log scale) */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            E field = 10<sup>{eMagVal}</sup> V/m &nbsp;
            <span className="text-gray-500 font-normal">({eMag.toExponential(1)})</span>
          </label>
          <input type="range" min="3" max="8" step="0.5"
            value={eMagVal} onChange={handleESlider} className="w-full accent-blue-600" />
        </div>

        {/* Test probe */}
        <div className="col-span-1 md:col-span-2 grid grid-cols-3 gap-2">
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-700">Test X (m)</label>
            <input type="number" value={testX}
              onChange={e => setTestX(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 w-full text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-700">Test Y (m)</label>
            <input type="number" value={testY}
              onChange={e => setTestY(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 w-full text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-700">Test Z (m)</label>
            <input type="number" value={testZ}
              onChange={e => setTestZ(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 w-full text-sm" />
          </div>
        </div>

        {/* Toggles */}
        <div className="col-span-1 md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={showField}
              onChange={() => setShowField(v => !v)} className="rounded text-blue-600" />
            Field at probe
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={showDipoleVector}
              onChange={() => setShowDipoleVector(v => !v)} className="rounded text-blue-600" />
            Dipole vector
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={showLines}
              onChange={() => setShowLines(v => !v)} className="rounded text-blue-600" />
            Field lines
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={showPotential}
              onChange={() => setShowPotential(v => !v)} className="rounded text-blue-600" />
            Potential map
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-amber-700">
            <input type="checkbox" checked={showUniformE}
              onChange={handleToggleUniformE} className="rounded text-amber-600" />
            Uniform E field (X-axis)
          </label>
        </div>

        {!showUniformE && (
          <p className="col-span-1 md:col-span-2 text-xs text-gray-500">
            ⚡ Enable <strong>Uniform E field</strong> to apply torque τ = p × E.
            Set initial θ above first, then toggle the field.
          </p>
        )}
      </div>

      {/* ── Physics readout ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-2xl text-xs font-mono bg-slate-900 text-emerald-400 p-4 rounded-xl shadow-sm border border-slate-800">
        <div>
          <span className="text-slate-400 text-[11px] block">E at probe</span>
          ({E_total.x.toExponential(2)}, {E_total.y.toExponential(2)}, {E_total.z.toExponential(2)}) V/m
        </div>
        <div>
          <span className="text-slate-400 text-[11px] block">V at probe</span>
          {V_probe.toExponential(2)} V
        </div>
        <div>
          <span className="text-slate-400 text-[11px] block">Torque τ = p × E_ext</span>
          ({torque.x.toExponential(2)}, {torque.y.toExponential(2)}, {torque.z.toExponential(2)}) N·m
        </div>
        <div>
          <span className="text-slate-400 text-[11px] block">Energy U = −p · E_ext</span>
          {energy.toExponential(2)} J
        </div>
        <div>
          <span className="text-slate-400 text-[11px] block">E_ext</span>
          {showUniformE ? `(${eMag.toExponential(1)} V/m, 0, 0)` : 'OFF'}
        </div>
        <div>
          <span className="text-slate-400 text-[11px] block">ω (angular vel.)</span>
          {displayOmega.toFixed(4)} rad/s
        </div>
        <div>
          <span className="text-slate-400 text-[11px] block">|p| dipole moment</span>
          {(q * sep).toExponential(2)} C·m
        </div>
        <div>
          <span className="text-slate-400 text-[11px] block">θ current</span>
          {thetaDeg.toFixed(2)}°
        </div>
      </div>

      {/* ── Canvas ── */}
      <div className="relative overflow-hidden rounded-xl border-2 border-blue-600 bg-slate-950 w-full max-w-[800px] h-[500px]">
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

      <div className="flex justify-center items-center gap-8 py-3 w-full max-w-[800px] bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span>X-axis (+E ext)</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span>Y-axis (Torque axis)</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500"></span>
          <span>Z-axis</span>
        </div>
      </div>
    </div>
  );
}

export default ElectricDipoleVisualizer;