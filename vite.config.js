import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';

export default defineConfig({
   base: './',
   build: {
      sourcemap: true,
   },
   server: {
      port: 3000
   },
   resolve: {
      alias: {
         '@': '/src',
      },
   },
   plugins: [
      vue(),
      svgLoader(),
   ]
});
