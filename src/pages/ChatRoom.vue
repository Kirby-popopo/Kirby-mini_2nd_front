<template>
  <div class="chat-room-container">
    <!-- 좌측: ChatRoomList 컴포넌트 -->
     <div class="row" style="width: 100%;">
    <div class="sidebar-room">
      <ChatRoomList :chatRoomList="chatRoomList" @room-created="onRoomCreated" />
    </div>

    <!-- 우측: 채팅 영역 -->
    <div class="chat-main">
      
      <!-- 헤더 영역 -->
      <header class="chat-header">
        <h2>{{ roomId }}번 채팅방: {{ room_name }}</h2>
        <button @click="leaveRoom" class="leave-btn">채팅방 나가기</button>
      </header>

      <!-- 채팅 메시지 목록 -->
      <div class="chat-body" ref="chatBody">
        <!-- 상대방 프로필 목록 -->
        <div v-if="otherParticipant.length > 0" class="chat-profile">
          <div class="profile-avatar-group">
            <img v-for="participant in otherParticipant"
                :key="participant.userId"
                :src="participant.profileImageUrl || '/img/default-profile.png'"
                alt="상대방 프로필"
                class="profile-avatar" />
          </div>

          <div class="profile-info">
            <h2 class="profile-username">{{ otherParticipant.map(p => p.name).join(', ') }}</h2>
            <p class="profile-meta">Instagram</p>
          </div>

          <button v-if="otherParticipant.length === 1" class="profile-view-btn" @click="viewProfile">
            프로필 보기
          </button>
        </div>

        <!-- 메시지들 -->
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="['chat-message', msg.sender === userId ? 'sent' : 'received']"
        >
          <!-- 상대방 메시지일 때만 프로필 이미지와 메시지 배치 -->
          <template v-if="msg.sender !== userId">
            <div class="message-wrapper">
              <img :src="getParticipantProfileImageUrl(msg.sender)" alt="상대방 프로필" class="profile-icon" />
              <div class="message-content">
                <div class="message-bubble">
                  {{ msg.message }}
                </div>
                <span class="timestamp">
                  {{ formatDate(msg.sendDate) }}
                </span>
              </div>
            </div>
          </template>

          <!-- 내 메시지 -->
          <template v-else>
            <div class="message-content">
              <div class="message-bubble">
                {{ msg.message }}
              </div>
              <span class="timestamp">
                {{ formatDate(msg.sendDate) }}
              </span>
            </div>
          </template>
        </div>
        
      </div>

      <!-- 메시지 입력 영역 -->
      <footer class="chat-footer">
        <input
          v-model="newMessage"
          @keyup.enter="sendMessage"
          placeholder="메시지를 입력하세요."
          class="message-input"
        />
      </footer>
    </div>
  </div>
  </div>
</template>

<script>
import ChatRoomList from "@/components/ChatRoomList.vue";
import dayjs from "dayjs";
import axios from "axios";

