# Implementation Review Contract

## Purpose and boundary

Use this contract for complete implementation review and remediation re-review. Review evaluates
the actual current delivery against the authority that governed it and reports actionable end
states. Review does not mutate the implementation or authorize fixes, approval, merge, release,
or deployment. Publishing the review result is a distinct, bounded effect governed below.

Apply the depth proportionately. Do not add an independent review merely to manufacture lifecycle
state when an adequate review already covers the required boundary.

## Review inputs

Keep current accepted outcome and constraints (or applicable task brief/decisions), optional approved execution plan if one actually exists, exact current PR base/head and diff, and actual validation evidence distinct. A direct bounded user implementation request is valid authority without a fabricated baseline, persisted state, or formal plan. If an input is unavailable, mark only the affected conclusion provisional and still report source-evidenced defects. A changed base/head requires a fresh review.
## Evaluation

Evaluate only what is material to the delivery:

1. **Outcome conformance** — the result solves the real need, delivers the expected outcome, and
   stays within scope, non-goals, key boundaries, value/risk, and success limits.
2. **Execution-authority conformance** — authorized work and later approved remediation were
   implemented without silent substitution, omission, or scope expansion.
3. **Real workflow behavior** — relevant inputs, outputs, handoffs, failure propagation, and
   actor-visible outcomes work at the accepted boundary.
4. **Risk and authority** — destructive, sensitive, external, and irreversible effects retain
   proportionate safeguards and separate authority.
5. **Implementation quality** — ownership, naming, consistency, maintainability, duplication, and
   abstraction support the accepted result.
6. **Artifact and test consistency** — tests and related artifacts express the intended contract
   and cover meaningful regression or failure risk where applicable.

Passing executed checks proves only what those checks cover. Review still judges direction,
structure, proportionality, and semantic correctness. Conversely, ordinary implementation review
does not re-audit execution logs, publication state, or operational evidence unless that separate
assessment is explicitly selected.

Outcome conformance and execution-contract conformance are independent conclusions. Following a plan does not excuse a result that contradicts the accepted outcome, and a static contradiction in the
exact target is actionable without requiring a more costly runtime reproduction. When material
evidence needed for one conclusion is unavailable and the current target does not yet justify an
actionable change, mark only that conclusion provisional or withheld, identify the missing evidence
and what could establish it, and continue every conclusion that the available evidence supports.
Unavailable evidence is not proof of conformance and cannot produce a clean verdict for the
affected boundary.

Do not expand findings into unrelated redesign or block the target for a pre-existing issue unless
the change worsens it, depends on it, or the requested scope includes it.

## Findings and verdict

Classify findings that require a delivery change as actionable:

- **blocking** — safe or correct continuation is not possible;
- **must fix** — required before the reviewed delivery can be considered ready;
- **should fix** — material quality or risk issue that should be corrected in this delivery.

An **optional improvement** is non-actionable: it may be reported separately when useful, but it is
not required for the accepted end state. Optional improvements do not make a review actionable or
prevent a clean verdict, and must not by themselves trigger publication, a result identifier, or a
remediation handoff.

Each finding identifies evidence, impact, governing authority when relevant, and the complete
required end state. Prescribe exact mechanics only when implementation freedom is not material or
an exact-modification contract was separately selected.

The verdict covers the exact reviewed target. It is not approval or authority for a later effect.

## Actionable and clean output paths

Return one coordinated verdict for the exact repository/PR and full base/head SHAs. Include
severity, exact location/evidence, impact, required end state, actual validation and material
limits. Keep actionable findings separate from provisional conclusions and optional improvements.

Actionable findings must be accessible to a subsequent Codex implementer and independent reviewer
without the user copying them between chats. When chat is not accessible to those recipients,
publish the complete result as a comment on the reviewed PR under explicit user authority for that
publication. An instruction to deliver findings on that PR supplies this bounded authority; a
review-only request does not. If authority is missing, prepare the complete public-safe result and
request permission to post it. If posting or readback fails, retain the result in chat and report
durable delivery as incomplete; do not substitute a local-only file or claim a successful handoff.

The PR result must stand alone: include the governing task/authority references, exact reviewed
base/head, every actionable finding and required end state, and validation limits. Read back the
posted result to verify content and target; return its stable URL/identifier in chat. Reuse an
adequate result for the same revision rather than duplicating it. Preserve prior revision evidence
when publishing a later result, and identify which prior result it supersedes.

Include directly usable next-agent instructions in the PR result and return them in chat with
the result link:
the implementer must verify current source and separate remediation authority before making bounded
same-PR corrections; the independent reviewer must re-review the new exact base/head against all
prior findings and check regressions. A link alone is not an instruction. Publication authority
covers only the review result, never remediation, approval, PR state changes, merge or deployment.

A clean result stays in chat and needs no result identifier, publication or remediation handoff
unless separately requested. Optional improvements alone do not trigger the actionable path.
Missing evidence is provisional, not a clean result.

## Remediation re-review

Re-review the new exact target against each prior actionable finding and the relevant authority
lineage. Confirm the required end state rather than only the disappearance of the original symptom,
and check that remediation introduced no material regression or scope drift.

If findings remain, report the actionable findings for the new exact target. If none remain, use
the clean path. A still-valid final pre-delivery review may be consumed by later closeout; repeat
broad semantic review only when the target, authority, or evidence changed.
