// import { useState } from "react";
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls, Html } from "@react-three/drei";
// import { create, all } from "mathjs";
// import Axes from "./Axes";
// import VectorArrow from "./VectorArrow";

// const math = create(all);

// function DelOperator() {
//   const [scalarField, setScalarField] = useState("x^2 + y^2 + z^2");
//   const [vectorField, setVectorField] = useState(["x*y", "y*z", "z*x"]);
//   const [point, setPoint] = useState({ x: 1, y: 1, z: 1 });

//   const [gradient, setGradient] = useState([0, 0, 0]);
//   const [divergence, setDivergence] = useState(0);
//   const [curl, setCurl] = useState([0, 0, 0]);

//   const compute = () => {
//     const scope = { x: point.x, y: point.y, z: point.z };

//     // Gradient of scalar field
//     const grad = ["x", "y", "z"].map((v) => {
//       const d = math.derivative(scalarField, v);
//       return d.evaluate(scope);
//     });

//     // Divergence of vector field
//     const div = ["x", "y", "z"]
//       .map((v, i) => {
//         const d = math.derivative(vectorField[i], v);
//         return d.evaluate(scope);
//       })
//       .reduce((a, b) => a + b, 0);

//     // Curl of vector field
//     const partial = (expr: string, v: string) =>
//       math.derivative(expr, v).evaluate(scope);
//     const curlVec = [
//       partial(vectorField[2], "y") - partial(vectorField[1], "z"),
//       partial(vectorField[0], "z") - partial(vectorField[2], "x"),
//       partial(vectorField[1], "x") - partial(vectorField[0], "y"),
//     ];

//     setGradient(grad);
//     setDivergence(div);
//     setCurl(curlVec);
//   };

//   return (
//     <div className="flex flex-col items-center gap-4 p-4">
//       <div className="flex gap-4">
//         <div>
//           <h2 className="font-bold">Scalar Field F(x, y, z):</h2>
//           <input
//             type="text"
//             value={scalarField}
//             onChange={(e) => setScalarField(e.target.value)}
//             className="border p-1 w-60"
//           />
//         </div>
//         <div>
//           <h2 className="font-bold">Vector Field F(x, y, z):</h2>
//           <div className="flex gap-2">
//             <input
//               value={vectorField[0]}
//               onChange={(e) =>
//                 setVectorField([e.target.value, vectorField[1], vectorField[2]])
//               }
//               className="border p-1 w-20"
//             />
//             <input
//               value={vectorField[1]}
//               onChange={(e) =>
//                 setVectorField([vectorField[0], e.target.value, vectorField[2]])
//               }
//               className="border p-1 w-20"
//             />
//             <input
//               value={vectorField[2]}
//               onChange={(e) =>
//                 setVectorField([vectorField[0], vectorField[1], e.target.value])
//               }
//               className="border p-1 w-20"
//             />
//           </div>
//         </div>
//         <div>
//           <h2 className="font-bold">Point P:</h2>
//           <div className="flex gap-2">
//             <input
//               type="number"
//               value={point.x}
//               onChange={(e) =>
//                 setPoint({ ...point, x: Number(e.target.value) })
//               }
//               className="border p-1 w-16"
//             />
//             <input
//               type="number"
//               value={point.y}
//               onChange={(e) =>
//                 setPoint({ ...point, y: Number(e.target.value) })
//               }
//               className="border p-1 w-16"
//             />
//             <input
//               type="number"
//               value={point.z}
//               onChange={(e) =>
//                 setPoint({ ...point, z: Number(e.target.value) })
//               }
//               className="border p-1 w-16"
//             />
//           </div>
//         </div>
//         <button
//           onClick={compute}
//           className="bg-blue-500 text-white px-3 py-1 rounded"
//         >
//           Compute
//         </button>
//       </div>

//       <div
//         className="relative border-2 border-blue-600 rounded-lg overflow-hidden"
//         style={{ height: 500, width: 800, zIndex: 0 }}
//       >
//         <Canvas camera={{ position: [1, 2, 5] }}>
//           <ambientLight intensity={0.5} />
//           <pointLight position={[10, 10, 10]} />
//           <OrbitControls />
//           <Axes length={20} width={3} fontPosition={5.5} interval={1} />

//           {/* Gradient vector */}
//           <VectorArrow
//             vector={gradient as [number, number, number]}
//             origin={[point.x, point.y, point.z]}
//             color="red"
//             label="∇F"
//           />
//           {/* Curl vector */}
//           <VectorArrow
//             vector={curl as [number, number, number]}
//             origin={[point.x, point.y, point.z]}
//             color="green"
//             label="∇×F"
//           />

