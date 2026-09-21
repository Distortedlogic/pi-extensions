# Goal

Rebuild the `pi-tasks` state layer so the Pi session branch is the only durable truth, one versioned `pi-tasks/state` snapshot entry carries all durable task state, and an `easy-peasy` store holds the in-memory projection plus two transient locks. Replace the hand-rolled run protocol with one commit contract, remove the duplicated state copies and the ad hoc identifiers (`planId`, `structuralRevision`, `fileRevision`, `batchId`, `bitmap`, `runStartEntryId`, `compressionOperationId`, `continuationId`), replace the hidden `/tasks __continue` command with an idempotent public `/tasks next`, move all compression concerns into one adapter module, split the large registration function into task-state, run-control, and Pi-integration modules, and update the existing test suites so the package passes typecheck, lint, tests, a clean full install, a clean production install, and the production extension-load check.

## Work units

- [x] Add the versioned durable snapshot schema and replay
  - [x] Add `src/store/schema.ts` with `TASK_STATE_ENTRY = "pi-tasks/state"` and `TaskSnapshotSchema` fields `v`, `commitId`, `reason`, `source`, `goal`, `run`, and `fedWorkUnitIndex`, all objects exact with `additionalProperties: false`.
  - [x] Add `EMPTY_SNAPSHOT` and the `TaskSource`, `TaskRun`, and `TaskSnapshot` types to `src/store/schema.ts`.
  - [x] Add `src/store/replay.ts` with one `replay(branch)` loop that reads only `TASK_STATE_ENTRY`, skips an entry that fails `Value.Check`, keeps the last valid snapshot, and returns `structuredClone`.
  - [x] Add the pure reducer to `src/store/work-unit.ts` with a `Goal | null` input and a `{ goal, changed, op }` result.
  - [ ] Remove the old `TodoState` reducer, `feedEnabled`, `EMPTY_STATE`, and `replayFromBranch` implementation after the runtime and tests use the store.

- [x] Add the easy-peasy store, injections, and commit contract
  - [x] Add `easy-peasy` to `dependencies` in `pi-tasks/package.json` pinned to the exact latest compatible version with no range, then run `npm install` in `pi-tasks`.
  - [x] Add `src/store/index.ts` with the `TaskInjections` interface for `files`, `session`, `compression`, `clock`, and `cwd`, and with `createTaskStore(injections)` that sets `devTools: false` and `name: "pi-tasks"`.
  - [x] Add `src/store/model.ts` state fields `snapshot`, `completionClaimed`, and `stopping`, computed values `workUnits`, `currentWorkUnit`, `progress`, and `completionToolsActive`, and clone any snapshot that leaves the store because Immer freezes state.
  - [x] Add the actions `applySnapshot`, `claimCompletion`, and `setStopping`.
  - [x] Add the shared `commitWorkUnitAction` helper that reads `injections.session.latestSnapshot()`, applies the pure reducer, writes the Markdown file with the revision guard, appends one snapshot, then updates the store.
  - [x] Add the thunks `load`, `startRun`, `completeSubtask`, `completeWorkItem`, `feedNext`, `stopRun`, `clear`, and `finalize`, read then set `completionClaimed` with no `await` between the two lines, and release the claim when a thunk fails.
  - [ ] Add a `dump` thunk that writes through the snapshot commit contract.

- [ ] Split the task-list, prompt, and widget modules
  - [x] Move the Markdown parser into `src/task-list/parse.ts` without behavior change.
  - [x] Move the load, dump, delete, and revision-guard functions into `src/task-list/file.ts` and keep `withFileMutationQueue` and `write-file-atomic`.
  - [x] Add the work-unit prompt text to `src/run/prompt.ts` and keep the `AGENTS.yml` `execute-task` body as its source.
  - [ ] Use `src/run/prompt.ts` from the runtime and remove the duplicate prompt code from `src/index.ts`.
  - [x] Add the widget to `src/ui/widget.ts` with `sanitizeDisplayText` and the 12-line and width limits.
  - [ ] Convert the widget to `TaskSnapshot`, switch the runtime and tests to `src/ui/widget.ts`, and delete `src/task-widget.ts`.