export default {
  name: "ChatRoom",
  components: {
    ChatRoomList,
  },
  props: {
    id: String, // URL로 받은 채팅방 id
  },
  data() {
    return {
      roomId: this.id, // 현재 채팅방 ID
      userId: localStorage.getItem("userId"),
      room_name: "", // 채팅방 이름
      newMessage: "",
      messages: [],
      webSocket: null,
      isConnected: false,
      chatRoomList: [],
      oldestMessageDate: null, // (스크롤링 관련) 가장 오래된 메시지의 날짜
      isFetching: false, // 데이터 요청 중인지 확인
      hasMoreMessages: true, // 추가 메시지가 더 있는지 확인
      participants: [], // 참여자 목록
      otherParticipant: [], // 초기값을 null로 변경하여 로드 전 상태 반영
    };
  },
  watch: {
    id(newId) {
      // URL의 ID가 변경되었을 때 실행
      this.roomId = newId;
      this.room_name = "";
      this.messages = []; // 기존 메시지 초기화
      this.oldestMessageDate = null; // 가장 오래된 메시지 초기화
      this.hasMoreMessages = true; // 더 많은 메시지가 있다고 가정
      if (this.webSocket) {
        this.webSocket.close(); // 기존 WebSocket 연결 종료
      }
      this.fetchChatRooms(); // 채팅방 목록 다시 로드
      this.connectWebSocket(); // 새로운 WebSocket 연결
      this.loadMessages(); // 새로운 메시지 로드
      this.loadRoomInfo(); // 채팅방 정보 로드
      this.loadOtherParticipant(); // 상대방 정보 로드 추가
    },

    otherParticipant: {
      handler(newValue) {
        console.log("otherParticipant 변경됨: ", newValue);
      },
      immediate: true,
      deep: true, // 객체 내부 변화를 감지
    },

    messages: {
      handler() {
        this.scrollToBottom(); // 메시지가 업데이트될 때 스크롤 이동
      },
      deep: true,
    },
  },
  async mounted() {
    await this.loadRoomInfo(); // 현재 채팅방 정보 로드
    await this.loadOtherParticipant(); // 상대방 정보 로드
    await this.loadMessages();

    // DOM 업데이트 대기
    await this.$nextTick();
    
    this.fetchChatRooms();
    this.connectWebSocket();
    this.scrollToBottom();

    // 채팅 영역에 스크롤 이벤트 리스너 추가
    const chatBody = this.$refs.chatBody;
    if (chatBody) {
      chatBody.addEventListener("scroll", this.handleScroll);
    }
  },
  beforeUnmount() {
    if (this.webSocket) {
      this.webSocket.close();
    }
    const chatBody = this.$refs.chatBody;
    if (chatBody) {
      chatBody.removeEventListener("scroll", this.handleScroll);
    }
  },
  methods: {
    async loadOtherParticipant() {
      try {
        // 서버로부터 roomId에 해당하는 참가자 목록을 가져옴
        const response = await axios.get(`http://192.168.5.58:8090/api/chat/room/${this.roomId}/participants`);
        
        // 전체 참여자 목록 설정
        this.participants = response.data;

        console.log("참여자 목록:", this.participants);

        // 현재 사용자를 제외한 상대방 목록 필터링
        this.otherParticipant = this.participants.filter(p => p.userId !== this.userId);
        
        console.log("otherParticipant 업데이트:", this.otherParticipant);

        // DOM 업데이트를 위한 다음 틱 기다림
        await this.$nextTick();
      } catch (error) {
        console.error("상대방 정보 로드 실패:", error);
        // 오류 발생 시 기본값 설정
        this.otherParticipant = [
          {
            userId: "",
            name: "Unknown User",
            profileImageUrl: "/img/default-profile.png",
          },
        ];
      }
    },

    async loadRoomInfo() {
      try {
        const response = await axios.get(
          `http://192.168.5.58:8090/api/chat/room/${this.roomId}`
        );

        const { roomName, participants } = response.data; // 데이터 추출
        this.room_name = roomName || "알 수 없는 채팅방"; // 방 이름 설정
        this.participants = participants.filter(p => p.userId !== this.userId) || []; // 참여자 목록 설정

        console.log("채팅방 정보:", this.room_name);
        console.log("채팅방 : ", this.participants);

      } catch (error) {
        console.error("채팅방 정보 로드 실패:", error);
        this.room_name = "알 수 없는 채팅방";
        this.participants = [];
      }
    },
    getParticipantProfileImageUrl(userId) {
      const participant = this.participants.find((p) => p.userId === userId);
      return participant ? participant.profileImageUrl : '/img/default-profile.png';
    },
    async loadMessages() {
      try {
        const response = await axios.get(
          `http://192.168.5.58:8090/api/chat/room/${this.roomId}/combinedMessages`
        );
        this.messages = response.data;

        if (this.messages.length > 0) {
          this.oldestMessageDate = this.messages[0].sendDate; // 가장 오래된 메시지 저장
          this.scrollToBottom(); // 메시지를 로드한 후 맨 아래로 이동
        }
      } catch (error) {
        console.error("채팅 내역 불러오기 실패:", error);
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const chatBody = this.$refs.chatBody;
        if (chatBody) {
          chatBody.scrollTop = chatBody.scrollHeight; // 스크롤을 맨 아래로 이동
        }
      });
    },
    fetchChatRooms() {
      axios
        .get("http://192.168.5.58:8090/api/chat/roomList", {
          params: { userId: this.userId },
        })
        .then((response) => {
          this.chatRoomList = response.data;
        })
        .catch((error) => {
          console.error("채팅방 목록을 불러오는 데 실패했습니다:", error);
        });
    },
    connectWebSocket() {
      this.webSocket = new WebSocket(`ws://192.168.5.58:8090/ws/${this.roomId}`);

      this.webSocket.onopen = () => {
        this.isConnected = true;
      };

      this.webSocket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.messages.push(message);
          this.scrollToBottom();
        } catch (error) {
          console.error("WebSocket 메시지 파싱 오류:", error);
        }
      };

      this.webSocket.onerror = (error) => {
        console.error("WebSocket 에러:", error);
      };

      this.webSocket.onclose = () => {
        this.isConnected = false;
      };
    },
    sendMessage() {
      if (this.newMessage.trim() !== "") {
        const message = {
          roomId: this.roomId,
          sender: this.userId,
          message: this.newMessage,
          sendDate: new Date().toISOString(),
          type: "TALK",
        };

        try {
          this.webSocket.send(JSON.stringify(message));
          this.newMessage = "";
        } catch (error) {
          console.error("메시지 전송 오류:", error);
        }
      }
    },
    leaveRoom() {
      axios
        .post(
          `http://192.168.5.58:8090/api/chat/room/${this.roomId}/leave`,
          null,
          { params: { userId: this.userId } }
        )
        .then(() => {
          if (this.webSocket) {
            this.webSocket.close();
          }
          this.$router.push("/roomList");
        })
        .catch((error) => {
          console.error("채팅방 나가기 요청 실패:", error);
        });
    },
    formatDate(dateString) {
      return dayjs(dateString).format("MM월 DD일 HH:mm");
    },
    onRoomCreated(newRoom) {
      this.chatRoomList.push(newRoom);
    },
  },
};
</script>


