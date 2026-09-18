# Goal

Make pi-compress reliably compress completed pi-tasks batches that contain normal task prompts and assistant tool calls, preserve hidden custom state crossed by the rewrite, reject only ranges that split or contain an unmatched tool-call group, and update pi-tasks to the validated pi-compress commit without adding a synthetic task-message prefix or redesigning public protocols.

## Work units

- [ ] Correct tool-call grouping and range selection in pi-compress
  - [ ] Build a private projection of the active context that associates each model-visible message with its original session-entry position.
  - [ ] Group each assistant tool-call message with its following tool results by tool-call ID, including parallel calls, without treating context-free custom entries as model messages.
  - [ ] Map each complete group back to one raw session-entry span so range starts and ends always fall outside the group.
  - [ ] Protect only groups with missing, duplicate, or mismatched result IDs, and include those IDs in the preparation error.
- [ ] Preserve state and atomicity during range rewriting
  - [ ] Collect `custom` entries inside the selected raw span and append their original `customType` and data to the replacement branch in the same order.
  - [ ] Reject the rewrite before navigation when the selected span crosses model changes, thinking-level changes, labels, session metadata, compaction entries, or branch summaries that cannot be replayed unchanged.
  - [ ] Revalidate the session ID, source leaf, selected entry IDs, continuation entry IDs, and source hash immediately before navigation.
  - [ ] Keep the old branch recoverable and ensure every failed preparation or revalidation leaves the active leaf and session entries unchanged.
- [ ] Complete the normal pi-tasks compression path
  - [ ] Use the existing run-start or previous compression entry as the batch anchor, the first normal task user message after it as the task message, and the persisted completed `task` result as the range end.
  - [ ] Replace the plain-assistant batch fixture with a normal task prompt, an assistant tool call, its matching result, one crossed custom state entry, and the completed task result.
  - [ ] Cover successful compression of a complete interior group, rejection of a split boundary, rejection of unmatched IDs, and unchanged session state after rejection.
  - [ ] Add an existing-suite pi-tasks case that completes multiple work units, crosses the threshold, compresses once, restores task state, and feeds the next work unit exactly once without any task-message prefix.
- [ ] Validate and apply the repair in dependency order
  - [ ] Run the existing pi-compress typecheck, lint, test, and Knip commands.
  - [ ] Commit and push pi-compress before changing the dependent package.
  - [ ] Pin pi-tasks to the exact pushed pi-compress commit, regenerate its lockfile, and run its existing checks and task-compression coverage.
  - [ ] Commit and push pi-tasks, update both installed packages, reload Pi, and verify one threshold-crossing task run compresses and advances without an extension command error.
