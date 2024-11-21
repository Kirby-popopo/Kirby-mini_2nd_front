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
        <div class="modal" @click.stop>
          <h2 class="modal-title">새로운 메시지</h2>

          <!-- 선택된 사용자 -->
          <div class="selected-recipients-container">
            <label for="recipient" class="recipient-label">받는 사람:</label>
            <div class="selected-recipients">
              <span
                v-for="(user, index) in selectedUsers"
                :key="index"
                class="recipient-tag"
              >
                {{ user.name }}
                <button
                  class="remove-recipient"
                  @click="removeRecipient(index)"
                >
                  ✕
                </button>
              </span>
            </div>
          </div>

          <!--검색 입력-->
          <div class="input-group">
            <input
              type="text"
              id="recipient"
              placeholder="검색..."
              v-model="recipient"
              @input="searchUsers"
              class="modal-input"
            />
          </div>

          <!-- 검색 결과 표시 -->
          <div v-if="searchResults.length > 0" class="search-results">
            <div
              v-for="(item) in searchResults"
              :key="item.userId"
              class="menu-search-item"
              @click="selectRecipient(item)"
            >
              <div class="search-result-item">
                <img :src="item.profileImage" alt="User" width="20px" />
                <span>{{ item.name }}</span>
              </div>
              <!-- 이미 선택된 유저라면 체크 아이콘 표시 -->
              <template v-if="isUserSelected(item)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="check-icon"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </template>
            </div>
          </div>

          <!-- 검색 결과가 없을 때 메시지 -->
          <p v-else-if="recipient.trim() !== ''" class="search-result">
            계정을 찾을 수 없습니다.
          </p>

          <button class="chat-btn" :disabled="!selectedUsers.length" @click="sendChat">
            채팅
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import ChatRoomList from "@/components/ChatRoomList.vue";
import MenuSearchItem from "@/components/MenuSearchItem.vue";
import axios from "axios";

export default {
  name: "RoomList",
  components: {
    ChatRoomList,
    MenuSearchItem,
  },
  data() {
    return {
      userId: localStorage.getItem("userId"), // 유저 ID
      currentUserId: localStorage.getItem("userId"),
      chatRoomList: [], // 채팅방 목록
      isModalOpen: false, // 모달 상태
      recipient: "", // 검색창 입력값
      searchResults: [], // 검색 결과
      selectedUsers: [], // 선택된 사용자 리스트
    };
  },
  created() {
    this.fetchChatRooms(); // 채팅방 목록 불러오기
  },
  methods: {
    sendChat() {
      console.log("sendChat 호출");

      // 참여자 ID 추출
      const participantIds = this.selectedUsers.map((user) => user.userId);
      participantIds.push(this.userId); // 현재 사용자 포함

      // 콘솔로 확인
      console.log("전송할 participantIds:", participantIds);
      console.log("현재 사용자 ID:", this.currentUserId);

      // Axios 요청
      axios
        .post("http://192.168.5.24:8090/api/chat/findOrCreateRoomByExactParticipants", {
          participantIds: participantIds, // 여기서 이미 participantIds를 생성했으므로 재사용
          currentUserId: this.currentUserId,
        })
        .then((response) => {
          const roomId = response.data.roomId; // 서버에서 반환된 채팅방 ID
          this.$router.push(`/chat-room/${roomId}`); // 채팅방으로 이동
        })
        .catch((error) => {
          console.error("채팅방 생성 또는 가져오기 실패:", error);
          alert("채팅방 생성에 실패했습니다.");
        });
    },

    searchUsers() {
      if (this.recipient.trim() !== "") {
        axios
          .post("http://192.168.5.24:8090/api/SearchUser", { userId: this.recipient })
          .then((response) => {
            this.searchResults = response.data.obj;
          })
          .catch((error) => {
            console.error("유저 검색 실패:", error);
          });
      } else {
        this.searchResults = [];
      }
    },

    isUserSelected(user) {
    // 선택된 유저인지 확인
    return this.selectedUsers.some((u) => u.userId === user.userId);
    },

    selectRecipient(user) {
      // 선택된 유저 리스트에 추가
      console.log("선택된 사용자:", user); // 디버그용 로그 추가
      if (!this.isUserSelected(user)) {
        this.selectedUsers.push(user);
      }
      // 검색창 입력 초기화
      this.recipient = "";
      this.searchResults = []; // 검색 결과 초기화
    },
    removeRecipient(index) {
      // 선택된 유저 리스트에서 제거
      this.selectedUsers.splice(index, 1);
    },

    fetchChatRooms() {
      axios
        .get("http://192.168.5.24:8090/api/chat/roomList", {
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
  border-radius: 12px;
  width: 400px;
  color: white;
  text-align: center;
}

.modal-title {
  margin-bottom: 20px;
  font-size: 20px;
}

.input-group {
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



/* 상위 컨테이너 스타일 */
:deep(.menu-search-item) {
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #1e1e1e; /* 다크 그레이 배경 */
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

/* 마우스 호버 시 스타일 */
:deep(.menu-search-item:hover) {
  background-color: #333; /* 조금 더 밝은 색상 */
}

/* 내부의 클릭 가능한 영역 스타일 */
:deep(.search-result-item) {
  display: flex;
  align-items: center;
}

/* 프로필 이미지 */
:deep(.search-result-item img) {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

/* 이름 텍스트 */
:deep(.search-result-item span) {
  color: white;
  font-size: 16px;
  font-weight: bold;
  transition: color 0.3s ease;
}

/* 이름 텍스트 마우스 호버 시 스타일 */
.search-result-item:hover span {
  color: #bbb; /* 밝은 회색 */
}

.selected-recipients {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start; /* 왼쪽 정렬 */
  gap: 8px;
}

.recipient-tag {
  display: flex;
  align-items: center;
  background-color: #0095f6;
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 14px;
  white-space: nowrap; /* 텍스트 줄바꿈 방지 */
}

.remove-recipient {
  background: none;
  border: none;
  color: white;
  margin-left: 5px;
  cursor: pointer;
}

.remove-recipient:hover {
  color: #ff4d4d;
}
.menu-search-item {
  display: flex;
  align-items: center;
  justify-content: space-between; /* 우측 끝에 체크 아이콘 배치 */
  padding: 10px;
  background-color: #1e1e1e;
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.menu-search-item:hover {
  background-color: #333;
}

.check-icon {
  width: 20px;
  height: 20px;
  color: #0095f6; /* 체크 아이콘 색상 */
}
.selected-recipients-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

/* "받는 사람" 레이블 */
.recipient-label {
  font-weight: bold;
  color: white;
  white-space: nowrap;
}

</style>
