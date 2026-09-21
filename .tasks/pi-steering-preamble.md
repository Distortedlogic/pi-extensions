# Goal

Replace the model-generated per-user preamble with one deterministic visible `pi-steering` custom message that contains the exact required text, follows each completed user message without triggering another model turn, preserves the existing ten-tool-call steering behavior and `pi-compress` turn grouping, and makes the old `AGENTS.md` output instruction unnecessary.

## Work units

- [ ] Add the per-user preamble to `pi-steering/src/index.ts` with Pi's native extension API.
  - [ ] Export constants for the exact preamble text and the stable `pi-steering/preamble` custom type.
  - [ ] On each user `message_end`, reset the tool-call counter and send one visible `pi-steering/preamble` message with `triggerTurn: false`.
  - [ ] Keep the existing hidden `steer` delivery after every ten completed tool calls unchanged.
- [ ] Preserve whole-turn handling in `pi-compress`.
  - [ ] Treat a `pi-steering/preamble` custom message as part of the current answer in `pi-compress/src/crop.ts`.
  - [ ] Extend the existing `pi-compress` tests to prove that a user message, its preamble, and its assistant response remain one removable turn.
- [ ] Remove the obsolete model-output instruction.
  - [ ] Delete only the `AGENTS.md` rule that requires the model to repeat the preamble after each user message.
  - [ ] Keep the existing rules that require the agent to follow the user's instructions.
- [ ] Validate the two changed extensions.
  - [ ] Run `npm run check` in `pi-steering` and `pi-compress`.
  - [ ] Confirm through Pi RPC without provider credentials that one user message stores one visible preamble and does not trigger another turn.
  - [ ] Run clean production extension-load checks for `pi-steering` and `pi-compress`.
