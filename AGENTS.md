# Portfolio — Agent Entry Point

This is a public, lightweight portfolio for practical web-development demos. The exact repository is `pengcc/portfolio`.

## Start here

- Read this file and the current `README.md` before changing the project.
- For ChatGPT Project work, use `.codex/chatgpt/project-instructions.md` as the project-specific bootstrap.
- Follow `docs/collaboration.md` for proportionate task alignment, delivery, and review.
- For substantive design or architecture trade-offs, consult `docs/design-judgment-principles.md` as a judgment aid; do not load it for routine changes or treat it as extra approval or workflow authority.
- Consult `.codex/project-memory/decisions.md` only for decisions relevant to the task.
- Verify current source and PR base/head before making repository-specific claims.

## Boundaries

- Prefer the smallest testable change; do not add complex agent frameworks, monorepo scaffolding, or unused infrastructure.
- This repository is **public**. Never commit credentials, customer data, confidential or unpublished project details, internal deployment settings, or personal information not approved for publication. Reused material must be safe and authorized for public release, even when sourced from a private repository.
- The initial site is a static React/TypeScript shell, **not** an approved final visual design. Avoid default-blue boilerplate or unrequested design expansion.
- Demos are separate work items. Planned entries are not live or verified implementations.
- Do not add servers, databases, paid services, telemetry, or VPS dependencies without an explicit decision.
- Never mutate global tooling or deployment environments for routine project work.
- General-purpose Principles, Contracts, Skills, scripts, and hooks from Badminton or other projects may be reused selectively when publicly safe and useful. Inspect each candidate, adapt its paths, dependencies, assumptions, and side effects for Portfolio, and maintain the resulting files here; do not bulk-import a donor tooling stack.
- Review what imported scripts and hooks execute and access before enabling them; never introduce secrets, private data, or unapproved external effects.

## Change and publication discipline

- Work on a feature branch and propose a focused PR; never push directly to `main`.
- Validate with `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` when dependencies are available. If not run, state that explicitly.
- An independent review examines the **exact current** PR base/head and meaningful behavior, risks, and regressions. Review alone does not authorize modifications or merge.
- PR creation does **not** authorize merge, release, Cloudflare Pages production publication, domain changes, or paid infrastructure. Ask separately for those effects.
- Keep project decisions brief and current; no Task State framework or donor-repository runtime dependency.
