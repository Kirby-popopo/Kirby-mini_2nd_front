<script>


</script>

<template>
    <div class="SideBarStyle">
      <SideBar/>
    </div>
    <div class="ContentsStyle">
      <RouterView/>
    </div>
</template>

<style lang="css">
  #SideBarStyle {
    position: fixed;
    background-color: #000000;
    color: #fff;
  }

  #ContentsStyle{
    display: flex;
    position: fixed;
    left: 200px;
    background-color: #000000;
  }

  a {
    text-decoration: none;
  }
  a:visited{
    color: inherit;
  }
</style>