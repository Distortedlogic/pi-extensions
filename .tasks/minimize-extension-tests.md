# Goal

Reduce the Pi extension test suites to the necessary deterministic cases that protect critical extension-owned behavior through public APIs, remove duplicate and external-product checks, remove unused test support, and pass all required repository checks.

## Work units

- [ ] Consolidate `pi-tasks` file-format and state tests.
  - [ ] Rewrite `pi-tasks/test/state/task-list-file.test.ts` as table-driven filename and malformed-hierarchy cases plus focused UTF-8, checkbox-only write, revision-conflict, and completed-list deletion cases.
  - [ ] Rewrite `pi-tasks/test/state/state-reducer.test.ts` as focused `next` and `complete` transition tables that retain the single-current-work-unit invariant.
  - [ ] Reduce `pi-tasks/test/state/replay.test.ts` to one ordered branch fixture for custom state, run-start state, task-result state, and corrupt-entry rejection.
  - [ ] Delete replay and file cases that duplicate filename validation, Markdown hierarchy validation, or revision-conflict behavior.

- [ ] Consolidate `pi-tasks` command, tool, widget, and sanitization tests.
  - [ ] Move the completion-only schema and visible-content privacy cases from `pi-tasks/test/todo.register.test.ts` into `pi-tasks/test/todo.command.test.ts`, then delete `todo.register.test.ts`.
  - [ ] Reduce `todo.command.test.ts` to load, run, complete, continue, active-run guards, the 400,000-token compression boundary, compression cancellation and failure, one stop race, stale continuation rejection, and final Git completion.
  - [ ] Reduce `todo.invalidation.test.ts` to session and tree restoration, TUI ownership and cleanup, bounded large-list rendering, and one all-complete view.
  - [ ] Replace the separate sanitization cases in `tool/sanitize.test.ts` with one control-character table and one single-row widget case.
  - [ ] Delete `pi-tasks/test/ship-manifest.test.ts` and add one provider-free real Pi extension-load test.

- [ ] Simplify the `pi-modes` suite around its public configuration and runtime behavior.
  - [ ] Rename `pi-modes/test/empty.test.ts` to `pi-modes/test/modes.test.ts` and combine source precedence with trusted and untrusted source selection.
  - [ ] Retain strict schema validation, mode replacement, idempotent input transformation, widget updates, event-bus selection, reload replacement, and shutdown cleanup.
  - [ ] Delete direct `package.json.files` and manifest-layout assertions while retaining one minimal real Pi extension-load case.

- [ ] Consolidate `pi-preload` selection, context, mapping, and limit tests.
  - [ ] Combine project and preset schema validation, and combine preset merging with representative Git-ignore, generated-file, lock-file, and explicit-exclusion fixtures in `pi-preload/test/unit.test.ts`.
  - [ ] Combine binary rejection and image ordering into focused media-selection cases that verify the canonical `PRELOAD.md` output.
  - [ ] Consolidate context order, de-duplication, root selection, lazy import, undefined facts, render order, unsafe names, and source-scoped failures.
  - [ ] Replace the separate recursive-project cases with one nested `extends` fixture and one cycle-rejection fixture.
  - [ ] Retain the configured block and aggregate preload limits and delete the separate Dioxus byte-budget test.

- [ ] Reduce `pi-preload` Dioxus and real Pi integration coverage.
  - [ ] Reduce Dioxus metadata cases to deepest package selection, default-member selection, ambiguous workspace, direct feature and router detection, and no applicable package.
  - [ ] Replace the broad specialist-content regular expression with direct core-only, one-capability, and all-capabilities fragment checks.
  - [ ] Simplify `pi-preload/test/e2e.test.ts` to trusted hidden-message and `PRELOAD.md` behavior, untrusted no-read behavior, and reload duplicate prevention.
  - [ ] Delete E2E assertions about `pi-modes`, `pi-prompts`, and `TREE.txt`.

- [ ] Consolidate `pi-prompts` parser and public Pi API integration tests.
  - [ ] Combine valid parsing, missing chain members, duplicate names, Markdown prompt loading, and mixed YAML/file chain resolution in `pi-prompts/test/unit.test.ts`.
  - [ ] Retain exact selected-segment replacement and delete the direct `buildPromptChoices` mapping test and its test-only export.
  - [ ] Reduce `pi-prompts/test/e2e.test.ts` to one user source, one project-package source, one project-root source, one two-step chain, and explicit untrusted-project exclusion; rename it to `integration.test.ts`.
  - [ ] Inline the retained prompt fixture and delete `pi-prompts/test/fixtures/AGENTS.yml`.

