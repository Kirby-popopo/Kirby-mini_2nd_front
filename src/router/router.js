import { createWebHistory, createRouter } from "vue-router"
import test from '@/components/Test.vue'
import main from '@/pages/MainPage.vue'
import profile from '@/pages/ProfilePage.vue'
import ProfileEdit from "@/pages/ProfileEditPage.vue"

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
    }
]; // 라우팅 패스, 컴포넌트 등 정의

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;