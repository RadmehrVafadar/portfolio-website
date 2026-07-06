# Repository Guidelines

## Project Structure & Module Organization

This is a Vite + React + TypeScript portfolio site. The main app entry is `src/main.tsx`, with components and paired styles in `src/`, such as `Background.tsx`/`Background.css` and `menu.tsx`/`menu.css`. Static files live in `public/`, including `resume.pdf`, `icon.png`, the portfolio game under `public/portfolio-game/`, and blog assets under `public/blog/`. Build and tooling configuration is kept at the root in `vite.config.ts`, `tsconfig*.json`, and `.eslintrc.cjs`.

## Build, Test, and Development Commands

- `npm install`: install dependencies from `package-lock.json`.
- `npm run dev`: start the local Vite development server.
- `npm run build`: create the production build in `dist/`.
- `npm run lint`: run ESLint for TypeScript and TSX files with warnings treated as failures.
- `npm run preview`: serve the production build locally for verification.
- `npm run deploy`: build and publish `dist/` with `gh-pages`.

There is currently no dedicated test script; use `npm run lint` and `npm run build` as the required verification steps before submitting changes.

## Coding Style & Naming Conventions

Use TypeScript and React function components for app code. Keep component files in PascalCase when they export a component, and keep related CSS next to the component when practical. Existing code uses single quotes and semicolons inconsistently; prefer the ESLint configuration as the source of truth and avoid broad formatting-only churn. Keep public URL paths absolute from `public/`, for example `/resume.pdf` or `/portfolio-game/`.

## Testing Guidelines

No automated unit test framework is configured. For UI changes, run `npm run dev` and manually verify the affected route or static page. For production safety, run `npm run build` and `npm run preview` to confirm assets resolve correctly. If tests are added later, place them near the code they cover and add a matching `npm test` script.

## Agent-Specific Instructions

Do not overwrite existing contributor docs. Keep edits scoped to the requested feature or fix, and avoid regenerating static assets unless the task specifically requires it.
