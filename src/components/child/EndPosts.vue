<script>

export default {
    methods:{
        refresh(){
            this.$router.go(0);    
        }
    }
}
</script>

<template>
    <div class="end-of-feed">
        <div class="end-of-feed__icon">🏁</div>
        <h2 class="end-of-feed__title">모든 게시물을 보았습니다</h2>
        <p class="end-of-feed__message">최신 게시물을 모두 확인하셨습니다.</p>
        <button class="end-of-feed__button" @click="refresh">새로고침</button>
    </div>
</template>

<style>
.end-of-feed {
display: flex;
flex-direction: column;
align-items: center;
background-color: '#ffffff';
border: 1px solid '#dbdbdb';
border-radius: 3px;
padding: 20px;
text-align: center;
max-width: 350px;
width: 100%;
}
        .end-of-feed__icon {
            font-size: 48px;
            margin-bottom: 16px;
        }
        .end-of-feed__title {
            font-size: 18px;
            font-weight: 600;
            color: #262626;
            margin-bottom: 8px;
        }
        .end-of-feed__message {
            font-size: 14px;
            color: #8e8e8e;
            margin-bottom: 16px;
        }
        .end-of-feed__button {
            background-color: #0095f6;
            color: #ffffff;
            border: none;
            border-radius: 4px;
            padding: 8px 16px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        .end-of-feed__button:hover {
            background-color: #0081d6;
        }
</style>