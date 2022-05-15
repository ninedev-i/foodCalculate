export type MenuType = 'dishes' | 'ingredients';

export interface SettingsState {
   isLoading: boolean;
   isShowBackground: boolean;
   menuType: MenuType;
   coefficient: number;
   people: number;
   days: number;
}
