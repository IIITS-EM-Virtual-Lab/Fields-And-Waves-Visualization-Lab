import * as THREE from 'three';
import CustomArrow from './CustomArrow';

type FieldVisualizerProps = {
    charges: { position: THREE.Vector3; q: number }[]
    visible: boolean,
    arrowColor: string
};

function FieldVisualizer({ charges, visible, arrowColor }: FieldVisualizerProps) {
    const arrows = [];
    if (!visible) return null;
    const spacing = 1;
    const limit = 5;

    for (let x = -limit; x <= limit; x += spacing) {
        for (let y = -limit; y <= limit; y += spacing) {
            for (let z = -limit; z <= limit; z += spacing) {
                const point = new THREE.Vector3(x, y, z);
                let field = new THREE.Vector3();
                for (const ch of charges) {
                    const r = new THREE.Vector3().subVectors(point, ch.position);
                    const rLenSq = r.lengthSq() + 0.1;
                    const rUnit = r.clone().normalize();
                    field.add(rUnit.multiplyScalar(ch.q / rLenSq));
                }
                const dir = field.clone().normalize();
                const len = Math.min(field.length(), 1);
                const arrow = (
                    <CustomArrow
                        key={`arrow-${x}-${y}-${z}`}
                        dir={dir}
                        origin={point}
                        length={len}
                        color={arrowColor}
                        headColor={arrowColor}
                    />
                );
                arrows.push(arrow);
            }
        }
    }
    return <>{arrows}</>;
}

export default FieldVisualizer;