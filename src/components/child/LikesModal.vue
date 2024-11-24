<template>
    <div v-if="isOpen" class="modal-overlay d-flex align-items-center justify-content-center">
        <div class="modal-content bg-white rounded-lg" style="max-width: 400px; width: 100%;">
        <div class="modal-header border-bottom p-3">
            <h5 class="modal-title m-0">Likes</h5>
            <button @click="close" type="button" class="close" aria-label="Close" style="width: 50px; border-radius: 20%;">
            <span aria-hidden="true">&times;</span>
        </button>
        </div>
        <div class="modal-body p-0" style="max-height: 300px; overflow-y: auto;">
            <ul class="list-unstyled m-0">
            <li v-for="user in likedUsers" :key="user" class="border-bottom p-3">
                <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                    <img :src="user.profileImage" class="rounded-circle mr-3" style="width: 44px; height: 44px; object-fit: cover;">
                <div>
                    <h6 class="mb-0">{{ user.userId }}</h6>
                    <small class="text-muted">{{ user.name }}</small>
                </div>
                </div>
                <button class="btn btn-sm btn-outline-primary" @click="toggleFollow(user)" style="width: 100px;">
                    {{ user.isFollowing ? 'Following' : 'Follow' }}
                </button>
            </div>
            </li>
        </ul>
        </div>
    </div>
    </div>
</template>
  
  <script>
  export default {
    props: {
      isOpen: {
        type: Boolean,
        required: true
      },
      likedUsers: {
        type: Array,
        required: true
      }
    },
    methods: {
      close() {
        this.$emit('custom-event');
      },
      toggleFollow(user) {
        // Implement follow/unfollow logic here
        user.isFollowing = !user.isFollowing;
      }
    }
  }
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 9999;
    color: black;
  }
  
  .modal-content {
    animation: modalFadeIn 0.3s;
  }
  
  @keyframes modalFadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  
  /* Custom scrollbar styles */
  .modal-body::-webkit-scrollbar {
    width: 8px;
  }
  
  .modal-body::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  .modal-body::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
  
  .modal-body::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  </style>