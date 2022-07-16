<template>
   <div ref="trigger" @mouseenter="showPopup" @focus="showPopup" @mouseleave="hidePopup" @blur="hidePopup">
      <slot />
   </div>
   <teleport to="body">
      <div ref="popup" class="popup">
         {{ text }}
      </div>
   </teleport>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { computePosition, offset, shift } from '@floating-ui/dom';

const props = defineProps({
   text: {
      type: String,
   },
});

const trigger = ref();
const popup = ref();

const update = () => {
   computePosition(trigger.value, popup.value,
      { placement: 'bottom', middleware: [offset(10), shift()] }
   ).then(({ x, y }: { x: number; y: number }) => {
      Object.assign(popup.value.style, {
         left: `${x}px`,
         top: `${y}px`,
      });
   });
};

const showPopup = () => {
   if (!props.text) {
      return;
   }
   popup.value.style.display = 'block';
   update();
};

const hidePopup = () => {
   popup.value.style.display = '';
};
</script>

<style lang="less" scoped>
@import "../../assets/constants.less";

.popup {
   display: none;
   position: absolute;
   top: 0;
   left: 0;
   padding: 4px 8px;
   background: #fff;
   font-size: 14px;
   border: 1px solid @borderColorLight;
   border-radius: 4px;
}
</style>
