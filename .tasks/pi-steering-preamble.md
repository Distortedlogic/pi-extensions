# Goal

Implement a deterministic Pi steering acknowledgement that records the exact required preamble once after every completed user message, displays it like an assistant acknowledgement without an extra model turn, excludes it from effective model context, preserves the existing ten-tool-call steering behavior, and keeps context-management behavior, package metadata, project instructions, validation, and installed extensions consistent.

## Work units

- [ ] Prepare the `pi-steering` package dependencies for native custom-message rendering.
  - [ ] Add `@earendil-works/pi-ai` and `@earendil-works/pi-tui` to `pi-steering/package.json` as Pi-provided peer dependencies with compatible ranges.
  - [ ] Resolve the latest compatible development versions, pin them exactly in `devDependencies`, and update the existing lock file when the repository uses one.
- [ ] Implement the persistent user-message acknowledgement in `pi-steering/src/index.ts`.
  - [ ] Define exported constants for the stable `pi-steering/preamble` custom type and the exact required preamble text.
  - [ ] Keep the existing user-message tool-counter reset and append one visible custom message only after each completed user message.
  - [ ] Send the acknowledgement with `triggerTurn: false` and without `deliverAs` so it cannot start or steer a model turn.
  - [ ] Register a native custom-message renderer that shows the stored message content as a plain assistant-style acknowledgement.
  - [ ] Filter only `pi-steering/preamble` custom messages from model context while retaining them in durable session history.
  - [ ] Preserve the existing hidden steering message and its delivery after each ten completed tool calls.
- [ ] Align `pi-compress` with the new presentation-only session entry.
  - [ ] Exclude `pi-steering/preamble` custom messages from the effective context snapshot while retaining them in the complete entry and branch snapshots.
  - [ ] Update the existing `pi-compress` tests to prove that turn grouping, range rewriting, and context-consumer totals ignore the presentation-only acknowledgement.
  - [ ] Verify that crop and compression rewrites do not leave an acknowledgement orphaned on the rebuilt active branch.
- [ ] Remove model-owned preamble generation from the project instructions.
  - [ ] Delete the `AGENTS.md` instruction that requires the model to repeat the exact preamble after every user message.
  - [ ] Retain the substantive instruction-following rules so the extension owns only deterministic acknowledgement output, not behavioral policy.
- [ ] Validate the complete behavior with targeted package and integration checks.
  - [ ] Run type checking and linting for `pi-steering`, then confirm that the package loads without provider credentials.
  - [ ] Run the existing `pi-compress` type checks, lint checks, and tests after the effective-context change.
  - [ ] Verify through a local Pi or RPC session that each new user message produces exactly one durable acknowledgement in the correct order and no additional model turn.
  - [ ] Verify that reload, branch navigation, assistant messages, tool results, and custom messages do not create duplicate acknowledgements.
  - [ ] Verify that ten completed tool calls still produce one hidden steering delivery and that a new user message resets its counter.
  - [ ] Complete clean full-install, production-install, and production extension-load checks for each changed extension.
- [ ] Deliver the validated extension changes through the repository workflow.
  - [ ] Commit each changed repository with a minimal accurate message after all checks pass.
  - [ ] Push the changed extension repositories to their remotes before installation.
  - [ ] Run `pi update` for the changed extensions and confirm that the installed copies load successfully.
