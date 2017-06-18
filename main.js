'use strict';

import {foodlist} from './data.js';



class App {

   constructor() {
      this.data = foodlist.food;
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
