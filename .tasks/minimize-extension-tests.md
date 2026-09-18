# Goal

Make only evidence-based changes to the available Pi extension tests: preserve the existing template and real Pi extension-load tests, add missing user-facing cycle and finalization-failure coverage to existing suites, remove confirmed unused test dependencies, and pass all required checks without reorganizing suites that already protect distinct extension-owned behavior.

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
  - [ ] Remove `minimatch` and `yaml` from `pi-tasks` development dependencies and update its lockfile.

- [ ] Remove unrelated machine-state setup from the `pi-sync` stale-publication test
  - [ ] Delete the `machineMarker` fixture setup and unchanged-file assertion from the stale-publication case in `pi-sync/test/git.test.ts`.
  - [ ] Assert the case through its `plan_expired` result, current shared commit, and preserved candidate reference.

- [ ] Validate and publish the changed extensions
  - [ ] Run type checking, linting, and the complete retained test suite in `pi-modes`, `pi-prompts`, `pi-sync`, and `pi-tasks`.
  - [ ] Run clean full-install, production-install, and production extension-load checks without provider credentials.
  - [ ] Commit and push each changed repository, then run `pi update` for those extensions.
