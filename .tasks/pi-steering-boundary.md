# Goal

Change `pi-steering` so each delivered user message, including a work item fed by `pi-tasks`, resets the tool-call interval, a terminating completion tool cannot enqueue stale steering before the next work item, and each tenth non-terminating tool completion still sends the existing hidden steering message through native Pi events without coupling the extensions.

## Work units

- [ ] Correct the steering counter lifecycle in `pi-steering/src/index.ts`
  - [ ] Reset the counter on `session_start` and on each `message_start` event whose message role is `user`.
  - [ ] Increment the counter on `tool_execution_end`, then clear it and return without steering when `event.result.terminate` is `true`.
  - [ ] Send the existing hidden `pi-steering` message when the non-terminating count reaches ten, then reset the counter for the next interval.
  - [ ] Preserve the existing interval, steering text, custom message type, and `deliverAs: "steer"` behavior.

- [ ] Validate the corrected behavior and package
  - [ ] Use deterministic public Pi event handling to confirm that the tenth normal completion sends one steering message, a terminating tenth completion sends none, and a delivered user message resets a partial interval.
  - [ ] Run `npm run typecheck`, `npm run lint`, and `npm test` in `pi-steering`.
  - [ ] Complete clean full and production installs, then verify that the production extension loads without provider credentials.
