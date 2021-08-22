import axios from 'axios';

export const getToken = () => {
   let token = localStorage.getItem('token');
   if (!token) {
      return null;
   }

   return 'Bearer ' + token;
};

export const isAuthenticated = () => !!getToken();

export const setToken = (token) => localStorage.setItem('token', token);

export const destroyToken = () => localStorage.removeItem('token');

const api = axios.create({
   baseURL: import.meta.env.VITE_SERVICE_URL,
   transformRequest: [(data, headers) => {
      headers['Authorization'] = getToken();
      return JSON.stringify(data);
   }],
   headers: {
      'Content-Type': 'application/json'
   }
});
export default api;

export const scrollToElementIfIsNotVisible = (domElement, layout) => {
   return new Promise(() => {
      const o = new IntersectionObserver(([entry]) => {
         const isVisible = entry.intersectionRatio === 1;
         if (!isVisible) {
            layout.scrollTo({
               top: domElement.offsetParent.offsetTop,
               left: 0,
               behavior: 'smooth'
            });
         }
         o.disconnect();
      });
      o.observe(domElement);
   });
};
