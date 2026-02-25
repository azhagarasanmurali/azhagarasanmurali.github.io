import React, { Suspense, useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html, useProgress } from "@react-three/drei";
import * as THREE from "three";
import Card from "../components/Card";

// List of 3D models. Update with your own models and thumbnails.
const MODELS = [
	{
		id: 1,
		name: "Basketball Hoop",
		path: "/models/model1.glb",
		thumbnail: "/models/thumb1.png",
		cardHeight: "250px",
		cardWidth: "200px",
	},
	// {
	// 	id: 2,
	// 	name: "Model 2",
	// 	path: "/models/model1.glb",
	// 	thumbnail: "/models/thumb1.png",
	// 	cardHeight: "250px",
	// 	cardWidth: "200px",
	// },
	// {
	// 	id: 3,
	// 	name: "Model 3",
	// 	path: "/models/model1.glb",
	// 	thumbnail: "/models/thumb1.png",
	// 	cardHeight: "250px",
	// 	cardWidth: "200px",
	// },
];

function Loader() {
	const { progress } = useProgress();
	return <Html center>{Math.round(progress)} %</Html>;
}

function CenteredModel({ url }) {
	const gltf = useGLTF(url, true);
	const ref = useRef();

	useEffect(() => {
		if (!gltf || !gltf.scene) return;
		const box = new THREE.Box3().setFromObject(gltf.scene);
		const size = new THREE.Vector3();
		box.getSize(size);
		const maxDim = Math.max(size.x, size.y, size.z);
		const scale = maxDim > 0 ? 1.5 / maxDim : 1;
		gltf.scene.scale.setScalar(scale);
		box.setFromObject(gltf.scene);
		const center = new THREE.Vector3();
		box.getCenter(center);
		gltf.scene.position.sub(center);
		if (ref.current) ref.current.add(gltf.scene);
	}, [gltf]);

	return <group ref={ref} />;
}

const Models3D = () => {
	const [selectedModel, setSelectedModel] = useState(MODELS[0]);

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				overflow: "visible",
			}}
		>
			{/* Page Title */}
			<h1>3D Models</h1>

			{/* Canvas Viewer */}
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
				}}
			>
				<Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
					<ambientLight intensity={0.6} />
					<directionalLight position={[10, 10, 10]} intensity={0.8} />
					<Suspense fallback={<Loader />}>
						<CenteredModel url={selectedModel.path} />
					</Suspense>
					<OrbitControls
						enablePan
						enableZoom
						enableRotate
						target={[0, 0, 0]}
					/>
				</Canvas>
			</div>

			{/* Model Name */}
			<h3>{selectedModel.name}</h3>

			{/* Horizontally Scrollable Card Panel */}
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
