# Goal

Rebuild the `pi-tasks` state layer so the Pi session branch is the only durable truth, one versioned `pi-tasks/state` snapshot entry carries all durable task state, and an `easy-peasy` store holds the in-memory projection plus two transient locks. Replace the hand-rolled run protocol with one commit contract, remove the duplicated state copies and the ad hoc identifiers (`planId`, `structuralRevision`, `fileRevision`, `batchId`, `bitmap`, `runStartEntryId`, `compressionOperationId`, `continuationId`), replace the hidden `/tasks __continue` command with an idempotent public `/tasks next`, move all compression concerns into one adapter module, split the large registration function into task-state, run-control, and Pi-integration modules, and update the existing test suites so the package passes typecheck, lint, tests, a clean production install, and the production extension-load check.

## Work units

- [ ] Pin easy-peasy and clear its integration gates
  - [ ] Run `npm view easy-peasy version peerDependencies peerDependenciesMeta` and pin that exact version in `dependencies` in `pi-tasks/package.json` with no range.
  - [ ] If `react` is a required peer, add `react` as an explicit pinned dependency; do not use `legacy-peer-deps` and do not use `npm audit fix --force`.
  - [ ] Add a temporary probe module that imports only `createStore`, `action`, `thunk`, and `computed` and calls `createStore(model, { devTools: false })`, then confirm the named imports resolve under `NodeNext` with `verbatimModuleSyntax` through `npm run typecheck`.
  - [ ] Run `npm test` and confirm `test/e2e.test.ts` still loads the production package without provider credentials, then delete the probe module.

- [ ] Add the versioned durable snapshot schema and replay
  - [ ] Add `src/store/schema.ts` with `TASK_STATE_ENTRY = "pi-tasks/state"` and `TaskSnapshotSchema` fields `v`, `commitId`, `reason`, `source`, `goal`, `run`, and `fedWorkUnitIndex`, all objects exact with `additionalProperties: false`.
  - [ ] Add `EMPTY_SNAPSHOT` and the `TaskSource`, `TaskRun`, and `TaskSnapshot` types to `src/store/schema.ts`.
  - [ ] Add `src/store/replay.ts` with one `replay(branch)` loop that reads only `TASK_STATE_ENTRY`, skips an entry that fails `Value.Check`, keeps the last valid snapshot, and returns `structuredClone`.
  - [ ] Move the pure reducer to `src/store/work-unit.ts` and change its signature to take `Goal | null` and return `{ goal, changed, op }`, with `feedEnabled` replaced by `run.status`.

- [ ] Add the easy-peasy store, injections, and commit contract
  - [ ] Add `src/store/index.ts` with the `TaskInjections` interface for `files`, `session`, `compression`, `clock`, and `cwd`, and with `createTaskStore(injections)` that sets `devTools: false` and `name: "pi-tasks"`.
  - [ ] Add `src/store/model.ts` state fields `snapshot`, `completionClaimed`, and `stopping`, and computed values `workUnits`, `currentWorkUnit`, `progress`, and `completionToolsActive`.
  - [ ] Add the actions `applySnapshot`, `claimCompletion`, and `setStopping`.
  - [ ] Add the shared `commitWorkUnitAction` helper that reads `injections.session.latestSnapshot()`, applies the pure reducer, writes the Markdown file with the revision guard, appends one snapshot, then updates the store.
  - [ ] Add the thunks `load`, `startRun`, `completeSubtask`, `completeWorkItem`, `feedNext`, `stopRun`, `clear`, and `finalize`, and read then set `completionClaimed` with no `await` between the two lines.
  - [ ] Call `structuredClone` on every snapshot that leaves the store, because Immer freezes state.

