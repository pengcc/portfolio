# Upload browser regression checks

Run `pnpm dev` from the repository checkout, then open
`http://localhost:5173/src/demos/shopify-csv/browser-tests/index.html`.
The page displays PASS or FAIL above the actual demo. Reload to repeat.

This dependency-free harness mounts the real React page and uses browser
`File`/`DataTransfer` APIs to exercise its change handlers. It verifies:

- Local file → synthetic example clears the native input value and FileList.
- Selecting the same File again replaces sample results with local results.
- An oversized file is rejected before its `arrayBuffer` method is called,
  clears stale results/busy state, and permits a subsequent valid selection.

The oversized File has a synthetic size property; no large allocation is needed.
This does not automate the OS file-picker dialog or its same-selection event
suppression. Checking that the real native input is empty after switching is the
regression assertion for that behavior. This browser harness is run separately
from `pnpm test`; it is not part of CI and is not emitted by `pnpm build`.
`upload.test.ts` covers size rejection, the exact byte boundary, and UTF-8 failures
in the normal unit test run.
