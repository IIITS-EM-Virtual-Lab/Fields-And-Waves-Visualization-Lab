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

function cartesianToSpherical(x: number, y: number, z: number): [number, number, number] {
  const r = Math.sqrt(x * x + y * y + z * z);
  if (r < 1e-10) return [0, 0, 0];
  const theta = Math.acos(z / r);
  const phi = Math.atan2(y, x);
  return [r, theta, phi] as [number, number, number];
}

function cartesianToCylindrical(x: number, y: number, z: number): [number, number, number] {
  const rho = Math.sqrt(x * x + y * y);
  const phi = Math.atan2(y, x);
  return [rho, phi, z] as [number, number, number];
}

// ---------- FIELD COMPUTATION ----------
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
    return [dx * mag, dy * mag, dz * mag] as [number, number, number];
  }

  if (chargeType === "line") {
    // Infinite line along Y axis (Three.js cylinder default = Y)
    // Radial direction is XZ plane
    const dx = px - chargePos[0];
    const dz = pz - chargePos[2];
    const rho = Math.sqrt(dx * dx + dz * dz);
    if (rho < 1e-6) return [0, 0, 0];
    const mag = chargeValue / (2 * Math.PI * epsilon0 * rho * rho);
    // Field points radially outward in XZ, no Y component
    return [dx * mag, 0, dz * mag] as [number, number, number];
  }

  // Sheet — infinite plane, field is ±Y
  const dy = py - chargePos[1];
  const dir = dy >= 0 ? 1 : -1;
  return [0, (dir * chargeValue) / (2 * epsilon0), 0] as [number, number, number];
}

type FieldVector = {
  origin: [number, number, number];
  E: [number, number, number];
  D: [number, number, number];
};

// ---------- SAMPLE POINT GENERATORS ----------
function getSpherePoints(
  chargePos: [number, number, number],
  radius: number,
  rings: number,
  perRing: number
): [number, number, number][] {
  const pts: [number, number, number][] = [];
  for (let i = 1; i <= rings; i++) {
    const theta = (i / (rings + 1)) * Math.PI;
    for (let j = 0; j < perRing; j++) {
      const phi = (j / perRing) * 2 * Math.PI;
      pts.push([
        chargePos[0] + radius * Math.sin(theta) * Math.cos(phi),
        chargePos[1] + radius * Math.sin(theta) * Math.sin(phi),
        chargePos[2] + radius * Math.cos(theta),
      ]);
    }
  }
  return pts;
}

// Line charge runs along Y axis (Three.js cylinder default).
// Sample points: rings in XZ plane at multiple Y heights.
// Arrows point radially outward in XZ — matches field computation above.
function getCylinderPoints(
  chargePos: [number, number, number],
  radius: number,
  phiSteps: number,
  ySteps: number
): [number, number, number][] {
  const pts: [number, number, number][] = [];
  const yRange = 1.5;

  for (let yi = 0; yi < ySteps; yi++) {
    // Y levels from chargePos[1]-yRange to chargePos[1]+yRange
    const y = chargePos[1] + ((yi / (ySteps - 1)) - 0.5) * 2 * yRange;

    for (let pi = 0; pi < phiSteps; pi++) {
      // phi sweeps around Y axis in the XZ plane
      const phi = (pi / phiSteps) * 2 * Math.PI;
      pts.push([
        chargePos[0] + radius * Math.cos(phi), // X
        y,                                      // Y — along the rod
        chargePos[2] + radius * Math.sin(phi), // Z
      ]);
    }
  }
  return pts;
}

// Sheet charge: plane at Y = chargePos[1].
// Sample points above and below in XZ grid.
function getSheetPoints(
  chargePos: [number, number, number],
  gridSteps: number,
  yOffset: number
): [number, number, number][] {
  const pts: [number, number, number][] = [];
  const range = 1.5;
  for (let i = 0; i < gridSteps; i++) {
    for (let j = 0; j < gridSteps; j++) {
      const x = chargePos[0] + (i / (gridSteps - 1) - 0.5) * 2 * range;
      const z = chargePos[2] + (j / (gridSteps - 1) - 0.5) * 2 * range;
      pts.push([x, chargePos[1] + yOffset, z]); // above
      pts.push([x, chargePos[1] - yOffset, z]); // below
    }
  }
  return pts;
}

