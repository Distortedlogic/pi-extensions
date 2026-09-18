import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const projectDirectory = fileURLToPath(new URL("..", import.meta.url));
const codingAgentEntry = fileURLToPath(import.meta.resolve("@earendil-works/pi-coding-agent"));
const cliPath = join(dirname(codingAgentEntry), "cli.js");

test("loads in Pi", async (t) => {
	const agentDirectory = await mkdtemp(join(tmpdir(), "pi-extension-e2e-"));
	t.after(() => rm(agentDirectory, { recursive: true, force: true }));

	const { stderr } = await execFileAsync(
		process.execPath,
		[
			cliPath,
			"--no-session",
			"--no-extensions",
			"--extension",
			resolve(projectDirectory, "src/index.ts"),
			"--list-models",
		],
		{
			cwd: projectDirectory,
			encoding: "utf8",
			env: { ...process.env, PI_CODING_AGENT_DIR: agentDirectory, PI_OFFLINE: "1" },
			timeout: 30_000,
		},
	);

	assert.doesNotMatch(stderr, /Failed to load extension/);
});
