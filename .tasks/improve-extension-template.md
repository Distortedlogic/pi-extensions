# Goal

Update the Pi extension Copier template so generated projects omit the project-description input, use an empty package description, install the common Pi-provided dependencies with exact development versions, create the required lockfile and ignore rules, install reliable official pre-commit and pre-push hooks, and verify a production-only Pi load without provider credentials, without editing README or agent-context files.

## Work units

- [ ] Simplify Copier inputs and generated project files.
  - [ ] Remove `project_description` from `copier.yml` and set `description` to an empty string in `template/package.json.jinja`.
  - [ ] Declare the minimum Copier version required by the template.
  - [ ] Add `template/.gitignore` entries for `.env`, `node_modules`, package archives, coverage output, `PRELOAD.md`, and `TREE.txt`.

- [ ] Normalize the generated package and tool configuration.
  - [ ] Query the package registries and pin exact latest mutually compatible development versions for Biome, TypeScript, Node 22 types, `@earendil-works/pi-coding-agent`, `@earendil-works/pi-ai`, and `typebox`.
  - [ ] Keep `@earendil-works/pi-coding-agent`, `@earendil-works/pi-ai`, and `typebox` as `"*"` peer dependencies and add their exact development copies.
  - [ ] Remove `minimatch` and `yaml`, and do not add `@earendil-works/pi-tui` while generated source does not import it.
  - [ ] Synchronize the Biome schema with the pinned Biome version and add a format script that uses the local binary.
  - [ ] Add `isolatedModules` and `verbatimModuleSyntax` to `template/tsconfig.json`, and remove global Biome rule exceptions that the scaffold does not require.

- [ ] Replace the source-only load test with production package validation.
  - [ ] Restrict the child-process environment in `template/test/e2e.test.ts` to required system values and omit all provider credentials.
  - [ ] Pack the generated package into a temporary directory, install it with development dependencies omitted, and load the installed package directory through Pi so the `pi.extensions` manifest path is exercised.
  - [ ] Fail the test on package installation errors, extension load errors, manifest errors, or startup dependence on provider credentials.
  - [ ] Remove `test/e2e.test.ts` from `_skip_if_exists` so Copier can apply invariant load-test updates.

- [ ] Add the official pre-commit and pre-push workflow.
  - [ ] Add `template/.pre-commit-config.yaml` with local hooks that run the pinned Biome binary on supported changed files during pre-commit and run `npm run check` during pre-push.
  - [ ] Update Copier tasks to run `npm install` first so exact dependencies and `package-lock.json` exist before hooks run.
  - [ ] Make Copier report a clear error when the official `pre-commit` command is unavailable.
  - [ ] Install both hook types and their hook environments after dependency installation.
