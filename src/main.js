import { createApp } from 'vue';
import App from './App.vue';
import '@unocss/reset/tailwind.css';
import 'virtual:uno.css';

import '@fontsource/gentium-book-plus/400.css';
import '@fontsource/gentium-book-plus/700.css';
import '@fontsource-variable/overpass';

const app = createApp(App);

app.mount('#app');
