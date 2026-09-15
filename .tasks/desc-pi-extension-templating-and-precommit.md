# Pi extension templating and pre-commit implementation

## Work unit 1: Meta package foundation

- [ ] Convert `/home/entropybender/pi-extensions` into an installable private Pi package by adding a root `package.json` that declares the `pi-package` keyword, packages `skills`, `template`, `copier.yml`, and `README.md`, and registers `./skills` through the `pi.skills` manifest without adding a no-operation runtime extension.

- [ ] Add a root `README.md` that defines the repository as the meta Pi extension package, names Forgejo as the writable primary remote, names GitHub as the mirror, and documents the creation, update, validation, and installation commands for extension repositories.

- [ ] Preserve the existing root rule that child extension repositories remain independent Git repositories and remain excluded from the root repository through `.gitignore`.

## Work unit 2: Authoring skill migration

- [ ] Move the canonical `pi-extension-authoring` skill from `~/.pi/agent/skills/pi-extension-authoring/SKILL.md` to `skills/pi-extension-authoring/SKILL.md` so the root meta package owns the skill that new Pi sessions can load.

- [ ] Update the moved skill to make the root Copier template the only source for a new extension baseline and remove every instruction that copies `template/` from the standalone global skill directory.

- [ ] Rewrite the skill creation procedure to confirm an empty target directory, derive the package name from that directory, apply the Copier template, install canonical pre-commit hooks, install dependencies, implement the extension, replace template-only tests, run all checks, and create the Forgejo and GitHub remote arrangement.

- [ ] Rewrite the skill update procedure to use explicit `copier update` operations, review three-way conflicts, run `pre-commit autoupdate` only for requested hook updates, run all configured checks, and keep template changes separate from behavior changes when practical.

- [ ] Preserve the skill rules that cover Pi lifecycle behavior, offline Pi load tests, project trust checks, stale session contexts, TypeBox parsing, secrets through the Bitwarden skill, no Vite, no build step, runtime code under `src/`, and no unnecessary dependencies.

## Work unit 3: Copier template migration

- [ ] Move the current authoring template into root `template/` and convert `package.json` and `README.md` into Jinja templates that use the Copier project name and description values.

- [ ] Add root `copier.yml` with only essential values for project name and description, keep those values non-secret, configure the answer file for later updates, and avoid language questions because runtime pre-commit selection detects languages from tracked files.

- [ ] Mark implementation-owned files such as `src/index.ts`, `test/unit.test.ts`, `test/e2e.test.ts`, and project-specific README content as seed files that Copier must not overwrite during an update.

- [ ] Keep managed baseline files such as `biome.json`, `tsconfig.json`, `CONTEXT_PRELOAD.yml`, `.gitignore`, `.pre-commit-config.yaml`, Forgejo workflows, and standard review configuration available for explicit Copier updates through its normal three-way merge.

- [ ] Preserve the current template decisions for ESM packages, Node `>=22.19.0`, no Vite, no extension build step, strict no-output TypeScript, Biome checks, the existing Node test runner, and the existing offline Pi load test.

## Work unit 4: Context preload correction

- [ ] Replace the template `CONTEXT_PRELOAD.yml` repeated Pi source paths with `extends: pi-extension` and keep only extension-owned files such as `src/**/*.ts` and `package.json` in the local `files` list.

- [ ] Keep `presets/pi-extension.yml` inside `pi-context-preload` because that preset belongs to the context preload package and must not move into the meta package.

- [ ] Document the dependency between a generated extension and the installed `pi-context-preload` package so the preset name resolves during Pi sessions.

## Work unit 5: Universal pre-commit policy

- [ ] Add `template/.pre-commit-config.yaml` that installs one polyglot configuration for TypeScript, JavaScript, JSON, Python, Rust, shell, YAML, TOML, secrets, and generic repository checks without asking which languages a repository uses.

- [ ] Configure upstream Biome, Ruff, rustfmt, Clippy, ShellCheck, Gitleaks, `pre-commit-hooks`, and `check-jsonschema` hooks with pinned revisions and with `types`, `types_or`, and `files` expressions so each hook runs only for applicable tracked files.

- [ ] Separate fast pre-commit hooks from pre-push and Forgejo CI hooks so local commits run formatters, fast linters, configuration validation, deterministic generators, and secret detection while full type checks and tests run during pre-push or CI.

- [ ] Configure `check-jsonschema` for `CONTEXT_PRELOAD.yml` and `.pi/review.yml` so template context files and review policy files fail early on invalid shapes.

- [ ] Add any Pi-specific manifest, generator, or package-content check to a separate shared `pi-pre-commit-hooks` repository only when no established upstream hook already provides that behavior.

## Work unit 6: Generated file behavior

- [ ] Register each real file generator as an explicit pre-commit hook and use `always_run: true` with `pass_filenames: false` for repository-wide generators or a precise `files` expression for input-specific generators.

- [ ] Use canonical pre-commit behavior that lets a generator update declared outputs, stops the commit, requires user review and staging, and never runs `git add` automatically.

- [ ] Add Forgejo validation that runs the same generators and fails when they produce differences so contributors cannot bypass local generation checks.

## Work unit 7: Forgejo continuous integration template

- [ ] Add `template/.forgejo/workflows/check.yml` that runs canonical `pre-commit run --all-files` and then runs only the applicable native checks for npm, pytest, and Cargo based on tracked manifests and files.

- [ ] Add the offline Pi extension load verification to the Forgejo workflow so a template-generated extension proves that Pi can load `src/index.ts` without making an LLM request.

- [ ] Add package-content verification that confirms the Pi manifest paths exist, declared package resources are present, and the packaged extension can be installed from its final source form.

## Work unit 8: Ordered Forgejo review template

- [ ] Add `template/.pi/review.yml` with `version: 1` and an ordered item list for correctness, extension API behavior, tests, and security, where every item declares the file patterns that activate it.

- [ ] Add `template/.forgejo/workflows/review.yml` that runs on pull request events, uses a dedicated runner, cancels stale runs for the same pull request, and does not execute code from the pull request head while a Forgejo comment token is available.

- [ ] Implement the review coordinator to load policy from the protected base revision, build the exact merge-base-to-head context, process items in YAML order, use one fresh Pi SDK session per item, expose only read-only repository tools, require structured findings, validate findings against the diff, update one managed comment per item, and stop stale runs after a head SHA change.

## Work unit 9: Validation and installation

- [ ] Create a temporary extension from the Copier template, verify Copier answers, verify seed file protection, install dependencies, install pre-commit hooks, and run the generated package checks.

- [ ] Test the template against a repository that combines TypeScript, Python, and Rust files and confirm that file-based hook selection activates only the applicable language hooks.

- [ ] Run `pre-commit run --all-files`, `npm run check`, and the offline Pi load test in the temporary extension and correct the template until a clean new extension passes without manual edits.

- [ ] Install the root meta package as a Pi package, confirm that the `pi-extension-authoring` skill appears from the new source, and remove the old standalone global skill copy so Pi does not register duplicate skills.

- [ ] Commit the root meta package with a minimal accurate message after all validation succeeds and leave the child extension repositories untouched.
