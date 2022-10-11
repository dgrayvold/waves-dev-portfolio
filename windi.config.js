import { defineConfig } from 'vite';

export default defineConfig({
	attributify: true,
	theme: {
		extend: {
			animation: {
				boat: 'boat 2s ease infinite',
				float: 'float 2s ease infinite',
				lighthouse: 'lighthouse 2s linear infinite',
				turn: 'turn 2s ease infinite',
			},

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

			fontFamily: {
				display: ['OverpassVariable', 'Arial'],
				text: ['Gentium Book Plus', 'Times New Roman'],
			},

			keyframes: {
				boat: {
					'0%, 100%': { transform: 'translateY(0px) rotateZ(0deg)' },
					'33%': {
						transform: 'translateY(-4px) rotateX(2deg) rotateZ(5deg)',
					},
					'66%': { transform: 'translateY(4px) rotateZ(-6deg)' },
				},

				float: {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-4px)' },
					'75%': { transform: 'translateY(4px)' },
				},

				lighthouse: {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0' },
				},

				turn: {
					'0%, 100%': { transform: 'rotateZ(0deg)' },
					'50%': { transform: 'rotateZ(90deg)' },
				},
			},
		},
	},
});
