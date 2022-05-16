import { defineStore } from 'pinia';
import api from '@/utils';
import { DayMenu, Dish, DishMenu, FoodState, GroupItem, Ingredient, MovedDish, SaveDish, SaveIngredient } from './types';

const getMealsFormat = (): Dish[] => [
   { name: 'Завтрак', menu: [] }, { name: 'Обед', menu: [] }, { name: 'Ужин', menu: [] }
];

const saveToLocalStorage = (timetable: DayMenu[]): void => {
   localStorage.setItem('timetable', JSON.stringify(timetable));
};

export const useFoodStore = defineStore('food', {
   state: (): FoodState => ({
      timetable: [{ meals: getMealsFormat() }],
      dishes: [],
      ingredients: [],
      isTimetableChanged: false,
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
      dishById: state => (id: string|number) => state.dishes.find(item => item.id === id),
      dishesByGroup: state => (groupId: number) => state.dishes.filter(item => item.type === groupId),
      ingredientById: state => (id: number): Ingredient => state.ingredients.find(item => +item.id === +id),
      ingredientsByGroup: state => (groupId: number) => state.ingredients.filter(item => {
         return item.type === groupId && !state.editedDishIngredients.includes(item.id as number);
      }),
      getSummaryIngredients: (state) => {
         const output = new Map();
         state.timetable
            .map(item => item.meals).flat()
            .map(item => item.menu).flat()
            .map(item => item.ingredients).flat()
            .forEach((ingredient) => {
               if (ingredient.quantity) {
                  const { title, type, count_caption: countCaption } = state.ingredientById(ingredient.id);
                  output.set(ingredient.id, {
                     ...output.get(ingredient.id),
                     ...{
                        quantity: (output.get(ingredient.id)?.quantity || 0) + ingredient.quantity,
                        title,
                        type,
                        countCaption,
                     },
                  });
               }
            });

         return output;
      },
      getSummaryGrouped: (state) => {
         const output = state.ingredientGroups.slice(0);
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
      async getDishes() {
         return api.get('dish').then(({ data }) => {
            this.dishes = data;
         });
      },
      getIngredients() {
         return api.get('ingredient').then(({ data }) => {
            this.ingredients = data;
         });
      },
      saveIngredient(data: SaveIngredient) {
         api.post('ingredient', data).then(({ data }) => {
            this.ingredients = data;
         });
      },
      deleteIngredient(id: number) {
         api.delete(`ingredient/${id}`).then(({ data }) => {
            this.ingredients = data;
         });
      },
      deleteDishFromBase(id: number) {
         api.delete(`dish/${id}`, { data: { current: this.timetable } }).then(({ data }) => {
            this.dishes = data.dishList;
            if (Array.isArray(data.current)) {
               this.timetable = data.current;
               saveToLocalStorage(this.timetable);
            }
         });
      },
      async saveDish(data: SaveDish) {
         this.dishes = await api.post('dish', data).then(({ data }) => data);
         saveToLocalStorage(this.timetable);
         this.isTimetableChanged = true;
      },
      async checkIsDishUsed(id: number): Promise<string[]> {
         return api.post(`dish/is_used/${id}`, { current: JSON.stringify(this.timetable) }).then(res => res.data);
      },
      addDish({ addedDish, dayKey, dishKey, sortNumber }: { addedDish: DishMenu; dayKey: number; dishKey: number; sortNumber: number }) {
         const timetable = this.timetable.slice(0);
         const addedItem = addedDish;
         if (!addedItem.ingredients) {
            addedItem.ingredients = [];
         }
         timetable[dayKey].meals[dishKey].menu.splice(sortNumber, 0, addedDish);
         this.timetable = timetable;
         if (addedDish.title) {
            saveToLocalStorage(timetable);
         }
         this._updateDishIds(dayKey, dishKey);
         this.isTimetableChanged = true;
      },
      moveDish({ moveFrom, moveTo, movedDish, sortNumber }: { moveFrom: MovedDish; moveTo: MovedDish; movedDish: DishMenu; sortNumber: number }) {
         const computedId = movedDish.computed_id;
         this._removeDish({ computedId, dayKey: moveFrom.dayKey, dishKey: moveFrom.dishKey });
         this.isTimetableChanged = true;
         this.timetable[moveTo.dayKey].meals[moveTo.dishKey].menu.splice(sortNumber, 0, movedDish);
         this._updateDishIds(moveTo.dayKey, moveTo.dishKey);
         saveToLocalStorage(this.timetable);
      },
      sortDish({ moveFrom, sortNumber, movedDish }: { moveFrom: MovedDish; sortNumber: number; movedDish: DishMenu}) {
         const currentMenu = this.timetable[moveFrom.dayKey].meals[moveFrom.dishKey].menu;
         const currentNumber = currentMenu.map(item => item.id).indexOf(movedDish.id);
         const deletedItem = currentNumber > sortNumber ? currentNumber + 1 : currentNumber;
         currentMenu.splice(sortNumber, 0, movedDish);
         currentMenu.splice(deletedItem, 1);
         this._updateDishIds(moveFrom.dayKey, moveFrom.dishKey);

         saveToLocalStorage(this.timetable);
         this.isTimetableChanged = true;
      },
      deleteDish({ computedId, dayKey, dishKey }: { computedId: string; dayKey: number; dishKey: number }) {
         this._removeDish({ computedId, dayKey, dishKey });
         this._updateDishIds(dayKey, dishKey);
         this.isTimetableChanged = true;
      },
      updateDish({ dayKey, dishKey, computedId, dishName, ingredients }: { dayKey: number; dishKey: number; dishName: string; computedId: string; ingredients: Ingredient[]}) {
         this.timetable[dayKey].meals[dishKey].menu.map((item) => {
            if (item.computed_id === computedId) {
               item.title = dishName;
               item.ingredients = ingredients;
            }
         });
         saveToLocalStorage(this.timetable);
         this.isTimetableChanged = true;
      },
      addDayToTimetable(data: number) {
         const timetable = this.timetable.slice(0);
         const difference = data - timetable.length;
         if (difference > 0) {
            for (let i = 0; i < difference; i++) {
               timetable.push({ meals: getMealsFormat() });
            }
         }
         this.timetable = timetable;
         saveToLocalStorage(timetable);
      },
      removeDayFromTimetable(deletedDayKey: number) {
         let updatedTimetable = this.timetable.slice(0);
         updatedTimetable = updatedTimetable.filter((day: DayMenu, dayKey: number) => {
            if (dayKey + 1 > deletedDayKey) {
               return day.meals.map(item => {
                  item.menu.map(dish => {
                     const ids = dish.computed_id.split('_');
                     ids[0] = String(+ids[0] - 1);
                     dish.computed_id = ids.join('_');
                     return dish;
                  });
                  return item;
               });
            } else if (dayKey + 1 < deletedDayKey) {
               return day;
            } else {
               return false;
            }
         });

         this.timetable = updatedTimetable;
         saveToLocalStorage(this.timetable);
      },
      setEditedDishIngredients(ids: number[]) {
         this.editedDishIngredients = ids;
      },

      _updateDishIds(dayKey: number, dishKey: number) {
         this.timetable[dayKey].meals[dishKey].menu.map((item, key) => {
            item.computed_id = `${dayKey}_${dishKey}_${key}`;
            return item;
         });
      },
      _removeDish({ computedId, dayKey, dishKey }: { computedId: string; dayKey: number; dishKey: number }) {
         const editedMenu = this.timetable[dayKey].meals[dishKey].menu.slice(0);
         this.timetable[dayKey].meals[dishKey].menu = editedMenu.filter((item) => computedId !== item.computed_id);
         saveToLocalStorage(this.timetable);
      },
   }
});
