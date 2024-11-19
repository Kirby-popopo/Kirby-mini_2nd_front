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

import MainPosts from '@/components/child/MainPosts.vue';
import EndPosts from '@/components/child/EndPosts.vue';
import { ref, reactive, provide, onMounted } from 'vue';
import axios from 'axios';

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

onMounted(() => {
    console.log("mounted 실행");
    getPosts();
})

provide('posts', posts);

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