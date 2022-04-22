import {JetView} from "webix-jet";
import PeriodSelector from "views/others/periodSelector";

import RevByLineView from "views/revenue/revenueByLine";
import RevByLineTrendView from "views/revenue/revenueByLineTrend";

import GraphHeadView from "views/home/graphHeaders";
import RevByTypeSplitNewView from "views/revenue/revenueByTypeSplitNew";
import RevByTypeTrendNewView from "views/revenue/revenueByTypeTrendNew";
import RevGrpOffView from "views/revenue/revenueByGroupByOff";
import {getScreenType} from "models/utils/home/utils";
export default class RevGROSGraphDashView extends JetView{

	config ()
        
	{

		var gridColumns,
			gridRows,
			 cells = [];
                var config = {
                        view:"c-dashboard",
                        margin : 5,
                        padding : 5,
                        css : {"background-color" : "#EBEDF0"}
                };
		
		switch(getScreenType()) {


			default :
                        gridColumns = 8;
                        gridRows = 6;
                        cells.push({ view:"panel", x:0, y:0, dx:4, dy:6, resize:true,header : new GraphHeadView(this.app, "", "rev_global_gros", "homelines"),
				 body :{ type : 'clean', margin : 0, 
                 rows : [
                     new RevByTypeSplitNewView(this.app,"","gros"), new PeriodSelector(this.app,"","revParType_gros",2),new RevByTypeTrendNewView(this.app, "","gros"),
                 new RevGrpOffView(this.app,"","gros")]},css : { "background-color":"#fff"} });

                                 cells.push({ view:"panel", x:4, y:0, dx:4, dy:6, resize:true,header : new GraphHeadView(this.app, "", "rev_by_offer_gros", "homelines"),
                                 body : { type : 'clean', margin : 0, 
                                 rows : [
                                     new RevByLineView(this.app,"","GROS"), 
                                     new PeriodSelector(this.app,"","revByLine_GROS",2),
                                     new RevByLineTrendView(this.app, "","GROS")]} ,  css : { "background-color":"#fff"}});

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
