# Goal

Align `pi-preload` and `pi-tree` on the same `AGENTS.yml` `extends`, `includes`, and `excludes` convention so the `pi-extensions` meta repository can keep child extension repositories Git-ignored while both extensions resolve the same repository set, `pi-preload` loads the configured file content, `pi-tree` emits one bounded combined filesystem tree, and `.treeignore` is removed without a shared framework or unrelated behavior changes.

## Work units

- [ ] Fix the common source-selection contract in the existing `pi-preload` tests
  - [ ] Add cases for the current `extends` value shape, configuration-relative source resolution, duplicate handling, stable ordering, and all existing recursive or missing-source behavior.
  - [ ] Add cases that prove explicit extends discovery bypasses the parent `.gitignore` while file selection honors the selected repository's own `.gitignore`.
  - [ ] Add cases that prove `includes` selects candidates, `excludes` wins over `includes`, dot paths follow the current preload rules, and symbolic links are not followed.
  - [ ] Keep the existing public `pi-preload` configuration compatible and do not introduce a shared package, event protocol, or new extends behavior.

- [ ] Align the local `pi-preload` resolver and selector with the fixed contract
  - [ ] Adjust the existing resolver directly so explicit repository roots use the tested path, ordering, duplicate, trust, and `.gitignore` rules.
  - [ ] Use the existing `globby` dependency for include and exclude selection with stable repository-relative POSIX paths.
  - [ ] Keep preset expansion, repository mapping, binary detection, Nunjucks rendering, content ordering, and preload-size limits after source selection unchanged.
  - [ ] Pass the updated `pi-preload` unit and end-to-end tests before using its behavior as the `pi-tree` reference.

- [ ] Add matching `AGENTS.yml` configuration support to `pi-tree`
  - [ ] Define the `pi-tree` schema with the same `extends`, `includes`, and `excludes` field shapes and validation rules as `pi-preload`.
  - [ ] Add the schema to `pi-tree/agents.ts`, include it in TypeScript and package inputs, and expose it to the generated AGENTS schema flow.
  - [ ] Load trusted project configuration with `read-yaml-file` and TypeBox, and report errors with the configuration path and `pi-tree` section.
  - [ ] Add `read-yaml-file` as a runtime dependency and update the package lock without adding another YAML, glob, or ignore implementation.

- [ ] Replace `.treeignore` with the aligned source-selection flow in `pi-tree`
  - [ ] Resolve `pi-tree.extends` with the same repository rules as `pi-preload`, including explicit discovery outside the parent `.gitignore` and repository-local scans.
  - [ ] Select paths with the configured `includes` and `excludes`, the selected repository's own `.gitignore`, stable sorting, duplicate removal, and disabled symbolic-link traversal.
  - [ ] Remove `.treeignore` loading, delete the bundled `.treeignore`, remove it from package files, remove the `ignore` dependency, and update the lock file.
  - [ ] Do not add a `.treeignore` fallback or another compatibility mode.

- [ ] Build one combined bounded tree from the resolved repositories
  - [ ] Prefix each extended repository's selected paths with its existing configured repository name or path while keeping current-repository paths relative to `cwd`.
  - [ ] Merge and sort the virtual paths before passing them to the existing `tree --fromfile` renderer so required parent directories render naturally.
  - [ ] Keep the current deadline, temporary-directory cleanup, depth-based fitting, and one global 16 KiB allocation for the complete output.
  - [ ] Write only `<cwd>/TREE.txt`, exclude generated `TREE.txt` paths from selection, and inject only one hidden `pi-tree` custom message per session.

- [ ] Update the existing `pi-tree` tests for configuration and combined-tree behavior
  - [ ] Add a temporary meta-repository case where the parent `.gitignore` hides a child repository but `pi-tree.extends` includes its configured paths.
  - [ ] Add cases for includes, exclude precedence, repository-local `.gitignore`, dot paths, stable ordering, duplicate sources, symbolic links, and the existing extends error behavior.
  - [ ] Add a case proving `.treeignore` has no effect and is absent from the package while the equivalent `AGENTS.yml` exclusion works.
  - [ ] Add cases for several repository prefixes, one output file, one custom message, deterministic truncation, and the global 16 KiB limit.
  - [ ] Keep the existing credential-free Pi extension-load test and do not add a new test suite.

- [ ] Migrate the custom extension repository configurations
  - [ ] Add or update `pi-tree` sections in `pi-compress`, `pi-env`, `pi-modes`, `pi-preload`, `pi-prompts`, `pi-steering`, `pi-sync`, `pi-tasks`, `pi-tree`, and each other extension repository selected by the meta repository.
  - [ ] Move every still-required `.treeignore` pattern into the owning repository's `pi-tree.excludes` and remove project `.treeignore` files.
  - [ ] Give each repository technically relevant tree includes without widening its `pi-preload` content set only to make the two values identical.
  - [ ] Add `AGENTS.yml` to package files only for packages that must provide their configuration when used as an installed extends source.

- [ ] Update the `pi-extensions` meta configuration and Copier template
  - [ ] Keep child repositories ignored by the meta `.gitignore` and configure `pi-preload` and `pi-tree` to use the same extends value in the root `AGENTS.yml`.
  - [ ] Add meta-repository-local `pi-tree.includes` and `pi-tree.excludes` for `.pi`, `.tasks`, `scripts`, `skills`, `template`, and the tracked root configuration files.
  - [ ] Add a `pi-tree` section to `template/AGENTS.yml` with source, test, skill, manifest, TypeScript, Biome, and AGENTS paths that the Copier template creates.
  - [ ] Update the existing template unit test to require the direct top-level `pi-preload` and `pi-tree` sections and to continue rejecting an obsolete `pi` wrapper.
  - [ ] Register the `pi-tree` schema in the meta `agents.ts`, regenerate the project schema, and pass `schema:check`.

- [ ] Validate clean installs and the complete meta-repository workflow
  - [ ] Run type checking, Biome, existing tests, and each repository's `check` script in `pi-preload`, `pi-tree`, and the changed meta package.
  - [ ] Pass clean full installs, clean production-only installs, package dry runs, and credential-free production extension-load checks for `pi-preload` and `pi-tree`.
  - [ ] Start a fresh Pi session in `/home/entropybender/pi-extensions` and verify that ignored child repositories appear in the combined tree, excluded paths do not appear, preload content follows its own configured set, and the tree remains within 16 KiB.
  - [ ] Confirm that the meta Git repository does not track child repository contents and that no changed repository contains active `.treeignore` behavior.

- [ ] Publish and activate the aligned extensions
  - [ ] Commit each changed repository with a minimal message after its checks pass, without including unrelated work.
  - [ ] Push every changed extension repository and the meta repository to their configured remotes.
  - [ ] Update the changed extensions from their remote sources with Pi rather than installing any extension from a local path.
  - [ ] Run one final fresh-session smoke check after the Pi update and record any exact failure before considering a fallback.
