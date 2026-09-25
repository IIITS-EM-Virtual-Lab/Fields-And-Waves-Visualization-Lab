import React, { useMemo, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import Axes from "./Axes";
import VectorArrow from "./VectorArrow";
import CanvasControlsToolbar from "./CanvasControlsToolbar";

const epsilon0 = 8.854187817e-12; // C^2 / (N·m^2)

function GaussLawVisualizer() {
  const [chargeValueNC, setChargeValueNC] = useState<number>(1); // in nC
  const [chargePosition, setChargePosition] = useState<[number, number, number]>([0, 0, 0]);
  const [surfaceRadius, setSurfaceRadius] = useState<number>(2);

  const [interactionMode, setInteractionMode] = useState<'rotate' | 'pan'>('rotate');
  const controlsRef = useRef<any>(null);

  const handleZoomIn = () => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      camera.zoom *= 1.2;
      camera.updateProjectionMatrix();
    }
  };

  const handleZoomOut = () => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      camera.zoom /= 1.2;
      camera.updateProjectionMatrix();
    }
  };

  const resetCamera = () => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      camera.zoom = 1;
      camera.updateProjectionMatrix();
      controlsRef.current.reset();
    }
  };

  const chargeValue = chargeValueNC * 1e-9; // converted to Coulombs

  const charge = useMemo(
    () => new THREE.Vector3(...chargePosition),
    [chargePosition]
  );

  const surfaceCenter = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const distToCenter = charge.distanceTo(surfaceCenter);
  const isEnclosed = distToCenter < surfaceRadius - 1e-4;
  const isOnSurface = Math.abs(distToCenter - surfaceRadius) <= 1e-4;

  // Gauss's Law: Φ = Q_enc / ε₀
  const flux = useMemo(() => {
    if (chargeValue === 0) return 0;
    if (isEnclosed) return chargeValue / epsilon0;
    if (isOnSurface) return (chargeValue / epsilon0) * 0.5; // on boundary
    return 0; // outside surface
  }, [chargeValue, isEnclosed, isOnSurface]);

  // Generate 3D radial field vectors emanating from the point charge
  const fieldVectors = useMemo(() => {
    if (chargeValue === 0) return [];
    const vectors: {
      from: [number, number, number];
      to: [number, number, number];
    }[] = [];

    const arrowLength = Math.max(1.2, surfaceRadius * 0.7);

    // 14 symmetric angular directions (vertices + face centers of cube)
    const directions: [number, number, number][] = [
      [1, 0, 0], [-1, 0, 0],
      [0, 1, 0], [0, -1, 0],
      [0, 0, 1], [0, 0, -1],
      [1, 1, 1], [-1, 1, 1], [1, -1, 1], [1, 1, -1],
      [-1, -1, 1], [-1, 1, -1], [1, -1, -1], [-1, -1, -1],
    ];

    for (const [dx, dy, dz] of directions) {
      const dir = new THREE.Vector3(dx, dy, dz).normalize();
      if (chargeValue > 0) {
        const from = charge.toArray() as [number, number, number];
        const to = charge.clone().add(dir.clone().multiplyScalar(arrowLength)).toArray() as [number, number, number];
        vectors.push({ from, to });
      } else {
        const from = charge.clone().add(dir.clone().multiplyScalar(arrowLength)).toArray() as [number, number, number];
        const to = charge.toArray() as [number, number, number];
        vectors.push({ from, to });
      }
    }

    return vectors;
  }, [charge, surfaceRadius, chargeValue]);

  return (
    <div className="flex flex-col items-center gap-4 p-4 font-sans text-gray-800">
      {/* ── Top Controls Panel ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl w-full bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        {/* Point Charge Controls */}
        <div className="space-y-3">
          <h2 className="font-bold text-sm text-gray-700 uppercase tracking-wide">
            Point Charge Source
          </h2>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Charge: <span className="font-mono text-blue-600 font-bold">{chargeValueNC.toFixed(2)} nC</span>
            </label>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.1"
              value={chargeValueNC}
              onChange={(e) => setChargeValueNC(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>
          <div>
            <span className="block text-xs font-semibold text-gray-600 mb-1">Position (x, y, z):</span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs text-gray-500">X (m):</label>
                <input
                  type="number"
                  step="0.2"
                  value={chargePosition[0]}
                  onChange={(e) =>
                    setChargePosition([+e.target.value, chargePosition[1], chargePosition[2]])
                  }
                  className="border border-gray-300 rounded px-2 py-1 w-full text-sm font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Y (m):</label>
                <input
                  type="number"
                  step="0.2"
                  value={chargePosition[1]}
                  onChange={(e) =>
                    setChargePosition([chargePosition[0], +e.target.value, chargePosition[2]])
                  }
                  className="border border-gray-300 rounded px-2 py-1 w-full text-sm font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Z (m):</label>
                <input
                  type="number"
                  step="0.2"
                  value={chargePosition[2]}
                  onChange={(e) =>
                    setChargePosition([chargePosition[0], chargePosition[1], +e.target.value])
                  }
                  className="border border-gray-300 rounded px-2 py-1 w-full text-sm font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Gaussian Surface Controls */}
        <div className="space-y-3">
          <h2 className="font-bold text-sm text-gray-700 uppercase tracking-wide">
            Gaussian Sphere Surface
          </h2>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Sphere Radius: <span className="font-mono text-purple-600 font-bold">{surfaceRadius.toFixed(1)} m</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="4.5"
              step="0.1"
              value={surfaceRadius}
              onChange={(e) => setSurfaceRadius(Number(e.target.value))}
              className="w-full accent-purple-600"
            />
          </div>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-500">Distance from Center:</span>
              <span className="font-mono font-semibold">{distToCenter.toFixed(2)} m</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-gray-200">
              <span className="text-gray-500">Enclosure Status:</span>
              <span
                className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                  isEnclosed
                    ? "bg-green-100 text-green-700"
                    : isOnSurface
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {isEnclosed ? "ENCLOSED (Inside)" : isOnSurface ? "ON SURFACE" : "OUTSIDE"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Live Flux Formula Card ── */}
      <div className="flex flex-wrap items-center justify-center gap-6 max-w-4xl w-full bg-slate-900 text-white p-4 rounded-xl shadow-sm border border-slate-800">
        <div className="text-center">
          <span className="text-slate-400 text-xs uppercase tracking-wider block">Gauss's Law Formula</span>
          <span className="font-mono text-amber-400 font-bold text-base">Φ = ∮ E · dA = Q_enc / ε₀</span>
        </div>
        <div className="h-8 w-px bg-slate-700 hidden sm:block"></div>
        <div className="text-center">
          <span className="text-slate-400 text-xs uppercase tracking-wider block">Enclosed Charge (Q_enc)</span>
          <span className="font-mono font-bold text-base text-cyan-400">
            {isEnclosed ? (chargeValue).toExponential(2) + " C" : "0.00 C"}
          </span>
        </div>
        <div className="h-8 w-px bg-slate-700 hidden sm:block"></div>
        <div className="text-center">
          <span className="text-slate-400 text-xs uppercase tracking-wider block">Total Net Electric Flux (Φ)</span>
          <span className="font-mono font-bold text-lg text-emerald-400">
            {flux === 0 ? "0.000 N·m²/C" : `${flux.toExponential(3)} N·m²/C`}
          </span>
        </div>
      </div>

      {/* ── 3D Scene Canvas ── */}
      <div
        className="relative overflow-hidden rounded-xl border-2 border-blue-600 bg-slate-950 w-full max-w-[800px] h-[500px]"
      >
        <CanvasControlsToolbar
          interactionMode={interactionMode}
          setInteractionMode={setInteractionMode}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={resetCamera}
        />
        <Canvas camera={{ position: [5, 4, 6] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls
            ref={controlsRef}
            makeDefault
            mouseButtons={{
              LEFT: interactionMode === 'rotate' ? THREE.MOUSE.ROTATE : THREE.MOUSE.PAN,
              MIDDLE: THREE.MOUSE.DOLLY,
              RIGHT: interactionMode === 'rotate' ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE,
            }}
          />

          <Axes length={20} width={2} />

          {/* Point Charge Marker */}
          <mesh position={[charge.x, charge.y, charge.z]}>
            <sphereGeometry args={[0.15, 32, 32]} />
            <meshStandardMaterial
              color={chargeValue > 0 ? "#ef4444" : chargeValue < 0 ? "#3b82f6" : "#94a3b8"}
              emissive={chargeValue > 0 ? "#7f1d1d" : chargeValue < 0 ? "#1e3a8a" : "#334155"}
            />
          </mesh>

          {/* Charge Label */}
          <Html position={[charge.x, charge.y + 0.35, charge.z]} center distanceFactor={8}>
            <div
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                color: chargeValue >= 0 ? "#ef4444" : "#3b82f6",
                background: "rgba(255, 255, 255, 0.9)",
                padding: "2px 6px",
                borderRadius: "4px",
                whiteSpace: "nowrap",
                boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
              }}
            >
              {chargeValueNC > 0 ? `+${chargeValueNC} nC` : `${chargeValueNC} nC`}
            </div>
          </Html>

          {/* Gaussian Surface (Centered at Origin) */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[surfaceRadius, 36, 36]} />
            <meshStandardMaterial
              color="#a855f7"
              opacity={0.22}
              transparent
              roughness={0.1}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Field line arrows */}
          {fieldVectors.map((vec, i) => (
            <VectorArrow
              key={i}
              vector={[
                vec.to[0] - vec.from[0],
                vec.to[1] - vec.from[1],
                vec.to[2] - vec.from[2],
              ]}
              origin={vec.from}
              color={chargeValue > 0 ? "#ef4444" : "#3b82f6"}
            />
          ))}

          {/* Surface Label */}
          <Html position={[0, surfaceRadius + 0.35, 0]} center distanceFactor={8}>
            <div
              style={{
                fontSize: "13px",
                fontWeight: "700",
                background: "rgba(255, 255, 255, 0.95)",
                color: "#7e22ce",
                padding: "4px 10px",
                borderRadius: "8px",
                whiteSpace: "nowrap",
                userSelect: "none",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              }}
            >
              Gaussian Sphere (r = {surfaceRadius.toFixed(1)} m)
            </div>
          </Html>
        </Canvas>
      </div>

      {/* ── Legend ── */}
      <div className="flex flex-wrap justify-center items-center gap-8 py-3 w-full max-w-[800px] bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span>X-axis / +q field</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span>Y-axis</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500"></span>
          <span>Z-axis / -q field</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-purple-500"></span>
          <span>Gaussian Surface</span>
        </div>
      </div>
    </div>
  );
}

export default GaussLawVisualizer;
