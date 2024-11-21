<script>
import { useAuthStore } from '@/stores/useAuthStores';

export default {
    components: {
    },
    mounted(){
        // 해당 게시글의 모든 댓글.
        const param = {
            postPk: this.post.post_pk,
        }
        axios.post("http://localhost:8090/api/comment", param, {
            headers: "",    
        })
        .then((response) =>{
            console.log(response);
            if(response.data.obj != null){
                const responseData = response.data.obj.content;
                if(responseData != null){
                    for(var comment of responseData){
                        this.comments.push(comment);
                    }
                }
            }else{
                    
            }
        })
    },
    data(){
        return {
            comments:[],
            commentHide:true,
        }
    },
    computed:{
        isMedia(){
            if(this.post.image_url == null){
                return false;
            }else{
                return true;
            }
        },
        authStore(){
            return useAuthStore();
        }
    },
    props:{
        post: Object,
    },
    methods: {
        toggleComments() {
            this.commentHide = !this.commentHide;
        },
    },
};
</script>

<template>
<div class="post-header">
        <!-- pinia 에서 유저 이름, 이미지로 설정 -->
        <!-- <img :src="authStore.userDetail.userImageUrl" alt=""> -->
        <img src="http://localhost:8090/images/default.jpg" alt="">
        <span class="username">{{ post.user_id }}</span>
    </div>
    <div class="post-image">
        <img :src="post.image_url" v-show="isMedia" alt="계란프라이">
    </div>
        <div class="embed-responsive embed-responsive-4by3" v-show="!isMedia">
			<video class="embed-responsive-item" :src="post.media_url" controls autoplay></video>
		</div>
    <div class="post-actions">
        <button>❤️</button>
        <button>💬</button>
        <button>🔗</button>
        <button class="save-button">🔖</button>
    </div>
    <div class="post-likes">
        {{ post.likes_count }}명이 좋아합니다.
    </div>
    <div class="post-content">
        <span class="username">병아리</span>
        <span class="content" >{{ post.contents }}</span>
        <!-- <span class="content" id="full-content" style="display: none;">갓생살자<br>#아침 #맛있다</span> -->
        <!-- <span class="more" id="show-more" onclick="toggleContent()">더 보기</span> -->
    </div>
    <div class="post-comments">
        <p>{{  }}</p>
        <span v-if="commentHide" class="more" id="show-comments" @click="toggleComments">댓글 모두 보기</span>
        <span v-if="!commentHide" class="more" id="show-comments" @click="toggleComments">댓글 숨기기</span>
        <div id="comments" v-show="!commentHide">
            <p v-for="comment of comments" :key="comment">
                <span class="username"> {{ comment.user_id }} </span>{{ comment.content }}
            </p>
        </div>
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