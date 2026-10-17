# Portfolio — Agent Entry Point

This is a public, lightweight portfolio for practical web-development demos. The exact repository is `pengcc/portfolio`.

## Start here

- Read this file and the current `README.md` before changing the project.
- For ChatGPT Project work, use `.codex/chatgpt/project-instructions.md` as the project-specific bootstrap.
- Follow `docs/collaboration.md` for proportionate task alignment, delivery, and review.
- Consult `.codex/project-memory/decisions.md` only for decisions relevant to the task.
- Verify current source and PR base/head before making repository-specific claims.

## Boundaries

- Prefer the smallest testable change; do not add complex agent frameworks, monorepo scaffolding, or unused infrastructure.
- This repository is **public**. Never commit credentials, customer data, unpublished project details, private-repository contents, or personal information not approved for publication.
- The initial site is a static React/TypeScript shell, **not** an approved final visual design. Avoid default-blue boilerplate or unrequested design expansion.
- Demos are separate work items. Planned entries are not live or verified implementations.
- Do not add servers, databases, paid services, telemetry, or VPS dependencies without an explicit decision.
- Never mutate global tooling or deployment environments for routine project work.

## Change and publication discipline

- Work on a feature branch and propose a focused PR; never push directly to `main`.
- Validate with `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` when dependencies are available. If not run, state that explicitly.
- An independent review examines the **exact current** PR base/head and meaningful behavior, risks, and regressions. Review alone does not authorize modifications or merge.
- PR creation does **not** authorize merge, release, Cloudflare Pages production publication, domain changes, or paid infrastructure. Ask separately for those effects.
- Keep project decisions brief and current; no Task State framework or donor-repository runtime dependency.

## Optional Codex review skill pilot

For an explicitly requested independent PR implementation review or same-PR re-review, Codex may use `.agents/skills/portfolio-implementation-review/SKILL.md` when it is discoverable in that session. `docs/collaboration.md` remains the single collaboration owner; other tasks do not require a Skill. The presence of a Skill file does not prove that an actual Codex session discovered or invoked it.
