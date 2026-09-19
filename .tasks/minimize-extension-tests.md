# Goal

Reduce the existing Pi extension tests so each suite covers only critical extension-owned behavior, remove duplicated and implementation-specific checks of Pi internals, Node.js, external tools, and third-party packages, consolidate obsolete test support, add the identified critical cases to existing suites, and validate and release the changed extensions in dependency order.

## Work units

- [x] Consolidate the `pi-compress` protocol and compression-core tests before changing `pi-tasks`.
  - [x] Keep `pi-compress/test/protocol.test.ts` focused on public protocol names, exact request and result schemas, stored-version handling, additive stored fields, and legacy batch markers.
  - [x] Reduce `pi-compress/test/compression.test.ts` to atomic tool-call groups, protected boundaries, source and continuation integrity, stale rewrite rejection, append-only application, direct range compression, service coordination, batch compression, and crop reconstruction.
  - [x] Remove native selector traversal, arbitrary timing, repeated token-format, and duplicate error-path tests.
  - [x] Add focused cases for oversized range rejection, current-model selection, and a service model failure that returns a stable code without writing entries.

- [x] Reduce `pi-compress` command and integration tests to one case per public behavior.
  - [x] Remove duplicate range, rewrite, protocol, crop reconstruction, and legacy marker coverage from `pi-compress/test/extension.test.ts`.
  - [x] Keep command registration, branch and model selection, squash, discard, tournament merge, mandatory decision review, crop commands, append-only undo, ambient warnings, and one semantic panel render.
  - [x] Replace the global installed-Pi process test with one repository-resolved `RpcClient` extension-load test.
  - [x] Remove unused selector, protocol-request, child-process, and temporary-directory helpers and imports.

- [x] Simplify `pi-tasks` command orchestration tests against the consolidated `pi-compress` API.
  - [x] Combine task-list load, run, and completion into one workflow in `pi-tasks/test/todo.command.test.ts`.
  - [x] Replace separate compression-threshold tests with one boundary table and retain one stop-during-compression race.
  - [x] Combine compression cancellation and failure cases and verify that feeding stops without sending the next work unit.
  - [x] Remove private continuation-state blacklists, repeated private snapshot equality checks, and redundant append-call counts.
  - [x] Add a prior `pi-compress/compression` marker case and verify that the next batch compression uses it as the anchor.
  - [x] Keep one successful task-list finalization and one Git failure that preserves recoverable task state.

- [ ] Simplify `pi-tasks` state, file, widget, and sanitization tests.
  - [ ] Keep replay order, corrupt-state rejection, reducer transitions, the single-current-work-unit invariant, hierarchy validation, UTF-8 validation, checkbox-only writes, revision conflicts, and completed-list deletion.
  - [ ] Reduce filename and malformed-hierarchy tables to representative path, line-break, nesting, and completion-consistency failures.
  - [ ] Assert widget content, line limits, and visible width instead of exact spacing and complete progress-bar strings.
  - [ ] Keep one terminal-control sanitization table and one single-line widget case.
  - [ ] Remove unused fixtures and imports from `pi-tasks/test/helpers.ts` and update the explicit unit-test script for any removed test file.

- [ ] Tighten `pi-env` tests around trust, precedence, process preservation, and reload.
  - [ ] Consolidate trusted and untrusted collection coverage in `pi-env/test/unit.test.ts` while retaining global-to-project precedence, ignored settings files, preserved process values, and cleanup.
  - [ ] Reduce `pi-env/test/e2e.test.ts` to one shared key, one global key, one project key, and one preserved process key while proving that values never enter context.
  - [ ] Reload the extension once and verify that one key-only context message remains and the old runtime restores loaded values correctly.

- [ ] Simplify `pi-modes` tests while preserving configuration precedence and runtime behavior.
  - [ ] Keep strict schema validation and one trusted-versus-untrusted source-precedence table in `pi-modes/test/modes.test.ts`.
  - [ ] Reduce the runtime case to start, select, cycle, transform one input, reload, and shut down.
  - [ ] Remove exact listener-removal counts, repeated intermediate widget assertions, and unrelated primitive schema checks.
  - [ ] Keep one repository-resolved Pi extension-load test.

- [ ] Consolidate `pi-prompts` catalog, trust, cycling, and chain tests.
  - [ ] Use one catalog fixture in `pi-prompts/test/unit.test.ts` with an inline prompt, a Markdown prompt, one chain, one missing-member failure, and one duplicate-name failure.
  - [ ] Keep one editor-cycling case that preserves surrounding text without redundant full-object assertions.
  - [ ] Keep user-package, trusted project-package, and trusted project-root precedence plus chain follow-up behavior in `pi-prompts/test/integration.test.ts`.
  - [ ] Add a case that changes the selected chain segment before submission and verifies that later chain members do not run.
  - [ ] Rename the package script from `test:e2e` to `test:integration`.

