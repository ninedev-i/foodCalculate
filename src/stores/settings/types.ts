export type MenuType = 'dishes' | 'ingredients';

export interface SettingsState {
   isLoading: boolean;
   isShowBackground: boolean;
   menuType: MenuType;
   people: number;
   days: number;
}
