# Portfolio Collaboration Contract

This file is the only Portfolio Collaboration owner. Implementation is owned by the execution Skill; independent Review verdicts are owned by the separate Review contract. [AGENTS.md](../AGENTS.md), [README.md](../README.md), and the [ChatGPT Project instruction source](../.codex/chatgpt/project-instructions.md) route here. Use current repository sources and canonical task artifacts; Portfolio has no runtime dependency on another project's workflow.

## Choose the stage proportionately

For a small, clear task, a direct implementation request supplies execution authority: record brief intent, scope, and acceptance criteria in the PR and proceed to implementation and PR review. A styling typo needs no separate baseline, plan, or handoff artifact merely because agents are involved.

For larger, cross-stage, or consequential work, use the stages needed:

- **Task alignment / brief:** establish the accepted need, expected outcome, scope, non-goals, constraints, risks, and success boundary. A GitHub Issue can hold this brief. Historical implementation is evidence, not a new requirement.
- **Implementation Planning (optional):** turn the accepted brief into executable work, checks, and boundaries. A sufficiently specified Issue is an adequate plan; do not create a second `plan.md` for ceremony.
- **Independent Plan Review (optional):** examine complex, cross-stage, or consequential choices before execution; produce an evidence-based verdict and actionable findings, if any.
- **Implementation:** execute within the current approved scope and deliver a focused, review-ready PR with actual validation evidence.
- **Independent Implementation Review / re-review:** inspect the exact current PR base/head and accepted authority; report findings or a clean verdict without editing or merging.
- **Closeout:** report the achieved outcome, remaining limits, review state, and any separately authorized next action.

When work passes to another actor, label its current stage and expected output. A stage is complete only when its actual artifact, evidence, and necessary handoff exist; saying “done” is insufficient. Reuse accepted work instead of restarting earlier stages. A short in-chat handoff is enough when the recipient can access it and it contains the information they need; no status registry, mandatory templates, scripts, skills, or extra roles are required.

## Planning, review, and execution authority

An executable plan identifies:

- Accepted outcome and constraints, ownership, scope, and non-goals.
- Ordered work, true dependencies, and what can proceed in parallel.
- Acceptance criteria and validation of representative user-visible behavior and failure cases, including evidence that cannot yet be obtained.
- Material risks, rollback, STOP conditions, and the review boundary.

An independent Plan Review reads the exact proposed plan and current relevant source. Check alignment, completeness, proportionality, evidence, executability, public-data safety, and authority boundaries. State a verdict; findings need evidence, impact, and a required end state. Re-review the revised canonical plan against original findings and regressions.

A formal Plan Review establishes a verdict, not implementation authority. After a clean formal review, the user must explicitly approve the current reviewed plan for execution. A direct user implementation request for a sufficiently bounded small task can supply authority without formal planning or review. The receiving implementer checks that the canonical Issue/plan, reviewed content and outcome, and approval or direct instruction still govern the current source before acting.

If an approved plan materially changes in scope, solution, validation, acceptance, risks, or permissions, pause affected implementation, review the changed plan, and obtain renewed user approval. Nonmaterial clarification does not force another formal review or approval. STOP when work would exceed accepted boundaries, require unapproved private content or permissions, or introduce competing collaboration owners; report the smallest decision needed.

## Handoff between actors

For a genuine transfer, use [the adopted Project-Agent Handoff contract](../.codex/project-collaboration/contracts/project-agent-handoff.md). It covers goal, current authority, exact source, completed work, scope, validation/STOP and next recipient. No formal handoff is required for a small same-request continuation. Recheck the current target and avoid restating adequate upstream work.
## Local files and human-visible interactions

Selecting or working within the local repository root is ordinary project work; it does not require per-file permission ceremony. A demo application's browser file-input control is a distinct test interaction. Prefer embedded or checked-in synthetic examples and automated tests within the repository; never ask the human to find unspecified personal JSON/CSV files.

Before triggering a planned or newly discovered human-visible file/folder picker, or asking for human action during execution, explain which task/test needs it and why, the exact expected synthetic fixture or directory and how it was prepared, the operator action, and the expected outcome. If an unforeseen prompt appears, pause and explain before selecting anything or requesting a file. These rules apply throughout execution, even when the original handoff did not anticipate the interaction.

Before accessing data outside the project root or requesting new machine permissions, explicitly identify the path, purpose, and risk and obtain any required user approval. Do not assume permission from a test's need for data. If browser automation cannot complete a native picker, report that interaction **not tested**; if useful, offer a concrete optional manual test using a known synthetic fixture, with its path, preparation, steps, and expected result. Missing fixtures or test capability are blockers or validation limits, never passing evidence.

## Delivery and review routing

Keep one independent PR per bounded task on a narrowly scoped feature branch. List changed behavior, non-goals, meaningful trade-offs, and actual validation evidence. Tests should protect user-visible behavior or credible regressions. Run applicable repository checks from [AGENTS.md](../AGENTS.md); state commands and outcomes, including checks not run and why. Green CI proves only its executed checks, not browser or manual UX.

