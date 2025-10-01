import {
	defineConfig,
	presetAttributify,
	presetWind4,
	transformerDirectives,
	transformerVariantGroup,
} from 'unocss';

export default defineConfig({
	presets: [
		presetAttributify(),
		presetWind4({
			preflights: {
				reset: true,
			},
		}),
	],

	transformers: [transformerDirectives(), transformerVariantGroup()],

	theme: {
		colors: {
			theme: {
				950: '#001015',
				900: '#072227',
				850: '#074247',
				800: '#35858b',
				700: '#4fbdba',
				600: '#aefeff',
				100: '#deffff',
			},
		},

		font: {
			display: '"Overpass Variable", "Arial"',
			text: '"Gentium Book Plus", "Times New Roman"',
		},
	},

	shortcuts: [
		[
			/animate-(float|boat|turn)/,
			([, name]) =>
				`animate-[${name}] animate-duration-2000 animate-ease animate-iteration-infinite`,
		],
	],
});
