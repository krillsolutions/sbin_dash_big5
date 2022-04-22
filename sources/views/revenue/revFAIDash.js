import {JetView} from "webix-jet";
import PeriodSelector from "views/others/periodSelector";
import RevByZoneView from "views/revenue/revenueByZones";
import RevByBillView from "views/revenue/revenueByBill";
import RevBySalesTrendView from "views/revenue/revenueSalesTrend";
import RevSalesSplit from "views/revenue/revenueSaleSplit";

import RevByLineView from "views/revenue/revenueByLine";
import RevByLineTrendView from "views/revenue/revenueByLineTrend";

import GraphHeadView from "views/home/graphHeaders";
import RevByTypeSplitNewView from "views/revenue/revenueByTypeSplitNew";
import RevByTypeTrendNewView from "views/revenue/revenueByTypeTrendNew";
import RevGrpOffView from "views/revenue/revenueByGroupByOff";
import {getScreenType} from "models/utils/home/utils";
export default class RevFAIGraphDashView extends JetView{

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
                        cells.push({ view:"panel", x:0, y:0, dx:2, dy:6, resize:true,header : new GraphHeadView(this.app, "", "rev_global", "homelines"),
				 body :{ type : 'clean', margin : 0, 
                 rows : [
                     new RevByTypeSplitNewView(this.app,"","fai"), new PeriodSelector(this.app,"","revParType_fai",2),new RevByTypeTrendNewView(this.app, "","fai"),
                 new RevGrpOffView(this.app,"","fai")]},css : { "background-color":"#fff"} });

                                 cells.push({ view:"panel", x:2, y:0, dx:2, dy:6, resize:true,header : new GraphHeadView(this.app, "", "rev_by_line", "homelines"),
                                 body : { type : 'clean', margin : 0, 
                                 rows : [
                                     new RevByLineView(this.app,"","FAI"), 
                                     new PeriodSelector(this.app,"","revByLine_FAI",2),
                                     new RevByLineTrendView(this.app, "","FAI")]} ,  css : { "background-color":"#fff"}});				

			            cells.push({ view:"panel", x:4, y:0, dx:2, dy:6, resize:true,header : new GraphHeadView(this.app, "", "rev_sales", "homelines"),
                        body : { type : 'clean', margin : 0, 
                        rows : [RevSalesSplit,new PeriodSelector(this.app,"","revBySalesType",2), RevBySalesTrendView]} ,  css : { "background-color":"#fff"}});


                        cells.push({ view:"panel", x:6, y:0, dx:2, dy:6, resize:true, header : new GraphHeadView(this.app, "", "rev_other", ""), body :
                                { type : 'clean', margin : 0, rows : [RevByBillView, RevByZoneView] },css : { "background-color":"#fff"}});


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
