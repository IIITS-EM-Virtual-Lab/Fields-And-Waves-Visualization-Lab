import { useMemo } from "react";
import * as THREE from "three";

type TriangleProps = {
  a: [number, number, number];
  b: [number, number, number];
  color?: string;
};

function TrianglePlane({ a, b, color = "orange" }: TriangleProps) {
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      0, 0, 0,     // Origin
      ...a,        // Vector A
      ...b         // Vector B
    ]);
    geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geom.computeVertexNormals();
    return geom;
  }, [a, b]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.5} />
    </mesh>
  );
}

export default TrianglePlane;