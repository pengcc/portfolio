# Portfolio

Public, static-first home for small, practical web-development demos.

## Status

This is the **project bootstrap**, not a finished website or a collection of running demos. The initial catalog identifies three candidates for later, separately reviewed migrations:

- JSON → CSV Converter
- Shopify CSV Validator
- Mobile Checkout

These are currently marked **Planned** and intentionally do not link to placeholder routes.

## Tech stack

- React + TypeScript with Vite, producing a static `dist/` output; no server or database.
- pnpm 11.26.0 and Node.js 24.
- Biome for formatting and lint checks, Vitest for tests, GitHub Actions for PR checks.

The Vite shell is a reversible bootstrap choice. Final homepage styling, any Astro migration, and each demo's design/implementation are separate decisions.

## Run locally

Install Node.js 24 and pnpm 11.26.0, then:

```sh
pnpm install
pnpm dev
```

Quality checks:

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

`pnpm build` generates `dist/`. The repository does not currently have a committed `pnpm-lock.yaml` because the bootstrap dependencies could not be installed in the originating environment. **Generate and commit a lockfile with a verified `pnpm install` before merging**, then switch CI installation to `pnpm install --frozen-lockfile` and consider enabling dependency caching. The initial CI deliberately runs with `--no-frozen-lockfile` to reveal bootstrap issues; that is an interim compromise, not the desired final state.

## Collaboration and public repository boundaries

- `AGENTS.md` is the entry point for coding agents.
- `.codex/chatgpt/project-instructions.md` is the source for ChatGPT Project setup; it does not auto-sync into ChatGPT settings.
- `docs/collaboration.md` defines proportional task alignment, independent PR review, and publication boundaries.
- `.codex/project-memory/decisions.md` records durable accepted decisions only.

Do not publish customer data, private project artifacts, API keys, analytics tokens, or unapproved personal information.

## Deployment (not configured yet)

A static host such as Cloudflare Pages is a potential fit: build command `pnpm build`, output directory `dist`. This is **documentation only**, not a configured deployment. Preview, production publication, custom domains, and any external costs require separately approved steps.
