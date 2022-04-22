import {JetView} from "webix-jet";

import ParcByZoneView from "views/parc/parcByZone";
import ParcBillMarkView from "views/parc/parcBTMkt";
import {getScreenType, getScreenTypeByMenu, setScreenTypeByMenu} from "models/utils/home/utils";
import GraphHeadView from "views/home/graphHeaders";
import ParcByTypeView from "views/parc/parcByType";
import ParcByTypeTrendView from "views/parc/parcTypeTrend_new"
import ParcLGView from "views/parc/parcLGView";
import ParcLGTrendView from "views/parc/parcLGTrend";
import ParcView from "views/parc/parcView";
import PeriodSelector from "views/others/periodSelector";
export default class ParcFAIGraphDashView extends JetView{

	config ()
        
	{

		var gridColumns,
			gridRows,
			 cells = [];
                var config = {
                        view:"c-dashboard",
			id : 'parc:fai:dash',
                        margin : 5,
                        padding : 5,
                        css : {"background-color" : "#EBEDF0"}
                };
		
			switch(getScreenType()) {

				default :
   	                         gridColumns = 8;
                        	 gridRows = 6;
				 cells.push({ view:"panel", x:0, y:0, dx:2, dy:6, resize:true,header : new GraphHeadView(this.app, "", "parc", "parc_off_FAI_exp"),
                                         body : new ParcView(this.app,"","FAI"),
                                        css : { "background-color":"#fff"}});				
				
				cells.push({ view:"panel", x:2, y:0, dx:2, dy:6, resize:true,header : new GraphHeadView(this.app, "", "offer_type", "homelines"),
						body : { type : 'clean', margin : 0, 
						rows : [new ParcByTypeView(this.app,"","fai"), new PeriodSelector(this.app,"","parcByType_fai",2),new ParcByTypeTrendView(this.app, "","fai")]
					
					} ,css : { "background-color":"#fff"}});
				cells.push({ view:"panel", x:4, y:0, dx:2, dy:6, resize:true, header : new GraphHeadView(this.app, "", "parc_status_ligne", "homelines"), 
						body :{ type : 'clean', margin : 0, rows :[ ParcLGView,new PeriodSelector(this.app,"","parcLG",2), ParcLGTrendView]}, css : { "background-color":"#fff"}});

						cells.push({ view:"panel", x:6, y:0, dx:2, dy:6, resize:true, header : new GraphHeadView(this.app, "", "parc_other", "homelines"), 
						body :{ type : 'clean', margin : 0, rows :[ ParcBillMarkView,ParcByZoneView]}, css : { "background-color":"#fff"}});						

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
