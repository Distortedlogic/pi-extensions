# Goal

Update `pi-steering` so a user message, including a work item fed by `pi-tasks`, resets the tool-call count, a terminating task-completion tool sends no stale steering, and the existing steering message is sent after each ten completed tool calls only while the same agent run continues, without changing `pi-tasks` or adding cross-extension coordination.

## Work units

- [ ] Implement and verify the corrected `pi-steering` counter behavior
  - [ ] Update `pi-steering/src/index.ts` to reset the counter on `session_start` and on each `message_start` event whose message role is `user`.
  - [ ] Increment the counter on `tool_execution_end`; when `event.result.terminate` is `true`, reset the counter and return before sending steering.
  - [ ] When the count reaches ten and the run continues, reset the counter and send the existing message with its current text, custom type, hidden display, and `deliverAs: "steer"` setting.
  - [ ] Exercise the registered handlers with deterministic public Pi events to confirm that a tenth normal completion sends once, a terminating tenth completion sends nothing, and a user message resets a partial interval without adding a new test suite.
  - [ ] Run `npm run check` in `pi-steering`, complete clean full and production installs, and verify that the production extension loads without provider credentials.
