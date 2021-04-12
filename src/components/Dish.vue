<template>
   <div
      class="dish-container"
      draggable="true"
      v-on:dragstart="dragStart"
      @drop="dropIngredient($event, dayKey - 1, dishKey)"
      @dragover="allowDropIngredient($event, dayKey - 1, dishKey)"
   >
      <div class="dish-title" :data-dish-number="dish.id">{{dish.title}}</div>
      <div v-for="({id, quantity}, key) in dish.ingredients" class="dish-ingredient" :key="key">
         <div v-if="isEdited" class="dish-edited">
            <span>{{ingredientById(id).title}}</span>
            <input
               type="number"
               v-model="inputs[id]"
            />
            <span class="dish-ingredient-caption">{{ingredientById(id).count_caption}}/чел.</span>
         </div>
         <div class="dish-ingredients-container" v-else>
            <span class="dish-ingredient-caption">{{ingredientById(id).title}}</span>
            <span>, {{quantity * people}} {{ingredientById(id).count_caption}}.</span>
         </div>
      </div>

      <div class="dish-toolbar">
         <div
            class="dish-toolbar-edit"
            @click="editItem">✐</div>
         <div
            class="dish-toolbar-delete"
            @click="deleteItem">✖</div>
      </div>
   </div>
</template>

<script>
import {computed, ref} from 'vue';
import {useStore} from 'vuex';

export default {
   name: 'Dish',
   props: {
      dish: Object,
      dayKey: Number,
      dishKey: Number,
   },
   setup(props, {emit}) {
      const store = useStore();
      const isEdited = ref(false);
      const people = computed(() => store.state.people);
      const ingredientById = computed(() => store.getters.ingredientById);
      const inputs = computed(() => props.dish.ingredients.reduce((obj, cur) => ({...obj, [cur.id]: cur.quantity}), {}));

      const editItem = () => {
         if (isEdited.value) {
            const {dayKey, dishKey} = props;
            let ingredients = [];
            Object.keys(inputs.value).forEach((id) => {
               ingredients.push({id, quantity: +inputs.value[id]});
            });
            store.dispatch('updateDish', {dayKey, dishKey, dishId: props.dish.id, ingredients});
         }
         isEdited.value = !isEdited.value;
         store.dispatch('changeMenuType', 'ingredients');
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
         store.dispatch('addIngredientToDish', {ingredientId, dayKey: props.dayKey, dishKey: props.dishKey, dishId: props.dish.id});
      };

      return {
         people,
         inputs,
         isEdited,
         ingredientById,
         editItem,
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
      background: white;
      padding: 12px;
      margin-bottom: 8px;
      position: relative;
      border: 1px solid #ececec;
      box-shadow: @boxShadow;
      cursor: move;

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
         text-overflow: ellipsis;
         overflow: hidden;
         white-space: nowrap;
      }
   }

   &-edited {
      display: flex;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;

      input {
         width: 40px;
         height: 14px;
      }
   }

   &-toolbar {
      position: absolute;
      top: 0;
      right: 0;
      display: none;

      &-delete {
         color: red;
         .toolbarItem();
         &:hover {
            color: #ee1111;
            background: #eaeaea;
         }
      }

      &-edit{
         .toolbarItem();
         &:hover {
            color: green;
            background: #eaeaea;
         }
      }
   }

   &-title {
      margin-bottom: 6px;
      font-weight: bold;
   }
}
</style>
