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
    trashMode: boolean
};


function Charge({ charge, index, onDrag, setIsDragging, onRemove, trashMode }: ChargeProps) {
    const meshRef = useRef<THREE.Mesh>(null!);
    const [dragging, setDragging] = useState(false);
    const color = charge.q > 0 ? 'red' : 'blue';

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
            meshRef.current.position.x = (window as any).mouse3D?.x || 0;
            meshRef.current.position.y = (window as any).mouse3D?.y || 0;
            meshRef.current.position.z = (window as any).mouse3D?.z || 0;
            onDrag(index, meshRef.current.position);
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
            <Html position={[0, 0.5, 0]} center distanceFactor={8}>
                <div style={{ color: color, fontWeight: 'bold', fontSize: '18px', userSelect: 'none' }}>
                    {charge.q > 0 ? '+' : ''}{charge.q}
                </div>
            </Html>
        </mesh>
    );
}

export default Charge;