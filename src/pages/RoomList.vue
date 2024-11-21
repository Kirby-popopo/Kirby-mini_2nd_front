<template>
  <div class="room-list-container">
    <!-- 좌측: ChatRoomList 컴포넌트 -->
    <ChatRoomList
      :chatRoomList="chatRoomList"
      @room-created="onRoomCreated"
    />

    <!-- 우측: 메인 컨텐츠 -->
    <div class="main-content-RoomList">
      <!-- 기본 메시지 -->
      <div class="message-box">
        <div class="message-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="icon"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M20.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21h6.87a.75.75 0 01.53.22l2.47 2.47c.48.48 1.28.48 1.77 0l2.47-2.47a.75.75 0 01.53-.22h6.87A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3z"
            />
          </svg>
        </div>
        <h2 class="message-title">내 메시지</h2>
        <p class="message-description">
          친구나 그룹에 비공개 사진과 메시지를 보내보세요
        </p>
        <button class="send-message-btn" @click="openModal">메시지 보내기</button>
      </div>

      <!-- 모달 -->
      <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
        <div class="modal-new-message" @click.stop>
          <h2 class="modal-new-title">새로운 메시지</h2>
          <div class="modal-input-group">
            <label for="recipient">받는 사람:</label>
            <input
              type="text"
              id="recipient"
              placeholder="검색..."
              v-model="recipient"
              class="modal-input"
            />
          </div>
          <p class="search-result">
            계정을 찾을 수 없습니다.
          </p>
          <button class="chat-btn" :disabled="!recipient.trim()">채팅</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChatRoomList from "@/components/ChatRoomList.vue";
import axios from "axios";

export default {
  name: "RoomList",
  components: {
    ChatRoomList,
  },
  data() {
    return {
      userId: localStorage.getItem("userId"), // 유저 ID
      chatRoomList: [], // 채팅방 목록
      isModalOpen: false, // 모달 상태
      recipient: "", // 받는 사람
    };
  },
  created() {
    this.fetchChatRooms(); // 채팅방 목록 불러오기
  },
  methods: {
    fetchChatRooms() {
      axios
        .get("http://localhost:8090/api/chat/roomList", {
          params: { userId: this.userId },
        })
        .then((response) => {
          this.chatRoomList = response.data;
        })
        .catch((error) => {
          console.error("채팅방 목록을 불러오는 데 실패했습니다:", error);
        });
    },
    onRoomCreated(newRoom) {
      this.chatRoomList.push(newRoom); // 새로 생성된 방 추가
    },
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
      this.recipient = "";
    },
  },
};
</script>

<style scoped>
.room-list-container {
  display: flex;
  height: 100vh;
}

.main-content-RoomList {
  flex: 1;
  background-color: #000;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}

.message-box {
  text-align: center;
  max-width: 400px;
}

.message-icon {
  margin-bottom: 20px;
}

.icon {
  width: 50px;
  height: 50px;
  color: #0095f6;
}

.message-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.message-description {
  font-size: 14px;
  color: #b0b0b0;
  margin-bottom: 20px;
}

.send-message-btn {
  background-color: #0095f6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
}

.send-message-btn:hover {
  background-color: #0074cc;
}

.modal-overlay {
  position: fixed;
  /* top: 0;
  left: 0; */
  width: 50%;
  height: 50%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 9999;
}

.modal-new-message {
  background-color: #262626;
  padding: 20px;
  border-radius: 12px;
  width: 400px;
  color: white;
  text-align: center;
}

.modal-new-title {
  margin-bottom: 20px;
  font-size: 20px;
}

.modal-input-group {
  margin-bottom: 20px;
  text-align: left;
}

.modal-input {
  margin-top: 7px;
  width: 95%;
  max-width: 400px; /* 최대 너비 설정 (선택 사항) */
  padding: 10px;
  border-radius: 5px;
  border: none;
  background-color: #363636;
  color: white;
  display: block; /* margin 적용을 위한 block 요소 설정 */
}

.modal-input:focus {
  outline: none;
}

.search-result {
  font-size: 14px;
  color: #b0b0b0;
  margin-bottom: 20px;
}

.chat-btn {
  width: 100%;
  padding: 10px;
  background-color: #0095f6;
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
}

.chat-btn:disabled {
  background-color: #444;
  cursor: not-allowed;
}

</style>
