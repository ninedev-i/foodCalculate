import { defineStore } from 'pinia';
import api from '@/utils';
import { DayMenu, Dish, DishMenu, FoodState, GroupItem, Ingredient, MovedDish, SaveDish, SaveIngredient } from './types';

const getDishFormat = (): Dish[] => [
   { name: 'Завтрак', menu: [] }, { name: 'Обед', menu: [] }, { name: 'Ужин', menu: [] }
];

const saveToLocalStorage = (timetable: DayMenu[]): void => {
   localStorage.setItem('timetable', JSON.stringify(timetable));
};

export const useFoodStore = defineStore('food', {
   state: (): FoodState => ({
      timetable: [{ dishes: getDishFormat() }],
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
            .map(item => item.dishes).flat()
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
      setTimetable(data: number) {
         const timetable = this.timetable.slice(0);
         const difference = data - timetable.length;
         if (difference > 0) {
            for (let i = 0; i < difference; i++) {
               timetable.push({ dishes: getDishFormat() });
            }
         }
         this.timetable = timetable;
         saveToLocalStorage(timetable);
      },
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
         api.delete(`dish/${id}`).then(({ data }) => {
            this.dishes = data;
         });
      },
      async saveDish(data: SaveDish) {
         this.dishes = await api.post('dish', data).then(({ data }) => data);
         saveToLocalStorage(this.timetable);
         this.isTimetableChanged = true;
      },
      addDish({ addedDish, dayKey, dishKey, sortNumber }: { addedDish: DishMenu; dayKey: number; dishKey: number; sortNumber: number }) {
         const timetable = this.timetable.slice(0);
         const addedItem = addedDish;
         if (!addedItem.ingredients) {
            addedItem.ingredients = [];
         }
         timetable[dayKey].dishes[dishKey].menu.splice(sortNumber, 0, addedDish);
         this.timetable = timetable;
         if (addedDish.title) {
            saveToLocalStorage(timetable);
         }
         this._updateDishIds(dayKey, dishKey);
         this.isTimetableChanged = true;
      },
      moveDish({ moveFrom, moveTo, movedDish, sortNumber }: { moveFrom: MovedDish; moveTo: MovedDish; movedDish: DishMenu; sortNumber: number }) {
         const id = movedDish.id;
         this._removeDish({ id, dayKey: moveFrom.dayKey, dishKey: moveFrom.dishKey });
         this.isTimetableChanged = true;
         this.timetable[moveTo.dayKey].dishes[moveTo.dishKey].menu.splice(sortNumber, 0, movedDish);
         this._updateDishIds(moveTo.dayKey, moveTo.dishKey);
         saveToLocalStorage(this.timetable);
      },
      sortDish({ moveFrom, sortNumber, movedDish }: { moveFrom: MovedDish; sortNumber: number; movedDish: DishMenu}) {
         const currentMenu = this.timetable[moveFrom.dayKey].dishes[moveFrom.dishKey].menu;
         const currentNumber = currentMenu.map(item => item.id).indexOf(movedDish.id);
         const deletedItem = currentNumber > sortNumber ? currentNumber + 1 : currentNumber;
         currentMenu.splice(sortNumber, 0, movedDish);
         currentMenu.splice(deletedItem, 1);
         this._updateDishIds(moveFrom.dayKey, moveFrom.dishKey);

         saveToLocalStorage(this.timetable);
         this.isTimetableChanged = true;
      },
      deleteDish({ id, dayKey, dishKey }: { id: string; dayKey: number; dishKey: number }) {
         this._removeDish({ id, dayKey, dishKey });
         this._updateDishIds(dayKey, dishKey);
         this.isTimetableChanged = true;
      },
      updateDish({ dayKey, dishKey, dishId, dishName, ingredients }: { dayKey: number; dishKey: number; dishId: string; dishName: string; ingredients: Ingredient[]}) {
         this.timetable[dayKey].dishes[dishKey].menu.map((item) => {
            if (item.id === dishId) {
               item.title = dishName;
               item.ingredients = ingredients;
            }
         });
         saveToLocalStorage(this.timetable);
         this.isTimetableChanged = true;
      },
      removeDayFromMenu(deletedDayKey: number) {
         let updatedTimetable = this.timetable.slice(0);
         updatedTimetable = updatedTimetable.filter((day: DayMenu, dayKey: number) => {
            if (dayKey + 1 > deletedDayKey) {
               return day.dishes.map(item => {
                  item.menu.map(dish => {
                     const ids = dish.id.split('_');
                     ids[0] = String(+ids[0] - 1);
                     dish.id = ids.join('_');
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
         this.timetable[dayKey].dishes[dishKey].menu.map((item, key) => {
            item.id = `${dayKey}_${dishKey}_${key}`;
            return item;
         });
      },
      _removeDish({ id, dayKey, dishKey }: { id: string; dayKey: number; dishKey: number }) {
         const editedMenu = this.timetable[dayKey].dishes[dishKey].menu.slice(0);
         if (id) {
            this.timetable[dayKey].dishes[dishKey].menu = editedMenu.filter((item) => id !== item.id);
         } else {
            // Удалим свое блюдо при отмене редактирования
            this.timetable[dayKey].dishes[dishKey].menu = editedMenu.filter((item) => item.title);
         }
         saveToLocalStorage(this.timetable);
      },
   }
});
