import { useMemo } from 'react';
import * as THREE from 'three';

type Props = {
  vector: [number, number, number];
  color?: string;
};

export default function VectorArrow({ vector, color = 'hotpink' }: Props) {
  const arrowHelper = useMemo(() => {
    const dir = new THREE.Vector3(...vector).normalize();
    const length = new THREE.Vector3(...vector).length();
    return new THREE.ArrowHelper(dir, new THREE.Vector3(0, 0, 0), length, new THREE.Color(color));
  }, [vector, color]);

  return <primitive object={arrowHelper} />;
}