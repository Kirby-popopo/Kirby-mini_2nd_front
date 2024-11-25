<script>
import { useAuthStore } from '@/stores/useAuthStores';
import axios from 'axios';
import LikesModal from './LikesModal.vue';

export default {
    components: {
        LikesModal,
    },
    mounted(){
        // 해당 게시글의 모든 댓글.
        const postPk = this.post.post_pk;
        const userId = this.authStore.userDetail.userId;
        
        axios.get(`http://192.168.5.58:8090/api/comment/${postPk}`)
        .then((response) =>{
            if(response.data.obj != null){
                const responseData = response.data.obj;
                if(responseData != null){
                    for(var comment of responseData){
                        this.comments.push(comment);
                    }
                }
            }
        })

        axios.get(`http://192.168.5.58:8090/api/like/${postPk}`)
        .then((response) => {
            for(var likeUser of response.data.obj){
                this.likeList.push(likeUser.user_id);
            }
        })

        axios.get(`http://192.168.5.58:8090/api/checkLike/${postPk}/${userId}`)
        .then((response) => {
            this.like = response.data.obj;
        })
    },
    data(){
        return {
            comments:[],
            commentHide:true,
            like_img: '',
            likeList: [],
            showLike: false,
            like: true,
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
        },
        likeCount(){
            return this.likeList.length;
        },
        like_img(){
            if(this.like){
                return "/img/dolike.png";
            }else{
                return "/img/unlike.png";
            }
        }
    },
    props:{
        post: Object,
    },
    methods: {
        like_post(){
            const param ={
                post_pk: this.post.post_pk,
                user_id: this.authStore.userDetail.userId
            }
            console.log("param 값 체크")
            console.log(param)

            axios.post('http://192.168.5.58:8090/api/like', param,{
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then((res) => {
                if(this.like){
                    const updatedArr = this.likeList.filter(item => item.user_id == param.user_id);
                    this.likeList = updatedArr;
                    this.like = !this.like;
                }else{
                    console.log(this.authStore.userDetail.userImageUrl)
                    this.likeList.push({
                        profileImage: this.authStore.userDetail.userImageUrl,
                        userId: param.user_id,
                        name: this.authStore.userDetail.name,
                    });
                    this.like = !this.like;
                }
            })
        },
        closeModal(){
            this.showLike = !this.showLike;
        },
        showLikeModal(){
            this.showLike = !this.showLike;
        },
        toggleComments() {
            this.commentHide = !this.commentHide;
        },
        addComment(){
            const param = {
                content: this.$refs.commentInput.value,
                post_pk: this.post.post_pk,
                user_id: this.authStore.userDetail.userId,
            }

            axios.post('http://192.168.5.58:8090/api/comment', param,{
                headers:{
                    'Content-Type': 'application/json',
                }
            })
            .then((response) =>{
                axios.get(`http://192.168.5.58:8090/api/comment/${this.post.post_pk}`)
                .then((response) =>{
                    this.comments = [];

                    if(response.data.obj != null){
                        const responseData = response.data.obj;

                        if(responseData != null){
                            for(var comment of responseData){
                                this.comments.push(comment);
                            }
                        }
                    }
                })
            })

            this.$refs.commentInput.value = '';
        }
    },
};
</script>

<template>
<LikesModal :is-open="showLike" :liked-users="likeList" @customEvent="closeModal"></LikesModal>
<div class="post-header">
        <!-- pinia 에서 유저 이름, 이미지로 설정 -->
        <!-- <img :src="authStore.userDetail.userImageUrl" alt=""> -->
        <img src="http://192.168.5.58:8090/images/default.jpg" alt="">
        <span class="username">{{ post.user_id }}</span>
    </div>
    <div class="post-image">
        <img :src="post.image_url" v-show="isMedia" alt="계란프라이">
    </div style="width: 200px; height: 500px;">
        <div class="embed-responsive embed-responsive-4by3" v-show="!isMedia">
			<video class="embed-responsive-item" :src="post.media_url" controls autoplay></video>
		</div>
    <div class="post-actions">
        <button @click="like_post"><img :src="like_img" width="25px" height="25px"></button>
        <button>💬</button>
        <button>🔗</button>
        <button class="save-button">🔖</button>
    </div>
    <div class="post-likes" @click="showLikeModal">
        {{ likeCount }}명이 좋아합니다.
    </div>
    <div class="post-content">
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
        <input ref="commentInput" type="text" id="comment-input" placeholder="댓글 달기...">
        <button id="add-comment" @click="addComment">게시</button>
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
    /* .modal {
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
    } */
</style>