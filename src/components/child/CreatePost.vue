<template>
<div class="modal-overlay d-flex justify-content-center align-items-center">
    <div class="modal-content bg-white rounded-3 overflow-hidden">
        <div class="modal-header border-bottom p-2">
            <h5 class="modal-title m-0">새 게시물 만들기</h5>
            <button type="button" class="btn-close" @click="sendEvent" aria-label="Close"></button>
        </div>

        <form @submit.prevent="submitUploadPost">
        <div class="row g-0">
        <div class="col-7 border-end">
            <div class="upload-area d-flex justify-content-center align-items-center">
            <div v-if="!preSelectedFile" class="text-center">
                <div class="upload-icon mb-3">📷</div>
            <button type="button" class="btn btn-primary" @click="selectFile">파일 선택</button>
            <input type="file" ref="fileInput" @change="handleFileUpload" class="d-none">
            </div>
            <div v-else id="imagePreview">
                <img class="img-fluid" :src="preSelectedFile" alt="선택한 이미지">
                <button type="button" class="btn btn-primary" @click="selectFile">파일 선택</button>
                <input type="file" ref="fileInput" @change="handleFileUpload" class="d-none">
            </div>
        </div>
        </div>
        <div class="col-5">
        <div class="p-3">
            <textarea ref="postContent" name="content" maxlength="2200" class="form-control border-0" rows="10" placeholder="게시글 내용을 입력하세요"></textarea>
        </div>
        <div class="p-3 border-top">
            <button type="submit" class="btn btn-primary w-100">공유하기</button>
        </div>
        </div>
    </div>
    </form></div>
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
            console.log("test");
            this.$emit('custom-event', "test");
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
.modal-header {
  background-color: #fff;
}

.modal-title {
  flex-grow: 1;
  text-align: center;
  font-weight: 600;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  padding: 0.5rem;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.btn-close:hover {
  opacity: 1;
}

.close-button{
    width: 40px;
    height: 40px;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1050;
}

.modal-content {
  width: 100%;
  max-width: 935px;
  height: 600px;
}

.upload-area {
  height: 100%;
  background-color: #fafafa;
}

.upload-icon {
  font-size: 50px;
  color: #262626;
}

.img-fluid {
  max-height: 100%;
  object-fit: contain;
}

textarea.form-control {
  resize: none;
  height: 100%;
}

/* 스크롤바 스타일링 */
textarea.form-control::-webkit-scrollbar {
  width: 8px;
}

textarea.form-control::-webkit-scrollbar-thumb {
  background-color: #c7c7c7;
  border-radius: 4px;
}

textarea.form-control::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}


</style>