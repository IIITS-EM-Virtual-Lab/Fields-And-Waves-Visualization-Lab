import { Canvas } from '@react-three/fiber';
import { useState, useEffect } from 'react';
import * as THREE from 'three';
import Charge from './Charge';
import Controls from './Controls';
import FieldVisualizer from './FieldVisualizer';

const initialCharges: { position: THREE.Vector3; q: number }[] = [];


function CoulombVisualizer() {
    const [charges, setCharges] = useState(initialCharges);
    const [showField, setShowField] = useState(true);
    const [inputCharge, setInputCharge] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [trashMode, setTrashMode] = useState(false);

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
            position: new THREE.Vector3(0, -3, 0),
            q: sign * Math.abs(inputCharge),
        };
        setCharges((prev) => [...prev, charge]);
    };

    useEffect(() => {
        window.addEventListener('mousemove', (e) => {
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2(
                (e.clientX / window.innerWidth) * 2 - 1,
                -(e.clientY / window.innerHeight) * 2 + 1
            );
            raycaster.setFromCamera(mouse, (window as any).camera);
            const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
            const point = new THREE.Vector3();
            raycaster.ray.intersectPlane(plane, point);
            (window as any).mouse3D = point;
        });
    }, []);

    return (
        <div className="relative overflow-hidden w-full h-screen relative bg-white border-2 border-blue-600">
            <Canvas onCreated={({ camera }) => ((window as any).camera = camera)}>
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
                    />
                ))}

                <FieldVisualizer charges={charges} visible={showField} arrowColor="blue" />
            </Canvas>

            <div className="absolute top-4 left-4 bg-white p-2 rounded shadow-md">
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={showField}
                        onChange={(e) => setShowField(e.target.checked)}
                    />
                    Show Electric Field
                </label>
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg p-4 shadow-md flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-red-600"></div>
                    <button onClick={() => addNewCharge(1)} className="px-2 py-1 bg-blue-200 rounded">Add +</button>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-600"></div>
                    <button onClick={() => addNewCharge(-1)} className="px-2 py-1 bg-blue-200 rounded">Add -</button>
                </div>
                <input
                    type="number"
                    value={inputCharge}
                    min={0}
                    onChange={(e) => setInputCharge(parseFloat(e.target.value))}
                    className="border px-2 py-1 w-20"
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