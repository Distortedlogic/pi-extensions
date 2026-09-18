# Goal

Align all owned custom Pi extensions with the shared package, runtime, configuration, testing, and coding conventions while preserving their intended behavior and avoiding unrelated feature work or npm release work.

## Work units

- [ ] Align pi-preload configuration and package structure
  - [ ] Move the extension entry to `src/index.ts` and use one strict `agents.ts` schema for the top-level `pi-preload` section and preset files.
  - [ ] Load trusted project configuration once during `session_start` and preserve existing preset, context, include, exclude, limit, image, and snapshot behavior.
  - [ ] Update the existing pi-preload tests for the schema, trust boundary, presets, project references, context sources, and production entry path.

- [ ] Align pi-modes configuration and package structure
  - [ ] Move the extension entry to `src/index.ts` and use the strict `agents.ts` schema for every top-level `pi-modes` source.
  - [ ] Preserve configured user-package, trusted project-package, and trusted project-root precedence together with current mode cycling, suffix transformation, widget, and event-bus behavior.
  - [ ] Update the existing pi-modes tests for source precedence, trust, schema validation, entry path, and runtime behavior.

- [ ] Align pi-prompts configuration and resource discovery
  - [ ] Use one strict `agents.ts` schema for required prompts and optional chains, and cache validated top-level `pi-prompts` sources during `session_start`.
  - [ ] Make resource discovery consume the validated cache while preserving prompt-directory loading, duplicate-name rejection, chain-reference validation, editor cycling, and follow-up delivery.
  - [ ] Update the existing pi-prompts tests for package and project precedence, trust, schema validation, prompt directories, chains, and production loading.

- [ ] Finalize the shared authoring and Copier baseline
  - [ ] Generate one deterministic `AGENTS.yml` schema from the shared source and make the schema check part of the meta-package validation.
  - [ ] Update the Copier template to use `src/index.ts`, the current top-level `pi-preload.presets` and `pi-preload.includes` fields, Node `>=22.19.0`, TypeScript 7.0.x, Node 22 type definitions, Biome 2.5.14, Pi `>=0.85.1 <1`, and a generated-project `.gitignore`.
  - [ ] Update the extension-authoring and pi-preload-authoring skills to produce the same package and configuration structure.
  - [ ] Render a new extension from the template and pass its existing typecheck, lint, unit, review, and end-to-end commands.

- [ ] Apply the finalized baseline to the configuration extensions
  - [ ] Apply the final package, TypeScript, test-script, lockfile, and ignore-file baseline to pi-preload without changing its validated preload behavior.
  - [ ] Apply the same baseline to pi-modes without changing its validated mode behavior or adding a new test suite.
  - [ ] Apply the same baseline to pi-prompts without changing its validated prompt and chain behavior.
  - [ ] Run each extension's existing `check` command and credential-free production entry load.

- [ ] Align pi-sync with the shared extension conventions
  - [ ] Move the real extension registration to `src/index.ts`, point the Pi manifest at it, and remove the root forwarding entry.
  - [ ] Replace the existing Vitest runner with `node:test` while preserving unit, security, recovery, transaction, package, and two-machine end-to-end coverage.
  - [ ] Make `test` run unit tests before the two-machine end-to-end test and make `check` run typecheck, lint, and all existing tests.
  - [ ] Apply the shared Node, TypeScript, Pi peer, lockfile, and production-entry conventions without adding setup, scope-expansion, or transaction-resume features.

- [ ] Align pi-env with the shared conventions and active secret model
  - [ ] Move the extension entry to `src/index.ts` and apply the shared package, compiler, lockfile, and test-script structure.
  - [ ] Remove global and project `settings.json.env` loading so `collectEnvironment()` reads only `~/.pi/agent/.env` and a trusted project `.env`.
  - [ ] Apply global dotenv values before project dotenv values while preserving values that already exist in `process.env`.
  - [ ] Update the existing pi-env tests for precedence, trust, cleanup, key-only context, and the production entry path.

- [ ] Align pi-tree and produce a stable project-root tree
  - [ ] Apply the shared package, compiler, lockfile, and test-script conventions while preserving `src/index.ts` as the production entry.
  - [ ] Remove the `tree --fromfile` input-file heading and prefix the rendered tree with `.` before writing `TREE.txt` or injecting context.
  - [ ] Update the existing pi-tree tests to require a stable `.` root, reject temporary path content, and preserve bounded collection behavior.

- [ ] Align pi-steering and use the required exact message
  - [ ] Move the extension entry to `src/index.ts` and update package paths, compiler scope, and the existing empty Node test command to the shared baseline.
  - [ ] Replace `STEERING_MESSAGE` with `are u overcomplicating? overengineering? lost the scope? not idiomatic n native? not following the codebase conventions? deviate from the task list instructions?` and remove the appended sentence.
  - [ ] Keep the current hidden steer delivery, ten-tool-call interval, and counter reset on each user message without adding a test file.

- [ ] Align pi-compress before updating dependent extensions
  - [ ] Apply the shared Node, TypeScript, Node type, Pi peer, lockfile, and production-entry conventions without changing public compression exports or protocol schemas.
  - [ ] Rename `tests/` to `test/`, migrate the existing Vitest suite to `node:test`, and preserve compression, rewrite, branch, crop, panel, and protocol coverage.
  - [ ] Make `check` run typecheck, lint, all existing tests, and the existing Knip validation.
  - [ ] Push the validated pi-compress commit before updating any remote-pinned dependant.

- [ ] Align pi-tasks against the validated pi-compress commit
  - [ ] Update the bundled `pi-compress` Git dependency to the validated remote commit and regenerate the lockfile without permanent legacy peer-dependency settings.
  - [ ] Apply the shared package, compiler, Pi peer, entry, and test-script conventions while preserving task state, replay, file mutation, command, tool, and widget behavior.
  - [ ] Migrate the existing Vitest suite to `node:test`, split unit and end-to-end commands, and make `check` run both.

- [ ] Align pi-workstream against the validated pi-compress commit
  - [ ] Apply the shared package, compiler, Pi peer, lockfile, and test-script conventions.
  - [ ] Point package exports and Pi registration at the real `src/index.ts` entry and update the remote-pinned pi-compress dependency.
  - [ ] Replace the duplicated range-compression path with the public `compressRange` API and remove obsolete compression channels, custom types, and readers.
  - [ ] Replace legacy peer installation with `npm ci`, migrate existing tests to `node:test`, and use a deterministic offline provider for end-to-end coverage.
  - [ ] Make `check` run typecheck, lint, unit, integration, and end-to-end tests.

- [ ] Validate installation from the remote Git repositories
  - [ ] Run each changed repository's typecheck, lint, and existing tests, then run clean full and production-only dependency installs without provider credentials.
  - [ ] Commit and push each changed repository before installation, with pi-compress pushed before pi-tasks and pi-workstream update their pinned commits.
  - [ ] Install each exact Git URL or commit through Pi and verify credential-free production extension loading without local-path installation.
  - [ ] Verify the combined extension set in a clean Pi agent directory with offline startup, trusted project loading, reload, and shutdown.
