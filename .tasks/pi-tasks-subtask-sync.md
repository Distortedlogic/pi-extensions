# Goal

Update pi-tasks so an active `/tasks run` assigns and completes one subtask at a time, writes each subtask completion to the source Markdown file, completes a work unit only after all of its subtasks are complete, and exposes the `task` completion tool only while a pi-tasks subtask is active, with precise instructions that prevent use in unrelated conversations.

## Work units

- [ ] Implement subtask progression in `pi-tasks/src/todo-state.ts`
  - [ ] Define the current subtask as the first pending subtask in the current in-progress work unit without adding a new subtask status.
  - [ ] Update the next operation to return the current work unit and its current subtask, including partially completed work units loaded from Markdown.
  - [ ] Update the complete operation to complete only the current subtask, keep the work unit in progress while pending subtasks remain, and complete the work unit after its last subtask.
  - [ ] Update operation result types so callers can distinguish current-subtask, completed-subtask, completed-work-unit, all-complete, and invalid-current-state outcomes.
- [ ] Update task feeding and agent instructions for one current subtask
  - [ ] Replace the work-unit feed path in `pi-tasks/src/index.ts` with a subtask feed path that includes the goal, current work unit, current subtask, and sibling subtask status.
  - [ ] Tell the agent to work only on the supplied current subtask and to call `task` once with `{"action":"complete"}` only after that subtask and its required checks are complete.
  - [ ] Update the `execute-task` prompt in `pi-tasks/AGENTS.yml` to prohibit use of the completion tool for ordinary user requests or work outside an active `/tasks run`.
  - [ ] Update the `task` label, description, action description, prompt snippet, and prompt guideline with the same run-specific wording while preserving the existing tool name and action.
- [ ] Persist and continue each subtask completion in `pi-tasks/src/index.ts`
  - [ ] Validate that a live run and current subtask exist before the tool changes state or writes the task-list file.
  - [ ] Write the one-subtask state change with `dumpTaskList()` before publishing the new in-memory state or continuation details.
  - [ ] Keep the parent work-unit checkbox unchecked until the last subtask and check the parent in the same write that completes the last subtask.
  - [ ] Continue with the next pending subtask in the same work unit, or select the next work unit after the current work unit completes.
  - [ ] Keep the existing final task-list removal and Git commit behavior restricted to the state where all work units and subtasks are complete.
  - [ ] Add sequential tool execution and a per-run completion guard so duplicate tool calls cannot complete more than one supplied subtask.
- [ ] Limit the completion tool to an active pi-tasks subtask
  - [ ] Add a small active-tool helper that adds or removes `task` with `pi.getActiveTools()` and `pi.setActiveTools()` without changing tools owned by other extensions.
  - [ ] Keep `task` inactive after ordinary session startup, after `/tasks stop`, after final completion, and whenever restored state has no valid active run and current subtask.
  - [ ] Activate `task` immediately before feeding a current subtask and deactivate it while that completion is settling.
  - [ ] Restore the correct tool state during `session_start` and `session_tree`, including a stopped run that can later resume at its first pending subtask.
  - [ ] Ensure a rejected, duplicate, or failed completion does not advance task state or leave the tool in an incorrect active state.
- [ ] Align the task widget with subtask execution
  - [ ] Update `pi-tasks/src/task-widget.ts` to show the first pending subtask in the current work unit with the active indicator.
  - [ ] Keep completed subtasks and later pending subtasks visually distinct without changing the widget width or line limits.
  - [ ] Preserve the existing work-unit progress and all-complete display.
- [ ] Update the existing pi-tasks tests for subtask-level behavior
  - [ ] Cover first-pending-subtask selection, one-subtask completion, partial work-unit state, final-subtask parent completion, next-work-unit selection, and pre-completed subtask skipping.
  - [ ] Verify that each valid completion updates the Markdown subtask checkbox and source revision, while a source conflict or write failure does not advance state.
  - [ ] Verify that duplicate completion calls cannot advance twice and that stop and resume continue at the correct pending subtask.
  - [ ] Verify that `task` is inactive outside a run, active only for a supplied subtask, and inactive again while settling, after stop, and after final completion.
  - [ ] Verify that session replay, tree navigation, continuation handling, and the existing pi-compress integration continue to work without a protocol change.
- [ ] Validate and deliver the pi-tasks update
  - [ ] Run the existing typecheck, Biome, unit, and end-to-end checks for pi-tasks.
  - [ ] Verify a clean full install, a clean production install, and a production extension load without provider credentials.
  - [ ] Confirm that no pi-compress protocol, dependency, package manifest, README, or new test-suite change was added without a demonstrated need.
  - [ ] Commit and push the pi-tasks changes, then run `pi update` for the installed extension.
