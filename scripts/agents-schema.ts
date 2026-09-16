import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Value } from "typebox/value";
import { parse } from "yaml";
import { agentsSchema } from "../src/agents.ts";

const DIALECT = "https://json-schema.org/draft/2020-12/schema";
const SCHEMA_PATH = fileURLToPath(
	new URL("../schema/AGENTS.schema.json", import.meta.url),
);

function generatedSchemaText() {
	return `${JSON.stringify({ $schema: DIALECT, ...agentsSchema }, null, 2)}\n`;
}

async function writeSchema() {
	await mkdir(dirname(SCHEMA_PATH), { recursive: true });
	await writeFile(SCHEMA_PATH, generatedSchemaText(), "utf8");
}

async function checkGeneratedSchema() {
	let current: string;
	try {
		current = await readFile(SCHEMA_PATH, "utf8");
	} catch (error) {
		const detail = error instanceof Error ? error.message : String(error);
		throw new Error(`${SCHEMA_PATH}: cannot read generated schema: ${detail}`, {
			cause: error,
		});
	}
	if (current !== generatedSchemaText()) {
		throw new Error(
			`${SCHEMA_PATH}: generated schema is out of date; run the schema write command.`,
		);
	}
}

async function validateYaml(path: string) {
	const sourcePath = resolve(path);
	let source: string;
	try {
		source = await readFile(sourcePath, "utf8");
	} catch (error) {
		const detail = error instanceof Error ? error.message : String(error);
		throw new Error(`${sourcePath}: cannot read YAML: ${detail}`, {
			cause: error,
		});
	}

	let document: unknown;
	try {
		document = parse(source);
	} catch (error) {
		const detail = error instanceof Error ? error.message : String(error);
		throw new Error(`${sourcePath}: invalid YAML: ${detail}`, { cause: error });
	}

	const errors = [...Value.Errors(agentsSchema, document)];
	if (errors.length > 0) {
		throw new Error(
			errors
				.map((error) => `${sourcePath}${error.path}: ${error.message}`)
				.join("\n"),
		);
	}
}

async function main() {
	const args = process.argv.slice(2);
	const write = args.includes("--write");
	const paths = args.filter((arg) => arg !== "--write");
	if (write) {
		await writeSchema();
		return;
	}

	const results = await Promise.allSettled([
		checkGeneratedSchema(),
		...paths.map(validateYaml),
	]);
	const errors = results.flatMap((result) =>
		result.status === "rejected"
			? [
					result.reason instanceof Error
						? result.reason.message
						: String(result.reason),
				]
			: [],
	);
	if (errors.length > 0) throw new Error(errors.join("\n"));
}

main().catch((error) => {
	console.error(error instanceof Error ? error.message : String(error));
	process.exitCode = 1;
});
