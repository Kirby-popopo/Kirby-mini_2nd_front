<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import SideBar from './components/SideBar.vue';

export default {
  name: 'AppLayout',
  components: { SideBar },
  setup() {
    const route = useRoute();

    // 현재 라우트의 meta.showSidebar를 감지
    const showSidebar = computed(() => route.meta.showSidebar !== false);

    // Main Content의 클래스 동적으로 변경
    const mainContentClass = computed(() =>
      showSidebar.value ? 'col-9 bg-black' : 'col-12 bg-black'
    );

    return {
      showSidebar,
      mainContentClass,
    };
  },
};

</script>

<template>

<div class="container-fluid">
    <div style="width: 100vw; height: 100vh;">
      <div class="row" style="height: 100%;">
        <!-- Sidebar -->
        <div v-if="showSidebar" class="col-3 bg-black">
          <SideBar />
        </div>

        <!-- Main Content -->
        <div :class="mainContentClass">
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>

<style>  
  a {
    text-decoration: none;
  }
  a:visited{
    color: inherit;
  }
  /* html, body, #app {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden; 
  } 윤태현 추가. */
</style>