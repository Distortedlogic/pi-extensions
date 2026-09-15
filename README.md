# Pi extensions

This repository is the private meta package for Pi extension repositories. It provides the Pi extension authoring skill, the Copier template, and shared repository policy. It does not register a runtime extension.

## Remotes

Forgejo is the writable primary remote. Use `origin` for Forgejo. GitHub is the mirror. Use `github` for GitHub, and send normal development changes to Forgejo first.

```bash
git remote add origin "$FORGEJO_SSH_URL"
git remote add github "$GITHUB_SSH_URL"
git push -u origin main
git push github main
```

## Create an extension repository

Create an empty target directory, and apply the root Copier template. Copier asks for the project name and description.

```bash
repository=my-pi-extension
target="$HOME/repos/$repository"
mkdir "$target"
copier copy /home/entropybender/pi-extensions "$target"
cd "$target"
pre-commit install --install-hooks
pre-commit install --hook-type pre-push
npm install
```

Implement the extension in `src/`. Replace the template-only tests with tests for the extension behavior.

## Update an extension repository

Use Copier to apply an explicit template update. Review the three-way diff and resolve each conflict before you commit it.

```bash
cd "$HOME/repos/my-pi-extension"
copier update
git diff
```

Run `pre-commit autoupdate` only when the requested update includes hook revisions.

```bash
pre-commit autoupdate
```

Keep template updates separate from extension behavior changes when practical.

## Validate an extension repository

Run all configured checks before you commit or push.

```bash
pre-commit run --all-files
npm run check
PI_OFFLINE=1 npm run test:e2e
npm pack --dry-run
```

## Install an extension repository

Install from the private Forgejo source after the checks pass and the primary remote has the commit.

```bash
pi install git:git@forgejo.example:owner/my-pi-extension
```

Use the GitHub mirror when that source is the required distribution source.

```bash
pi install git:github.com/Distortedlogic/my-pi-extension
```

Reload or restart Pi after installation.
