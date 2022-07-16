import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import path from 'path';

export default {
   base: './',
   build: {
      sourcemap: true,
   },
   server: {
      port: 3000
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
