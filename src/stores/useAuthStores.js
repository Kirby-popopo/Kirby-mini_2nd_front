import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
    const token = ref('');

    function setToken(accessToken){
        token.value = accessToken;
    }

    function clearToken() {
        token.value = '';
    }

    const isAuthenticated = () => !!token.value;

    return { token , setToken, clearToken, isAuthenticated };
});