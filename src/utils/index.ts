import axios from 'axios';

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

export const scrollToElementIfIsNotVisible = (domElement: HTMLElement | null, layout: HTMLElement | null): Promise<void> => {
   return new Promise(() => {
      const o = new IntersectionObserver(([entry]) => {
         const isVisible = entry.intersectionRatio === 1;
         if (!isVisible) {
            const parent = (domElement as HTMLElement).offsetParent;
            layout?.scrollTo({
               top: (parent as HTMLElement).offsetTop,
               left: 0,
               behavior: 'smooth'
            });
         }
         o.disconnect();
      });
      o.observe(domElement);
   });
};