<style scoped>
.chat-room-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar-room {
  flex: 0 0 300px;
  width: 100%;
  max-width: 300px;
  overflow-y: auto;
  background-color: #121212;
  border-right: 1px solid #333;
}

.chat-main {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #000;
  color: white;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #1e1e1e;
  border-bottom: 1px solid #333;
}

.leave-btn {
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
}

.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.chat-message {
  display: flex;
  flex-direction: column; /* 시간을 포함해 세로 정렬 */
  align-items: flex-start; /* 기본: 좌측 정렬 */
  margin-bottom: 10px;
  max-width: 70%; /* 메시지 최대 너비 */
}

.chat-message.sent {
  align-items: flex-end; /* 우측 정렬 */
  margin-left: auto; /* 우측 끝으로 밀기 */
  text-align: right; /* 텍스트와 시간이 우측 정렬 */
}

.chat-message.received {
  align-items: flex-start; /* 좌측 정렬 */
  margin-right: auto; /* 좌측 끝으로 밀기 */
  text-align: left; /* 텍스트와 시간이 좌측 정렬 */
}

.message-bubble {
  display: inline-block;
  padding: 10px 12px; /* padding을 조정하여 공백을 줄였습니다. */
  border-radius: 15px;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.chat-message.sent .message-bubble {
  background-color: #0095f6;
  color: white;
}

.chat-message.received .message-bubble {
  background-color: #333;
  color: white;
  max-width: fit-content;
}

.timestamp {
  font-size: 0.8em;
  color: white;
  margin-top: 5px;
}

.chat-message.sent .timestamp {
  margin-right: 5px; /* 시간과 메시지 사이 간격 */
}

.chat-message.received .timestamp {
  margin-left: 5px; /* 시간과 메시지 사이 간격 */
}

.chat-footer {
  padding: 10px 20px;
  background-color: #1e1e1e;
}

.message-input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  background-color: #333;
  color: white;
}
.chat-profile {
  text-align: center;
  padding: 20px 10px;
  border-bottom: 1px solid #333;
  background-color: #000; /* 배경 색상 */
  margin-bottom: 20px;
}

.profile-avatar-group {
  display: flex;
  justify-content: center;
  gap: 2px; /* 프로필 이미지 간의 간격 조정 - 기존의 5px에서 2px로 */
  margin-bottom: 15px;
}

.profile-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.profile-info {
  margin-bottom: 10px;
}

.profile-username {
  font-size: 18px;
  font-weight: bold;
  color: white;
}

.profile-meta {
  font-size: 12px;
  color: #999;
}

.profile-view-btn {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  background-color: #333;
  color: white;
  cursor: pointer;
  font-size: 14px;
}

.profile-view-btn:hover {
  background-color: #444;
}

/* 프로필 아이콘 */
.profile-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px; /* 메시지와 간격 */
}

/* 메시지 전체를 감싸는 컨테이너 */
/* 전체 메시지 컨테이너 */
.chat-message {
  display: flex;
  margin-bottom: 10px;
}
/* 상대방 메시지일 때 배치 */
.message-wrapper {
  display: flex;
  align-items: flex-start;
  max-width: 70%;
  max-width: fit-content;
}

/* 메시지와 시간 감싸기 */
.message-content {
  display: flex;
  flex-direction: column;
}
/* 메시지 버블 */
.message-bubble {
  display: inline-block;
  padding: 10px 12px;
  border-radius: 15px;
  word-wrap: break-word;
  white-space: pre-wrap;
}
.chat-message.sent .message-bubble {
  background-color: #0095f6;
  color: white;
  align-self: flex-end;
}

.chat-message.received .message-bubble {
  background-color: #333;
  color: white;
}
/* 타임스탬프 */
.timestamp {
  font-size: 0.8em;
  color: #aaa;
  margin-top: 5px;
}

.chat-message.sent .timestamp {
  text-align: right;
}

.chat-message.received .timestamp {
  text-align: left;
}


.chat-profile {
  text-align: center;
  padding: 20px 10px;
  border-bottom: 1px solid #333;
  background-color: #000;
  margin-bottom: 20px;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 15px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.profile-info {
  margin-bottom: 10px;
}

.profile-username {
  font-size: 18px;
  font-weight: bold;
  color: white;
}

.profile-meta {
  font-size: 12px;
  color: #999;
}

.profile-view-btn {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  background-color: #333;
  color: white;
  cursor: pointer;
  font-size: 14px;
}

.profile-view-btn:hover {
  background-color: #444;
}
</style>
