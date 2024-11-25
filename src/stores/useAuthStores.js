import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import axios from 'axios';

export const useAuthStore = defineStore('auth', () => {
    const token = ref('');
    const userDetail = reactive({
        userId : localStorage.getItem('userId') || '',
        userDescription : '',
        userImageUrl : '',
        userGender: '',
        userName: localStorage.getItem('userName') || '',
        userNickName:'',
        userPhoneNumber:'',
    });

    /*
        로그인 성공시 저장할 데이터들.
    */

    // 엑세스 토큰을 저장시켜주세요.
    // 해당 토큰은 axios 전송시 인터셉터로 선처리 할 예정입니다.
    function setToken(accessToken){
        console.log("setToken 호출됨, 토큰 설정 중:", accessToken);
        token.value = accessToken;
        localStorage.setItem('authToken', accessToken);
        // 볼러온 토큰의 유효성 검증 후 사용자 이름 가져오기
        fetchUserDetail();
    }

    // 페이지 새로고침 시 Local Storage에서 토큰 불러오기
    async function initializeToken() {
        const savedToken = localStorage.getItem('authToken');
        if (savedToken) {
            try {
                // 유효성 검사
                await axios.get('http://192.168.5.58:8090/api/auth/check', {
                    headers : {
                        'authorization' : savedToken,
                    },
                });
                token.value = savedToken; // 유효한 경우에만 설정
                console.log("유효한 토큰이 발견되어 설정되었습니다:", savedToken);
            } catch (error) {
                console.error("유효하지 않은 토큰입니다. 초기화합니다.");
                clearToken(); // 만료된 토큰 제거
            }
        }
    }

    // 토큰 초기화
    function clearToken() {
        token.value = '';
        localStorage.removeItem('authToken');
        // 사용자 정보 초기화
        Object.keys(userDetail).forEach(key => userDetail[key] = '');
    }


    // 사용자 정보 가져오기
    async function fetchUserDetail() {
        if(!token.value) {
            return;
        }
        try {
            const response = await axios.get('http://192.168.5.58:8090/api/auth/userinfo',{
                headers: {
                    'authorization': token.value,
                }
            });
            setUserDetail(response.data);
        } catch (error) {
            console.error("사용자 정보를 가져오는 중 오류 발생:", error);
            clearToken();
        }
    }
    // 가벼운 로그인 유저의 정보를 담아둡니다. 캐싱해서 매번 서버에
    // 유저 정보를 끌어올 필요 없이 pinia에서 가벼운 정보들만 가져와서 
    // 쓸 수 있으면 좋을 것 같습니다.
    function setUserDetail(data){
        userDetail.userId = data.userId;
        userDetail.userDescription = data.description;
        userDetail.userImageUrl = data.profileImage;
        userDetail.userName = data.userName;

        // LocalStorage에 사용자 정보 저장
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userName', data.userName);
    }

    return { token, userDetail, setToken, clearToken, isAuthenticated: () => !!token.value, initializeToken };
})