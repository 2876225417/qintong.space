import { createRouter, createWebHistory } from 'vue-router';
import HomeComponent from '../components/Home.vue';
import AboutComponent from '../components/About.vue';
import ProjectsComponent from '../components/Projects.vue';
import ContactComponent from '../components/Contact.vue';
import ChatGPT from '../components/ChatGPT.vue'
import ClockVue from '../components/ClockVue.vue';

const routes = [
    { path: '/', component: HomeComponent },
    { path: '/about', component: AboutComponent },
    { path: '/projects', component: ProjectsComponent },
    { path: '/contact', component: ContactComponent },
    { path: '/chat', component: ChatGPT},
    { path: '/ClockVue', component: ClockVue },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
