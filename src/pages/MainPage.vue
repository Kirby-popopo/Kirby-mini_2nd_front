<template>
<div class="container">
    <div class="post">
        <MainPosts/>
    </div>
    <div class="post">
        <MainPosts/>
    </div>
    <div class="post">
        <MainPosts/>
    </div>
    <div class="post">
        <MainPosts/>
    </div>
    <div class="end-posts">
        <EndPosts/>
    </div>
</div>
</template>

<script setup>

import MainPosts from '@/components/child/MainPosts.vue';
import EndPosts from '@/components/child/EndPosts.vue';

</script>

<style>

.container {
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%; /* 부모 높이에 맞춤 */
}

.post {
  background-color: #1e1e1e;
  border: 1px solid #2c2c2c;
  border-radius: 3px;
  margin-bottom: 20px;
  width: 100%;
}
.end-posts {
  background-color: #1e1e1e;
  border: 1px solid #2c2c2c;
  border-radius: 3px;
  margin-bottom: 60px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 1200px) {
.container {
max-width: calc(100% - 40px);
padding: 20px;
}
}

</style>