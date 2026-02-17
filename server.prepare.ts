import { defineNuxtPrepareHandler } from 'nuxt-prepare/config';
import * as v from 'valibot';
import { envSchema, assetSchema, devProjectEntriesSchema } from './app/utils/schema';
import { $fetch } from 'ofetch';

export default defineNuxtPrepareHandler(async () => {
	const envValidationResult = v.safeParse(envSchema, process.env);

	if (!envValidationResult.success) {
		console.error('One or more required env variables not set');

		return {
			ok: false,
		};
	}

	const env = envValidationResult.output;

	const contentfulFetcher = $fetch.create({
		baseURL: `https://cdn.contentful.com/spaces/${env.CONTENTFUL_SPACE_ID}/environments/master/`,
		query: {
			access_token: env.CONTENTFUL_CONTENT_TOKEN,
		},
	});

	const portraitAssetId = '32fbbI0qkOG9jMntVM3Ryn';
	const ogImageAssetId = '5ITLm4KdIwLqOEHR0022sr';

	const [portraitAsset, ogImageAsset, projectsListRaw] = await Promise.all([
		contentfulFetcher(`assets/${portraitAssetId}`),
		contentfulFetcher(`assets/${ogImageAssetId}`),
		contentfulFetcher(`entries`, { query: { content_type: 'devPortfolioProject' } }),
	]);

	const portraitUrl = v.parse(assetSchema, portraitAsset).fields.file.url;
	const ogImageUrl = v.parse(assetSchema, ogImageAsset).fields.file.url;
	const projectEntries = v.parse(devProjectEntriesSchema, projectsListRaw);

	const projectsList = projectEntries.items
		.map(entry => {
			const imageUrl = projectEntries.includes.Asset.find(
				asset => asset.sys.id === entry.fields.image?.sys.id,
			)?.fields.file.url;

			return {
				...entry.fields,
				image: imageUrl ? `https:${imageUrl}` : null,
			};
		})
		.sort((a, b) => a.sort - b.sort);

	return {
		ok: true,
		state: {
			portrait: `https://${portraitUrl}`,
			ogImage: `https://${ogImageUrl}`,
			projects: projectsList,
		},
	};
});
