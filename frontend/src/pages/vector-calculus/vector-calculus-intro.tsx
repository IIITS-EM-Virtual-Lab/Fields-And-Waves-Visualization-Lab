import React, { useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, Edges } from "@react-three/drei";
import * as THREE from "three";

/* ─── Design tokens (shared with VectorAddition) ─────────────────────────── */
const T = {
  navy:    "#475569",
  navyMid: "#64748b",
  slate:   "#64748b",
  muted:   "#94a3b8",
  bg:      "#f8fafc",
  card:    "#ffffff",
  border:  "#e2e8f0",
  red:     "#ef4444",
  green:   "#22c55e",
  blue:    "#3b82f6",
  amber:   "#f59e0b",
  purple:  "#a855f7",
};

/* ─── Tab metadata ───────────────────────────────────────────────────────── */
const TABS = {
  length: { label: "dl · Length",   color: T.amber,  bg: "#fffbeb", border: "#fde68a" },
  area_x: { label: "dSx · Area X",  color: T.red,    bg: "#fef2f2", border: "#fecaca" },
  area_y: { label: "dSy · Area Y",  color: T.green,  bg: "#f0fdf4", border: "#bbf7d0" },
  area_z: { label: "dSz · Area Z",  color: T.blue,   bg: "#eff6ff", border: "#bfdbfe" },
  volume: { label: "dV · Volume",   color: T.purple, bg: "#faf5ff", border: "#e9d5ff" },
};

type TabKey = keyof typeof TABS;