// ---------- HELPERS ----------
function rawToCartesian(
  raw: [string, string, string],
  coordSystem: string
): [number, number, number] {
  const [a, b, c] = raw.map(Number);
  if (coordSystem === "cartesian")        return [a, b, c];
  else if (coordSystem === "cylindrical") return cylindricalToCartesian(a, b, c);
  else                                    return sphericalToCartesian(a, b, c);
}

function cartesianToRaw(
  pos: [number, number, number],
  coordSystem: string
): [string, string, string] {
  const [x, y, z] = pos;
  let converted: [number, number, number];
  if (coordSystem === "cartesian")        converted = [x, y, z];
  else if (coordSystem === "cylindrical") converted = cartesianToCylindrical(x, y, z);
  else                                    converted = cartesianToSpherical(x, y, z);
  return converted.map((v) => v.toFixed(3)) as [string, string, string];
}

// ---------- COMPONENT ----------
export default function ElectricFluxDensityVisualizer() {

  const [chargeType, setChargeType]   = useState<string>("point");
  const [coordSystem, setCoordSystem] = useState<string>("spherical");
  const [autoCoord, setAutoCoord]     = useState<boolean>(true);

  const [chargePos, setChargePos]   = useState<[number, number, number]>([0, 0, 0]);
  const [probePoint, setProbePoint] = useState<[number, number, number]>([1, 0, 0]);

  const [chargeRaw, setChargeRaw] = useState<[string, string, string]>(["0", "0", "0"]);
  const [probeRaw,  setProbeRaw]  = useState<[string, string, string]>(["1", "0", "0"]);

  const [chargeValue, setChargeValue] = useState<number>(1e-9);
  const [surfaceSize, setSurfaceSize] = useState<number>(1.5);

  // ---------- AUTO COORD ----------
  useEffect(() => {
    if (!autoCoord) return;
    if (chargeType === "point")     setCoordSystem("spherical");
    else if (chargeType === "line") setCoordSystem("cylindrical");
    else                            setCoordSystem("cartesian");
  }, [chargeType, autoCoord]);

  // ---------- COORD SYSTEM CHANGE ----------
  const handleCoordSystemChange = (sys: string) => {
    setCoordSystem(sys);
    setChargeRaw(cartesianToRaw(chargePos, sys));
    setProbeRaw(cartesianToRaw(probePoint, sys));
  };

  const handleChargeRawChange = (next: [string, string, string]) => {
    setChargeRaw(next);
    setChargePos(rawToCartesian(next, coordSystem));
  };

  const handleProbeRawChange = (next: [string, string, string]) => {
    setProbeRaw(next);
    setProbePoint(rawToCartesian(next, coordSystem));
  };

  // ---------- E / D at probe ----------
  const [Ex, Ey, Ez] = computeE(
    probePoint[0], probePoint[1], probePoint[2],
    chargeType, chargePos, chargeValue
  );

  // ---------- GRID VECTORS ----------
  const gridVectors = useMemo<FieldVector[]>(() => {
    const arr: FieldVector[] = [];
    let samplePoints: [number, number, number][] = [];

    if (chargeType === "point") {
      samplePoints = [
        ...getSpherePoints(chargePos, 0.8, 5, 8),
        ...getSpherePoints(chargePos, 1.4, 6, 10),
      ];
    } else if (chargeType === "line") {
      // Rings in XZ at multiple Y heights — matches Y-axis rod
      samplePoints = [
        ...getCylinderPoints(chargePos, 0.7, 10, 5),
        ...getCylinderPoints(chargePos, 1.3, 10, 5),
      ];
    } else {
      // Grid above/below Y plane
      samplePoints = [
        ...getSheetPoints(chargePos, 5, 0.6),
        ...getSheetPoints(chargePos, 5, 1.2),
      ];
    }

    for (const [px, py, pz] of samplePoints) {
      const [ex, ey, ez] = computeE(px, py, pz, chargeType, chargePos, chargeValue);
      const mag = Math.sqrt(ex * ex + ey * ey + ez * ez);
      if (mag < 1e-30) continue;

      const arrowLen = 0.35;
      const Evec: [number, number, number] = [
        (ex / mag) * arrowLen,
        (ey / mag) * arrowLen,
        (ez / mag) * arrowLen,
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
    return arr;
  }, [chargePos, chargeValue, chargeType]);

  const fEx = formatScientific(Ex);
  const fEy = formatScientific(Ey);
  const fEz = formatScientific(Ez);

  const coordLabels =
    coordSystem === "cartesian"
      ? ["x", "y", "z"]
      : coordSystem === "cylindrical"
      ? ["ρ", "φ (rad)", "z"]
      : ["r", "θ (rad)", "φ (rad)"];

  const axisLabels: [string, string, string] =
    coordSystem === "cartesian"
      ? ["X", "Y", "Z"]
      : coordSystem === "cylindrical"
      ? ["ρ", "φ", "Z"]
      : ["r", "θ", "φ"];

  const renderInputRow = (
    label: string,
    hint: string,
    raw: [string, string, string],
    cartesian: [number, number, number],
    onChange: (next: [string, string, string]) => void
  ) => (
    <div className="flex flex-col gap-1 col-span-2">
      <h2 className="font-semibold">
        {label}{" "}
        <span className="text-gray-400 font-normal text-xs">{hint}</span>
      </h2>
      <div className="flex gap-2">
        {([0, 1, 2] as const).map((idx) => (
          <label key={idx} className="flex flex-col text-sm flex-1">
            {coordLabels[idx]}
            <input
              type="number"
              value={raw[idx]}
              step={0.1}
              onChange={(e) => {
                const next = [...raw] as [string, string, string];
                next[idx] = e.target.value;
                onChange(next);
              }}
              className="border rounded p-1 w-full"
            />
          </label>
        ))}
      </div>
      <p className="text-xs text-gray-500">
        Cartesian: ({cartesian.map((v) => v.toFixed(3)).join(", ")})
      </p>
    </div>
  );

  // ---------- UI ----------
  return (
    <div className="flex flex-col items-center gap-4 p-4">

      <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">

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

        <div className="flex flex-col gap-1">
          <h2 className="font-semibold">
            Charge Density ({chargeType === "point" ? "C" : chargeType === "line" ? "C/m" : "C/m²"})
          </h2>
          <input
            type="number"
            value={chargeValue}
            step={1e-10}
            onChange={(e) => setChargeValue(parseFloat(e.target.value))}
            className="border rounded p-1"
          />
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="font-semibold">Gaussian Surface Size</h2>
          <input
            type="range" min="0.5" max="3" step="0.1"
            value={surfaceSize}
            onChange={(e) => setSurfaceSize(parseFloat(e.target.value))}
          />
          <span className="text-sm">{surfaceSize} units</span>
        </div>

        {renderInputRow(
          "Charge Position",
          "(moves the charge + surface)",
          chargeRaw, chargePos, handleChargeRawChange
        )}

        {renderInputRow(
          "Probe Point",
          "(evaluate E and D here — scene unchanged)",
          probeRaw, probePoint, handleProbeRawChange
        )}

      </div>

      {/* ── FIELD RESULT ── */}
      <div className="font-mono text-sm bg-gray-100 rounded p-2 w-full max-w-2xl">
        <p>
          E at probe = ({fEx.mantissa}×10<sup>{fEx.exponent}</sup>,&nbsp;
          {fEy.mantissa}×10<sup>{fEy.exponent}</sup>,&nbsp;
          {fEz.mantissa}×10<sup>{fEz.exponent}</sup>) V/m
        </p>
        <p>
          D = ε₀·E = (
          {formatScientific(Ex * epsilon0).mantissa}×10<sup>{formatScientific(Ex * epsilon0).exponent}</sup>,&nbsp;
          {formatScientific(Ey * epsilon0).mantissa}×10<sup>{formatScientific(Ey * epsilon0).exponent}</sup>,&nbsp;
          {formatScientific(Ez * epsilon0).mantissa}×10<sup>{formatScientific(Ez * epsilon0).exponent}</sup>
          ) C/m²
        </p>
      </div>

      {/* ── CANVAS ── */}
      <Canvas style={{ height: 500, width: 800 }} camera={{ position: [4, 3, 4] }}>
        <OrbitControls />
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} />

        <Axes labels={axisLabels} length={10} width={2} fontPosition={4} interval={1} />

        {/* ── Point charge ── */}
        {chargeType === "point" && (
          <>
            <mesh position={chargePos}>
              <sphereGeometry args={[surfaceSize, 32, 32]} />
              <meshStandardMaterial color="green" transparent opacity={0.08} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={chargePos}>
              <sphereGeometry args={[surfaceSize, 16, 16]} />
              <meshStandardMaterial color="lime" wireframe />
            </mesh>
            <mesh position={chargePos}>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial
                color={chargeValue >= 0 ? "red" : "blue"}
                emissive={chargeValue >= 0 ? "red" : "blue"}
                emissiveIntensity={0.5}
              />
            </mesh>
          </>
        )}

        {/* ── Line charge — rod + cylinder both along Y axis (Three.js default) ── */}
        {chargeType === "line" && (
          <>
            {/* Rod along Y — no rotation needed, cylinder default is Y */}
            <mesh position={chargePos}>
              <cylinderGeometry args={[0.05, 0.05, 6, 8]} />
              <meshStandardMaterial color="orange" />
            </mesh>
            {/* Gaussian cylinder along Y, open ended */}
            <mesh position={chargePos}>
              <cylinderGeometry args={[surfaceSize, surfaceSize, 4, 32, 1, true]} />
              <meshStandardMaterial color="green" transparent opacity={0.08} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={chargePos}>
              <cylinderGeometry args={[surfaceSize, surfaceSize, 4, 24]} />
              <meshStandardMaterial color="lime" wireframe />
            </mesh>
          </>
        )}

        {/* ── Sheet charge — plane at chargePos, field along Y ── */}
        {chargeType === "sheet" && (
          <>
            {/* XZ plane at chargePos — rotate plane to lie flat in XZ */}
            <mesh position={chargePos} rotation={[Math.PI / 2, 0, 0]}>
              <planeGeometry args={[6, 6]} />
              <meshStandardMaterial color="orange" transparent opacity={0.3} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={chargePos}>
              <boxGeometry args={[surfaceSize, 0.5, surfaceSize]} />
              <meshStandardMaterial color="green" transparent opacity={0.08} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={chargePos}>
              <boxGeometry args={[surfaceSize, 0.5, surfaceSize]} />
              <meshStandardMaterial color="lime" wireframe />
            </mesh>
          </>
        )}

        {/* Probe marker */}
        <mesh position={probePoint}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial color="yellow" emissive="yellow" emissiveIntensity={0.6} />
        </mesh>

        {/* Field vectors */}
        {gridVectors.map((v, i) => (
          <VectorArrow key={i} vector={v.E} color="royalblue" origin={v.origin} />
        ))}

      </Canvas>
    </div>
  );
}
/*

  Cylindrical Coordinates (ρ, φ, z):
    x=ρcosϕ
    y=ρsinϕ
    z=z

  Spherical Coordinates (r, θ, φ):
    x = rsinθcosϕ
    y=rsinθsinϕ
    z=rcosθ
*/