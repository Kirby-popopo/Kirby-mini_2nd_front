<template>
  <div class="app-container">
    <div class="sidebar-list">
      <div class="sidebar-header">
        <h2>채팅방 목록</h2>
        <button @click="openModal" class="create-room-btn">채팅방 생성</button>
      </div>
      <ul class="message-list">
        <li v-for="chatRoom in chatRoomList" :key="chatRoom.roomId" class="message-item">
          <p>채팅방 이름: {{ chatRoom.roomName }}</p>
          <router-link :to="`/chat-room/${chatRoom.roomId}`" class="enter-room-link">채팅방 입장</router-link>
        </li>
      </ul>
    </div>

    <!-- 채팅방 생성 모달 -->
    <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <h2 class="modal-title">새로운 채팅방 생성</h2>
        <input
          v-model="newRoomName"
          @keyup.enter="createRoom"
          placeholder="채팅방 이름을 입력하세요"
          class="modal-input"
        />
        <div class="modal-buttons">
          <button @click="createRoom" :disabled="!newRoomName.trim()" class="create-btn">생성</button>
          <button @click="closeModal" class="cancel-btn">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ChatRoomList",
  props: {
    chatRoomList: Array,
  },
  data() {
    return {
      isModalOpen: false, // 모달 상태
      newRoomName: "", // 새 채팅방 이름
    };
  },
  methods: {
    openModal() {
      this.isModalOpen = true;
      this.newRoomName = "";
    },
    closeModal() {
      this.isModalOpen = false;
    },
    createRoom() {
      if (this.newRoomName.trim()) {
        axios
          .post("http://192.168.5.24:8090/api/chat/createRoom", {
            room_name: this.newRoomName,
          })
          .then((response) => {
            this.$emit("room-created", response.data); // 부모로 데이터 전달
            this.closeModal();
          })
          .catch((error) => {
            console.error("채팅방 생성 실패:", error);
          });
      }
    },
  },
};
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100vh;
  background-color: #000; /* 검은색 배경 */
  color: white;
}

.sidebar-list {
  /* flex: 1; */
  max-width: 300px;
  width: 88%;
  overflow-y: auto;
  padding: 20px; /* 내부 여백 */
  position: relative;
}

.sidebar-header {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
  color: white;
}

.create-room-btn {
  display: block;
  text-align: center;
  background-color: #0095f6; /* 파란색 버튼 */
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 16px;
  position: relative;
  margin-top: 20px; /* 메시지 리스트 아래 여백 */
  left: 50%;
  transform: translateX(-50%); /* 버튼 가운데 정렬 */
}

.create-room-btn:hover {
  background-color: #0074cc;
}

.message-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column; /* 수직 정렬 */
  align-items: center; /* 리스트 중앙 정렬 */
}

.message-item {
  width: 90%; /* 메시지 아이템 너비 */
  max-width: 400px;
  padding: 15px;
  margin-bottom: 10px;
  background-color: #1e1e1e; /* 다크 그레이 배경 */
  border-radius: 12px; /* 더 둥글게 변경 */
  text-align: center;
  cursor: pointer;
  color: white;
  transition: background-color 0.3s ease;
}

.message-item:hover {
  background-color: #2c2c2c;
}

.enter-room-link {
  color: #0095f6;
  text-decoration: none;
  font-size: 14px;
}

.enter-room-link:hover {
  color: #0074cc;
}

.main-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background-color: #262626;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  text-align: center;
  color: white;
}

.modal-title {
  margin-bottom: 20px;
  font-size: 18px;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
}

.create-btn {
  background-color: #0095f6;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
}

.cancel-btn {
  background: transparent;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
}
</style>
