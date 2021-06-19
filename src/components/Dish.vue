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
         @change="(ev) => dishName = ev.target.value"
      />
      <div v-for="({id, quantity}, key) in dish.ingredients" class="dish-ingredient" :key="key">
         <div v-if="isEdited" class="dish-edited-ingredients">
            <span>{{ingredientById(id).title}}</span>
            <common-input
               borderBottom
               type="number"
               inputWidth="30px"
               :value="inputs[id]"
               @change="(ev) => inputs[id] = ev.target.value"
            />
            <span class="dish-ingredient-caption">{{ingredientById(id).count_caption}}/чел.</span>
         </div>
         <div class="dish-ingredients-container" v-else>
            <span class="dish-ingredient-caption">{{ingredientById(id).title}}</span>
            <span>, {{quantity * people}} {{ingredientById(id).count_caption}}.</span>
         </div>
      </div>
      <div v-if="!dish.ingredients.length" class="dish-ingredient-tip">Перетяните сюда ингредиенты</div>

      <div class="dish-actions">
         <common-button
            v-if="isEdited"
            width="85px"
            fontSize="12px"
            appearance="outlined"
            @click="cancelEdit"
         >
            Отменить
         </common-button>
         <common-button
            v-if="isEdited"
            width="100px"
            margin="0 0 0 12px"
            fontSize="12px"
            @click="editItem"
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
            class="dish-toolbar-delete"
            title="Удалить"
            @click="deleteItem">
            <cross-icon />
         </div>
      </div>
   </div>
</template>

<script>
import {computed, ref, watch} from 'vue';
import {useStore} from 'vuex';
import CommonInput from '@/components/common/Input.vue';
import CommonButton from '@/components/common/Button.vue';
import CrossIcon from '@/assets/cross.svg?component';
import EditIcon from '@/assets/edit.svg?component';

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

      if (isEdited.value) {
         store.dispatch('changeMenuType', 'ingredients');
      }

      const generateInputs = () => {
         return props.dish.ingredients.reduce((obj, cur) => ({...obj, [cur.id]: cur.quantity}), {});
      };
      const inputs = ref(generateInputs());

      const getInputtedIngredients = () => {
         let ingredients = [];
         Object.keys(inputs.value).forEach((id) => {
            ingredients.push({id, quantity: +inputs.value[id]});
         });
         return ingredients;
      };
      const editItem = () => {
         if (isEdited.value) {
            const {dayKey, dishKey, dish} = props;
            let ingredients = getInputtedIngredients();

            if (!props.dish.title) {
               store.dispatch('saveDish', {title: dishName.value, ingredients: JSON.stringify(ingredients)});
            }
            store.dispatch('updateDish', {dayKey, dishKey, dishId: dish.id, dishName: dish.title || dishName.value, ingredients});
         }
         cancelEdit();
      };
      const cancelEdit = () => {
         isEdited.value = !isEdited.value;
         store.dispatch('toggleIsShowBackground');
         store.dispatch('changeMenuType', (isEdited.value ? 'ingredients' : 'dishes'));
      };
      const deleteItem = () => emit('delete-item');
      const dragStart = (ev) => {
         const movedData = props.dish.title ? props.dish : {...props.dish, ...{title: dishName.value, type: 0, ingredients: getInputtedIngredients()}};
         ev.dataTransfer.setData('moveDish', JSON.stringify(movedData));
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
         store.dispatch('addIngredientToDish', {ingredientId, dayKey: props.dayKey, dishKey: props.dishKey, dishId: props.dish.id});
      };

      watch(() => isEdited.value, () => inputs.value = generateInputs());

      return {
         people,
         inputs,
         dishName,
         isEdited,
         ingredientById,
         editItem,
         cancelEdit,
         dragStart,
         deleteItem,
         allowDropIngredient,
         dropIngredient,
      };
   },
};
</script>

<style lang="less">
@import "../assets/constants.less";

.dish {
   &-container {
      background: @containerBackground;
      padding: 12px;
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
   }

   &-input-title {
      margin-bottom: 6px;
      font-weight: bold;
      font-size: 16px;
   }

   &-edited {
      cursor: default;
      z-index: 10;

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
