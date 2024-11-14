<template>
    <div class="menu-search-item" v-for="(item, index) in userList">
        <router-link :to="{ path: '/profile', query: { userId: item.userId } }">
            <img :src="item.profileImage" alt="User" width="20px">
            <span>{{item.name}}</span>
        </router-link>
    </div>
</template>

<script>
export default {
    props:{
        userList: Array,
    },
};
</script>

<style scoped>
    .menu-search-item{
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }

</style>