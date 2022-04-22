import {JetView} from "webix-jet";
import * as cmp from "views/others/smui_cmp";
//import { getFiterDate} from "models/data/home/data";
export default class PeriodSelector extends JetView {


		constructor(app,name, id,split_nb,nb=0) {

			super(app,name)
			this._id = id
			this._slplit = split_nb
			this._nb = nb
		}

        config() {

			let children = [], obj = this,nb = this._nb

			for (let index = 0; index < this._slplit; index++) {
				children.push({
					name : "button",id : obj._id+"_"+periodSplit[index+nb],view : "ui "+((index == 0)?"active button" :"button") , html : periodSplit[index+nb]
				})
				
			}
           return {

		view : "smui-cmp",
		id : this._id,
		maxHeight : 31,
		content : {			
			view : "ui mini basic buttons "+this._id,
			style : {"margin-left" : "35%"},
			children : children

		}
	   }

	}

	init(view) {

		let obj = this
			
	view.attachEvent('onViewShow', function(){
    var
    $buttons = $('.ui.buttons.'+obj._id+' .button'),
    $toggle  = $('.main .ui.toggle.button'),
    $button  = $('.ui.button').not($buttons).not($toggle),
    handler = {

      activate: function() {
		//console.log("CLICK");
        $(this)
          .addClass('active')
          .siblings()
          .removeClass('active')
        ;
      }

    }
  ;

  $buttons
    .on('click', handler.activate)	
	})


	view.attachEvent('onAfterRender', function(){
	
		var
		$buttons = $('.ui.buttons.'+obj._id+' .button'),
		$toggle  = $('.main .ui.toggle.button'),
		$button  = $('.ui.button').not($buttons).not($toggle),
		handler = {
	
		  activate: function() {
			//console.log("CLICK");
			$(this)
			  .addClass('active')
			  .siblings()
			  .removeClass('active')
			;
		  }
	
		}
	  ;
	
	  $buttons
		.on('click', handler.activate)	
		})

        webix.event(window, "resize", function(){
            console.log("wind resize")    
			view.__render_once();
        })

	}


}
