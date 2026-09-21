# Goal

Align `pi-preload` and `pi-tree` on the same `AGENTS.yml` `extends`, `includes`, and `excludes` convention so the `pi-extensions` meta repository can keep child extension repositories Git-ignored while `pi-preload` loads their configured content, `pi-tree` emits one bounded combined tree, and `.treeignore` is fully replaced by explicit project configuration.

Current status: The reference `pi-preload` resolver and most of the `pi-tree` selection and bounded-rendering path already exist. The remaining work is schema alignment, safe prefixes for extended repositories, missing verification, repository configuration migration, and release activation.

## Work units

- [x] Align `pi-preload` source resolution and file selection
  - [x] Keep the current public `pi-preload.extends` value shape and make its existing resolver the reference for configuration-relative paths, ordering, duplicate handling, and errors.
  - [x] Apply each resolved repository's own `.gitignore`, then `includes`, then `excludes`, with `excludes` taking precedence and symbolic-link traversal disabled.
  - [x] Preserve preset expansion, repository mapping, binary detection, rendering, content order, and preload limits after file selection.
  - [x] Update the existing `pi-preload` tests to cover a parent-Git-ignored extended repository and include/exclude precedence.

- [ ] Finish aligned `AGENTS.yml` configuration support in `pi-tree`
  - [ ] Replace direct `yaml` parsing and custom field checks with `read-yaml-file` and TypeBox validation that matches the `pi-preload` field shapes and path rules.
  - [x] Keep the trusted-project gate and resolve each extended repository independently of the parent repository's `.gitignore`.
  - [ ] Add the `pi-tree` schema to `agents.ts`, TypeScript inputs, and package files, add `read-yaml-file` as a pinned runtime dependency, and remove `yaml` if it is no longer used.
  - [x] Keep `.treeignore` loading and shipping removed, keep the `ignore` dependency removed, and keep the package lock consistent.

- [ ] Complete one combined bounded tree from the configured repositories
  - [x] Select each repository's paths with its local `.gitignore`, `includes`, and `excludes`, with exclude precedence and symbolic-link traversal disabled.
  - [ ] Map external and sibling extended repositories to a safe, stable virtual prefix based on the configured repository path or name.
  - [x] Merge duplicate virtual paths and sort the complete virtual path list.
  - [x] Pass the merged paths through the existing depth-based `tree --fromfile` renderer with one global 16 KiB output allocation.
  - [x] Preserve the existing deadline and temporary cleanup, write only `<cwd>/TREE.txt`, and inject only one hidden `pi-tree` message per session.

- [ ] Complete `pi-tree` configuration and combined-tree verification
  - [ ] Add a meta-repository test whose `.gitignore` hides an extended child repository and confirm that the child still appears through `pi-tree.extends`.
  - [x] Keep the existing coverage for include selection, exclude precedence, repository-local `.gitignore`, extends cycles, disabled symbolic-link traversal, and bounded output.
  - [ ] Add focused coverage for stable ordering, duplicate extends or paths, and external or sibling repository prefixes.
  - [ ] Test that `.treeignore` is unused and unshipped while equivalent `pi-tree.excludes` rules remove the configured paths.
  - [ ] Test several repository prefixes in one output file and one custom message.
  - [x] Keep the credential-free Pi extension-load test with required `AGENTS.yml` configuration and the global 16 KiB limit test.

- [ ] Migrate extension and meta-repository configuration
  - [ ] Add `pi-tree` sections to `pi-compress`, `pi-env`, `pi-modes`, `pi-preload`, `pi-prompts`, `pi-steering`, `pi-sync`, `pi-tasks`, `pi-tree`, and the other extension repositories named by the meta extends list.
  - [ ] Move the required bundled `.treeignore` patterns into those `pi-tree.excludes` lists without widening the corresponding `pi-preload` content selections.
  - [ ] Keep child repositories ignored by the meta `.gitignore` and give `pi-preload` and `pi-tree` the same extends value in the root `AGENTS.yml`.
  - [ ] Add the meta repository's tracked local paths to its `pi-tree.includes` and add generated or dependency paths to its `pi-tree.excludes`.

- [ ] Update the Copier template, authoring skill, and generated AGENTS schema
  - [ ] Add a direct top-level `pi-tree` section to `template/AGENTS.yml` for the source, tests, skills, manifests, and configuration files created by the template.
  - [ ] Add template validation to an existing meta check so it requires direct `pi-preload` and `pi-tree` sections and rejects an obsolete `pi` wrapper.
  - [ ] Update `pi-preload-authoring` to cover paired top-level `pi-preload` and `pi-tree` sections, shared `extends`, separate content and tree selections, repository-local `.gitignore` rules, exclude precedence, removal of `.treeignore`, and validation of both outputs.
  - [ ] Register the `pi-tree` configuration schema in the meta `agents.ts`, regenerate the schema, and pass `schema:check`.

- [ ] Validate, publish, and activate the aligned extensions
  - [ ] Pass type checking, Biome, existing tests, and `check` in `pi-preload`, `pi-tree`, and the meta repository.
  - [ ] Pass clean full installs, clean production installs, package dry runs, and credential-free production extension-load checks for `pi-preload` and `pi-tree`.
  - [ ] Start a fresh Pi session in `/home/entropybender/pi-extensions` and confirm that ignored child repositories appear, configured exclusions do not appear, preload content remains scoped, and the complete tree stays within 16 KiB.
  - [ ] Commit and push each changed repository without unrelated work, update the changed extensions from their remotes with Pi, and pass a final fresh-session smoke check.
