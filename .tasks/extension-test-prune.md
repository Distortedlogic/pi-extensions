# Goal

Bring every Pi extension test suite down to the minimal set that protects the behavior each extension owns: repair the broken pi-sync test script and its duplicated fixture, consolidate the duplicated pi-compress test harness, move pi-preload folding coverage from RPC end-to-end tests into the unit suite, simplify the pi-modes, pi-prompts, and pi-tree tests that primarily exercise Pi or third-party packages, prune unused pi-tasks test helpers and close its compression coverage gaps, remove unused devDependencies, and finish with full verification and publication of every changed repository.

## Work units

- [ ] Repair the pi-sync test script and fixtures
  - [ ] Remove the missing test/migration.test.ts entry from test:unit in pi-sync/package.json
  - [ ] Replace the duplicated BITWARDEN_MANIFEST fixture in pi-sync/test/git.test.ts with an import of DEFAULT_BITWARDEN_MANIFEST from src/config.ts
  - [ ] Run npm run check in pi-sync

- [ ] Consolidate the pi-compress test harness
  - [ ] Create pi-compress/test/helpers.ts with the shared usage, MemorySession, assistantResponse, model fixtures, extensionContext, and mutationApi
  - [ ] Update pi-compress/test/compression.test.ts and pi-compress/test/extension.test.ts to import the shared harness and delete their local copies
  - [ ] Run npm run check in pi-compress

- [ ] Move pi-preload folding coverage into the unit suite
  - [ ] Add folding coverage to pi-preload/test/unit.test.ts: per-language declaration, body-absence, and brace-preservation checks, the unsupported-language rejection, and a signature-mode combined-limit case
  - [ ] Delete the moved and duplicate RPC tests from pi-preload/test/e2e.test.ts with their fixtures (preloadedFile, extensionErrors listener, 120-second timeouts), keeping the trusted-reload and untrusted tests
  - [ ] Run npm run check in pi-preload

- [ ] Simplify the pi-modes precedence test
  - [ ] Rewrite the source-precedence test to call loadConfiguredModes over an ordered list of AGENTS.yml files, deleting the SettingsManager and package fixtures
  - [ ] Run npm run check in pi-modes

- [ ] Trim the pi-prompts integration assertions
  - [ ] Remove the repeated cycling-label assertions from pi-prompts/test/integration.test.ts and keep the trust, precedence, and chain follow-up assertions
  - [ ] Run npm run check in pi-prompts

- [ ] Prune pi-tasks helpers and close compression coverage gaps
  - [ ] Remove the unused getWorkUnits, renderTodoStateMarkdown, and materializeTodoState exports from pi-tasks/test/helpers.ts
  - [ ] Move the shared snapshot and snapshotEntry fixtures into pi-tasks/test/helpers.ts and update replay.test.ts and todo.invalidation.test.ts
  - [ ] Add tests for pi-tasks/src/compression.ts: the 400k threshold skip and the anchor-selection errors
  - [ ] Add the feedNext compression-cancelled path test to pi-tasks/test/todo.command.test.ts
  - [ ] Run npm run check in pi-tasks

- [ ] Trim the pi-tree shared-selection assertions
  - [ ] Remove the resolveFileSelection mode assertions from pi-tree/test/unit.test.ts and keep only the leaf-equality assertion
  - [ ] Run npm run check in pi-tree

- [ ] Remove unused devDependencies
  - [ ] Run npm run check in each repository whose package.json changed

- [ ] Verify and publish every changed repository
  - [ ] Run a clean full install and a clean production install in each changed repository
  - [ ] Push each changed repository and run pi update for the changed extensions
