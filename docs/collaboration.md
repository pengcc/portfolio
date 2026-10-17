# Lightweight Collaboration and Review

This file owns Portfolio's collaboration contract. [AGENTS.md](../AGENTS.md), [README.md](../README.md), and the [ChatGPT Project instruction source](../.codex/chatgpt/project-instructions.md) route here. Use current repository sources and canonical task artifacts; Portfolio has no runtime dependency on another project's workflow.

## Choose the stage proportionately

For a small, clear task, a direct implementation request supplies execution authority: record brief intent, scope, and acceptance criteria in the PR and proceed to implementation and PR review. A styling typo needs no separate baseline, plan, or handoff artifact merely because agents are involved.

For larger, cross-stage, or consequential work, use the stages needed:

- **Task alignment / brief:** establish the accepted need, expected outcome, scope, non-goals, constraints, risks, and success boundary. A GitHub Issue can hold this brief. Historical implementation is evidence, not a new requirement.
- **Implementation Planning (optional):** turn the accepted brief into executable work, checks, and boundaries. A sufficiently specified Issue is an adequate plan; do not create a second `plan.md` for ceremony.
- **Independent Plan Review (optional):** examine complex, cross-stage, or consequential choices before execution; produce an evidence-based verdict and actionable findings, if any.
- **Implementation:** execute within the current approved scope and deliver a focused, review-ready PR with actual validation evidence.
- **Independent Implementation Review / re-review:** inspect the exact current PR base/head and accepted authority; report findings or a clean verdict without editing or merging.
- **Closeout:** report the achieved outcome, remaining limits, review state, and any separately authorized next action.

When work passes to another actor, label its current stage and expected output. A stage is complete only when its actual artifact, evidence, and necessary handoff exist; saying “done” is insufficient. Reuse accepted work instead of restarting earlier stages. A short in-chat handoff is enough when it contains the information the recipient needs; no status registry, mandatory templates, scripts, skills, or extra roles are required.

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

A genuine ChatGPT ↔ Codex or review handoff names:

- Goal, current stage, and expected output.
- Governing canonical Issue/plan; exact reviewed content/version and review outcome plus user approval evidence, or the direct implementation instruction, as applicable.
- Exact repository, ref/commit or PR base/head, target files, and execution environment.
- Completed work and available evidence, with unverified claims clearly identified.
- Allowed and forbidden effects, required checks, success and STOP conditions, and any required human input.
- Next recipient and action.

Reference current canonical sources instead of duplicating their contents. For a multi-stage demo, “Implement Issue #N” alone is insufficient: identify the stage, target, known synthetic fixture, validation boundaries, and approval. Recheck freshness at receipt; do not infer missing authority from a previous actor's confidence.

## Local files and human-visible interactions

Selecting or working within the local repository root is ordinary project work; it does not require per-file permission ceremony. A demo application's browser file-input control is a distinct test interaction. Prefer embedded or checked-in synthetic examples and automated tests within the repository; never ask the human to find unspecified personal JSON/CSV files.

Before triggering a planned or newly discovered human-visible file/folder picker, or asking for human action during execution, explain which task/test needs it and why, the exact expected synthetic fixture or directory and how it was prepared, the operator action, and the expected outcome. If an unforeseen prompt appears, pause and explain before selecting anything or requesting a file. These rules apply throughout execution, even when the original handoff did not anticipate the interaction.

Before accessing data outside the project root or requesting new machine permissions, explicitly identify the path, purpose, and risk and obtain any required user approval. Do not assume permission from a test's need for data. If browser automation cannot complete a native picker, report that interaction **not tested**; if useful, offer a concrete optional manual test using a known synthetic fixture, with its path, preparation, steps, and expected result. Missing fixtures or test capability are blockers or validation limits, never passing evidence.

## Delivery and independent implementation review

Keep one independent PR per bounded task on a narrowly scoped feature branch. List changed behavior, non-goals, meaningful trade-offs, and actual validation evidence. Tests should protect user-visible behavior or credible regressions. Run applicable repository checks from [AGENTS.md](../AGENTS.md); state commands and outcomes, including checks not run and why. Green CI proves only its executed checks, not browser or manual UX.

Independent review reads the exact current PR base and head and their diff, checking the accepted scope and authority. Judge intended outcome separately from code quality, functional behavior, public-data safety, tests, and deployment boundaries. Mark findings actionable only when evidence warrants a change; include evidence, impact, and required end state. Say which relevant evidence is unavailable: absence of a run is not a pass. Review is read-only; do not silently fix or merge.

Fixes require separately authorized remediation in the same delivery PR, followed by re-review against the original findings and regressions at the new exact base/head. A clean verdict needs no invented remediation handoff; state the review result and the next authorized action or pending decision.

Independent branches may proceed in parallel while preserving true dependencies. Coordinate edits to shared canonical files such as the demo catalog rather than concurrently overwriting them; independently owned feature files need no global serialization. Before any authorized merge, refresh the base/head and check whether base changes require integration fixes, fresh CI, or re-review.

## Closeout and external effects

PR-ready means implementation and its evidence are ready for independent review, not that the task is fully complete. Closeout checks the accepted success boundary, actual verification, resolved findings, and remaining limits; if acceptance requires merge or publication, the task remains pending until those effects are separately authorized and verified. Report the exact PR/commit and next recipient/action. Do not claim unexecuted tests, review, merge, or deployment.

Authority for local implementation, commit/push/PR, merge, hosting previews, production publication, external services or data changes, and user-machine modifications is distinct. An implementation request may authorize a feature branch and reviewable PR under [project instructions](../.codex/chatgpt/project-instructions.md); it does not authorize merge or deployment. Paid infrastructure, account configuration, domains, secrets, and machine-level changes need their own explicit authority. Explain the effect, risk, and validation/rollback path before seeking any required approval.

Keep this contract public-safe and repository-owned: do not copy private project material, credentials, customer data, or unapproved personal information. Collaboration changes should remain small and reversible; revert a documentation-only PR if its conventions create friction, without changing runtime data or deployment state.
