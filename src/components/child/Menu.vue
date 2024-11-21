
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
            if(inputText.value.substr(0,1) == '#'){
                // 게시글 검색
                // inputText.value.substr(1, inputText.value.length)
                // 첫 글자 # 일때 게시글 검색하는 post로 ajax요청.
                // 첫 글자 #을 제외한 나머지 문자열로 해시태그 검색
                console.log("게시글 검색 모드");
                console.log("찾으려는 게시글 ------------");
                console.log(inputText.value.substr(1, inputText.value.length));
            }else{
                console.log("유저 검색 모드");
                // 유저 검색
                this.$axios.post("/api/SearchUser", param)
                .then((response) =>{
                    this.searchUser = response.data.obj;
                })
            }
        }else{
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