import React, {
	Suspense,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Html, OrbitControls, useGLTF, useProgress } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { AnimatedItem } from "./AnimatedItem";
import { useInView } from "../hooks/useInView";

interface HobbyEntry {
	id: string;
	type?: string;
	title: string;
	description: string;
}

interface HobbyGalleryImage {
	id: string;
	src: string;
	alt: string;
}

interface HobbyGalleryRow {
	id: string;
	speedSeconds?: number;
	direction?: string;
	images: HobbyGalleryImage[];
}

interface HobbyModel {
	id: string;
	name: string;
	path?: string;
	thumbnail?: string;
	primitive?: string;
	view?: {
		cameraPosition?: number[];
		target?: number[];
		zoom?: number;
		modelPosition?: number[];
		modelRotation?: number[];
		modelScale?: number;
	};
}

interface HobbiesProps {
	data: {
		title: string;
		description: string;
		entries: HobbyEntry[];
		hobbyGallery?: {
			title: string;
			description: string;
			rows: HobbyGalleryRow[];
		};
		modelViewer?: {
			title: string;
			description: string;
			models: HobbyModel[];
			interactionButtonText?: string;
		};
	};
}

const formatTypeLabel = (value?: string) => {
	if (!value || !value.trim()) return "Other";
	return value
		.replace(/[-_]+/g, " ")
		.replace(/\b\w/g, (char) => char.toUpperCase());
};

const DEFAULT_MODELS: HobbyModel[] = [
	{
		id: "primitive-torus",
		name: "Torus Knot",
		primitive: "torusKnot",
		view: {
			cameraPosition: [0, 0.2, 3.2],
			target: [0, 0, 0],
			zoom: 1,
			modelPosition: [0, 0, 0],
			modelRotation: [0, 0, 0],
			modelScale: 1,
		},
	},
	{
		id: "primitive-icosa",
		name: "Icosahedron",
		primitive: "icosahedron",
		view: {
			cameraPosition: [0.2, 0.25, 3],
			target: [0, 0, 0],
			zoom: 1,
			modelPosition: [0, 0, 0],
			modelRotation: [0, 0.2, 0],
			modelScale: 1,
		},
	},
	{
		id: "primitive-capsule",
		name: "Capsule",
		primitive: "capsule",
		view: {
			cameraPosition: [0, 0.25, 3.1],
			target: [0, 0, 0],
			zoom: 1,
			modelPosition: [0, 0, 0],
			modelRotation: [0, -0.3, 0],
			modelScale: 1,
		},
	},
];

const toVec3 = (
	value: number[] | undefined,
	fallback: [number, number, number],
) =>
	Array.isArray(value) && value.length >= 3
		? ([value[0], value[1], value[2]] as [number, number, number])
		: fallback;

const toNumber = (value: number | undefined, fallback: number) =>
	typeof value === "number" ? value : fallback;

function ViewerLoader() {
	const { progress } = useProgress();
	return (
		<Html center>
			<div className="rounded-md bg-slate-900/80 px-3 py-1 text-xs font-semibold text-cyan-200">
				Loading {Math.round(progress)}%
			</div>
		</Html>
	);
}

function calculateTriangleCount(object: THREE.Object3D) {
	let triangles = 0;

	object.traverse((child) => {
		if (!(child instanceof THREE.Mesh) || !child.geometry) {
			return;
		}

		const geom = child.geometry;
		if (geom.index) {
			triangles += geom.index.count / 3;
			return;
		}

		const positions = geom.attributes.position;
		if (positions) {
			triangles += positions.count / 3;
		}
	});

	return Math.floor(triangles);
}

function CenteredModel({
	url,
	view,
	onTrianglesCalculated,
	onModelLoaded,
}: {
	url: string;
	view?: HobbyModel["view"];
	onTrianglesCalculated: (count: number) => void;
	onModelLoaded: () => void;
}) {
	const { scene } = useGLTF(url);
	const modelRootRef = useRef<THREE.Group>(null);

	const processedScene = useMemo(() => {
		const cloned = scene.clone(true);

		const box = new THREE.Box3().setFromObject(cloned);
		const size = new THREE.Vector3();
		box.getSize(size);

		const maxDim = Math.max(size.x, size.y, size.z);
		const scale = maxDim > 0 ? 1.7 / maxDim : 1;
		cloned.scale.setScalar(scale);

		box.setFromObject(cloned);
		const center = new THREE.Vector3();
		box.getCenter(center);
		cloned.position.sub(center);

		return cloned;
	}, [scene]);

	useEffect(() => {
		onTrianglesCalculated(calculateTriangleCount(processedScene));
	}, [onTrianglesCalculated, processedScene]);

	useEffect(() => {
		if (!modelRootRef.current) {
			return;
		}

		const [posX, posY, posZ] = toVec3(view?.modelPosition, [0, 0, 0]);
		const [rotX, rotY, rotZ] = toVec3(view?.modelRotation, [0, 0, 0]);
		const modelScale = toNumber(view?.modelScale, 1);

		modelRootRef.current.position.set(posX, posY, posZ);
		modelRootRef.current.rotation.set(rotX, rotY, rotZ);
		modelRootRef.current.scale.set(modelScale, modelScale, modelScale);
		onModelLoaded();
	}, [onModelLoaded, processedScene, view]);

	return (
		<group ref={modelRootRef}>
			<primitive object={processedScene} />
		</group>
	);
}

