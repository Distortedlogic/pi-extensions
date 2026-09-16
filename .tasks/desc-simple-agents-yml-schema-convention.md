# Simple AGENTS.yml Schema Convention

## WU-01: Define the Extension Schemas

- [ ] Refactor `pi-context-preload/agents.ts` to export one strict `configurationSchema` for `extends`, `files`, and `contexts`, export `type Configuration = Static<typeof configurationSchema>`, and export `agentsSection` as `{ "pi-context-preload": Type.Optional(configurationSchema) }`.

- [ ] Refactor `pi-prompts/agents.ts` to export one strict `configurationSchema` with a required `prompts` record of strict `{ description?, body }` objects and an optional `chains` record of non-empty prompt-name arrays, export `type Configuration = Static<typeof configurationSchema>`, and export `agentsSection` as `{ "pi-prompts": Type.Optional(configurationSchema) }`.

- [ ] Update both extension packages to include top-level `agents.ts` in their published files and TypeScript checks, remove package `exports` maps added for schema access, declare the TypeBox dependency required by each package, and update affected lockfiles.

## WU-02: Use the Schemas in the Extensions

- [ ] Change `pi-context-preload` to import its local `configurationSchema` and `Configuration`, load only `pi.extensions.pi-context-preload` from trusted project `AGENTS.yml` during `session_start`, cache the validated value for preload collection, use the same schema for presets, remove the old top-level `preload` reader and duplicate structural schema, and include the source path and owned section path in parse and validation errors.

- [ ] Change `pi-prompts` to import its local `configurationSchema` and `Configuration`, discover package and trusted project `AGENTS.yml` sources during `session_start`, load only `pi.extensions.pi-prompts`, cache validated sources for `resources_discover`, retain chain-reference and duplicate-prompt semantic checks, remove the old top-level `prompts` reader and hand-written structural validation, and include the source path and owned section path in parse and validation errors.

- [ ] Update the existing `pi-context-preload` tests to cover missing configuration, untrusted projects, valid configuration, malformed YAML, invalid values, unknown fields, preset inheritance, and preload collection from the cached validated configuration.

- [ ] Update the existing `pi-prompts` tests to cover missing configuration, untrusted projects, valid prompts and chains, malformed YAML, invalid values, unknown fields, undeclared chain members, duplicate prompt names, and prompt generation from cached validated sources.

## WU-03: Merge and Generate the Root Schema

- [ ] Add root `src/agents.ts` that imports `agentsSection` from `pi-context-preload/agents.ts` and `pi-prompts/agents.ts`, spreads both objects into a strict `pi.extensions` object, rejects unknown fields inside `pi`, allows unrelated top-level fields, and exports the complete `agentsSchema`.

- [ ] Add exact root dependencies for both extension packages, TypeBox, and YAML parsing, then update the root lockfile so the conventional package-file imports resolve after a clean install.

- [ ] Add `scripts/agents-schema.ts` that imports `agentsSchema`, writes deterministic JSON Schema with the dialect and one final newline when called with `--write`, and otherwise compares the generated text with `schema/AGENTS.schema.json` and validates each positional YAML path with file-scoped errors.

- [ ] Add `agents:generate` and `agents:check` package scripts for `scripts/agents-schema.ts`, pass the root and template `AGENTS.yml` files to `agents:check`, and run `agents:check` at the end of the root `check` script.

## WU-04: Migrate Configuration

- [ ] Move every tracked preload configuration to `pi.extensions.pi-context-preload`, move every tracked prompt map to `pi.extensions.pi-prompts.prompts`, move each prompt chain map to `pi.extensions.pi-prompts.chains`, and update existing fixtures, inline YAML, presets, templates, package `AGENTS.yml` files, extension READMEs, and `skills/context-preload-authoring/SKILL.md` to the same structure.

- [ ] Generate `schema/AGENTS.schema.json` from `agentsSchema` and remove all remaining reads and tracked configuration uses of the old top-level `preload` and `prompts` fields.

## WU-05: Verify the Result

- [ ] Run the existing typecheck, Biome, unit, and end-to-end checks in `pi-context-preload` and `pi-prompts`, then run the root `check` command and correct every failure.

- [ ] Run clean full and production-only installs for both extensions and the root package, verify that each packaged `agents.ts` imports through its conventional package-file path, and verify that both production extension entry points load without provider credentials.

## WU-06: Cut Over the Active Installation

- [ ] Commit and push the verified `pi-context-preload` and `pi-prompts` changes before updating the root package dependencies, replace the root dependency references with the pushed commits, update the root lockfile, regenerate `schema/AGENTS.schema.json`, rerun the root checks, and commit and push the root package.

- [ ] Before installing the changed packages, migrate every active tracked project `AGENTS.yml` that still uses top-level `preload` or `prompts`, validate each migrated file with `agents:check`, and leave unrelated top-level configuration unchanged.

- [ ] Install or update `pi-context-preload`, `pi-prompts`, and the root package from their pushed remotes, restart Pi, start a fresh trusted session, and verify that context preload, prompt discovery, and prompt chains use the namespaced configuration while an untrusted project does not load project-owned configuration.
