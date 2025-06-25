import { useRef, useEffect } from 'react';
import * as THREE from 'three';


function CustomArrow({ dir, origin, length, color = "white", headColor = "green" }: any) {
    const ref = useRef<THREE.Group>(null);

    useEffect(() => {
        if (ref.current) {
            while (ref.current.children.length) {
                ref.current.remove(ref.current.children[0]);
            }
            const arrow = new THREE.ArrowHelper(dir, origin, length, new THREE.Color(color), 0.1, 0.05);
            (arrow.cone.material as THREE.MeshBasicMaterial).color.set(headColor);
            ref.current.add(arrow);
        }
    }, [dir, origin, length, color, headColor]);

    return <group ref={ref} />;
}

export default CustomArrow;