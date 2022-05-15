import { DayMenu } from '@/stores/food/types';

export interface LoginData {
   email: string;
   password: string;
}

export interface RegisterData extends LoginData {
   password_confirmation: string;
}

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

export interface UserState {
   email: string;
   menus: SavedMenu[];
}

export interface MenuData {
   content?: string;
   id?: number;
   settings?: string;
   title?: string;
}