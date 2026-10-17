---
name: implementation-review
description: Independently review and re-review exact current Portfolio PR base/head, code and actual evidence; return actionable or clean verdict read-only.
---

# Implementation Review — Portfolio

This callable adapter is the sole Review Skill. The [Review contract](../../../.codex/project-collaboration/contracts/implementation-review.md) owns verdict semantics; [Collaboration](../../../docs/collaboration.md) owns stage authority. Do not edit files, post reviews/comments, approve, merge, deploy or alter external state on review-only authority.

## Resolve target

Read the current Portfolio `AGENTS.md`, `README.md`, applicable accepted decisions and the user's requested outcome. Fetch the actual current PR base/head SHAs, changed files and diff before drawing conclusions. Do not assume a formal plan or persisted Task Baseline exists for a direct request. Distinguish passing executed checks from missing runtime/browser evidence.

## Evaluate



Evaluate the complete delivery directly across the canonical contract's six dimensions: Baseline
conformance, execution-authority conformance, real workflow behavior, risk and authority,
implementation quality, and artifact/test consistency. A concrete code defect found here is an
Implementation Review finding. Keep code quality and governing-contract conformance independent.
Use available GitHub PR and diff inspection; no separate Code Review owner is needed. Use relevant specialist guidance only when it
materially changes judgment. For agent tooling, consult [the adopted tooling principles](../../../.codex/project-collaboration/principles/agent-tooling-design-principles.md). Verify consequential external facts with current authoritative evidence when needed.

Classify delivery changes as blocking, must fix, or should fix under the canonical contract;
optional improvements remain non-actionable. Each actionable finding states exact evidence and
location, impact, relevant authority, and the complete required end state. Passing checks prove
only their covered boundary. Return one verdict for the exact target, with proportional provisional
or withheld conclusions where evidence is unavailable.

For remediation re-review, inspect the new exact target against every prior actionable finding,
its required end state, the applicable authority lineage, and material new regression or drift.
Do not treat disappearance of the original symptom as completion by itself.

## Result and re-review

Provide one verdict for the exact base/head. Each actionable finding names severity, exact location/evidence, impact and complete required end state; separate provisional conclusions and optional improvements. When re-reviewing, fetch the **new** exact target, verify prior required end states and check regressions or scope drift. A clean review needs no invented fix handoff. Fixing remains separately authorized.
