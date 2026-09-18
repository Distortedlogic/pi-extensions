# Goal

Reduce the supplied Pi extension test suites to the smallest deterministic set that protects critical extension-owned behavior, uses public Pi and module APIs, removes duplicate and external-tool-focused checks, adds only missing critical coverage, cleans unused test support and dependencies, and passes each changed repository's required type, lint, test, install, package, and production extension-load checks.

## Work units

- [ ] Establish the `pi-compress` test baseline before changing its dependent `pi-tasks` suite.
  - [ ] Inspect the on-disk `pi-compress/test` files and map each existing test to rewrite safety, crop recovery, branch operations, range compression, or protocol validation; request approval before creating a first suite if no suite exists.
  - [ ] Remove duplicate panel-rendering and implementation-detail checks while retaining tests that prevent split tool-call groups, protected-range rewrites, changed-session application, and source-history mutation.
  - [ ] Add deterministic coverage for range prepare, apply, cancel, status, duplicate requests, conflicts, and session changes through public functions or Pi events without a real model API.
  - [ ] Retain focused crop, squash, discard, model-restore, undo, and protocol-schema cases with one shared session fixture and no fake Pi runtime.
  - [ ] Update `pi-compress` test scripts and test-only dependencies, then pass typecheck, lint, tests, clean full and production installs, package inspection, and a provider-free production extension-load check.

- [ ] Consolidate `pi-tasks` file-format and state tests after the `pi-compress` public contracts are fixed.
  - [ ] Simplify `pi-tasks/test/state/task-list-file.test.ts` into table-driven filename and malformed-hierarchy checks plus focused UTF-8, checkbox-only write, revision-conflict, and completed-list deletion cases.
  - [ ] Simplify `pi-tasks/test/state/state-reducer.test.ts` into focused `next` and `complete` transition tables while retaining the single-current-work-unit schema invariant.
  - [ ] Simplify `pi-tasks/test/state/replay.test.ts` to one ordered branch fixture that covers custom state, run-start state, task-result state, and corrupt-entry rejection.
  - [ ] Remove replay and file cases that duplicate the filename schema, Markdown hierarchy rules, or source-revision checks.

- [ ] Consolidate `pi-tasks` command, tool, widget, and sanitization tests.
  - [ ] Move the completion-only schema and visible-content privacy assertions from `pi-tasks/test/todo.register.test.ts` into `pi-tasks/test/todo.command.test.ts`, then delete `todo.register.test.ts`.
  - [ ] Reduce `todo.command.test.ts` to load/run/complete/continue, active-run guards, the 400,000-token compression boundary, compression cancel/failure handling, one stop race, and final Git completion behavior.
  - [ ] Simplify `todo.invalidation.test.ts` to session restore, tree restore, TUI ownership and cleanup, bounded large-list rendering, and one all-complete view without repeated exact-width snapshots.
  - [ ] Combine `tool/sanitize.test.ts` into a terminal-control table and one single-row widget assertion.
  - [ ] Remove `pi-tasks/test/ship-manifest.test.ts`; move package-content checks to release validation and add one small provider-free real Pi extension-load test.
  - [ ] Add a finalization-failure case that proves a failed `git add` or `git commit` cannot silently lose the task-list file, and add a stale-continuation rejection case.
  - [ ] Shrink `test/helpers.ts`, update hard-coded test scripts, and remove unused `minimatch`, `yaml`, `expect`, and `jest-mock` only after imports and clean installs confirm they are not required.

- [ ] Keep `pi-env` focused on environment precedence, trust, cleanup, and process propagation.
  - [ ] Retain the three focused cases in `pi-env/test/unit.test.ts` for global/project precedence, project trust, and preservation and cleanup of process values.
  - [ ] Retain `pi-env/test/e2e.test.ts` because a real Pi process is required to prove shell propagation and key-only context without value leakage.
  - [ ] Add one lifecycle case only if reload or shutdown owns cleanup, and prove that old loaded values do not remain after that lifecycle event.
  - [ ] Do not add tests for `dotenv` syntax that the extension does not implement.

- [ ] Simplify the single `pi-modes` suite around configuration and runtime behavior.
  - [ ] Rename `pi-modes/test/empty.test.ts` to a descriptive filename and combine source precedence with trusted and untrusted source selection in one table-driven test.
  - [ ] Keep strict schema validation, mode replacement, idempotent input transformation, widget behavior, event-bus selection, and shutdown cleanup.
  - [ ] Remove direct `package.json.files` and manifest-layout assertions while retaining one minimal real Pi extension-load check.
  - [ ] Add one reload case that proves a changed source catalog replaces the prior modes without duplicates.
  - [ ] Remove imports made unused by the manifest assertions and pass all repository checks and clean installation checks.

