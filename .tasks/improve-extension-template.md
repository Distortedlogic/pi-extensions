# Goal

Update the Pi extension Copier scaffold and its authoring checks so generated projects omit the project-description input, use an empty package description, include the common Pi-provided dependency set with exact development pins, create a safe lockfile and Git ignore policy, install a complete official pre-commit and pre-push workflow, and prove clean production loading without provider credentials, while leaving README and agent-context files unchanged.

## Work units

- [ ] Simplify Copier inputs and generated project metadata.
  - [ ] Remove `project_description` from `copier.yml` and set `description` to an empty string in `template/package.json.jinja`.
  - [ ] Add a minimum supported Copier version for the template features in use.
  - [ ] Add `template/.gitignore` entries for `.env`, `node_modules`, package archives, coverage output, `PRELOAD.md`, and `TREE.txt`.
  - [ ] Verify that this work does not modify `README.md.jinja`, `AGENTS.yml`, or other agent-context files.

- [ ] Normalize the generated package dependency model.
  - [ ] Query the package registries during implementation and select exact latest compatible development versions instead of copying remembered versions.
  - [ ] Keep `@earendil-works/pi-coding-agent`, `@earendil-works/pi-ai`, and `typebox` as `"*"` peer dependencies supplied by Pi.
  - [ ] Add exact development copies of the Pi peers needed for local type checking and tests.
  - [ ] Remove default `minimatch` and `yaml` development dependencies, and leave `@earendil-works/pi-tui` out until generated source imports it.
  - [ ] Pin Biome, TypeScript, and the Node 22 type definitions exactly, and keep the Biome schema version synchronized with the selected Biome version.

- [ ] Strengthen the generated TypeScript and Biome baseline.
  - [ ] Add `isolatedModules` and `verbatimModuleSyntax` to `template/tsconfig.json` for native TypeScript ESM execution.
  - [ ] Add a generated-project format script that uses the pinned local Biome binary.
  - [ ] Remove blanket Biome rule exceptions that the empty scaffold does not need, and use narrow exceptions only when generated code requires them.

- [ ] Implement a complete official pre-commit workflow.
  - [ ] Add `template/.pre-commit-config.yaml` with a minimum pre-commit version and both `pre-commit` and `pre-push` hook types.
  - [ ] Configure the pre-commit stage to run the local pinned Biome command only on supported changed files.
  - [ ] Configure the pre-push stage to run the generated package check and production verification commands without accepting filenames.
  - [ ] Order Copier tasks so npm installs the exact dependencies and creates `package-lock.json` before hook installation.
  - [ ] Make Copier fail with a clear prerequisite error when the official `pre-commit` command is unavailable, then install both hook types with their hook environments.

- [ ] Harden the existing generated extension load tests.
  - [ ] Replace the inherited child-process environment in `template/test/e2e.test.ts` with an allowlist that excludes provider credentials.
  - [ ] Keep a fast direct source-load assertion for extension syntax and factory failures.
  - [ ] Add package-level coverage that validates the generated `pi.extensions` manifest path after a clean production install.
  - [ ] Move the template-owned invariant load test out of permanent `_skip_if_exists` handling so Copier updates can deliver test-harness fixes without replacing project-specific tests.

- [ ] Add reproducible production verification without slowing each commit.
  - [ ] Add one generated verification command that creates isolated temporary installs instead of changing the working `node_modules` directory.
  - [ ] Verify a clean full install from `package-lock.json` in one temporary project copy.
  - [ ] Verify a separate `npm ci --omit=dev` install and load the extension through Pi without provider credentials.
  - [ ] Keep the clean-install verification on pre-push and final validation, while keeping the pre-commit stage limited to fast file checks.
  - [ ] Use `npm pack --dry-run` only when validating an npm artifact rather than requiring it for Git-only installation.

- [ ] Extend the meta-package checks without adding a new test suite.
  - [ ] Add exact root development tools and root scripts to type-check and lint `agents.ts` and `scripts/generate-agents-schema.ts`.
  - [ ] Extend the existing root `check` command to run schema verification, root type checking, root linting, and a Copier render validation command.
  - [ ] Render a temporary project with Copier, parse its generated `package.json`, confirm that no description answer is requested, and run the generated project checks.

- [ ] Validate and deliver the implementation.
  - [ ] Run the root schema, type, lint, and Copier render checks.
  - [ ] Generate a temporary extension and run clean full-install, clean production-install, credential-free package-load, pre-commit, and pre-push checks.
  - [ ] Confirm that README and agent-context files are unchanged and that only the planned scaffold and verification files changed.
  - [ ] Commit with a minimal accurate message, push the repository, and run `pi update` for the changed extension package.
