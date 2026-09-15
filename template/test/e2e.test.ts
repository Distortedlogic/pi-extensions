import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const projectDirectory = fileURLToPath(new URL("..", import.meta.url));

test("loads in Pi", async () => {
	const { stderr } = await execFileAsync(
		"pi",
		["--no-extensions", "--extension", resolve(projectDirectory, "src/index.ts"), "--list-models"],
		{
			cwd: projectDirectory,
			encoding: "utf8",
			env: { ...process.env, PI_OFFLINE: "1" },
			timeout: 30_000,
		},
	);

	assert.doesNotMatch(stderr, /Failed to load extension/);
});
