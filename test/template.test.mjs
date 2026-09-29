import { execFile } from "node:child_process";
import { cp, copyFile, mkdir, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));

test("renders a valid Pi extension", { timeout: 240_000 }, async (t) => {
	const temporaryDirectory = await mkdtemp(join(tmpdir(), "pi-extension-template-"));
	t.after(() => rm(temporaryDirectory, { recursive: true, force: true }));
	const source = join(temporaryDirectory, "source");
	const destination = join(temporaryDirectory, "output");
	await mkdir(source);
	await Promise.all([
		copyFile(join(repositoryRoot, "copier.yml"), join(source, "copier.yml")),
		cp(join(repositoryRoot, "template"), join(source, "template"), { recursive: true }),
	]);

	await execFileAsync(
		"uvx",
		[
			"--from",
			"copier==9.18.2",
			"copier",
			"copy",
			"--trust",
			"--defaults",
			"--data",
			"project_name=pi-template-check",
			source,
			destination,
		],
		{ timeout: 120_000 },
	);

	await execFileAsync("npm", ["run", "check"], {
		cwd: destination,
		timeout: 180_000,
	});
});
