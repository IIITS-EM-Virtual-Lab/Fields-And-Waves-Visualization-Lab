import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

type ChargeProps = {
  charge: { position: THREE.Vector3; q: number };
  index: number;
  onDrag: (index: number, newPos: THREE.Vector3) => void;
  setIsDragging: (dragging: boolean) => void;
  onRemove: (index: number) => void;
  trashMode: boolean;
  setTrashMode: (value: boolean) => void;
  forceVector: THREE.Vector3;
};

function Charge({
  charge,
  index,
  onDrag,
  setIsDragging,
  onRemove,
  trashMode,
  setTrashMode,
  forceVector,
}: ChargeProps) {

  const meshRef = useRef<THREE.Mesh>(null!);

  const [dragging, setDragging] = useState(false);
  const [livePosition, setLivePosition] = useState(charge.position.clone());

  const color = charge.q >= 0 ? "green" : "red";

  // stop drag if pointer released anywhere
  useEffect(() => {

    const handlePointerUp = () => {
      setDragging(false);
      setIsDragging(false);
    };

    window.addEventListener("pointerup", handlePointerUp);

    return () => window.removeEventListener("pointerup", handlePointerUp);

  }, [setIsDragging]);

  // update UI position
  useEffect(() => {
    setLivePosition(charge.position.clone());
  }, [charge.position]);

  useFrame(() => {

    if (dragging && !trashMode && meshRef.current) {

      const pos = (window as any).mouse3D;

      if (!pos) return;

      meshRef.current.position.copy(pos);

      const newPos = pos.clone();

      setLivePosition(newPos);

      onDrag(index, newPos);

    }

  });

  // ----- Force formatting -----
  const F = forceVector.length();

  let mantissa = 0;
  let exponent = 0;

  if (F > 0) {
    exponent = Math.floor(Math.log10(F));
    mantissa = F / Math.pow(10, exponent);
  }

  return (
    <mesh
      ref={meshRef}
      position={charge.position}

      onPointerDown={(e) => {

        e.stopPropagation();

        // Delete mode
        if (trashMode) {
          onRemove(index);
          setTrashMode(false);
          return;
        }

        // Drag mode
        setDragging(true);
        setIsDragging(true);

      }}

      onPointerUp={(e) => {
        e.stopPropagation();
        setDragging(false);
        setIsDragging(false);
      }}
    >

      <sphereGeometry args={[0.3, 32, 32]} />

      <meshStandardMaterial color={color} />

      <Html position={[0, 1, 0]} center distanceFactor={8}>

        <div
          style={{
            color: color,
            fontWeight: "bold",
            fontSize: "18px",
            userSelect: "none",
            whiteSpace: "nowrap",
          }}
        >
          {charge.q > 0 ? "+" : ""}
          {charge.q} nC
        </div>

        <div
          style={{
            fontWeight: "bold",
            color: color,
            fontSize: "18px",
            userSelect: "none",
            whiteSpace: "nowrap",
          }}
        >
          ({livePosition.x.toFixed(2)}, {livePosition.y.toFixed(2)},{" "}
          {livePosition.z.toFixed(2)})
        </div>

        <div
          style={{
            fontWeight: "bold",
            fontSize: "18px",
            color: color,
            userSelect: "none",
            whiteSpace: "nowrap",
          }}
        >
          |F| = {mantissa.toFixed(2)} × 10<sup>{exponent}</sup> N
        </div>

      </Html>

    </mesh>
  );
}

export default Charge;