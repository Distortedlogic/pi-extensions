# AGENTS.yml Schema Ownership

## WU-01: Define Each Extension-Owned Contract

- [ ] Add `pi-context-preload/agents.ts` and export an `agentsSection` object whose key is `pi-context-preload`, whose value is the strict TypeBox schema for that extension configuration, and whose TypeScript configuration type is derived with `Static<typeof agentsSection.schema>`.
- [ ] Add `pi-prompts/agents.ts` and export an `agentsSection` object whose key is `pi-prompts`, whose value is the strict TypeBox schema for that extension configuration, and whose TypeScript configuration type is derived with `Static<typeof agentsSection.schema>`.
- [ ] Set `additionalProperties: false` on both extension schemas and represent every supported field directly without schema versions, old field aliases, compatibility unions, coercion, or migration branches.
- [ ] Export each `agentsSection` through the package `./agents` subpath, include `agents.ts` in the package files, include it in TypeScript checks, and make the export importable without executing the extension factory.
- [ ] Remove each separately maintained configuration interface or structural validator after its extension code imports the type and schema from `agents.ts`.

## WU-02: Use the Contracts in Extension Runtime Code

- [ ] Change `pi-context-preload` to read only `pi.extensions.pi-context-preload` from `<cwd>/AGENTS.yml`, skip project configuration when `ctx.isProjectTrusted()` is false, validate the selected value with the compiled exported schema, and pass only the validated inferred type to preload logic.
- [ ] Change `pi-prompts` to read only `pi.extensions.pi-prompts` from `<cwd>/AGENTS.yml`, skip project configuration when `ctx.isProjectTrusted()` is false, validate the selected value with the compiled exported schema, and pass only the validated inferred type to prompt logic.
- [ ] Treat a missing file or missing owned section as no extension configuration, reject malformed YAML and invalid owned values with the source file and full section path, and do not read another extension's section.
- [ ] Load each section during `session_start` so startup, reload, new session, resume, and fork replace the in-memory value before later resource and agent hooks use it.
- [ ] Delete every read of the old top-level `preload` and `prompts` fields and delete every fallback, warning, migration, or compatibility path for those fields.
- [ ] Update the existing `pi-context-preload` and `pi-prompts` tests to cover absent configuration, untrusted projects, valid owned sections, invalid owned sections, unknown owned fields, and runtime use of the validated value.

## WU-03: Generate the Meta Schema from Extension Contracts

- [ ] Add a root `src/agents-registry.ts` that imports only `pi-context-preload/agents` and `pi-prompts/agents`, exports those two contracts in package-name order, and rejects duplicate contract keys before schema composition.
- [ ] Add a root schema composer that creates an object with optional `pi.extensions.pi-context-preload` and `pi.extensions.pi-prompts` properties, rejects unknown fields inside `pi`, rejects unknown package keys inside `pi.extensions`, and allows unrelated top-level `AGENTS.yml` fields.
- [ ] Add `scripts/generate-agents-schema.ts` to serialize the composed TypeBox schema deterministically to `schema/AGENTS.schema.json` with the JSON Schema dialect declaration and one final newline.
- [ ] Add an `agents:generate` package script that updates `schema/AGENTS.schema.json` and an `agents:check` package script that exits nonzero when fresh generated output differs from the committed file.
- [ ] Add `scripts/validate-agents.ts` and an `agents:validate` package script that parse specified `AGENTS.yml` files with the `yaml` package, validate the complete `pi.extensions` value against the composed schema, print all file-scoped validation errors, and exit nonzero on failure.
- [ ] Add exact root package dependencies for the two extension packages and the schema-generation dependencies, commit the resulting `package-lock.json`, and import schemas only through the stable package exports.

## WU-04: Migrate Every Managed Configuration

- [ ] Move the root `AGENTS.yml` `preload` value to `pi.extensions.pi-context-preload` and move its `prompts` value to `pi.extensions.pi-prompts` in the same edit.
- [ ] Apply the same field moves to `template/AGENTS.yml` and every tracked preset or complete `AGENTS.yml` under `pi-context-preload` and `pi-prompts`.
- [ ] Replace the old top-level fields in all existing test fixtures, inline YAML strings, expected parsed objects, and configuration examples in both extension repositories and the meta repository.
- [ ] Update every tracked active `AGENTS.yml` that will run with the changed extensions before activating the changed meta package.
- [ ] Regenerate `schema/AGENTS.schema.json` after all contracts and managed configuration files use the final structure.
- [ ] Remove any temporary edit command used for the field move and confirm that no tracked source, fixture, preset, template, or configuration file still uses the old top-level extension fields.

## WU-05: Integrate and Verify the Synchronized Result

- [ ] Add the generated-schema drift check and managed-file validation command to the root `check` script after type checking, Biome, and existing tests.
- [ ] Run the existing checks in `pi-context-preload` and `pi-prompts`, then run the root schema generation, drift check, and validation against the root and template `AGENTS.yml` files.
- [ ] Run clean full and production-only installs for `pi-context-preload`, `pi-prompts`, and the meta package, and confirm that each `./agents` export and each extension entry point loads without provider credentials.
- [ ] Commit the final extension package references, root lockfile, registry, generated schema, migrated configuration files, and runtime changes before installing the new meta package or reloading Pi.
