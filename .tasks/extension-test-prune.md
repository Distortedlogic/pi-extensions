# Goal

Bring every Pi extension test suite down to the minimal set that protects the behavior each extension owns: repair the broken pi-sync test script, consolidate duplicated test harnesses, move pi-preload folding coverage from RPC end-to-end tests into the unit suite, simplify tests that primarily exercise Pi or third-party packages, prune unused helpers and dependencies, close the identified coverage gaps in pi-tasks and pi-steering, and finish with full verification and publication of every changed repository.

## Work units

- [ ] Repair the pi-sync test script and fixtures
  - [ ] Remove the missing test/migration.test.ts entry from test:unit in pi-sync/package.json
  - [ ] Replace the duplicated BITWARDEN_MANIFEST fixture in pi-sync/test/git.test.ts with an import of DEFAULT_BITWARDEN_MANIFEST from src/config.ts
  - [ ] Resolve the orphan pi-sync/src/setup.ts module: confirm it is unused, then remove it or wire it into the first-sync flow with a targeted validation test
  - [ ] Run npm run check in pi-sync

- [ ] Consolidate the pi-compress test harness
  - [ ] Create pi-compress/test/helpers.ts with the shared usage, MemorySession, assistantResponse, model fixtures, extensionContext, and mutationApi
  - [ ] Update pi-compress/test/compression.test.ts to import the shared harness and delete its local copies
  - [ ] Update pi-compress/test/extension.test.ts to import the shared harness and delete its local copies
  - [ ] Run npm run check in pi-compress

- [ ] Move pi-preload folding coverage into the unit suite
  - [ ] Add per-language folding cases to pi-preload/test/unit.test.ts: declaration kept, implementation string absent, brace strings and comments preserved, source file unchanged
  - [ ] Add the unsupported-language rejection case and a signature-mode combined-limit case to pi-preload/test/unit.test.ts
  - [ ] Delete the moved RPC tests and the duplicate full-mode-precedence RPC test from pi-preload/test/e2e.test.ts, keeping the trusted-reload and untrusted tests
  - [ ] Remove the unused preloadedFile helper, extensionErrors listener, and 120-second timeouts from pi-preload/test/e2e.test.ts
  - [ ] Run npm run check in pi-preload

- [ ] Simplify the pi-modes precedence test
  - [ ] Rewrite the source-precedence test to call loadConfiguredModes over an ordered list of AGENTS.yml files
  - [ ] Delete the SettingsManager and package fixtures from that test
  - [ ] Run npm run check in pi-modes

- [ ] Trim the pi-prompts integration assertions
  - [ ] Remove the repeated cycling-label assertions from pi-prompts/test/integration.test.ts and keep the trust, precedence, and chain follow-up assertions
  - [ ] Run npm run check in pi-prompts

- [ ] Prune pi-tasks helpers and close compression coverage gaps
  - [ ] Verify and remove the unused getWorkUnits, renderTodoStateMarkdown, and materializeTodoState exports from pi-tasks/test/helpers.ts
  - [ ] Move the shared snapshot and snapshotEntry fixtures into pi-tasks/test/helpers.ts and update replay.test.ts and todo.invalidation.test.ts
  - [ ] Add tests for pi-tasks/src/compression.ts: the 400k threshold skip and the anchor-selection errors
  - [ ] Add the feedNext compression-cancelled path test to pi-tasks/test/todo.command.test.ts
  - [ ] Run npm run check in pi-tasks

- [ ] Resolve the pi-steering test coverage decision
  - [ ] Present the decision to the user: approve one minimal cadence and reset test file, or remove the dead test script from the check script
  - [ ] Implement the approved outcome in pi-steering
  - [ ] Run npm run check in pi-steering

- [ ] Remove verified unused devDependencies
  - [ ] Confirm unused packages with knip in pi-tree, pi-sync, and pi-tasks
  - [ ] Remove confirmed unused packages: pi-tree (typebox, minimatch, @earendil-works/pi-ai), pi-sync (yaml), pi-tasks (minimatch, yaml)
  - [ ] Run npm run check in each repository whose package.json changed

- [ ] Verify and publish every changed repository
  - [ ] Run a clean full install and a clean production install in each changed repository
  - [ ] Run the production extension-load check without provider credentials in each changed repository
  - [ ] Push each changed repository and run pi update for the changed extensions
