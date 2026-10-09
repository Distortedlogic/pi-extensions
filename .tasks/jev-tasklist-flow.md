# Goal

Replace the task-list prompt chain with a `/tasks create` flow that uses the full role-labeled active conversation, uses JEV to decide whether user clarification or focused agent review is necessary, validates task-list structure in code, repeats only selected review work, and loads the accepted task list without starting execution.

## Work units

- [ ] Add the JEV task-list decisions
  - [ ] Add `@typesafe-ai/sdk` as an exact pinned runtime dependency and update `package-lock.json`.
  - [ ] Build JEV state from the full active session projection while preserving message roles and order, treating user messages as requirements and assistant or tool messages as evidence.
  - [ ] Add a pre-creation `ask` or `skip` decision for whether the agent must ask the user to identify one concrete implementation result.
  - [ ] Add post-creation `ask` or `skip` decisions for goal conflict, missing required work, unsupported work, and concrete execution or dependency problems.
  - [ ] Make cancellation, missing credentials, timeout, and JEV errors stop the flow without a fallback review prompt.

- [ ] Add the session-local creation sequence
  - [ ] Track idle, clarification, drafting, and review phases together with the submitted filename, file revision, and selected review question identifiers.
  - [ ] Reset creation state on session start, branch changes, shutdown, successful loading, and explicit cancellation.
  - [ ] Resume the sequence after a user clarification without extracting or generating a separate request string.
  - [ ] Stop the sequence when an unchanged file revision produces the same selected review questions.

- [ ] Add `/tasks create`
  - [ ] Extend the `/tasks` command parser and command handler with a no-argument `create` action.
  - [ ] Capture the active conversation before sending any task-list instruction and reject a second concurrent creation sequence.
  - [ ] Run the pre-creation JEV decision and ask the agent for one concise user clarification only when JEV selects it.
  - [ ] When creation is ready, instruct the agent to write one `.tasks/<description>.md` file with the required hierarchy and call `submit_task_list` with only its filename.

- [ ] Add task-list submission and focused review
  - [ ] Register `submit_task_list` with a filename-only schema and load the submitted file through the existing task-list path validation.
  - [ ] Return `parseTaskList()` failures directly to the agent before making a JEV call.
  - [ ] Run the post-creation JEV decisions with the active conversation and exact submitted Markdown.
  - [ ] End the current turn and send one follow-up prompt containing only the JEV-selected review questions, requiring exact conversation and task-list citations before edits.
  - [ ] Let the reviewing agent ask the user when a selected issue requires a user decision, then resume review after the answer.
  - [ ] When JEV selects no review questions, load the final file into the existing task store, clear creation state, and leave the run idle.

- [ ] Remove the prompt-chain task-list builder
  - [ ] Delete `.prompts/create-tasklist.md`, `.prompts/review-tasklist.md`, and `.prompts/review-tasklist-goal.md`.
  - [ ] Remove the `tasklist-builder` chain from `AGENTS.yml` while preserving the task execution prompt.
  - [ ] Remove `.prompts` from the published package files and remove obsolete prompt-chain references without compatibility paths.

- [ ] Update the existing tests and validate the package
  - [ ] Add an injected fake JEV judge to the existing test infrastructure without real model calls.
  - [ ] Test pre-creation clarification, direct creation, parser failure, selected review, user clarification, unchanged revision handling, successful automatic loading, and JEV failure.
  - [ ] Test that JEV receives the complete role-labeled active conversation without a synthetic request extraction step.
  - [ ] Run type checking, linting, the existing test suite, clean full and production installs, and a production extension-load check.
