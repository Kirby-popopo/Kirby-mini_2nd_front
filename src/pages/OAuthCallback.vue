<template>
<div>OAuth 로그인</div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStores';
import axios from 'axios';

const router = useRouter();
const authStore = useAuthStore();

onMounted(() => {
    console.log('OAuth2 로그인 - onMounted 시작');
    
    // URL에서 code 값 추출
    const query = new URLSearchParams(window.location.search);
    const code = query.get('code');

    if (code) {
        console.log("코드값:", code);

        // 백엔드로 POST 요청 보내기
        axios.post('http://192.168.5.58:8090/api/auth/oauth2-login', {
            code: code,
            redirect_uri: 'http://localhost:5173/oauth2/callback'
        }).then((response) => {
            if (response.headers['authorization']) {
                // Authorization 헤더에서 JWT 토큰 추출
                const authHeader = response.headers['authorization'];

                if(authHeader) {
                    // 토큰 재사용성을 높이기 위해 앞의 Bearer 제거
                    const jwtToken = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
                    console.log('JWT 토큰 받아옴:', jwtToken);

                    // Pinia 스토어 및 로컬 스토리지에 토큰 저장
                    authStore.setToken(jwtToken);
                    localStorage.setItem('authToken', jwtToken);
                    
                    console.log("Pinia에 저장된 토큰:", authStore.token);
                
                    // 메인 페이지로 리다이렉트
                    router.push('/');
                } else {
                    console.error('Authorization 헤더가 없습니다.');
            }
        } else {
            console.error('Authorization 헤더가 없습니다.');
        }
        }).catch((error) => {
            console.error('OAuth2 로그인 실패:', error);
            // 로그인 실패 시 로그인 페이지로 이동
        });
    } else {
        console.warn("코드가 없습니다. OAuth2 리다이렉트에 문제가 발생했을 수 있습니다.");
        // code 값이 없는 경우 로그인 페이지로 이동
    }
});
</script>
