<script>
import { useAuthStore } from '@/stores/useAuthStores';
import profilePosts from '@/components/child/profilePosts.vue';
import axios from 'axios';

export default {
    name: "ProfilePage",
    components: {
        profilePosts,
        },  
    watch: {
        '$route'() {
            this.loadData();
        }
    },
    data() {
        return {
            userId: '',
            userName: 'test',
            userProfileImage: '',
            userDescription: '',
            follower: [],
            following: [],
            posts: [],
            showEndPosts: false,
        };
    },
    computed:{
        isSameUser(){
            return this.$route.query.userId == this.authStore.userDetail.userId;
        },
        authStore(){
            return useAuthStore();
            }
        },
    methods: {
        logOut(){
            axios.get("http://192.168.5.58:8090/api/auth/logout").then((res) => {
                if (res.headers['authorization'] == 'delete') {
                    this.authStore.clearToken();
                    localStorage.removeItem('authToken');
                    this.$router.push('/login');
                }
                window.alert(res.data);
            }).catch(() => {
            window.alert("로그아웃을 수행하는 동안 오류가 발생하였습니다..");
            });
        },

        async loadData(){
            // URL에서 쿼리 파라미터 가져오기
            this.userId = this.$route.query.userId;
            const param = {
                userId: this.userId,
            }
            const response = await this.$axios.post("/api/Profile", param);
            console.log(response);
            this.userName = response.data.obj.userName;
            this.userProfileImage = response.data.obj.userProfileImage;
            this.userDescription = response.data.obj.userDescription;
            this.following = response.data.obj.following;
            this.follower = response.data.obj.follower;
        },

        getPosts(){
            const param = {
                userId: this.$route.query.userId,
            }

            console.log(param);
            
            this.$axios.post("/api/profilePage", param, {
                headers: "",
            })
                .then((response) =>{
                    
                    if(response.data.obj != null){
                        const responseData = response.data.obj;
                        console.log(responseData);
                        if(responseData != null){
                            for(var post of responseData){
                                this.posts.push(post);
                            }
                            console.log(this.posts);
                        }
                    }else{
                            this.showEndPosts = true;
                    }
                })
            }
        },
    mounted() {
        this.loadData();
        this.getPosts();
    },
};
</script>

