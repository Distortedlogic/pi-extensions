# Goal

Make every available Pi extension test suite minimal and focused on critical behavior owned by that extension by removing or combining duplicated, excessive, implementation-specific tests and tests that primarily cover Pi, Node.js, external tools, or third-party packages; prefer public functions, public Pi APIs, deterministic fixtures, and small integration tests; keep real Pi end-to-end tests only where a process boundary is necessary; remove test helpers, fixtures, scripts, and dependencies that become unused; add only missing critical extension-specific coverage; and pass all required validation for every changed extension.

## Work units

- [ ] Add the missing `pi-modes` shortcut-cycle coverage
  - [ ] Extend `pi-modes/test/modes.test.ts` to capture and invoke the registered mode-cycle shortcut.
  - [ ] Verify that the shortcut advances through configured modes, replaces the prior mode suffix, and updates the mode widget.

- [ ] Complete the `pi-prompts` editor-cycle coverage
  - [ ] Extend the existing editor test to cycle from the first prompt to the second prompt and then remove the selected prompt segment after the final choice.
  - [ ] Verify that text before and after the selected segment remains unchanged through the complete cycle.

- [ ] Add `pi-tasks` finalization-failure coverage
  - [ ] Extend the existing finalization test with a `git add` failure case and a `git commit` failure case.
  - [ ] Verify that each failure is reported, no empty task state is committed, and no additional work unit is fed.

- [ ] Validate and publish the changed extensions
  - [ ] Run type checking, linting, and the complete retained test suite in `pi-modes`, `pi-prompts`, and `pi-tasks`.
  - [ ] Run clean full-install, production-install, and production extension-load checks without provider credentials.
  - [ ] Commit and push each changed repository, then run `pi update` for those extensions.
