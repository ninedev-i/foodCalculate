<template>
   <div
      class="dish-container"
      draggable="true"
      v-on:dragstart="dragStart"
      >
      <div class="dish-title">{{dish.name}}</div>
      <div
         v-for="({id, quantity}, key) in dish.ingredients"
         class="dish-ingredient"
         :key="key"
         >
         {{ingredientById(id).name}}, {{quantity * people}} {{ingredientById(id).countCaption}}
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
import {computed} from 'vue';
import {useStore} from 'vuex';

export default {
   name: 'Dish',
   props: {
      dish: Object,
      dayKey: Number,
      dishKey: Number,
   },
   setup() {
      const store = useStore();

      return {
         ingredientById: computed(() => store.getters.ingredientById),
         people: computed(() => store.state.people),
      }
   },
   methods: {
      deleteItem() {
         this.$emit('delete-item');
      },
      dragStart(ev) {
         ev.dataTransfer.setData('moveDish', JSON.stringify(this.dish));
         ev.dataTransfer.setData('moveSettings', JSON.stringify({
            dayKey: this.dayKey,
            dishKey: this.dishKey
         }));
      }
   }
}
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