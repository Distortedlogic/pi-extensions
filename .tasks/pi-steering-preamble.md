# Goal

Replace the model-generated per-user preamble with one deterministic `pi-steering` session message that contains the exact required text, appears after each completed user message without starting or steering a model turn, stays out of effective model context, preserves ten-tool-call steering, remains compatible with `pi-compress`, and makes the old `AGENTS.md` output instruction unnecessary.

## Work units

- [ ] Implement the visible acknowledgement in `pi-steering`.
  - [ ] Add `@earendil-works/pi-tui` as a compatible peer dependency and pin its latest compatible development version for the native message renderer.
  - [ ] Export constants for the exact preamble text and the stable `pi-steering/preamble` custom type.
  - [ ] On each user `message_end`, append one visible custom message with `triggerTurn: false` and no `deliverAs` option.
  - [ ] Register a `Text` message renderer for `pi-steering/preamble` so the stored content appears as a plain acknowledgement.
  - [ ] Remove `pi-steering/preamble` messages from the `context` event message list while retaining them in session history.
  - [ ] Keep the current user-message counter reset and hidden steering delivery after every ten completed tool calls.
- [ ] Make `pi-compress` ignore the presentation-only acknowledgement.
  - [ ] Filter `pi-steering/preamble` entries from `snapshotSession().contextEntries` without removing them from complete entries or branch history.
  - [ ] Extend the existing `pi-compress` tests to cover turn grouping, range rewrites, and consumer totals with a stored preamble entry.
- [ ] Remove the obsolete model-output instruction.
  - [ ] Delete only the `AGENTS.md` rule that requires the model to repeat the preamble after each user message.
  - [ ] Keep the existing rules that require the agent to follow the user's instructions.
- [ ] Validate the changed extensions.
  - [ ] Run `npm run check` in `pi-steering` and `pi-compress`.
  - [ ] Confirm with Pi RPC and no provider credentials that one user message stores one visible `pi-steering/preamble` entry without an additional turn.
  - [ ] Complete clean full-install, production-install, and production extension-load checks for both changed extensions.
