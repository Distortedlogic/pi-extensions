# Implement pi-tree and pi-preload Ignore Policies

## Work Unit 1: Remove the Old Configuration and Name

- [ ] Remove `TreeConfig`, `loadTreeConfig`, YAML parsing, include globs, and all tree behavior stored in `AGENTS.yml` from `pi-tree`.

- [ ] Remove the preload `AGENTS.yml` schema and reader, `agents.ts`, preset loading, configuration-selected context rendering, obsolete presets, their tests, and their Nunjucks, YAML, and TypeBox dependencies; retain the standalone Dioxus reference assets and skill plus the existing file decoding, image, ordering, byte-limit, trust, and timeout behavior.

- [ ] Rename the legacy preload repository, package metadata, source constants, custom message type, errors, tests, fixtures, schemas, documentation, workflows, and package references to `pi-preload`, rename the context authoring skill to `preload-ignore-authoring` and make it edit `.preloadignore`, and delete every alias, fallback reader, compatibility path, and tracked use of the legacy identifier.

## Work Unit 2: Implement Hierarchical Ignore Traversal

- [ ] Add exact dependency `@secretlint/walker@13.0.5` to both packages, move `pi-tree` defaults to `defaults/.treeignore`, create `pi-preload/defaults/.preloadignore` from its current hard-coded exclusions, include each default file in its package manifest, and update generated snapshot exclusions to `.pi/TREE.md` and `.pi/PRELOAD.md`.

- [ ] Call `@secretlint/walker` directly in each extension without a shared wrapper or custom matcher, pass the packaged default file rules through `extraIgnorePatterns`, and call `walk` with `cwd: ctx.cwd`, `ignoreFiles: [".treeignore"]` or `ignoreFiles: [".preloadignore"]`, and `followSymlinks: false`; omit include patterns and Git-aware filtering so the package handles root and nested rule parsing, inheritance, negation, and traversal pruning, then remove the replaced `yaml`, `globby`, and `ignore` dependencies from `pi-tree`.

- [ ] At `session_start`, keep the existing trust check, use native `node:fs/promises` operations to test only `<ctx.cwd>/.treeignore` or `<ctx.cwd>/.preloadignore`, and return before status updates or collection when that exact root activation file is absent so nested files cannot activate either extension.

## Work Unit 3: Update pi-tree Collection and Output

- [ ] Convert the walker’s admitted absolute file paths to CWD-relative POSIX paths and pass them directly to the existing bounded system `tree --fromfile` renderer, preserving its depth expansion and byte limit while removing the broad Globby scan and post-traversal filtering without adding a replacement tree-rendering package.

- [ ] Use native `node:fs/promises` directory and file operations to create `<ctx.cwd>/.pi`, write the single Markdown snapshot to `<ctx.cwd>/.pi/TREE.md`, label the hidden preload block with that path, and delete the root `TREE.txt` output and tracked snapshots.

## Work Unit 4: Update pi-preload Collection and Output

- [ ] Replace configured Globby candidates and `gitignore: true` with the walker’s admitted files and pass them through the existing regular-file, text, binary-image, ordering, file-count, and byte-limit pipeline, retaining `file-type`, `isbinaryfile`, and `p-map` instead of replacing their established behavior.

- [ ] Use native `node:fs/promises` directory and file operations to create `<ctx.cwd>/.pi`, write the single snapshot to `<ctx.cwd>/.pi/PRELOAD.md`, and delete the root `PRELOAD.md` output and tracked snapshots.

## Work Unit 5: Migrate Project Files and Existing Tests

- [ ] Delete tree and preload behavior from tracked `AGENTS.yml` files, schemas, fixtures, examples, and the Copier template without adding replacement configuration keys, then add `.treeignore` and `.preloadignore` activation files to the meta-workspace root, the extension template, and every direct child extension repository.

- [ ] Update the existing `pi-tree` tests for absent and exact-root activation, nested precedence and sibling isolation, bundled-rule override, traversal pruning, CWD confinement, untracked child repositories, and `.pi/TREE.md`; update the existing `pi-preload` tests for the same policy behavior, independent activation, retained file processing, and `.pi/PRELOAD.md`.

- [ ] Update the two package READMEs, package manifests, lockfiles, repository metadata, extension inventory, authoring documentation, and existing integration fixtures to describe only root activation files, nested ignore inheritance, CWD collection, and project-level `.pi` snapshots.

## Work Unit 6: Validate, Publish, and Activate

- [ ] Run `npm run check`, a clean full install, a clean production-only install, and a credential-free production extension-load check in `pi-tree` and `pi-preload`, then run `git diff --check` in every changed repository.

- [ ] Rename the preload repositories on Forgejo and GitHub to `pi-preload`, update their local remote URLs, commit each changed extension repository and the meta-repository separately, and push every extension commit before installation.

- [ ] Use Pi package commands directly, without a custom migration script, to remove the active legacy preload source and stale `pi-tree` installation, install `git:github.com/Distortedlogic/pi-preload` and `git:github.com/Distortedlogic/pi-tree`, and confirm that active settings and installed package state contain only these corrected remote sources.

- [ ] Reload Pi and verify the four root-marker combinations, bundled-root-nested rule precedence in the `pi-extensions` workspace, direct startup in one child repository, no traversal outside the session CWD, snapshots at `.pi/TREE.md` and `.pi/PRELOAD.md`, and no remaining legacy preload identifier in tracked files, remotes, settings, installed packages, or runtime messages.
