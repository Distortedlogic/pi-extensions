# Goal

Reduce and reorganize the Pi extension test suites so that each retained test protects critical behavior owned by its extension, unnecessary tests of Pi, Node.js, external tools, and third-party packages are removed, related cases use small deterministic fixtures and public Pi APIs, real Pi process tests remain only where a process boundary is necessary, unused test infrastructure is removed, and every changed package passes its required validation and production-load checks.

## Work units

- [ ] Establish the test baseline and protect unrelated work
  - [ ] Inspect the Git status and complete test inventory of every extension repository, including test files not present in the supplied context for `pi-compress` and `pi-steering`.
  - [ ] Record each current test script, test-only helper, fixture, import, and development dependency before changing files.
  - [ ] Run the current targeted checks and record pre-existing failures without changing or discarding unrelated working-tree changes.

- [ ] Remove the generic test suite from the extension authoring template
  - [ ] Delete `template/test/e2e.test.ts` and remove its `_skip_if_exists` entry from `copier.yml`.
  - [ ] Update `template/package.json.jinja` so a generated extension runs type checking and linting without claiming an empty behavior test suite.
  - [ ] Validate the rendered package metadata and run the root schema check.

- [ ] Reduce `pi-compress` and `pi-steering` tests to their owned contracts
  - [ ] Review the existing `pi-compress` tests and retain only range grouping, protected-entry handling, rewrite revalidation, append-only apply behavior, crop recovery data, branch merge records, and range-service state transitions.
  - [ ] Replace model calls in `pi-compress` tests with deterministic `modelRegistry.complete` fixtures and remove exact TUI layout, theme, and native Pi component assertions.
  - [ ] Review the existing `pi-steering` tests and retain one event-level case for calls 1 through 9, calls 10 and 20, non-tool events, and session reset behavior.
  - [ ] If either repository has no existing test suite, do not create one without approval; report the missing critical cases instead.
  - [ ] Run each changed package's type check, lint, and retained tests before work starts on dependent extensions.

- [ ] Simplify `pi-env` process and precedence tests
  - [ ] Keep the three focused cases in `pi-env/test/unit.test.ts` for precedence, project trust, process-value preservation, and cleanup.
  - [ ] Reduce `pi-env/test/e2e.test.ts` to the real Pi boundaries: child-process inheritance, process-value precedence, and key-only context without secret values.
  - [ ] Fold reload or shutdown cleanup into the existing end-to-end case if the extension lifecycle owns that behavior.
  - [ ] Run `pi-env` type checking, linting, unit tests, and the single end-to-end test.

- [ ] Simplify `pi-modes` and `pi-prompts` editor integration tests
  - [ ] Remove the generic production-load subprocess case from `pi-modes/test/modes.test.ts` and remove its now-unused subprocess imports and constants.
  - [ ] Keep schema, trust, source precedence, editor replacement, input transformation, reload, and cleanup coverage in `pi-modes`, and add the actual registered mode-cycle shortcut to that existing test file.
  - [ ] Keep prompt catalog validation, source trust, editor-segment replacement, and chain follow-up behavior in `pi-prompts`, while reducing repeated catalog-order assertions and extending the cycle case through removal or wrap behavior.
  - [ ] Rename the `pi-prompts` `test:e2e` script to `test:integration` because it does not start a real Pi process.
  - [ ] Run type checking, linting, and the revised tests in both repositories.

- [ ] Reduce `pi-preload` tests without weakening preload safety
  - [ ] Keep configuration merging, selection rules, canonical output, binary rejection, image ordering, context ordering, nested references, cycle rejection, byte limits, trust, and reload deduplication.
  - [ ] Reduce unsafe-name, context-failure, and Dioxus metadata matrices to representative cases that preserve each distinct rule.
  - [ ] Replace exact complete Dioxus document comparisons with checks for core content and selected capability fragments.
  - [ ] Add one deterministic existing-suite case that verifies an included symlink cannot preload content outside the project.
  - [ ] Keep both real Pi end-to-end cases for trusted reload behavior and untrusted project isolation.
  - [ ] Run `pi-preload` type checking, linting, unit tests, and end-to-end tests.

- [ ] Focus `pi-tree` tests on selection, bounds, trust, and reload behavior
  - [ ] Keep the normal filesystem fixture and large bounded-output fixture in `pi-tree/test/unit.test.ts`.
  - [ ] Remove assertions that depend on the external `tree` program's exact glyph layout while retaining ignore, generated-file, symlink, stable-root, and size-limit checks.
  - [ ] Keep the two real Pi end-to-end cases, but limit them to hidden-message deduplication, trust, and file creation boundaries already not covered by unit tests.
  - [ ] Run `pi-tree` type checking, linting, unit tests, and end-to-end tests with the system `tree` dependency available.

