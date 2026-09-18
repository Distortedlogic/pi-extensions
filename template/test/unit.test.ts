import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { parse } from "yaml";
import extension from "../src/index.ts";

test("exports a Pi extension factory", () => {
	assert.equal(typeof extension, "function");
});

test("uses direct top-level AGENTS.yml extension configuration", async () => {
	const source = await readFile(new URL("../AGENTS.yml", import.meta.url), "utf8");
	const document = parse(source) as Record<string, unknown>;

	assert.deepEqual(document["pi-preload"], {
		presets: ["pi-extension"],
		includes: ["src/**/*.ts", "package.json"],
	});
	assert.equal(Object.hasOwn(document, "pi"), false);
});
