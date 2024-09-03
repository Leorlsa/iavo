import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/tailwind.css'; // Importar Tailwind CSS
import 'primeicons/primeicons.css';

createApp(App).use(store).use(router).mount('#app')
