# Goal

Update the available Pi extension test suites so each retained test protects critical behavior owned by its extension, duplicate and implementation-specific tests are removed, real Pi processes and external tools are used only at necessary boundaries, public Pi APIs and deterministic fixtures replace custom harness behavior, unused test code and dependencies are removed, and every changed package passes its required checks.

## Work units

- [ ] Remove the generic test suite from the extension authoring template
  - [ ] Delete `template/test/e2e.test.ts` and remove `test/e2e.test.ts` from `_skip_if_exists` in `copier.yml`.
  - [ ] Remove the default test scripts from `template/package.json.jinja` and keep its `check` script limited to type checking and linting.

- [ ] Focus `pi-env` tests on environment precedence and the real process boundary
  - [ ] Keep the unit cases for global and trusted-project precedence, project trust, existing process values, and cleanup of extension-owned values.
  - [ ] Reduce `pi-env/test/e2e.test.ts` to child-process inheritance, existing process-value precedence, and key-only context that does not expose values.

- [ ] Focus `pi-modes` and `pi-prompts` tests on their editor behavior
  - [ ] Remove the generic Pi subprocess load case and its unused imports from `pi-modes/test/modes.test.ts`.
  - [ ] Keep `pi-modes` schema, trust, source precedence, editor replacement, input transformation, reload, and cleanup cases, and test the registered mode-cycle shortcut in the same file.
  - [ ] Keep `pi-prompts` catalog validation, source trust, editor-segment replacement, and chain follow-up cases, and extend the existing cycle case through removal of the selected segment.
  - [ ] Rename the `pi-prompts` `test:e2e` script to `test:integration`.

- [ ] Reduce `pi-preload` tests while preserving preload safety
  - [ ] Keep configuration merging, file selection, canonical output, binary rejection, image ordering, context ordering, nested references, cycle rejection, byte limits, project trust, and reload deduplication.
  - [ ] Remove duplicate unsafe-name, context-failure, and Dioxus cases while retaining one case for each distinct rule.
  - [ ] Replace complete Dioxus document comparisons with checks for core content and selected capability fragments.
  - [ ] Limit the two real Pi tests to trusted reload deduplication and untrusted project isolation.

- [ ] Focus `pi-tree` tests on selection, bounds, trust, and reload behavior
  - [ ] Keep the normal filesystem fixture and bounded large-tree fixture in `pi-tree/test/unit.test.ts`.
  - [ ] Remove assertions about the external `tree` program's exact glyph layout while retaining ignore, generated-file, symlink, stable-root, and output-size checks.
  - [ ] Limit the two real Pi tests to hidden-message deduplication, project trust, and `TREE.txt` creation.

- [ ] Reduce `pi-tasks` state, task-list, and widget tests
  - [ ] Keep the reducer and replay cases for state transitions, one active work unit, branch-order replay, and corrupt-entry rejection, and remove repeated schema assertions.
  - [ ] Keep task-list filename, hierarchy, UTF-8, checkbox-only update, revision-conflict, and completed-list deletion cases in `state/task-list-file.test.ts`.
  - [ ] Reduce `test/tool/sanitize.test.ts` to one control-character case and one ordinary Unicode case.
  - [ ] Replace exact widget spacing assertions with semantic content, line-count, and width assertions.

- [ ] Simplify `pi-tasks` command integration and test infrastructure
  - [ ] Delete `pi-tasks/test/e2e.test.ts` and remove `test:e2e` from `pi-tasks/package.json`.
  - [ ] Reduce `todo.command.test.ts` to tool schema, busy-state guards, load-run-complete-continue, hidden continuation state, compression threshold, stale continuation, stop during compression, compression failure, and finalization.
  - [ ] Add command cases that do not queue a continuation after a source revision conflict and do not report completion after `git add` or `git commit` failure.
  - [ ] Remove helper APIs and fixture fields that no retained test uses while preserving the existing isolated test environment.
  - [ ] Remove the unused `minimatch` and `yaml` development dependencies.

- [ ] Consolidate `pi-sync` planning, command, state, settings, conflict, and UI tests
  - [ ] Move the `/config-sync` registration assertion from `test/smoke.test.ts` into `test/commands.test.ts`, delete `test/smoke.test.ts`, and remove `test:integration`.
  - [ ] Keep command parsing, bounded diff output, cancellation settling, explicit conflict decisions, immutable plan authorization, headless plan-only behavior, state and schema refusal, managed-scope denial, strict settings parsing, and machine-only preservation.
  - [ ] Remove repeated assertions that restate the same footer, conflict, stale-plan, or approval result.
  - [ ] Remove the direct `StatusGenerationGuard` test and keep the complete three-way classifier table and deterministic plan identity checks.

- [ ] Simplify `pi-sync` filesystem, Git, migration, and security integration tests
  - [ ] Keep traversal, collision, symlink, nested-repository, exact-byte, canonical-comparison, and size-limit cases with the existing temporary-directory fixtures.
  - [ ] Keep real Git cases for exact candidate ancestry, hook suppression, dirty-worktree refusal, manifest inspection, stale publication, candidate preservation, and non-force pushes.
  - [ ] Remove assertions about every Git call's timeout, no-fetch implementation details, unrelated machine files, and repeated remote-ref comparisons.
  - [ ] Keep validated legacy migration, ambiguous-baseline no-delete behavior, fail-closed scanner phases, final-tree validation, and redacted secret findings.

- [ ] Simplify `pi-sync` package, coordinator, transaction, backup, and recovery tests
  - [ ] Keep exact approved package commands, journal and settings verification, stale approval rejection, cancellation, rollback order, and rollback failure reporting.
  - [ ] Remove isolated `rememberApprovals` and best-effort package-removal cases because the production command path does not create those behaviors.
  - [ ] Keep coordinator order, single-writer locking, stale-plan rejection, pre-publish safety, post-publish recovery, and durable journal failure cases.
  - [ ] Keep verified backup before writes, exact file application, deletion authorization, automatic restore, manual recovery paths, cancellation recovery, exact restore authorization, and stale restore refusal.

- [ ] Remove unused test infrastructure and validate all changed packages
  - [ ] Remove imports, constants, helpers, fixtures, scripts, and development dependencies that have no retained consumer, then update affected lockfiles.
  - [ ] Keep real Pi subprocess tests only in `pi-env`, `pi-preload`, and `pi-tree`, and keep all model-dependent tests deterministic without provider calls.
  - [ ] Run each changed package's type check, lint, and retained tests, followed by clean full-install, production-install, and production extension-load checks.
  - [ ] Commit and push each changed repository, then run `pi update` for the changed extensions.
