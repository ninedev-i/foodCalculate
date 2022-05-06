import { defineStore } from 'pinia';
import { useFoodStore } from '@/stores/food';
import { useUserStore } from '@/stores/user';
import { SavedMenu } from '@/stores/user/types';
import { MenuType, SettingsState } from './types';

const saveToLocalStorage = (days: number, people: number): void => {
   localStorage.setItem('settings', JSON.stringify({ days, people }));
};

export const useSettingsStore = defineStore('settings', {
   state: (): SettingsState => ({
      isLoading: true,
      isShowBackground: false,
      menuType: 'dishes',
      people: 1,
      days: 1,
   }),
   getters: {
      isDataChanged: (state) => {
         const userStore = useUserStore();
         const foodStore = useFoodStore();

         const current = userStore.menus.find((item: SavedMenu) => item.is_current);
         const isMenuChanged = foodStore.isTimetableChanged;
         const isDaysChanged = current?.settings.days !== state.days;
         const isPeopleChanged = current?.settings.people !== state.people;
         return isMenuChanged || isDaysChanged || isPeopleChanged;
      }
   },
   actions: {
      setIsLoading(value: boolean) {
         this.isLoading = value;
      },
      setSettingsFromStorage() {
         const data = JSON.parse(localStorage.getItem('settings'));
         if (data) {
            this.days = data.days;
            this.people = data.people;
            saveToLocalStorage(this.days, this.people);
         }
      },
      changeMenuType(type: MenuType) {
         this.menuType = type || (this.menuType === 'dishes' ? 'ingredients' : 'dishes');
      },
      changePeople(people: number) {
         if (people > 0) {
            this.people = +people;
            saveToLocalStorage(this.days, this.people);
         }
      },
      changeDays(days: number) {
         if (days > 0 && days <= 500) {
            const foodStore = useFoodStore();
            this.days = +days;
            saveToLocalStorage(this.days, this.people);
            foodStore.setTimetable(+days);
         }
      },
      removeDay(dayKey: number) {
         const foodStore = useFoodStore();
         this.days -= 1;
         saveToLocalStorage(this.days, this.people);
         foodStore.removeDayFromMenu(dayKey);
      },
      toggleIsShowBackground() {
         this.isShowBackground = !this.isShowBackground;
      },
   }
});
