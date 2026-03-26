# Portfolio Site (JSON-Driven)

This portfolio is configured primarily from one file:

- src/config/portfolio.json

You can control section order, section visibility, navigation labels, content, grouping, and most visual behavior by editing that JSON.

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Run locally:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

## Core Idea

The app reads top-level keys from portfolio.json and renders sections in the order defined by the sections array.

- Move a section in sections: the page order and navigation order both change.
- Rename a section id in sections: use the same id as the section object key.
- Hide a section: set hidden to true in sections.
- Add a new section: add a new object key plus an entry in sections.

## Configuration Map

Top-level keys you can define:

- personal: identity + resume
- loading: loading text
- sections: page structure and nav labels
- design: optional global guidance values
- hero, about, projectsSection, projects, hobbies, experience, social, contact
- any custom section object (rendered by the dynamic section renderer)

## sections (Order + Navigation)

Example:

```json
{
	"sections": [
		{ "id": "hero", "label": "Home" },
		{ "id": "about", "label": "About" },
		{ "id": "projects", "label": "Projects" },
		{ "id": "hobbies", "label": "Hobbies" },
		{ "id": "experience", "label": "Experience" },
		{ "id": "social", "label": "Social" },
		{ "id": "contact", "label": "Contact" }
	]
}
```

Supported section entry fields:

- id: section id key (required)
- label: nav label (required)
- hidden: true/false (optional)

## Generic Style Language (No low-level style values)

Use these generic design terms under each section's design object.

Shared terms (many sections):

- verticalAlign: top | center
- spacing: compact | comfortable | airy
- surface: plain | muted | elevated
- contentWidth: narrow | standard | wide
- emphasis/card tone terms: soft | balanced | strong

### Hero design options

Path: hero.design

- verticalAlign: top | center
- spacing: compact | comfortable | airy
- textScale: compact | regular | large
- contentWidth: narrow | standard | wide
- mood: calm | balanced | dramatic
- ctaTone: soft | balanced | strong
- showScrollCue: true | false

### About design options

Path: about.design

- layout: split | stacked
- spacing: compact | comfortable | airy
- surface: plain | muted | elevated
- skillsStyle: minimal | pill | card
- verticalAlign: top | center
- contentWidth: standard | wide

### Experience design options

Path: experience.design

- spacing: compact | comfortable | airy
- surface: plain | muted | elevated
- lineStyle: subtle | balanced | strong
- cardTone: soft | balanced | strong
- verticalAlign: top | center

### Social and Contact design options

Path: social.design and contact.design

- verticalAlign: top | center

### Dynamic section design options

Any custom section can include:

- title
- description
- design.verticalAlign
- list data in one of: entries | items | list

## Section Content Schemas

### personal

```json
{
	"personal": {
		"name": "Your Name",
		"title": "Role",
		"tagline": "Tagline",
		"email": "you@example.com",
		"phone": "+00 00000 00000",
		"resumeUrl": "https://...",
		"location": "City, Country"
	}
}
```

### loading

```json
{
	"loading": {
		"messages": ["Message 1", "Message 2", "Message 3"]
	}
}
```

### hero

```json
{
	"hero": {
		"heading": "Main heading",
		"subheading": "Supporting text",
		"ctaText": "Button text",
		"backgroundVideo": "assets/videos/hero.mp4",
		"heroImage": "assets/images/hero.jpg",
		"design": {
			"mood": "balanced",
			"textScale": "regular"
		}
	}
}
```

Note: if both backgroundVideo and heroImage exist, video is used first.

### about

```json
{
	"about": {
		"title": "About Me",
		"description": "...",
		"profileImage": "assets/images/profile.jpg",
		"skills": ["Skill 1", "Skill 2"],
		"design": {
			"layout": "split",
			"skillsStyle": "card"
		}
	}
}
```

### projectsSection + projects

projectsSection controls section heading copy only.

```json
{
	"projectsSection": {
		"title": "Featured Projects",
		"description": "Section subtitle"
	},
	"projects": [
		{
			"id": "project-1",
			"type": "Personal",
			"title": "Project title",
			"tagline": "One-liner",
			"category": "Category",
			"year": 2026,
			"description": "Short",
			"detailedDescription": "Long",
			"thumbnail": "assets/images/projects/thumb.jpg",
			"images": ["assets/images/projects/1.jpg"],
			"youtubeUrl": "https://www.youtube.com/embed/...",
			"videoAsset": "assets/videos/demo.mp4",
			"role": "Role",
			"team": 1,
			"duration": "2 months",
			"technologies": ["Tech A", "Tech B"],
			"challenge": "...",
			"solution": "...",
			"results": "...",
			"links": {
				"website": "https://...",
				"github": "https://...",
				"steam": "https://...",
				"itch": "https://..."
			}
		}
	]
}
```

Type grouping behavior:

- Items with the same type are grouped automatically.
- Changing type names changes rendered group names automatically.

### hobbies

```json
{
	"hobbies": {
		"title": "Hobbies",
		"description": "...",
		"entries": [
			{
				"id": "hobby-1",
				"type": "creative",
				"title": "...",
				"description": "..."
			}
		]
	}
}
```

### experience

```json
{
	"experience": {
		"title": "Experience",
		"description": "...",
		"design": {
			"lineStyle": "balanced",
			"cardTone": "balanced"
		},
		"entries": [
			{
				"id": "exp-1",
				"type": "work",
				"title": "Role",
				"organization": "Company",
				"location": "City",
				"period": "2022 - Present",
				"description": "...",
				"highlights": ["A", "B"]
			}
		]
	}
}
```

Compatibility:

- experience is preferred.
- timeline is also supported for backward compatibility.

### social

```json
{
	"social": {
		"title": "Connect",
		"description": "...",
		"design": { "verticalAlign": "center" },
		"links": [
			{ "platform": "GitHub", "url": "https://...", "icon": "github" }
		]
	}
}
```

Supported icons:

- github
- linkedin
- twitter
- gamepad
- youtube

### contact

```json
{
	"contact": {
		"title": "Let's Work Together",
		"description": "...",
		"email": "you@example.com",
		"availability": "Open to opportunities",
		"design": { "verticalAlign": "center" }
	}
}
```

## Add a New Section (No code changes in most cases)

1. Add the section to sections:

```json
{ "id": "awards", "label": "Awards" }
```

2. Add a top-level awards object:

```json
{
	"awards": {
		"title": "Awards",
		"description": "Recognition and milestones",
		"design": { "verticalAlign": "top" },
		"entries": [
			{
				"id": "award-1",
				"type": "global",
				"title": "Best Indie Game",
				"description": "Award details"
			}
		]
	}
}
```

3. Done. It appears in nav and page order automatically.

## Reorder Existing Sections

Just reorder sections array items.

- Navigation order follows it.
- Render order follows it.

## Hide a Section Temporarily

```json
{ "id": "hobbies", "label": "Hobbies", "hidden": true }
```

## Asset Paths

Put media under public/assets and reference paths like:

- assets/images/...
- assets/videos/...

## Troubleshooting

- Section not visible:
- Ensure sections includes the section id.
- Ensure top-level object key matches id exactly.
- Check hidden is not true.

- Grouping not as expected:
- Verify each item's type field.

- Media not showing:
- Verify file exists under public/assets and path is correct.

## Notes for Advanced Users

- comment\_ prefixed fields in JSON are ignored by the loader.
- Dynamic sections can be used for future content models without code edits.
- For highly custom interactions, create a dedicated component and map it in App.
