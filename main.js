'use strict';

import {foodlist} from './data.js';



class App {

   constructor() {
      this.data = foodlist.food;
      this._initEvents();
   }

   _initEvents() {
      let
         that = this;

      this._renderFoodList();
      this._renderDays();
      this._sortable();
      $('#days').on('keyup', function() {
         that._renderDays();
         that._sortable();
      });
   }

   // Выводим список всех блюд
   _renderFoodList() {
      this.data.forEach(function(item, i, allFoodList) {
         $( '.' + item.type ).append( `<li data-id="` + i + `" class="collection-item grey-text text-darken-4">` + item.name + `</li>` );
      });
   }

   // Зарендерим дни
   _renderDays() {
      console.log('qwe');
      let
         numberOfDays = $('#days').val();

      for (var i = 1; i <= numberOfDays; i++) {
         $('.choicelist').append(`<div class="day`+ i + `">
                           <div class="dayMainTitle">День ` + i + `</div>
                           <div class="daySubTitle">Завтрак</div>
                           <ul class="meal1"></ul>
                           <div class="daySubTitle">Обед</div>
                           <ul class="meal2"></ul>
                           <div class="daySubTitle">Ужин</div>
                           <ul class="meal3"></ul>
                        </div><hr />`);
      }
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
            sort: false,
            onStart: function () {
               $('.choicelist').addClass('markTarget');
            },
            onEnd: function () {
               $('.choicelist').removeClass('markTarget');
            }
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
         },
         numberOfDays = $('#days').val();

      $('.foodlist1').sortable(optsFoodlist);
      $('.foodlist2').sortable(optsFoodlist);
      for (let day = 1; day <= numberOfDays; day++) {
         for (let meal = 1; meal <= 3; meal++) {
            $('.day' + day + ' .meal' + meal).sortable(optsChoiceList);
         }
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
