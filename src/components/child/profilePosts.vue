<script>
import endPosts from '@/components/child/EndPosts.vue';

export default {
    components: {
        endPosts
    },
    data(){
        return {
            viewPost: {},
            isModalOpen: false,
        }
    },
    computed:{
    },
    props:{
        posts: Array,
        showEndPosts: Boolean,
    },
    methods: {
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
        },
        clearPostDetail(){
            this.viewPost = {};
            this.isModalOpen = false;
        }
    },
    mounted(){
        console.log(this.posts);
    }
};
</script>

<template>
    <div v-if="isModalOpen" class="modal-overlay" @click="clearPostDetail">
        <div class="modal-new">
            <img :src="viewPost.image_url" alt="" v-show="viewPost.image_url != null">
            <video :src="viewPost.media_url" autoplay v-show="viewPost.media_url != null"></video>
        </div>
    </div>
        <main class="gallery">
            <div class="gallery-item" v-show="!showEndPosts" v-for="(post) in posts" :key="post" @click="viewDetail(post)">
                <img v-show="!isMedia(post)" :src="post.image_url" alt="게시물 1">
                <video v-show="isMedia(post)" :src="post.media_url"
                poster="http://localhost:8090/images/media_default.jpg" 
                muted
                ></video>
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
    width: 100%;
    height: 100px;
    gap: 28px;
}
.gallery-item {
    aspect-ratio: 1 / 1;
    overflow: hidden;
    margin-bottom: 200px;
    max-width: 300px;
    min-width: 100px;
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