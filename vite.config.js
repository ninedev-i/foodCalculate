import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
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
      svgLoader(),
   ]
};
