# Goal

Reduce and reorganize the existing Pi extension tests in dependency order so each suite protects only critical extension-owned behavior, preserves public protocols and safety boundaries, removes duplicate or external-tool-focused checks, updates obsolete helpers, scripts, and dependencies, adds only missing critical coverage inside existing suites, leaves `pi-steering` without a new suite unless the user explicitly approves one, and validates every changed extension through its required development and production checks.

## Work units

- [ ] Consolidate the public `pi-compress` protocol and compression-core tests before changing dependent extensions.
  - [ ] Keep `pi-compress/test/protocol.test.ts` focused on stable protocol names, exact request and result schemas, stored-version handling, additive stored fields, and legacy batch marker compatibility.
  - [ ] Reduce `pi-compress/test/compression.test.ts` to atomic tool-call groups, protected boundaries, source and continuation integrity, stale rewrite rejection, append-only application, direct range compression, service coordination, batch compression, and crop reconstruction.
  - [ ] Remove native `TreeSelectorComponent` traversal tests, duplicate error permutations, repeated token-format cases, and the arbitrary long-session timing assertion.
  - [ ] Add focused cases for range-size rejection, current-model selection, and a service model failure that writes no session entries and returns only a stable failure code.
  - [ ] Run the `pi-compress` typecheck, lint, unit tests, and focused protocol tests after the consolidation.

- [ ] Reduce `pi-compress` extension, command, and TUI integration coverage to one test per public behavior.
  - [ ] Remove the duplicate range-safety, rewrite, protocol, crop reconstruction, and legacy marker sections from `pi-compress/test/extension.test.ts`.
  - [ ] Keep focused coverage for command and shortcut registration, branch creation, model selection, squash, discard, tournament merge, required decision review, crop commands, append-only undo, ambient warnings, and one semantic panel render.
  - [ ] Replace the global `which pi` and spawned installed-Pi test with the repository-resolved Pi CLI or `RpcClient` and keep one production extension-load boundary.
  - [ ] Delete selector, range-request, child-process, and temporary-directory helpers and imports that no retained test uses.
  - [ ] Run `npm run check` and `npm run knip` in `pi-compress`.

- [ ] Simplify `pi-tasks` command orchestration tests after the `pi-compress` contracts are stable.
  - [ ] Combine task-list load, run, and completion into one public workflow in `pi-tasks/test/todo.command.test.ts`.
  - [ ] Replace separate 400,000-token and 400,001-token cases with one boundary table and keep one stop-during-compression race case.
  - [ ] Combine compression cancellation and failure handling while preserving the rule that feeding stops and no next work unit is sent.
  - [ ] Remove the separate private continuation-state blacklist, repeated private snapshot equality checks, and redundant append-call-count assertions.
  - [ ] Add a case that places a prior `pi-compress/compression` marker on the active branch and verifies that the next batch compression uses it as the anchor.
  - [ ] Keep one successful finalization case and one Git failure case that proves the task file and session state remain recoverable.

- [ ] Simplify `pi-tasks` state, file, widget, and sanitization tests without weakening owned safety rules.
  - [ ] Keep branch replay order, corrupt-state rejection, reducer transitions, the single-current-work-unit invariant, strict task-list hierarchy, UTF-8 validation, checkbox-only writes, revision conflicts, and completed-list deletion.
  - [ ] Reduce filename and malformed-hierarchy tables to representative path, line-break, nesting, and completion-consistency failures.
  - [ ] Change widget tests to assert semantic content, line limits, and visible width instead of exact spacing and complete progress-bar strings.
  - [ ] Keep one terminal-control sanitization table and one single-line widget sanitization case.
  - [ ] Remove unused fixtures and imports from `pi-tasks/test/helpers.ts`, retain the prior-compression fixture, and update the explicit `test:unit` script only if a test file is removed or merged.
  - [ ] Run the `pi-tasks` typecheck, lint, unit tests, end-to-end load test, and package dependency checks.

- [ ] Tighten `pi-env` tests around trust, precedence, process preservation, and reload behavior.
  - [ ] Combine trusted and untrusted collection cases in `pi-env/test/unit.test.ts` while retaining global-to-project precedence, ignored settings files, process-value preservation, and cleanup behavior.
  - [ ] Reduce `pi-env/test/e2e.test.ts` to one shared key, one global key, one project key, and one preserved process key while continuing to prove that values never enter the hidden context message.
  - [ ] Extend the existing end-to-end test through one reload and verify that one key-only context message remains and the old runtime restores or replaces loaded values correctly.
  - [ ] Run `npm run check` in `pi-env`.

