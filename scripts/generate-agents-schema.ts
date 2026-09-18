import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { agentsSchema } from "../agents.ts";

const outputPath = fileURLToPath(new URL("../template/.pi/schemas/AGENTS.schema.json", import.meta.url));
const schema = {
	$schema: "https://json-schema.org/draft/2020-12/schema",
	...agentsSchema,
};
const output = `${JSON.stringify(schema, null, "\t")}\n`;

if (process.argv.includes("--check")) {
	let current: string;
	try {
		current = await readFile(outputPath, "utf8");
	} catch {
		throw new Error("template/.pi/schemas/AGENTS.schema.json is missing. Run npm run schema:generate.");
	}
	if (current !== output) {
		throw new Error("template/.pi/schemas/AGENTS.schema.json is stale. Run npm run schema:generate.");
	}
} else {
	await writeFile(outputPath, output, "utf8");
}
