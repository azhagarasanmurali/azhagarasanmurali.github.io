# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # Install deps (CI uses `npm ci`, Node 20)
npm run dev          # Vite dev server (http://localhost:5173)
npm run build        # `tsc -b` type-check, then `vite build` → dist/
npm run preview      # Serve dist/ locally
npm run lint         # ESLint flat config (eslint .)
```

- There is no test suite or test runner configured. Verification is `npm run build` (type-check) plus `npm run lint`.
- Pushing to `main` triggers `.github/workflows/deploy.yml`, which runs `npm ci && npm run build` and deploys `dist/` to GitHub Pages.

## Architecture

This is a single-page React 19 + TypeScript + Vite portfolio. Almost all visible content is data-driven from one JSON file.

**Content lives in `src/config/portfolio.json`.** `src/config/portfolio.ts` loads it and:
- Recursively strips any object key starting with `comment_` (use this prefix for notes in the JSON).
- Normalizes `projects[]` fields (`category`, `role`, `technologies` accept either arrays or comma-separated strings; `images`, `videos`, `links` default to empty).
- Exports `portfolioData`, which is the only data source the components should use.

**Section layout is driven by the `sections` array in the JSON.** `src/App.tsx` reads it to decide:
- Order of sections in `<main>` and nav items (`id`, `label`, optional `hidden: true` to skip).
- The `social` id is filtered out of both the nav and the rendered list (social links are shown inside Contact).
- Known ids (`hero`, `about`, `projects`, `hobbies`, `timeline`/`experience`, `contact`) map to dedicated components. Any other id whose top-level JSON key is an object falls through to the generic `DynamicSection` component, so adding a new section usually means adding a JSON key plus a `sections` entry, not new React code.
- If `sections` is missing, App falls back to the top-level keys of the JSON.

**Loading flow in `App.tsx`:** a `LoadingScreen` is shown until the hero image, hero background video, and profile image are preloaded (images via `Image`, videos via metadata). A minimum display time is enforced, then `AppSkeleton` flashes briefly. Components other than Hero/Navigation/LoadingScreen/AppSkeleton are `lazy()`-loaded with `Suspense`.

**Scrolling model:** the page is `h-screen overflow-hidden`; the `<main>` element is the actual scroll container. `hooks/useSectionNav.ts` relies on that: it scrolls `main` to a section's `offsetTop` (minus nav height) and uses an IntersectionObserver to track the active section for the nav. Any code that needs scroll position should query `main`, not `window`.

**Project detail modal:** selecting a project sets `selectedProject` state in App; `ProjectDetail` renders over the page from `portfolioData.projects`.

**Styling:** Tailwind CSS 3 with custom tokens (`dark-950`…`dark-700`, `accent-primary` #7c3aed, `accent-secondary` #06b6d4) and global styles in `src/index.css`. Theme tokens live in `tailwind.config.js` (the only Tailwind config).

**Static assets** live in `public/assets/` (images, videos, resume PDF) and are referenced by relative paths from the JSON (e.g. `assets/images/hero-image.jpg`).

