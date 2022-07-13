import axios from 'axios';
import { RouteLocationNormalized } from 'vue-router';

export const getToken = () => {
   let token = localStorage.getItem('token');
   if (!token) {
      return null;
   }

   return 'Bearer ' + token;
};

export const isAuthenticated = () => !!getToken();

export const setToken = (token: string): void => localStorage.setItem('token', token);

export const destroyToken = (): void => localStorage.removeItem('token');

export const auth = (route: RouteLocationNormalized) => {
   if (route.params.token) {
      setToken(route.params.token as string);
      window.location.assign('/');
   }
};

const api = axios.create({
   baseURL: import.meta.env.VITE_SERVICE_URL as string,
   transformRequest: [(data, headers) => {
      headers['Authorization'] = getToken();
      return JSON.stringify(data);
   }],
   headers: {
      'Content-Type': 'application/json'
   }
});
export default api;