const CONTENT = {
  length: {
    title: "Differential Length",
    symbol: "dl",
    formula: "dl = dx x̂ + dy ŷ + dz ẑ",
    description:
      "The differential displacement dl is the vector from point P(x, y, z) to the adjacent point Q(x+dx, y+dy, z+dz). It is the space diagonal of the infinitesimal cube, decomposed along the three coordinate axes.",
    note: "dl is a vector quantity — direction matters.",
  },
  area_x: {
    title: "Differential Area — Normal to X",
    symbol: "dSx",
    formula: "dSx = dy dz  x̂",
    description:
      "This face lies in the YZ plane and is perpendicular to the X-axis. Its outward normal points in the +x̂ direction, and its magnitude equals the product of the two side lengths dy and dz.",
    note: "Area is a vector — its direction is the outward normal.",
  },
  area_y: {
    title: "Differential Area — Normal to Y",
    symbol: "dSy",
    formula: "dSy = dx dz  ŷ",
    description:
      "This face lies in the XZ plane. The outward normal points in the +ŷ direction. Surface integrals over this face use the area element dx dz.",
    note: "Area is a vector — its direction is the outward normal.",
  },
  area_z: {
    title: "Differential Area — Normal to Z",
    symbol: "dSz",
    formula: "dSz = dx dy  ẑ",
    description:
      "This face lies in the XY plane. The outward normal points in the +ẑ direction. This is the element used for computing flux through a horizontal surface.",
    note: "Area is a vector — its direction is the outward normal.",
  },
  volume: {
    title: "Differential Volume",
    symbol: "dV",
    formula: "dV = dx dy dz",
    description:
      "The infinitesimal volume enclosed by the cube with side lengths dx, dy, and dz. Unlike length and area, volume is a scalar — it has magnitude only, and appears in triple integrals over 3-D regions.",
    note: "dV is a scalar — no direction.",
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   3-D scene helpers
   ═══════════════════════════════════════════════════════════════════════════ */

type VectorArrowProps = {
  vector: [number, number, number];
  origin?: [number, number, number];
  color?: string;
  label?: string;
  thickness?: number;
};

function VectorArrow({
  vector,
  origin = [0, 0, 0],
  color = "black",
  label = "",
  thickness = 0.05,
}: VectorArrowProps) {
  const dir = new THREE.Vector3(...vector);
  const length = dir.length();
  if (length < 1e-4) return null;
  dir.normalize();

  const start      = new THREE.Vector3(...origin);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  const headLength = Math.min(length * 0.3, 0.4);
  const headWidth  = thickness * 2.5;
  const shaftLength = Math.max(0, length - headLength);

  const shaftPos = start.clone().add(dir.clone().multiplyScalar(shaftLength / 2));
  const headPos  = start.clone().add(dir.clone().multiplyScalar(shaftLength + headLength / 2));
  const labelPos = start.clone().add(dir.clone().multiplyScalar(length + 0.25));

  return (
    <group>
      {shaftLength > 0 && (
        <mesh position={shaftPos} quaternion={quaternion}>
          <cylinderGeometry args={[thickness, thickness, shaftLength, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
      )}
      <mesh position={headPos} quaternion={quaternion}>
        <coneGeometry args={[headWidth, headLength, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {label && (
        <Html position={labelPos} center distanceFactor={8}>
          <div style={{ color, fontSize: "15px", fontWeight: "700", fontFamily: "JetBrains Mono, monospace", textShadow: "0 0 6px white, 0 0 3px white" }}>
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

type AxisLabelProps = {
  pos: [number, number, number];
  text: string;
  color: string;
};

function AxisLabel({ pos, text, color }: AxisLabelProps) {
  return (
    <Html position={pos} center distanceFactor={10}>
      <div style={{ color, fontSize: "15px", fontWeight: "700", fontFamily: "Space Grotesk, sans-serif", textShadow: "0 0 6px white, 0 0 3px white" }}>
        {text}
      </div>
    </Html>
  );
}

function MainAxes({ length = 6.5 }: { length?: number }) {
  return (
    <group>
      <VectorArrow vector={[length, 0, 0]} color={T.red}   thickness={0.025} />
      <VectorArrow vector={[0, length, 0]} color={T.green} thickness={0.025} />
      <VectorArrow vector={[0, 0, length]} color={T.blue}  thickness={0.025} />
      <AxisLabel pos={[length + 0.4, 0, 0]} text="x" color={T.red}   />
      <AxisLabel pos={[0, length + 0.4, 0]} text="y" color={T.green} />
      <AxisLabel pos={[0, 0, length + 0.4]} text="z" color={T.blue}  />
    </group>
  );
}

function DifferentialScene({ viewMode }: { viewMode: TabKey }) {
  const P: [number, number, number]  = [1.5, 1.5, 1.5];
  const dx = 2, dy = 2, dz = 2;
  const cc: [number, number, number] = [P[0] + dx / 2, P[1] + dy / 2, P[2] + dz / 2];

  return (
    <group>
      <MainAxes />

      {/* P marker */}
      <mesh position={P}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color={T.navy} />
      </mesh>
      <Html position={[P[0] - 0.35, P[1] - 0.35, P[2] - 0.1]} center>
        <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "12px", fontWeight: "600", background: "rgba(255,255,255,0.9)", padding: "2px 6px", borderRadius: "4px", color: T.navy, whiteSpace: "nowrap", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }}>
          P(x, y, z)
        </div>
      </Html>

      {/* Wireframe cube — always visible */}
      <mesh position={cc}>
        <boxGeometry args={[dx, dy, dz]} />
        <Edges scale={1} threshold={15} color="#94a3b8" />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Volume */}
      {viewMode === "volume" && (
        <group>
          <mesh position={cc}>
            <boxGeometry args={[dx, dy, dz]} />
            <meshStandardMaterial color={T.purple} transparent opacity={0.22} side={THREE.DoubleSide} />
          </mesh>
          <Html position={cc} center>
            <div style={{ color: T.purple, fontFamily: "Space Grotesk, sans-serif", fontSize: "20px", fontWeight: "700", textShadow: "0 0 8px white, 0 0 4px white" }}>dV</div>
          </Html>
        </group>
      )}

      {/* Length */}
      {viewMode === "length" && (
        <group>
          <VectorArrow vector={[dx, dy, dz]} origin={P}                          color={T.amber} label="dl"    thickness={0.07} />
          <VectorArrow vector={[dx, 0, 0]}   origin={P}                          color={T.red}   label="dx x̂" thickness={0.03} />
          <VectorArrow vector={[0, dy, 0]}   origin={[P[0]+dx, P[1],    P[2]]}   color={T.green} label="dy ŷ" thickness={0.03} />
          <VectorArrow vector={[0, 0, dz]}   origin={[P[0]+dx, P[1]+dy, P[2]]}   color={T.blue}  label="dz ẑ" thickness={0.03} />
          <mesh position={[P[0]+dx, P[1]+dy, P[2]+dz]}>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial color={T.navy} />
          </mesh>
          <Html position={[P[0]+dx+0.3, P[1]+dy+0.3, P[2]+dz+0.1]} center>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "12px", fontWeight: "600", background: "rgba(255,255,255,0.9)", padding: "2px 6px", borderRadius: "4px", color: T.navy, whiteSpace: "nowrap", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }}>
              Q(x+dx, y+dy, z+dz)
            </div>
          </Html>
        </group>
      )}

      {/* Area X */}
      {viewMode === "area_x" && (
        <group>
          <mesh position={[P[0]+dx, cc[1], cc[2]]}>
            <boxGeometry args={[0.03, dy, dz]} />
            <meshStandardMaterial color={T.red} transparent opacity={0.4} side={THREE.DoubleSide} />
          </mesh>
          <VectorArrow vector={[1.6, 0, 0]} origin={[P[0]+dx, cc[1], cc[2]]} color={T.red} label="dSx" thickness={0.07} />
        </group>
      )}

      {/* Area Y */}
      {viewMode === "area_y" && (
        <group>
          <mesh position={[cc[0], P[1]+dy, cc[2]]}>
            <boxGeometry args={[dx, 0.03, dz]} />
            <meshStandardMaterial color={T.green} transparent opacity={0.4} side={THREE.DoubleSide} />
          </mesh>
          <VectorArrow vector={[0, 1.6, 0]} origin={[cc[0], P[1]+dy, cc[2]]} color={T.green} label="dSy" thickness={0.07} />
        </group>
      )}

      {/* Area Z */}
      {viewMode === "area_z" && (
        <group>
          <mesh position={[cc[0], cc[1], P[2]+dz]}>
            <boxGeometry args={[dx, dy, 0.03]} />
            <meshStandardMaterial color={T.blue} transparent opacity={0.4} side={THREE.DoubleSide} />
          </mesh>
          <VectorArrow vector={[0, 0, 1.6]} origin={[cc[0], cc[1], P[2]+dz]} color={T.blue} label="dSz" thickness={0.07} />
        </group>
      )}
    </group>
  );
}

import CanvasControlsToolbar from "@/components/CanvasControlsToolbar";

function DifferentialElementsDemo() {
  const [viewMode, setViewMode] = useState<TabKey>("volume");
  const meta    = TABS[viewMode];
  const content = CONTENT[viewMode];

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

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0px" }}>

      {/* ── 3-D Canvas — mirrors VectorAddition canvas block ── */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "12px",
          border: `2px solid ${T.blue}`,
          height: 500,
          width: "100%",
          maxWidth: 900,
          zIndex: 0,
          background: "#f1f5f9",
        }}
      >
        <CanvasControlsToolbar
          interactionMode={interactionMode}
          setInteractionMode={setInteractionMode}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={resetCamera}
        />
        <Canvas style={{ height: "100%", width: "100%" }} camera={{ position: [8, 6, 8], fov: 45 }}>
          <ambientLight intensity={0.55} />
          <directionalLight position={[10, 15, 10]} intensity={1.1} />
          <OrbitControls
            ref={controlsRef}
            makeDefault
            mouseButtons={{
              LEFT: interactionMode === 'rotate' ? THREE.MOUSE.ROTATE : THREE.MOUSE.PAN,
              MIDDLE: THREE.MOUSE.DOLLY,
              RIGHT: interactionMode === 'rotate' ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE,
            }}
          />
          <DifferentialScene viewMode={viewMode} />
        </Canvas>
        <div style={{ position: "absolute", bottom: 14, right: 16, fontSize: "11px", fontWeight: "500", color: T.slate, background: "rgba(255,255,255,0.85)", padding: "4px 10px", borderRadius: "20px", backdropFilter: "blur(4px)", pointerEvents: "none" }}>
          Left Click + Drag to Rotate · Scroll to Zoom
        </div>
      </div>

      {/* ── Axis legend — mirrors VectorAddition legend row ── */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "24px", padding: "12px 16px", background: "#f9fafb", borderTop: `1px solid ${T.border}`, width: "100%", maxWidth: 900, flexWrap: "wrap" }}>
        {[
          { color: T.red,   label: "X-axis" },
          { color: T.green, label: "Y-axis" },
          { color: T.blue,  label: "Z-axis" },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "13px", fontWeight: "500", color: T.navyMid, fontFamily: "Inter, sans-serif" }}>
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: color, display: "inline-block", flexShrink: 0 }} />
            {label}
          </div>
        ))}
      </div>

      {/* ── Tab selector — mirrors VectorAddition input row ── */}
      <div style={{ width: "100%", maxWidth: 900, marginTop: "24px" }}>
        <div style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "11px", fontWeight: "600", letterSpacing: "0.1em", textTransform: "uppercase", color: T.slate, marginBottom: "10px" }}>
          Select an element to explore
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {(Object.keys(TABS) as TabKey[]).map((id) => {
            const m = TABS[id];
            const active = viewMode === id;
            return (
              <button
                key={id}
                onClick={() => setViewMode(id)}
                style={{
                  padding: "10px 18px",
                  borderRadius: "10px",
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  border: active ? `2px solid ${m.color}` : `2px solid ${T.border}`,
                  background: active ? `${m.color}15` : T.card,
                  color: active ? m.color : T.slate,
                  transition: "all 0.18s ease",
                  transform: active ? "translateY(-1px)" : "none",
                  boxShadow: active ? `0 4px 12px ${m.color}28` : "none",
                }}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Info / result card — mirrors VectorAddition result card ── */}
      <div
        key={viewMode}
        style={{
          width: "100%",
          maxWidth: 900,
          marginTop: "16px",
          borderRadius: "14px",
          border: `2px solid ${meta.border}`,
          background: meta.bg,
          padding: "24px 28px",
          boxShadow: `0 2px 12px ${meta.color}18`,
        }}
      >
        {/* Card header */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
          <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "18px", fontWeight: "700", color: meta.color, margin: 0 }}>
            {content.title}
          </h3>
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "12px", fontWeight: "600", color: meta.color, background: `${meta.color}18`, padding: "3px 10px", borderRadius: "20px" }}>
            {content.symbol}
          </span>
        </div>

        {/* Description */}
        <p style={{ fontSize: "14px", color: T.navyMid, lineHeight: 1.75, margin: "0 0 18px" }}>
          {content.description}
        </p>

        <div style={{ background: T.card, border: `1px solid ${meta.border}`, borderRadius: "10px", padding: "16px 24px", fontFamily: "JetBrains Mono, monospace", fontSize: "clamp(14px, 2vw, 18px)", fontWeight: "600", color: meta.color, letterSpacing: "0.02em", textAlign: "center", boxShadow: `0 2px 10px ${meta.color}18` }}>
          {content.formula}
        </div>

        {/* Note pill */}
        <div style={{ marginTop: "12px", display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "600", color: meta.color, background: `${meta.color}14`, padding: "5px 12px", borderRadius: "20px" }}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 7v4M8 5.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {content.note}
        </div>
      </div>

    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Page shell — mirrors addition.tsx exactly
   ═══════════════════════════════════════════════════════════════════════════ */

