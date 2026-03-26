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

export const portfolioData = stripCommentFields(
	rawPortfolioData as unknown as JsonValue,
) as unknown as typeof rawPortfolioData;
