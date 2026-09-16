# Simple AGENTS.yml Schema Convention

## WU-01: Establish the Extension Definition Convention

- [ ] Refactor `pi-context-preload/agents.ts` so it defines and exports one strict `configurationSchema`, derives and exports its `Configuration` type with `Static<typeof configurationSchema>`, and exports `agentsSection` as `{ "pi-context-preload": Type.Optional(configurationSchema) }` with no schema version, alias, coercion, migration branch, registry adapter, or separate structural type.

- [ ] Refactor `pi-prompts/agents.ts` so it defines strict prompt, prompt-record, and chain-record schemas, defines and exports one strict `configurationSchema` with explicit `prompts` and optional `chains` fields, derives and exports its `Configuration` type with `Static<typeof configurationSchema>`, and exports `agentsSection` as `{ "pi-prompts": Type.Optional(configurationSchema) }` with no reserved key inside the prompt record and no compatibility shape.

- [ ] Update both extension package manifests and TypeScript configurations to ship and check the conventional top-level `agents.ts` file, remove any package `exports` map or `./agents` subpath declaration added for this work, declare only the TypeBox dependency needed to import the shipped definition file, and update each affected lockfile without changing unrelated package metadata.

## WU-02: Use the Definition in pi-context-preload

- [ ] Change `pi-context-preload` to import `configurationSchema` and `Configuration` from its local `agents.ts`, remove the separately maintained `PRELOAD_CONFIG` schema and structural configuration type, and continue to keep only semantic checks that protect preset cycles, absolute preset patterns, and context source names.

- [ ] During every `session_start`, have `pi-context-preload` skip project configuration when `ctx.isProjectTrusted()` is false, read `<cwd>/AGENTS.yml` once when trusted, select only `pi.extensions.pi-context-preload`, treat a missing file or missing owned section as no configuration, validate the selected value with the shared schema, and replace the in-memory `Configuration` before later work uses it.

- [ ] Change preload collection to accept the validated in-memory configuration instead of reading the old top-level `preload` field, keep preset files on the same `configurationSchema`, report malformed YAML and invalid owned values with the source path and full `pi.extensions.pi-context-preload` path, and delete every old-field fallback, warning, or migration branch.

- [ ] Update the existing `pi-context-preload` unit and end-to-end tests to cover absent configuration, an untrusted project, a valid owned section, malformed YAML, invalid values, unknown fields, preset inheritance, and actual preload use of the validated session value without adding a new test suite.

## WU-03: Use the Definition in pi-prompts

- [ ] Change `pi-prompts` to import `configurationSchema` and `Configuration` from its local `agents.ts`, parse YAML into normal JavaScript objects, remove the hand-written structural checks for prompt fields, chain fields, primitive types, and unknown fields, and retain only the semantic check that every chain member names a prompt declared in the same source.

- [ ] During every `session_start`, have `pi-prompts` discover its package and project `AGENTS.yml` sources, exclude the project source when `ctx.isProjectTrusted()` is false, select only `pi.extensions.pi-prompts` from each source, treat a missing owned section as no configuration, validate each selected value with the shared schema, reject duplicate prompt names across sources, and replace the cached validated source list before `resources_discover` runs.

- [ ] Change `resources_discover` to generate native prompt files only from the cached validated source list, preserve source and prompt declaration order, report malformed YAML and invalid owned values with the source path and full `pi.extensions.pi-prompts` path, and delete every read or compatibility path for the old top-level `prompts` field.

- [ ] Update the existing `pi-prompts` unit and end-to-end tests to cover absent configuration, an untrusted project, valid owned prompts and chains, malformed YAML, invalid values, unknown fields, undeclared chain members, duplicate names, and runtime prompt generation from the validated session value without adding a new test suite.

## WU-04: Merge the Definition Files Directly

- [ ] Add one root `src/agents.ts` that directly imports `agentsSection` from `pi-context-preload/agents.ts` and `pi-prompts/agents.ts`, creates the strict `pi.extensions` object by spreading those two objects in package-name order, rejects unknown fields inside `pi` and unknown package keys inside `pi.extensions`, allows unrelated top-level `AGENTS.yml` fields, and contains no registry, duplicate-key detector, discovery loop, reducer, adapter, or generic schema-composition layer.

- [ ] Add exact root package dependencies for the two extension packages, TypeBox, and YAML parsing, make the direct conventional `agents.ts` imports resolve in a clean install, update the root lockfile, and do not add public schema exports to either extension package.

- [ ] Add one root `scripts/agents-schema.ts` that imports only the merged `agentsSchema`, serializes it deterministically with the JSON Schema dialect and one final newline, writes `schema/AGENTS.schema.json` in generate mode, compares that exact output and validates specified YAML files in check mode, and reports file-scoped schema errors without rebuilding any extension schema.

- [ ] Add minimal `agents:generate` and `agents:check` package scripts that call the same `scripts/agents-schema.ts`, pass the managed root and template files to check mode, and add `agents:check` once at the end of the existing root `check` command.

## WU-05: Migrate Managed Configuration

- [ ] Move the root and template preload values to `pi.extensions.pi-context-preload`, move prompt entries to `pi.extensions.pi-prompts.prompts`, move prompt chains to `pi.extensions.pi-prompts.chains`, preserve unrelated top-level `AGENTS.yml` fields, and make the same direct structural edit in every tracked package, preset, fixture, inline YAML sample, and configuration example used by these extensions.

- [ ] Regenerate `schema/AGENTS.schema.json` from the merged root schema, validate every managed complete `AGENTS.yml` file, and confirm by an exact tracked-source search that no old top-level `preload` or `prompts` configuration, temporary migration command, schema adapter, registry, alias, or fallback reader remains.

## WU-06: Verify and Commit the Complete Change

- [ ] Run the existing typecheck, Biome, unit, and end-to-end checks in `pi-context-preload` and `pi-prompts`, run the root typecheck and existing checks, run root schema generation and drift validation, and fix all failures without weakening schemas or tests.

- [ ] For both extension packages and the root package, complete a clean full install and a clean production-only install, confirm each shipped `agents.ts` file imports by its conventional package file path without importing the extension entry point, and confirm each production extension entry point loads without provider credentials.

- [ ] Commit only the scoped files in each affected repository with minimal accurate messages, leave unrelated deleted or untracked files untouched, and do not install or activate the changed packages until all commits and final clean checks succeed.
