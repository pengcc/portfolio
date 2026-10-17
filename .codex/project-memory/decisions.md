# Portfolio — Durable Decisions

Record accepted, persistent project decisions only. Revisit them when the owner changes direction or new evidence invalidates them.

## 2026-10-16: Small, public, static-first portfolio

- **Decision:** Build a public portfolio with independent, practical web demos. Favor static output and free/low-cost hosting until a real need justifies more.
- **Reason:** Keep maintenance and operating costs proportionate while making examples easy to inspect and share.
- **Boundary:** No automatic purchase, VPS dependency, telemetry, or production deployment.

## 2026-10-17: Selective cross-project tooling reuse (revises 2026-10-16 boundary)

- **Decision:** Keep lightweight collaboration and independent review, and allow selective reuse of publicly safe, general-purpose Principles, Contracts, Skills, scripts, and hooks from Badminton or other projects.
- **Reason:** Reuse useful working patterns without adopting unrelated project mechanics or rebuilding them needlessly.
- **Boundary:** Inspect and adapt each selected element to Portfolio's workflows, paths, dependencies, and side effects; maintain it here. Do not publish secrets, private or customer data, internal deployment settings, unpublished details, or unapproved personal information. No automatic full-tooling import or donor-repository runtime dependency; merge and deployment still need separate authorization.

## 2026-10-16: Reversible bootstrap shell

- **Decision:** Start with a minimal Vite + React + TypeScript static build and minimal Biome, Vitest, and CI tooling.
- **Reason:** Provide a working baseline for future demos without committing to a full site design or server framework.
- **Boundary:** The visual shell is not the final brand; Astro can be evaluated later if the content-first site benefits from it. Demo migrations are separate changes.
