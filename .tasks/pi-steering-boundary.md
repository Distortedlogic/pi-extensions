# Goal

Implement the smallest reliable `pi-steering` lifecycle change so every delivered user message, including a work item fed by `pi-tasks`, starts a fresh tool-call interval, a terminating task-completion tool cannot enqueue stale steering before that message, and every tenth non-terminating tool completion in the same active run still sends the existing hidden steering message without coupling the two extensions or adding custom orchestration.

## Work units

- [ ] Establish the native event contract for the targeted change
  - [ ] Confirm that Pi's public `tool_execution_end` event exposes the `terminate` flag returned by extension tools.
  - [ ] Specify the counter transitions for session start, delivered user messages, normal tool completion, terminating tool completion, and interval completion.
  - [ ] Stop and report the missing public API if the termination flag is unavailable instead of adding task-specific events, queue timing logic, or tool-name checks.

- [ ] Implement the minimal counter lifecycle in `pi-steering/src/index.ts`
  - [ ] Reset the counter on `session_start` so state cannot cross session boundaries.
  - [ ] Keep the reset for each `message_start` event whose message role is `user`, including messages sent by `pi-tasks` through `sendUserMessage`.
  - [ ] Increment the counter on each `tool_execution_end`, then clear it and return without steering when that tool result has `terminate: true`.
  - [ ] Send the existing hidden `pi-steering` message only when a non-terminating completion reaches ten calls, then reset the counter for the next interval.
  - [ ] Preserve the existing interval, steering text, custom message type, and `deliverAs: "steer"` behavior.

- [ ] Validate the required event sequences and package health
  - [ ] Confirm that nine normal completions followed by one normal completion send exactly one steering message.
  - [ ] Confirm that nine normal completions followed by a terminating `pi-tasks` completion send no steering message and leave the next work item at zero calls.
  - [ ] Confirm that a delivered user message after any partial interval resets the count and that ten later non-terminating completions send one steering message.
  - [ ] Use public Pi APIs and deterministic local inputs for targeted validation without provider calls, and do not add a new test suite where none exists.
  - [ ] Run `npm run typecheck`, `npm run lint`, and `npm test` in `pi-steering`, then complete a clean production install and extension-load check without provider credentials.

- [ ] Complete the scoped extension delivery
  - [ ] Review the final diff and confirm that it changes only the required `pi-steering` implementation and any existing validation files that need updates.
  - [ ] Commit the implementation with a minimal accurate message after all checks pass.
  - [ ] Push the `pi-steering` commit to its remote repository and run `pi update` as the final delivery actions.
