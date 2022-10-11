import { createApp } from 'vue';
import App from './App.vue';
import 'virtual:windi.css';

import '@fontsource/gentium-book-plus/400.css';
import '@fontsource/gentium-book-plus/700.css';
import '@fontsource/overpass/variable.css';

const app = createApp(App);

app.mount('#app');
