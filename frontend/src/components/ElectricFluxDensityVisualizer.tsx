import { useState, useMemo, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import VectorArrow from "./VectorArrow";
import Axes from "./Axes";

const epsilon0 = 8.854e-12;
const k = 1 / (4 * Math.PI * epsilon0);

// ---------- FORMAT ----------
function formatScientific(num: number, digits: number = 3) {
  if (num === 0) return { mantissa: "0", exponent: 0 };
  const exponent = Math.floor(Math.log10(Math.abs(num)));
  const mantissa = num / Math.pow(10, exponent);
  return { mantissa: mantissa.toFixed(digits), exponent };
}

// ---------- CONVERSIONS ----------
function sphericalToCartesian(r: number, theta: number, phi: number): [number, number, number] {
  return [
    r * Math.sin(theta) * Math.cos(phi),
    r * Math.sin(theta) * Math.sin(phi),
    r * Math.cos(theta),
  ] as [number, number, number];
}

function cylindricalToCartesian(rho: number, phi: number, z: number): [number, number, number] {
  return [
    rho * Math.cos(phi),
    rho * Math.sin(phi),
    z,
  ] as [number, number, number];
}

// ---------- FIELD COMPUTATION ----------
// ONLY showing changed parts — rest of your code stays SAME

// ---------- FIX 1: computeE (IMPORTANT PHYSICS FIX) ----------
function computeE(
  px: number,
  py: number,
  pz: number,
  chargeType: string,
  chargePos: [number, number, number],
  chargeValue: number
): [number, number, number] {

  if (chargeType === "point") {
    const dx = px - chargePos[0];
    const dy = py - chargePos[1];
    const dz = pz - chargePos[2];
    const r = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (r < 1e-6) return [0, 0, 0];
    const mag = (k * chargeValue) / (r * r * r);
    return [dx * mag, dy * mag, dz * mag];
  }

  if (chargeType === "line") {
    // ✅ FIXED: relative position
    const dx = px - chargePos[0];
    const dy = py - chargePos[1];
    const rho = Math.sqrt(dx * dx + dy * dy);
    if (rho < 1e-6) return [0, 0, 0];

    const mag = chargeValue / (2 * Math.PI * epsilon0 * rho * rho);
    return [dx * mag, dy * mag, 0];
  }

  // ✅ FIXED: sheet relative to position
  const dz = pz - chargePos[2];
  const dir = dz >= 0 ? 1 : -1;
  return [0, 0, dir * chargeValue / (2 * epsilon0)];
}

type FieldVector = {
  origin: [number, number, number];
  E: [number, number, number];
  D: [number, number, number];
};

// ---------- COMPONENT ----------
export default function ElectricFluxDensityVisualizer() {

  const [chargeType, setChargeType] = useState<string>("point");
  const [coordSystem, setCoordSystem] = useState<string>("spherical");
  const [autoCoord, setAutoCoord] = useState<boolean>(true);
  const [probePoint, setProbePoint] = useState<[number, number, number]>([0,0,0]);

  const axisLabels: [string, string, string] =
    coordSystem === "cartesian"
      ? ["X", "Y", "Z"]
      : coordSystem === "cylindrical"
      ? ["ρ", "φ", "Z"]
      : ["r", "θ", "φ"];

  // Controlled string inputs so fields never reset on re-render
  const [rawInput, setRawInput] = useState<[string, string, string]>(["0", "0", "0"]);
  const [chargePos, setChargePos] = useState<[number, number, number]>([0, 0, 0]);
  const [chargeValue, setChargeValue] = useState<number>(1e-9);
  const [surfaceSize, setSurfaceSize] = useState<number>(1.5);

  // ---------- AUTO COORD ----------
  useEffect(() => {
    if (!autoCoord) return;
    if (chargeType === "point") setCoordSystem("spherical");
    else if (chargeType === "line") setCoordSystem("cylindrical");
    else setCoordSystem("cartesian");
  }, [chargeType, autoCoord]);

  // ---------- UPDATE POSITION ----------
  useEffect(() => {
    const [a, b, c] = rawInput.map(Number);
    let pos: [number, number, number];
    if (coordSystem === "cartesian") pos = [a, b, c];
    else if (coordSystem === "cylindrical") pos = cylindricalToCartesian(a, b, c);
    else pos = sphericalToCartesian(a, b, c);
if (chargeType === "point") {
  setChargePos(pos);     // move only point charge
} else {
  setProbePoint(pos);    // move probe instead
}
  }, [rawInput, coordSystem]);

  // Reset inputs when coord system is manually changed
  const handleCoordSystemChange = (sys: string) => {
    setCoordSystem(sys);
    setRawInput(["0", "0", "0"]);
  };

  // ---------- E 
const evalPoint = chargeType === "point" ? chargePos : probePoint;

const [Ex, Ey, Ez] = computeE(
  evalPoint[0],
  evalPoint[1],
  evalPoint[2],
  chargeType,
  chargePos,
  chargeValue
);
  // ---------- GRID VECTORS (XZ plane) ----------
  const gridVectors = useMemo<FieldVector[]>(() => {
    const arr: FieldVector[] = [];
    const div = 4;

    for (let i = -div; i <= div; i++) {
      for (let j = -div; j <= div; j++) {
        const px = (i / div) * 2;
        const py = 0;
        const pz = (j / div) * 2;

        const [ex, ey, ez] = computeE(px, py, pz, chargeType, chargePos, chargeValue);
        const mag = Math.sqrt(ex * ex + ey * ey + ez * ez);
        if (mag < 1e-6) continue;

        // Normalize + log scale so distant arrows are still visible
        const scale = Math.log1p(mag) * 0.3;
        const Evec: [number, number, number] = [
          (ex / mag) * scale,
          (ey / mag) * scale,
          (ez / mag) * scale,
        ];
        const Dvec: [number, number, number] = [
          Evec[0] * epsilon0,
          Evec[1] * epsilon0,
          Evec[2] * epsilon0,
        ];

        arr.push({
          origin: [px, py, pz] as [number, number, number],
          E: Evec,
          D: Dvec,
        });
      }
    }
    return arr;
  }, [chargePos, chargeValue, chargeType]);

  const fEx = formatScientific(Ex);
  const fEy = formatScientific(Ey);
  const fEz = formatScientific(Ez);

  const labelA =
    coordSystem === "cartesian"
      ? ["x", "y", "z"]
      : coordSystem === "cylindrical"
      ? ["ρ", "φ (rad)", "z"]
      : ["r", "θ (rad)", "φ (rad)"];

  // ---------- UI ----------
  return (
    <div className="flex flex-col items-center gap-4 p-4">

      {/* ── CONTROLS ── */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-xl">

        {/* Charge type */}
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold">Charge Type</h2>
          <select
            value={chargeType}
            onChange={(e) => setChargeType(e.target.value)}
            className="border rounded p-1"
          >
            <option value="point">Point Charge</option>
            <option value="line">Infinite Line Charge</option>
            <option value="sheet">Infinite Sheet Charge</option>
          </select>
        </div>

        {/* Coord system */}
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold">Coordinate System</h2>
          <label className="text-sm">
            <input
              type="checkbox"
              checked={autoCoord}
              onChange={(e) => setAutoCoord(e.target.checked)}
              className="mr-1"
            />
            Auto-select
          </label>
          <select
            value={coordSystem}
            disabled={autoCoord}
            onChange={(e) => handleCoordSystemChange(e.target.value)}
            className="border rounded p-1"
          >
            <option value="cartesian">Cartesian (x, y, z)</option>
            <option value="cylindrical">Cylindrical (ρ, φ, z)</option>
            <option value="spherical">Spherical (r, θ, φ)</option>
          </select>
        </div>

        {/* Charge value */}
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold">
            Charge Density (
            {chargeType === "point" ? "C" : chargeType === "line" ? "C/m" : "C/m²"})
          </h2>
          <input
            type="number"
            value={chargeValue}
            step={1e-10}
            onChange={(e) => setChargeValue(parseFloat(e.target.value))}
            className="border rounded p-1"
          />
        </div>

        {/* Surface size */}
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold">Gaussian Surface Size</h2>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={surfaceSize}
            onChange={(e) => setSurfaceSize(parseFloat(e.target.value))}
          />
          <span className="text-sm">{surfaceSize} units</span>
        </div>

        {/* Position inputs — always controlled */}
        <div className="flex flex-col gap-1 col-span-2">
          <h2 className="font-semibold">
            {chargeType === "point" ? "Charge Position" : "Reference Point"} ({coordSystem})
          </h2>
          <div className="flex gap-2">
            {([0, 1, 2] as const).map((idx) => (
              <label key={idx} className="flex flex-col text-sm flex-1">
                {labelA[idx]}
                <input
                  type="number"
                  value={rawInput[idx]}
                  step={0.1}
                  onChange={(e) => {
                    const next: [string, string, string] = [...rawInput] as [string, string, string];
                    next[idx] = e.target.value;
                    setRawInput(next);
                  }}
                  className="border rounded p-1 w-full"
                />
              </label>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Cartesian: ({chargePos.map((v) => v.toFixed(2)).join(", ")})
          </p>
        </div>
      </div>

      {/* ── FIELD RESULT ── */}
      <div className="font-mono text-sm bg-gray-100 rounded p-2 w-full max-w-xl">
        <p>
          E at origin = ({fEx.mantissa}×10<sup>{fEx.exponent}</sup>,&nbsp;
          {fEy.mantissa}×10<sup>{fEy.exponent}</sup>,&nbsp;
          {fEz.mantissa}×10<sup>{fEz.exponent}</sup>) V/m
        </p>
        <p>
          D = ε₀·E = (
          {formatScientific(Ex * epsilon0).mantissa}×10
          <sup>{formatScientific(Ex * epsilon0).exponent}</sup>,&nbsp;
          {formatScientific(Ey * epsilon0).mantissa}×10
          <sup>{formatScientific(Ey * epsilon0).exponent}</sup>,&nbsp;
          {formatScientific(Ez * epsilon0).mantissa}×10
          <sup>{formatScientific(Ez * epsilon0).exponent}</sup>) C/m²
        </p>
      </div>

      {/* ── CANVAS ── */}
      <Canvas style={{ height: 500, width: 800 }} camera={{ position: [4, 3, 4] }}>
        <OrbitControls />
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} />

        <Axes
  labels={axisLabels}
  length={10}
  width={2}
  fontPosition={4}
  interval={1}
/>

        {/* ── Gaussian surface ── */}

        {chargeType === "point" && (
          <>
            {/* Semi-transparent fill */}
            <mesh position={chargePos as [number, number, number]}>
              <sphereGeometry args={[surfaceSize, 32, 32]} />
              <meshStandardMaterial
                color="green"
                transparent
                opacity={0.08}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* Wireframe overlay */}
            <mesh position={chargePos as [number, number, number]}>
              <sphereGeometry args={[surfaceSize, 16, 16]} />
              <meshStandardMaterial color="lime" wireframe />
            </mesh>
          </>
        )}

        {chargeType === "line" && (
  <>
    {/* Line charge */}
    <mesh position={chargePos}>
      <cylinderGeometry args={[0.05, 0.05, 6, 8]} />
      <meshStandardMaterial color="orange" />
    </mesh>

    {/* Gaussian cylinder */}
    <mesh position={chargePos}>
      <cylinderGeometry args={[surfaceSize, surfaceSize, 4, 32, 1, true]} />
      <meshStandardMaterial color="green" transparent opacity={0.08} />
    </mesh>

    <mesh position={chargePos}>
      <cylinderGeometry args={[surfaceSize, surfaceSize, 4, 24]} />
      <meshStandardMaterial color="lime" wireframe />
    </mesh>
  </>
)}

      {chargeType === "sheet" && (
  <>
    <mesh position={chargePos}>
      <planeGeometry args={[6, 6]} />
      <meshStandardMaterial
        color="orange"
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>

    <mesh position={chargePos}>
      <boxGeometry args={[surfaceSize, surfaceSize, 0.5]} />
      <meshStandardMaterial
        color="green"
        transparent
        opacity={0.08}
      />
    </mesh>

    <mesh position={chargePos}>
      <boxGeometry args={[surfaceSize, surfaceSize, 0.5]} />
      <meshStandardMaterial color="lime" wireframe />
    </mesh>
  </>
)}

        {/* ── Charge marker — point charge only ── */}
        {chargeType === "point" && (
          <mesh position={chargePos as [number, number, number]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial
              color={chargeValue >= 0 ? "red" : "blue"}
              emissive={chargeValue >= 0 ? "red" : "blue"}
              emissiveIntensity={0.5}
            />
          </mesh>
        )}

        {/* ── Field vectors ── */}
        {gridVectors.map((v, i) => (
          <VectorArrow key={i} vector={v.E} color="royalblue" origin={v.origin} />
        ))}

      </Canvas>
    </div>
  );
}