//           {/* Point marker */}
//           <mesh position={[point.x, point.y, point.z]}>
//             <sphereGeometry args={[0.1, 32, 32]} />
//             <meshStandardMaterial color="blue" />
//           </mesh>
//           <Html
//             position={[point.x + 0.1, point.y + 0.2, point.z + 0.1]}
//             center
//             distanceFactor={8}
//           >
//             <div
//               style={{
//                 color: "blue",
//                 fontSize: "20px",
//                 userSelect: "none",
//                 whiteSpace: "nowrap",
//               }}
//             >
//               P
//             </div>
//           </Html>
//         </Canvas>
//       </div>

//       <div className="flex justify-center items-center gap-8 py-3 bg-gray-50 border-t text-sm font-medium">
//         <div className="flex items-center gap-2">
//           <span className="w-3 h-3 rounded-full bg-red-500"></span>
//           <span>X-axis</span>
//         </div>

//         <div className="flex items-center gap-2">
//           <span className="w-3 h-3 rounded-full bg-green-500"></span>
//           <span>Y-axis</span>
//         </div>

//         <div className="flex items-center gap-2">
//           <span className="w-3 h-3 rounded-full bg-blue-500"></span>
//           <span>Z-axis</span>
//         </div>
//       </div>

//       <div className="gap-4 text-lg mt-4">
//         <label>
//           Gradient of a Scalar F: ∇ F = ({gradient[0]}, {gradient[1]},{" "}
//           {gradient[2]}){" "}
//         </label>
//         <br />
//         <label>Del Operator on vector F: ∇·F = {divergence.toFixed(2)}</label>
//         <br />
//         <label>
//           Curl of vector F: ∇xF = ({curl[0]}, {curl[1]}, {curl[2]}){" "}
//         </label>
//       </div>
//     </div>
//   );
// }

// export default DelOperator;

