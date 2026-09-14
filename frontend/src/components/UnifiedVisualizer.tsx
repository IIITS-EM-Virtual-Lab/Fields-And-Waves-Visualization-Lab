import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line, Html } from "@react-three/drei";
import Axes from "./Axes";
import VectorArrow from "./VectorArrow";

function UnifiedVisualizer() {
  const [xValue, setX] = useState("2");
  const [yValue, setY] = useState("2");
  const [zValue, setZ] = useState("2");
  const [rValue, setR] = useState("0");
  const [thetaValue, setTheta] = useState("0");
  const [phiValue, setPhi] = useState("0");
  const [rhoValue, setRho] = useState("0");
  const [thetaDegrees, setThetaDegrees] = useState("0");
  const [phiDegrees, setPhiDegrees] = useState("0");
  const [coordSystem, setCoordSystem] = useState<
    "cartesian" | "spherical" | "cylindrical"
  >("cartesian");
  const [showSpherical, setShowSpherical] = useState(true);
  const [showCylindrical, setShowCylindrical] = useState(true);

  const x = Number(xValue) || 0;
  const y = Number(yValue) || 0;
  const z = Number(zValue) || 0;
  const r = Number(rValue) || 0;
  const theta = Number(thetaValue) || 0;
  const phi = Number(phiValue) || 0;
  const rho = Number(rhoValue) || 0;

  // Coordinate syncing logic
  useEffect(() => {
    if (coordSystem === "cartesian") {
      const newR = Math.sqrt(x * x + y * y + z * z);
      const newTheta = newR !== 0 ? Math.acos(z / newR) : 0;
      const newPhi = Math.atan2(y, x);
      const newRho = Math.sqrt(x * x + y * y);
      setR(newR.toString());
      setTheta(newTheta.toString());
      setPhi(newPhi.toString());
      setRho(newRho.toString());
    }
  }, [xValue, yValue, zValue]);

  useEffect(() => {
    if (coordSystem === "spherical") {
      const newX = r * Math.sin(theta) * Math.cos(phi);
      const newY = r * Math.sin(theta) * Math.sin(phi);
      const newZ = r * Math.cos(theta);
      setX(newX.toString());
      setY(newY.toString());
      setZ(newZ.toString());
    }
  }, [rValue, thetaValue, phiValue]);

  useEffect(() => {
    if (coordSystem === "cylindrical") {
      const newX = rho * Math.cos(phi);
      const newY = rho * Math.sin(phi);
      setX(newX.toString());
      setY(newY.toString());
    }
  }, [rhoValue, phiValue, zValue]);

  const segments = 32;
  const thetaArcPoints: [number, number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * theta;
    const rProj = 0.5;
    const xPos = rProj * Math.sin(angle) * Math.cos(phi);
    const yPos = rProj * Math.sin(angle) * Math.sin(phi);
    const zPos = rProj * Math.cos(angle);
    thetaArcPoints.push([xPos, yPos, zPos]);
  }

  const phiArcPoints: [number, number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * phi;
    const xPos = 0.5 * Math.cos(angle);
    const yPos = 0.5 * Math.sin(angle);
    phiArcPoints.push([xPos, yPos, 0]);
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div
        className="relative overflow-hidden rounded-lg border-2 border-blue-600"
        style={{ height: 500, width: 800, zIndex: 0 }}
      >
        <Canvas
          style={{ height: "100%", width: "100%" }}
          camera={{ position: [5, 2, 5] }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls />
          <Axes length={20} width={3} fontPosition={5.5} interval={1} />

          {/* Cylinder */}
          {showCylindrical && (
            <mesh position={[0, 0, z / 2]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[rho, rho, z, 64]} />
              <meshStandardMaterial color="orange" transparent opacity={0.5} />
            </mesh>
          )}

          {/* Sphere */}
          {showSpherical && (
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[r, 64, 64]} />
              <meshStandardMaterial
                color="blue"
                transparent
                opacity={0.5}
                depthWrite={false}
              />
            </mesh>
          )}

          <VectorArrow vector={[x, y, z]} color="red" label="P" />
          <Line
            points={[
              [0, 0, 0],
              [x, y, 0],
            ]}
            color="blue"
            dashed
            dashSize={0.2}
            gapSize={0.1}
          />
          <Line
            points={[
              [x, y, 0],
              [x, y, z],
            ]}
            color="green"
            dashed
            dashSize={0.2}
            gapSize={0.1}
          />
          <Line points={thetaArcPoints} color="red" />
          <Line points={phiArcPoints} color="blue" />

          <Html position={[x / 2, y / 2, z / 2]} center distanceFactor={8}>
            <div
              style={{
                color: "red",
                whiteSpace: "nowrap",
                userSelect: "none",
                fontSize: "20px",
              }}
            >
              r = {r.toFixed(2)}
            </div>
          </Html>
          <Html
            position={[0.7 * Math.sin(theta / 2), 0, 0.7 * Math.cos(theta / 2)]}
            center
            distanceFactor={8}
          >
            <div
              style={{
                color: "red",
                whiteSpace: "nowrap",
                userSelect: "none",
                fontSize: "20px",
              }}
            >
              &theta; = {((theta * 180) / Math.PI).toFixed(1)}&deg;
            </div>
          </Html>
          <Html
            position={[0.7 * Math.cos(phi / 2), 0.7 * Math.sin(phi / 2), 0]}
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
              &phi; = {((phi * 180) / Math.PI).toFixed(1)}&deg;
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

      <div className="flex gap-4 mt-2">
        <label>
          <input
            type="checkbox"
            checked={showSpherical}
            onChange={() => setShowSpherical(!showSpherical)}
          />{" "}
          Show Spherical
        </label>
        <label>
          <input
            type="checkbox"
            checked={showCylindrical}
            onChange={() => setShowCylindrical(!showCylindrical)}
          />{" "}
          Show Cylindrical
        </label>
      </div>

      <div className="flex flex-col gap-6 mt-4 text-sm">
        <div>
          <h2 className="font-bold mb-2">Cartesian Coordinates:</h2>
          <div className="flex gap-4">
            <label>
              X:{" "}
              <input
                type="number"
                value={xValue}
                onChange={(e) => {
                  setX(e.target.value);
                  setCoordSystem("cartesian");
                }}
                className="border p-1 ml-1 w-20"
              />
            </label>
            <label>
              Y:{" "}
              <input
                type="number"
                value={yValue}
                onChange={(e) => {
                  setY(e.target.value);
                  setCoordSystem("cartesian");
                }}
                className="border p-1 ml-1 w-20"
              />
            </label>
            <label>
              Z:{" "}
              <input
                type="number"
                value={zValue}
                onChange={(e) => {
                  setZ(e.target.value);
                  setCoordSystem("cartesian");
                }}
                className="border p-1 ml-1 w-20"
              />
            </label>
          </div>
        </div>

        <div>
          <h2 className="font-bold mb-2">Spherical Coordinates:</h2>
          <div className="flex gap-4">
            <label>
              r:{" "}
              <input
                type="number"
                value={rValue}
                onChange={(e) => {
                  setR(e.target.value);
                  setCoordSystem("spherical");
                }}
                className="border p-1 ml-1 w-20"
              />
            </label>
            <label>
              &theta;&deg;:{" "}
              <input
                type="number"
                value={thetaDegrees}
                onChange={(e) => {
                  setThetaDegrees(e.target.value);

                  const degrees = Number(e.target.value) || 0;
                  setTheta(String((degrees * Math.PI) / 180));

                  setCoordSystem("spherical");
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

                  const degrees = Number(e.target.value) || 0;
                  setPhi(String((degrees * Math.PI) / 180));

                  setCoordSystem("spherical");
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
                value={rhoValue}
                onChange={(e) => {
                  setRho(e.target.value);
                  setCoordSystem("cylindrical");
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

                  const degrees = Number(e.target.value) || 0;
                  setPhi(String((degrees * Math.PI) / 180));

                  setCoordSystem("spherical");
                }}
                className="border p-1 ml-1 w-20"
              />
            </label>
            <label>
              Z:{" "}
              <input
                type="number"
                value={zValue}
                onChange={(e) => {
                  setZ(e.target.value);
                  setCoordSystem("cylindrical");
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

export default UnifiedVisualizer;
