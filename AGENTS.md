# Portfolio — Agent Entry Point

This is a public, lightweight portfolio for practical web-development demos. The exact repository is `pengcc/portfolio`.

## Start here

- Read this file and the current `README.md` before changing the project.
- For ChatGPT Project work, use `.codex/chatgpt/project-instructions.md` as the project-specific bootstrap.
- Use `docs/collaboration.md` as the sole Collaboration owner; it integrates donor Task Alignment and Collaboration Guide material.
- For authorized bounded implementation, use `.agents/skills/execute-plan/SKILL.md` and its direct input reference.
- For independent exact-PR review/re-review, use `.agents/skills/implementation-review/SKILL.md`; verdict semantics belong to `.codex/project-collaboration/contracts/implementation-review.md`.
- For genuine actor handoff, use `.codex/project-collaboration/contracts/project-agent-handoff.md` conditionally.
- Consult `docs/design-judgment-principles.md` only for substantive design trade-offs, and `.codex/project-collaboration/principles/agent-tooling-design-principles.md` only for agent-tooling work.
- For coding, consult `.codex/rules/engineering-quality-principles.md` and `.codex/rules/task-and-change-safety-principles.md` proportionately.
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

## Owners and discovery

- **Collaboration:** `docs/collaboration.md`. **Execution:** `.agents/skills/execute-plan/SKILL.md`. **Review:** `.codex/project-collaboration/contracts/implementation-review.md` via `.agents/skills/implementation-review/SKILL.md`. Supporting principles and Handoff are not competing workflow owners.
- Repository-local Codex Skill entries live under `.agents/skills/<name>/SKILL.md`, with valid YAML frontmatter. Confirm runtime discovery/invocation in a fresh eligible Codex session; committed Skill files alone do not prove it.
- Only the direct C-type execution input is installed; do not invoke donor Task State, memory gates, approval-plan selector, publishing helpers or the unmerged `portfolio-implementation-review` pilot as another Review owner. PRs #11, #13 and #15 remain untouched and will need normal overlap reconciliation before separately authorized merge.

## Change and publication discipline

- Work on a feature branch and propose a focused PR; never push directly to `main`.
- Validate with `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` when dependencies are available. If not run, state that explicitly.
- An independent review examines the **exact current** PR base/head and meaningful behavior, risks, and regressions. Review alone does not authorize modifications or merge.
- PR creation does **not** authorize merge, release, Cloudflare Pages production publication, domain changes, or paid infrastructure. Ask separately for those effects.
- Keep project decisions brief and current; no Task State framework or donor-repository runtime dependency.
