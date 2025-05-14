// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',

	future: { compatibilityVersion: 4 },

	devtools: { enabled: true },

	modules: [
		'@nuxt/eslint',
		'@nuxt/image',
		'@nuxtjs/turnstile',
		'@unocss/nuxt',
		'@vueuse/nuxt',
		'nuxt-lodash',
		'nuxt-prepare',
	],

	app: {
		head: {
			link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
		},

		pageTransition: {
			name: 'page',
			mode: 'out-in',
		},
	},

	runtimeConfig: {
		turnstile: {
			secretKey: process.env.TURNSTILE_SECRET_KEY,
		},

		resendKey: process.env.RESEND_KEY,
		fromEmail: process.env.FROM_EMAIL,
		toEmail: process.env.TO_EMAIL,
	},

	css: ['@unocss/reset/tailwind.css'],

	turnstile: {
		siteKey: process.env.TURNSTILE_SITE_KEY,
	},

	telemetry: false,
});
