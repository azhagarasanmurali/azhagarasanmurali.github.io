import React, { Suspense, useRef, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html, useProgress } from "@react-three/drei";
import * as THREE from "three";

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
	// Default model path. Place your .glb files in public/models and update the filename below.
	const defaultModel = "/models/example.glb";

	return (
		<div style={{ width: "100%", height: "70vh" }}>
			<h1 style={{ textAlign: "center" }}>3D Models</h1>
			<Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
				<ambientLight intensity={0.6} />
				<directionalLight position={[10, 10, 10]} intensity={0.8} />
				<Suspense fallback={<Loader />}>
					<CenteredModel url={defaultModel} />
				</Suspense>
				<OrbitControls
					enablePan
					enableZoom
					enableRotate
					target={[0, 0, 0]}
				/>
			</Canvas>
		</div>
	);
};

export default Models3D;
