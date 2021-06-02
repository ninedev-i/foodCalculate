import vue from '@vitejs/plugin-vue';
import vueSvgPlugin from 'vite-plugin-vue-svg';
import path from 'path';

export default {
   build: {
      sourcemap: true,
   },
   resolve: {
      alias: {
         '@': path.resolve(__dirname, './src'),
      },
   },
   plugins: [
      vue(),
      vueSvgPlugin(),
   ]
};
