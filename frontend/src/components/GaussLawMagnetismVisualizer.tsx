import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Text } from "@react-three/drei";
import * as THREE from "three";
import Axes from "./Axes";

type MFLProps = {
    magnetLength: number;
    lineCount: number;
  };
  
  function MagneticFieldLines({ magnetLength, lineCount }: MFLProps) {
    const halfLength = magnetLength / 2;
    const poleRadius = 0.5;
    const arcRadius = 2.5;
  
    const curves = useMemo(() => {
      const lines: THREE.CatmullRomCurve3[] = [];
      for (let i = 0; i < lineCount; i++) {
        const angle = (i / lineCount) * Math.PI * 2;
        const northCap = new THREE.Vector3(
          Math.cos(angle) * poleRadius,
          halfLength,
          Math.sin(angle) * poleRadius
        );
        const northOut = new THREE.Vector3(
          Math.cos(angle) * (poleRadius + 0.2),
          halfLength + 0.1,
          Math.sin(angle) * (poleRadius + 0.2)
        );
        const archOut = new THREE.Vector3(
          Math.cos(angle) * arcRadius,
          0,
          Math.sin(angle) * arcRadius
        );
        const southIn = new THREE.Vector3(
          Math.cos(angle) * (poleRadius + 0.2),
          -halfLength - 0.1,
          Math.sin(angle) * (poleRadius + 0.2)
        );
        const southCap = new THREE.Vector3(
          Math.cos(angle) * poleRadius,
          -halfLength,
          Math.sin(angle) * poleRadius
        );
        const curve = new THREE.CatmullRomCurve3([
          northCap,
          northOut,
          archOut,
          southIn,
          southCap,
        ]);
        lines.push(curve);
      }
      return lines;
    }, [magnetLength, lineCount]);
  
    // Helper to get orientation for the arrow
    function ArrowAtCurve({ curve, t = 0.6, color = "green" }: { curve: THREE.CatmullRomCurve3, t?: number, color?: string }) {
      const pos = curve.getPoint(t);
      const tangent = curve.getTangent(t);
      // Create a quaternion that rotates [0,1,0] to the tangent direction
      const up = new THREE.Vector3(0, 1, 0);
      const quaternion = new THREE.Quaternion().setFromUnitVectors(up, tangent.clone().normalize());
      return (
        <mesh position={pos.toArray()} quaternion={quaternion}>
          <coneGeometry args={[0.07, 0.18, 16]} />
          <meshStandardMaterial color={color} />
        </mesh>
      );
    }
  
    return (
      <>
        {curves.map((curve, i) => (
          <group key={i}>
            <mesh>
              <tubeGeometry args={[curve, 128, 0.025, 12, false]} />
              <meshStandardMaterial color="green" transparent opacity={0.7} />
            </mesh>
            {/* Arrowhead at 60% along the curve */}
            <ArrowAtCurve curve={curve} t={0.6} color="green" />
          </group>
        ))}
      </>
    );
  }
  

type BMProps={
    magnetLength: number;
};

function BarMagnet({ magnetLength }: BMProps) {
    const [materials, setMaterials] = useState<THREE.MeshStandardMaterial[]>([]);

    useMemo(() => {
        // Gradient texture for sides
        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext("2d");
        if (ctx) {
            const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
            gradient.addColorStop(0, "blue");
            gradient.addColorStop(1, "red");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        const gradientTexture = new THREE.CanvasTexture(canvas);

        // Materials: [right, left, top, bottom, front, back]
        setMaterials([
            new THREE.MeshStandardMaterial({ map: gradientTexture }), // right
            new THREE.MeshStandardMaterial({ map: gradientTexture }), // left
            new THREE.MeshStandardMaterial({ color: "red" }),         // top (N)
            new THREE.MeshStandardMaterial({ color: "blue" }),        // bottom (S)
            new THREE.MeshStandardMaterial({ map: gradientTexture }), // front
            new THREE.MeshStandardMaterial({ map: gradientTexture }), // back
        ]);
    }, [magnetLength]);

    return (
        <mesh material={materials.length > 0 ? materials : undefined}>
            <boxGeometry args={[1, magnetLength, 0.5]} />
        </mesh>
    );
}

type GSProps={
    visible: boolean;
};

function GaussianSurface({ visible }: GSProps) {
  return (
    visible && (
      <mesh>
        <sphereGeometry args={[4, 64, 64]} />
        <meshStandardMaterial
          color="green"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    )
  );
}

export default function GaussLawMagnetismVisualizer() {
  const [magnetLength, setMagnetLength] = useState(4);
  const [lineCount, setLineCount] = useState(12);
  const [showGaussian, setShowGaussian] = useState(true);

  const flux = 0; // Gauss law: Net flux = 0 for magnetic monopoles

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl w-full">
        <div>
          <label className="font-bold">Magnet Length: </label>
          <input
            type="range"
            min="2"
            max="6"
            step="0.1"
            value={magnetLength}
            onChange={(e) => setMagnetLength(+e.target.value)}
            className="w-full"
          />
          <span>{magnetLength.toFixed(1)} m</span>
        </div>
        <div>
          <label className="font-bold">Field Lines: </label>
          <input
            type="range"
            min="6"
            max="24"
            step="1"
            value={lineCount}
            onChange={(e) => setLineCount(+e.target.value)}
            className="w-full"
          />
          <span>{lineCount}</span>
        </div>
        <div>
          <label className="flex items-center"><input
              type="checkbox"
              checked={showGaussian}
              onChange={(e) => setShowGaussian(e.target.checked)}
              className="mr-2"
            />
            Show Gaussian Surface
          </label>
        </div>
      </div>

      {/* Flux Display */}
      <div className="mt-4 bg-white border p-4 rounded shadow text-lg">
        <b>Magnetic Flux (Φ):</b> {flux.toExponential(2)} Wb (Gauss Law → 0)
      </div>

      {/* 3D Canvas */}
      <div
        className="relative overflow-hidden rounded-lg border-2 border-blue-600 mt-4 w-full max-w-4xl aspect-video bg-white"
        style={{ zIndex: 0 }}
      >
        <Canvas className="!h-full !w-full" camera={{ position: [8, 8, 8], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls />
          <gridHelper args={[20, 20]} />

          {/* Bar Magnet */}
          <group rotation={[0, 0, 0]}>
            <BarMagnet magnetLength={magnetLength} />
            <Text
              position={[0, magnetLength / 2 + 0.5, 0]}
              fontSize={0.5}
              color="red"
            >
              N
            </Text>
            <Text
              position={[0, -magnetLength / 2 - 0.5, 0]}
              fontSize={0.5}
              color="blue"
            >
              S
            </Text>
          </group>

          {/* Field Lines */}
          <MagneticFieldLines
            magnetLength={magnetLength}
            lineCount={lineCount}
          />

          {/* Gaussian Surface */}
          <GaussianSurface visible={showGaussian} />
        </Canvas>
      </div>
    </div>
  );
}