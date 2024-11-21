import axios from 'axios';
import { useAuthStore } from '@/stores/useAuthStores';

// const instance = axios.create({
//   baseURL: 'http://localhost:8090/',  
//   timeout: 10000,  
//   headers: {
//     'Content-Type': 'application/json',
//     'X-Requested-With': 'XMLHttpRequest'    //AJAX 요청임을 알림
//   }
// });

const instance = axios.create({
  baseURL: 'http://localhost:8090/',
  timeout: 10000,  
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'    //AJAX 요청임을 알림
  }
});

/* *
 *  아래 인터셉터는 추후 어떻게 적용할 지 생각해 본 후 결정.
 */
//요청 인터셉터
instance.interceptors.request.use((config) =>{
  // pinia 스토어에서 토큰을 가져와 요청 전에 먼저 헤더에 토큰을 담아준다.
  // pinia로 토큰 관리하고 아이디도 토큰안에 넣어두고 사용하는 것으로.
  const authStore = useAuthStore();
  const accessToken = authStore.accessToken;
  if (accessToken) {
      config.headers['authorization'] = `${accessToken}`;
  }
  return config;
});


// //응답 인터셉터
// instance.interceptors.response.use(
//   (response) => {
//     // HTTP.OK 등 성공 응답은 그대로 전해진다.
//     // 이것도 뭔가 처리할거면 처리해도 괜찮을 듯
//     return response;
//   },
//   (error) => {
//     // 그 외의 응답은 해당 부분으로 처리할 겁니다. 
//     // pinia로 refreshToken 바로 요청해도 좋고 등등.
//     // 지훈이형 부탁해요.
//     return Promise.reject(error);
//   }
// );

export default instance;