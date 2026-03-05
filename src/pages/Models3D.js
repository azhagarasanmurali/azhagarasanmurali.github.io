import React, {
	Suspense,
	useMemo,
	useState,
	useEffect,
	useRef,
	useCallback,
} from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html, useProgress } from "@react-three/drei";
import * as THREE from "three";
import Card from "../components/Card";

const MODELS = [
	{
		id: 1,
		name: "Basketball Hoop",
		path: "/models/basketball_hoop.glb",
		thumbnail: "/models/basketball_hoop.png",
		cardHeight: "250px",
		cardWidth: "200px",
	},
	{
		id: 2,
		name: "Turret",
		path: "/models/turret.glb",
		thumbnail: "/models/turret.png",
		cardHeight: "250px",
		cardWidth: "200px",
	},
];

function Loader() {
	const { progress } = useProgress();
	return <Html center>{Math.round(progress)} %</Html>;
}

function calculateTriangleCount(object) {
	let triangles = 0;

	object.traverse((child) => {
		if (child.isMesh && child.geometry) {
			const geom = child.geometry;

			if (geom.index) {
				triangles += geom.index.count / 3;
			} else if (geom.attributes.position) {
				triangles += geom.attributes.position.count / 3;
			}
		}
	});

	return Math.floor(triangles);
}

function CenteredModel({ url, onTrianglesCalculated, onModelLoaded }) {
	const { scene } = useGLTF(url);
	const modelRootRef = useRef();

	const processedScene = useMemo(() => {
		const cloned = scene.clone(true);

		const box = new THREE.Box3().setFromObject(cloned);
		const size = new THREE.Vector3();
		box.getSize(size);

		const maxDim = Math.max(size.x, size.y, size.z);
		const scale = maxDim > 0 ? 1.5 / maxDim : 1;
		cloned.scale.setScalar(scale);

		box.setFromObject(cloned);
		const center = new THREE.Vector3();
		box.getCenter(center);
		cloned.position.sub(center);

		return cloned;
	}, [scene]);

	useEffect(() => {
		const triCount = calculateTriangleCount(processedScene);
		onTrianglesCalculated(triCount);
	}, [processedScene, onTrianglesCalculated]);

	useEffect(() => {
		if (!modelRootRef.current) {
			return;
		}

		modelRootRef.current.position.set(0, 0, 0);
		modelRootRef.current.rotation.set(0, 0, 0);
		modelRootRef.current.scale.set(1, 1, 1);

		onModelLoaded?.();
	}, [processedScene, onModelLoaded]);

	return (
		<group ref={modelRootRef}>
			<primitive object={processedScene} />
		</group>
	);
}

function CameraResetOnModelLoad({ resetToken, controlsRef }) {
	const { camera } = useThree();

	useEffect(() => {
		camera.position.set(0, 0, 3);
		camera.zoom = 1;

		if (controlsRef.current) {
			controlsRef.current.target.set(0, 0, 0);
			controlsRef.current.update();
		}

		camera.lookAt(0, 0, 0);
		camera.updateProjectionMatrix();
	}, [resetToken, camera, controlsRef]);

	return null;
}

const Models3D = () => {
	const [selectedModel, setSelectedModel] = useState(MODELS[0]);
	const [triangles, setTriangles] = useState(0);
	const [modelLoadToken, setModelLoadToken] = useState(0);
	const controlsRef = useRef();

	const handleModelLoaded = useCallback(() => {
		setModelLoadToken((prevToken) => prevToken + 1);
	}, []);

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				overflow: "visible",
			}}
		>
			<h1>3D Models</h1>

			<div
				style={{
					height: "500px",
					width: "100%",
					overflow: "hidden",
					padding: "0 12px",
					flexShrink: 0,
					border: "2px solid #ddd",
					borderRadius: "8px",
					boxSizing: "border-box",
					position: "relative",
				}}
			>
				<Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
					<CameraResetOnModelLoad
						resetToken={modelLoadToken}
						controlsRef={controlsRef}
					/>

					<ambientLight intensity={0.6} />
					<directionalLight position={[10, 10, 10]} intensity={0.8} />

					<Suspense fallback={<Loader />}>
						<CenteredModel
							key={selectedModel.path}
							url={selectedModel.path}
							onTrianglesCalculated={setTriangles}
							onModelLoaded={handleModelLoaded}
						/>
					</Suspense>

					<OrbitControls
						ref={controlsRef}
						enablePan
						enableZoom
						enableRotate
						target={[0, 0, 0]}
					/>
				</Canvas>

				<div
					style={{
						position: "absolute",
						top: "12px",
						right: "24px",
						zIndex: 2,
						pointerEvents: "none",
						padding: "6px 10px",
						borderRadius: "6px",
						fontSize: "14px",
						lineHeight: 1.2,
					}}
				>
					Tris: {triangles.toLocaleString()}
				</div>
			</div>

			<h3>{selectedModel.name}</h3>

			<div
				style={{
					padding: "24px 50px",
					overflowX: "auto",
					overflowY: "hidden",
					display: "flex",
					gap: "100px",
					flexShrink: 0,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				{MODELS.map((model) => (
					<div
						key={model.id}
						style={{
							flex: "0 0 auto",
							width: model.cardWidth || "140px",
							height: model.cardHeight || "250px",
							minWidth: model.cardWidth || "140px",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Card
							title={model.name}
							image={model.thumbnail}
							onClick={() => setSelectedModel(model)}
						/>
					</div>
				))}
			</div>
		</div>
	);
};

export default Models3D;
