import rawPortfolioData from "./portfolio.json";

type JsonValue =
	| string
	| number
	| boolean
	| null
	| JsonValue[]
	| { [key: string]: JsonValue };

const isPlainObject = (
	value: JsonValue,
): value is { [key: string]: JsonValue } => {
	return typeof value === "object" && value !== null && !Array.isArray(value);
};

const stripCommentFields = (value: JsonValue): JsonValue => {
	if (Array.isArray(value)) {
		return value.map(stripCommentFields);
	}

	if (!isPlainObject(value)) {
		return value;
	}

	return Object.entries(value).reduce<{ [key: string]: JsonValue }>(
		(accumulator, [key, nestedValue]) => {
			if (key.startsWith("comment_")) {
				return accumulator;
			}

			accumulator[key] = stripCommentFields(nestedValue);
			return accumulator;
		},
		{},
	);
};

// Type definitions for portfolio data structure
interface VideoItem {
	type: "youtube" | "asset";
	url: string;
	title?: string;
}

interface Project {
	id: string;
	type: string;
	title: string;
	tagline: string;
	category: string[];
	year: number;
	description?: string;
	detailedDescription?: string;
	thumbnail: string;
	images: string[];
	videos?: VideoItem[];
	role?: string[];
	team?: number;
	duration?: string;
	technologies?: string[];
	challenge?: string;
	solution?: string;
	results?: string;
	links?: {
		website?: string;
		github?: string;
		steam?: string;
		itch?: string;
	};
}

interface PortfolioData {
	personal: {
		name: string;
		title: string;
		tagline: string;
		email: string;
		phone: string;
		resumeUrl: string;
		location: string;
	};
	loading: {
		messages: string[];
	};
	hero: {
		heading: string;
		subheading: string;
		ctaText: string;
		heroImage?: string;
		backgroundVideo?: string;
		design?: {
			verticalAlign?: string;
			spacing?: string;
			textScale?: string;
			contentWidth?: string;
			mood?: string;
			ctaTone?: string;
			showScrollCue?: boolean;
		};
	};
	about: {
		title: string;
		description: string;
		skills: string[];
		profileImage?: string;
		design?: {
			layout?: string;
			spacing?: string;
			surface?: string;
			skillsStyle?: string;
			verticalAlign?: string;
			contentWidth?: string;
		};
	};
	projects: Project[];
	hobbies?: {
		title: string;
		description: string;
		design?: { verticalAlign?: string };
		entries: Array<{
			id: string;
			type?: string;
			title: string;
			description: string;
			[key: string]: unknown;
		}>;
	};
	social?: {
		title: string;
		description: string;
		design?: { verticalAlign?: string };
		links: Array<{
			platform: string;
			url: string;
			icon: string;
		}>;
	};
	contact: {
		title: string;
		description: string;
		email: string;
		availability: string;
		design?: {
			verticalAlign?: string;
		};
	};
	projectsSection?: {
		title?: string;
		description?: string;
		design?: { verticalAlign?: string };
	};
	sections?: Array<{
		id: string;
		label: string;
	}>;
	[key: string]: unknown;
}

const normalizeCategoryList = (value: unknown): string[] => {
	if (Array.isArray(value)) {
		return value
			.filter((entry): entry is string => typeof entry === "string")
			.map((entry) => entry.trim())
			.filter(Boolean);
	}

	if (typeof value === "string") {
		return value
			.split(",")
			.map((entry) => entry.trim())
			.filter(Boolean);
	}

	return [];
};

const normalizeTextList = (value: unknown): string[] => {
	if (Array.isArray(value)) {
		return value
			.filter((entry): entry is string => typeof entry === "string")
			.map((entry) => entry.trim())
			.filter(Boolean);
	}

	if (typeof value === "string") {
		return value
			.split(",")
			.map((entry) => entry.trim())
			.filter(Boolean);
	}

	return [];
};

const sanitizedPortfolioData = stripCommentFields(
	rawPortfolioData as unknown as JsonValue,
) as unknown as PortfolioData;

const normalizedProjects = (sanitizedPortfolioData.projects ?? []).map(
	(project) => ({
		...project,
		category: normalizeCategoryList(project.category),
		images: Array.isArray(project.images) ? project.images : [],
		videos: Array.isArray(project.videos) ? project.videos : [],
		role: normalizeTextList(project.role),
		technologies: normalizeTextList(project.technologies),
		links: project.links ?? {},
	}),
);

export const portfolioData = {
	...sanitizedPortfolioData,
	projects: normalizedProjects,
} as PortfolioData;
