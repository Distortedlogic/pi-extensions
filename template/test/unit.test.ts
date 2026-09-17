import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import extension from "../src/index.ts";

test("exports a Pi extension factory", () => {
	assert.equal(typeof extension, "function");
});

test("uses the final preload ignore interface", async () => {
	const source = await readFile(new URL("../.preloadignore", import.meta.url), "utf8");

	assert.equal(source, "/*\n!/src/\n!/package.json\n");
});
