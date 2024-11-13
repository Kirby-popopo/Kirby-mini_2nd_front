
<template>
<div class="menu">
    <div v-if="section == 'Search'" id="Search" class="menu-section">
        <h2>검색</h2>
            <input id="inputText" type="text" class="menu-search-bar" placeholder="검색..." @input="inputTextInputEvent">
        <SearchItem :user-list="searchUser"></SearchItem>
    </div>
    
     <div v-if="section == 'alram'" id="notifications" class="menu-section">
       <h2>알림</h2>
       <div class="notification-item">
         <img src="" alt="User">
         <span>사용자1님이 회원님의 게시물을 좋아합니다.</span>
       </div>
       <div class="notification-item">
         <img src="" alt="User">
         <span>사용자2님이 회원님을 팔로우하기 시작했습니다.</span>
       </div>
     </div>
</div>
</template>

<script>
import SearchItem from "@/components/child/MenuSearchItem.vue"

export default {
    components: {
        SearchItem,
    },
    data(){
        return {
            searchUser: [],
        }
    },
    props:{
        section: String,
    },
    methods: {
        inputTextInputEvent: function() {
        const param = {
            userId: inputText.value,
        }

        if(inputText.value != ''){
                this.$axios.post("/Search", param)
                .then((response) =>{
                    this.searchUser = response.data.obj;
                })
        }else{ // 이거 서버에서 처리해야함.
            this.searchUser = [];
        }
      },
    },
};
</script>

<style lang="css" scoped>
    .menu {
        position: fixed;
        background-color: #000000;
        border: 3px solid #121212;
        box-sizing: border-box;
        top: 0;
        left: 200px;
        width: 250px;
        height: 100%;
        width: 200px;
        color: #fff;
        z-index: 5000;
    }
    .menu-section.active {
        opacity: 1;
        visibility: visible;
    }
    .menu-search-bar {
        width: 90%;
        border: 1px solid #dbdbdb;
        border-radius: 5px;
        margin-bottom: 20px;
    }
    .notification-item, .menu-search-item {
        display: flex;
        font-size: 13px;
        align-items: center;
        margin-bottom: 10px;
    }
    .notification-item img, .menu-search-item img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
    }
</style>