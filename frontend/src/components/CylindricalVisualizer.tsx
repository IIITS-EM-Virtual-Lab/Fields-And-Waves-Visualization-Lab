import { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line, Html } from "@react-three/drei";
import Axes from "./Axes";
import VectorArrow from "./VectorArrow";
import CanvasControlsToolbar from "./CanvasControlsToolbar";
import * as THREE from "three";

function CylindricalVisualizer() {
  const [x, setX] = useState("2");
  const [y, setY] = useState("2");
  const [z, setZ] = useState("2");
  const [rho, setRho] = useState("0");
  const [phi, setPhi] = useState("0");
  const [phiDegrees, setPhiDegrees] = useState("0");

  const [interactionMode, setInteractionMode] = useState<'rotate' | 'pan'>('rotate');
  const controlsRef = useRef<any>(null);

  const handleZoomIn = () => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      camera.zoom *= 1.2;
      camera.updateProjectionMatrix();
    }
  };

  const handleZoomOut = () => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      camera.zoom /= 1.2;
      camera.updateProjectionMatrix();
    }
  };

  const resetCamera = () => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      camera.zoom = 1;
      camera.updateProjectionMatrix();
      controlsRef.current.reset();
    }
  };

  const xValue = Number(x) || 0;
  const yValue = Number(y) || 0;
  const zValue = Number(z) || 0;
  const rhoValue = Number(rho) || 0;
  const phiValue = Number(phi) || 0;
  const [lastChanged, setLastChanged] = useState<"cartesian" | "cylindrical">(
    "cartesian",
  );

  useEffect(() => {
    if (lastChanged === "cartesian") {
      const newRho = Math.sqrt(xValue * xValue + yValue * yValue);
      const newPhi = Math.atan2(yValue, xValue);

      setRho(newRho.toString());
      setPhi(newPhi.toString());
      setPhiDegrees(((newPhi * 180) / Math.PI).toString());
    }
  }, [x, y, lastChanged]);

  useEffect(() => {
    if (lastChanged === "cylindrical") {
      const newX = rhoValue * Math.cos(phiValue);
      const newY = rhoValue * Math.sin(phiValue);

      setX(newX.toString());
      setY(newY.toString());
    }
  }, [rho, phi, lastChanged]);

  const phiArcPoints: [number, number, number][] = [];
  const segments = 32;
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.min(Math.abs(phiValue), Math.PI * 2);
    const xPos = 0.5 * Math.cos(angle);
    const yPos = 0.5 * Math.sin(angle);
    phiArcPoints.push([xPos, yPos, 0]);
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div
        className="relative overflow-hidden rounded-lg border-2 border-blue-600 bg-gray-50"
        style={{ height: 500, width: 800, zIndex: 0 }}
      >
        <CanvasControlsToolbar
          interactionMode={interactionMode}
          setInteractionMode={setInteractionMode}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={resetCamera}
        />
        <Canvas
          style={{ height: "100%", width: "100%" }}
          camera={{ position: [4, 1, 4] }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls
            ref={controlsRef}
            makeDefault
            mouseButtons={{
              LEFT: interactionMode === 'rotate' ? THREE.MOUSE.ROTATE : THREE.MOUSE.PAN,
              MIDDLE: THREE.MOUSE.DOLLY,
              RIGHT: interactionMode === 'rotate' ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE,
            }}
          />
          <Axes length={20} width={3} fontPosition={5.5} interval={1} />

          <mesh position={[0, 0, zValue / 2]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[rhoValue, rhoValue, zValue, 64]} />
            <meshStandardMaterial color="#60a5fa" transparent opacity={0.6} />
          </mesh>

          <VectorArrow
            vector={[xValue, yValue, zValue]}
            color="red"
            label="P"
          />
          <Line
            points={[
              [0, 0, 0],
              [xValue, yValue, 0],
            ]}
            color="blue"
            dashed
            dashSize={0.2}
            gapSize={0.1}
          />
          <Line
            points={[
              [xValue, yValue, 0],
              [xValue, yValue, zValue],
            ]}
            color="green"
            dashed
            dashSize={0.2}
            gapSize={0.1}
          />
          <Line
            points={[
              [0, 0, 0],
              [xValue, yValue, 0],
            ]}
            color="purple"
          />
          <Line points={phiArcPoints} color="blue" />

          <Html
            position={[xValue / 2, yValue / 2, 0]}
            center
            distanceFactor={8}
          >
            <div
              style={{
                color: "purple",
                whiteSpace: "nowrap",
                userSelect: "none",
                fontSize: "20px",
              }}
            >
              &rho; = {rhoValue.toFixed(2)}
            </div>
          </Html>
          <Html
            position={[
              0.7 * Math.cos(phiValue / 2),
              0.7 * Math.sin(phiValue / 2),
              0,
            ]}
            center
            distanceFactor={8}
          >
            <div
              style={{
                color: "blue",
                whiteSpace: "nowrap",
                userSelect: "none",
                fontSize: "20px",
              }}
            >
              &phi; = {((phiValue * 180) / Math.PI).toFixed(1)}°
            </div>
          </Html>
          <Html
            position={[xValue, yValue, zValue / 2]}
            center
            distanceFactor={8}
          >
            <div
              style={{
                color: "green",
                whiteSpace: "nowrap",
                userSelect: "none",
                fontSize: "20px",
              }}
            >
              z = {zValue.toFixed(2)}
            </div>
          </Html>
        </Canvas>
      </div>

      <div className="flex justify-center items-center gap-8 py-3 bg-gray-50 border-t text-sm font-medium">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span>X-axis</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span>Y-axis</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500"></span>
          <span>Z-axis</span>
        </div>
      </div>

      <div className="flex gap-8 text-sm mt-4">
        <div>
          <h2 className="font-bold mb-2">Cartesian Coordinates:</h2>
          <div className="flex gap-4">
            <label>
              X:{" "}
              <input
                type="number"
                value={x}
                onChange={(e) => {
                  setX(e.target.value);
                  setLastChanged("cartesian");
                }}
                className="border p-1 ml-1 w-20"
              />
            </label>
            <label>
              Y:{" "}
              <input
                type="number"
                value={y}
                onChange={(e) => {
                  setY(e.target.value);
                  setLastChanged("cartesian");
                }}
                className="border p-1 ml-1 w-20"
              />
            </label>
            <label>
              Z:{" "}
              <input
                type="number"
                value={z}
                onChange={(e) => {
                  setZ(e.target.value);
                  setLastChanged("cartesian");
                }}
                className="border p-1 ml-1 w-20"
              />
            </label>
          </div>
        </div>

        <div>
          <h2 className="font-bold mb-2">Cylindrical Coordinates:</h2>
          <div className="flex gap-4">
            <label>
              &rho;:{" "}
              <input
                type="number"
                value={rho}
                onChange={(e) => {
                  setRho(e.target.value);
                  setLastChanged("cylindrical");
                }}
                className="border p-1 ml-1 w-20"
              />
            </label>
            <label>
              &phi;&deg;:{" "}
              <input
                type="number"
                value={phiDegrees}
                onChange={(e) => {
                  setPhiDegrees(e.target.value);
                  setPhi(
                    String(((Number(e.target.value) || 0) * Math.PI) / 180),
                  );
                  setLastChanged("cylindrical");
                }}
                className="border p-1 ml-1 w-20"
              />
            </label>
            <label>
              Z:{" "}
              <input
                type="number"
                value={z}
                onChange={(e) => {
                  setZ(e.target.value);
                  setLastChanged("cylindrical");
                }}
                className="border p-1 ml-1 w-20"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CylindricalVisualizer;