- [ ] Simplify `pi-modes` tests while preserving configuration precedence and runtime mode behavior.
  - [ ] Keep strict schema validation and one trusted versus untrusted source-precedence table in `pi-modes/test/modes.test.ts`.
  - [ ] Reduce the runtime fixture to start, select one mode, cycle once, transform one input, reload once, and shut down once.
  - [ ] Remove exact listener-removal counts, repeated intermediate widget arrays, and unrelated primitive schema checks.
  - [ ] Keep one repository-resolved Pi production-load test and remove any fixture state that it does not use.
  - [ ] Run `npm run check` in `pi-modes`.

- [ ] Consolidate `pi-prompts` catalog, trust, cycling, and chain tests.
  - [ ] Keep one compact catalog fixture in `pi-prompts/test/unit.test.ts` with an inline prompt, a Markdown prompt, one chain, one missing-member failure, and one duplicate-name failure.
  - [ ] Keep one editor-cycling case that preserves text before and after the selected prompt without asserting redundant full object arrays.
  - [ ] Keep user-package, trusted project-package, and trusted project-root precedence plus chain follow-up behavior in `pi-prompts/test/integration.test.ts`.
  - [ ] Add a negative case that changes or removes the selected chain segment before submission and verifies that later chain members do not run.
  - [ ] Rename the package script from `test:e2e` to `test:integration` because this suite uses the public extension loader and does not start a Pi process.
  - [ ] Run `npm run check` in `pi-prompts`.

- [ ] Reduce `pi-preload` fixture matrices while retaining preload selection, rendering, limits, and trust boundaries.
  - [ ] Keep preset merging, include and exclude rules, `.gitignore`, generated-file exclusion, text and image ordering, binary rejection, nested project references, cycle rejection, and per-block and total size limits in `pi-preload/test/unit.test.ts`.
  - [ ] Replace the full context failure matrix with one import or execution failure and one render failure that both name the selected context source.
  - [ ] Reduce Dioxus metadata coverage to one selected package and one ambiguous workspace, and keep one template composition case with router, full-stack, and one platform.
  - [ ] Replace repeated full `PRELOAD.md` equality assertions with focused block-order, heading, selected-content, and byte-limit assertions.
  - [ ] Keep both real Pi end-to-end cases for trusted reload deduplication and untrusted project isolation.
  - [ ] Remove unused context fixtures and imports, then run `npm run check` in `pi-preload`.

- [ ] Simplify `pi-tree` tests around path selection, bounded output, trust, and reload behavior.
  - [ ] Keep one representative exclusion for `.gitignore`, bundled `.treeignore`, generated output, lock files, and symlink traversal in `pi-tree/test/unit.test.ts`.
  - [ ] Stop asserting external `tree` branch glyphs and detailed formatting; assert the stable root plus representative included and excluded paths.
  - [ ] Replace the 600-file fixture with fewer longer paths that still exceed the output allocation and verify the 16 KiB bound.
  - [ ] Keep both real Pi end-to-end cases for trusted reload deduplication and untrusted no-output behavior.
  - [ ] Remove unused fixture code and run `npm run check` in `pi-tree`.

- [ ] Consolidate `pi-sync` planning, configuration, inventory, and durable-state tests before transaction tests.
  - [ ] Keep command parsing, fixed footer priority, diff truncation, stale status generation, and one cancellation-settling case in `pi-sync/test/commands.test.ts`.
  - [ ] Keep exact conflict choices, rebuilt-plan identity, and separate merge-workspace behavior while removing redundant internal UI-call assertions from `pi-sync/test/conflicts.test.ts`.
  - [ ] Combine path traversal, collision, symlink, nested repository, exact-byte, canonical settings comparison, and size-limit cases into focused safety tables in `pi-sync/test/files.test.ts`.
  - [ ] Keep the three-way classifier truth table, immutable plan identity, destination validation, mode blockers, and reconcile behavior in `pi-sync/test/plan.test.ts`.
  - [ ] Keep strict settings JSON, pinned shared sources, exact package decisions, and machine-only preservation in `pi-sync/test/settings.test.ts` while removing repeated malformed declarations.
  - [ ] Reduce `pi-sync/test/state.test.ts` to corrupt JSON, unknown schema, one state round trip, one plan round trip, managed scope, and permanent deny rules.