- [ ] Simplify `pi-tree` unit and real Pi tests.
  - [ ] Reduce `pi-tree/test/unit.test.ts` to representative Git, ignored, lock, context, test, dotfile, and source paths plus the 16 KiB output bound.
  - [ ] Delete exact GNU `tree` branch-glyph assertions and retain semantic inclusion, exclusion, stable-root, and symlink non-traversal checks.
  - [ ] Reduce `pi-tree/test/e2e.test.ts` to trusted one-message and file parity, untrusted no-message and no-file behavior, and reload duplicate prevention.

- [ ] Reduce `pi-sync` planning, configuration, storage, and review tests.
  - [ ] Retain the three-way classifier truth table and deterministic risk ordering in `pi-sync/test/plan.test.ts`, and combine mode blocker cases into one table.
  - [ ] Move plan-ID integrity cases from `ui.test.ts` to `plan.test.ts` and keep only security-relevant plan fields in hash assertions.
  - [ ] Reduce `settings.test.ts` to strict JSON, shared package policy, exact-source decisions, and machine-only setting and package preservation.
  - [ ] Reduce `state.test.ts` to corrupt and unsupported artifacts, durable artifact round trips, default scope, and permanent deny rules; delete the directory-layout and runtime-unused scope-approval helper cases.
  - [ ] Reduce `ui.test.ts` to plan and receipt action consistency, required decision categories, no-UI plan output, RPC review, and exact full-ID authorization.

- [ ] Reduce `pi-sync` managed-file and staged-security tests.
  - [ ] Retain path traversal, portable-name collisions, symlink rejection, exact-byte hashes, canonical settings comparison, nested repository rejection, maximum-file size, and total-plan size in `files.test.ts`.
  - [ ] Delete the Unix socket fixture and its `node:net` import.
  - [ ] Retain staged-tree equality, permanent deny rules, conflict markers, strict JSON, shared package policy, machine-only preservation, and redacted secret findings in `security.test.ts`.
  - [ ] Add deterministic fake-scanner cases for startup, read, timeout, malformed-output, and secret-finding failures.

- [ ] Consolidate `pi-sync` execution, rollback, journal, and recovery tests.
  - [ ] Retain coordinator cases for exclusive locking, semantic plan expiration, journal order, pre-publish failure, post-publish restore, and final state-write failure.
  - [ ] Retain transaction cases for verified backup before mutation, exact deletion authorization, successful apply, mid-apply restore, failed restore paths, and cancellation recovery; delete the runtime-unused backup-cleanup cases.
  - [ ] Convert package approval rejection cases into one table while retaining exact command order, settings verification, best-effort removal, cancellation, reverse rollback, and rollback-error reporting.
  - [ ] Reduce recovery assertions to explicit user choice, exact restore ID, verified restore actions, and stale-plan rejection.

- [ ] Reduce `pi-sync` Git, migration, setup, smoke, and composite integration tests.
  - [ ] Retain Git cases for exact snapshot parentage, candidate content, dirty-worktree refusal, disabled hooks, one named-snapshot diff, stale publish, and normal fast-forward publish.
  - [ ] Move `inspectSetupRepository` cases from `setup.test.ts` into `git.test.ts`, then delete `setup.test.ts` and the runtime-unused first-sync helper tests.
  - [ ] Retain migration preview and validated import plus the no-delete fallback without repeating Git assertions.
  - [ ] Keep only extension loading and `/config-sync` registration in `smoke.test.ts`.
  - [ ] Delete `pi-sync/test/two-machine.test.ts` because its Git, plan, inventory, and transaction behavior is already covered by focused tests.

- [ ] Remove unused test support and update test commands.
  - [ ] Trim `pi-tasks/test/helpers.ts` and `pi-sync/test/helpers.ts` to exports used by retained tests.
  - [ ] Replace `expect` with `node:assert/strict` and `jest-mock` with `mock` from `node:test` in retained `pi-tasks` and `pi-sync` tests.
  - [ ] Remove `expect`, `jest-mock`, and the unused `pi-tasks` development dependencies `minimatch` and `yaml` from package manifests and lock files.
  - [ ] Remove deleted and renamed test files from package scripts and keep pure unit, public Pi integration, and real-process tests in their correct commands.

- [ ] Validate and publish every changed extension repository.
  - [ ] Run typecheck, Biome, focused tests, a clean full install, a clean production install, package dry run, audit, and provider-free production extension loading in each changed repository.
  - [ ] Confirm that retained real Pi process tests cover only process-boundary behavior and that no removed helper, fixture, script entry, dependency, or test-only export remains.
  - [ ] Commit and push each changed extension with a minimal accurate message, then run `pi update` for the changed extensions.
