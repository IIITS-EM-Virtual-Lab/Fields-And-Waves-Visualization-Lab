import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

type ChargeProps = {
    charge: { position: THREE.Vector3; q: number },
    index: number,
    onDrag: (index: number, newPos: THREE.Vector3) => void,
    setIsDragging: (dragging: boolean) => void,
    onRemove: (index: number) => void,
    trashMode: boolean,
    forceVector: THREE.Vector3
};


function Charge({ charge, index, onDrag, setIsDragging, onRemove, trashMode, forceVector }: ChargeProps) {
    const meshRef = useRef<THREE.Mesh>(null!);
    const [dragging, setDragging] = useState(false);
    const [livePosition, setLivePosition] = useState(charge.position);
    const color = charge.q >= 0 ? 'green' : 'red';

    useEffect(() => {
        const handlePointerUp = () => {
            setDragging(false);
            setIsDragging(false);
        };
        window.addEventListener('pointerup', handlePointerUp);
        return () => window.removeEventListener('pointerup', handlePointerUp);
    }, []);

    useFrame(() => {
        if (dragging && !trashMode && meshRef.current) {
            const pos = (window as any).mouse3D || new THREE.Vector3();
            meshRef.current.position.copy(pos);
            setLivePosition(pos.clone());
            onDrag(index, pos.clone());
        }
    });

    return (
        <mesh
            ref={meshRef}
            position={charge.position}
            onPointerDown={(e) => {
                e.stopPropagation();
                if (!trashMode) {
                    setDragging(true);
                    setIsDragging(true);
                }
            }}
            onPointerUp={(e) => {
                e.stopPropagation();
                setDragging(false);
                setIsDragging(false);
            }}
            onClick={(e) => {
                e.stopPropagation();
                if (trashMode) onRemove(index);
            }}
        >
            <sphereGeometry args={[0.3, 32, 32]} />
            <meshStandardMaterial color={color} />
            <Html position={[0, 1, 0]} center distanceFactor={8}>
                <div style={{ color: color, fontWeight: 'bold', fontSize: '18px', userSelect: 'none', whiteSpace: 'nowrap' }}>
                    {charge.q > 0 ? '+' : ''}{charge.q}C
                </div>
                <div style={{ fontWeight: 'bold', color: color, fontSize: '18px', userSelect: 'none', whiteSpace: 'nowrap' }}>
                    ({livePosition.x.toFixed(2)}, {livePosition.y.toFixed(2)}, {livePosition.z.toFixed(2)})
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '18px', color: color, userSelect: 'none', whiteSpace: 'nowrap' }}>
                    |F| = {forceVector.length().toExponential(2)} N
                </div>
            </Html>
        </mesh>
    );
}

export default Charge;