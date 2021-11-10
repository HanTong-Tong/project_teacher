import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import result from '../components/result.vue'




Vue.use(VueRouter)

const routes = [
    { path: '/', redirect: 'login' },
    { path: '/login', component: login, name: 'login' },
    {
        path: '/home',
        component: home,
        redirect: '/result',
        children: [
            {
                path: '/result',
                component: result,
            },
        ]
    },
]

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})

export default router