The [Implementation Review contract](../.codex/project-collaboration/contracts/implementation-review.md) owns independent review, actionable findings, clean/provisional verdicts and same-PR re-review. The [Review Skill](../.agents/skills/implementation-review/SKILL.md) is its callable adapter. Review alone does not authorize modification, merge or publication. When actionable findings need
to pass between Codex actors, use the Review contract’s target-owned durable PR result and directly
usable next-agent instructions; do not rely on the user retransmitting chat findings. Explicit
authority to publish that result is distinct from remediation, merge and deployment authority.
Receiving implementers and re-reviewers read the linked PR result and verify the current target;
findings supply evidence, not authority to fix. Clean reviews require no remediation handoff or
routine PR publication.

Independent branches may proceed in parallel while preserving true dependencies. Coordinate edits to shared canonical files such as the demo catalog rather than concurrently overwriting them; independently owned feature files need no global serialization. Before any authorized merge, refresh the base/head and check whether base changes require integration fixes, fresh CI, or re-review.

## Reused Task Alignment (adapted to Portfolio)

For small tasks, state intent, bounds and success directly in the PR. When important task-wide meaning survives stages, an accepted Issue or canonical note is the brief; no persisted Task State or separate Task Baseline file is implied. Adapt the donor's solution-independent structure when it adds value:

```md
# Optional Task Brief

## Intent
Who uses or depends on the result, in what real context, what need exists, and why it matters.

## Expected Outcome
The high-level result that should exist when the task is complete.

## Scope
What the current task covers.

## Non-goals
What is intentionally excluded.

## Key Boundaries
Material scale, sensitivity, authority, external effects, reversibility, recovery, and other
constraints that later stages must preserve.

## Value and Risk
Expected benefit and cost, the credible loss boundary, and the proportionate level of control.

## Success Boundary
The high-level evidence that the real need is met without unsupported scope or complexity.
```

Historical code and tests are evidence, not automatically requirements. Change accepted meaning only with user correction or verified contradictory evidence; otherwise downstream stages consume existing decisions rather than redefine them.

## Actor substitutability and adequate-work reuse

An actor may complete a project stage when it has the context, capability, and authority required by
that stage. Actor identity alone neither grants authority nor reserves a stage.

Reuse adequate completed work. Repeat a stage only when changed evidence, an invalidated authority,
a material missing lens, unresolved disagreement, or an explicit request gives the repetition a
distinct purpose. A handoff should let the next eligible actor consume the existing result rather
than redo it.

Repository-aware or environment-aware claims depend on inspected evidence, not on the actor's
label. Mark a conclusion provisional when required context was unavailable.

## Exact-source discipline

Before making an exact claim, review finding, or modification instruction, resolve enough identity
to distinguish the intended current source from historical or candidate material. Depending on the
source, this can include repository or collection, revision, path, target identifier, and current
content.

Classify supplied material as current authority, accepted subordinate authority, current evidence,
historical evidence, candidate content, or unresolved claim. Do not quote or modify text that is
absent from the verified current target, silently substitute an approximate anchor, or treat
history as a second current owner.

## Dependency-aware parallelism

Independent ready tasks may progress concurrently. Each actor uses that task's own baseline,
decisions, execution authority, target, and output boundary. Do not impose global waiting merely
because another task or actor is active.

Preserve real dependencies:

- a downstream stage waits for the upstream result it actually consumes;
- pause affected execution before changing a governing brief or plan; for material changes
  to an approved plan, apply this contract's plan re-review and renewed-approval rules above,
  then verify the corrected canonical plan before resuming;
- one mutable canonical target has one current writer or another explicit conflict-control
  arrangement; and
- freshness is rechecked when a shared target may have changed.

Parallelism does not require a scheduler, ready-work registry, or lock service.

## Closeout and external effects

PR-ready means implementation and its evidence are ready for independent review, not that the task is fully complete. Closeout checks the accepted success boundary, actual verification, resolved findings, and remaining limits; if acceptance requires merge or publication, the task remains pending until those effects are separately authorized and verified. Report the exact PR/commit and next recipient/action. Do not claim unexecuted tests, review, merge, or deployment.

Authority for local implementation, commit/push/PR, merge, hosting previews, production publication, external services or data changes, and user-machine modifications is distinct. An implementation request may authorize a feature branch and reviewable PR under [project instructions](../.codex/chatgpt/project-instructions.md); it does not authorize merge or deployment. Paid infrastructure, account configuration, domains, secrets, and machine-level changes need their own explicit authority. Explain the effect, risk, and validation/rollback path before seeking any required approval.

Keep this contract public-safe and repository-owned: do not copy private project material, credentials, customer data, or unapproved personal information. Collaboration changes should remain small and reversible; revert a documentation-only PR if its conventions create friction, without changing runtime data or deployment state.