- [ ] Reduce `pi-preload` core selection, context, and limit tests without weakening trust or path safety.
  - [ ] Combine project and preset schema validation, and combine preset merging with representative Git-ignore, generated-file, lock-file, and explicit-exclusion fixtures in `pi-preload/test/unit.test.ts`.
  - [ ] Combine binary rejection and image ordering into focused media-selection cases that still verify the canonical `PRELOAD.md` snapshot.
  - [ ] Consolidate context order, de-duplication, root selection, lazy import, undefined facts, and render order into a small set of selected-context tests.
  - [ ] Reduce source-error cases to representative import and execution or render failures while retaining unsafe context-name validation.
  - [ ] Combine recursive child mapping, child-root facts, parent ignore behavior, and nested `extends` into one fixture, with one separate cycle-rejection case.
  - [ ] Keep only tests for configured per-block and aggregate preload limits; remove arbitrary per-scenario Dioxus byte budgets.
  - [ ] Add a deterministic symlink-escape test for selected project content.

- [ ] Reduce `pi-preload` Dioxus and real Pi integration coverage to critical cases.
  - [ ] Reduce Dioxus metadata scenarios to deepest package selection, default-member selection, ambiguous workspace, direct feature and router detection, and no applicable package.
  - [ ] Replace the broad specialist-content regular expression with direct fragment-selection checks for core-only, one conditional capability, and all enabled capabilities.
  - [ ] Simplify `pi-preload/test/e2e.test.ts` to trusted hidden-message and `PRELOAD.md` behavior plus untrusted no-read behavior.
  - [ ] Remove E2E assertions about `pi-modes`, `pi-prompts`, and `TREE.txt`.
  - [ ] Add one reload case that proves an existing preload message prevents duplicate injection.
  - [ ] Remove test-only imports made unused by the reduced Dioxus matrix, then run all preload checks and clean installs.

- [ ] Consolidate `pi-prompts` parser and public Pi API integration tests.
  - [ ] Combine valid parsing, missing chain members, duplicate names, Markdown prompt loading, and mixed YAML/file chain resolution in `pi-prompts/test/unit.test.ts`.
  - [ ] Keep the exact selected-segment replacement case and remove the direct `buildPromptChoices` mapping test and any test-only export it required.
  - [ ] Reduce `pi-prompts/test/e2e.test.ts` to one user source, one project-package source, one project-root source, and one two-step chain; rename it as an integration test because it does not start a Pi process.
  - [ ] Make project trust explicit by using invalid or unique untrusted project configuration and proving that Pi does not read it.
  - [ ] Inline and remove `test/fixtures/AGENTS.yml` if no retained case needs the fixture.
  - [ ] Update test scripts and pass typecheck, lint, tests, clean installs, package inspection, and production extension loading.

- [ ] Simplify `pi-tree` tests while retaining external-command and trust boundaries.
  - [ ] Reduce `pi-tree/test/unit.test.ts` exclusions to one representative Git path, ignored path, lock file, context file, test file, visible dotfile, and visible source file.
  - [ ] Remove exact GNU `tree` branch-glyph assertions except for the stable root and semantic inclusion or exclusion checks.
  - [ ] Retain the large-tree test that enforces the 16 KiB output bound.
  - [ ] Simplify `pi-tree/test/e2e.test.ts` to trusted one-message/file parity and untrusted no-message/no-file behavior without repeating unit exclusions.
  - [ ] Add a non-Windows symlink fixture that proves target content is not traversed, and add one reload case that prevents duplicate tree injection.
  - [ ] Run all tree checks with the real `tree` executable and complete clean install and production-load validation.

- [ ] Add or reduce `pi-steering` coverage around its owned ten-call rule.
  - [ ] Inspect the on-disk `pi-steering` source and tests; request approval before creating a first suite if no suite exists.
  - [ ] Keep or add deterministic public-event cases for no early steering, exactly one steering message on the tenth relevant tool call, counter reset, and ignored non-tool events.
  - [ ] Remove timing, exact UI prose, and Pi-internal event-order checks that are not part of the extension contract.
  - [ ] Update test scripts and dependencies, then run typecheck, lint, tests, clean installs, and a provider-free extension-load check.

- [ ] Reduce `pi-sync` pure planning, configuration, storage, and review tests first.
  - [ ] Keep the complete three-way classifier truth table and deterministic risk ordering in `pi-sync/test/plan.test.ts`, and combine mode blocker cases into a small table.
  - [ ] Move plan-ID integrity assertions from `ui.test.ts` to `plan.test.ts` and retain only security-relevant plan fields in hash assertions.
  - [ ] Simplify `settings.test.ts` to strict JSON, shared package policy, exact-source decisions, and machine-only setting and package preservation.
  - [ ] Simplify `state.test.ts` to corrupt or unsupported artifacts, durable artifact round trips, default scope, and permanent deny rules; remove the separate directory-layout test.
  - [ ] Remove tests for scope-approval helpers unless the runtime command path uses them; do not let test-only functions represent implemented command behavior.
  - [ ] Simplify `ui.test.ts` to plan and receipt action consistency, all required decision categories, no-UI plan output, RPC review, and exact full-ID authorization without a mocked TUI component path.

