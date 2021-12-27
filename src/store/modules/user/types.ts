import { DayMenu } from '@/store/modules/food/types';

export interface SavedMenu {
   id: number;
   is_current: boolean;
   title: string;
   updated_at: string;
   settings: {
      days: number;
      people: number;
   };
   content: DayMenu[];
}

export interface MenusForInput {
   [key: number]: string;
}

export interface UserState {
   email: string;
   menus: SavedMenu[];
   menusForInput: MenusForInput;
}
