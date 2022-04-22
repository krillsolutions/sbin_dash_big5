import {JetView} from "webix-jet";
import GraphHeadView from "views/home/graphHeaders";
import SalesByUserTrendView from "views/sales/salesByUserTrend";
import saleTotTrendView from "views/sales/salesTotTrend";
import SalesTypeProdView from "views/sales/salesByTypeByProd";
import SalesByTypeTrendView from "views/sales/salesByTypeTrend";
import SalesCatView from "views/sales/salesByCategory";
import SalesByPOPTrendView from "views/sales/salesByPoPTrend";
import SalesPoPUserView from "views/sales/salesByPoPByUser";
import {getScreenType, getScreenTypeByMenu, setScreenTypeByMenu} from "models/utils/home/utils";
import PeriodSelector from "views/others/periodSelector";
import {gconfig} from "models/utils/general/boot";
export default class SalesGraphDashView extends JetView{


	config ()
        
	{

		var gridColumns,
			gridRows,
			 cells = [];
		
                        switch(getScreenType()) {


				default :
			gridColumns = 6;
			gridRows = 3;			
			cells.push({ view:"panel", x:0, y:0, dx:2, dy:3, resize:true,header : new GraphHeadView(this.app, "", "command_glob"),
				body : { type : 'clean' , margin : 0, rows :[ SalesCatView,new PeriodSelector(this.app,"","salesParType",2),SalesByTypeTrendView ],  css : { "background-color":"#fff"}}});

			cells.push({ view:"panel", x:2, y:0, dx:2, dy:3, resize:true, header : new GraphHeadView(this.app, "", "command_split"), 
				body : { type : 'clean' , margin : 0, rows : [SalesTypeProdView, SalesPoPUserView ] }, css : { "background-color":"#fff"}});
                        cells.push({ view:"panel", x:4, y:0, dx:2, dy:3, resize:true, header : new GraphHeadView(this.app, "", 'sales_split'),
                                body :  { type : 'clean' , margin : 0, rows : [new PeriodSelector(this.app,"", "saleTot",3), saleTotTrendView, new PeriodSelector(this.app,"","salesParUser",2),SalesByUserTrendView,new PeriodSelector(this.app,"","salesParpop",2), SalesByPOPTrendView] }, css : { "background-color":"#fff"}});
		
            			break;
			}
		var config = {
			view:"c-dashboard",
			gridColumns:gridColumns, gridRows:gridRows,
			margin : 5,
			padding : 5,
			cells : cells,
			css : {"background-color" : "#EBEDF0"}
		};
		if(getScreenType() == 'mobile') config['minHeight'] = 1350;
		if(getScreenType() == 'mobile_rotated') config['minHeight'] = 850;
		return {
			view : "scrollview",
			scroll : "y",
			body : config,

		};
	}

	init() {
                 var obj = this;
                setScreenTypeByMenu('sales', getScreenType());
                gconfig['dashboards']['sales'] = obj;
                webix.event(window, "resize", function(){

                        if($$('top:menu').getSelectedId() == 'sales') {
                                if(getScreenTypeByMenu('sales') != getScreenType()) {
                                        setScreenTypeByMenu('sales', getScreenType());
                                        if(gconfig['dashboards']['sales']._container != null) gconfig['dashboards']['sales'].refresh();
                                }
                        }
                })		
	}
}
