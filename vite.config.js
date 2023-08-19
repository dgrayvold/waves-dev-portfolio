import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import UnoCSS from 'unocss/vite';
import Icons from 'unplugin-icons/vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue(), UnoCSS(), Icons({ compiler: 'vue3' })],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	server: {
		port: 3000,
	},
});
