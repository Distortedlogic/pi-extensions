# Goal

Replace the task-list prompt chain with a `/tasks create` flow that uses the full role-labeled active conversation, has the agent write and submit one task list, validates its structure in code, uses JEV only after submission to decide which review questions the agent needs, repeats only selected review work, and stops without loading or running the finished list.

## Work units

- [ ] Add post-submission JEV question selection
  - [ ] Add `@typesafe-ai/sdk` as an exact pinned runtime dependency and update `package-lock.json`.
  - [ ] Build JEV state from the full role-labeled active conversation and exact submitted Markdown, treating user messages as requirements and assistant or tool messages as evidence.
  - [ ] Add independent `ask` or `skip` decisions for goal conflict, missing required work, unsupported work, and concrete execution or dependency problems.
  - [ ] Make missing credentials, cancellation, timeout, and JEV errors stop the sequence without a fallback review prompt.

- [ ] Add `/tasks create` with minimal in-flight context
  - [ ] Extend the `/tasks` command parser and handler with a no-argument `create` action.
  - [ ] Retain only the captured active conversation and the last submitted revision with its selected question identifiers while creation is active.
  - [ ] Send one instruction that tells the agent to write one `.tasks/<description>.md` file with the required hierarchy and call `submit_task_list` with only its filename.
  - [ ] Reject another `/tasks create` call while creation is active and clear the retained context when the session changes or the sequence ends.

- [ ] Add task-list submission and targeted review
  - [ ] Register `submit_task_list` with a filename-only schema and read the submitted file through the existing task-list path validation.
  - [ ] Return `parseTaskList()` failures directly to the agent before making a JEV call.
  - [ ] Run the JEV decisions with the retained conversation and exact submitted Markdown.
  - [ ] When JEV selects questions, end the current turn and send one follow-up containing only those questions, requiring exact conversation and task-list citations before edits.
  - [ ] Let the agent use the normal conversation to request user input when a selected question cannot be resolved from available evidence, then submit the edited list again.
  - [ ] When JEV selects no questions, clear the retained context, report the finished path, and leave loading and execution to the existing `/tasks load` and `/tasks run` commands.
  - [ ] Stop instead of sending another follow-up when an unchanged revision produces the same selected questions.

- [ ] Remove the prompt-chain task-list builder
  - [ ] Delete `.prompts/create-tasklist.md`, `.prompts/review-tasklist.md`, and `.prompts/review-tasklist-goal.md`.
  - [ ] Remove the `tasklist-builder` chain from `AGENTS.yml` while preserving the task execution prompt.
  - [ ] Remove `.prompts` from the published package files and remove obsolete prompt-chain references without compatibility paths.

- [ ] Update the existing tests and validate the package
  - [ ] Add an injected fake JEV judge to the existing test infrastructure without real model calls.
  - [ ] Test command startup, parser failure, selected review questions, no-question completion, unchanged submission handling, and JEV failure.
  - [ ] Test that JEV receives the complete role-labeled active conversation without a synthetic request and that completion does not load or run the list.
  - [ ] Run type checking, linting, the existing test suite, clean full and production installs, and a production extension-load check.
