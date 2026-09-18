# Goal

Align `pi-preload` and `pi-tree` on the same `AGENTS.yml` `extends`, `includes`, and `excludes` convention so the `pi-extensions` meta repository can keep child extension repositories Git-ignored while `pi-preload` loads their configured content, `pi-tree` emits one bounded combined tree, and `.treeignore` is fully replaced by explicit project configuration.

## Work units

- [ ] Align `pi-preload` source resolution and file selection
  - [ ] Keep the current public `pi-preload.extends` value shape and make its existing resolver the reference for configuration-relative paths, ordering, duplicate handling, and errors.
  - [ ] Apply each resolved repository's own `.gitignore`, then `includes`, then `excludes`, with `excludes` taking precedence and symbolic-link traversal disabled.
  - [ ] Preserve preset expansion, repository mapping, binary detection, rendering, content order, and preload limits after file selection.
  - [ ] Update the existing `pi-preload` tests to cover a parent-Git-ignored extended repository and include/exclude precedence.

- [ ] Add aligned `AGENTS.yml` configuration support to `pi-tree`
  - [ ] Define and validate `pi-tree.extends`, `pi-tree.includes`, and `pi-tree.excludes` with the same field shapes and path rules as `pi-preload`.
  - [ ] Load the trusted project configuration with `read-yaml-file` and TypeBox and resolve extended repositories without applying the parent repository's `.gitignore`.
  - [ ] Add the `pi-tree` schema to `agents.ts`, TypeScript inputs, and package files, and add `read-yaml-file` as a runtime dependency.
  - [ ] Remove `.treeignore` loading, delete the bundled `.treeignore`, remove it from package files, remove the `ignore` dependency, and update the package lock.

- [ ] Generate one combined bounded tree from the configured repositories
  - [ ] Select each repository's paths with its local `.gitignore`, `includes`, and `excludes`, and normalize the results to stable repository-relative paths.
  - [ ] Prefix extended paths with their configured repository path or name, merge duplicate paths, and sort the complete virtual path list.
  - [ ] Pass the merged paths through the existing depth-based `tree --fromfile` renderer with one global 16 KiB output allocation.
  - [ ] Preserve the existing deadline and temporary cleanup, write only `<cwd>/TREE.txt`, and inject only one hidden `pi-tree` message per session.

- [ ] Verify `pi-tree` configuration and combined-tree behavior
  - [ ] Update the existing unit tests with a meta repository whose `.gitignore` hides an extended child repository and confirm that the child still appears through `pi-tree.extends`.
  - [ ] Test include selection, exclude precedence, repository-local `.gitignore`, stable ordering, duplicate paths, and disabled symbolic-link traversal.
  - [ ] Test that `.treeignore` is unused and unshipped while equivalent `pi-tree.excludes` rules remove the configured paths.
  - [ ] Test several repository prefixes, one output file, one custom message, and the global 16 KiB limit.
  - [ ] Keep the existing credential-free Pi extension-load test and update it for the required `AGENTS.yml` configuration.

- [ ] Migrate extension and meta-repository configuration
  - [ ] Add `pi-tree` sections to `pi-compress`, `pi-env`, `pi-modes`, `pi-preload`, `pi-prompts`, `pi-steering`, `pi-sync`, `pi-tasks`, `pi-tree`, and the other extension repositories named by the meta extends list.
  - [ ] Move the required bundled `.treeignore` patterns into those `pi-tree.excludes` lists without widening the corresponding `pi-preload` content selections.
  - [ ] Keep child repositories ignored by the meta `.gitignore` and give `pi-preload` and `pi-tree` the same extends value in the root `AGENTS.yml`.
  - [ ] Add the meta repository's tracked local paths to its `pi-tree.includes` and add generated or dependency paths to its `pi-tree.excludes`.

- [ ] Update the Copier template and generated AGENTS schema
  - [ ] Add a direct top-level `pi-tree` section to `template/AGENTS.yml` for the source, tests, skills, manifests, and configuration files created by the template.
  - [ ] Update the existing template unit test to require direct `pi-preload` and `pi-tree` sections and continue rejecting an obsolete `pi` wrapper.
  - [ ] Register the `pi-tree` configuration schema in the meta `agents.ts`, regenerate the schema, and pass `schema:check`.

- [ ] Validate, publish, and activate the aligned extensions
  - [ ] Pass type checking, Biome, existing tests, and `check` in `pi-preload`, `pi-tree`, and the meta repository.
  - [ ] Pass clean full installs, clean production installs, package dry runs, and credential-free production extension-load checks for `pi-preload` and `pi-tree`.
  - [ ] Start a fresh Pi session in `/home/entropybender/pi-extensions` and confirm that ignored child repositories appear, configured exclusions do not appear, preload content remains scoped, and the complete tree stays within 16 KiB.
  - [ ] Commit and push each changed repository without unrelated work, update the changed extensions from their remotes with Pi, and pass a final fresh-session smoke check.
