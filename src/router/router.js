import { createWebHistory, createRouter } from "vue-router"
import test from '@/components/Test.vue'
import main from '@/pages/MainPage.vue'
import profile from '@/pages/ProfilePage.vue'
import ProfileEdit from "@/pages/ProfileEditPage.vue"
import login from '@/pages/LoginPage.vue'
import signup from '@/pages/SignUpPage.vue'

const routes = [
    {
        path:'/',
        component: main,
    },
    {
        path:'/profile',
        component: profile,
    },
    {
        path:'/profileEdit',
        component: ProfileEdit,
    },
    {
        path:'/login',
        component: login
    },
    {
        path:'/signup',
        component: signup
    }
]; // 라우팅 패스, 컴포넌트 등 정의

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;