export default function VectorCalculusIntroPage() {
  return (
    <div
      style={{ fontFamily: "Inter, sans-serif", background: T.bg, minHeight: "100vh", color: T.navy }}
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col"
    >

      {/* ── Page title — mirrors addition.tsx title block ── */}
      <div style={{ fontFamily: "Space Grotesk, sans-serif" }}
           className="text-xl sm:text-2xl lg:text-3xl font-black uppercase text-center py-8">
        Differential Length, Area and Volume
      </div>

      {/* ── Interactive Demo section — mirrors addition.tsx demo block ── */}
      <div className="pb-10">
        <div style={{ fontFamily: "Space Grotesk, sans-serif" }}
             className="text-xl font-black uppercase text-center py-6">
          INTERACTIVE DEMO
        </div>
        <div className="flex justify-center">
          <DifferentialElementsDemo />
        </div>
      </div>

      {/* ── Theory / explanation section — mirrors addition.tsx explanation block ── */}
      <div className="space-y-6 pb-16">

        {/* Intro paragraph */}
        <p style={{ fontSize: "15px", lineHeight: 1.75, color: T.navyMid }}>
          Differential elements in length, area, and volume are useful in Vector Calculus. They are
          defined in the <strong>Cartesian</strong>, <strong>cylindrical</strong>, and{" "}
          <strong>spherical</strong> coordinate systems. These concepts are fundamental to
          understanding vector calculus and its applications in physics, engineering, and mathematics.
        </p>

        {/* Cartesian section heading */}
        <div style={{ fontFamily: "Space Grotesk, sans-serif" }}
             className="text-xl font-black uppercase text-center py-4 border-t border-slate-200">
          CARTESIAN COORDINATE SYSTEM
        </div>

        <p style={{ fontSize: "15px", lineHeight: 1.75, color: T.navyMid }}>
          We notice that the differential displacement <strong>dl</strong> at point{" "}
          <em>P</em> is the vector from point <em>P(x, y, z)</em> to point{" "}
          <em>Q(x + dx, y + dy, z + dz)</em>.
        </p>

        {/* Summary table of all three differential elements */}
        <div style={{ fontFamily: "Space Grotesk, sans-serif" }}
             className="text-lg font-semibold mt-4 mb-2">
          Summary of Differential Elements
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            {
              num: "1",
              title: "Differential displacement (length)",
              formula: "dl = dx x̂ + dy ŷ + dz ẑ",
              color: T.amber,
            },
            {
              num: "2",
              title: "Differential normal surface areas",
              formula: "dSx = dy dz x̂\ndSy = dx dz ŷ\ndSz = dx dy ẑ",
              color: T.blue,
            },
            {
              num: "3",
              title: "Differential volume",
              formula: "dV = dx dy dz",
              color: T.purple,
            },
          ].map(({ num, title, formula, color }) => (
            <div
              key={num}
              style={{
                background: T.card,
                border: `1px solid ${T.border}`,
                borderLeft: `4px solid ${color}`,
                borderRadius: "10px",
                padding: "18px 22px",
                display: "flex",
                gap: "18px",
                alignItems: "flex-start",
              }}
            >
              {/* Number badge */}
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: `${color}20`, border: `2px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Space Grotesk, sans-serif", fontSize: "13px", fontWeight: "700", color, flexShrink: 0 }}>
                {num}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "14px", fontWeight: "600", color: T.navy, marginBottom: "10px" }}>
                  {title}
                </div>
                <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "12px 18px", fontFamily: "JetBrains Mono, monospace", fontSize: "13px", fontWeight: "600", color, whiteSpace: "pre-line", lineHeight: 1.8 }}>
                  {formula}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}