<script>


</script>

<template>

<div class="container-fluid">
  <div style="width: 100vw; height: 100vh;">
  <div class="row" style="height: 100%;">
    <!-- Sidebar -->
    <div class="col-3 bg-black">
      <SideBar/> 
    </div>

    <!-- Main Content -->
    <div class="col-9 bg-black">
      <RouterView/>
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
</style>