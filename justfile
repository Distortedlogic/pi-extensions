update:
	#!/usr/bin/env bash
	set -e

	for repo in . pi-*; do
		git -C "$repo" pull --rebase --autostash
	done

	for repo in . pi-*; do
		git -C "$repo" add -A
		git -C "$repo" diff --cached --quiet || git -C "$repo" commit -m "safety commit"
		git -C "$repo" push
	done

	pi update --extensions
