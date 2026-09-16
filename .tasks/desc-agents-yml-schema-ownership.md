# AGENTS.yml Schema Ownership

## WU-01: Fix the Contract and Ownership Rules

- [ ] Adopt `pi.extensions.<package-name>` as the only custom-extension configuration location in `AGENTS.yml`, require the section key to equal the extension package name, and allow unrelated top-level `AGENTS.yml` fields.
- [ ] Define the extension contract as one exported object containing only the package key and one TypeBox schema, derive its TypeScript type with `Static`, and prohibit separately maintained interfaces or JSON Schema fragments.
- [ ] Require `additionalProperties: false` for the `pi` object, the `pi.extensions` object, and each owned extension section while keeping every registered extension section optional.
- [ ] Define missing `AGENTS.yml`, missing `pi`, missing `pi.extensions`, and a missing owned section as valid absence, and require each extension to use its normal built-in behavior for that absence.
- [ ] Prohibit schema-version fields, legacy aliases, compatibility unions, fallback readers, coercion, runtime migrations, and retained migration commands in all schema and runtime code.
- [ ] Update the root agent context with the final ownership, single-source, strict-validation, and coordinated-change rules without adding implementation history.

## WU-02: Inventory Every Owner and Use

- [ ] Find every extension repository that reads or writes `AGENTS.yml`, record its package name, current owned fields, parser, validator, runtime consumers, fixtures, presets, and generated files, and exclude extensions that do not own configuration.
- [ ] Find every managed `AGENTS.yml`, template, preset, inline YAML fixture, and configuration example under the umbrella checkout and in the tracked active configuration repositories.
- [ ] Map every current extension field to its final `pi.extensions.<package-name>` location and resolve all name collisions before source changes start.
- [ ] Identify every manual configuration interface, parser branch, default object, field guard, and validation function that the TypeBox contract will replace.
- [ ] Produce the explicit ordered list of configuration-owning packages that the meta repository will import, validate, package, and release together.

## WU-03: Implement the Root-Owned Schema Library

- [ ] Add a leaf package in this repository for the shared AGENTS schema contract, YAML document loading, owned-section extraction, TypeBox validation, aggregate schema composition, and structured errors, with no dependency on an individual extension or the meta extension.
- [ ] Implement `defineAgentsSection()` so it accepts one package key and one TypeBox object schema, validates the `pi-*` package-key convention, freezes the returned contract, and adds no version, migration, default-merging, or compatibility behavior.
- [ ] Implement YAML loading with the `yaml` package so it reads only `<cwd>/AGENTS.yml`, skips untrusted project files, treats a missing file as absence, rejects malformed documents and duplicate keys, and reports the source path.
- [ ] Implement owned-section extraction so it checks the `pi` and `pi.extensions` container shapes, selects only the requested package key, returns absence when the section is missing, and never reads another extension section.
- [ ] Compile each TypeBox section schema once, validate without mutation or coercion, and report every failure with the complete `pi.extensions.<package-name>` path.
- [ ] Implement aggregate schema composition so it sorts contracts by package key, rejects duplicate keys, installs every known section as an optional property, rejects unknown extension names, rejects unknown fields in the owned namespace, and permits unrelated root fields.
- [ ] Export only the contract, document loader, section loader, validator error, and schema composer APIs needed by extension and meta code.
- [ ] Put `yaml` in the schema package runtime dependencies, put Pi-provided `typebox` in peer dependencies, put development tools in dev dependencies, and commit a reproducible lockfile.

## WU-04: Convert Each Configuration-Owning Extension

- [ ] Add an `agents.ts` public module to every configuration-owning extension and make that module the only location for its section key, TypeBox schema, and `Static` configuration type.
- [ ] Export each contract through the stable `./agents` package subpath, include the module in the published files, and ensure importing the contract does not execute the extension factory or register Pi resources.
- [ ] Replace each extension's direct YAML traversal and manual structural validation with the shared section loader and its own exported contract.
- [ ] Load the owned section during `session_start` with `ctx.cwd` and `ctx.isProjectTrusted()`, replace in-memory configuration on every startup, reload, new session, resume, and fork, and keep no watcher or stale session state.
- [ ] Make invalid owned configuration disable the affected extension behavior and produce one exact error instead of silently using defaults, partial values, or old fields.
- [ ] Make all tools, commands, resource hooks, and event handlers consume only the validated inferred configuration type and fail clearly if configuration loading failed.
- [ ] Remove every replaced interface, duplicate schema, manual type guard, old top-level field lookup, compatibility branch, normalization path, and migration helper from each extension.
- [ ] Remove direct YAML dependencies from extensions that no longer use them, add the shared schema package as a runtime dependency, keep Pi-provided modules as peers, and update each lockfile.
- [ ] Convert `pi-context-preload` from its current top-level configuration to the `pi.extensions.pi-context-preload` contract and route preload collection through the validated section.
- [ ] Convert `pi-prompts` from its current top-level configuration to the `pi.extensions.pi-prompts` contract and route prompt discovery and chain setup through the validated section.
- [ ] Convert every additional owner found during inventory with the same contract, export, lifecycle, strictness, and deletion rules before any coordinated release.

