import { Type } from "typebox";

const nameSchema = Type.String({ minLength: 1 });
const stringListSchema = Type.Array(Type.String({ minLength: 1 }));

export const preloadConfigurationSchema = Type.Object(
	{
		extends: Type.Optional(stringListSchema),
		presets: Type.Optional(stringListSchema),
		includes: Type.Optional(stringListSchema),
		excludes: Type.Optional(stringListSchema),
		contexts: Type.Optional(stringListSchema),
	},
	{ additionalProperties: false },
);

export const modesConfigurationSchema = Type.Record(Type.String({ pattern: "\\S" }), Type.String(), {
	additionalProperties: false,
});

const promptSchema = Type.Object(
	{
		description: Type.Optional(Type.String()),
		body: Type.String(),
	},
	{ additionalProperties: false },
);
const promptsSchema = Type.Record(nameSchema, promptSchema, { additionalProperties: false });
const chainsSchema = Type.Record(nameSchema, Type.Array(nameSchema, { minItems: 1 }), {
	additionalProperties: false,
});

export const promptsConfigurationSchema = Type.Object(
	{
		prompts: promptsSchema,
		chains: Type.Optional(chainsSchema),
	},
	{ additionalProperties: false },
);

export const agentsSchema = Type.Object(
	{
		"pi-preload": Type.Optional(preloadConfigurationSchema),
		"pi-modes": Type.Optional(modesConfigurationSchema),
		"pi-prompts": Type.Optional(promptsConfigurationSchema),
	},
	{ additionalProperties: true },
);
