import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
    const token = ref('');
    const userDetail = reactive({
        userId : '',
        userDescription : '',
        userImageUrl : '',
        userGender: '',
        userName:'',
        userNickName:'',
        userPhoneNumber:'',
    })

    /*
        로그인 성공시 저장할 데이터들.
    */

    // 엑세스 토큰을 저장시켜주세요.
    // 해당 토큰은 axios 전송시 인터셉터로 선처리 할 예정입니다.
    function setToken(accessToken){
        token.value = accessToken
    }

    // 가벼운 로그인 유저의 정보를 담아둡니다. 캐싱해서 매번 서버에
    // 유저 정보를 끌어올 필요 없이 pinia에서 가벼운 정보들만 가져와서 
    // 쓸 수 있으면 좋을 것 같습니다.
    function setUserDetail(data){
        userDetail.userId = data.userId;
        userDetail.userDescription = data.description;
        userDetail.userImageUrl = data.userImageUrl;
    }

    return { token, userDetail , setToken, setUserDetail }
})