<script>
import { useAuthStore } from '@/stores/useAuthStores';

export default {
    components: {
    },
    data(){
        return {
            userId: '',
            descriptionText: '',
            selectedFile: '',
            selectedFileName: '',
            //profileImagePreview: null,
            profileImage: '',
            
        }
    },
    computed:{
        authStore(){
            return useAuthStore();
            }
        },
    methods: {
        async getUser(){
            // pinia에서 id 꺼내와서 사용
            console.log("실행");
            const user = await this.$axios.post('/api/GetUser', { userId:this.authStore.userDetail.userId });
            console.log(user);
            this.profileImage = user.data.obj.userProfileImage;
            this.selectedFileName = user.data.obj.userProfileImage;
            this.descriptionText = user.data.obj.userDescription;
            this.$refs.gender.value = user.data.obj.userGender;
        },
        selectImage(){
            this.$refs.fileInput.click();
        },
        handleImageUpload(e){
            const file = e.target.files[0];
            if(file){
                this.selectedFile = file;
                this.selectedFileName = file.name;
                console.log(this.selectedFile);
                this.profileImage = URL.createObjectURL(file);
            }
        },
        async submitChangeProfile(e){
            e.preventDefault();
            console.log(this.selectedFileName);

            const formData = new FormData();
            formData.append('updateImage', this.selectedFile);
            formData.append('bio', this.descriptionText);
            formData.append('updateImageName', this.selectedFileName);
            formData.append('gender', this.$refs.gender.value); 
            // pinia에서 받아오기로 바꿔야함.
            formData.append('id', this.authStore.userDetail.userId);

            try{
                const result = await this.$axios.post('/api/updateProfile', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',  // 파일 처리 관련 헤더.
                    },
                }
            );
            
            this.$router.push(
                {
                    name :'profile', query: { userId: this.authStore.userDetail.userId }
                });

            }catch(err){
                console.log(err);
            }
        }
    },
    mounted(){
        this.getUser();
    },
};
</script>

<template>
    <div class="container-profile">
    <h1>프로필 편집</h1>

    <!-- @submit.prevent="submitChangeProfile"
        기본 제출 동작을 막아준다. submitChangeProfile 를 submit시에 실행시켜준다.
    -->
    <form @submit.prevent="submitChangeProfile">
        <div class="profile-item">
            <img v-bind:src="profileImage" alt="프로필 이미지" id="profileImage">
        <div>
            <div class="username">{{ authStore.userDetail.userId }}</div>
            <div >{{authStore.userDetail.userName}}</div>
        </div>
            <button class="change-button" @click="selectImage">사진 변경</button>
            <input type="file" ref="fileInput" @change="handleImageUpload" style="display: none;">
        </div>

        <div class="form-group">
            <label for="website">웹사이트</label>
            <input type="text" id="website" name="website" placeholder="웹사이트" disabled>
            <p style="font-size:10px; color:gray;">링크 수정은 모바일에서만 가능합니다. Instagram 앱으로 이동하여 프로필의 소개에서 웹사이트를 변경하여 수정하세요.</p>
        </div>
        <div class="form-group">
            <label for="bio">소개</label>
            <textarea id="bio" name="bio" maxlength="150" v-model="descriptionText"></textarea>
            <div class="char-count"><span id="textCount">{{ descriptionText.length }}</span> / 150</div>
        </div>

        <div class="form-group">
            <label for="gender">성별</label>
            <select id="gender" name="gender" ref="gender" required>
                <option value="" selected disabled>선택</option>
                <option value="male">남성</option>
                <option value="female">여성</option>
            </select>
        </div>

        <div class="form-group toggle-container">
            <div>
                <div>프로필에 계정 추천 표시</div>
                <div>사람들이 회원님의 프로필에서 비슷한 계정 추천을 볼 수 있는지와 회원님의 계정이 다른 프로필에서 추천될 수 있는지를 선택하세요.</div>
            </div>
            <label class="toggle-switch">
                <input type="checkbox" checked>
                <span class="slider"></span>
            </label>
        </div>
        <button type="submit" class="submit-button">제출</button>
    </form>
</div>
</template>

<style lang="css">
        .container-profile {
            position: fixed;
            left: 50%; /* 화면의 50% 위치로 이동 */
            top: 0; /* 상단에 고정 */
            transform: translateX(-50%); /* 요소의 수평 중앙으로 이동 */
            max-width: 600px;
            margin: 0 auto;
            background-color: #121212;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            justify-content: center;
            align-items: center;
            color: white;
            width: 500px;
        }
        h1 {
            margin-top: 0;
            margin-bottom: 20px;
            font-size: 24px;
        }
        .profile-item {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
        }
        .profile-item img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 10px;
        }
        .profile-item .username {
            font-weight: bold;
        }
        .profile-item .change-button {
            margin-left: auto;
            background-color: #0095f6;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            width: 300px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input[type="text"], textarea, select {
            width: 100%;
            padding: 8px;
            border: 1px solid #dbdbdb;
            border-radius: 4px;
            box-sizing: border-box;
        }
        textarea {
            height: 100px;
            resize: vertical;
        }
        .char-count {
            text-align: right;
            color: #8e8e8e;
            font-size: 12px;
        }
        .toggle-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .toggle-switch {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 24px;
        }
        .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 24px;
        }
        .slider:before {
            position: absolute;
            content: "";
            height: 20px;
            width: 20px;
            left: 2px;
            bottom: 2px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
        input:checked + .slider {
            background-color: #0095f6;
        }
        input:checked + .slider:before {
            transform: translateX(26px);
        }
        .submit-button {
            background-color: #0095f6;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            width: 100%;
        }
</style>