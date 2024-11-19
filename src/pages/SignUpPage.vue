<template>
    <div class="signup-container">
        <div class="logo">K-stargram</div>
        <div class="subtitle">친구들의 사진과 동영상을 보려면 가입하세요.</div>
        <form @submit.prevent="signup" id="signupForm">
            <!-- 번호 또는 이메일 -->
            <div class="input-container">
                <input type="text" v-model="form.userInput" id="UserInput" name="UserInput" placeholder=" " required>
                <label for="UserInput" class="floating-label">휴대폰 번호 또는 이메일 주소</label>
                <div id="userError" class="error-message"></div>
            </div>

            <!-- 사용자 ID -->
            <div class="input-container">
                <input v-model="form.userId" type="text" id="userid" name="userId" placeholder=" " required>
                <label for="userid" class="floating-label">사용자 ID</label>
                <div v-if="userIdError" id="userIdError" class="error-message">{{ userIdError }}</div>
            </div>

            <!-- 사용자 이름 -->
            <div class="input-container">
                <input v-model="form.name" type="text" id="name" name="name" placeholder=" " required>
                <label for="name" class="floating-label">이름</label>
            </div>

            <!-- 성별 -->
            <div class="gender-container">
                <label for="male" class="radio-label">
                    <input type="radio" v-model="form.gender" id="male" name="gender" value="M" required>
                    <span class="custom-radio"></span> 남성
                </label>
                <label for="female" class="radio-label">
                    <input type="radio" v-model="form.gender" id="female" name="gender" value="F" required>
                    <span class="custom-radio"></span> 여성
                </label>
            </div>

            <!-- 별명 -->
            <div class="input-container">
                <input v-model="form.nickname" type="text" id="nickname" name="nickname" placeholder=" " required>
                <label for="nickname" class="floating-label">별명</label>
            </div>

            <!-- 비밀번호 -->
            <div class="password-container">
                <input v-model="form.userPw" id="pw" type="password" placeholder="비밀번호를 입력하세요" minlength="6" required>
                <div v-if="passwordError" class="char-count">
                    <span id="passworderror">{{ passwordError }}</span>
                </div>
                <button type="button" id="passwordToggle" class="password-toggle">표시</button>
            </div>
            <button type="submit" :disabled="!isFormValid" id="submitButton">가입</button>
        </form>
    </div></template>

<script setup>
import { reactive, ref, computed, watch } from 'vue';
import axios from 'axios';

const form = reactive({
    userInput: '',
    userId: '',
    userPw: '',
    email: '',
    name: '',
    nickname: '',
    gender: ''
});

const userIdError = ref('');
const isUserIdAvailable = ref(false);

// 비밀번호 유효성 검사 및 폼 유효성 검사
const passwordError = computed(() => {
    return form.userPw.length < 6 && form.userPw.length > 0 ? '비밀번호는 최소 6자 이상이어야 합니다.' : '';
});
const isFormValid = computed(() => {
    return (
        form.userInput.length > 0 &&
        form.userId.length > 0 &&
        form.userPw.length >= 6 &&
        form.name.length > 0 &&
        form.nickname.length > 0 &&
        form.gender.length > 0 &&
        isUserIdAvailable.value
    );
});


//아이디 중복 체크
const checkUserId = async () => {
    if (form.userId.length < 3) {
        userIdError.value = '';
        isUserIdAvailable.value = false;
        return;
    }

    try {
        const response = await axios.get('http://localhost:8090/api/auth/checkUserId',{
            params: { userId: form.userId }
        });

        if (response.data) {
            userIdError.value = '';
            isUserIdAvailable.value = true;
        } else {
            userIdError.value = '이미 사용 중인 ID입니다.';
            isUserIdAvailable.value = false;
        }
    } catch (error) {
        console.error('아이디 중복 검사 에러:', error);
        userIdError.value = '아이디 확인에 실패했습니다. 다시 시도해주세요.';
        isUserIdAvailable.value = false;
    }
};

watch(() => form.userId, () => {
    checkUserId();
});

// 회원가입
const signup = async () => {

    if (!isUserIdAvailable.value) {
        return;
    }
    try {
        const response = await axios.post('http://localhost:8090/api/auth/signup', {
            userId: form.userId,
            userPw: form.userPw,
            email: form.userInput.includes('@') ? form.userInput : '',
            phoneNumber: form.userInput.includes('@') ? '' : form.userInput,
            name: form.name,
            nickname: form.nickname,
            gender: form.gender
        });
        alert('회원가입이 성공적으로 완료되었습니다!');
    } catch (error) {
        console.error('회원가입 에러:', error);
    }
};
</script>

<style>
    .input-container {
        position: relative;
        margin-bottom: 20px;
    }

    input[type="text"], input[type="password"] {
        width: 100%;
        padding: 15px 10px 10px 10px;
        font-size: 16px;
        box-sizing: border-box;
    }

    /* 라벨 스타일 */
    .floating-label {
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        transition: all 0.3s ease;
        background-color: white;
        padding: 0 5px;
        color: gray;
        pointer-events: none;
    }

    /* 포커스 시 라벨 위치 이동 */
    input:focus + .floating-label,
    input:not(:placeholder-shown) + .floating-label {
        top: -10px;
        font-size: 12px;
        color: #007BFF;
    }

    .gender-container {
        display: flex;
        align-items: center;
        gap: 30px;
        margin-bottom: 20px;
    }

    .radio-label {
        display: flex;
        align-items: center;
        position: relative;
        cursor: pointer;
        padding-left: 25px;
    }

    input[type="radio"] {
        position: absolute;
        opacity: 0;
    }

    .custom-radio {
        width: 16px;
        height: 16px;
        border: 2px solid #007bff;
        border-radius: 50%;
        margin-right: 10px;
        position: relative;
    }

    input[type="radio"]:checked + .custom-radio {
        background-color: #007bff;
        border-color: #007bff;
    }

    input[type="radio"]:checked + .custom-radio::after {
        content: "";
        width: 8px;
        height: 8px;
        background-color: white;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
    }

    .error-message {
        color: red;
        margin-top: 5px;
        font-size: 14px;
    }
</style>