import { defineConfig } from 'vite';

export default defineConfig({
	attributify: true,
	theme: {
		extend: {
			colors: {
				theme: {
					900: '#072227',
					850: '#074247',
					800: '#35858b',
					700: '#4fbdba',
					600: '#aefeff',
					100: '#deffff',
				},
			},
		},
	},
});
