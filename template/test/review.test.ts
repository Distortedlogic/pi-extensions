import assert from "node:assert/strict";
import { once } from "node:events";
import { createServer } from "node:http";
import test from "node:test";
import {
	addChangedLineRanges,
	assertExpectedHead,
	ForgejoClient,
	type LineRange,
	parseChangedFiles,
	parseReviewPolicy,
	type ReviewConfig,
	type ReviewSubmission,
	StaleReviewError,
	validateFindings,
} from "../.forgejo/review.ts";

test("preserves policy item order and rejects duplicate ids", () => {
	const policy = parseReviewPolicy(`
version: 1
items:
  - id: correctness
    title: Correctness
    files: ["src/**/*.ts"]
    prompt: Review correctness.
  - id: security
    title: Security
    files: ["**/*"]
    prompt: Review security.
`);
	assert.deepEqual(
		policy.items.map((item) => item.id),
		["correctness", "security"],
	);
	assert.throws(
		() =>
			parseReviewPolicy(`
version: 1
items:
  - id: repeated
    title: First
    files: ["src/**"]
    prompt: First review.
  - id: repeated
    title: Second
    files: ["test/**"]
    prompt: Second review.
`),
		/Duplicate review item id/,
	);
});

test("parses changed files and accepts findings only on changed lines", () => {
	const files = parseChangedFiles("M\0src/index.ts\0R100\0src/old.ts\0src/new.ts\0");
	assert.deepEqual(files, [
		{ status: "M", path: "src/index.ts" },
		{ status: "R100", oldPath: "src/old.ts", path: "src/new.ts" },
	]);

	const ranges = new Map<string, LineRange[]>();
	addChangedLineRanges(ranges, files[1], "@@ -3,2 +5,3 @@\n-old\n+new");
	assert.deepEqual(ranges.get("old\0src/old.ts"), [{ start: 3, end: 4 }]);
	assert.deepEqual(ranges.get("new\0src/new.ts"), [{ start: 5, end: 7 }]);

	const valid: ReviewSubmission = {
		findings: [
			{
				severity: "high",
				file: "src/new.ts",
				side: "new",
				line: 6,
				title: "Changed defect",
				body: "This finding points to a changed line.",
			},
		],
	};
	assert.deepEqual(validateFindings(valid, ranges), valid.findings);
	assert.throws(
		() => validateFindings({ findings: [{ ...valid.findings[0], line: 8 }] }, ranges),
		/does not point to a changed new line/,
	);
});

test("rejects a stale pull request head", () => {
	assert.doesNotThrow(() => assertExpectedHead("a".repeat(40), "a".repeat(40)));
	assert.throws(() => assertExpectedHead("a".repeat(40), "b".repeat(40)), StaleReviewError);
});

test("updates one managed comment and removes duplicates", async () => {
	const headSha = "a".repeat(40);
	const requests: Array<{ method: string; path: string; body: string }> = [];
	const server = createServer(async (request, response) => {
		let body = "";
		request.setEncoding("utf8");
		for await (const chunk of request) body += chunk;
		const path = new URL(request.url ?? "/", "http://localhost").pathname;
		const method = request.method ?? "GET";
		requests.push({ method, path, body });
		response.setHeader("Content-Type", "application/json");

		if (path === "/api/v1/user") {
			response.end(JSON.stringify({ id: 7 }));
			return;
		}
		if (path === "/api/v1/repos/owner/repository/issues/3/comments" && method === "GET") {
			response.end(
				JSON.stringify([
					{ id: 11, body: "<!-- pi-review:correctness --> old", user: { id: 7 } },
					{ id: 12, body: "<!-- pi-review:correctness --> duplicate", user: { id: 7 } },
					{ id: 13, body: "<!-- pi-review:correctness --> other user", user: { id: 8 } },
				]),
			);
			return;
		}
		if (path === "/api/v1/repos/owner/repository/pulls/3") {
			response.end(JSON.stringify({ head: { sha: headSha } }));
			return;
		}
		if (path === "/api/v1/repos/owner/repository/issues/comments/11" && method === "PATCH") {
			response.end(JSON.stringify({ id: 11 }));
			return;
		}
		if (path === "/api/v1/repos/owner/repository/issues/comments/12" && method === "DELETE") {
			response.statusCode = 204;
			response.end();
			return;
		}
		response.statusCode = 404;
		response.end(JSON.stringify({ message: "not found" }));
	});
	server.listen(0, "127.0.0.1");
	await once(server, "listening");
	const address = server.address();
	if (!address || typeof address === "string") throw new Error("Test server has no TCP address");

	const config: ReviewConfig = {
		repositoryRoot: process.cwd(),
		serverUrl: `http://127.0.0.1:${address.port}`,
		owner: "owner",
		repository: "repository",
		pullRequestNumber: 3,
		baseSha: "b".repeat(40),
		headSha,
		token: "test-token",
	};
	try {
		await new ForgejoClient(config).updateManagedComment(
			3,
			"correctness",
			"<!-- pi-review:correctness --> updated",
			headSha,
		);
	} finally {
		await new Promise<void>((resolve, reject) => {
			server.close((error) => (error ? reject(error) : resolve()));
		});
	}

	assert.equal(
		requests.filter((request) => request.method === "PATCH" && request.path.endsWith("/comments/11")).length,
		1,
	);
	assert.equal(
		requests.filter((request) => request.method === "DELETE" && request.path.endsWith("/comments/12")).length,
		1,
	);
	assert.equal(requests.filter((request) => request.method === "POST").length, 0);
	assert.match(requests.find((request) => request.method === "PATCH")?.body ?? "", /updated/);
});
