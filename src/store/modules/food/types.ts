export interface GroupItem {
   countCaption: string;
   quantity: number;
   title: string;
   type: number;
}

export interface Group {
   id: number;
   name: string;
   expanded?: boolean;
   items?: GroupItem[];
}

export interface Ingredient {
   id: number | string;
   quantity: number;
}

export interface DishMenu {
   id: string;
   type: number;
   title: string;
   ingredients: Ingredient[];
}

export interface Dish {
   name: string;
   menu: DishMenu[];
}

export interface DayMenu {
   dishes: Dish[];
}

export interface Ingredient {
   id: string | number;
   title: string;
   type: number;
   count_caption: string;
}

export interface FoodState {
   timetable: DayMenu[];
   dishes: DishMenu[];
   ingredients: Ingredient[];
   isTimetableChanged: boolean;
   ingredientGroups: Group[];
   dishGroups: Group[];
}
