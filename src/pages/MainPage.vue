<template>
    <h1>{{ userDetail.userId }}hhhhhh</h1>
<div class="container">
</div>
</template>

<script setup>
import { useAuthStore } from '@/stores/useAuthStores';

const authStore = useAuthStore();
const { userDetail } = authStore;
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