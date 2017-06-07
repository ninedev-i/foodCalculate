'use strict';

import {foodlist} from './data.js';



class App {

   constructor() {
      this.data = foodlist.food;
      // this.elements = document.querySelector('.foodlist');
      this._renderFoodList();
      this._sortable();
   }

   // Выводим список всех блюд
   _renderFoodList() {
      // this.data.forEach(function(item, i, allFoodList) {
      //    $( ".foodlist" ).append( `<li data-id="` + i + `" class="collection-item grey-text text-darken-4">` + item.name + `</li>` );
      // });
      this.data.forEach(function(item, i, allFoodList) {
         $( '.' + item.type ).append( `<li data-id="` + i + `" class="collection-item grey-text text-darken-4">` + item.name + `</li>` );
      });
   }

   // Добавим drag&drop для списков
   _sortable() {
      // TODO: сохранение в local storage https://github.com/RubaXa/Sortable#store
      let
         that = this,
         foodlist1 = document.querySelector('.foodlist1'),
         foodlist2 = document.querySelector('.foodlist2'),
         choicelist = document.querySelector('.choicelist'),
         opts = {
            animation: 200,
            group: {
               name: 'shared',
               pull: 'clone',
               put: false,
               revertClone: true
            },
            sort: false
         };

      Sortable.create(foodlist1, opts);
      Sortable.create(foodlist2, opts);

      Sortable.create(choicelist, {
         group: {
            name: 'shared',
            pull: true,
            put: true,
            revertClone: false
         },
         onAdd: function (event) {
            that._onDragStop(event);
         }
      });
   }

   // По нажатию на блюдо
   _onDragStop(event, ui) {
      let
         targetId = event.item.dataset.id,
         targetMenu = this.data[targetId].ingridients,
         ingridients = $('.hiddenlist').text(),
         output = {};

      if (ingridients != '') {
         output = JSON.parse( ingridients );
      }

      // if (event.target.parentElement.className === 'choicelist collection col s4 ui-sortable') {
         // $( ".choicelist" ).append( `<di>` + event.target.innerText + `</li>` );
         $( ".hiddenlist" ).text( JSON.stringify( this.combine(targetMenu, output) ) );

         $( ".productlist" ).empty();
         $.each( this.combine(targetMenu, output), function( key, value ) {
           $( ".productlist" ).append( key + ": " + value + '<br />' );
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
