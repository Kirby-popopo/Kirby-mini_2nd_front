import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
    const token = ref('');

    function setToken(accessToken){
        token.value = accessToken
    }

    return { token , setToken}
})