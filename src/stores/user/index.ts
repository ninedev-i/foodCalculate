import { defineStore } from 'pinia';
import api, { setToken, destroyToken, isAuthenticated } from '@/utils';
import { useSettingsStore } from '@/stores/settings';
import { getMealsFormat, useFoodStore } from '@/stores/food';
import { LoginData, MenuData, RegisterData, SavedMenu, UserState } from './types';

export const useUserStore = defineStore('user', {
   state: (): UserState => ({
      email: null,
      menus: [],
   }),
   getters: {
      currentMenu: (state) => state.menus.find(item => item.is_current)
   },
   actions: {
      async register(payload: RegisterData) {
         return api.post('register', payload);
      },
      async login(loginData: LoginData) {
         return api
            .post('login', loginData)
            .then(({ data }) => {
               this.email = loginData.email;
               setToken(data.token);
               this.getSiteData();
            });
      },
      async logout() {
         api
            .post('logout')
            .then(() => {
               this.email = null;
               this.getSiteData();
               destroyToken();
            });
         const foodStore = useFoodStore();
         const settingsStore = useSettingsStore();
         foodStore.removeAllDishes();
         settingsStore.removeAllSettings();
         localStorage.clear();
      },
      async getUserInfo(): Promise<void> {
         return new Promise((resolve) => {
            if (!isAuthenticated()) {
               return resolve();
            }
            api.get('user')
               .then((response) => {
                  this.email = response.data.email;
                  resolve();
               });
         });
      },
      async getSiteData() {
         const foodStore = useFoodStore();
         foodStore.getIngredients();
         foodStore.getDishes();
         this.getMenus();
      },
      async getMenus() {
         return api.get('menu')
            .then(({ data }: { data: SavedMenu[] }) => {
               this.menus = data;

               // Создадим у нового пользователя Меню
               if (this.email && !data.length) {
                  const defaultMenuData = {
                     title: 'Поход',
                     settings: localStorage.getItem('settings')
                        ? JSON.stringify(localStorage.getItem('settings'))
                        : JSON.stringify({ people: 1, days: 1, coefficient: 1 }),
                     content: localStorage.getItem('timetable')
                        ? JSON.stringify(localStorage.getItem('timetable'))
                        : JSON.stringify([{ meals: getMealsFormat() }]),
                     is_current: true
                  };
                  this.addMenu(defaultMenuData);
               }

               if (this.email && !localStorage.getItem('settings') || !localStorage.getItem('timetable')) {
                  setTimeout(() => {
                     const settings = useSettingsStore();
                     const foodStore = useFoodStore();
                     const currentMenu = data.find(item => item.is_current);
                     settings.changePeople(currentMenu.settings.people);
                     settings.changeDays(currentMenu.settings.days);
                     // FIXME коэффициент не сохраняется?
                     settings.changeCoefficient(currentMenu.settings?.coefficient || 1);
                     foodStore.setTimetableFromStorage(currentMenu.content);
                     localStorage.setItem('timetable', JSON.stringify(currentMenu.content));
                  }, 0);
               }
            });
      },
      async addMenu(menuData: MenuData) {
         return api
            .post('menu', menuData)
            .then(({ data }: { data: SavedMenu[] }) => {
               this.menus = data;
            });
      },
      async updateMenu(menuData: MenuData) {
         const foodStore = useFoodStore();
         const { data } = await api.put(`menu/${menuData.id}`, menuData);
         this.menus = data;
         foodStore.setIsTimetableChanged(false);
      },
      async chooseMenu(id: number) {
         return api
            .put(`menu/${id}/choose`)
            .then(({ data }: { data: SavedMenu[] }) => {
               const settings = useSettingsStore();
               const foodStore = useFoodStore();

               this.menus = data;
               const chosenData = data.find(item => item.id === id);
               foodStore.setTimetableFromStorage(chosenData.content);
               settings.changeDays(chosenData.settings.days);
               settings.changePeople(chosenData.settings.people);
            });
      },
      async deleteMenu(id: number) {
         return api
            .delete(`menu/${id}`)
            .then(({ data }: { data: SavedMenu[] }) => {
               this.menus = data;
            });
      },
   }
});

