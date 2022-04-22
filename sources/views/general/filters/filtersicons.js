import {JetView} from "webix-jet";
import {filter_ref} from "models/referential/genReferentials";
import {getFilter} from "models/utils/general/boot";
//import FilterIconPopupView from "views/general/filters/filtersiconsPopups";
export class FilterIconView extends JetView {

	
	constructor(app,name, type) {
	
		super(app,name);
		this._tp = type;
	}

	config() {
		let tp = this._tp;
		//console.log(tp);
		var obj = this;
	//	return filter_ref.then((filter_ref) => {		
	        var config ={view:"icon",type : "image" ,id:'filterelmt:'+tp,width:25,height:25,popup :'filterelmt:popup:'+tp};
                //config['icon'] = filter_ref['filters'][tp]['icon'];
		//config['tooltip'] = filter_ref['filters'][tp]['desc']+' : '+getFilter()[tp];
//                config[config['type']] = filter_ref['filters'][tp]['illustration'];
   //             if (typeof filter_ref['filters'][tp]['css'] != 'undefined' ) config['css'] = filter_ref['filters'][tp]['css'];
     //           if (typeof filter_ref['filters'][tp]['width'] != 'undefined' ) config['width'] = filter_ref['filters'][tp]['width'];
//                config['label'] = (typeof filtred_data[tp] != 'undefined' && filtred_data[tp] != "") ? filtred_data[tp] : filter_ref[tp].label;
                return config;
	//	})
	
	
	}

	init(view) {
	var obj = this;
	let tp = this._tp;
          	if(!$$('filterelmt:popup:'+tp))
		obj.ui({
                        view:"popup", id : 'filterelmt:popup:'+tp
                })
		
	filter_ref.then((filter_ref) => {
		if($$('filterelmt:popup:'+tp)) 
			$$('filterelmt:popup:'+tp).destructor()
	         obj.ui({
			 view:"popup", id : 'filterelmt:popup:'+tp, body : {template : filter_ref['filters'][tp]['desc']+' : '+getFilter()[tp], autoheight:true, autowidth:true}, maxWidth : 150,
			 css : "filter_tooltip"
	         })
		
		view.define('icon', filter_ref['filters'][tp]['icon']);
		
		$$('filterelmt:'+tp).define('tooltip', filter_ref['filters'][tp]['desc']+' : '+getFilter()[tp]);
		$$('filterelmt:'+tp).refresh();
	});
	}
}
