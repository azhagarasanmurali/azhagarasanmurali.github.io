/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		colors: {
			"dark-950": "#0a0a0a",
			"dark-900": "#111111",
			"dark-800": "#1a1a1a",
			"dark-700": "#252525",
			"accent-primary": "#7c3aed",
			"accent-secondary": "#06b6d4",
			transparent: "transparent",
			current: "currentColor",
			white: "#ffffff",
			"gray-200": "#e5e7eb",
			"gray-300": "#d1d5db",
			"gray-400": "#9ca3af",
			"gray-500": "#6b7280",
			"gray-600": "#4b5563",
			"gray-800": "#1f2937",
		},
		extend: {
			animation: {
				"fade-in": "fadeIn 0.8s ease-in-out",
				"slide-in-right": "slideInRight 0.8s ease-out",
				"slide-in-left": "slideInLeft 0.8s ease-out",
				float: "float 3s ease-in-out infinite",
				glow: "glow 2s ease-in-out infinite",
				blob: "blob 7s infinite",
			},
			keyframes: {
				fadeIn: {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				slideInRight: {
					"0%": { transform: "translateX(100px)", opacity: "0" },
					"100%": { transform: "translateX(0)", opacity: "1" },
				},
				slideInLeft: {
					"0%": { transform: "translateX(-100px)", opacity: "0" },
					"100%": { transform: "translateX(0)", opacity: "1" },
				},
				float: {
					"0%, 100%": { transform: "translateY(0px)" },
					"50%": { transform: "translateY(-20px)" },
				},
				glow: {
					"0%, 100%": {
						boxShadow: "0 0 20px rgba(124, 58, 237, 0.3)",
					},
					"50%": { boxShadow: "0 0 40px rgba(124, 58, 237, 0.6)" },
				},
				blob: {
					"0%, 100%": { transform: "translate(0, 0) scale(1)" },
					"33%": { transform: "translate(30px, -50px) scale(1.1)" },
					"66%": { transform: "translate(-20px, 20px) scale(0.9)" },
				},
			},
			backdropBlur: {
				xs: "2px",
			},
			transitionDelay: {
				100: "100ms",
				200: "200ms",
				300: "300ms",
				400: "400ms",
				500: "500ms",
			},
		},
	},
	plugins: [],
};
