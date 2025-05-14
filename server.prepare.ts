import { defineNuxtPrepareHandler } from 'nuxt-prepare/config';
import * as contentful from 'contentful';
import z from 'zod';
import type { EntryFieldTypes } from 'contentful';
import type { Project } from '~/types/types';

type DevPortfolioProjectSkeleton = {
	contentTypeId: 'devPortfolioProject';
	fields: {
		project: EntryFieldTypes.Text;
		location: EntryFieldTypes.Text;
		description: EntryFieldTypes.Text;
		cta: EntryFieldTypes.Text;
		url: EntryFieldTypes.Text;
		tags: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
		sort: EntryFieldTypes.Number;
		image: EntryFieldTypes.AssetLink;
	};
};

export default defineNuxtPrepareHandler(async () => {
	const envValidator = z.object({
		CONTENTFUL_SPACE_ID: z.string(),
		CONTENTFUL_CONTENT_TOKEN: z.string(),
	});

	const envValidationResult = envValidator.safeParse(process.env);

	if (!envValidationResult.success) {
		console.error('One or more required env variables not set');

		return {
			ok: false,
		};
	}

	const env = envValidationResult.data;

	const client = contentful.createClient({
		space: env.CONTENTFUL_SPACE_ID,
		accessToken: env.CONTENTFUL_CONTENT_TOKEN,
	});

	const portraitUrl = (await client.getAsset('32fbbI0qkOG9jMntVM3Ryn')).fields.file?.url;

	const projectsListRaw =
		await client.withoutUnresolvableLinks.getEntries<DevPortfolioProjectSkeleton>({
			content_type: 'devPortfolioProject',
		});

	const projectsList: Project[] = projectsListRaw.items
		.map(item => {
			if (!item.fields.image?.fields?.file?.url) {
				return {
					...item.fields,
					image: null,
				};
			}
			return {
				...item.fields,
				image: `https:${item.fields.image.fields.file.url}`,
			};
		})
		.sort((a, b) => a.sort - b.sort);

	return {
		ok: true,
		state: {
			portrait: `https://${portraitUrl}`,
			projects: projectsList,
		},
	};
});
