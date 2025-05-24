// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const api = axios.create({
//   baseURL: '/api', // Base URL for the proxy
// });

// const navigate = useNavigate();

// const setupInterceptors = (navigate) => {
//   api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//       if (error.response && error.response.status === 500) {
//         navigate('/login');
//       }
//       return Promise.reject(error);
//     }
//   );
// };

// export { api, setupInterceptors };
