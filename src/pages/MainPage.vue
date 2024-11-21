<template>
<div class="main-container" ref="scrollcheck">
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
import { ref, reactive, provide, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import MainPosts from '@/components/child/MainPosts.vue';
import EndPosts from '@/components/child/EndPosts.vue';

const authStore = useAuthStore();
const posts = reactive([]);
const page = ref(0);
const showEndPosts = ref(false);
const scrollcheck = ref(null);
const router = useRouter();


const getPosts = ()=>{
    const param = {
        userId: authStore.userDetail.userId,
        page: page.value,
    }

    console.log(param);
    
    axios.post("http://localhost:8090/api/mainPage", param, {
        headers: "",
    })
        .then((response) =>{
            console.log(response);
            if(response.data.obj != null){
                const responseData = response.data.obj.content;
                if(responseData != null){
                    for(var post of responseData){
                        posts.push(post);
                    }
                }
            }else{
                    showEndPosts.value = true;
            }
            page.value++;
        })
    }

// onUnmounted(() => {
//     posts = [];
//     page.value = 0;
//     showEndPosts.value = false;
// })

provide('posts', posts);
        
onMounted(() => {
    getPosts();
    window.addEventListener("scroll", scrollHandler);
});

const scrollHandler = () => {
   
    const remainingHeight = scrollcheck.value.scrollHeight - (window.innerHeight + window.scrollY);
    if(remainingHeight <= -15){
        getPosts();
    }
}

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