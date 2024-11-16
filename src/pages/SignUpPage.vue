<template>
    <div class="signup-container">
    <div class="logo">K-stargram</div>
    <div class="subtitle">친구들의 사진과 동영상을 보려면 가입하세요.</div>
    <form id="signupForm">

        <!--번호 또는 이메일-->
        <div class="input-container">
            <input type="text" id="UserInput" name="UserInput" placeholder="" required>
            <label for="UserInput">휴대폰 번호 또는 이메일 주소</label>
            <div id="userError" class="error-message"></div>
        </div>
        <input type="hidden" id="phoneNumber" name="phoneNumber">
        <input type="hidden" id="email" name="email">

        <!--사용자 ID 및 중복 체크-->
        <div class="input-container">
            <div class="inputID">
            <input type="text" id="userid" name="userId" placeholder="" required>
            <label for="userid">사용자 ID</label>
            </div>
            <div id="usernameError" class="error-message"></div>
        </div>

        <!--사용자 이름-->
        <div class="input-container">
            <input type="text" id="name" name="name" placeholder="" required>
            <label for="name">이름</label>
        </div>

        <!--성별-->
        <div class="gender-container">
            <label for="male">
                <input type="radio" id="male" name="gender" value="M" required>
                <span class="custom-radio"></span> 남성
            </label>
            <label for="female">
                <input type="radio" id="female" name="gender" value="F" required>
                <span class="custom-radio"></span> 여성
            </label>
        </div>

        <!--별명-->
        <div class="input-container">
            <input type="text" id="nickname" name="nickname" placeholder="" required>
            <label for="nickname">별명</label>
        </div>

        <div id="emailError" class="error"></div>
        <div id="usernameSuggestions" class="username-suggestions"></div>

        <div class="password-container">
            <input id="pw" v-model="password" placeholder="비밀번호를 입력하세요" minlength="6" required>
            <div class="char-count"><span id="passworderror"> {{ passwordTrim }}</span></div>
            <button type="button" id="passwordToggle" class="password-toggle">표시</button>
        </div>
        <div id="passwordError" class="error"></div>

        <button type="submit" id="submitButton">가입</button>
    </form>
</div>
</template>
<script>

export default {
    components: {
    },
    data() {
        return {
            password: ''
        };
    },
    computed: {
        passwordTrim() {
            return Array.from(this.password.trim()).length > 6 ? '' : '6글자 이상 입력해주세요';
        },
    },
    async submitChangeSignUp(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('pw', this.passwordTrim);    
        console.log(formData);
    }
};

</script>

<style>
        .error-message{
            display: none;
            color: red;
            margin-top: 10px;
        }

        .error-message.show {
            display: block;
            opacity: 1;
        }
        .input-container {
            position: relative;
            margin-bottom: 10px;
        }

        input[type="text"] {
            width: 100%;
            padding: 10px 5px;
            font-size: 16px;
            box-sizing: border-box;
        }

        label {
            position: absolute;
            left: 10px;
            top: 12px;
            transition: all 0.3s ease;  /* 부드러운 전환 효과 */
            background-color: white;  /* 입력 필드 위에 있을 때 배경색을 설정 */
            padding: 0 5px;
            font-size: 16px;
            color: gray;
        }

        /* 입력 필드가 포커스를 받거나 입력 값이 있을 때 라벨을 위로 이동 */
        input:focus + label,
        input:not(:placeholder-shown) + label {
            top: -10px;  /* 라벨을 위로 이동 */
            font-size: 12px;  /* 글자 크기 줄이기 */
            color: #007BFF;  /* 포커스 상태에서 색상 변경 */
        }

        .gender-container {
            display: flex;
            gap: 20px;
            margin-bottom: 40px;
        }

        .gender-container label {
            display: flex;
            align-items: center;
            cursor: pointer;
            position: relative;
        }

        input[type="radio"] {
            display: none;  /* 기본 라디오 버튼 숨기기 */
        }

        .custom-radio {
            width: 16px;
            height: 16px;
            border: 2px solid #007BFF; /* 라디오 버튼 외곽선 */
            border-radius: 50%;  /* 둥근 모양 */
            margin-right: 10px;  /* 라벨과 간격 조정 */
            position: relative;
        }

        input[type="radio"]:checked + .custom-radio {
            background-color: #007BFF;  /* 체크된 경우 배경색 */
            border-color: #007BFF;
        }

        input[type="radio"]:checked + .custom-radio::after {
            content: "";
            width: 8px;
            height: 8px;
            background-color: white;  /* 내부 점 색상 */
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border-radius: 50%;
        }
        .inputID {
            display: flex;
            align-items: center;
            gap: 10px;
            width: 100%;
        }

        .check-button {
            font-size: 14px;
            height : 35px;
            width: 100px;
            cursor: pointer;
            background-color: #007BFF;
            color: white;
            border: none;
            border-radius: 5px;
            transition: background-color 0.3s;
            margin-bottom: 20px;
        }

        .check-button:hover {
            background-color: #0056b3;
        }

        #password {
            flex: 1;
            padding: 10px 5px;
            font-size: 16px;
            box-sizing: border-box;
            margin: 0; /* 불필요한 마진 제거 */
        }
        /* 사용자 ID가 유효한 경우 */
        #userid.valid {
            border: 2px solid #28a745;  /* 초록색 외곽선으로 표시 */
        }

    </style>