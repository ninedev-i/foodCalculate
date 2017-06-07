'use strict';

module.exports = {
   entry: './main',
   output: {
      path: __dirname + '/dist',
      filename: 'build.js'
   },

   watch: true,

   watchOptions: {
      aggregateTimeout: 100
   }
}
