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
import { ChevronLeft, ChevronRight, X } from "lucide-react";
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

const buildCollagePool = (images: HobbyGalleryImage[], minCount = 14) => {
	if (!images.length) return [];

	const targetCount = Math.max(minCount, images.length * 2);
	return Array.from({ length: targetCount }, (_, index) => {
		const image = images[index % images.length];
		return {
			...image,
			instanceId: `${image.id}-${index}`,
		};
	});
};

const getWrappedIndex = (nextIndex: number, total: number) => {
	if (!total) return 0;
	return (nextIndex + total) % total;
};

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
	const models = data.modelViewer?.models.length
		? data.modelViewer.models
		: DEFAULT_MODELS;
	const [selectedModelId, setSelectedModelId] = useState(models[0]?.id ?? "");
	const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
	const controlsRef = useRef<OrbitControlsImpl | null>(null);
	const selectedModel =
		models.find((model) => model.id === selectedModelId) ?? models[0];
	const selectedModelView = selectedModel?.view;
	const wasInViewRef = useRef(false);

	const galleryRows = data.hobbyGallery?.rows ?? [];
	const galleryImages = useMemo(() => {
		const uniqueImages = new Map<string, HobbyGalleryImage>();

		galleryRows.forEach((row) => {
			row.images.forEach((image) => {
				if (!uniqueImages.has(image.src)) {
					uniqueImages.set(image.src, image);
				}
			});
		});

		return Array.from(uniqueImages.values());
	}, [galleryRows]);
	const activeLightboxImage =
		lightboxIndex !== null ? (galleryImages[lightboxIndex] ?? null) : null;

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

	const openLightbox = useCallback(
		(index: number) => {
			const wrappedIndex = getWrappedIndex(index, galleryImages.length);
			setLightboxIndex(wrappedIndex);
		},
		[galleryImages.length],
	);

	const goToPreviousLightboxImage = useCallback(() => {
		if (lightboxIndex === null) return;
		const nextIndex = getWrappedIndex(
			lightboxIndex - 1,
			galleryImages.length,
		);
		setLightboxIndex(nextIndex);
	}, [galleryImages.length, lightboxIndex]);

	const goToNextLightboxImage = useCallback(() => {
		if (lightboxIndex === null) return;
		const nextIndex = getWrappedIndex(
			lightboxIndex + 1,
			galleryImages.length,
		);
		setLightboxIndex(nextIndex);
	}, [galleryImages.length, lightboxIndex]);

	const closeLightbox = useCallback(() => {
		setLightboxIndex(null);
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
		if (!galleryImages.length) {
			setLightboxIndex(null);
			return;
		}

		setLightboxIndex((currentIndex) =>
			currentIndex === null
				? null
				: getWrappedIndex(currentIndex, galleryImages.length),
		);
	}, [galleryImages.length]);

	useEffect(() => {
		if (lightboxIndex === null) {
			return;
		}

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				closeLightbox();
				return;
			}

			if (event.key === "ArrowLeft") {
				goToPreviousLightboxImage();
				return;
			}

			if (event.key === "ArrowRight") {
				goToNextLightboxImage();
			}
		};

		window.addEventListener("keydown", handleEscape);
		return () => window.removeEventListener("keydown", handleEscape);
	}, [
		closeLightbox,
		goToNextLightboxImage,
		goToPreviousLightboxImage,
		lightboxIndex,
	]);

	return (
		<section
			ref={ref}
			className="relative overflow-hidden bg-slate-950 px-4 py-20 sm:px-6 lg:px-8"
		>
			<div className="mx-auto max-w-6xl">
				<div
					className={`mb-[clamp(1.5rem,2vw,2rem)] transform transition-all duration-1000 ${
						isInView
							? "opacity-100 translate-y-0"
							: "opacity-0 translate-y-10"
					}`}
				>
					<h2 className="mb-[clamp(0.8rem,1.2vw,1.2rem)] text-[clamp(1.8rem,5vw,3rem)] font-bold text-white">
						{data.title}
					</h2>
					<p className="max-w-3xl text-[clamp(0.95rem,1.2vw,1.15rem)] text-slate-300">
						{data.description}
					</p>
				</div>

				<div className="space-y-12">
					{grouped.map((group, groupIndex) => (
						<AnimatedItem key={group.key} delay={groupIndex * 100}>
							<div className="mb-[clamp(0.8rem,1.2vw,1.2rem)] flex items-center justify-between">
								<h3 className="text-[clamp(1.2rem,2.2vw,1.7rem)] font-bold text-cyan-100">
									{group.title}
								</h3>
								<span className="rounded-full border border-cyan-300/25 bg-cyan-400/10 px-[clamp(0.6rem,0.8vw,1rem)] py-[clamp(0.25rem,0.4vw,0.4rem)] text-[clamp(0.65rem,0.75vw,0.8rem)] font-semibold uppercase tracking-[0.2em] text-cyan-200">
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
									{galleryRows.map((row, rowIndex) => {
										const collagePool = buildCollagePool(
											row.images,
											16 + rowIndex * 2,
										);

										const columns = [] as Array<
											Array<
												HobbyGalleryImage & {
													instanceId: string;
												}
											>
										>;

										for (
											let index = 0;
											index < collagePool.length;
											index += 2
										) {
											columns.push(
												collagePool.slice(
													index,
													index + 2,
												),
											);
										}

										const repeatedColumns = [
											...columns,
											...columns,
										];

										return (
											<div
												key={row.id}
												className="hobby-marquee-row overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-8 shadow-[0_20px_60px_rgba(15,23,42,0.35)] sm:px-6 sm:py-10"
											>
												<div
													className={`hobby-marquee-track flex w-max items-center gap-4 sm:gap-5 ${
														row.direction ===
														"right"
															? "hobby-marquee-track-reverse"
															: ""
													}`}
													style={{
														animationDuration: `${
															row.speedSeconds ??
															34 + rowIndex * 4
														}s`,
													}}
												>
													{repeatedColumns.map(
														(
															column,
															columnIndex,
														) => {
															const offsetClass =
																columnIndex %
																	4 ===
																0
																	? "-translate-y-3"
																	: columnIndex %
																				4 ===
																		  1
																		? "translate-y-5"
																		: columnIndex %
																					4 ===
																			  2
																			? "-translate-y-1"
																			: "translate-y-3";

															return (
																<div
																	key={`${row.id}-col-${columnIndex}`}
																	className={`w-48 sm:w-56 lg:w-64 ${offsetClass} shrink-0 space-y-4 transition-transform duration-300 sm:space-y-5`}
																>
																	{column.map(
																		(
																			image,
																		) => {
																			const imageIndex =
																				galleryImages.findIndex(
																					(
																						galleryImage,
																					) =>
																						galleryImage.src ===
																						image.src,
																				);

																			return (
																				<button
																					key={`${row.id}-${image.instanceId}`}
																					type="button"
																					onClick={() =>
																						openLightbox(
																							imageIndex >=
																								0
																								? imageIndex
																								: 0,
																						)
																					}
																					className="group block w-full aspect-square overflow-hidden rounded-xl border border-white/15 bg-slate-950/85 p-2"
																				>
																					<img
																						src={
																							image.src
																						}
																						alt={
																							image.alt
																						}
																						className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
																						loading="lazy"
																					/>
																				</button>
																			);
																		},
																	)}
																</div>
															);
														},
													)}
												</div>
											</div>
										);
									})}
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

							<div
								data-model-viewer
								className="relative mt-5 aspect-square w-full overflow-hidden rounded-xl border border-white/10 bg-slate-950"
							>
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

							<div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
											className={`group overflow-hidden rounded-lg text-left transition-all duration-500 shadow-[0_0_26px_rgba(124,58,237,0.12)] hover:shadow-[0_0_52px_rgba(124,58,237,0.38),0_20px_60px_rgba(0,0,0,0.44)] ${
												isActive
													? "bg-slate-700 ring-2 ring-cyan-400/60"
													: "bg-slate-800 hover:bg-slate-700"
											}`}
										>
											{/* Thumbnail */}
											<div className="relative overflow-hidden aspect-square bg-slate-900">
												{model.thumbnail ? (
													<img
														src={model.thumbnail}
														alt={model.name}
														className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
													/>
												) : (
													<div className="w-full h-full flex items-center justify-center text-sm text-slate-400">
														No thumbnail
													</div>
												)}
												<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
											</div>
											{/* Content */}
											<div className="p-6 space-y-3">
												<div className="flex items-start justify-between gap-4">
													<div className="flex-1">
														<h3 className="text-xl font-bold text-white group-hover:text-accent-primary transition-colors duration-300">
															{model.name}
														</h3>
														<p className="text-gray-400 text-sm mt-1">
															{isActive
																? "Currently selected"
																: "Switch viewer focus"}
														</p>
													</div>
												</div>
												<div className="flex items-center justify-between border-t border-slate-700 pt-4">
													<div className="flex gap-2 flex-wrap">
														<span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
															{model.path
																? "GLB Model"
																: "Primitive Model"}
														</span>
														{isActive && (
															<span className="px-3 py-1 bg-cyan-400/10 text-cyan-300 text-xs font-semibold rounded-full border border-cyan-400/20">
																Selected
															</span>
														)}
													</div>
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

			{activeLightboxImage && (
				<div
					className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 p-4 backdrop-blur-[20px]"
					onClick={closeLightbox}
				>
					<div className="absolute inset-0 bg-slate-950/45 backdrop-blur-[20px]" />
					<button
						type="button"
						onClick={(event) => {
							event.stopPropagation();
							goToPreviousLightboxImage();
						}}
						className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-slate-950/85 p-3 text-white backdrop-blur-xl transition-colors hover:bg-slate-800"
						aria-label="Previous image"
					>
						<ChevronLeft className="h-5 w-5" />
					</button>
					<button
						type="button"
						onClick={(event) => {
							event.stopPropagation();
							closeLightbox();
						}}
						className="absolute right-4 top-4 z-10 rounded-full border border-white/20 bg-slate-950/85 p-3 text-white backdrop-blur-xl transition-colors hover:bg-slate-800"
						aria-label="Close image"
					>
						<X className="h-5 w-5" />
					</button>
					<button
						type="button"
						onClick={(event) => {
							event.stopPropagation();
							goToNextLightboxImage();
						}}
						className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-slate-950/85 p-3 text-white backdrop-blur-xl transition-colors hover:bg-slate-800"
						aria-label="Next image"
					>
						<ChevronRight className="h-5 w-5" />
					</button>
					<div
						className="relative z-10 flex max-w-[92vw] flex-col items-center gap-3"
						onClick={(event) => event.stopPropagation()}
					>
						<img
							src={activeLightboxImage.src}
							alt={activeLightboxImage.alt}
							className="max-h-[84vh] max-w-[92vw] rounded-xl border border-white/15 object-contain shadow-[0_30px_90px_rgba(0,0,0,0.6)]"
						/>
						<p className="text-center text-sm text-slate-200">
							{activeLightboxImage.alt}
							<span className="ml-2 text-slate-400">
								{(lightboxIndex ?? 0) + 1} /{" "}
								{galleryImages.length}
							</span>
						</p>
					</div>
				</div>
			)}
		</section>
	);
};
