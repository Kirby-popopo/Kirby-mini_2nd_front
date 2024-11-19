<template>
<div class="main-container">
    <div class="post" v-for="post in posts">
        <MainPosts :post="post"/>
    </div>
    
    <div class="end-posts" v-show="showEndPosts">
        <EndPosts/>
    </div>
</div>
</template>

<script setup>
import { useAuthStore } from '@/stores/useAuthStores';
import { ref, reactive, provide, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import MainPosts from '@/components/child/MainPosts.vue';
import EndPosts from '@/components/child/EndPosts.vue';

const posts = reactive([]);
const page = ref(0);
const showEndPosts = ref(false);

const getPosts = ()=>{
    console.log("getPosts 실행");
    //pinia 에서 받아오게 수정할 것임.
    const param = {
        userId: '1234',
        page: page.value,
    }

    console.log(param);
    
    axios.post("http://localhost:8090/mainPage", param)
        .then((response) =>{
            console.log("axios 실행");
            console.log(response);
            const responseData = response.data.obj.content;
            console.log(responseData)
                if(responseData.length != 0){
                    for(var post of responseData){
                        console.log(post);
                        posts.push(post);
                    }
                }else{
                    showEndPosts.value = true;
                }

            page.value++;
        })
    }

onUnmounted(() => {
    posts = [];
    page.value = 0;
    showEndPosts.value = false;
})

provide('posts', posts);
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
                getPosts();
        });
        return {};
    }
};
</script>

<style>

.main-container {
    overflow-y: auto;
    overflow-x: hidden;
    height: 100%;
    width: 50%;
}

.post {
    border: 1px solid #2c2c2c;
    border-radius: 3px;
    margin-bottom: 20px;
    color: white;
}
.end-posts {
    border: 1px solid #2c2c2c;
    border-radius: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
}


</style>