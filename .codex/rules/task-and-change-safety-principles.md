# Task and Change Safety Principles

These are common judgment constraints for project tasks, changes, and reusable design decisions.

This rule is non-authorizing and non-ceremonial. It is not a workflow, approval mechanism, task
taxonomy, or output template. It does not replace Portfolio's AGENTS, Collaboration contract, or execution/review Skills.

Apply it proportionally. Small, clear tasks should remain direct.

## Proportionality and Scope

Use the smallest useful, safe, reviewable approach that satisfies the current goal and explicit
non-goals.

Avoid unrelated expansion. Mark later-phase possibilities as deferred instead of implementing
them early or treating them as part of the current task.

This principle does not replace workflow-specific clarification, planning, approval, objective
recheck, or scope-drift gates.

## Facts, Assumptions, Uncertainty, and Tradeoffs

Distinguish verified facts from assumptions, inference, uncertainty, and recommendations. Do not
present an assumption as evidence.

Clarify uncertainty when it could materially change direction, scope, safety, user intent, or acceptance criteria. State low-risk assumptions
when the applicable workflow allows them.

Explain material tradeoffs when multiple reasonable approaches affect maintenance, risk, or
reversibility. Do not require a decision framework for routine work with one clear path.

## Task alignment

Use [Portfolio Collaboration](../../docs/collaboration.md) for task-wide meaning, proportionate brief, decision and freshness rules. No persisted Task State or workspace is installed.
## Focused, Reviewable Changes

Keep changes cohesive. Avoid mixing unrelated refactors, features, formatting churn, and cleanup
in one change.

Prefer small, reversible updates that can be understood and validated in one review pass. Use
work-item decomposition when independent outcomes or safety boundaries make one pass difficult to
review.

## Validation and Evidence

Use the smallest meaningful validation that covers the affected behavior or content boundary.
Report failed or skipped validation and any remaining uncertainty.

Verify external or remote state through authoritative evidence. Manual confirmation expresses
intent but does not prove external state. Place confirmations at meaningful safety boundaries
rather than every mechanical step.

## Change Safety

Preserve mature files and prefer targeted edits unless full replacement is explicitly justified
and easier to verify.

Treat large deletions, major line-count drops, and replacement of mature content with stubs as
destructive-risk signals. Stop and review before continuing.

Choose the update method by review safety:

- isolated edits: direct patch;
- coordinated changes within one file: full-file replacement only when safer to review; and
- coordinated multi-file changes: a bounded bundle with complete diff review.

For rename or migration work, search before and after the change. Classify remaining references
as current, historical, or stale instead of assuming every match should change.

## Plausible Extension Check

Apply this check only when designing a reusable system or durable architecture, installer,
workflow, framework-like, ownership, taxonomy, or module boundary. It is not a checklist for every
small task.

Consider one or two credible adjacent uses. Preserve only cheap structural optionality when it
prevents foreseeable coupling, such as clear naming, static grouping or classification, separate
ownership axes, report-only boundaries, or separation of decisions from side effects.

Do not implement speculative profiles, plugin systems, package managers, dependency solvers,
migration engines, semantic merge, extension APIs, or other deferred capabilities without
demonstrated need. Plausibility may justify a cheap boundary; it does not justify future behavior.

When a proposed solution adds meaningful conditional complexity, follows repeated failed fixes,
or changes a high-risk workflow boundary, reassess the ownership model and smallest sufficient
alternative inside the active workflow. Route unresolved design decisions to their planning owner;
keep task-wide end-user meaning with Task Alignment and applicable accepted Task Decisions, and use
requirement clarification only when material user-owned meaning is unresolved. Keep clear routine
tasks direct.

## Authority Boundary

[AGENTS.md](../../AGENTS.md) and [Collaboration](../../docs/collaboration.md) own task, permissions, external-effects, project-root and publication boundaries. This non-authorizing rule does not authorize modification, merge, deployment, global-tooling changes or account actions.
