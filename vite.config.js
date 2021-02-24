import vue from '@vitejs/plugin-vue';
const path = require('path');

export default {
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    plugins: [vue()]
}
