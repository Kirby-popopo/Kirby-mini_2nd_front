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


const authStore = useAuthStore();
const { userDetail } = authStore;

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