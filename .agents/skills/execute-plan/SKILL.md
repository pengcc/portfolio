---
name: execute-plan
description: Implement directly authorized bounded Portfolio changes on a fresh feature branch, run applicable checks and deliver one reviewable PR; never merge or deploy.
---

# Execute Plan — Portfolio

This is the sole callable Execution owner. It adapts the donor's `execute-plan` source. Read [Collaboration](../../../docs/collaboration.md), [AGENTS.md](../../../AGENTS.md), and applicable [quality](../../../.codex/rules/engineering-quality-principles.md) and [safety](../../../.codex/rules/task-and-change-safety-principles.md) guidance. A direct bounded task remains direct.

## Select input

Read [the direct bounded delivery adapter](references/inputs/direct-bounded-delivery-request.md). This C adoption intentionally has no approved-plan selector, Task State, memory gate, publication Skill or donor runtime dependency. Stop if consequential work needs an unapproved or materially changed plan; the Collaboration owner handles planning/authority.

## Implementation boundary

Keep implementation conformant to the complete governing authority.

Ordinary implementation judgment includes an ancillary correction needed to complete or validate
the already-authorized delivery when it preserves the governing task intent, accepted decisions,
solution direction, architecture, dependencies, ownership, validation and acceptance meaning,
destructive/data/security boundaries, external-effect authority, material risk, and rollback.
Discovering the natural exact file inside an approved behavioral or area boundary is not scope
drift. Neither rule authorizes unrelated cleanup.

Stop when completion requires a material change in scope, authority, architecture, dependency,
ownership, validation, acceptance, destructive/data/security boundary, risk, rollback, or another
user-owned decision. Approved contracts return to their planning or authority owner; direct bounded
requests return the concrete discovered boundary so the user can broaden direct authority or choose
planning. Use Collaboration for brief or plan correction; do not patch an upstream
governing contract during execution.

Apply the current material-uncertainty boundary when unresolved ambiguity materially blocks
execution. Clarification does not amend an approved contract or brief. A bounded clarification
may resume a direct request only when the direct-input reference permits it and no governing
boundary changed.

Concrete review findings are remediation evidence, not new implementation authority. Before
same-delivery remediation, re-read the exact PR/current head and finding, require current authority
for bounded correction of the same governing contract, and keep changed-head review semantics with
the review owner.

Same-delivery remediation remains bounded to a required end state that preserves the governing Task
brief, accepted decisions, and material approved solution boundaries. If correction requires
changing task-wide product meaning, such as the actor task, normal path, accepted requirement, or
page/flow responsibility, stop the affected remediation and return to Collaboration and its
brief-amendment boundary. If product meaning remains valid but correction requires a material
solution, architecture, dependency, or ownership change, return to Collaboration's optional
planning stage.
Ordinary implementation defects that preserve those upstream boundaries remain local under current
authority. Do not classify remediation by finding count, severity alone, or a new lifecycle state.

If an out-of-scope agent-made change can be safely isolated, remove that agent-made change before
continuing. Never reset, overwrite, clean, revert, or discard user or pre-existing changes without
explicit authority.

## Branch identity

A fresh implementation pass uses a separate normal implementation branch based on the freshly
verified remote default branch, normally current main. Never alter another PR branch or unrelated work.

Before a fresh pass changes implementation content:

1. resolve and verify the current remote default branch and exact commit;
2. create the implementation branch from that verified commit, or verify that a proposed fresh-pass
   branch already contains it; and
3. stop rather than repairing a stale or ambiguous proposed branch through automatic merge, rebase,
   reset, stash, history rewrite, force update, or push.

Before-merge remediation remains on the exact established delivery branch/worktree when current
authority covers that remediation. Dirty changes may continue only when they belong to that
authorized delivery. Ambiguous delivery identity, concurrent ownership, or uncertain dirty-change
ownership stops execution; do not substitute another clean or similarly named surface.

Execution-start freshness is not continuous synchronization. Later movement of the remote default
branch alone does not invalidate the pass, require integration, or require repeated validation.

## Checks and PR delivery

Run Portfolio's applicable `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm build` as available, and report real evidence, limitations, and any user-visible testing not executed. A repository-local skill file or green CI cannot prove an unperformed browser test. Preserve authorized local commits and open one review-ready PR when authorized; do not merge, release, deploy, mutate settings or create external effects without separate permission.

## Integration when evidence requires it

Do not integrate current main merely because it advanced after execution started.

Integration or correction is required only when current evidence establishes a concrete
combined-tree need, such as an actual conflict, a relevant base change invalidating a governing
assumption or implementation, failed required merge-candidate/task evidence, or another current
owner establishing that safe delivery cannot proceed without integration. Path overlap alone is not
such evidence.

Return that evidence to the same delivery under valid execution authority. Preserve the established
feature branch and history, resolve only bounded conflicts covered by that authority, and validate
the changed publishable tree under the current owner before committing it. Material governing
changes still return to their owner.

Do not continuously synchronize, auto-resolve semantic conflicts, rebase, reset, force-push, or
move integration into publication. Publication consumes required evidence; the merge authority retains its
live readiness, expected-head, and verified-effect boundary.

## Completion

Report exact changed scope, branch/commit/PR, actual checks and results, missing verification and next authorized action. Same-PR corrections require a separate instruction and a fresh [Review](../implementation-review/SKILL.md) at the exact new base/head. PR-ready is not merged or deployed.
