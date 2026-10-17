---
name: portfolio-implementation-review
description: Independently review the exact current base/head and diff of a Portfolio pull request, or re-review fixes on that same PR. Use when a user requests a PR Implementation Review; never modify or merge.
---

# Portfolio Implementation Review

Use only for an explicit request to review one concrete Portfolio PR or to re-review its remediation. Do not invoke for normal implementation, a planning review, or ordinary conversation. This skill belongs to `pengcc/portfolio`; `docs/collaboration.md` owns its collaboration semantics.

## Resolve the review target

1. Read the target's current `AGENTS.md`, `README.md`, `docs/collaboration.md`, and only the relevant accepted decision in `.codex/project-memory/decisions.md`.
2. Verify the repository and exact open or closed PR number, fetch its **current base and head SHAs**, changed-file list and actual diff. Do not infer the reviewed revision from a title, branch name or historical note.
3. Use the user's stated outcome/constraints and the PR's actual related Issue or accepted plan, if present, as distinct authority. Do not invent a Task Baseline, Plan Review, approval or Task State to fill a missing input. If scope authority is incomplete, mark only that conclusion provisional and still report source-evidenced defects.

## Review the actual delivery

Check only what matters to the changed scope: intended outcome and exclusions, behavior/error paths, public-repository data safety, implementation quality, regression risk, test coverage and real validation evidence. For UI changes, examine user-visible flows and accessibility when the actual evidence supports it; code inspection alone does not prove a browser or screen-reader run. Distinguish green checks from unrun, pending or failed checks.

Classify each actionable finding by severity, exact file/location, concrete evidence, impact and the full required end state. Keep pre-existing unrelated issues separate. A clean result has no actionable issues; unresolved essential evidence makes the affected conclusion **provisional**, not clean.

For re-review, re-fetch the new exact PR base/head, check every previous actionable required end state and inspect changed content for regressions or scope drift. A changed head invalidates an earlier clean result for that version.

## Return the result

State the exact repository, PR number, base/head SHAs, review verdict, only material findings or evidence gaps, and the minimum next action. No boilerplate plan or mandatory review-report file. Reviewing does **not** authorize changing files, applying fixes, posting PR comments, approving/requesting changes on GitHub, merging, deploying or changing account settings. Same-PR remediation requires a separate authorized instruction; merging and deployment remain separately authorized.
