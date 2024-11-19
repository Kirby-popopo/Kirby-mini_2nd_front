<script>
export default {
    components: {
    },
    data(){
        return {
        }
    },
    props:{
        post: Object,
    },
    methods: {
   
    },
};
</script>

<template>
<div class="post-header">
        <!-- pinia 에서 유저 이름, 이미지로 설정 -->
        <img src="https://media.istockphoto.com/id/466167557/ko/%EC%82%AC%EC%A7%84/%EC%8B%A0%EC%83%9D%EC%95%84-chick.jpg?s=612x612&w=0&k=20&c=94vZS_L2t47Yb1DtHTYv1VBjVP6Ecu_SgmH79aCfEfE=" alt="병아리 프로필">
        <span class="username">병아리</span>
    </div>
    <div class="post-image">
        <img :src="post.image_url" alt="계란프라이">
    </div>
    <div class="post-actions">
        <button>❤️</button>
        <button>💬</button>
        <button>🔗</button>
        <button class="save-button">🔖</button>
    </div>
    <div class="post-likes">
        뱀님 외 2명이 좋아합니다
    </div>
    <div class="post-content">
        <span class="username">병아리</span>
        <span class="content" >{{ post.contents }}</span>
        <!-- <span class="content" id="full-content" style="display: none;">갓생살자<br>#아침 #맛있다</span> -->
        <!-- <span class="more" id="show-more" onclick="toggleContent()">더 보기</span> -->
    </div>
    <div class="post-comments">
        <p>댓글 2개</p>
        <div id="comments" style="display: none;">
            <p><span class="username">뱀</span> 맛있겠다 :)</p>
            <p><span class="username">사자</span> @호랑이 갓생 가보자고</p>
        </div>
        <span class="more" id="show-comments" onclick="toggleComments()">댓글 모두 보기</span>
    </div>
    <div class="comment-input">
        <input type="text" id="comment-input" placeholder="댓글 달기...">
        <button id="add-comment" onclick="addComment()">게시</button>
    </div>
</template>

<style>
    .post-header {
        display: flex;
        padding: 16px;
        
    }
    .post-header img {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        margin-right: 10px;
    }
    .post-header .username {
        font-weight: 600;
    }
    .post-image img {
        width: 100%;
        height: auto;
    }
    .post-actions {
        display: flex;
        padding: 4px 16px;
    }
    .post-actions button {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 24px;
        margin-right: 16px;
        color: #fff;
    }
    .post-likes {
        padding: 0 16px;
        margin-bottom: 8px;
        font-weight: 600;
    }
    .post-content, .post-comments {
        padding: 0 16px;
    }
    .post-content .username, .post-comments .username {
        font-weight: 600;
        margin-right: 5px;
    }
    .post-content .more, .post-comments .more {
        color: #a8a8a8;
        cursor: pointer;
    }
    .comment-input {
        border-top: 1px solid #2c2c2c;
        padding: 16px;
    }
    .comment-input input {
        width: 100%;
        border: none;
        outline: none;
        font-size: 14px;
        background-color: #1e1e1e;
        color: #fff;
    }
    .modal {
        display: none;
        position: fixed;
        z-index: 1;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0,0,0,0.4);
    }
    .modal-content {
        background-color: #262626;
        margin: 15% auto;
        padding: 20px;
        border: 1px solid #363636;
        width: 300px;
        text-align: center;
    }
    .modal-content h2 {
        margin-top: 0;
    }
    .modal-content img {
        width: 50px;
        height: 50px;
        margin: 20px 0;
    }
    .modal-content p {
        margin-bottom: 20px;
    }
    .modal-content button {
        background-color: #0095f6;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
</style>