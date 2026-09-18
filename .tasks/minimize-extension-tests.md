# Goal

Make every available Pi extension test suite minimal and focused on critical behavior owned by that extension by removing or combining duplicated, excessive, implementation-specific tests and tests that primarily cover Pi, Node.js, external tools, or third-party packages; prefer public functions, public Pi APIs, deterministic fixtures, and small integration tests; keep real Pi end-to-end tests only where a process boundary is necessary; remove test helpers, fixtures, scripts, and dependencies that become unused; add only missing critical extension-specific coverage; and pass all required validation for every changed extension.

## Work units

- [ ] Make the authoring-template extension-load test deterministic
  - [ ] Update `template/test/e2e.test.ts` to invoke the installed `@earendil-works/pi-coding-agent` CLI with `process.execPath` instead of resolving `pi` from `PATH`.
  - [ ] Run the generated extension with `--no-session`, `--no-extensions`, offline mode, and an isolated temporary Pi agent directory, then remove that directory after the test.

- [ ] Add the missing `pi-modes` shortcut-cycle coverage
  - [ ] Extend `pi-modes/test/modes.test.ts` to capture and invoke the registered mode-cycle shortcut.
  - [ ] Verify that the shortcut advances through configured modes, replaces the prior mode suffix, and updates the mode widget.
  - [ ] Update the retained real Pi load case to use the installed coding-agent CLI, `--no-session`, offline mode, and an isolated temporary Pi agent directory.

- [ ] Complete the `pi-prompts` editor-cycle coverage
  - [ ] Extend the existing editor test to cycle from the first prompt to the second prompt and then remove the selected prompt segment after the final choice.
  - [ ] Verify that text before and after the selected segment remains unchanged through the complete cycle.

- [ ] Remove duplicated content assertions from preload and tree process-boundary tests
  - [ ] In `pi-preload/test/e2e.test.ts`, keep trusted reload deduplication, hidden-message state, and `PRELOAD.md` creation, but remove exact preload-block comparisons already covered by `unit.test.ts`.
  - [ ] In `pi-tree/test/e2e.test.ts`, keep trusted reload deduplication, hidden-message state, and `TREE.txt` creation, but remove exact tree-content comparisons already covered by `unit.test.ts`.

- [ ] Add `pi-tasks` finalization-failure coverage
  - [ ] Extend the existing finalization test with a `git add` failure case and a `git commit` failure case.
  - [ ] Verify that each failure is reported, no empty task state is committed, and no additional work unit is fed.
  - [ ] Update the retained real Pi load test to use the installed coding-agent CLI, `--no-session`, offline mode, and an isolated temporary Pi agent directory.

- [ ] Remove the duplicated Git-hook implementation assertion from `pi-sync`
  - [ ] Remove the `core.hooksPath` call-array assertion from the candidate-creation case in `pi-sync/test/git.test.ts`, leaving the dedicated malicious-hook integration case as the behavioral proof.

- [ ] Validate and publish the changed packages
  - [ ] Run the root schema check and verify the rendered authoring template with its retained extension-load test.
  - [ ] Run type checking, linting, and the complete retained test suite in `pi-modes`, `pi-preload`, `pi-prompts`, `pi-sync`, `pi-tasks`, and `pi-tree`.
  - [ ] Run clean full-install, production-install, and production extension-load checks without provider credentials.
  - [ ] Commit and push each changed repository, then run `pi update` for the changed extensions.
