<template>
   <div ref="trigger" class="menu-trigger" @mouseenter="showTooltip" @focus="showTooltip" @mouseleave="hideTooltip" @blur="hideTooltip">
      <slot />
   </div>
   <teleport to="body">
      <ul ref="tooltip" class="menu" @mouseenter="tooltipHover" @mouseleave="hideTooltip">
         <li v-for="(item, key) in items" :key="key" class="menu-item">
            <a :href="item.url" @click="clickHandler($event, item.action)">{{ item.caption }}</a>
         </li>
      </ul>
   </teleport>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { computePosition, offset, shift } from '@floating-ui/dom';

const trigger = ref();
const tooltip = ref();
const isTooltipHovered = ref(false);

const props = defineProps({
   items: {
      type: Array,
      default: () => []
   },
});

console.log(props.items);

const update = () => {
   computePosition(trigger.value, tooltip.value,
      { placement: 'bottom', middleware: [offset(10), shift()] }
   ).then(({ x, y }: { x: number; y: number }) => {
      Object.assign(tooltip.value.style, {
         left: `${x}px`,
         top: `${y}px`,
      });
   });
};

const tooltipHover = () => isTooltipHovered.value = true;

const clickHandler = (ev: Event, action?: () => void) => {
   if (!action) {
      return;
   }
   ev.preventDefault();
   action();
};

const showTooltip = () => {
   tooltip.value.style.display = 'block';
   update();
};

const hideTooltip = () => {
   isTooltipHovered.value = false;
   setTimeout(() => {
      if (isTooltipHovered.value) {
         return;
      }
      tooltip.value.style.display = '';
   }, 200);
};
</script>

<style lang="less" scoped>
@import "../../assets/constants.less";

.menu {
   display: none;
   position: absolute;
   top: 0;
   left: 0;
   background: #fcfcfe;
   color: #2c3e50;
   border: 1px solid @borderColorLight;
   box-shadow: @boxShadow;

   &-trigger {
      cursor: pointer;
   }

   &-item {
      list-style: none;
      cursor: pointer;
      font-size: 14px;

      a {
         display: block;
         color: @fontColor;
         width: 100%;
         padding: 8px 12px;

      }

      &:hover {
         font-weight: bold;
      }

      &:not(:last-of-type) {
         border-bottom: 1px solid @borderColorLight;
      }
   }
}
</style>
