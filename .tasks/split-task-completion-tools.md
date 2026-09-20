# Goal

Implement separate `complete_subtask` and `complete_work_item` tools in pi-tasks, keep work-item and subtask checkbox states synchronized for both completion paths, expose the tools only during the existing `/tasks run` execution window, and preserve the existing task feeding, continuation, compression, and persisted-state behavior.

## Work units

- [ ] Add synchronized subtask and work-item completion transitions
  - [ ] Replace the generic action parameter with exact empty parameters for the two fixed-operation tools.
  - [ ] Change the existing subtask completion action so it completes one current subtask and completes the parent work item when that was its last unchecked subtask.
  - [ ] Add a work-item completion action that completes the current work item and every unchecked direct subtask in that work item.
  - [ ] Keep the invariant that a completed work item has only completed subtasks and an incomplete work item has at least one incomplete subtask.
- [ ] Replace and scope the completion tools without changing task feeding
  - [ ] Replace the registered `task` tool with separate `complete_subtask` and `complete_work_item` tools that call the corresponding state transitions.
  - [ ] Reuse the existing task-list write, next-task selection, result details, compression boundary, and continuation path after either tool succeeds.
  - [ ] Activate both completion tools only while the existing `/tasks run` task execution is active, preserve unrelated active tools, and remove both completion tools at every existing stop or completion boundary.
  - [ ] Claim the completion window before either tool mutates state so one model response cannot complete task state twice.
  - [ ] Update continuation and replay filtering for both new tool names while retaining read compatibility for stored `task` results.
- [ ] Align existing instructions and tests with the two-tool contract
  - [ ] Change the existing execution instruction to name `complete_subtask` and `complete_work_item` without adding a feed, prompt, command, or continuation mode.
  - [ ] Update existing reducer and task-list file tests for one-subtask completion, final-subtask parent synchronization, and whole-work-item synchronization.
  - [ ] Update existing command, replay, invalidation, sanitization, and helper tests for the new tool names and shared continuation behavior.
  - [ ] Verify that both tools are absent outside `/tasks run`, available only inside its execution window, and unable to apply two completion mutations from one model response.
  - [ ] Run the existing pi-tasks typecheck, lint, unit tests, end-to-end tests, clean install checks, and production extension-load check.
