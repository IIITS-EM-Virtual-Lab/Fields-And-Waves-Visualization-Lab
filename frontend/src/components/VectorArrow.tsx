import { useMemo } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

type Props = {
  vector: [number, number, number];
  color?: string;
  label?: string;
};

function VectorArrow({ vector, color = 'hotpink', label }: Props) {
  const [shaftProps, coneProps, labelPosition] = useMemo(() => {
    const vec = new THREE.Vector3(...vector);
    const length = vec.length();
    const dir = vec.clone().normalize();

    // Rotation quaternion to rotate Y-axis to direction
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);

    const coneHeight = 0.3;
    const shaftLength = length - coneHeight;

    const shaftPosition = dir.clone().multiplyScalar(shaftLength / 2);
    const conePosition = dir.clone().multiplyScalar(shaftLength + coneHeight / 2);

    const shaftScale = [0.01, shaftLength, 0.01] as const;

    const labelOffset = 0.3; // how far beyond the tip the label appears
    const labelPos = dir.clone().multiplyScalar(length + labelOffset);

    return [
      {
        position: shaftPosition.toArray() as [number, number, number],
        quaternion,
        scale: shaftScale,
      },
      {
        position: conePosition.toArray() as [number, number, number],
        quaternion,
        height: coneHeight,
      },
      labelPos.toArray() as [number, number, number]
    ];
  }, [vector, color]);

  return (
    <group>
      {/* Cylinder shaft */}
      <mesh position={shaftProps.position} quaternion={shaftProps.quaternion}>
        <cylinderGeometry args={[shaftProps.scale[0], shaftProps.scale[2], shaftProps.scale[1], 12]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Cone tip */}
      <mesh position={coneProps.position} quaternion={coneProps.quaternion}>
        <coneGeometry args={[0.1, coneProps.height, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Optional Label */}
      {label && (
        <Html position={labelPosition} center distanceFactor={8}>
          <div style={{ color, fontSize: '20px', userSelect: 'none', whiteSpace: 'nowrap' }}>
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

export default VectorArrow;