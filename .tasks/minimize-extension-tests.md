# Goal

Make every available Pi extension test suite minimal and focused on critical behavior owned by that extension by removing or combining duplicated, excessive, implementation-specific tests and tests that primarily cover Pi, Node.js, external tools, or third-party packages; prefer public functions, public Pi APIs, deterministic fixtures, and small integration tests; keep real Pi end-to-end tests only where a process boundary is necessary; remove test helpers, fixtures, scripts, and dependencies that become unused; add only missing critical extension-specific coverage; and pass all required validation for every changed extension.

## Work units

- [x] Make the authoring-template extension-load test deterministic
  - [x] Update `template/test/e2e.test.ts` to invoke the installed `@earendil-works/pi-coding-agent` CLI with `process.execPath` instead of resolving `pi` from `PATH`.
  - [x] Run the generated extension with `--no-session`, `--no-extensions`, offline mode, and an isolated temporary Pi agent directory, then remove that directory after the test.

- [x] Add the missing `pi-modes` shortcut-cycle coverage
  - [x] Extend `pi-modes/test/modes.test.ts` to capture and invoke the registered mode-cycle shortcut.
  - [x] Verify that the shortcut advances through configured modes, replaces the prior mode suffix, and updates the mode widget.
  - [x] Update the retained real Pi load case to use the installed coding-agent CLI, `--no-session`, offline mode, and an isolated temporary Pi agent directory.

- [x] Complete the `pi-prompts` editor-cycle coverage
  - [x] Extend the existing editor test to cycle from the first prompt to the second prompt and then remove the selected prompt segment after the final choice.
  - [x] Verify that text before and after the selected segment remains unchanged through the complete cycle.

- [x] Remove duplicated content assertions from preload and tree process-boundary tests
  - [x] In `pi-preload/test/e2e.test.ts`, keep trusted reload deduplication, hidden-message state, and `PRELOAD.md` creation, but remove exact preload-block comparisons already covered by `unit.test.ts`.
  - [x] In `pi-tree/test/e2e.test.ts`, keep trusted reload deduplication, hidden-message state, and `TREE.txt` creation, but remove exact tree-content comparisons already covered by `unit.test.ts`.

- [x] Add `pi-tasks` finalization-failure coverage
  - [x] Extend the existing finalization test with a `git add` failure case and a `git commit` failure case.
  - [x] Verify that each failure is reported, no empty task state is committed, and no additional work unit is fed.
  - [x] Update the retained real Pi load test to use the installed coding-agent CLI, `--no-session`, offline mode, and an isolated temporary Pi agent directory.

- [x] Remove the duplicated Git-hook implementation assertion from `pi-sync`
  - [x] Remove the `core.hooksPath` call-array assertion from the candidate-creation case in `pi-sync/test/git.test.ts`, leaving the dedicated malicious-hook integration case as the behavioral proof.

- [ ] Validate and publish the changed packages
  - [ ] Run the root schema check and verify the rendered authoring template with its retained extension-load test.
  - [ ] Run type checking, linting, and the complete retained test suite in `pi-modes`, `pi-preload`, `pi-prompts`, `pi-sync`, `pi-tasks`, and `pi-tree`.
  - [ ] Run clean full-install, production-install, and production extension-load checks without provider credentials.
  - [ ] Commit and push each changed repository, then run `pi update` for the changed extensions.