## WU-05: Build the Meta Registry and Combined Schema

- [ ] Add exact package dependencies for every configuration-owning extension to the meta package, pin the supported source set in `package-lock.json`, and avoid floating branches or broad ranges for the coordinated package.
- [ ] Add one explicit registry module that imports each package's `./agents` export and contains no copied schema fields or dynamically discovered source paths.
- [ ] Validate registry construction by rejecting duplicate section keys, keys that differ from package names, non-object section schemas, and registry entries without matching package dependencies.
- [ ] Compose the current complete schema directly from the registry and emit `schema/AGENTS.schema.json` with deterministic key order, stable formatting, one final newline, and only the JSON Schema dialect declaration required by validators.
- [ ] Add an `agents:generate` command that writes the generated schema and an `agents:check` command that fails when the committed schema differs from fresh output.
- [ ] Add an `agents:validate` command that parses every supplied managed `AGENTS.yml`, validates the complete custom-extension namespace, runs all owned section validators, prints all file-scoped errors, and exits nonzero on any failure.
- [ ] Add a meta extension entry point that validates the complete custom namespace during `session_start`, skips untrusted project files, reports one clear error status, and clears that status after a successful reload.
- [ ] Configure the meta package to load its validator before the wrapped extension entry points and to include every wrapped extension resource from its installed package dependency.
- [ ] Check that the registry, meta package dependencies, bundled package list, Pi resource manifest, and generated schema describe the same extension set.

## WU-06: Replace Every Configuration Use in One Change Set

- [ ] Rewrite the root `AGENTS.yml` so every custom extension value is under `pi.extensions.<package-name>` and no previous top-level extension field remains.
- [ ] Rewrite `template/AGENTS.yml`, extension presets, tracked project files, and all other managed configuration files to the same final structure.
- [ ] Rewrite all inline YAML strings, fixtures, expected objects, schema examples, and configuration documentation that contain an old extension field.
- [ ] Update every tracked active user or project configuration that will run with the new meta package before that package is activated.
- [ ] Delete all reads of the old paths after the files are rewritten, and make any remaining old field fail as an unknown field instead of producing a warning or fallback.
- [ ] Use a temporary one-time editing command only if required to perform the repository-wide rewrite safely, then delete that command and all migration-only artifacts before completion.
- [ ] Regenerate the combined schema only after all extension contracts and configuration files have their final forms.

## WU-07: Verify Contracts, Runtime Use, and Packaging

- [ ] Test the shared public loader with real temporary directories for missing files, untrusted projects, malformed YAML, duplicate keys, invalid containers, absent sections, valid sections, invalid values, unknown fields, and exact error paths.
- [ ] Test aggregate composition for deterministic output, duplicate package keys, unknown extension names, strict owned fields, optional known sections, and unrelated top-level fields.
- [ ] Update existing extension suites to test their exported contract and public configuration loader directly, including valid runtime use, invalid-section failure, project trust, and reload behavior.
- [ ] Do not create a new suite in a repository that has no suite without explicit user approval; validate that repository's exported contract through the existing meta-level suite until approval is given.
- [ ] Validate every managed `AGENTS.yml`, template, preset, and fixture against the freshly composed schema in the normal check command.
- [ ] Confirm that no test needs provider credentials, no test calls a real model API, and any real Pi process test uses a small offline RPC or extension-load flow.
- [ ] Run clean full installation and clean production-only installation for the shared schema package, every changed extension package, and the meta package.
- [ ] Confirm after production-only installation that every `./agents` export imports, every wrapped extension loads, and the meta package starts without provider credentials.
- [ ] Run type checking, Biome, all existing tests, schema drift checks, aggregate configuration validation, package checks, and production load checks before release.

## WU-08: Coordinate the Multi-Repository Release

- [ ] Create coordinated branches for the schema package, every affected extension, and the meta repository, and keep the currently deployed meta package pinned until the full final set passes.
- [ ] Commit each converted child extension without deploying it independently, record its final commit, and update the meta package to those exact commits only after all child checks pass.
- [ ] Complete the root configuration rewrite, dependency pins, lockfile, registry, generated schema, and wrapped resource manifest in the final meta change.
- [ ] Verify that searches find no schema-version field, old section path, compatibility reader, legacy alias, runtime migration, retained migration command, duplicate structural interface, or copied JSON Schema fragment.
- [ ] Install the new meta package and replace all active managed `AGENTS.yml` files in one maintenance operation while Pi is stopped or idle, then start a new process or reload only after both changes finish.
- [ ] Do not mark the release complete until the deployed meta package pins, deployed extension code, generated schema, and deployed configuration files all represent the same current contract.