import React, { useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";

// --- CUSTOM NUMERICAL EVALUATOR ---
// Robust parsing that handles implicit multiplication and common math functions
function safeEval(expr: string, x: number, y: number, z: number): number {
  try {
    let parsedExpr = String(expr).toLowerCase();
    
    // Implicit multiplication fixes
    parsedExpr = parsedExpr.replace(/(\d)([xyz])/g, "$1*$2"); // '2x' -> '2*x'
    parsedExpr = parsedExpr.replace(/([xyz])(\d)/g, "$1*$2"); // 'x2' -> 'x*2'
    parsedExpr = parsedExpr.replace(/([xyz])([xyz])/g, "$1*$2"); // 'xy' -> 'x*y'
    parsedExpr = parsedExpr.replace(/([xyz])([xyz])/g, "$1*$2"); // run twice for 'xyz' -> 'x*y*z'
    parsedExpr = parsedExpr.replace(/\^/g, "**"); // 'x^2' -> 'x**2'
    
    const mathFuncs = ["sin", "cos", "tan", "exp", "log", "sqrt", "abs"];
    mathFuncs.forEach(fn => {
       parsedExpr = parsedExpr.replace(new RegExp(`\\b${fn}\\b`, 'g'), `Math.${fn}`);
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

// Numerical derivative using central difference
function partialDerivative(expr: string, variable: 'x' | 'y' | 'z', x: number, y: number, z: number): number {
  const h = 1e-4; 
  if (variable === 'x') {
    return (safeEval(expr, x + h, y, z) - safeEval(expr, x - h, y, z)) / (2 * h);
  } else if (variable === 'y') {
    return (safeEval(expr, x, y + h, z) - safeEval(expr, x, y - h, z)) / (2 * h);
  } else {
    return (safeEval(expr, x, y, z + h) - safeEval(expr, x, y, z - h)) / (2 * h);
  }
}

// --- HELPER COMPONENTS ---

// Replaced buggy <Line> with native <cylinderGeometry> for total stability
function Axes({ length = 10, width = 0.03 }: { length?: number; width?: number }) {
  return (
    <group>
      {/* X axis */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[width, width, length * 2, 8]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      {/* Y axis */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[width, width, length * 2, 8]} />
        <meshBasicMaterial color="#22c55e" />
      </mesh>
      {/* Z axis */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[width, width, length * 2, 8]} />
        <meshBasicMaterial color="#3b82f6" />
      </mesh>
    </group>
  );
}

type VectorArrowProps = {
  vector: [number, number, number] | number[];
  origin?: [number, number, number] | number[];
  color?: string;
  label?: string;
  opacity?: number;
  thickness?: number;
};

// Replaced buggy <arrowHelper> with native Meshes (Cylinder + Cone)
function VectorArrow({ vector, origin = [0, 0, 0], color = "red", label = "", opacity = 1, thickness = 0.08 }: VectorArrowProps) {
  const dir = new THREE.Vector3(...vector);
  const length = dir.length();
  
  if (length < 1e-4) return null; 
  dir.normalize();
  
  const start = new THREE.Vector3(...origin);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  
  const headLength = Math.min(length * 0.3, 0.4);
  const headWidth = thickness * 2.5;
  const shaftLength = Math.max(0, length - headLength);
  
  const shaftPos = start.clone().add(dir.clone().multiplyScalar(shaftLength / 2));
  const headPos = start.clone().add(dir.clone().multiplyScalar(shaftLength + headLength / 2));
  const labelPos = start.clone().add(dir.clone().multiplyScalar(length + 0.3));

  return (
    <group>
      {shaftLength > 0 && (
        <mesh position={shaftPos} quaternion={quaternion}>
          <cylinderGeometry args={[thickness, thickness, shaftLength, 8]} />
          <meshStandardMaterial color={color} transparent={opacity < 1} opacity={opacity} />
        </mesh>
      )}
      <mesh position={headPos} quaternion={quaternion}>
        <coneGeometry args={[headWidth, headLength, 8]} />
        <meshStandardMaterial color={color} transparent={opacity < 1} opacity={opacity} />
      </mesh>
      {label && opacity === 1 && (
        <Html position={labelPos} center distanceFactor={8}>
          <div style={{ color: color, fontSize: '15px', fontWeight: 'bold', textShadow: '1px 1px 2px white' }}>
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

// --- MAIN COMPONENT ---
export default function DelOperator() {
  const [scalarField, setScalarField] = useState("x^2 + y^2 - z^2");
  const [vectorField, setVectorField] = useState(["-y", "x", "0"]);
  
  // Point state as strings to allow typing minus signs smoothly
  const [pxStr, setPxStr] = useState("1");
  const [pyStr, setPyStr] = useState("1");
  const [pzStr, setPzStr] = useState("1");

  // Safe parsing for 3D coordinates
  const px = parseFloat(pxStr) || 0;
  const py = parseFloat(pyStr) || 0;
  const pz = parseFloat(pzStr) || 0;

  // 1. Gradient of scalar field (∇F)
  const gradient = useMemo(() => [
    partialDerivative(scalarField, "x", px, py, pz),
    partialDerivative(scalarField, "y", px, py, pz),
    partialDerivative(scalarField, "z", px, py, pz)
  ], [scalarField, px, py, pz]);

  // 2. Divergence of vector field (∇·F)
  const divergence = useMemo(() => {
    return partialDerivative(vectorField[0], "x", px, py, pz) + 
           partialDerivative(vectorField[1], "y", px, py, pz) + 
           partialDerivative(vectorField[2], "z", px, py, pz);
  }, [vectorField, px, py, pz]);

  // 3. Curl of vector field (∇×F)
  const curlVec = useMemo(() => [
    partialDerivative(vectorField[2], "y", px, py, pz) - partialDerivative(vectorField[1], "z", px, py, pz),
    partialDerivative(vectorField[0], "z", px, py, pz) - partialDerivative(vectorField[2], "x", px, py, pz),
    partialDerivative(vectorField[1], "x", px, py, pz) - partialDerivative(vectorField[0], "y", px, py, pz)
  ], [vectorField, px, py, pz]);

  // 4. Generate local vector field grid to provide visual context for Curl & Div
  const localGrid = useMemo(() => {
    const grid = [];
    const step = 0.8;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        for (let k = -1; k <= 1; k++) {
           if (i === 0 && j === 0 && k === 0) continue; // Skip exact center to avoid overlapping
           const cx = px + i*step;
           const cy = py + j*step;
           const cz = pz + k*step;
           
           const vx = safeEval(vectorField[0], cx, cy, cz);
           const vy = safeEval(vectorField[1], cx, cy, cz);
           const vz = safeEval(vectorField[2], cx, cy, cz);
           
           const scale = 0.3; 
           grid.push({
              origin: [cx, cy, cz],
              vec: [vx * scale, vy * scale, vz * scale]
           });
        }
      }
    }
    return grid;
  }, [vectorField, px, py, pz]);

  const formatNum = (n: number) => Number.isFinite(n) ? n.toFixed(2) : "0.00";

  return (
    <div className="flex flex-col items-center gap-4 p-4 font-sans text-gray-800 bg-white">
      
      {/* --- TOP INPUTS --- */}
      <div className="flex flex-wrap justify-center gap-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h2 className="font-bold text-sm mb-1 text-gray-700">Scalar Field F(x, y, z):</h2>
          <input
            type="text"
            value={scalarField}
            onChange={(e) => setScalarField(e.target.value)}
            className="border border-gray-300 p-1 w-60 rounded shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <h2 className="font-bold text-sm mb-1 text-gray-700">Vector Field F(x, y, z):</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={vectorField[0]}
              onChange={(e) => setVectorField([e.target.value, vectorField[1], vectorField[2]])}
              className="border border-gray-300 p-1 w-24 rounded shadow-sm focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              value={vectorField[1]}
              onChange={(e) => setVectorField([vectorField[0], e.target.value, vectorField[2]])}
              className="border border-gray-300 p-1 w-24 rounded shadow-sm focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              value={vectorField[2]}
              onChange={(e) => setVectorField([vectorField[0], vectorField[1], e.target.value])}
              className="border border-gray-300 p-1 w-24 rounded shadow-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        
        <div>
          <h2 className="font-bold text-sm mb-1 text-gray-700">Point P (x,y,z):</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={pxStr}
              onChange={(e) => setPxStr(e.target.value)}
              className="border border-gray-300 p-1 w-16 rounded text-center shadow-sm focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              value={pyStr}
              onChange={(e) => setPyStr(e.target.value)}
              className="border border-gray-300 p-1 w-16 rounded text-center shadow-sm focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              value={pzStr}
              onChange={(e) => setPzStr(e.target.value)}
              className="border border-gray-300 p-1 w-16 rounded text-center shadow-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* --- CANVAS --- */}
      <div
        className="relative border border-gray-300 rounded-xl overflow-hidden bg-gray-50 shadow-inner"
        style={{ height: 500, width: 800, zIndex: 0 }}
      >
        <Canvas camera={{ position: [4, 4, 6], fov: 45 }}>
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <OrbitControls makeDefault />
          
          <Axes length={10} width={0.03} />
          <gridHelper args={[20, 20, '#e5e7eb', '#f3f4f6']} position={[0, -0.01, 0]} />

          {/* Point P Marker */}
          <mesh position={[px, py, pz]}>
            <sphereGeometry args={[0.15, 32, 32]} />
            <meshStandardMaterial color="#3b82f6" />
          </mesh>
          <Html position={[px + 0.2, py + 0.2, pz + 0.2]} center distanceFactor={8}>
            <div style={{ color: "#2563eb", fontSize: "20px", fontWeight: "bold", userSelect: "none" }}>
              P
            </div>
          </Html>

          {/* Gradient Vector (Red) */}
          <VectorArrow vector={gradient} origin={[px, py, pz]} color="#ef4444" label="∇F (Grad)" thickness={0.08} />
          
          {/* Curl Vector (Green) */}
          <VectorArrow vector={curlVec} origin={[px, py, pz]} color="#22c55e" label="∇×F (Curl)" thickness={0.08} />

          {/* Local Vector Field Flow (Gray) */}
          {localGrid.map((item, idx) => (
             <VectorArrow 
               key={idx} 
               vector={item.vec} 
               origin={item.origin} 
               color="#9ca3af" // Gray-400
               opacity={0.5} 
               thickness={0.03} 
             />
          ))}

        </Canvas>
      </div>

      {/* --- LEGEND --- */}
      <div className="flex justify-center items-center gap-8 py-3 w-[800px] bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span>X-axis / Gradient</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span>Y-axis / Curl</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500"></span>
          <span>Z-axis / Point P</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-gray-400"></span>
          <span>Vector Field Flow</span>
        </div>
      </div>

      {/* --- TEXT OUTPUT --- */}
      <div className="flex flex-col gap-2 text-lg w-[800px] p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="flex gap-2">
          <span className="font-bold text-red-600">Gradient (Scalar F):</span> 
          <span>∇F = ({formatNum(gradient[0])}, {formatNum(gradient[1])}, {formatNum(gradient[2])})</span>
        </div>
        <div className="flex gap-2">
          <span className="font-bold text-blue-600">Divergence (Vector F):</span> 
          <span>∇·F = {formatNum(divergence)}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-bold text-green-600">Curl (Vector F):</span> 
          <span>∇×F = ({formatNum(curlVec[0])}, {formatNum(curlVec[1])}, {formatNum(curlVec[2])})</span>
        </div>
      </div>

    </div>
  );
}