import { createWebHistory, createRouter } from "vue-router"
import test from '@/components/Test.vue'
import main from '@/pages/MainPage.vue'
import profile from '@/pages/ProfilePage.vue'
import ProfileEdit from "@/pages/ProfileEditPage.vue"
import login from '@/pages/LoginPage.vue'
import signup from '@/pages/SignUpPage.vue'

import RoomList from '../views/chat/RoomList.vue'  // 채팅방 출력 컴포넌트 임포트
import ChatRoom from '../views/chat/ChatRoom.vue' // 채팅방 입장 (상세) 컴포넌트 임포트

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
    },
    {
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


export default router;