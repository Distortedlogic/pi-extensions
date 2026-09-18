# Goal

Update pi-tasks so `/tasks run` advances one Markdown subtask at a time: the agent receives one current subtask, the `task` tool marks only that subtask complete, the parent work unit completes only after all child subtasks complete, and the tool and its instructions are unavailable outside an active task run.

## Work units

- [ ] Implement subtask progression in `pi-tasks/src/todo-state.ts`
  - [ ] Define the current subtask as the first pending subtask in the current in-progress work unit.
  - [ ] Update the next operation to resume that subtask or start the first pending subtask of the next pending work unit.
  - [ ] Update the complete operation to mark only the current subtask complete, keep its work unit in progress while another subtask is pending, and complete the work unit after its last subtask.
  - [ ] Return the current or completed subtask with each operation outcome so runtime code does not have to infer the transition.
- [ ] Apply subtask completion and Markdown synchronization in `pi-tasks/src/index.ts`
  - [ ] Replace work-unit feeding with a subtask feed that identifies the goal, current work unit, current subtask, and sibling subtask status.
  - [ ] Require a live task run and current subtask before `task` applies the complete action.
  - [ ] Call `dumpTaskList()` with the one-subtask state change before updating runtime state or continuation details, and leave state unchanged when the write fails.
  - [ ] Feed the next pending subtask after continuation handling, or use the existing finalization path after all work units complete.
  - [ ] Preserve completed subtask checkboxes when `/tasks stop` pauses a run and resume at the first pending subtask on the next `/tasks run`.
- [ ] Scope the `task` tool and its instructions to active task runs
  - [ ] Use `pi.getActiveTools()` and `pi.setActiveTools()` to keep `task` inactive without changing tools owned by other extensions.
  - [ ] Activate `task` before feeding a subtask, and deactivate it after `/tasks stop`, final completion, or restoration of a session branch with no active run.
  - [ ] Restore the correct active-tool state during `session_start` and `session_tree`.
  - [ ] Update the tool label, description, action description, prompt snippet, and prompt guideline to permit the complete action only for the current subtask supplied by `/tasks run`.
  - [ ] Update `pi-tasks/AGENTS.yml` with the same restriction and instruct the agent to call `task` once only after the supplied subtask and its required checks are complete.
- [ ] Update the existing pi-tasks tests and run required checks
  - [ ] Test current-subtask selection, one-subtask completion, partial work-unit state, last-subtask work-unit completion, next-work-unit selection, and pre-completed subtask skipping.
  - [ ] Test Markdown output and source revisions after each subtask, including no state advance after a source revision conflict.
  - [ ] Test tool activation during run, stop, completion, session start, and session tree restoration.
  - [ ] Test that continuation and existing range compression still preserve the subtask-level task state.
  - [ ] Run typecheck, Biome, the existing tests, clean full and production installs, and the production extension-load check without provider credentials.
