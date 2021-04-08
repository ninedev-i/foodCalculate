import axios from 'axios';

export const getToken = () => {
   let token = localStorage.getItem('token');
   if (!token) {
      return null;
   }

   return 'Bearer ' + token;
};

const axiosConfig = {
   baseURL: import.meta.env.VITE_SERVICE_URL,
   headers: {
      'Authorization': getToken(),
   },
};

export const isAuthenticated = () => !!getToken();

export const setToken = (token) => {
   localStorage.setItem('token', token);
   axiosConfig.headers = {
      'Authorization': getToken(),
   };
};

export const destroyToken = () => localStorage.removeItem('token');


const api = axios.create(axiosConfig);
export default api;
