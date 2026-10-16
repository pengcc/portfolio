# Lightweight Collaboration and Review

This file is Portfolio's own small collaboration contract. Its general principles are informed by experience with another project, but Portfolio has no runtime dependency on that project.

## Task alignment (proportionate)

For a small, unambiguous change, record intent, boundaries, and acceptance criteria in the PR. For a bigger or cross-stage change, first establish a concise outcome-oriented brief: the real need, expected result, scope and non-goals, risk, and success boundary. Historical implementation is evidence, not a new requirement.

## Delivery

Use the exact current repository sources. Keep a narrowly scoped branch and PR, list changed behavior, non-goals, meaningful trade-offs, and actual validation evidence. Avoid adding task-state tooling, extra roles, rituals, or automation without an identified need. Tests should protect actual user-visible behavior or credible regressions.

## Independent implementation review

Read the exact PR base and head and inspect their diff. Judge scope and intended outcome separately from code quality, functional behavior, public-data safety, tests, and deployment boundaries. Mark an issue actionable only when the evidence warrants a change. Say which relevant evidence is unavailable; absence of a run is not a pass. Re-review changes against the original findings and look for regressions. Do not silently fix or merge in a review-only pass.

## External effects

Creating a reviewable PR is separate from merging it. Merge is separate from hosting previews and production deployment. Paid infrastructure, account configuration, domains, secrets, and changes to external data require their own authority.