- [ ] Split the task-list, prompt, and widget modules
  - [ ] Move the Markdown parser into `src/task-list/parse.ts` without behavior change.
  - [ ] Move the load, dump, delete, and revision-guard functions into `src/task-list/file.ts` and keep `withFileMutationQueue` and `write-file-atomic`.
  - [ ] Move the work-unit prompt text into `src/run/prompt.ts` and keep the `AGENTS.yml` `execute-task` body as its source.
  - [ ] Move the widget into `src/ui/widget.ts` and keep `sanitizeDisplayText` and the 12-line and width limits.

- [ ] Move all compression concerns into one adapter
  - [ ] Add `src/compression.ts` as the only module that imports `pi-compress`.
  - [ ] Read the token threshold from `ctx.getContextUsage()` inside the adapter.
  - [ ] Find the anchor entry from `ctx.sessionManager.getBranch()` as the later of the last `pi-compress` marker and the last snapshot with reason `run` or `feed`.
  - [ ] Build the `BatchSnapshot`, call `compressCompletedBatch`, and return only `skipped`, `compressed`, or `cancelled`.

- [ ] Add the completion tools and the public `/tasks` command
  - [ ] Add `src/run/tools.ts` with `complete_subtask` and `complete_work_item`, keep the exact empty typebox parameter objects, and delegate to the store thunks.
  - [ ] Return `terminate: true` from `complete_work_item`, set `details` to `{ commitId }` only, and queue `/tasks next --auto` as a follow-up with `expandPromptTemplates: true`.
  - [ ] Add `src/run/command.ts` with the actions `load`, `run`, `next`, `stop`, `dump`, and `clear`, and parse the `--auto` flag for `next`.
  - [ ] Make `feedNext` idempotent: return `stopped` when the run is not running, return `already_fed` for an automatic repeat, and re-send the prompt for a manual repeat.
  - [ ] Keep the existing guard that blocks `load`, `run`, `dump`, and `clear` during an active run or pending messages.

- [ ] Switch the extension to the store on one flag day
  - [ ] Rewrite `src/index.ts` to register the tools, the command, and the events only.
  - [ ] Create one session-scoped store on `session_start`, hydrate it from `replay(branch)`, install the `store.subscribe` bridge, and render the widget.
  - [ ] Re-hydrate from `replay(branch)` on `session_tree` with no run guard.
  - [ ] Release `completionClaimed` on `turn_end` and dispose the bridge and widget on `session_shutdown`.
  - [ ] Keep `pi.setActiveTools` and `ctx.ui.setWidget` calls only inside the bridge, keyed on `commitId` and `completionToolsActive`.
  - [ ] Delete the in-memory `state` and `ActiveRun` records, `TASK_LIST_STATE_ENTRY`, `TASK_RUN_START_ENTRY`, `TaskRunStart`, `TaskToolResultDetails`, `/tasks __continue`, and every removed identifier.

- [ ] Update the existing test suites
  - [ ] Change `test/state/state-reducer.test.ts` to the `Goal | null` signature and keep the existing cases.
  - [ ] Rewrite `test/state/replay.test.ts` for the one snapshot entry type and keep the skip-corrupt-entry case.
  - [ ] Rewrite `test/todo.command.test.ts` as thunk tests with fake injections, and replace the continuation cases with an `already_fed` case for `--auto` and a `resent` case without it.
  - [ ] Update `test/todo.invalidation.test.ts` to hydrate from the one snapshot entry type.
  - [ ] Delete the run-start, tool-result, batch, and compression builders from `test/helpers.ts`.
  - [ ] Run `npm run check` and fix every typecheck, lint, and test failure.

- [ ] Verify the release and publish the change
  - [ ] Add the migration note to `pi-tasks/README.md` that a session started before this change needs `/tasks load` again.
  - [ ] Run a clean full install, a clean production install, and the production extension-load check without provider credentials.
  - [ ] Commit, push the `pi-tasks` repository, and run `pi update`.
  - [ ] Open a follow-up note for `pi-compress` to accept a simpler settled-batch input so `src/compression.ts` shrinks.
