import { useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Axes from './Axes';
import VectorArrow from './VectorArrow';

const epsilon0 = 8.854e-12;

function GaussApplicationVisualizer() {
	const [chargeValue, setChargeValue] = useState(1e-9);
	const [chargePosition, setChargePosition] = useState([0, 0, 0]);

	// Shape type: Sphere or Cylinder
	const [shapeType, setShapeType] = useState<'sphere' | 'cylinder'>('sphere');

	// Common: Component type
	const [surfaceType, setSurfaceType] = useState<'radial' | 'theta' | 'phi'>('radial');

	/** SPHERE PARAMETERS **/
	const [surfaceRadius, setSurfaceRadius] = useState(2);
	const [rRange, setRRange] = useState([1, 2]);
	const [thetaRangeDeg, setThetaRangeDeg] = useState([0, 180]);
	const [phiRangeDeg, setPhiRangeDeg] = useState([0, 360]);

	const thetaRange = useMemo(() => thetaRangeDeg.map(d => (d * Math.PI) / 180), [thetaRangeDeg]);
	const phiRange = useMemo(() => phiRangeDeg.map(d => (d * Math.PI) / 180), [phiRangeDeg]);
	const [thetaMin, thetaMax] = thetaRange;
	const [phiMin, phiMax] = phiRange;

	/** CYLINDER PARAMETERS **/
	const [rhoRange, setRhoRange] = useState([1, 2]);
	const [zRange, setZRange] = useState([0, 1]);
	const [phiCylRangeDeg, setPhiCylRangeDeg] = useState([0, 360]);

	const phiCylRange = useMemo(() => phiCylRangeDeg.map(d => (d * Math.PI) / 180), [phiCylRangeDeg]);
	const [phiCylMin, phiCylMax] = phiCylRange;

	// Charge & center
	const charge = useMemo(() => new THREE.Vector3(...chargePosition), [chargePosition]);
	const surfaceCenter = new THREE.Vector3(0, 0, 0);

	// Gauss Law theoretical flux (Sphere case only)
	const isEnclosed = charge.distanceTo(surfaceCenter) <= surfaceRadius;
	const totalFlux = shapeType === 'sphere' ? (isEnclosed ? chargeValue / epsilon0 : 0) : 0;

	/** NUMERICAL FLUX CALCULATION **/
	const numericalFlux = useMemo(() => {
		const n = 15;
		let fluxSum = 0;

		if (shapeType === 'sphere') {
			if (surfaceType === 'radial') {
				const dTheta = (thetaMax - thetaMin) / n;
				const dPhi = (phiMax - phiMin) / n;
				for (let i = 0; i < n; i++) {
					for (let j = 0; j < n; j++) {
						const theta = thetaMin + i * dTheta;
						const phi = phiMin + j * dPhi;
						const x = surfaceRadius * Math.sin(theta) * Math.cos(phi);
						const y = surfaceRadius * Math.sin(theta) * Math.sin(phi);
						const z = surfaceRadius * Math.cos(theta);
						const rSurface = new THREE.Vector3(x, y, z);
						const dS = rSurface.clone().normalize().multiplyScalar(surfaceRadius ** 2 * Math.sin(theta) * dTheta * dPhi);
						const rVec = rSurface.clone().sub(charge);
						const rMag = rVec.length();
						if (rMag === 0) continue;
						const D = rVec.clone().normalize().multiplyScalar(chargeValue / (4 * Math.PI * epsilon0 * rMag ** 2));
						fluxSum += D.dot(dS);
					}
				}
			}
			else if (surfaceType === 'theta') {
				const [rMin, rMax] = rRange;
				const dR = (rMax - rMin) / n;
				const dPhi = (phiMax - phiMin) / n;
				const theta = (thetaMin + thetaMax) / 2;
				for (let i = 0; i < n; i++) {
					for (let j = 0; j < n; j++) {
						const r = rMin + i * dR;
						const phi = phiMin + j * dPhi;
						const x = r * Math.sin(theta) * Math.cos(phi);
						const y = r * Math.sin(theta) * Math.sin(phi);
						const z = r * Math.cos(theta);
						const rSurface = new THREE.Vector3(x, y, z);
						const dS = new THREE.Vector3(Math.cos(theta) * Math.cos(phi), Math.cos(theta) * Math.sin(phi), -Math.sin(theta))
							.normalize()
							.multiplyScalar(r * Math.sin(theta) * dR * dPhi);
						const rVec = rSurface.clone().sub(charge);
						const rMag = rVec.length();
						if (rMag === 0) continue;
						const D = rVec.clone().normalize().multiplyScalar(chargeValue / (4 * Math.PI * epsilon0 * rMag ** 2));
						fluxSum += D.dot(dS);
					}
				}
			}
			else if (surfaceType === 'phi') {
				const [rMin, rMax] = rRange;
				const dR = (rMax - rMin) / n;
				const dTheta = (thetaMax - thetaMin) / n;
				const phi = (phiMin + phiMax) / 2;
				for (let i = 0; i < n; i++) {
					for (let j = 0; j < n; j++) {
						const r = rMin + i * dR;
						const theta = thetaMin + j * dTheta;
						const x = r * Math.sin(theta) * Math.cos(phi);
						const y = r * Math.sin(theta) * Math.sin(phi);
						const z = r * Math.cos(theta);
						const rSurface = new THREE.Vector3(x, y, z);
						const dS = new THREE.Vector3(-Math.sin(phi), Math.cos(phi), 0)
							.normalize()
							.multiplyScalar(r * dR * dTheta);
						const rVec = rSurface.clone().sub(charge);
						const rMag = rVec.length();
						if (rMag === 0) continue;
						const D = rVec.clone().normalize().multiplyScalar(chargeValue / (4 * Math.PI * epsilon0 * rMag ** 2));
						fluxSum += D.dot(dS);
					}
				}
			}
		} else if (shapeType === 'cylinder') {
			const [rhoMin, rhoMax] = rhoRange;
			const [zMin, zMax] = zRange;

			if (surfaceType === 'radial') {
				const dPhi = (phiCylMax - phiCylMin) / n;
				const dZ = (zMax - zMin) / n;
				const rho = rhoMax;
				for (let i = 0; i < n; i++) {
					for (let j = 0; j < n; j++) {
						const phi = phiCylMin + i * dPhi;
						const z = zMin + j * dZ;
						const x = rho * Math.cos(phi);
						const y = rho * Math.sin(phi);
						const rSurface = new THREE.Vector3(x, y, z);
						const dS = new THREE.Vector3(Math.cos(phi), Math.sin(phi), 0).multiplyScalar(rho * dPhi * dZ);
						const rVec = rSurface.clone().sub(charge);
						const rMag = rVec.length();
						if (rMag === 0) continue;
						const D = rVec.clone().normalize().multiplyScalar(chargeValue / (4 * Math.PI * epsilon0 * rMag ** 2));
						fluxSum += D.dot(dS);
					}
				}
			} else if (surfaceType === 'theta') {
				const dRho = (rhoMax - rhoMin) / n;
				const dPhi = (phiCylMax - phiCylMin) / n;
				const z = zMax;
				for (let i = 0; i < n; i++) {
					for (let j = 0; j < n; j++) {
						const rho = rhoMin + i * dRho;
						const phi = phiCylMin + j * dPhi;
						const x = rho * Math.cos(phi);
						const y = rho * Math.sin(phi);
						const rSurface = new THREE.Vector3(x, y, z);
						const dS = new THREE.Vector3(0, 0, 1).multiplyScalar(rho * dRho * dPhi);
						const rVec = rSurface.clone().sub(charge);
						const rMag = rVec.length();
						if (rMag === 0) continue;
						const D = rVec.clone().normalize().multiplyScalar(chargeValue / (4 * Math.PI * epsilon0 * rMag ** 2));
						fluxSum += D.dot(dS);
					}
				}
			} else if (surfaceType === 'phi') {
				const dRho = (rhoMax - rhoMin) / n;
				const dZ = (zMax - zMin) / n;
				const phi = phiCylMax;
				for (let i = 0; i < n; i++) {
					for (let j = 0; j < n; j++) {
						const rho = rhoMin + i * dRho;
						const z = zMin + j * dZ;
						const x = rho * Math.cos(phi);
						const y = rho * Math.sin(phi);
						const rSurface = new THREE.Vector3(x, y, z);
						const dS = new THREE.Vector3(-Math.sin(phi), Math.cos(phi), 0).multiplyScalar(dRho * dZ);
						const rVec = rSurface.clone().sub(charge);
						const rMag = rVec.length();
						if (rMag === 0) continue;
						const D = rVec.clone().normalize().multiplyScalar(chargeValue / (4 * Math.PI * epsilon0 * rMag ** 2));
						fluxSum += D.dot(dS);
					}
				}
			}
		}
		return fluxSum;
	}, [shapeType, surfaceType, charge, chargeValue, surfaceRadius, thetaRange, phiRange, rRange, rhoRange, zRange, phiCylRange]);

	/** REGION GEOMETRY **/
	const regionGeometry = useMemo(() => {
		if (shapeType === 'sphere') {
			if (surfaceType === 'radial') {
				return { geometry: <sphereGeometry args={[surfaceRadius + 0.01, 64, 64, phiMin, phiMax - phiMin, thetaMin, thetaMax - thetaMin]} />, rotation: [0, 0, 0] as [number, number, number] };
			}
			if (surfaceType === 'theta') {
				const [rMin, rMax] = rRange;
				return { geometry: <ringGeometry args={[rMin, rMax, 64, 1, phiMin, phiMax - phiMin]} />, rotation: [0, 0, 0] as [number, number, number] };
			}
			if (surfaceType === 'phi') {
				const [rMin, rMax] = rRange;
				return { geometry: <ringGeometry args={[rMin, rMax, 64, 1, thetaMin, thetaMax - thetaMin]} />, rotation: [Math.PI / 2, 0, 0] as [number, number, number] };
			}
		} else if (shapeType === 'cylinder') {
			if (surfaceType === 'radial') {
				return { geometry: <cylinderGeometry args={[rhoRange[1], rhoRange[1], zRange[1] - zRange[0], 64, 1, true, phiCylMin, phiCylMax - phiCylMin]} />, rotation: [Math.PI/2, 0, 0] as [number, number, number] };
			}
			if (surfaceType === 'theta') {
				return { geometry: <ringGeometry args={[rhoRange[0], rhoRange[1], 64, 1, phiCylMin, phiCylMax - phiCylMin]} />, rotation: [Math.PI / 2, 0, 0] as [number, number, number] };
			}
			if (surfaceType === 'phi') {
				return { geometry: <planeGeometry args={[zRange[1] - zRange[0], rhoRange[1] - rhoRange[0]]} />, rotation: [0, Math.PI / 2, 0] as [number, number, number] };
			}
		}
	}, [shapeType, surfaceType, surfaceRadius, thetaMin, thetaMax, phiMin, phiMax, rRange, rhoRange, zRange, phiCylMin, phiCylMax]);

	// Field vectors (fixed directions, adjust based on charge sign)
	const fieldVectors = useMemo(() => {
		const directions = [
			[1, 1, 1], [-1, 1, 1],
			[1, -1, 1], [1, 1, -1],
			[1, -1, -1], [-1, 1, -1],
			[-1, -1, 1], [-1, -1, -1]
		]; // outward directions in 6 cardinal axes
		const distance = 3; // how far the outer end should be
		const vectors = [];
	
		for (const [dx, dy, dz] of directions) {
			const dir = new THREE.Vector3(dx, dy, dz).normalize();
			if (chargeValue > 0) {
				// Positive charge: start at charge position, point outward
				const from = charge.toArray();
				const to = dir.clone().multiplyScalar(distance).add(charge).toArray();
				vectors.push({ from, to });
			} else {
				// Negative charge: start from outside, point inward to charge
				const from = dir.clone().multiplyScalar(distance).add(charge).toArray();
				const to = charge.toArray();
				vectors.push({ from, to });
			}
		}
		return vectors;
	}, [charge, chargeValue]);
	


	return (
		<div className="flex flex-col items-center gap-4 p-4 w-full">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl w-full">
				{/* Shape Selector */}
				<div className="mb-2">
					<label className="font-bold mr-2">Shape:</label>
					<select value={shapeType} onChange={(e) => setShapeType(e.target.value as any)} className="border px-2 py-1">
						<option value="sphere">Sphere</option>
						<option value="cylinder">Cylinder</option>
					</select>
				</div>

				{/* Flux Component Selector */}
				<div className="mb-2">
					<label className="font-bold mr-2">Flux component along:</label>
					<select value={surfaceType} onChange={(e) => setSurfaceType(e.target.value as any)} className="border px-2 py-1">
						{shapeType === 'sphere' ? (
							<>
								<option value="radial">Radial (r̂)</option>
								<option value="theta">Theta (θ̂)</option>
								<option value="phi">Phi (φ̂)</option>
							</>
						) : (
							<>
								<option value="radial">Radial (ρ̂)</option>
								<option value="theta">Axial (ẑ)</option>
								<option value="phi">Phi (φ̂)</option>
							</>
						)}
					</select>
				</div>

				{/* Charge Inputs */}
				<div>
					<h2 className="font-bold mb-1">Point Charge:</h2>
					<label>Charge (C):
						<input type="number" value={chargeValue} onChange={(e) => setChargeValue(Number(e.target.value))} className="border px-2 py-1 w-32 max-w-full ml-2" step="1e-9" />
					</label>
					<div className="mt-2 flex flex-col sm:flex-row gap-2 sm:gap-2">
						<label className="flex items-center">X: <input type="number" value={chargePosition[0]} onChange={(e) => setChargePosition([+e.target.value, chargePosition[1], chargePosition[2]])} className="border w-20 max-w-full ml-1" /></label>
						<label className="flex items-center">Y: <input type="number" value={chargePosition[1]} onChange={(e) => setChargePosition([chargePosition[0], +e.target.value, chargePosition[2]])} className="border w-20 max-w-full ml-1" /></label>
						<label className="flex items-center">Z: <input type="number" value={chargePosition[2]} onChange={(e) => setChargePosition([chargePosition[0], chargePosition[1], +e.target.value])} className="border w-20 max-w-full ml-1" /></label>
					</div>
				</div>

				{/* Surface Parameters */}
				<div>
					<h2 className="font-bold mb-1">Surface Parameters:</h2>
					{shapeType === 'sphere' ? (
						<>
							{surfaceType === 'radial' ? (
								<div>
						<label>Radius: <input type="range" min="0.5" max="5" step="0.1" value={surfaceRadius} onChange={(e) => setSurfaceRadius(+e.target.value)} className="w-full" /></label>
						<div>r = {surfaceRadius.toFixed(1)} m</div>
								</div>
							) : (
								<div>
									<label>r Min: <input type="number" value={rRange[0]} min={0} max={surfaceRadius} onChange={(e) => setRRange([+e.target.value, rRange[1]])} className="border w-20 ml-1" /></label>
									<label className="ml-2">r Max: <input type="number" value={rRange[1]} min={0} max={surfaceRadius} onChange={(e) => setRRange([rRange[0], +e.target.value])} className="border w-20 ml-1" /></label>
								</div>
							)}
							<div className="mt-2">
								<label>θ Min: <input type="number" value={thetaRangeDeg[0]} min={0} max={180} onChange={(e) => setThetaRangeDeg([+e.target.value, thetaRangeDeg[1]])} className="border w-20 ml-1" /></label>
								<label className="ml-2">θ Max: <input type="number" value={thetaRangeDeg[1]} min={0} max={180} onChange={(e) => setThetaRangeDeg([thetaRangeDeg[0], +e.target.value])} className="border w-20 ml-1" /></label>
							</div>
							<div className="mt-2">
								<label>φ Min: <input type="number" value={phiRangeDeg[0]} min={0} max={360} onChange={(e) => setPhiRangeDeg([+e.target.value, phiRangeDeg[1]])} className="border w-20 ml-1" /></label>
								<label className="ml-2">φ Max: <input type="number" value={phiRangeDeg[1]} min={0} max={360} onChange={(e) => setPhiRangeDeg([phiRangeDeg[0], +e.target.value])} className="border w-20 ml-1" /></label>
							</div>
						</>
					) : (
						<div>
							<label>ρ Min: <input type="number" value={rhoRange[0]} onChange={(e) => setRhoRange([+e.target.value, rhoRange[1]])} className="border w-20 ml-1" /></label>
							<label className="ml-2">ρ Max: <input type="number" value={rhoRange[1]} onChange={(e) => setRhoRange([rhoRange[0], +e.target.value])} className="border w-20 ml-1" /></label>
							<div className="mt-2">
								<label>z Min: <input type="number" value={zRange[0]} onChange={(e) => setZRange([+e.target.value, zRange[1]])} className="border w-20 ml-1" /></label>
								<label className="ml-2">z Max: <input type="number" value={zRange[1]} onChange={(e) => setZRange([zRange[0], +e.target.value])} className="border w-20 ml-1" /></label>
							</div>
							<div className="mt-2">
								<label>φ Min: <input type="number" value={phiCylRangeDeg[0]} onChange={(e) => setPhiCylRangeDeg([+e.target.value, phiCylRangeDeg[1]])} className="border w-20 ml-1" /></label>
								<label className="ml-2">φ Max: <input type="number" value={phiCylRangeDeg[1]} onChange={(e) => setPhiCylRangeDeg([phiCylRangeDeg[0], +e.target.value])} className="border w-20 ml-1" /></label>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Results */}
			<div className="mt-4 p-4 bg-gray-50 border rounded-lg w-full max-w-2xl text-center">
				<h3 className="font-bold mb-2">Flux Results:</h3>
				{/* <div>Theoretical Flux (Sphere only): {totalFlux.toExponential(3)} N·m²/C</div> */}
				<div>Numerical Flux: {numericalFlux.toExponential(3)} N·m²/C</div>
			</div>

			{/* 3D Visualization */}
			<div className="relative overflow-hidden rounded-lg border-2 border-blue-600 mt-6 w-full max-w-4xl aspect-video bg-white" style={{ zIndex: 0 }}>
				<Canvas className="!h-full !w-full" camera={{ position: [5, 5, 5], fov: 50 }}>
					<ambientLight intensity={0.5} />
					<pointLight position={[10, 10, 10]} />
					<OrbitControls />
					<Axes length={20} width={3} fontPosition={4.5} interval={1} xcolor="black" ycolor="black" zcolor="black" />
					{/* Charge */}
					<mesh position={charge.toArray()}>
						<sphereGeometry args={[0.1, 32, 32]} />
						<meshStandardMaterial color={chargeValue > 0 ? 'red' : 'blue'} />
					</mesh>

					{shapeType == "sphere" && (
						<mesh position={[0, 0, 0]}>
							<sphereGeometry args={[surfaceRadius, 64, 64]} />
							<meshStandardMaterial color={chargeValue > 0 ? 'red' : 'blue'} transparent opacity={0.5} depthWrite={false} />
						</mesh>
					)}

					{shapeType =="cylinder" && (
						<mesh position={[0, 0, zRange[1]/2]} rotation={[Math.PI / 2, 0, 0]} >
							<cylinderGeometry args={[surfaceRadius, surfaceRadius, zRange[1], 64]} />
							<meshStandardMaterial color={chargeValue > 0 ? 'red' : 'blue'} transparent opacity={0.5} depthWrite={false} />
						</mesh>
					)}

					{/* Region */}
					{regionGeometry && shapeType == 'sphere' && (
						<mesh rotation={regionGeometry.rotation}>
							{regionGeometry.geometry}
							<meshBasicMaterial color="green" transparent opacity={0.3} side={THREE.DoubleSide} depthWrite={false} />
						</mesh>
					)}

					{regionGeometry && shapeType == 'cylinder' && (
						<mesh rotation={regionGeometry.rotation} position={[0, 0, zRange[1]/2]}>
							{regionGeometry.geometry}
							<meshBasicMaterial color="green" transparent opacity={0.3} side={THREE.DoubleSide} depthWrite={false} />
						</mesh>
					)}
					{/* Field lines */}
					{fieldVectors.map((vec, i) => (
					<VectorArrow
					key={i}
					vector={[vec.to[0] - vec.from[0], vec.to[1] - vec.from[1], vec.to[2] - vec.from[2]]}
					origin={vec.from}
					color={chargeValue > 0 ? 'red' : 'blue'}
					/>
				))}
				</Canvas>
			</div>
		</div>
	);
}

export default GaussApplicationVisualizer;