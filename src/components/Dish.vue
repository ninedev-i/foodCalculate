<template>
   <div
      :class="`dish-container ${isEdited ? 'dish-edited' : ''}`"
      :draggable="!isEdited"
      v-on:dragstart="dragStart"
      @drop="dropIngredient($event, dayKey - 1, dishKey)"
      @dragover="allowDropIngredient($event, dayKey - 1, dishKey)"
   >
      <div v-if="dish.title" class="dish-title" :data-dish-number="dish.id">{{dish.title}}</div>
      <common-input
         v-else
         autofocus
         borderBottom
         class="dish-input-title"
         placeholder="Введите название блюда"
         :value="dishName"
         @changeValue="(value) => dishName = value"
      />
      <div v-for="({id, quantity}, key) in editedDish.ingredients" class="dish-ingredient" :key="key">
         <div v-if="isEdited" class="dish-edited-ingredients">
            <span>{{ingredientById(id).title}}</span>
            <common-input
               borderBottom
               type="number"
               inputWidth="30px"
               :value="quantity"
               @changeValue="(value) => changeInputValue(id, value)"
            />
            <span class="dish-ingredient-caption">{{ingredientById(id).count_caption}}/чел.</span>
            <span class="dish-ingredient-delete" @click="deleteIngredient(id)">
               <cross-icon />
            </span>
         </div>
         <div class="dish-ingredients-container" v-else>
            <span class="dish-ingredient-caption">{{ingredientById(id).title}}</span>
            <span>, {{quantity * people}} {{ingredientById(id).count_caption}}.</span>
         </div>
      </div>
      <div v-if="!editedDish.ingredients.length" class="dish-ingredient-tip">Перетяните сюда ингредиенты</div>

      <div class="dish-actions">
         <common-button
            v-if="isEdited"
            width="85px"
            appearance="outlined"
            @click="cancelEdit(id)"
         >
            Отменить
         </common-button>
         <common-button
            v-if="isEdited"
            width="100px"
            margin="0 0 0 12px"
            @click="saveDish"
         >
            Сохранить
         </common-button>
      </div>

      <div class="dish-toolbar">
         <div
            v-if="!isEdited"
            class="dish-toolbar-edit"
            title="Редактировать"
            @click="editItem">
            <edit-icon />
         </div>
         <div
            v-if="!isEdited"
            class="dish-toolbar-delete"
            title="Удалить"
            @click="deleteItem">
            <cross-icon />
         </div>
      </div>
   </div>
</template>

<script>
import {computed, ref} from 'vue';
import {useStore} from 'vuex';
import CommonInput from '@/components/common/Input.vue';
import CommonButton from '@/components/common/Button.vue';
import CrossIcon from '@/assets/cross.svg';
import EditIcon from '@/assets/edit.svg';
import {scrollToElementIfIsNotVisible} from '@/utils';
import {useRouter} from 'vue-router';

