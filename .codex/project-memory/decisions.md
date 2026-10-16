# Portfolio — Durable Decisions

Record accepted, persistent project decisions only. Revisit them when the owner changes direction or new evidence invalidates them.

## 2026-10-16: Small, public, static-first portfolio

- **Decision:** Build a public portfolio with independent, practical web demos. Favor static output and free/low-cost hosting until a real need justifies more.
- **Reason:** Keep maintenance and operating costs proportionate while making examples easy to inspect and share.
- **Boundary:** No automatic purchase, VPS dependency, telemetry, or production deployment.

## 2026-10-16: Adopt collaboration principles, not donor tooling

- **Decision:** Keep a concise entry point, explicit task scope, evidence-based PR review, and separate merge/deploy authorization.
- **Reason:** These are useful across projects, unlike Badminton-specific infrastructure and task lifecycle mechanics.
- **Boundary:** No copying the donor project's private content, scripts, hooks, or complete `.codex` system. This repository's rules are owned and maintained here.

## 2026-10-16: Reversible bootstrap shell

- **Decision:** Start with a minimal Vite + React + TypeScript static build and minimal Biome, Vitest, and CI tooling.
- **Reason:** Provide a working baseline for future demos without committing to a full site design or server framework.
- **Boundary:** The visual shell is not the final brand; Astro can be evaluated later if the content-first site benefits from it. Demo migrations are separate changes.
