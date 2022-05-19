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
   id: number;
   computed_id: string;
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
   meals: Dish[];
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

export type SaveIngredient = Pick<Ingredient, 'title' | 'type' | 'count_caption'>;

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
   mealKey: number;
}

export interface AddDishArguments {
   addedDish: DishMenu;
   dayKey: number;
   mealKey: number;
   sortNumber: number;
}

export interface MoveDishArguments {
   moveFrom: MovedDish;
   moveTo: MovedDish;
   movedDish: DishMenu;
   sortNumber: number;
}

export interface SortDishArguments {
   moveFrom: MovedDish;
   sortNumber: number;
   movedDish: DishMenu;
}

export interface DeleteDishArguments {
   computedId: string;
   dayKey: number;
   mealKey: number;
}

export interface UpdateDishArguments {
   dayKey: number;
   mealKey: number;
   dishName: string;
   computedId: string;
   ingredients: Ingredient[];
}

export interface UpdatedMeal {
   name: string;
   key?: number;
   menu: [];
   sortNumber?: number;
   isNew?: boolean;
   isDeleted?: boolean;
}