- [ ] Move all compression concerns into one adapter
  - [ ] Add `src/compression.ts` as the only module that imports `pi-compress`.
  - [ ] Read the token threshold from `ctx.getContextUsage()` inside the adapter.
  - [ ] Find the anchor entry from `ctx.sessionManager.getBranch()` as the later of the last `pi-compress` marker and the last snapshot with reason `run` or `feed`.
  - [ ] Build the `BatchSnapshot`, call `compressCompletedBatch`, and return only `skipped`, `compressed`, or `cancelled`.
  - [ ] Replace the current `applied` value in `TaskCompressionOutcome` with the adapter result name `compressed`.

- [ ] Add the completion tools and the public `/tasks` command
  - [ ] Add `src/run/tools.ts` with `complete_subtask` and `complete_work_item`, keep the exact empty typebox parameter objects, and delegate to the store thunks.
  - [ ] Return `terminate: true` from `complete_work_item`, set `details` to `{ commitId }` only, and queue `/tasks next --auto` as a follow-up with `expandPromptTemplates: true`.
  - [ ] Add `src/run/command.ts` with the actions `load`, `run`, `next`, `stop`, `dump`, and `clear`, and parse the `--auto` flag for `next`.
  - [x] Use `fedWorkUnitIndex` in `feedNext` to suppress a repeated feed for the same work unit.
  - [ ] Complete the `feedNext` contract: check `run.status`, return `stopped` when the run is not running, return `already_fed` for an automatic repeat, and re-send the prompt with a `resent` result for a manual repeat.
  - [ ] Keep the existing guard that blocks `load`, `run`, `dump`, and `clear` during an active run or pending messages.

- [ ] Switch the extension registration to the store
  - [ ] Rewrite `src/index.ts` to register the tools, the command, and the events only; the production entry still uses `TodoState`, `ActiveRun`, and the old durable protocol.
  - [ ] Create one session-scoped store on `session_start`, hydrate it from `replay(branch)`, install the `store.subscribe` bridge, and render the widget.
  - [ ] Re-hydrate from `replay(branch)` on `session_tree` with no run guard.
  - [ ] Release `completionClaimed` on `turn_end`, and dispose the bridge and the widget on `session_shutdown`.
  - [ ] Keep `pi.setActiveTools` and `ctx.ui.setWidget` calls only inside the bridge, keyed on `commitId` and `completionToolsActive`.
  - [ ] Delete the legacy state layer: the in-memory `state`, `ActiveRun`, `TodoState`, `TodoStateSchema`, `EMPTY_STATE`, the old reducer and replay function, `TASK_LIST_STATE_ENTRY`, `TASK_RUN_START_ENTRY`, `TaskRunStart`, `TaskToolResultDetails`, `/tasks __continue`, the duplicate prompt code, and every removed identifier.
  - [ ] Retain or relocate only the `Goal`, `WorkUnit`, and subtask domain schemas that the new store modules need.

- [ ] Update the existing test suites
  - [ ] Change `test/state/state-reducer.test.ts` to the `Goal | null` signature and keep the existing cases.
  - [ ] Rewrite `test/state/replay.test.ts` for the one snapshot entry type and keep the skip-corrupt-entry case.
  - [ ] Rewrite `test/todo.command.test.ts` as thunk tests with fake injections, and replace the continuation cases with an `already_fed` case for `--auto` and a `resent` case without it.
  - [ ] Update `test/todo.invalidation.test.ts` to hydrate from the one snapshot entry type.
  - [ ] Delete the run-start, tool-result, batch, and compression builders from `test/helpers.ts`.
  - [ ] Update widget and prompt tests and imports to use `src/ui/widget.ts` and `src/run/prompt.ts`.
  - [ ] Run `npm run check` and fix every typecheck, lint, and test failure.

- [ ] Verify the clean installs and publish the change
  - [ ] Run a clean full install, a clean production install, and the production extension-load check without provider credentials.
  - [ ] Commit the change, push the `pi-tasks` repository, and run `pi update`.
