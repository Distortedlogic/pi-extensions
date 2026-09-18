# Goal

Repair pi-compress task-batch range selection so it compresses settled task work with normal user messages and complete tool-call groups, preserves session and task replay state, rejects only unsafe range boundaries, and updates pi-tasks to the validated pi-compress commit without unrelated protocol or feature work.

## Work units

- [ ] Reproduce and classify the failing session shape
  - [ ] Extract the minimal raw entry sequence around assistant entry `92bb1e5d`, including its tool-call IDs, matching results, intervening entries, task result, and selected range boundaries.
  - [ ] Add a failing regression to the existing pi-compress compression suite that uses the same entry sequence and a normal task user message with no special prefix.
  - [ ] Determine from the fixture whether the failure is an early range end, context-free metadata interrupting raw adjacency, or a genuinely missing, duplicate, or mismatched result.
- [ ] Correct task-batch start and end selection
  - [ ] Keep the existing task run-start or prior compression entry as the batch anchor and select the first normal task user message after that anchor.
  - [ ] Ensure task continuation waits until the completed `task` tool result is durable and uses that result as the settled range end.
  - [ ] Return an exact diagnostic and make no session change when the task message or settled result is unavailable.
- [ ] Correct tool-call grouping and range-boundary validation
  - [ ] Match assistant tool calls to results by tool-call ID using the model-visible message sequence instead of raw session-entry adjacency.
  - [ ] Ignore only context-free metadata while matching a group, and map each complete group back to its original session-entry span.
  - [ ] Allow complete atomic tool-call groups fully inside a compression range while rejecting a start or end that splits a group.
  - [ ] Keep genuinely malformed groups protected and report their missing, duplicate, or mismatched IDs without disabling the safety check.
- [ ] Preserve rewrite state and failure atomicity
  - [ ] Preserve required custom task state in original order when context-free entries occur inside the rewritten span.
  - [ ] Keep model changes, thinking-level changes, labels, session metadata, and other non-replayable structural entries outside the range or reject the range before navigation.
  - [ ] Revalidate the session ID, source leaf, selected entry IDs, continuation IDs, and source hash immediately before applying the rewrite.
  - [ ] Verify that successful rewrites keep the old branch recoverable and that rejected rewrites append no entries and do not move the active leaf.
- [ ] Add focused regression and task-lifecycle coverage
  - [ ] Replace the plain-assistant batch fixture with a normal task prompt, assistant tool call, matching tool result, and completed task result.
  - [ ] Cover context-free metadata between a call and result, a complete interior group, an edge that splits a group, and one genuinely malformed group.
  - [ ] Add an existing-suite pi-tasks integration case that completes multiple work units, crosses the compression threshold, compresses once, restores task state, and feeds the next work unit exactly once.
  - [ ] Assert that no task message contains or requires a synthetic text prefix.
- [ ] Validate and distribute the repair in dependency order
  - [ ] Run pi-compress typecheck, lint, existing tests, Knip validation, clean full install, clean production-only install, and credential-free production entry load.
  - [ ] Commit and push the validated pi-compress change before changing any dependent Git pin.
  - [ ] Pin pi-tasks to the exact pushed pi-compress commit, regenerate its lockfile normally, and run its existing checks and task-compression integration coverage.
  - [ ] Commit and push pi-tasks, update both installed remote packages, reload Pi, and confirm a fresh threshold-crossing task run advances without a compression command error.
