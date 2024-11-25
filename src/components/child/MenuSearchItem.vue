<template>
    <div 
      v-for="item in userList"
      :key="item.userId"
      class="menu-search-item"
      @click="selectUser(item)"
    >
      <template v-if="allowNavigation">
        <router-link :to="{ path: '/profile', query: { userId: item.userId } }" @click.native="refresh">
          <img :src="item.profileImage" alt="User" width="20px" />
          <span>{{ item.name }}</span>
        </router-link>
      </template>
      <template v-else>
        <div class="search-result-item">
          <img :src="item.profileImage" alt="User" width="20px" />
          <span>{{ item.name }}</span>
        </div>
      </template>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      userList: Array,
      allowNavigation: {
        type: Boolean,
        default: true, // 기본값: router-link 활성화
      },
    },
    emits: ["select-user"], // 이벤트 선언
    methods: {
      selectUser(user) {
        this.$emit("select-user", user); // 클릭된 유저 정보를 부모로 전달
      },
      refresh(){
        setTimeout(() => {
          location.reload();
        }, 100);
      }
    },
  };
  </script>
  
  <style scoped>
  .menu-search-item {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    cursor: pointer; /* 클릭 가능하도록 스타일 추가 */
  }
  
  .menu-search-item:hover {
    background-color: #333; /* 호버 시 색상 변경 */
  }
  
  .search-result-item img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }
  
  .search-result-item span {
    color: white;
    font-size: 16px;
    font-weight: bold;
    transition: color 0.3s ease;
  }
  
  .menu-search-item:hover span {
    color: #bbb; /* 밝은 회색 */
  }
  </style>
  