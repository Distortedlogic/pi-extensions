# Goal

Implement separate, narrowly scoped Pi tools for completing the current subtask and completing the current work item, keep parent and child completion state consistent through explicit transitions, expose the tools only during the existing task execution window, preserve existing task feeding and continuation behavior, and retain compatibility with stored results from the former generic task tool.

## Work units

- [ ] Define explicit subtask and work-item state transitions
  - [ ] Replace the action-bearing task tool schema with an exact empty parameter schema for fixed-operation tools.
  - [ ] Add separate `complete_subtask` and `complete_work_item` reducer actions and specific operation outcomes.
  - [ ] Make subtask completion update only the current subtask while the parent work item remains `in_progress`.
  - [ ] Make work-item completion require every direct subtask to be complete before it marks the parent complete.
  - [ ] Permit the intermediate state where all subtasks are complete and the parent work item is still `in_progress`.
  - [ ] Keep replay compatible with stored tool results whose tool name is `task`.
- [ ] Replace the generic completion tool with two scoped tools
  - [ ] Remove the registered `task` tool and register parameterless `complete_subtask` and `complete_work_item` tools with operation-specific descriptions and guidance.
  - [ ] Add one transient execution-window gate that selects at most one completion tool from the current task state and preserves all unrelated active tools.
  - [ ] Claim and close the execution window synchronously at the start of each completion call so duplicate calls cannot advance another subtask or work item.
  - [ ] Open the execution window immediately before the existing subtask task prompt without changing that prompt flow or adding another feed function.
  - [ ] Close the execution window on session restoration, tree navigation, task stop, final completion, and an agent settlement that did not use the expected completion tool.
- [ ] Connect both tools to the existing continuation flow
  - [ ] Keep the existing continuation behavior after a non-final subtask completion.
  - [ ] After the last subtask completion, leave the work item incomplete, expose only `complete_work_item`, return the transition through the tool result, and do not queue the continuation yet.
  - [ ] After explicit work-item completion, select the next existing task state and queue the existing continuation command.
  - [ ] Accept results from both new tool names and the legacy `task` name when validating and replaying continuations.
  - [ ] Preserve the existing task detail schema, compression integration, task-list file format, and persisted session protocol.
- [ ] Align the existing task instruction and test coverage
  - [ ] Change the existing subtask instruction to name `complete_subtask` without adding a work-item feed prompt.
  - [ ] Update existing command, invalidation, reducer, task-list file, replay, sanitization, and test-helper cases for the two tool names and explicit parent transition.
  - [ ] Verify that neither completion tool is active outside the existing task execution window and that only the state-appropriate tool is active inside it.
  - [ ] Verify that the last subtask call does not complete the parent or queue continuation, and that the work-item call cannot succeed while a subtask is pending.
  - [ ] Verify that old `task` results still replay and that duplicate completion calls cannot advance task state twice.
  - [ ] Run the repository typecheck, lint, unit tests, end-to-end tests, clean install checks, and production extension-load check required by the repository.
