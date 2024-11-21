import { createWebHistory, createRouter } from "vue-router"
import test from '@/components/Test.vue'
import main from '@/pages/MainPage.vue'
import profile from '@/pages/ProfilePage.vue'
import ProfileEdit from "@/pages/ProfileEditPage.vue"
import login from '@/pages/LoginPage.vue'
import signup from '@/pages/SignUpPage.vue'
import { useAuthStore } from "@/stores/useAuthStores"
import OAuthCallback from '@/pages/OAuthCallback.vue'
import axios from "axios"

import RoomList from '@/pages/RoomList.vue'  // 채팅방 출력 컴포넌트 임포트
import ChatRoom from '@/pages/ChatRoom.vue' // 채팅방 입장 (상세) 컴포넌트 임포트

const routes = [
    {
        path:'/',
        name: 'Main',
        component: main,
        meta: { requiresAuth: true },
    },
    {
        path:'/profile',
        name: 'Profile',
        component: profile,
        meta: { requiresAuth: true },
    },
    {
        path:'/profileEdit',
        name:'profileEdit',
        component: ProfileEdit,
        meta: { requiresAuth: true },
    },
    {
        path:'/login',
        name:'login',
        component: login,
    },
    {
        path:'/signup',
        name:'signup',
        component: signup
    },
    {
        path: '/oauth2/callback',
        name: 'OAuthCallback',
        component: OAuthCallback,
        meta: { requiresAuth: false }
    }
        path: '/chat-room/:id',  // 채팅방 상세 페이지 라우팅
        name: 'ChatRoom',
        component: ChatRoom,  // ChatRoom 컴포넌트
        props: true  // URL 파라미터를 컴포넌트로 전달
    },
    {
        path: '/roomList',
        name: 'RoomList', // 채팅방 목록 라우터
        component: RoomList
    },

]; // 라우팅 패스, 컴포넌트 등 정의

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    console.log("로컬스토리지에서 토큰 가져오기");

    await authStore.initializeToken();

    const token = authStore.token;
    //const token = localStorage.getItem('authToken');
    console.log("현재 토큰:",token);
    if (to.meta.requiresAuth) {
        if (token) {
            // 서버에 유효성 검사를 요청하거나 토큰의 만료 시점을 검증
            await axios.get('http://localhost:8090/api/auth/check', {
                headers: {
                    'authorization': token,
                }
            }).then(() => {
                next(); // 유효하다면 다음으로 이동
            }).catch((error) => {
                console.error("토큰이 만료되었습니다. 다시 로그인해 주세요.");
                authStore.clearToken(); // 스토어에서 토큰 제거
                next('/login'); // 로그인 페이지로 리다이렉트
            });
        } else {
            console.warn("인증이 필요합니다.");
            next('/login'); // 토큰이 없는 경우 로그인 페이지로 리다이렉트
        }
    } else {
        next(); // 인증이 필요 없는 페이지라면 이동 허용
    }
});

export default router;