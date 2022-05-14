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

export interface DishMenu {
   id: string;
   type: number;
   title: string;
   user_id: number;
   is_default: boolean;
   ingredients: Ingredient[];
}

export interface Dish {
   name: string;
   menu: DishMenu[];
}

export interface SaveDish {
   title: string;
   type: number;
   ingredients: string;
}

export interface DayMenu {
   dishes: Dish[];
}

export interface Ingredient {
   id: string | number;
   title: string;
   type: number;
   quantity?: number;
   count_caption: string;
   user_id: number;
   is_default: boolean;
}

export type SaveIngredient = Omit<Ingredient, 'id'>;

export interface FoodState {
   timetable: DayMenu[];
   dishes: DishMenu[];
   ingredients: Ingredient[];
   isTimetableChanged: boolean;
   ingredientGroups: Group[];
   dishGroups: Group[];
   editedDishIngredients: number[];

   // Getters
   ingredientById?: (id: number|string) => Ingredient;
   getSummaryIngredients?: Map<string, GroupItem>;
}

export interface MovedDish {
   dayKey: number;
   dishKey: number;
}