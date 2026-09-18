# Goal

Repair pi-compress task-batch rewriting so settled work with normal task messages and complete assistant tool-call groups compresses safely, required task state remains replayable, unsafe boundaries make no session change, and pi-tasks uses the validated repair without any synthetic task-message prefix.

## Work units

- [ ] Add the failing task-compression shape to the existing pi-compress suite
  - [ ] Recreate the entry sequence around assistant entry `92bb1e5d` with its tool calls, matching results, intervening context-free entries, normal task message, and completed task result.
  - [ ] Replace the plain-assistant batch fixture with this realistic tool-call sequence and assert the intended batch start, end, and source entries.
  - [ ] Assert that rejected preparation leaves the active leaf and session entries unchanged.
- [ ] Fix atomic tool-call grouping and rewrite boundaries
  - [ ] Match assistant tool calls to results by ID across the model-visible message sequence instead of requiring adjacent raw session entries.
  - [ ] Map each matched group back to one raw entry span, preserve crossed custom state entries in order, and reject non-replayable structural entries before navigation.
  - [ ] Allow complete groups inside the selected range and reject only a start or end that splits a group or contains unmatched IDs.
  - [ ] Revalidate the session, source leaf, selected spans, continuation, and source hash immediately before applying the rewrite.
- [ ] Make task-batch compression complete through continuation
  - [ ] Use the existing run-start or prior compression entry as the anchor, the first normal task user message as the task boundary, and the durable completed `task` result as the range end.
  - [ ] Preserve the previous branch, reconstructed summary, continuation content, compression marker, and task replay state after a successful rewrite.
  - [ ] Add an existing-suite pi-tasks case that completes multiple work units, crosses the threshold, compresses once, and feeds the next work unit exactly once.
  - [ ] Assert that task content contains and requires no synthetic text prefix.
- [ ] Validate and apply the repair in dependency order
  - [ ] Run the existing pi-compress typecheck, lint, tests, and Knip validation, including the new boundary regressions.
  - [ ] Commit and push pi-compress before pinning pi-tasks to the exact validated commit and regenerating its lockfile.
  - [ ] Run the existing pi-tasks checks and task-compression coverage, then commit and push the dependency update.
  - [ ] Update both installed packages, reload Pi, and verify one threshold-crossing task run compresses and advances without a command error.
