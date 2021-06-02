<template>
   <icon-button
      size="22px"
      :filled="false"
      @click="printAction"
      title="Распечатать"
   >
      <print-icon />
   </icon-button>
</template>

<script>
import IconButton from '@/components/common/IconButton.vue';
import PrintIcon from '@/assets/print.svg?component';

export default {
   name: 'PrintButton',
   components: {
      IconButton,
      PrintIcon,
   },
   setup() {
      const printAction = () => window.print();

      return {
         printAction
      };
   },
};
</script>