- [ ] Reduce `pi-sync` Git and migration tests to extension-owned command orchestration and one real Git boundary.
  - [ ] Keep exact fetched-commit, one-parent candidate, successful publish, stale publish, valid manifest, and non-destructive invalid-clone behavior in `pi-sync/test/git.test.ts`.
  - [ ] Fold the focused diff assertion into the candidate test and remove the standalone real-Git diff test.
  - [ ] Replace the malicious-hook execution test with captured Git argument checks that require the disabled hook path on every command.
  - [ ] Fold normal fast-forward assertions into the successful publish case and remove the separate publish test fixture.
  - [ ] Replace real Git preparation in `pi-sync/test/migration.test.ts` with deterministic `MigrationExec` responses while retaining valid import and ambiguous-baseline fallback cases.
  - [ ] Remove unused Git global-config, hook-permission, child-process, and bare-repository imports that the reduced tests no longer need.

- [ ] Consolidate `pi-sync` transaction, package, recovery, and security fault tests without removing fail-closed guarantees.
  - [ ] Keep successful transaction order, exclusive locking, immutable-plan revalidation, post-publish restore, and durable-journal behavior in `pi-sync/test/coordinator.test.ts`, but run stale security-field cases from one shared fixture.
  - [ ] Keep exact Pi package commands, exact approval rejection before execution, best-effort removal, cancellation, reverse rollback, and rollback-failure reporting in `pi-sync/test/package-execution.test.ts` while reducing exact journal-array assertions.
  - [ ] Keep verified backup creation, authorization for deletion, backup-before-write, automatic restore, manual recovery paths, and cancellation boundaries in `pi-sync/test/transaction.test.ts`, and share injected failure fixtures where possible.
  - [ ] Keep explicit recovery choices, immutable restore plans, successful verified restore, and stale-plan rejection in `pi-sync/test/recovery.test.ts`.
  - [ ] Keep denied paths, final-tree checks, conflict markers, strict JSON, package policy, machine-only preservation, secret-scanner failure modes, and redacted findings in `pi-sync/test/security.test.ts`.
  - [ ] Run the focused coordinator, package, transaction, recovery, and security tests before the full `pi-sync` suite.

- [ ] Finish the `pi-sync` public integration and test-support cleanup.
  - [ ] Reduce `pi-sync/test/ui.test.ts` to plan and receipt row parity, one or two decision categories, no-UI plan-only behavior, and exact full plan-ID authorization without testing `SelectList` internals.
  - [ ] Keep `pi-sync/test/smoke.test.ts` as the only extension-load integration test and extend it with one deterministic missing-configuration command path that creates no transaction journal.
  - [ ] Keep `pi-sync/test/helpers.ts` only for temporary agent directories and the reduced local Git boundary.
  - [ ] Do not add tests for unwired `src/setup.ts`, scope-approval activation, or backup cleanup; report those as dead or deferred behavior for a separate source task.
  - [ ] Update the explicit unit-test script only for files that are removed or merged and remove only dependencies proven unused after the test changes.
  - [ ] Run `npm run check`, a clean full install, a clean production install, and a production extension-load check in `pi-sync`.

- [ ] Preserve the extension template smoke test and defer the first `pi-steering` suite under repository policy.
  - [ ] Keep `template/test/e2e.test.ts` as the single generated-extension Pi process-boundary test and do not add behavior tests to the empty template extension.
  - [ ] Keep the template test scripts and `copier.yml` skip entry aligned with the retained template test path.
  - [ ] Do not create a `pi-steering` test suite without explicit user approval; record the missing reset and exact ten-tool-call steering case as deferred.
  - [ ] If approval is later given, add one `pi-steering` test that checks reset, no early message, one hidden message at ten completed tool executions, and `deliverAs: "steer"`.

- [ ] Complete cross-repository validation and release only after all targeted test reductions pass.
  - [ ] Run typecheck, Biome, retained unit and integration tests, and package-specific checks in every changed extension.
  - [ ] Run clean full installs, clean production installs, and production extension-load checks without provider credentials for every changed extension.
  - [ ] Verify that removed helpers, scripts, imports, and dependencies are absent and that lockfiles change only when package metadata changes.
  - [ ] Confirm that no README, agent context file, unrelated source behavior, or new test suite changed outside the approved scope.
  - [ ] Commit each changed repository with a minimal accurate message, push each extension repository, and run `pi update --extensions` only after all pushes succeed.
