<template>
<div class="container">
    <div class="post">
        <MainPosts/>
    </div>
    <div class="post">
        <MainPosts/>
    </div>
    <div class="post">
        <MainPosts/>
    </div>
    <div class="post">
        <MainPosts/>
    </div>
    <div class="end-posts">
        <EndPosts/>
    </div>
</div>
</template>

<script>
import { useAuthStore } from '@/stores/useAuthStores';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const router = useRouter();
        
        onMounted(() => {
            // 현재 URL에서 Access Token 추출
            const hash = window.location.hash;
            if(hash.includes("access_token")){
                const params = new URLSearchParams(hash.substring(1));
                const accessToken = params.get('access_token');

                if(accessToken) {
                    // Access Token을 pinia에 저장
                    useAuthStore.setToken('accessToken', accessToken);
                    window.history.replaceState(null, null, window.location.pathname);
                    console.log('로그인 성공! Access Token:', accessToken);
                } else {
                    console.error('Access Token이 존재하지 않습니다.');
                }
            } else {
                // Token이 없는 경우 로그인 페이지로
                console.error('로그인 실패');
                router.push('/login');
            }
        });
        return {};
    }
};
</script>

<style>

.container {
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%; /* 부모 높이에 맞춤 */
}

.post {
  background-color: #1e1e1e;
  border: 1px solid #2c2c2c;
  border-radius: 3px;
  margin-bottom: 20px;
  width: 100%;
}
.end-posts {
  background-color: #1e1e1e;
  border: 1px solid #2c2c2c;
  border-radius: 3px;
  margin-bottom: 60px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 1200px) {
.container {
max-width: calc(100% - 40px);
padding: 20px;
}
}

</style>