import {JetView} from "webix-jet";

import {getScreenType} from "models/utils/home/utils";
import GraphHeadView from "views/home/graphHeaders";
import ParcByTypeView from "views/parc/parcByType";
import ParcByTypeTrendView from "views/parc/parcTypeTrend_new"
import ParcView from "views/parc/parcView";
import PeriodSelector from "views/others/periodSelector";
export default class ParcGrosGraphDashView extends JetView{

	config ()
        
	{

		var gridColumns,
			gridRows,
			 cells = [];
                var config = {
                        view:"c-dashboard",
			id : 'parc:gros:dash',
                        margin : 5,
                        padding : 5,
                        css : {"background-color" : "#EBEDF0"}
                };
		
			switch(getScreenType()) {

				default :
   	                         gridColumns = 8;
                        	 gridRows = 6;
				 cells.push({ view:"panel", x:0, y:0, dx:4, dy:6, resize:true,header : new GraphHeadView(this.app, "", "parc_gros_gen", "homelines"),
                                         body : new ParcView(this.app,"","GROS"),
                                        css : { "background-color":"#fff"}});				
				
				cells.push({ view:"panel", x:4, y:0, dx:4, dy:6, resize:true,header : new GraphHeadView(this.app, "", "gros_offer_type", "homelines"),
						body : { type : 'clean', margin : 0, 
						rows : [new ParcByTypeView(this.app,"","gros"), new PeriodSelector(this.app,"","parcByType_gros",2),new ParcByTypeTrendView(this.app, "","gros")]
					
					} ,css : { "background-color":"#fff"}});						
					if(getScreenType() == 'standard') config['minHeight'] = 555;
				break;
			}
			config['cells'] = cells;
			config['gridColumns'] = gridColumns;
			config['gridRows'] = gridRows;
		return {
			view : "scrollview",
			scroll : "y",
			body : config,

		};
	}

	init() {
		
	}
}
