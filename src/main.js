import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import router from './router';
import store from './store'; // 引入 Vuex store
import 'vuetify/dist/vuetify.min.css';
import ClockVue from "@/components/ClockVue.vue";
import CalendarVue from "@/components/CalendarVue.vue";

const app = createApp(App);

app.use(ElementPlus);
app.use(router);
app.use(store); // 使用 Vuex store


const clockApp = createApp(ClockVue);
clockApp.mount("#clock");

const calendarApp = createApp(CalendarVue);
calendarApp.mount("#calendar");

app.mount('#app');