<script>
import { useAuthStore } from '@/stores/useAuthStores';
import Menu from './child/Menu.vue';
import CreatePost from './child/CreatePost.vue';

export default {
  name: "SideBar",
  components: {
    Menu,
    CreatePost
  },
  data() {
    return {
      isMenuVisible: false,
      isCreatePost: false,
      Psection: '',
    };
  },
  computed:{
    authStore(){
          return useAuthStore();
        }
    },
  methods: {
    CloseCreateModal(){
      console.log("test")
      this.isCreatePost = false;
    },
    ClickMenu(selcetMenu) {
      switch (selcetMenu) {
        case 'Search':
          if(this.Psection == 'Search'){
            this.isMenuVisible = !this.isMenuVisible;
          }else{
            this.Psection = 'Search';
            this.isMenuVisible = !this.isMenuVisible;
          }
          break;
        case 'alram':
          if(this.Psection == 'alram'){
            this.isMenuVisible = !this.isMenuVisible;  
          }else{
            this.Psection = 'alram';
            this.isMenuVisible = true;
          }
          break;
        case 'create':
          this.isCreatePost = true;
          break;
        default:
        this.isMenuVisible = false;
      }
      
    },
  },
};

</script>

<template>
    <CreatePost v-if="isCreatePost" :isModalOpen @customEvent="CloseCreateModal"></CreatePost>
    <Menu v-if="isMenuVisible" :section="Psection"></Menu>
    <div class="sidebar">
      <router-link to="/" style="text-decoration: none;">
        <div class="sidebar-item" @click="ClickMenu('close')">
            <img src="https://img.icons8.com/material-outlined/24/ffffff/instagram-new.png" alt="Instagram">
            <span class="sidebar-text">Instagram</span>
        </div>
      </router-link>

      <router-link to="/"style="text-decoration: none;">
        <div class="sidebar-item" @click="ClickMenu('close')">
            <img src="https://img.icons8.com/material-outlined/24/ffffff/home&#45;&#45;v2.png" alt="홈">
            <span class="sidebar-text">홈</span>
        </div>
      </router-link>
        <div class="sidebar-item" @click="ClickMenu('Search')">
            <img src="https://img.icons8.com/material-outlined/24/ffffff/search.png" alt="검색">
            <span class="sidebar-text">검색</span>
        </div>  
        <div class="sidebar-item">
            <img src="https://img.icons8.com/material-outlined/24/ffffff/compass.png" alt="탐색 탭">
            <span class="sidebar-text">탐색 탭</span>
        </div>  
        
      <router-link to="/roomList" style="text-decoration: none;">
        <div class="sidebar-item">
            <img src="https://img.icons8.com/material-outlined/24/ffffff/facebook-messenger.png" alt="메시지">
            <span class="sidebar-text">메시지</span>
        </div>  
      </router-link>
        <div class="sidebar-item" @click="ClickMenu('alram')">
            <img src="https://img.icons8.com/material-outlined/24/ffffff/like.png" alt="알림">
            <span class="sidebar-text">알림</span>
        </div>  

        <div class="sidebar-item" @click="ClickMenu('create')">
            <img src="https://img.icons8.com/material-outlined/24/ffffff/plus-math.png" alt="만들기">
            <span class="sidebar-text">만들기</span>
        </div> 

        <!-- 로그인 정보를 받아서 처리 예정 -->
      <router-link :to="{ path: '/profile', query: { userId: authStore.userDetail.userId } }" style="text-decoration: none;">
        <div class="sidebar-item" @click="ClickMenu('close')">
            <img src="https://img.icons8.com/material-outlined/24/ffffff/user-male-circle.png" alt="프로필">
            <span class="sidebar-text">프로필</span>
        </div>  
      </router-link>
        <!-- <script src="menu.js"></script> -->    
        <!--릴스 기능 추후 생각-->
        <!--<div class="sidebar-item">
          <img src="https://img.icons8.com/material-outlined/24/ffffff/instagram-reel.png" alt="릴스">
          <span class="sidebar-text">릴스</span>
        </div>-->
    </div>
    
</template>
<style lang="css">

.sidebar {
    background-color: #000;
    border: 3px solid #121212;
    color: #fff;
    height: 100%;
    width: 200px;
}

.sidebar-item {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    cursor: pointer;
    padding: 10px;
    border-radius: 10px;
    transition: background-color 0.3s;
}

.sidebar-item:hover {
    background-color: #1e1e1e;
}

.sidebar-item img {
    width: 24px;
    height: 24px;
    margin-right: 10px;
}

.sidebar-text {
    font-size: 14px;
}
</style>
