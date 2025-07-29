import { Canvas } from '@react-three/fiber';
import { useState, useEffect } from 'react';
import * as THREE from 'three';
import Charge from './Charge';
import Controls from './Controls';
import FieldVisualizer from './FieldVisualizer';

const initialCharges: { position: THREE.Vector3; q: number }[] = [];

const k = 8.99e9; // Coulomb constant in Nm^2/C^2

function computeForces(charges: { position: THREE.Vector3; q: number }[]) {
    return charges.map((chargeA, i) => {
        let netForce = new THREE.Vector3(0, 0, 0);

        charges.forEach((chargeB, j) => {
        if (i !== j) {
            const r = new THREE.Vector3().subVectors(chargeB.position, chargeA.position);
            const distance = r.length();
            if (distance > 0.001) { // avoid divide-by-zero
            const forceMagnitude = (k * chargeA.q * chargeB.q * 1e-18) / (distance * distance); // convert nC to C
            const force = r.normalize().multiplyScalar(forceMagnitude);
            netForce.add(force);
            }
        }
        });

        return netForce;
    });
}


function CoulombVisualizer() {
    const [charges, setCharges] = useState(initialCharges);
    const [showField, setShowField] = useState(true);
    const [inputCharge, setInputCharge] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [trashMode, setTrashMode] = useState(false);
    const forces = computeForces(charges);

    const handleDrag = (index: number, newPos: THREE.Vector3) => {
        setCharges((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], position: newPos.clone() };
            return updated;
        });
    };

    const handleRemoveCharge = (index: number) => {
        setCharges((prev) => prev.filter((_, i) => i !== index));
    };

    const addNewCharge = (sign: number) => {
        const charge = {
            position: new THREE.Vector3(0, 0, 0),
            q: sign * Math.abs(inputCharge),
        };
        setCharges((prev) => [...prev, charge]);
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2(
              (e.clientX / window.innerWidth) * 2 - 1,
              -(e.clientY / window.innerHeight) * 2 + 1
            );
            raycaster.setFromCamera(mouse, (window as any).camera);
        
            // Create a plane **perpendicular to camera look direction**, passing through origin
            const camera = (window as any).camera;
            const cameraDirection = new THREE.Vector3();
            camera.getWorldDirection(cameraDirection);
            const plane = new THREE.Plane();
            plane.setFromNormalAndCoplanarPoint(cameraDirection, new THREE.Vector3(0, 0, 0));
        
            const point = new THREE.Vector3();
            raycaster.ray.intersectPlane(plane, point);
            (window as any).mouse3D = point;
        };
        
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="relative overflow-hidden w-full h-screen bg-white border-2 border-blue-600 z-0">
            <Canvas onCreated={({ camera }) => ((window as any).camera = camera)} camera={{position: [7, 7, 7]}}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Controls enabled={!isDragging} />

                {charges.map((ch, i) => (
                    <Charge
                        key={i}
                        charge={ch}
                        index={i}
                        onDrag={handleDrag}
                        setIsDragging={setIsDragging}
                        onRemove={handleRemoveCharge}
                        trashMode={trashMode}
                        forceVector={forces[i]}
                    />
                ))}

                <FieldVisualizer charges={charges} visible={showField} arrowColor="gray" />
            </Canvas>

            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white p-2 rounded shadow-md max-w-[90vw]">
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={showField}
                        onChange={(e) => setShowField(e.target.checked)}
                    />
                    Show Electric Field
                </label>
            </div>

            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white rounded-lg p-2 sm:p-4 shadow-md flex flex-wrap items-center gap-2 sm:gap-4 max-w-[98vw]">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-600"></div>
                    <button onClick={() => addNewCharge(1)} className="px-2 py-1 bg-blue-200 rounded">Add +</button>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-red-600"></div>
                    <button onClick={() => addNewCharge(-1)} className="px-2 py-1 bg-blue-200 rounded">Add -</button>
                </div>
                <input
                    type="number"
                    value={inputCharge}
                    min={0}
                    onChange={(e) => setInputCharge(parseFloat(e.target.value))}
                    className="border px-2 py-1 w-16 sm:w-20 min-w-0"
                />
                <button
                    onClick={() => setTrashMode((prev) => !prev)}
                    className={`px-3 py-1 rounded ${trashMode ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                >
                    {trashMode ? '🗑️ Deleting...' : '🗑️ Trash Mode'}
                </button>
            </div>
        </div>
    );
}

export default CoulombVisualizer;