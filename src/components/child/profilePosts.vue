<script>
import endPosts from '@/components/child/EndPosts.vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/useAuthStores';

export default {
    components: {
        endPosts
    },
    data(){
        return {
            viewPost: {},
            isModalOpen: false,
            comments: [],
        }
    },
    computed:{
        authStore(){
            return useAuthStore();
        }
    },
    props:{
        posts: Array,
        showEndPosts: Boolean,
    },
    methods: {
        addComment(){
            if(this.$refs.commentInput.value == ''){
                return;
            }
            const param = {
                content: this.$refs.commentInput.value,
                post_pk: this.viewPost.post_pk,
                user_id: this.authStore.userDetail.userId,
            }

            axios.post('http://192.168.5.58:8090/api/comment', param,{
                headers:{
                    'Content-Type': 'application/json',
                }
            })
            .then((response) =>{
                axios.get(`http://192.168.5.58:8090/api/comment/${this.viewPost.post_pk}`)
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
        },
        isMedia(post){
            if(post.image_url == null){
                return true;
            }else{
                return false;
            }
        },
        viewDetail(post){
            this.viewPost = post;
            this.isModalOpen = true;

            axios.get(`http://192.168.5.58:8090/api/comment/${post.post_pk}`)
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
        },
        clearPostDetail(){
            this.viewPost = {};
            this.isModalOpen = false;
            this.comments = [];
        },
    },
    mounted(){
        console.log(this.posts);
    }
};
</script>

<template>
  <div v-if="isModalOpen" class="modal-overlay d-flex align-items-center justify-content-center" @click="clearPostDetail">
    <div class="modal-new bg-white rounded" @click.stop>
      <div class="row no-gutters">
        <div class="col-md-7 media-container">
          <img :src="viewPost.image_url" alt="" v-if="viewPost.image_url" class="img-fluid">
          <video :src="viewPost.media_url" controls v-if="viewPost.media_url" class="img-fluid"></video>
        </div>
        <div class="col-md-5 d-flex flex-column">
          <div class="post-content p-3 border-bottom">
            {{ viewPost.contents }}
          </div>
          <div class="comments-container flex-grow-1 overflow-auto p-3">
            <div v-for="comment of comments" class="mb-2">
              <span class="comment-user font-weight-bold mr-2">{{ comment.user_id }}</span>
              <span class="comment-detail">{{ comment.content }}</span>
            </div>
          </div>
          <div class="post-actions p-3 border-top">
            <div class="comment-input">
                <input ref="commentInput" type="text" id="comment-input" placeholder="댓글 달기..." style="width: 300px; height: 50px;">
                <button style="border-radius: 10%; color: white; background-color: black" id="add-comment" @click="addComment">게시</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
        <main class="gallery">
            <div class="gallery-item" v-show="!showEndPosts" v-for="(post) in posts" :key="post" @click="viewDetail(post)">
                <img v-show="!isMedia(post)" :src="post.image_url" alt="게시물 1">
                <video v-show="isMedia(post)" :src="post.media_url" muted></video>
            </div>
        </main>
    <div class="endPosts">
        <endPosts v-show="showEndPosts"></endPosts>
    </div>
</template>

<style>
.modal-overlay {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
}
.comment-input{
    display: flex;
}
.comment-detail{
    border: solid 1px black;
}

.comment-user{
    border: solid 1px black;
}

.row {
    border: solid 2px white;
}

.modal-new {
    max-width: 935px;
    width: 100%;
    height: 600px;
}

.media-container {
    background-color: #000;
    height: 600px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.media-container img,
.media-container video {
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
}

.comments-container {
    max-height: 350px;
}

.post-actions .btn-link {
    color: #262626;
    font-size: 1.5rem;
}

.endPosts{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
}
.gallery {
    padding-top: 50px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    width: 500px;
    height: 100px;
    gap: 28px;
}
.gallery-item {
    aspect-ratio: 1 / 1;
    overflow: hidden;
    width: 200px;
    height: 200px;
}
.gallery-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border: solid 2px white;
}

.gallery-item video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border: double 2px black;
}

</style>