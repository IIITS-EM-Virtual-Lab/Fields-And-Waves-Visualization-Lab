import { Canvas } from "@react-three/fiber";
import { useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import Charge from "./Charge";
import Controls from "./Controls";
import FieldVisualizer from "./FieldVisualizer";

const initialCharges: { position: THREE.Vector3; q: number }[] = [];

const k = 8.99e9;

function computeForces(charges: { position: THREE.Vector3; q: number }[]) {

  const scale = 1e8;

  return charges.map((chargeA, i) => {

    let netForce = new THREE.Vector3(0, 0, 0);

    charges.forEach((chargeB, j) => {

      if (i !== j) {

        const r = new THREE.Vector3().subVectors(
          chargeB.position,
          chargeA.position
        );

        const distance = r.length();

        if (distance > 0.001) {

          const forceMagnitude =
            scale *
            (k * chargeA.q * chargeB.q * 1e-18) /
            (distance * distance);

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

  const [placingCharge, setPlacingCharge] = useState<number | null>(null);

  const forces = useMemo(() => computeForces(charges), [charges]);

  const handleDrag = (index: number, newPos: THREE.Vector3) => {

    setCharges((prev) => {

      const updated = [...prev];

      updated[index] = {
        ...updated[index],
        position: newPos.clone()
      };

      return updated;

    });

  };

  const handleRemoveCharge = (index: number) => {
    setCharges((prev) => prev.filter((_, i) => i !== index));
  };

  // Mouse tracking for dragging & placement
  useEffect(() => {

    const handleMouseMove = (e: MouseEvent) => {

      const camera = (window as any).camera;
      if (!camera) return;

      const raycaster = new THREE.Raycaster();

      const mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );

      raycaster.setFromCamera(mouse, camera);

      const cameraDirection = new THREE.Vector3();
      camera.getWorldDirection(cameraDirection);

      const plane = new THREE.Plane();
      plane.setFromNormalAndCoplanarPoint(
        cameraDirection,
        new THREE.Vector3(0, 0, 0)
      );

      const point = new THREE.Vector3();

      const hit = raycaster.ray.intersectPlane(plane, point);

      if (hit) {
        (window as any).mouse3D = point.clone();
      }

    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);

  }, []);

  return (

    <div className="relative overflow-hidden w-[70%] h-[60vh] mx-auto bg-white border-2 border-blue-600 flex justify-center items-center rounded-lg shadow-lg">

      <Canvas
        camera={{ position: [6, 6, 6] }}
        onCreated={({ camera }) => ((window as any).camera = camera)}

        onPointerDown={() => {

          if (placingCharge === null) return;

          const pos = (window as any).mouse3D;

          if (!pos) return;

          const charge = {
            position: pos.clone(),
            q: placingCharge * Math.abs(inputCharge)
          };

          setCharges((prev) => [...prev, charge]);

          setPlacingCharge(null);

        }}
      >

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
  setTrashMode={setTrashMode}
  forceVector={forces[i]}
/>

        ))}

        {showField && charges.length > 0 && (

          <FieldVisualizer
            charges={charges}
            visible={showField}
            arrowColor="gray"
          />

        )}

      </Canvas>

      {/* Field toggle */}

      <div className="absolute top-4 left-4 bg-white p-2 rounded shadow">

        <label className="flex items-center gap-2">

          <input
            type="checkbox"
            checked={showField}
            onChange={(e) => setShowField(e.target.checked)}
          />

          Show Electric Field

        </label>

      </div>

      {/* Placement instruction */}

      {placingCharge !== null && (

        <div className="absolute top-16 left-4 bg-yellow-200 px-3 py-2 rounded shadow">

          Click anywhere in the scene to place the charge

        </div>

      )}

      {/* Controls */}

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg p-4 shadow flex items-center gap-4">

        <div className="flex items-center gap-2">

          <div className="w-6 h-6 rounded-full bg-green-600"></div>

          <button
            onClick={() => setPlacingCharge(1)}
            className="px-2 py-1 bg-blue-200 rounded"
          >
            Add +
          </button>

        </div>

        <div className="flex items-center gap-2">

          <div className="w-6 h-6 rounded-full bg-red-600"></div>

          <button
            onClick={() => setPlacingCharge(-1)}
            className="px-2 py-1 bg-blue-200 rounded"
          >
            Add -
          </button>

        </div>

        <input
          type="number"
          value={inputCharge}
          min={0}
          onChange={(e) => setInputCharge(Number(e.target.value) || 0)}
          className="border px-2 py-1 w-20"
        />

        <button
          onClick={() => setTrashMode((prev) => !prev)}
          className={`px-3 py-1 rounded ${
            trashMode ? "bg-red-500 text-white" : "bg-gray-200"
          }`}
        >
          {trashMode ? "🗑️ Deleting..." : "🗑️ Trash Mode"}
        </button>

      </div>

    </div>

  );

}

export default CoulombVisualizer;