- [ ] Reduce `pi-preload` fixture matrices while retaining selection, rendering, limits, and trust boundaries.
  - [ ] Keep preset merging, include and exclude rules, `.gitignore`, generated-file exclusion, media ordering, binary rejection, nested project references, cycle rejection, and preload size limits.
  - [ ] Replace the context failure matrix with one import or execution failure and one render failure that name the selected source.
  - [ ] Reduce Dioxus metadata coverage to one selected package and one ambiguous workspace, with one router, full-stack, and platform template case.
  - [ ] Replace repeated complete `PRELOAD.md` comparisons with block-order, heading, selected-content, and byte-limit assertions.
  - [ ] Keep the trusted reload-deduplication and untrusted isolation Pi process tests and remove unused fixtures.

- [ ] Simplify `pi-tree` tests around selection, bounded output, trust, and reload.
  - [ ] Keep one representative exclusion for `.gitignore`, bundled `.treeignore`, generated output, lock files, and symlink traversal.
  - [ ] Replace external `tree` glyph and detailed-format assertions with stable-root and representative path assertions.
  - [ ] Replace the 600-file fixture with fewer long paths that still verify the 16 KiB output bound.
  - [ ] Keep the trusted reload-deduplication and untrusted no-output Pi process tests.

- [ ] Consolidate `pi-sync` planning, configuration, inventory, and state tests before execution tests.
  - [ ] Keep command parsing, footer priority, diff truncation, stale status protection, and cancellation settling in `test/commands.test.ts`.
  - [ ] Keep exact conflict choices, rebuilt-plan identity, and merge-workspace behavior while removing internal UI-call details from `test/conflicts.test.ts`.
  - [ ] Combine path traversal, collisions, symlinks, nested repositories, exact bytes, canonical settings comparison, and size limits into focused tables in `test/files.test.ts`.
  - [ ] Retain the three-way classifier, immutable plan identity, destination validation, mode blockers, strict settings, pinned packages, exact package decisions, and machine-only preservation.
  - [ ] Reduce `test/state.test.ts` to corrupt JSON, unknown schema, one state round trip, one plan round trip, managed scope, and permanent deny rules.

- [ ] Reduce `pi-sync` Git and migration tests to owned orchestration and one real Git boundary.
  - [ ] Keep exact snapshot, one-parent candidate, successful publish, stale publish, valid manifest, and non-destructive invalid-clone behavior in `test/git.test.ts`.
  - [ ] Fold focused diff and fast-forward assertions into the candidate and successful publish cases.
  - [ ] Replace malicious-hook execution with captured Git argument checks that require the disabled hook path.
  - [ ] Replace real Git setup in `test/migration.test.ts` with deterministic `MigrationExec` responses while retaining valid import and ambiguous-baseline fallback.
  - [ ] Remove unused Git configuration, hook permission, child-process, and repository-fixture code.

- [ ] Consolidate `pi-sync` transaction, package, recovery, and security fault tests.
  - [ ] Keep transaction order, locking, immutable-plan revalidation, post-publish restore, and durable-journal behavior while sharing stale-plan fixtures.
  - [ ] Keep exact package commands, approval rejection before execution, best-effort removal, cancellation, reverse rollback, and rollback-failure reporting without exact complete journal arrays.
  - [ ] Keep verified backup creation, deletion authorization, backup-before-write, automatic restore, manual recovery paths, and cancellation boundaries with shared failure fixtures.
  - [ ] Keep explicit recovery choices, immutable restore plans, verified restore, and stale-plan rejection.
  - [ ] Keep denied paths, final-tree validation, conflict markers, strict JSON, package policy, machine-only preservation, scanner failures, and redacted secret findings.

- [ ] Finish `pi-sync` public integration and test-support cleanup.
  - [ ] Reduce `test/ui.test.ts` to plan and receipt parity, representative decision categories, no-UI plan output, and exact full plan-ID authorization.
  - [ ] Keep `test/smoke.test.ts` as the extension-load integration and add one missing-configuration command case that creates no transaction journal.
  - [ ] Retain only temporary agent-directory and reduced Git-boundary helpers in `test/helpers.ts`.
  - [ ] Update the explicit unit-test script for removed files and remove package dependencies that become unused.

- [ ] Validate and release the changed extensions after all test edits are complete.
  - [ ] Run each changed package's typecheck, Biome check, retained tests, and package-specific static checks.
  - [ ] Run clean full installs, clean production installs, and production extension-load checks without provider credentials.
  - [ ] Commit and push each changed extension repository, then run `pi update --extensions`.
