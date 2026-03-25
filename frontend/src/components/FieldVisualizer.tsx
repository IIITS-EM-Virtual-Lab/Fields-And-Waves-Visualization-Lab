import { useMemo } from "react";
import * as THREE from "three";
import { Line } from "@react-three/drei";

type Charge = {
  position: THREE.Vector3;
  q: number;
};

type Props = {
  charges: Charge[];
  visible: boolean;
  arrowColor?: string;
};

const k = 8.99e9;
const chargeRadius = 0.3;

// Compute electric field
function computeField(point: THREE.Vector3, charges: Charge[]) {
  const E = new THREE.Vector3();

  charges.forEach((c) => {
    const r = new THREE.Vector3().subVectors(point, c.position);
    const d = r.length();

    if (d < 0.01) return;

    const mag = (k * c.q * 1e-9) / (d * d);

    E.add(r.normalize().multiplyScalar(mag));
  });

  return E;
}

// RK4 integration step
function rk4Step(p: THREE.Vector3, step: number, charges: Charge[]) {

  const f = (pos: THREE.Vector3) =>
    computeField(pos, charges).normalize();

  const k1 = f(p);
  const k2 = f(p.clone().add(k1.clone().multiplyScalar(step / 2)));
  const k3 = f(p.clone().add(k2.clone().multiplyScalar(step / 2)));
  const k4 = f(p.clone().add(k3.clone().multiplyScalar(step)));

  const delta = new THREE.Vector3()
    .add(k1)
    .add(k2.multiplyScalar(2))
    .add(k3.multiplyScalar(2))
    .add(k4)
    .multiplyScalar(step / 6);

  return p.clone().add(delta);
}

// Trace field line
function traceFieldLine(start: THREE.Vector3, charges: Charge[]) {

  const points: THREE.Vector3[] = [];
  let p = start.clone();

  const step = 0.15;
  const maxSteps = 400;

  points.push(p.clone());

  for (let i = 0; i < maxSteps; i++) {

    p = rk4Step(p, step, charges);
    points.push(p.clone());

    // stop if reaching negative charge
    for (const c of charges) {
      if (c.q < 0) {
        if (p.distanceTo(c.position) < chargeRadius) {
          return points;
        }
      }
    }

    if (p.length() > 20) break;
  }

  return points;
}

// Fibonacci sphere distribution
function generateFibonacciSphere(
  center: THREE.Vector3,
  radius: number,
  count: number
) {

  const points: THREE.Vector3[] = [];

  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {

    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);

    const theta = goldenAngle * i;

    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;

    points.push(
      new THREE.Vector3(
        center.x + radius * x,
        center.y + radius * y,
        center.z + radius * z
      )
    );

  }

  return points;
}

export default function FieldVisualizer({
  charges,
  visible,
  arrowColor = "gray",
}: Props) {

  const lines = useMemo(() => {

    if (!visible) return [];

    const result: THREE.Vector3[][] = [];

    charges.forEach((charge) => {

      if (charge.q <= 0) return;

      // number of field lines proportional to charge
      const baseLines = 12;

      const lineCount = Math.max(
        8,
        Math.round(baseLines * Math.abs(charge.q))
      );

      const startPoints = generateFibonacciSphere(
        charge.position,
        chargeRadius,
        lineCount
      );

      startPoints.forEach((p) => {

        const dir = p.clone().sub(charge.position).normalize();

        const start = p.clone().add(dir.multiplyScalar(0.01));

        const line = traceFieldLine(start, charges);

        if (line.length > 2) result.push(line);

      });

    });

    return result;

  }, [charges, visible]);

  return (
    <>
      {lines.map((pts, i) => (

        <group key={i}>

          <Line
            points={pts}
            color={arrowColor}
            lineWidth={1}
          />

          {pts.map((p, j) => {

            if (j % 12 !== 0 || j >= pts.length - 1) return null;

            const dir = new THREE.Vector3()
              .subVectors(pts[j + 1], pts[j])
              .normalize();

            return (
              <arrowHelper
                key={j}
                args={[
                  dir,
                  p,
                  0.45,   // arrow length
                  arrowColor,
                  0.18,   // head length
                  0.12    // head width
                ]}
              />
            );

          })}

        </group>

      ))}
    </>
  );
}