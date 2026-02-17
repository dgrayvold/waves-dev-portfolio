import * as v from 'valibot';

export const projectSchema = v.array(
	v.object({
		project: v.string(),
		description: v.string(),
		location: v.string(),
		url: v.string(),
		tags: v.array(v.string()),
		image: v.nullable(v.string()),
		sort: v.number(),
		cta: v.string(),
	}),
);

export type Project = v.InferOutput<typeof projectSchema>[number];

export const envSchema = v.object({
	CONTENTFUL_SPACE_ID: v.string(),
	CONTENTFUL_CONTENT_TOKEN: v.string(),
});

export const assetSchema = v.object({
	sys: v.object({
		id: v.string(),
	}),
	fields: v.object({
		file: v.object({ url: v.string() }),
	}),
});

const devProjectEntrySchema = v.object({
	...projectSchema.item.entries,
	image: v.nullable(v.object({ sys: v.object({ id: v.string() }) })),
});

export const devProjectEntriesSchema = v.object({
	items: v.array(
		v.object({
			fields: devProjectEntrySchema,
		}),
	),
	includes: v.object({
		Asset: v.array(assetSchema),
	}),
});
