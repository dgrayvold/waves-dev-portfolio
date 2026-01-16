// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',

	devtools: { enabled: true },

	modules: [
		'@nuxt/eslint',
		'@nuxt/image',
		'@nuxtjs/turnstile',
		'@unocss/nuxt',
		'@vueuse/nuxt',
		'nuxt-prepare',
		'@nuxt/icon',
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

	image: {
		provider: 'contentful',
	},

	icon: {
		mode: 'svg',

		serverBundle: false,

		clientBundle: {
			scan: true,
		},
	},

	routeRules: {
		'/': { prerender: true },
	},

	runtimeConfig: {
		turnstile: {
			secretKey: process.env.TURNSTILE_SECRET_KEY,
		},

		resendKey: process.env.RESEND_KEY,
		fromEmail: process.env.FROM_EMAIL,
		toEmail: process.env.TO_EMAIL,

		public: {
			resumeUrl: process.env.RESUME_URL,
			resumeDownloadUrl: process.env.RESUME_DOWNLOAD_URL,
		},
	},

	turnstile: {
		siteKey: process.env.TURNSTILE_SITE_KEY,
	},

	telemetry: false,
});
