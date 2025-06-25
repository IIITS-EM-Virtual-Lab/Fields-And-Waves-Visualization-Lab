import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { create, all } from 'mathjs';
import Axes from './Axes';
import VectorArrow from './VectorArrow';

const math = create(all);

function DelOperator() {
  const [scalarField, setScalarField] = useState('x^2 + y^2 + z^2');
  const [vectorField, setVectorField] = useState(['x*y', 'y*z', 'z*x']);
  const [point, setPoint] = useState({ x: 1, y: 1, z: 1 });

  const [gradient, setGradient] = useState([0, 0, 0]);
  const [divergence, setDivergence] = useState(0);
  const [curl, setCurl] = useState([0, 0, 0]);

  const compute = () => {
    const scope = { x: point.x, y: point.y, z: point.z };

    // Gradient of scalar field
    const grad = ['x', 'y', 'z'].map((v) => {
      const d = math.derivative(scalarField, v);
      return d.evaluate(scope);
    });

    // Divergence of vector field
    const div = ['x', 'y', 'z'].map((v, i) => {
      const d = math.derivative(vectorField[i], v);
      return d.evaluate(scope);
    }).reduce((a, b) => a + b, 0);

    // Curl of vector field
    const partial = (expr: string, v: string) => math.derivative(expr, v).evaluate(scope);
    const curlVec = [
      partial(vectorField[2], 'y') - partial(vectorField[1], 'z'),
      partial(vectorField[0], 'z') - partial(vectorField[2], 'x'),
      partial(vectorField[1], 'x') - partial(vectorField[0], 'y'),
    ];

    setGradient(grad);
    setDivergence(div);
    setCurl(curlVec);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
        <div className="flex gap-4">
            <div>
                <h2 className="font-bold">Scalar Field F(x, y, z):</h2>
                <input type="text" value={scalarField} onChange={(e) => setScalarField(e.target.value)} className="border p-1 w-60" />
            </div>
            <div>
                <h2 className="font-bold">Vector Field F(x, y, z):</h2>
                <div className="flex gap-2">
                    <input value={vectorField[0]} onChange={(e) => setVectorField([e.target.value, vectorField[1], vectorField[2]])} className="border p-1 w-20" />
                    <input value={vectorField[1]} onChange={(e) => setVectorField([vectorField[0], e.target.value, vectorField[2]])} className="border p-1 w-20" />
                    <input value={vectorField[2]} onChange={(e) => setVectorField([vectorField[0], vectorField[1], e.target.value])} className="border p-1 w-20" />
                </div>
            </div>
            <div>
                <h2 className="font-bold">Point P:</h2>
                <div className="flex gap-2">
                    <input type="number" value={point.x} onChange={(e) => setPoint({ ...point, x: Number(e.target.value) })} className="border p-1 w-16" />
                    <input type="number" value={point.y} onChange={(e) => setPoint({ ...point, y: Number(e.target.value) })} className="border p-1 w-16" />
                    <input type="number" value={point.z} onChange={(e) => setPoint({ ...point, z: Number(e.target.value) })} className="border p-1 w-16" />
                </div>
            </div>
            <button onClick={compute} className="bg-blue-500 text-white px-3 py-1 rounded">Compute</button>
        </div>

        <div className="relative border-2 border-blue-600 rounded-lg overflow-hidden" style={{ height: 500, width: 800, zIndex: 0 }}>
            <Canvas>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <OrbitControls />
                <Axes length={20} width={3} fontPosition={5.5} interval={1} />

                {/* Gradient vector */}
                <VectorArrow vector={gradient as [number, number, number]} origin={[point.x, point.y, point.z]} color="red" label="∇F" />
                {/* Curl vector */}
                <VectorArrow vector={curl as [number, number, number]} origin={[point.x, point.y, point.z]} color="green" label="∇×F" />

                {/* Point marker */}
                <mesh position={[point.x, point.y, point.z]}>
                    <sphereGeometry args={[0.1, 32, 32]} />
                    <meshStandardMaterial color="blue" />
                </mesh>
                <Html position={[point.x+0.1, point.y+0.2, point.z+0.1]} center distanceFactor={8}>
                    <div style={{ color: 'blue', fontSize: '20px', userSelect: 'none', whiteSpace: 'nowrap' }}>
                        P
                    </div>
                </Html>
            </Canvas>
        </div>

        <div className="gap-4 text-lg mt-4">
            <label>Gradient of a Scalar F: ∇ F = ({gradient[0]}, {gradient[1]}, {gradient[2]}) </label>
            <br/>
            <label>Del Operator on vector F: ∇·F = {divergence.toFixed(2)}</label>
            <br/>
            <label>Curl of vector F: ∇xF = ({curl[0]}, {curl[1]}, {curl[2]}) </label>
        </div>
    </div>
  );
}

export default DelOperator;