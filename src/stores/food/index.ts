import { defineStore } from 'pinia';
import api from '@/utils';
import {
   AddDishArguments,
   DayMenu,
   DeleteDishArguments,
   Dish,
   DishMenu,
   FoodState,
   Group,
   GroupItem,
   Ingredient,
   MoveDishArguments,
   SaveDish,
   SaveIngredient,
   SortDishArguments,
   UpdateDishArguments,
   UpdatedMeal
} from './types';

export const getMealsFormat = (): Dish[] => [
   { name: 'Завтрак', menu: [] }, { name: 'Обед', menu: [] }, { name: 'Ужин', menu: [] }
];

const saveToLocalStorage = (timetable: DayMenu[]): void => {
   localStorage.setItem('timetable', JSON.stringify(timetable));
};

const groupObject = {
   expanded: true,
   toggle() {
      this.expanded = !this.expanded;
   }
};

export const useFoodStore = defineStore('food', {
   state: (): FoodState => ({
      timetable: [{ meals: getMealsFormat() }],
      dishes: new Map(),
      ingredients: new Map(),
      isTimetableChanged: false,
      ingredientsGrouped: new Map(),
      dishMenusGrouped: new Map(),
      ingredientGroups: [
         { id: 0, name: 'Крупы' },
         { id: 1, name: 'Мучное' },
         { id: 2, name: 'Специи и приправы' },
         { id: 3, name: 'Мясное' },
         { id: 4, name: 'Овощи и фрукты' },
         { id: 5, name: 'Другое' },
      ],
      dishGroups: [
         { id: 0, name: 'Напитки' },
         { id: 1, name: 'Каши' },
         { id: 2, name: 'Второе' },
         { id: 3, name: 'Супы' },
      ],
      editedDishIngredients: []
   }),
   getters: {
      dishById: state => (id: number): DishMenu => state.dishes.get(id),
      ingredientById: state => (id: number): Ingredient => state.ingredients.get(id),
      getSummaryIngredients: state => {
         const output = new Map();
         state.timetable
            .map(item => item.meals).flat()
            .map(item => item.menu).flat()
            .map(item => item.ingredients).flat()
            .forEach((ingredient) => {
               if (ingredient.quantity) {
                  const currentIngredient = state.ingredientById(+ingredient.id);
                  output.set(+ingredient.id, {
                     ...output.get(ingredient.id),
                     ...{
                        quantity: (output.get(ingredient.id)?.quantity || 0) + ingredient.quantity,
                        title: currentIngredient.title,
                        type: currentIngredient.type,
                        countCaption: currentIngredient.count_caption,
                     },
                  });
               }
            });
         return output;
      },
      getSummaryGrouped: state => {
         const output: Group[] = JSON.parse(JSON.stringify(state.ingredientGroups));
         output.map((group) => {
            group.items = [];
            state.getSummaryIngredients.forEach((item: GroupItem) => {
               if (item.type === group.id) {
                  group.items.push(item);
               }
            });
            return group;
         });
         return output;
      },
      hasDishesInMenu: state => !!state.timetable.map(day => day.meals).flat().map(meal => meal.menu).flat().length
   },
   actions: {
      setTimetableFromStorage(dataFromBase?: DayMenu[]) {
         const data = dataFromBase || JSON.parse(localStorage.getItem('timetable'));
         if (data) {
            this.timetable = data;
         }
      },
      setIsTimetableChanged(value: boolean) {
         this.isTimetableChanged = value;
      },
      updateMeals(updatedMeals: UpdatedMeal[]) {
         const addedMeals = updatedMeals.filter(item => {
            if (item.isNew) {
               delete item.isNew;
               return item;
            } else {
               return false;
            }
         });

         this.timetable.map(day => {
            day.meals = day.meals.filter((meal, i) => {
               const updated = updatedMeals.find(item => item.key === i);
               if (updated.isDeleted) {
                  return false;
               }
               meal.name = updated.name;
               return meal;
            });
            if (addedMeals.length) {
               day.meals = [...day.meals, ...addedMeals];
            }
            return day;
         });
         this.setIsTimetableChanged(true);
         saveToLocalStorage(this.timetable);
      },
      async getDishes(): Promise<void> {
         const { data: dishes } = await api.get('dish');
         this._setDishes(dishes);
      },
      async getIngredients(): Promise<void> {
         const { data: ingredients } = await api.get('ingredient');
         this._setIngredients(ingredients);
      },
      async saveIngredient(data: SaveIngredient): Promise<void> {
         const { data: ingredients } = await api.post('ingredient', data);
         this._setIngredients(ingredients);
      },
      async deleteIngredient(id: number): Promise<void> {
         const { data: ingredients } = await api.delete(`ingredient/${id}`);
         this._setIngredients(ingredients);
      },
      async deleteDishFromBase(id: number): Promise<void> {
         const { data } = await api.delete(`dish/${id}`, { data: { current: this.timetable } });
         this._setDishes(data.dishList);
         if (Array.isArray(data.current)) {
            this.timetable = data.current;
            saveToLocalStorage(this.timetable);
         }
      },
      async saveDish({ title, type, ingredients }: SaveDish): Promise<void> {
         const { data: dishes } = await api.post('dish', { title, type, ingredients: JSON.stringify(ingredients) });
         this._setDishes(dishes);
         this.setIsTimetableChanged(true);
         saveToLocalStorage(this.timetable);
      },
      async checkIsDishUsed(id: number): Promise<string[]> {
         const { data: dishNames } = await api.post(`dish/is_used/${id}`, { current: JSON.stringify(this.timetable) });
         return dishNames;
      },
      addDish({ addedDish, dayKey, mealKey, sortNumber }: AddDishArguments) {
         this.timetable[dayKey].meals[mealKey].menu.splice(sortNumber, 0, addedDish);
         this._updateDishIds(dayKey, mealKey);
         this.setIsTimetableChanged(true);
         saveToLocalStorage(this.timetable);
      },
      moveDish({ moveFrom, moveTo, movedDish, sortNumber }: MoveDishArguments): void {
         const computedId = movedDish.computed_id;
         this._removeDish({ computedId, dayKey: moveFrom.dayKey, mealKey: moveFrom.mealKey });
         this.timetable[moveTo.dayKey].meals[moveTo.mealKey].menu.splice(sortNumber, 0, movedDish);
         this._updateDishIds(moveTo.dayKey, moveTo.mealKey);
         this.setIsTimetableChanged(true);
         saveToLocalStorage(this.timetable);
      },
      sortDish({ moveFrom, sortNumber, movedDish }: SortDishArguments): void {
         const currentMenu = this.timetable[moveFrom.dayKey].meals[moveFrom.mealKey].menu;
         const currentNumber = currentMenu.map(item => item.id).indexOf(movedDish.id);
         const deletedItem = currentNumber > sortNumber ? currentNumber + 1 : currentNumber;
         currentMenu.splice(sortNumber, 0, movedDish);
         currentMenu.splice(deletedItem, 1);
         this._updateDishIds(moveFrom.dayKey, moveFrom.mealKey);
         this.setIsTimetableChanged(true);
         saveToLocalStorage(this.timetable);
      },
      deleteDish({ computedId, dayKey, mealKey }: DeleteDishArguments): void {
         this._removeDish({ computedId, dayKey, mealKey });
         this._updateDishIds(dayKey, mealKey);
         this.setIsTimetableChanged(true);
      },
      updateDish({ dayKey, mealKey, computedId, dishName, ingredients }: UpdateDishArguments): void {
         this.timetable[dayKey].meals[mealKey].menu.map((item) => {
            if (item.computed_id === computedId) {
               item.title = dishName;
               item.ingredients = ingredients;
            }
         });
         saveToLocalStorage(this.timetable);
         this.setIsTimetableChanged(true);
      },
      addDayToTimetable(data: number): void {
         const difference = data - this.timetable.length;
         if (difference > 0) {
            for (let i = 0; i < difference; i++) {
               let meals: Dish[] = JSON.parse(JSON.stringify(this.timetable[0].meals));
               meals.map((item) => {
                  item.menu = [];
                  return item;
               });
               this.timetable.push({ meals });
            }
         }
         saveToLocalStorage(this.timetable);
      },
      removeDayFromTimetable(deletedDayKey: number): void {
         this.timetable = this.timetable.filter((day: DayMenu, dayKey: number) => {
            if (dayKey + 1 > deletedDayKey) {
               return day.meals.map(meal => {
                  meal.menu.map(dish => {
                     const ids = dish.computed_id.split('_');
                     ids[0] = String(+ids[0] - 1);
                     dish.computed_id = ids.join('_');
                     return dish;
                  });
                  return meal;
               });
            } else if (dayKey + 1 < deletedDayKey) {
               return day;
            } else {
               return false;
            }
         });
         saveToLocalStorage(this.timetable);
      },
      setEditedDishIngredients(ids: number[]): void {
         this.editedDishIngredients = ids;
      },
      removeAllDishes(): void {
         this.timetable = [{ meals: getMealsFormat() }];
      },

      _setIngredients(ingredients: Ingredient[]): void {
         this.ingredients = new Map(ingredients.map((ingredient: Ingredient) => [ingredient.id, ingredient]));

         const ingredientGroupsMap = new Map(this.ingredientGroups.map(group => [group.id, group.name]));
         const ingredientsGrouped = new Map();
         ingredients.forEach((ingredient: Ingredient) => {
            if (ingredientsGrouped.has(ingredientGroupsMap.get(ingredient.type))) {
               const prevIngredients = ingredientsGrouped.get(ingredientGroupsMap.get(ingredient.type)).items;
               ingredientsGrouped.set(ingredientGroupsMap.get(ingredient.type), { ...groupObject, items: [...prevIngredients, ingredient] });
            } else {
               ingredientsGrouped.set(ingredientGroupsMap.get(ingredient.type), { ...groupObject, items: [ingredient] });
            }
         });

         this.ingredientsGrouped = ingredientsGrouped;
      },
      _setDishes(dishMenus: DishMenu[]): void {
         this.dishes = new Map(dishMenus.map((dishMenu: DishMenu) => [dishMenu.id, dishMenu]));

         const dishMenuGroupsMap = new Map(this.dishGroups.map(group => [group.id, group.name]));
         const dishMenuGrouped = new Map();
         dishMenus.forEach((dishMenu: DishMenu) => {
            if (dishMenuGrouped.has(dishMenuGroupsMap.get(dishMenu.type))) {
               const prevIngredients = dishMenuGrouped.get(dishMenuGroupsMap.get(dishMenu.type)).items;
               dishMenuGrouped.set(dishMenuGroupsMap.get(dishMenu.type), { ...groupObject, items: [...prevIngredients, dishMenu] });
            } else {
               dishMenuGrouped.set(dishMenuGroupsMap.get(dishMenu.type), { ...groupObject, items: [dishMenu] });
            }
         });
         this.dishMenusGrouped = dishMenuGrouped;
      },
      _updateDishIds(dayKey: number, mealKey: number): void {
         this.timetable[dayKey].meals[mealKey].menu.map((item, key) => {
            item.computed_id = `${dayKey}_${mealKey}_${key}`;
            return item;
         });
      },
      _removeDish({ computedId, dayKey, mealKey }: { computedId: string; dayKey: number; mealKey: number }): void {
         const meals = this.timetable[dayKey].meals[mealKey];
         meals.menu = meals.menu.filter((item) => computedId !== item.computed_id);
         saveToLocalStorage(this.timetable);
      },
   }
});