- [ ] Reduce `pi-sync` managed-file and staged-security tests while retaining fail-closed behavior.
  - [ ] Keep path traversal, portable-name collisions, symlink rejection, exact-byte hashes, canonical settings comparison, nested repository rejection, maximum-file size, and total-plan size in `files.test.ts`.
  - [ ] Remove the Unix socket fixture and its `node:net` dependency unless a retained product requirement explicitly covers special files.
  - [ ] Keep full staged-tree equality, permanent deny rules, conflict markers, strict JSON, shared package policy, and machine-only preservation in `security.test.ts`.
  - [ ] Add deterministic fake-scanner cases for startup, read, timeout, malformed-output, and secret-finding failures without testing Secretlint internals.
  - [ ] Keep secret diagnostics limited to finding type, relative path, and line number.

- [ ] Preserve `pi-sync` execution, rollback, journal, and recovery state machines with less duplicated setup.
  - [ ] Retain coordinator tests for exclusive locking, semantic plan expiration, ordered journal stages, pre-publish failure, post-publish restore, and final state-write failure.
  - [ ] Retain transaction tests for verified backup before mutation, exact deletion authorization, successful apply, mid-apply restore, failed restore paths, and cancellation recovery.
  - [ ] Remove backup-cleanup tests unless backup cleanup is connected to the runtime extension path.
  - [ ] Consolidate package approval rejection cases into a table while retaining exact command order, settings verification, best-effort removal, cancellation, reverse rollback, and rollback-error reporting.
  - [ ] Simplify recovery assertions to explicit user choice, exact restore ID, verified restore actions, and stale-plan rejection without full prose comparisons.
  - [ ] Share only temporary path and file fixtures; do not build a private Pi harness.

- [ ] Reduce `pi-sync` Git, migration, setup, smoke, and composite integration tests.
  - [ ] Retain Git integration cases for exact fetched snapshot parentage, candidate content, dirty-worktree refusal, disabled hooks, stale publish, and normal fast-forward publish.
  - [ ] Simplify named-snapshot diff coverage to one path-bound read-only case and remove duplicate refresh-call assertions unless refresh remains a public contract.
  - [ ] Move `inspectSetupRepository` cases from `setup.test.ts` into `git.test.ts`, then remove tests for `selectFirstSyncMode` and `prepareFirstSync` unless those helpers are wired into the extension command path.
  - [ ] Retain migration preview and validated import plus the no-delete fallback, while avoiding assertions about external Git behavior already covered in `git.test.ts`.
  - [ ] Keep only the extension-load and `/config-sync` registration case in `smoke.test.ts`; remove its duplicate recovery decision case.
  - [ ] Delete `pi-sync/test/two-machine.test.ts` because it repeats Git, plan, inventory, and transaction modules without a real Pi process boundary.

- [ ] Close the critical `pi-sync` command-path gaps before removing helper-level safety tests.
  - [ ] Add a deterministic command-level test for exact stored-plan execution and rejection of missing, short, changed, or stale plan IDs.
  - [ ] Add scope-expansion command coverage only after the command persists approval for a later plan and never applies it in the approving plan.
  - [ ] Add recovery-resume coverage only after `RESUME` executes the recorded next journal step rather than only showing a notification.
  - [ ] Add `approve_and_remember` command coverage only after the runtime passes a persistence callback to package execution.
  - [ ] Keep unsupported paths visibly unsupported instead of adding tests that pass only against isolated helper functions.

- [ ] Normalize `pi-sync` test tooling and remove support made unused by the reduced suite.
  - [ ] Replace `expect` assertions with `node:assert/strict` and replace `jest-mock` with `mock` from `node:test` across retained test files.
  - [ ] Remove `expect` and `jest-mock` from `pi-sync/package.json` after no retained import uses them.
  - [ ] Remove deleted test files from the hard-coded `test:unit` and `test:e2e` scripts and keep external Git tests separate from pure unit tests.
  - [ ] Retain and trim `test/helpers.ts` for temporary directories and bare Git repositories used by Git and migration cases.
  - [ ] Pass typecheck, lint, unit tests, integration tests, clean full and production installs, package inspection, audit, and provider-free production extension loading.

- [ ] Keep the extension-authoring template's generated test minimal.
  - [ ] Retain `template/test/e2e.test.ts` as one provider-free real Pi process load check for `src/index.ts`.
  - [ ] Do not replace the small `--list-models` check with `RpcClient` or add generic tests that generated extensions do not own.
  - [ ] Verify `template/package.json.jinja` still runs the retained load test and that a fresh generated project passes its configured checks.

- [ ] Complete cross-repository validation and publication only after every focused suite passes independently.
  - [ ] Confirm that no removed helper, fixture, test script entry, package dependency, or test-only source export remains in any changed repository.
  - [ ] Run each changed extension's typecheck, Biome check, focused tests, clean full install, clean production install, package dry run, and production extension-load check without provider credentials.
  - [ ] Confirm that real Pi subprocess tests remain only in `pi-env`, `pi-preload`, `pi-tree`, the generated template, and any package whose behavior cannot be proven through public Pi APIs.
  - [ ] Commit each changed extension with a minimal accurate message, push its remote branch, and run `pi update` for the changed extensions only after all validation succeeds.
