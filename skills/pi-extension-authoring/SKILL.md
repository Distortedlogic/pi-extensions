---
name: agents-yml-authoring
description: Create or improve AGENTS.yml for the current folder after inspecting its actual structure and available Pi configuration.
---

# Author AGENTS.yml

Create a minimal `AGENTS.yml` for the current working directory. Do not assume a language, framework, package type, or repository layout.

`AGENTS.yml` is configuration for Pi packages. `AGENTS.md` contains agent instructions. Do not put prose instructions in `AGENTS.yml`.

## Inspect first

Read the applicable `AGENTS.md` instructions and the existing `AGENTS.yml`, if present.

Inspect the current folder before selecting files:

```bash
pwd
tree -a -L 2 --dirsfirst -I '.git|node_modules'
```

Run a deeper, targeted tree for directories that need more inspection:

```bash
tree -a -L 4 --dirsfirst <relevant-directory>
```

Read the manifests, entry points, schemas, configuration, and tests that explain the folder. Check file sizes before fully preloading large trees.

## Document rules

- The YAML root must be one mapping.
- Preserve top-level sections owned by other Pi packages.
- Edit only the section needed for the request.
- Do not invent fields.
- Quote globs and cron expressions.
- Paths are relative to the directory that contains `AGENTS.yml`.
- Project `AGENTS.yml` is loaded only for a trusted project.

## pi-preload

The supported fields are:

```yaml
pi-preload:
  presets: []
  contexts: []
  extends: []
  includes: []
  signatures: []
  excludes: []
```

Use only fields that are needed.

- `includes`: Load complete file contents.
- `signatures`: Keep source structure and declarations while folding function bodies.
- `excludes`: Remove paths from file selection.
- `presets`: Apply a known packaged preload configuration.
- `contexts`: Render a known packaged context provider.
- `extends`: Load another directory's `AGENTS.yml` as a separate source root.

Before using a preset or context, inspect the installed `pi-preload` `presets/` or `context/` directory. Do not invent names.

An `extends` value must point to a directory with an `AGENTS.yml`. Paths in that file are relative to that directory. Circular references are invalid.

## File selection

Select the smallest set that gives useful recurring context:

- manifests and central configuration;
- public interfaces and schemas;
- important entry points;
- focused source files;
- tests that define expected behavior.

Use `signatures` for large supported source files. Full inclusion wins when one file matches both `includes` and `signatures`.

Avoid `"**/*"`. It can load unrelated and private files.

Never select:

- `.env` or credentials;
- authentication files;
- dependency directories;
- generated output;
- caches;
- large artifacts;
- session data.

`.gitignore` affects project file selection. Symlinks are not followed. Common lock files, `.git`, `PRELOAD.md`, and `TREE.txt` are already excluded.

Signature folding supports the languages provided by the installed `pi-preload` package. Current built-in support includes JavaScript, TypeScript, Python, Rust, and Go. Use full inclusion or narrower patterns for unsupported files.

Selected text blocks must stay below the preload block limit, and total generated context must stay below the combined context limit. Keep individual inputs well below 256 KiB and total output below 2 MiB.

Images can be included when they are useful. Other binary files are rejected.

## Other sections

Do not infer `pi-prompts`, `pi-modes`, `cron`, or another package section from the repository tree. Add one only when the user requests that feature, and inspect the owning package's current schema first.

## Validate

After writing the file:

1. Re-read `AGENTS.yml`.
2. Confirm that every pattern matches the inspected tree.
3. Confirm that no secret, generated file, or unrelated directory can match.
4. Reload Pi or start a new session.
5. Inspect generated `PRELOAD.md` and `TREE.txt` when their extensions are active.
6. Confirm that the selected context is useful, complete enough, and within limits.
7. Do not edit or commit generated `PRELOAD.md` or `TREE.txt`.