export default {
   name: 'Dish',
   components: {
      CommonInput,
      CommonButton,
      CrossIcon,
      EditIcon,
   },
   props: {
      dish: Object,
      dayKey: Number,
      dishKey: Number,
   },
   setup(props, {emit}) {
      const store = useStore();
      const isEdited = ref(!props.dish.title);
      const people = computed(() => store.state.people);
      const ingredientById = computed(() => store.getters.ingredientById);
      const dishName = ref('');
      const editedDish = ref({...props.dish});

      if (isEdited.value) {
         store.dispatch('changeMenuType', 'ingredients');
      }

      const changeInputValue = (ingredientId, value) => {
         editedDish.value.ingredients.find(item => item.id === ingredientId).quantity = +value;
      };

      const editItem = () => {
         isEdited.value = !isEdited.value;
         store.dispatch('toggleIsShowBackground');
         store.dispatch('changeMenuType', 'ingredients');

         // Если не помещается на экран, то скроллим к нему
         setTimeout(() => {
            scrollToElementIfIsNotVisible(
               document.querySelector('.dish-edited'),
               document.querySelector('.layout-page')
            );
         }, 100);
      };
      const saveDish = () => {
         const {dayKey, dishKey, dish} = props;

         if (!props.dish.title) {
            store.dispatch('saveDish', {
               title: dishName.value,
               ingredients: JSON.stringify(editedDish.value.ingredients)
            });
         }
         store.dispatch('updateDish', {
            dayKey,
            dishKey,
            dishId: dish.id,
            dishName: dish.title || dishName.value,
            ingredients: editedDish.value.ingredients
         });
         isEdited.value = false;
         store.dispatch('toggleIsShowBackground');
         store.dispatch('changeMenuType', 'dishes');
      };
      const cancelEdit = (ingredientId) => {
         isEdited.value = !isEdited.value;
         if (!ingredientId) {
            store.dispatch('deleteDish', {ingredientId, dayKey: props.dayKey, dishKey: props.dishKey});
         }
         store.dispatch('toggleIsShowBackground');
         store.dispatch('changeMenuType', 'dishes');
         editedDish.value = {...props.dish};
      };
      const deleteItem = () => emit('delete-item');
      const dragStart = (ev) => {
         ev.dataTransfer.setData('moveDish', JSON.stringify(props.dish));
         ev.dataTransfer.setData('moveSettings', JSON.stringify({dayKey: props.dayKey, dishKey: props.dishKey}));
      };
      const allowDropIngredient = (ev) => {
         ev.preventDefault();
         if (ev.dataTransfer.types[0] !== 'addingredient') {
            // return;
         }
         // TODO: подсветка границы
      };
      const dropIngredient = (ev) => {
         if (ev.dataTransfer.types[0] !== 'addingredient') {
            return;
         }
         const ingredientId = +ev.dataTransfer.getData('addIngredient');
         const ingredients = editedDish.value.ingredients.slice(0);
         ingredients.push({ id: String(ingredientId), quantity: 0 });
         editedDish.value = {
            ...editedDish.value,
            ...{ ingredients }
         };
      };
      const deleteIngredient = (id) => {
         editedDish.value = {
            ...editedDish.value,
            ...{ ingredients: editedDish.value.ingredients.filter(item => item.id !== String(id)) }
         };
      };

      const router = useRouter();
      router.beforeEach((to, from, next) => {
         if (isEdited.value) {
            cancelEdit(null, false);
         }
         next();
      });

      return {
         people,
         dishName,
         isEdited,
         ingredientById,
         editedDish,
         changeInputValue,
         editItem,
         saveDish,
         cancelEdit,
         dragStart,
         deleteItem,
         allowDropIngredient,
         dropIngredient,
         deleteIngredient,
      };
   },
};
</script>

<style lang="less">
@import "../assets/constants.less";

.dish {
   &-container {
      background: @containerBackground;
      padding: 12px 12px 8px;
      margin-bottom: 8px;
      position: relative;
      border: 1px solid #ececec;
      box-shadow: @boxShadow;
      cursor: move;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      @media (min-width: @largeResolution) {
         padding: 12px 18px;
      }

      &:hover {
         box-shadow: @boxShadowHovered;

         .dish-toolbar {
            display: flex;
            flex-direction: row;
         }
      }
   }

   &-ingredient {
      color: #939393;
      font-size: 14px;

      &-caption {
         .ellipsis();
      }

      &-tip {
         color: #d6d6d6;
         font-size: 14px;
         margin-bottom: 12px;
      }

      &-delete {
         .toolbarItem();
         margin-left: 12px;
      }
   }

   &-input-title {
      margin-bottom: 6px;
      font-weight: bold;
      font-size: 16px;
   }

   &-edited {
      cursor: default;
      z-index: 10;
      padding: 12px;

      &-ingredients {
         .ellipsis();
         display: flex;

         input {
            height: 14px;
            margin: 2px 7px 0 !important;
            text-align: center;
            font-size: 14px;
            padding-bottom: 2px !important;
         }
      }
   }

   &-toolbar {
      position: absolute;
      top: 0;
      right: 0;
      display: none;

      &-delete {
         .toolbarItem();
      }

      &-edit{
         .toolbarItem();
      }
   }

   &-actions {
      margin-top: 12px;
      float: right;
   }

   &-title {
      margin-bottom: 6px;
      font-weight: bold;
      .ellipsis();
   }
}
</style>