- [ ] Reorganize `pi-tasks` state, file, command, and widget tests after `pi-compress` is stable
  - [ ] Delete `pi-tasks/test/e2e.test.ts`, remove `test:e2e`, and keep production extension loading as a completion check instead of a permanent test.
  - [ ] Combine replay and reducer coverage into one state test while preserving transition tables, one-current-work-unit validation, branch-order replay, and corrupt-entry rejection.
  - [ ] Move the critical control-character and Unicode cases into `todo.invalidation.test.ts`, then remove `test/tool/sanitize.test.ts`.
  - [ ] Simplify `todo.command.test.ts` into focused flows for schema, busy-state guards, load-run-complete-continue, hidden continuation state, compression threshold, stale continuation, stop races, compression failure, and finalization.
  - [ ] Add existing-suite cases that prevent a queued continuation after a task-list revision conflict and prevent false completion after `git add` or `git commit` failure.
  - [ ] Replace the full fake Pi registration layer in `test/helpers.ts` with public extension loading where practical, while keeping only the small deterministic command-context and filesystem fixtures required by the tests.
  - [ ] Remove `test/setup.ts` and its script import if no retained test needs isolated global Pi configuration.
  - [ ] Remove test dependencies that are unused by all retained source and test files, including `minimatch` and `yaml` if the complete repository confirms they have no consumers.
  - [ ] Run `pi-tasks` type checking, linting, unit tests, and its deterministic `pi-compress` integration tests.

- [ ] Consolidate `pi-sync` planning, command, conflict, state, settings, and UI tests
  - [ ] Move the command-registration assertion from `pi-sync/test/smoke.test.ts` into `commands.test.ts`, then delete `smoke.test.ts` and remove `test:integration`.
  - [ ] Retain command parsing, bounded diff output, progress cancellation, conflict decisions, immutable plan authorization, headless plan-only behavior, corrupt-state refusal, schema refusal, managed-scope denial, strict settings parsing, and machine-only preservation.
  - [ ] Convert repeated footer, conflict-choice, stale-plan, classifier, scanner-failure, and approval cases into table-driven tests without dropping distinct security inputs.
  - [ ] Remove the direct `StatusGenerationGuard` test if it protects only an internal footer implementation.
  - [ ] Keep the complete three-way classifier truth table and deterministic plan identity checks because they define synchronization behavior.
  - [ ] Run the revised pure and deterministic `pi-sync` test group before changing filesystem or transaction integration tests.

- [ ] Simplify `pi-sync` filesystem, Git, migration, and security integration tests
  - [ ] Keep traversal, collision, symlink, nested-repository, exact-byte, canonical-comparison, and size-limit tests with smaller shared fixtures.
  - [ ] Keep real Git tests for exact candidate ancestry, hook suppression, dirty-worktree refusal, manifest inspection, stale publication, candidate preservation, and non-force pushes.
  - [ ] Remove Git assertions about every call's timeout, no-fetch implementation details, unrelated machine markers, and repeated remote-ref comparisons.
  - [ ] Keep validated legacy migration and ambiguous-baseline no-delete behavior.
  - [ ] Keep all distinct fail-closed secret-scanner phases and secret redaction while using deterministic scanner fixtures instead of testing Secretlint itself.
  - [ ] Run the filesystem, Git, migration, and security test group on clean temporary directories.

- [ ] Simplify `pi-sync` package, transaction, backup, and recovery tests
  - [ ] Keep exact approved package commands, journal and settings verification, cancellation, rollback order, rollback failure reporting, and stale approval rejection.
  - [ ] Remove isolated `rememberApprovals` and best-effort removal tests unless the production command path can create and persist those behaviors.
  - [ ] Keep coordinator order, single-writer locking, stale-plan inputs, pre-publish safety, post-publish recovery, and durable journal failure cases.
  - [ ] Keep verified-backup-before-write, exact file application, deletion authorization, automatic restore, manual recovery paths, cancellation recovery, exact restore authorization, and stale restore refusal.
  - [ ] Record `src/setup.ts`, scope activation, recovery resume, and approve-and-remember as unsupported or untested product paths unless they are wired to a public command; do not add isolated tests for unreachable helpers.
  - [ ] Run the complete `pi-sync` type check, lint, unit suite, and retained integration tests.

- [ ] Remove unused test infrastructure and normalize package scripts
  - [ ] Remove imports, constants, helpers, fixtures, scripts, and development dependencies that have no consumer after all test moves and deletions.
  - [ ] Keep `check` ordered as type check, lint, and retained tests in every package that has tests.
  - [ ] Keep real Pi subprocess tests only in `pi-env`, `pi-preload`, and `pi-tree`.
  - [ ] Regenerate and commit each affected lockfile after dependency changes without using forceful audit fixes or unpinned replacement dependencies.

- [ ] Complete repository validation, commits, publication, and installed-extension updates
  - [ ] Run targeted tests first, then each changed repository's complete `check` command.
  - [ ] For every changed extension, verify a clean full install, a clean production install, and a production extension load without provider credentials.
  - [ ] Confirm that no test calls a real model API and that all temporary files and repositories are removed after each test.
  - [ ] Review final Git diffs and status in every repository without modifying unrelated concurrent work.
  - [ ] Commit each changed repository with a minimal accurate message, push each changed extension before installation, and run `pi update` for the changed extensions only after all pushes succeed.