<template>
    <header class="profile-header">
        <img v-bind:src="userProfileImage" alt="프로필 사진" class="profile-picture">
        <div class="profile-info">
            <h1 class="profile-username">{{ userName }}</h1>
            <div class="profile-actions">
                <!-- 프로필 편집 버튼, 팔로우 버튼 -->
            <router-link to="/profileEdit" v-show="isSameUser">
                <button class="profile-button">프로필 편집</button><!-- 로그인 유저와 동일하면-->
            </router-link>

                <button  class="profile-button" id="unfollow-button" v-show="!isSameUser" >팔로잉</button><!-- 아닐시 -->

                <!-- 보관된 스토리 보기, 메시지 보내기 -->
                <button class="profile-button" @click="logOut">로그 아웃</button><!-- 로그인 유저와 동일하면-->
                <button class="profile-button">메시지 보내기</button><!-- 아닐시 -->
                <svg aria-label="옵션" class="settings-icon" fill="#262626" height="24" viewBox="0 0 48 48" width="24">
                    <path d="M46.7 20.6l-2.1-1.1c-.4-.2-.7-.5-.8-1-.5-1.6-1.1-3.2-1.9-4.7-.2-.4-.3-.8-.1-1.2l.8-2.3c.2-.5 0-1.1-.4-1.5l-2.9-2.9c-.4-.4-1-.5-1.5-.4l-2.3.8c-.4.1-.8.1-1.2-.1-1.4-.8-3-1.5-4.6-1.9-.4-.1-.8-.4-1-.8l-1.1-2.2c-.3-.5-.8-.8-1.3-.8h-4.1c-.6 0-1.1.3-1.3.8l-1.1 2.2c-.2.4-.5.7-1 .8-1.6.5-3.2 1.1-4.6 1.9-.4.2-.8.3-1.2.1l-2.3-.8c-.5-.2-1.1 0-1.5.4L5.9 8.8c-.4.4-.5 1-.4 1.5l.8 2.3c.1.4.1.8-.1 1.2-.8 1.5-1.5 3-1.9 4.7-.1.4-.4.8-.8 1l-2.1 1.1c-.5.3-.8.8-.8 1.3V26c0 .6.3 1.1.8 1.3l2.1 1.1c.4.2.7.5.8 1 .5 1.6 1.1 3.2 1.9 4.7.2.4.3.8.1 1.2l-.8 2.3c-.2.5 0 1.1.4 1.5L8.8 42c.4.4 1 .5 1.5.4l2.3-.8c.4-.1.8-.1 1.2.1 1.4.8 3 1.5 4.6 1.9.4.1.8.4 1 .8l1.1 2.2c.3.5.8.8 1.3.8h4.1c.6 0 1.1-.3 1.3-.8l1.1-2.2c.2-.4.5-.7 1-.8 1.6-.5 3.2-1.1 4.6-1.9.4-.2.8-.3 1.2-.1l2.3.8c.5.2 1.1 0 1.5-.4l2.9-2.9c.4-.4.5-1 .4-1.5l-.8-2.3c-.1-.4-.1-.8.1-1.2.8-1.5 1.5-3 1.9-4.7.1-.4.4-.8.8-1l2.1-1.1c.5-.3.8-.8.8-1.3v-4.1c.4-.5.1-1.1-.4-1.3zM24 41.5c-9.7 0-17.5-7.8-17.5-17.5S14.3 6.5 24 6.5 41.5 14.3 41.5 24 33.7 41.5 24 41.5z"></path>
                </svg>
            </div>
            <div class="profile-stats">
                <div class="stat">
                    게시물 <span class="stat-value">{{ posts.length }}</span>
                </div>
                <div class="stat">
                    팔로워 <span id="followCount" class="stat-value">{{ follower.length }}</span>
                </div>
                <div class="stat">
                    팔로우 <span class="stat-value">{{ following.length }}</span>
                </div>
            </div>
            <!-- <div class="profile-fullname">{{ userName }}</div>-->
            <div class="profile-description">{{ userDescription }}</div>
        </div>
    </header>
    <div>
    <profilePosts :posts="posts" :show-end-posts="showEndPosts"></profilePosts>
    </div>
</template>

<style lang="css">
    .profile-header {
        width: 100%;
        margin: 0 auto;
        color: white;
        display: flex;
    }
    .profile-picture {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        margin-right: 100px;
    }
    .profile-info {
        flex-grow: 1;
    }
    .profile-username {
        font-size: 28px;
        font-weight: 300;
        margin-bottom: 12px;
    }
    .profile-actions {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }
    .profile-button {
        display: block;
        background-color: #fafafa;
        border: 1px solid #dbdbdb;
        color: #262626;
        padding: 5px 9px;
        font-size: 14px;
        font-weight: 600;
        border-radius: 4px;
        margin-right: 8px;
        cursor: pointer;
        width: 120px;
        height: 50px;
    }
    .profile-button:hover {
                background-color: #efefef;
                border-color: #c7c7c7;
            }
    .settings-icon {
        width: 24px;
        height: 24px;
        cursor: pointer;
    }
    .profile-stats {
        display: flex;
        margin-bottom: 20px;
    }
    .stat {
        margin-right: 40px;
        font-size: 16px;
    }
    .stat-value {
        font-weight: 600;
    }
    .profile-fullname {
        font-weight: 600;
        font-size: 16px;
    }
.following-button {
    background-color: #efefef;
    color: #000;
    border: none;
}
.message-button {
    background-color: #efefef;
    color: #000;
    border: none;
}
/*.stat {
    margin-right: 40px;
}
.stat-value {
    font-weight: 600;
}*/
.profile-bio {
    margin-bottom: 20px;
}
.profile-bio h2 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 5px;
}
.profile-bio p {
    margin: 0;
}
</style>