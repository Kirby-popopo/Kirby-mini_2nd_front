<template>
<div class="container">
    <div class="app-preview">
        <img id="loginImg" src="/img/login.png" alt="Instagram app preview" width="380" height="581">
    </div>
    <div class="login-container">
        <div class="form-container">
            <img src="/img/1.jpg" alt="k-stargram" class="logo" width="200" height="51">

            <form id="loginForm" method="post" @submit.prevent="login">
                <input type="text" name="userId" placeholder="전화번호, 사용자 이름 또는 이메일" required v-model="state.form.userId">
                <input type="password" name="userPw" placeholder="비밀번호" required v-model="state.form.userPw">
                <button type="submit" >로그인</button>
            </form>

            <div id="errorMessage" class="error-message"> {{ state.errorMessage }} </div>

            <div class="divider">또는</div>

            <!-- OAuth 로그인 버튼 추가 -->
            <div class="OAuth-login">
                <button @click="redirectToGoogle">Google로 로그인</button>
                <button @click="redirectToFacebook">Facebook으로 로그인</button>
            </div>
            <div class="forgot-password">
                <a href="#">비밀번호를 잊으셨나요?</a>
            </div>
        </div>
        <div class="signup">
            <p>계정이 없으신가요? <a href="/signup">가입하기</a></p>
        </div>
    </div>
</div>

</template>

<script>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStores';
//import axios from 'axios';
import axios from '@/util/axios';

export default {
    setup() {
        const state = reactive({
            form: {
                userId: "",
                userPw: ""
            },
            errorMessage: "" // 반응성을 유지하며 선언
        })
        // OAuth2 
        const redirectToGoogle = () => {
            const clientId = '443880299005-rle9rs9bcdpakhjv59o3v9rhk311ep4b.apps.googleusercontent.com';
            const redirectUri = 'http://localhost:5173/';
            const responseType = 'token';
            const scope = 'email';

            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
            
            window.location.href = authUrl;
        };
        
    const router = useRouter();
    const authStore = useAuthStore();
        
        const login = () => {
            axios.post('/api/auth/login', {
                userId: state.form.userId,
                userPw: state.form.userPw
            })
        .then((res) => {
            const token = res.headers['Authorization'] || res.headers['authorization'];
            if(token){
                authStore.setToken(token); //pinia 스토어에 토큰 저장
                window.alert(res.data);
                router.push('/'); //메인 페이지로 이동
            } else {
                console.warn('Authorization 헤더가 없습니다.');
                state.errorMessage = '로그인에 실패하였습니다.';
        }
        }) 
        .catch((error) => {
                // 로그인 실패
                state.errorMessage = "잘못된 비밀번호입니다. 다시 확인하세요.";
                console.log(error);
            });
        };

        const logout = () => {      
            axios.get("http://localhost:8090/api/auth/logout").then((res) => {
                if (res.headers['Authorization'] == 'delete') {
                    authStore.clearToken();
                }
                window.alert(res.data);
            }).catch(() => {
            window.alert("로그아웃을 수행하는 동안 오류가 발생하였습니다..");
            });
    }

        const check = () => {      
            axios.get("http://localhost:8090/api/auth/check",{
                headers: {
                'Authorization': authStore.token,
                }
            }).then((res) => {       
        window.alert(res.data);
            });
        }

        return {state, login, logout, check, redirectToGoogle}
    }

};

</script>

<style lang="css">
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #fafafa;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .container {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
        }
        .app-preview {
            display: none;
        }
        @media (min-width: 768px) {
            .app-preview {
                display: block;
                margin-right: 32px;
            }
        }
        .login-container {
            width: 100%;
            max-width: 350px;
        }
        .form-container {
            background-color: #fff;
            border: 1px solid #dbdbdb;
            border-radius: 1px;
            padding: 20px 40px;
            margin-bottom: 10px;
            overflow: visible !important;
        }
        .logo {
            display: block;
            margin: 22px auto 12px;
        }
        form {
            margin-top: 24px;
        }
        input {
            width: 100%;
            padding: 9px 8px 7px;
            background: #fafafa;
            border: 1px solid #dbdbdb;
            border-radius: 3px;
            margin-bottom: 6px;
            font-size: 14px;
            color: #262626;
        }
        button {
            width: 100%;
            background-color: #0095f6;
            border: 1px solid #0095f6;
            border-radius: 4px;
            color: #fff;
            padding: 5px 9px;
            font-weight: 600;
            margin-top: 8px;
            cursor: pointer;
        }
        .divider {
            display: flex;
            align-items: center;
            color: #8e8e8e;
            font-size: 13px;
            font-weight: 600;
            margin: 10px 0 18px;
        }
        .divider::before, .divider::after {
            content: "";
            flex-grow: 1;
            background-color: #dbdbdb;
            height: 1px;
            font-size: 0;
            line-height: 0;
            margin: 0 16px;
        }
        .facebook-login {
            color: #385185;
            font-size: 14px;
            font-weight: 600;
            text-align: center;
            margin: 8px 0;
        }
        .forgot-password {
            color: #00376b;
            font-size: 12px;
            line-height: 14px;
            text-align: center;
            margin-top: 12px;
        }
        .signup {
            background-color: #fff;
            border: 1px solid #dbdbdb;
            border-radius: 1px;
            padding: 10px;
            text-align: center;
        }
        .error-message {
            display: block !important;
            visibility: visible !important;
            color: red !important; /* 텍스트 색상 명확히 설정 */
            font-size: 16px !important;
            line-height: 20px !important;
            text-align: center !important;
            margin: 10px 0 !important;
            
        }

</style>