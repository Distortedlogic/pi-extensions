update:
	#!/usr/bin/env bash
	set -e

	for repo in . pi-*; do
		git -C "$repo" pull --rebase --autostash
	done

	agents_changed=false
	git -C pi-agents-yaml add -A
	if ! git -C pi-agents-yaml diff --cached --quiet; then
		git -C pi-agents-yaml commit -m "safety commit"
		agents_changed=true
	fi
	git -C pi-agents-yaml push

	if $agents_changed; then
		agents_commit=$(git -C pi-agents-yaml rev-parse HEAD)
		for package in pi-*/package.json; do
			grep -q '"pi-agents-yaml":' "$package" || continue
			npm install --prefix "$(dirname "$package")" --package-lock-only --save-exact \
				"pi-agents-yaml@github:Distortedlogic/pi-agents-yaml#$agents_commit"
		done
	fi

	for repo in . pi-*; do
		[[ "$repo" == pi-agents-yaml ]] && continue
		git -C "$repo" add -A
		git -C "$repo" diff --cached --quiet || git -C "$repo" commit -m "safety commit"
		git -C "$repo" push
	done

	pi update --extensions
