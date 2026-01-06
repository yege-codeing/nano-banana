# Repository Guidelines

## Project Structure & Module Organization

- `app/`: Next.js App Router entrypoints (`app/layout.tsx`, `app/page.tsx`) and global styles (`app/globals.css`).
- `components/`: Shared React components.
  - `components/ui/`: shadcn/ui primitives (Radix-based). Prefer reusing these rather than re-implementing UI patterns.
- `hooks/`: Reusable React hooks (naming: `use-*.ts` and exported as `useXyz`).
- `lib/`: Small, framework-agnostic utilities (example: `lib/utils.ts` exports `cn()` for className merging).
- `public/`: Static assets served at `/` (images, icons).
- `styles/`: Extra CSS; currently `app/globals.css` is the main stylesheet referenced by the app.

## Build, Test, and Development Commands

This is a TypeScript + React + Next.js project (Next.js 16). A `pnpm-lock.yaml` is present, so `pnpm` is preferred:

- `pnpm install` (or `npm install`): Install dependencies.
- `pnpm dev` (or `npm run dev`): Run the local dev server.
- `pnpm build` (or `npm run build`): Create a production build.
- `pnpm start` (or `npm start`): Run the production server after building.
- `pnpm lint` (or `npm run lint`): Run linting (note: this repo currently has no committed ESLint config).
- `pnpm exec tsc --noEmit`: Run a strict typecheck (recommended since `next.config.mjs` ignores TS build errors).

## Coding Style & Naming Conventions

- TypeScript only (`.ts`/`.tsx`), React components in PascalCase, hooks as `useXyz`.
- Keep imports using the `@/*` path alias where possible (see `tsconfig.json`).
- Prefer Tailwind utility classes for styling; keep design tokens in `app/globals.css` (CSS variables + theme).

## Testing Guidelines

No automated test runner is currently configured (no `test` script and no `*.test.*` files). If you add tests, use a consistent convention (e.g., `*.test.tsx`) and include a `test` script in `package.json`.

## Commit & Pull Request Guidelines

This checkout does not include a `.git/` directory, so commit conventions can’t be inferred from history. Use a clear convention such as Conventional Commits:

- `feat: add image upload validation`
- `fix: handle empty prompt`
- `chore: bump dependencies`

PRs should include: a short description, linked issue (if any), and screenshots/GIFs for UI changes.
