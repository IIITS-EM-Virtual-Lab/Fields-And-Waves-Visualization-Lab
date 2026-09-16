import React, { useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, Edges } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import Axes from "@/components/Axes";
import VectorArrow from "@/components/VectorArrow";
import CanvasControlsToolbar from "@/components/CanvasControlsToolbar";

/* ─── Tab metadata ───────────────────────────────────────────────────────── */
const TABS = {
  length: { label: "dl · Length",   color: "#f59e0b", badgeColor: "bg-amber-100 text-amber-800 border-amber-300" },
  area_x: { label: "dSx · Area X",  color: "#ef4444", badgeColor: "bg-red-100 text-red-800 border-red-300" },
  area_y: { label: "dSy · Area Y",  color: "#22c55e", badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  area_z: { label: "dSz · Area Z",  color: "#3b82f6", badgeColor: "bg-blue-100 text-blue-800 border-blue-300" },
  volume: { label: "dv · Volume",   color: "#a855f7", badgeColor: "bg-purple-100 text-purple-800 border-purple-300" },
};

type TabKey = keyof typeof TABS;

/* ─── 3D Differential Scene Component ────────────────────────────────────── */
function DifferentialScene({ viewMode }: { viewMode: TabKey }) {
  const P: [number, number, number] = [1.5, 1.5, 1.5];
  const dx = 2, dy = 2, dz = 2;
  const cc: [number, number, number] = [P[0] + dx / 2, P[1] + dy / 2, P[2] + dz / 2];

  return (
    <group>
      <Axes length={8} width={2} fontPosition={4.5} interval={2} />

      {/* Point P marker */}
      <mesh position={P}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#2563eb" />
      </mesh>
      <Html position={[P[0] - 0.35, P[1] - 0.35, P[2] - 0.1]} center distanceFactor={8}>
        <div className="bg-white/90 text-blue-700 font-bold text-xs px-1.5 py-0.5 rounded shadow border border-blue-200 whitespace-nowrap select-none">
          P(x, y, z)
        </div>
      </Html>

      {/* Wireframe cube bounding box */}
      <mesh position={cc}>
        <boxGeometry args={[dx, dy, dz]} />
        <Edges scale={1} threshold={15} color="#64748b" />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Volume Display */}
      {viewMode === "volume" && (
        <group>
          <mesh position={cc}>
            <boxGeometry args={[dx, dy, dz]} />
            <meshStandardMaterial color="#a855f7" transparent opacity={0.25} side={THREE.DoubleSide} />
          </mesh>
          <Html position={cc} center distanceFactor={8}>
            <div className="text-purple-700 font-bold text-lg select-none drop-shadow">
              dv
            </div>
          </Html>
        </group>
      )}

      {/* Length Display */}
      {viewMode === "length" && (
        <group>
          <VectorArrow vector={[dx, dy, dz]} origin={P} color="#f59e0b" label="dl" />
          <VectorArrow vector={[dx, 0, 0]} origin={P} color="#ef4444" label="dx âx" />
          <VectorArrow vector={[0, dy, 0]} origin={[P[0] + dx, P[1], P[2]]} color="#22c55e" label="dy ây" />
          <VectorArrow vector={[0, 0, dz]} origin={[P[0] + dx, P[1] + dy, P[2]]} color="#3b82f6" label="dz âz" />
          <mesh position={[P[0] + dx, P[1] + dy, P[2] + dz]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshBasicMaterial color="#2563eb" />
          </mesh>
          <Html position={[P[0] + dx + 0.4, P[1] + dy + 0.4, P[2] + dz + 0.1]} center distanceFactor={8}>
            <div className="bg-white/90 text-blue-700 font-bold text-xs px-1.5 py-0.5 rounded shadow border border-blue-200 whitespace-nowrap select-none">
              Q(x+dx, y+dy, z+dz)
            </div>
          </Html>
        </group>
      )}

      {/* Area X Display */}
      {viewMode === "area_x" && (
        <group>
          <mesh position={[P[0] + dx, cc[1], cc[2]]}>
            <boxGeometry args={[0.03, dy, dz]} />
            <meshStandardMaterial color="#ef4444" transparent opacity={0.45} side={THREE.DoubleSide} />
          </mesh>
          <VectorArrow vector={[1.6, 0, 0]} origin={[P[0] + dx, cc[1], cc[2]]} color="#ef4444" label="dSx" />
        </group>
      )}

      {/* Area Y Display */}
      {viewMode === "area_y" && (
        <group>
          <mesh position={[cc[0], P[1] + dy, cc[2]]}>
            <boxGeometry args={[dx, 0.03, dz]} />
            <meshStandardMaterial color="#22c55e" transparent opacity={0.45} side={THREE.DoubleSide} />
          </mesh>
          <VectorArrow vector={[0, 1.6, 0]} origin={[cc[0], P[1] + dy, cc[2]]} color="#22c55e" label="dSy" />
        </group>
      )}

      {/* Area Z Display */}
      {viewMode === "area_z" && (
        <group>
          <mesh position={[cc[0], cc[1], P[2] + dz]}>
            <boxGeometry args={[dx, dy, 0.03]} />
            <meshStandardMaterial color="#3b82f6" transparent opacity={0.45} side={THREE.DoubleSide} />
          </mesh>
          <VectorArrow vector={[0, 0, 1.6]} origin={[cc[0], cc[1], P[2] + dz]} color="#3b82f6" label="dSz" />
        </group>
      )}
    </group>
  );
}

/* ─── Interactive Demo Component ─────────────────────────────────────────── */
function DifferentialElementsDemo() {
  const [viewMode, setViewMode] = useState<TabKey>("volume");
  const meta = TABS[viewMode];

  const [interactionMode, setInteractionMode] = useState<"rotate" | "pan">("rotate");
  const controlsRef = useRef<OrbitControlsImpl>(null);

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

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* 3D Canvas Box */}
      <div
        className="relative overflow-hidden rounded-lg border-2 border-blue-600 bg-gray-50 w-full max-w-[800px]"
        style={{ height: 500, zIndex: 0 }}
      >
        <CanvasControlsToolbar
          interactionMode={interactionMode}
          setInteractionMode={setInteractionMode}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={resetCamera}
        />
        <Canvas style={{ height: "100%", width: "100%" }} camera={{ position: [7, 5, 7], fov: 45 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 15, 10]} intensity={1.0} />
          <OrbitControls
            ref={controlsRef}
            makeDefault
            mouseButtons={{
              LEFT: interactionMode === "rotate" ? THREE.MOUSE.ROTATE : THREE.MOUSE.PAN,
              MIDDLE: THREE.MOUSE.DOLLY,
              RIGHT: interactionMode === "rotate" ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE,
            }}
          />
          <DifferentialScene viewMode={viewMode} />
        </Canvas>
      </div>

      {/* Axis & Element Legend */}
      <div className="flex flex-wrap justify-center items-center gap-6 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium w-full max-w-[800px]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span>X-axis</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span>Y-axis</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500"></span>
          <span>Z-axis</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500"></span>
          <span>dl (Length)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-purple-500"></span>
          <span>dv (Volume)</span>
        </div>
      </div>

      {/* Element Selector Tabs */}
      <div className="flex flex-col gap-2 w-full max-w-[800px]">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Select Element to Explore
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(TABS) as TabKey[]).map((id) => {
            const tabMeta = TABS[id];
            const active = viewMode === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setViewMode(id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                  active
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white text-slate-700 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {tabMeta.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page Export ───────────────────────────────────────────────────── */
const VectorCalculusIntroPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col border-t border-slate-300">
      <div className="text-xl sm:text-2xl lg:text-3xl font-black uppercase text-center py-8">
        Differential Length, Area and Volume
      </div>

      {/* Interactive Demo Section */}
      <div className="pb-10">
        <div className="text-xl font-black uppercase text-center py-6">
          INTERACTIVE DEMO
        </div>
        <div className="flex justify-center overflow-x-auto">
          <div className="min-w-[320px] max-w-[90vw] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[800px] w-full">
            <DifferentialElementsDemo />
          </div>
        </div>
      </div>

      {/* Theory & Mathematical Exposition */}
      <div className="space-y-6 text-sm sm:text-base mb-16">
        <p className="leading-relaxed text-gray-700">
          Differential elements in length, area, and volume are essential foundations of Vector Calculus. They are defined across{" "}
          <strong className="font-semibold text-gray-900">Cartesian</strong>,{" "}
          <strong className="font-semibold text-gray-900">Cylindrical</strong>, and{" "}
          <strong className="font-semibold text-gray-900">Spherical</strong> coordinate systems to perform line integrals (work, circulation), surface integrals (flux), and volume integrals (charge/mass accumulation).
        </p>

        <div className="text-lg sm:text-xl font-black uppercase text-center py-4 border-t border-slate-200 text-gray-800">
          Cartesian Coordinate System
        </div>

        <p className="leading-relaxed text-gray-700">
          Consider an infinitesimal cuboid with edges parallel to the coordinate axes having dimensions <InlineMath math="dx" />, <InlineMath math="dy" />, and <InlineMath math="dz" />. The differential displacement vector <InlineMath math="d\mathbf{l}" /> spans from point <InlineMath math="P(x, y, z)" /> to adjacent point <InlineMath math="Q(x+dx, y+dy, z+dz)" />.
        </p>

        {/* 1. Differential Length */}
        <div className="font-semibold text-base sm:text-lg text-gray-900 pt-2">
          1. Differential Displacement (Length)
        </div>
        <p className="text-gray-700">
          The differential length vector along the space diagonal of the infinitesimal element is given by:
        </p>
        <div className="flex justify-center items-center p-4 sm:p-6 bg-slate-50 rounded-lg border border-slate-200">
          <div className="text-lg sm:text-xl md:text-2xl">
            <BlockMath math={`d\\mathbf{l} = dx\\,\\hat{a}_x + dy\\,\\hat{a}_y + dz\\,\\hat{a}_z`} />
          </div>
        </div>

        {/* 2. Differential Normal Surface Area */}
        <div className="font-semibold text-base sm:text-lg text-gray-900 pt-2">
          2. Differential Normal Surface Area
        </div>
        <p className="text-gray-700">
          The differential surface area vectors for the planar faces are directed perpendicular to each respective face along the outward unit normal:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 sm:p-6 bg-slate-50 rounded-lg border border-slate-200">
          <div className="text-center p-3 bg-white rounded-md border border-slate-200 shadow-xs">
            <div className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Normal to X-Axis</div>
            <BlockMath math={`d\\mathbf{S}_x = dy\\,dz\\,\\hat{a}_x`} />
          </div>
          <div className="text-center p-3 bg-white rounded-md border border-slate-200 shadow-xs">
            <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Normal to Y-Axis</div>
            <BlockMath math={`d\\mathbf{S}_y = dx\\,dz\\,\\hat{a}_y`} />
          </div>
          <div className="text-center p-3 bg-white rounded-md border border-slate-200 shadow-xs">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Normal to Z-Axis</div>
            <BlockMath math={`d\\mathbf{S}_z = dx\\,dy\\,\\hat{a}_z`} />
          </div>
        </div>

        {/* 3. Differential Volume */}
        <div className="font-semibold text-base sm:text-lg text-gray-900 pt-2">
          3. Differential Volume
        </div>
        <p className="text-gray-700">
          The infinitesimal volume enclosed by the differential cuboid with dimensions <InlineMath math="dx" />, <InlineMath math="dy" />, and <InlineMath math="dz" /> is a scalar quantity given by:
        </p>
        <div className="flex justify-center items-center p-4 sm:p-6 bg-slate-50 rounded-lg border border-slate-200">
          <div className="text-lg sm:text-xl md:text-2xl">
            <BlockMath math={`dv = dx\\,dy\\,dz`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VectorCalculusIntroPage;
