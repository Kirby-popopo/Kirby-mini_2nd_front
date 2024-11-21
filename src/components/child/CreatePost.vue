<template>
<div class="modal-overlay" @click="sendEvent">
    <form @submit.prevent="submitUploadPost">
        <div class="upload-area">
            <div class="upload-icon">📷</div>
            <div>
                <button type="button" class="change-button" @click="selectFile">파일 선택</button>
                <input type="file" ref="fileInput" @change="handleFileUpload" style="display: none;">
            </div>

            <div id="contentArea">
                <img v-if="preSelectedFile != ''" id="imagePreview" class="image-preview" :src="preSelectedFile" alt="선택한 이미지">
                <textarea ref="postContent" name="content" maxlength="2200" placeholder="게시글 내용을 입력하세요"></textarea>
            </div>
        </div>
        <button type="submit" class="submit-button">제출</button>
    </form>
</div>

</template>

<script>
import { useAuthStore } from '@/stores/useAuthStores';
import axios from 'axios';

export default {
    data(){
        return {
            selectedFile : '',
            preSelectedFile : '',
            FileType : '',
            postContent : '',
            fileInput : '',
        }
    },
    computed:{
        authStore(){
            return useAuthStore();
        },
        userId(){
            return this.authStore.userDetail.userId;
        }
    },
    methods:{
        sendEvent() {
            this.$emit('clearPostDetail');
        },
        selectFile(){
            this.$refs.fileInput.click();
        },
        handleFileUpload(e){
            console.log("핸들러");
            const file = e.target.files[0];
            if(file){
                this.selectedFile = file;
                this.preSelectedFile = URL.createObjectURL(file);
                this.FileType = file.name.split('.').pop().toLowerCase();
                console.log(this.FileType);
            }
        },
        submitUploadPost(e){
            console.log("서밋");
            e.preventDefault();
            console.log(this.selectedFile);
            const formData = new FormData();
            formData.append('media', this.selectedFile);
            formData.append('post', JSON.stringify({
                user_id : this.userId,
                contents : this.$refs.postContent.value,
            }));

            try{
                axios.post('http://192.168.5.72:8090/api/post', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',  // 파일 처리 관련 헤더.
                        },
                }).then((response) => {
                    console.log(response);
                });
            
            this.$router.push(
                {
                    name :'profile', query: { userId: this.userId }
                });

            }catch(err){
                console.log(err);
            }
        
        }
    },
}
</script>

<style>
    .upload-icon {
        font-size: 50px;
        color: #262626;
        margin-bottom: 16px;
    }
    .upload-area{   
        padding: 24px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 300px;
    }

.modal-overlay {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
}
.image-preview {
        max-width: 100%;
        max-height: 300px;
        margin-bottom: 20px;
    }
</style>