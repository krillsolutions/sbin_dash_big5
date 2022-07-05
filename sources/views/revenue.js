/* eslint-disable no-empty */
import {JetView} from "webix-jet";
import StatsView from "views/revenue/statsView";
//import RevTabView from "views/revenue/revTab";
import RevGraphDashView from "views/revenue/graphDash"
import {getScreenType, getScreenTypeByMenu, setScreenTypeByMenu} from "models/utils/home/utils";
import {gconfig} from "models/utils/general/boot";
export default class RevenueView extends JetView{
        
	config () 
	{
		
		var rows = [];
		rows.push({$subview : StatsView });
		rows.push({$subview : RevGraphDashView});

	 return {
			type:"space",margin : 5, css:"app-right-panel",  padding:4,
			rows : rows
		};
	
	}

	init(view) {
		var obj = this;
	   setScreenTypeByMenu('revenue', getScreenType());
	   gconfig['dashboards']['revenue'] = obj;
	   webix.event(window, "resize", function(){

			   if($$('top:menu').getSelectedId() == 'revenue') {
			   if(getScreenTypeByMenu('revenue') != getScreenType()) {
							   setScreenTypeByMenu('revenue', getScreenType());
							   if(gconfig['dashboards']['revenue']._container != null)  gconfig['dashboards']['revenue'].refresh();
			   }
			   if(getScreenType() == 'mobile_rotated') {
					   $$('rev:stats').hide()
					   return
			   }
			   $$('rev:stats').show()
			   var h = window.screen.width//view.getParentView().$width;
			   if(h/obj._colCount > 160 ) {

					   if (obj._colCount < obj._maxColCount) obj._colCount = obj._colCount+1;
					   else  return;
					   if(h/obj._colCount < 160 ) return;
			   }
			   else
					   while(h/obj._colCount < 160 )
							   obj._colCount = obj._colCount-1;
			   $$('rev:stats').define("gridColumns", obj._colCount);
			   $$('rev:stats').adjust();
			   }
	   })
	}	
		
}
