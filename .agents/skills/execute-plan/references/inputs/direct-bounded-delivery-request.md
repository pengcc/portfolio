# Direct Bounded Delivery Request

Read this reference only when the current user request directly authorizes a bounded repository
mutation through either:

- an explicit request for lightweight delivery; or
- an already concrete, directly executable tiny task whose outcome and boundary are clear without
  requiring the user to repeat the `lightweight` label.

This is one execution-input adapter for the existing `execute-plan` implementation owner. It is
not a workflow, task class, planning artifact, approval mechanism, or generated per-task record.

## Direct execution contract

Treat the current request, together with verified current repository evidence and any applicable
accepted task brief or decisions, as the bounded execution contract. The request
itself supplies mutation authority for its stated result; do not translate it into a plan,
execution-contract artifact, mini-plan, or duplicate approval.

Do not create task state, a Task Workspace, or a new formal plan solely for this input.
When an accepted task brief or decision already governs the exact task,
consume it without reconstructing, amending, or requiring an active persisted plan. Issue and Task
Workspace presence are tracking or persistence facts, not execution-mode selectors.

Inspect enough current repository evidence to determine the exact in-scope files, the smallest
sufficient implementation, proportionate rollback, reviewability, and validation at the affected
boundary. Exact-file discovery inside the stated behavior or artifact boundary is not scope drift.
Keep the pre-execution update compact and do not expose an eligibility checklist.

Use strict execution by default. A bounded clarification that resolves one missing detail without
changing the task boundary, authority, risk, architecture, dependencies, or validation strategy may
resume the same direct request without planning or renewed execution approval.

A directly executable bounded implementation request uses the repository's normal implementation
delivery outcome: after verifying freshness, implementing and checking the scoped change, create one review-ready PR if authorized by the user's implementation request, unless they explicitly require no push/PR. Missing local capability is reported as not run, while any executed failing required check blocks a green delivery claim. This does not grant merge or deployment authority.

## STOP boundary

Stop when evidence shows that completion needs a new user-owned decision, material scope or
authority expansion, changed architecture or dependencies, a different validation strategy, or a
separately owned consequential effect not already included in the recognized implementation
delivery contract and authorized through its existing owner. Report the concrete discovered
boundary and let the user choose broader direct authority or the planned path. Do not create a plan,
closeout workflow, or other lifecycle artifact automatically after stopping.

When the current actor cannot run a locally useful check, distinguish a true pre-PR evidence
requirement from recommended validation. For a user-selected ChatGPT direct delivery, missing local
capability alone does not make a recommended check a review-readiness blocker: report it truthfully
as not run, recommend local validation when useful, and never represent the missing result as a
pass. Withhold review-ready completion when the user or governing contract explicitly requires that
evidence before PR delivery, when a relevant check actually ran and failed without resolution, or
when publication safety, exact-target authority, or implementation completeness remains blocked.
Use the existing supported capable handoff or STOP boundary for genuinely required unavailable
evidence; do not manufacture planning or task state merely to compensate for capability absence.

Later integration is required only by concrete combined-tree evidence under the execution Skill.

The direct path does not weaken secret safety, branch and execution-start freshness checks,
reviewability, publication, review, merge, release, deployment, destructive-action, global-tooling,
or other external-effect boundaries.