function ProceduralModel({
	variant,
	view,
	onTrianglesCalculated,
	onModelLoaded,
}: {
	variant: string | undefined;
	view?: HobbyModel["view"];
	onTrianglesCalculated: (count: number) => void;
	onModelLoaded: () => void;
}) {
	const meshRef = useRef<THREE.Mesh>(null);

	const geometry = useMemo(() => {
		if (variant === "icosahedron") {
			return new THREE.IcosahedronGeometry(1, 2);
		}

		if (variant === "capsule") {
			return new THREE.CapsuleGeometry(0.7, 1.3, 10, 22);
		}

		return new THREE.TorusKnotGeometry(0.7, 0.26, 180, 28);
	}, [variant]);

	useEffect(() => {
		const triCount = geometry.index
			? geometry.index.count / 3
			: geometry.attributes.position.count / 3;
		onTrianglesCalculated(Math.floor(triCount));

		if (meshRef.current) {
			const [posX, posY, posZ] = toVec3(view?.modelPosition, [0, 0, 0]);
			const [rotX, rotY, rotZ] = toVec3(view?.modelRotation, [0, 0, 0]);
			const modelScale = toNumber(view?.modelScale, 1);
			meshRef.current.position.set(posX, posY, posZ);
			meshRef.current.rotation.set(rotX, rotY, rotZ);
			meshRef.current.scale.set(modelScale, modelScale, modelScale);
		}

		onModelLoaded();

		return () => {
			geometry.dispose();
		};
	}, [geometry, onModelLoaded, onTrianglesCalculated, view]);

	return (
		<mesh ref={meshRef} geometry={geometry}>
			<meshStandardMaterial
				color="#22d3ee"
				roughness={0.36}
				metalness={0.42}
			/>
		</mesh>
	);
}

function CameraResetOnModelLoad({
	resetToken,
	controlsRef,
	view,
}: {
	resetToken: number;
	controlsRef: React.RefObject<OrbitControlsImpl | null>;
	view?: HobbyModel["view"];
}) {
	const { camera } = useThree();

	useEffect(() => {
		const [camX, camY, camZ] = toVec3(view?.cameraPosition, [0, 0.25, 3.2]);
		const [targetX, targetY, targetZ] = toVec3(view?.target, [0, 0, 0]);
		camera.position.set(camX, camY, camZ);
		camera.zoom = toNumber(view?.zoom, 1);

		if (controlsRef.current) {
			controlsRef.current.target.set(targetX, targetY, targetZ);
			controlsRef.current.update();
		}

		camera.lookAt(targetX, targetY, targetZ);
		camera.updateProjectionMatrix();
	}, [camera, controlsRef, resetToken, view]);

	return null;
}

