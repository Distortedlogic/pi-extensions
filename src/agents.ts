import { agentsSection as contextPreloadAgentsSection } from "pi-context-preload/agents.ts";
import { agentsSection as modesAgentsSection } from "pi-modes/agents.ts";
import { agentsSection as promptsAgentsSection } from "pi-prompts/agents.ts";
import { Type } from "typebox";

const extensionsSchema = Type.Object(
	{
		...contextPreloadAgentsSection,
		...modesAgentsSection,
		...promptsAgentsSection,
	},
	{ additionalProperties: false },
);

export const agentsSchema = Type.Object(
	{
		pi: Type.Optional(
			Type.Object(
				{
					extensions: extensionsSchema,
				},
				{ additionalProperties: false },
			),
		),
	},
	{ additionalProperties: true },
);
