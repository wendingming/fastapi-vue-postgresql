import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/index.css';

const app = createApp(App);
app.use(ElementPlus, { zIndex: 3000, size: 'small' });
app.use(store).use(router).mount('#app');
//createApp(App).use(ElementPlus).use(store).use(router).mount("#app");