export const Hobbies: React.FC<HobbiesProps> = ({ data }) => {
	const [ref, isInView] = useInView();
	const [triangles, setTriangles] = useState(0);
	const [resetToken, setResetToken] = useState(0);
	const [isViewerInteractive, setIsViewerInteractive] = useState(false);
	const [lightboxImage, setLightboxImage] = useState<{
		src: string;
		alt: string;
	} | null>(null);
	const models = data.modelViewer?.models.length
		? data.modelViewer.models
		: DEFAULT_MODELS;
	const [selectedModelId, setSelectedModelId] = useState(models[0]?.id ?? "");
	const controlsRef = useRef<OrbitControlsImpl | null>(null);
	const selectedModel =
		models.find((model) => model.id === selectedModelId) ?? models[0];
	const selectedModelView = selectedModel?.view;
	const wasInViewRef = useRef(false);

	const galleryRows = data.hobbyGallery?.rows ?? [];

	const grouped = data.entries.reduce<
		Array<{ key: string; title: string; entries: HobbyEntry[] }>
	>((acc, entry) => {
		const key = (entry.type ?? "other").toLowerCase();
		const existing = acc.find((group) => group.key === key);
		if (existing) {
			existing.entries.push(entry);
			return acc;
		}
		acc.push({
			key,
			title: formatTypeLabel(entry.type),
			entries: [entry],
		});
		return acc;
	}, []);

	const handleModelLoaded = useCallback(() => {
		setResetToken((value) => value + 1);
	}, []);

	const handleResetView = useCallback(() => {
		setResetToken((value) => value + 1);
	}, []);

	const handleEnableInteraction = useCallback(() => {
		setIsViewerInteractive(true);
	}, []);

	const openLightbox = useCallback((src: string, alt: string) => {
		setLightboxImage({ src, alt });
	}, []);

	const closeLightbox = useCallback(() => {
		setLightboxImage(null);
	}, []);

	useEffect(() => {
		models.forEach((model) => {
			if (model.path) {
				useGLTF.preload(model.path);
			}
		});
	}, [models]);

	useEffect(() => {
		setIsViewerInteractive(false);
		handleResetView();
	}, [selectedModelId, handleResetView]);

	useEffect(() => {
		if (!isInView) {
			wasInViewRef.current = false;
			setIsViewerInteractive(false);
			return;
		}

		if (!wasInViewRef.current) {
			setIsViewerInteractive(false);
			handleResetView();
			wasInViewRef.current = true;
		}
	}, [handleResetView, isInView]);

	useEffect(() => {
		if (!lightboxImage) {
			return;
		}

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				closeLightbox();
			}
		};

		window.addEventListener("keydown", handleEscape);
		return () => window.removeEventListener("keydown", handleEscape);
	}, [closeLightbox, lightboxImage]);

	return (
		<section
			ref={ref}
			className="relative overflow-hidden bg-slate-950 px-4 py-20 sm:px-6 lg:px-8"
		>
			<div className="mx-auto max-w-6xl">
				<div
					className={`mb-14 transform transition-all duration-1000 ${
						isInView
							? "opacity-100 translate-y-0"
							: "opacity-0 translate-y-10"
					}`}
				>
					<h2 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
						{data.title}
					</h2>
					<p className="max-w-3xl text-lg text-slate-300">
						{data.description}
					</p>
				</div>

				<div className="space-y-12">
					{grouped.map((group, groupIndex) => (
						<AnimatedItem key={group.key} delay={groupIndex * 100}>
							<div className="mb-5 flex items-center justify-between">
								<h3 className="text-2xl font-bold text-cyan-100">
									{group.title}
								</h3>
								<span className="rounded-full border border-cyan-300/25 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
									{group.entries.length} Item
									{group.entries.length > 1 ? "s" : ""}
								</span>
							</div>
							<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
								{group.entries.map((entry, index) => (
									<AnimatedItem
										key={entry.id}
										delay={index * 80}
									>
										<div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.35)] backdrop-blur-sm">
											<h4 className="mb-3 text-xl font-semibold text-white">
												{entry.title}
											</h4>
											<p className="text-slate-300 leading-7">
												{entry.description}
											</p>
										</div>
									</AnimatedItem>
								))}
							</div>
						</AnimatedItem>
					))}

					{galleryRows.length > 0 && (
						<AnimatedItem delay={260}>
							<div className="mt-4 space-y-6">
								<h3 className="text-2xl font-bold text-cyan-100">
									{data.hobbyGallery?.title ??
										"Visual Highlights"}
								</h3>
								<p className="max-w-3xl text-slate-300">
									{data.hobbyGallery?.description ?? ""}
								</p>

								<div className="space-y-4">
									{galleryRows.map((row, rowIndex) => (
										<div
											key={row.id}
											className="hobby-marquee-row overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-4 shadow-[0_20px_60px_rgba(15,23,42,0.35)]"
										>
											<div
												className={`hobby-marquee-track flex w-max gap-4 ${
													row.direction === "right"
														? "hobby-marquee-track-reverse"
														: ""
												}`}
												style={{
													animationDuration: `${
														row.speedSeconds ??
														28 + rowIndex * 4
													}s`,
												}}
											>
												{[
													...row.images,
													...row.images,
												].map((image, index) => (
													<div
														key={`${row.id}-${image.id}-${index}`}
														className="w-56 shrink-0 overflow-hidden rounded-xl sm:w-72"
													>
														<button
															type="button"
															onClick={() =>
																openLightbox(
																	image.src,
																	image.alt,
																)
															}
															className="block w-full"
														>
															<img
																src={image.src}
																alt={image.alt}
																className="h-36 w-full object-cover transition-transform duration-300 hover:scale-[1.03] sm:h-44"
																loading="lazy"
															/>
														</button>
													</div>
												))}
											</div>
										</div>
									))}
								</div>
							</div>
						</AnimatedItem>
					)}

					<AnimatedItem delay={340}>
						<div className="mt-4 rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.35)] sm:p-6">
							<h3 className="text-2xl font-bold text-cyan-100">
								{data.modelViewer?.title ?? "3D Model Viewer"}
							</h3>
							<p className="mt-2 max-w-3xl text-slate-300">
								{data.modelViewer?.description ??
									"Rotate, pan, zoom, switch models, and inspect poly counts."}
							</p>

							<div className="relative mt-5 h-[360px] overflow-hidden rounded-xl border border-white/10 bg-slate-950 sm:h-[460px]">
								<Canvas
									camera={{
										position: toVec3(
											selectedModelView?.cameraPosition,
											[0, 0.25, 3.2],
										),
										fov: 48,
									}}
								>
									<CameraResetOnModelLoad
										resetToken={resetToken}
										controlsRef={controlsRef}
										view={selectedModelView}
									/>
									<ambientLight intensity={0.65} />
									<directionalLight
										position={[8, 10, 9]}
										intensity={0.9}
									/>

									<Suspense fallback={<ViewerLoader />}>
										{selectedModel?.path ? (
											<CenteredModel
												key={selectedModel.path}
												url={selectedModel.path}
												view={selectedModelView}
												onTrianglesCalculated={
													setTriangles
												}
												onModelLoaded={
													handleModelLoaded
												}
											/>
										) : (
											<ProceduralModel
												key={selectedModel?.id}
												variant={
													selectedModel?.primitive
												}
												view={selectedModelView}
												onTrianglesCalculated={
													setTriangles
												}
												onModelLoaded={
													handleModelLoaded
												}
											/>
										)}
									</Suspense>

									<OrbitControls
										ref={controlsRef}
										enabled={isViewerInteractive}
										enablePan
										enableRotate
										enableZoom
										target={toVec3(
											selectedModelView?.target,
											[0, 0, 0],
										)}
									/>
								</Canvas>

								{!isViewerInteractive && (
									<div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/35">
										<button
											type="button"
											onClick={handleEnableInteraction}
											className="rounded-lg border border-cyan-300/50 bg-slate-900/85 px-5 py-3 text-sm font-semibold text-cyan-100 transition-colors hover:bg-slate-800"
										>
											{data.modelViewer
												?.interactionButtonText ??
												"Enable 3D Interaction"}
										</button>
									</div>
								)}

								<div className="pointer-events-none absolute left-3 top-3 z-10 rounded-md border border-cyan-300/25 bg-slate-950/80 px-3 py-2 text-xs font-semibold text-cyan-200">
									Tris: {triangles.toLocaleString()}
								</div>

								<button
									type="button"
									onClick={handleResetView}
									className="absolute right-3 top-3 z-10 rounded-md border border-white/20 bg-slate-900/85 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
								>
									Reset View
								</button>
							</div>

							<div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
								{models.map((model) => {
									const isActive =
										selectedModelId === model.id;
									return (
										<button
											key={model.id}
											type="button"
											onClick={() =>
												setSelectedModelId(model.id)
											}
											className={`group overflow-hidden rounded-2xl border text-left transition-all duration-300 ${
												isActive
													? "border-cyan-300/70 bg-gradient-to-br from-cyan-400/12 via-slate-950/95 to-blue-400/10 shadow-[0_18px_40px_rgba(34,211,238,0.18)]"
													: "border-white/10 bg-slate-950/80 hover:border-cyan-300/30 hover:bg-slate-900/90"
											}`}
										>
											{model.thumbnail ? (
												<div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
													<img
														src={model.thumbnail}
														alt={model.name}
														className="h-36 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-40"
													/>
													<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
												</div>
											) : (
												<div className="flex h-36 w-full items-center justify-center bg-slate-900 text-sm text-slate-400 sm:h-40">
													No thumbnail
												</div>
											)}
											<div className="space-y-1 px-4 py-3">
												<div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200/80">
													{model.path
														? "GLB Model"
														: "Primitive Model"}
												</div>
												<div className="text-base font-semibold text-white">
													{model.name}
												</div>
												<div className="text-sm text-slate-400">
													{isActive
														? "Selected for inspection"
														: "Switch viewer focus"}
												</div>
											</div>
										</button>
									);
								})}
							</div>
						</div>
					</AnimatedItem>
				</div>
			</div>

			{lightboxImage && (
				<div
					className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 p-4 backdrop-blur-2xl"
					onClick={closeLightbox}
				>
					<div className="absolute inset-0 bg-black/45" />
					<button
						type="button"
						onClick={closeLightbox}
						className="absolute right-4 top-4 z-10 rounded-md border border-white/20 bg-slate-950/85 px-3 py-2 text-sm font-semibold text-white backdrop-blur-xl"
					>
						Close
					</button>
					<img
						src={lightboxImage.src}
						alt={lightboxImage.alt}
						className="relative z-10 max-h-[88vh] max-w-[92vw] rounded-xl border border-white/15 object-contain shadow-[0_30px_90px_rgba(0,0,0,0.6)]"
						onClick={(event) => event.stopPropagation()}
					/>
				</div>
			)}
		</section>
	);
};
