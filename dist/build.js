/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return foodlist; });


let foodlist = {
      'food': [
         {
            'name': 'Рисовая каша',
            'type': 'porrige',
            'ingridients': {
               'рис': 100,
               'соль': 200,
               'вода': 300
            }
         },
         {
            'name': 'Гречневая каша',
            'type': 'porrige',
            'ingridients': {
               'греча': 10,
               'соль': 20,
               'изюм': 30
            }
         },
         {
            'name': 'Пшенная каша',
            'type': 'porrige',
            'ingridients': {
               'пшено': 10,
               'соль': 20,
               'молоко': 40
            }
         },
         {
            'name': 'Рыбный суп',
            'type': 'soup',
            'ingridients': {
               'рыба': 60,
               'соль': 30,
               'картошка': 140,
               'морковь': 40
            }
         }
      ]
};




/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__data_js__ = __webpack_require__(0);






class App {

   constructor() {
      this.data = __WEBPACK_IMPORTED_MODULE_0__data_js__["a" /* foodlist */].food;
      this.days = document.querySelector('#days'),
      this._renderFoodList();
      this._sortable();
      this._initEvents();
   }

   // Выводим список всех блюд
   _renderFoodList() {
      this.data.forEach(function(item, i, allFoodList) {
         $( '.' + item.type ).append( `<li data-id="` + i + `" class="collection-item grey-text text-darken-4">` + item.name + `</li>` );
      });
   }

   _initEvents() {
      $('#days').on('keyup', this._changeNumberOfDays.bind(this));
   }

   _changeNumberOfDays(data) {
      $('.choicelist').append('<div>День номер </div>')
   }

   // Добавим drag&drop для списков
   _sortable() {
      // TODO: сохранение в local storage https://github.com/RubaXa/Sortable#store
      let
         that = this,
         optsFoodlist = {
            animation: 200,
            group: {
               name: 'shared',
               pull: 'clone',
               put: false,
               revertClone: true
            },
            sort: false
         },
         optsChoiceList = {
            group: {
               name: 'shared',
               pull: true,
               put: true,
               revertClone: false
            },
            onAdd: function (event) {
               that._onDragStop(event);
            }
         };
      $('.foodlist1').sortable(optsFoodlist);
      $('.foodlist2').sortable(optsFoodlist);
      for (let i = 1; i <= 3; i++) {
         $('.choicelist .meal' + i).sortable(optsChoiceList);
      }
   }

   // По нажатию на блюдо
   _onDragStop(event, ui) {
      let
         targetId = event.item.dataset.id,
         targetMenu = this.data[targetId].ingridients,
         ingridients = $('.hiddenlist').text(),
         numberOfPeople = $('#people').val(),
         output = {};

      if (ingridients != '') {
         output = JSON.parse( ingridients );
      }

         $('.hiddenlist').text( JSON.stringify( this.combine(targetMenu, output) ) );

         $('.productlist').empty();
         $.each( this.combine(targetMenu, output), function( key, value ) {
           $('.productlist').append( key + ': ' + value * numberOfPeople + '<br />' );
         });
      // }
   }

   // Складываем ингридиенты двух блюд
   combine(object1, object2) {
      let
         menu = {},
         key;

      for(key in object1){
         if(object2[key] == undefined){
            menu[key] = object1[key];
         } else {
            menu[key] = parseFloat(object1[key]) + parseFloat(object2[key]);
         };
      };
      for(key in object2){
         if(object1[key] == undefined){
            menu[key] = object2[key];
         } else {
            menu[key] = parseFloat(object1[key]) + parseFloat(object2[key]);
         };
      };

      return menu;
   }

}

let app = new App;


/***/ })
/******/ ]);