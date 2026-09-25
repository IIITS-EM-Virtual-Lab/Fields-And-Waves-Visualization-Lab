import React, { useState, useMemo, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import Axes from "./Axes";
import VectorArrow from "./VectorArrow";
import CanvasControlsToolbar from "./CanvasControlsToolbar";

// --- NUMERICAL EVALUATOR & PARTIAL DERIVATIVES ---
function safeEval(expr: string, x: number, y: number, z: number): number {
  try {
    if (!expr || typeof expr !== "string") return 0;
    let parsedExpr = String(expr).toLowerCase().trim();
    if (!parsedExpr) return 0;

    // Implicit multiplication fixes
    parsedExpr = parsedExpr.replace(/(\d)([xyz])/g, "$1*$2");
    parsedExpr = parsedExpr.replace(/([xyz])(\d)/g, "$1*$2");
    parsedExpr = parsedExpr.replace(/([xyz])([xyz])/g, "$1*$2");
    parsedExpr = parsedExpr.replace(/([xyz])([xyz])/g, "$1*$2");
    parsedExpr = parsedExpr.replace(/\^/g, "**");

    const mathFuncs = ["sin", "cos", "tan", "exp", "log", "sqrt", "abs"];
    mathFuncs.forEach((fn) => {
      parsedExpr = parsedExpr.replace(
        new RegExp(`\\b${fn}\\b`, "g"),
        `Math.${fn}`,
      );
    });
    parsedExpr = parsedExpr.replace(/\bpi\b/g, "Math.PI");
    parsedExpr = parsedExpr.replace(/\be\b/g, "Math.E");

    const f = new Function("x", "y", "z", `return ${parsedExpr};`);
    const result = f(x, y, z);
    return Number.isFinite(result) ? result : 0;
  } catch (err) {
    return 0;
  }
}

function partialDerivative(
  expr: string,
  variable: "x" | "y" | "z",
  x: number,
  y: number,
  z: number,
): number {
  const h = 1e-4;
  if (variable === "x") {
    return (
      (safeEval(expr, x + h, y, z) - safeEval(expr, x - h, y, z)) / (2 * h)
    );
  } else if (variable === "y") {
    return (
      (safeEval(expr, x, y + h, z) - safeEval(expr, x, y - h, z)) / (2 * h)
    );
  } else {
    return (
      (safeEval(expr, x, y, z + h) - safeEval(expr, x, y, z - h)) / (2 * h)
    );
  }
}

export default function DelOperator() {
  const [scalarField, setScalarField] = useState("x^2 + y^2 + z^2");
  const [vectorField, setVectorField] = useState(["y", "x", "0"]);

  // Point state as strings to allow smooth typing
  const [pxStr, setPxStr] = useState("1");
  const [pyStr, setPyStr] = useState("1");
  const [pzStr, setPzStr] = useState("1");

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

  const px = parseFloat(pxStr) || 0;
  const py = parseFloat(pyStr) || 0;
  const pz = parseFloat(pzStr) || 0;

  // 1. Gradient of scalar field (∇F)
  const gradient = useMemo<[number, number, number]>(
    () => [
      partialDerivative(scalarField, "x", px, py, pz),
      partialDerivative(scalarField, "y", px, py, pz),
      partialDerivative(scalarField, "z", px, py, pz),
    ],
    [scalarField, px, py, pz],
  );

  // 2. Divergence of vector field (∇·F)
  const divergence = useMemo(() => {
    return (
      partialDerivative(vectorField[0], "x", px, py, pz) +
      partialDerivative(vectorField[1], "y", px, py, pz) +
      partialDerivative(vectorField[2], "z", px, py, pz)
    );
  }, [vectorField, px, py, pz]);

  // 3. Curl of vector field (∇×F)
  const curlVec = useMemo<[number, number, number]>(
    () => [
      partialDerivative(vectorField[2], "y", px, py, pz) -
        partialDerivative(vectorField[1], "z", px, py, pz),
      partialDerivative(vectorField[0], "z", px, py, pz) -
        partialDerivative(vectorField[2], "x", px, py, pz),
      partialDerivative(vectorField[1], "x", px, py, pz) -
        partialDerivative(vectorField[0], "y", px, py, pz),
    ],
    [vectorField, px, py, pz],
  );

  const gradMag = Math.sqrt(
    gradient[0] * gradient[0] +
      gradient[1] * gradient[1] +
      gradient[2] * gradient[2],
  );
  const curlMag = Math.sqrt(
    curlVec[0] * curlVec[0] + curlVec[1] * curlVec[1] + curlVec[2] * curlVec[2],
  );

  const formatNum = (n: number) => (Number.isFinite(n) ? n.toFixed(2) : "0.00");

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      {/* 3D Canvas Box matching theme */}
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

        <Canvas
          style={{ height: "100%", width: "100%" }}
          camera={{ position: [3, 2, 6], fov: 50 }}
        >
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />

          <OrbitControls
            ref={controlsRef}
            makeDefault
            mouseButtons={{
              LEFT:
                interactionMode === "rotate"
                  ? THREE.MOUSE.ROTATE
                  : THREE.MOUSE.PAN,
              MIDDLE: THREE.MOUSE.DOLLY,
              RIGHT:
                interactionMode === "rotate"
                  ? THREE.MOUSE.PAN
                  : THREE.MOUSE.ROTATE,
            }}
          />

          <Axes length={20} width={3} fontPosition={5.5} interval={1} />

          {/* Point P Marker */}
          <mesh position={[px, py, pz]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshBasicMaterial color="#3b82f6" />
          </mesh>
          <Html
            position={[px + 0.2, py + 0.2, pz + 0.2]}
            center
            distanceFactor={8}
          >
            <div
              style={{
                color: "#2563eb",
                fontSize: "18px",
                fontWeight: "bold",
                userSelect: "none",
              }}
            >
              P
            </div>
          </Html>

          {/* Gradient Vector (Purple / Resultant style) */}
          {gradMag > 1e-4 && (
            <VectorArrow
              vector={gradient}
              origin={[px, py, pz]}
              color="purple"
              label="∇F"
            />
          )}

          {/* Curl Vector (Dark Turquoise / Green) */}
          {curlMag > 1e-4 && (
            <VectorArrow
              vector={curlVec}
              origin={[px, py, pz]}
              color="#059669"
              label="∇×F"
            />
          )}
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
          <span className="w-3 h-3 rounded-full bg-purple-600"></span>
          <span>∇F (Gradient)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
          <span>∇×F (Curl)</span>
        </div>
      </div>

      {/* Input Controls */}
      <div className="flex flex-col gap-4 w-full max-w-[800px] bg-white p-4 border border-gray-200 rounded-lg shadow-xs">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="font-semibold text-gray-700 min-w-[170px]">
            Scalar Field F(x, y, z):
          </span>
          <input
            type="text"
            value={scalarField}
            onChange={(e) => setScalarField(e.target.value)}
            className="border border-gray-300 p-1.5 px-2 rounded w-64 text-sm font-mono focus:border-blue-500 focus:outline-none"
            placeholder="e.g. x^2 + y^2 + z^2"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="font-semibold text-gray-700 min-w-[170px]">
            Vector Field F(x, y, z):
          </span>
          <div className="flex items-center gap-2">
            <label className="text-gray-500 text-xs">
              Fx:
              <input
                type="text"
                value={vectorField[0]}
                onChange={(e) =>
                  setVectorField([
                    e.target.value,
                    vectorField[1],
                    vectorField[2],
                  ])
                }
                className="border border-gray-300 p-1.5 px-2 rounded ml-1 w-24 text-sm font-mono focus:border-blue-500 focus:outline-none"
              />
            </label>
            <label className="text-gray-500 text-xs">
              Fy:
              <input
                type="text"
                value={vectorField[1]}
                onChange={(e) =>
                  setVectorField([
                    vectorField[0],
                    e.target.value,
                    vectorField[2],
                  ])
                }
                className="border border-gray-300 p-1.5 px-2 rounded ml-1 w-24 text-sm font-mono focus:border-blue-500 focus:outline-none"
              />
            </label>
            <label className="text-gray-500 text-xs">
              Fz:
              <input
                type="text"
                value={vectorField[2]}
                onChange={(e) =>
                  setVectorField([
                    vectorField[0],
                    vectorField[1],
                    e.target.value,
                  ])
                }
                className="border border-gray-300 p-1.5 px-2 rounded ml-1 w-24 text-sm font-mono focus:border-blue-500 focus:outline-none"
              />
            </label>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="font-semibold text-gray-700 min-w-[170px]">
            Point P Coordinates:
          </span>
          <div className="flex items-center gap-2">
            <label className="text-gray-500 text-xs">
              X:
              <input
                type="text"
                value={pxStr}
                onChange={(e) => setPxStr(e.target.value)}
                className="border border-gray-300 p-1.5 px-2 rounded ml-1 w-20 text-sm text-center focus:border-blue-500 focus:outline-none"
              />
            </label>
            <label className="text-gray-500 text-xs">
              Y:
              <input
                type="text"
                value={pyStr}
                onChange={(e) => setPyStr(e.target.value)}
                className="border border-gray-300 p-1.5 px-2 rounded ml-1 w-20 text-sm text-center focus:border-blue-500 focus:outline-none"
              />
            </label>
            <label className="text-gray-500 text-xs">
              Z:
              <input
                type="text"
                value={pzStr}
                onChange={(e) => setPzStr(e.target.value)}
                className="border border-gray-300 p-1.5 px-2 rounded ml-1 w-20 text-sm text-center focus:border-blue-500 focus:outline-none"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Output Mathematical Display Cards */}
      <div className="flex flex-col gap-2.5 w-full max-w-[800px] p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm md:text-base">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="font-bold text-purple-700">
            Gradient of Scalar Field (∇F):
          </span>
          <span className="font-semibold">
            {formatNum(gradient[0])}{" "}
            <span className="italic text-gray-700 font-normal">î</span>{" "}
            {gradient[1] >= 0 ? "+ " : "- "}
            {Math.abs(gradient[1]).toFixed(2)}{" "}
            <span className="italic text-gray-700 font-normal">ĵ</span>{" "}
            {gradient[2] >= 0 ? "+ " : "- "}
            {Math.abs(gradient[2]).toFixed(2)}{" "}
            <span className="italic text-gray-700 font-normal">k̂</span>
          </span>
        </div>

        <div className="flex flex-wrap items-baseline gap-2">
          <span className="font-bold text-blue-700">
            Divergence of Vector Field (∇·F):
          </span>
          <span className="font-semibold text-gray-900">
            {formatNum(divergence)}
          </span>
        </div>

        <div className="flex flex-wrap items-baseline gap-2">
          <span className="font-bold text-emerald-700">
            Curl of Vector Field (∇×F):
          </span>
          <span className="font-semibold">
            {formatNum(curlVec[0])}{" "}
            <span className="italic text-gray-700 font-normal">î</span>{" "}
            {curlVec[1] >= 0 ? "+ " : "- "}
            {Math.abs(curlVec[1]).toFixed(2)}{" "}
            <span className="italic text-gray-700 font-normal">ĵ</span>{" "}
            {curlVec[2] >= 0 ? "+ " : "- "}
            {Math.abs(curlVec[2]).toFixed(2)}{" "}
            <span className="italic text-gray-700 font-normal">k̂</span>
          </span>
        </div>
      </div>
    </div>
  );
}
