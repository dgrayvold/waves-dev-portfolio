import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import WindiCSS from 'vite-plugin-windicss';
import Icons from 'unplugin-icons/vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue(), WindiCSS(), Icons({ compiler: 'vue3' })],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	server: {
		port: 3000,
	},
});
