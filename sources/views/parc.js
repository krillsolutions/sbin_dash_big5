/* eslint-disable no-empty */
import {JetView} from "webix-jet";
//import ParcTabView from "views/parc/parcTab";
import ParcGraphDashView from "views/parc/graphDash"
import StatsView from "views/parc/statsView";
import {getScreenType, getScreenTypeByMenu, setScreenTypeByMenu} from "models/utils/home/utils";
import {gconfig} from "models/utils/general/boot";
export default class ParcView extends JetView{
        
	config () 
	{
		
		var rows = [];
		rows.push({$subview : StatsView});
		//rows.push({$subview : ParcTabView});
		rows.push({$subview : ParcGraphDashView});
	 return {
			type:"space",margin : 5, css:"app-right-panel",  padding:4,
			rows : rows
		};
	
	}	

	init(view) {
		var obj = this;
	   setScreenTypeByMenu('parc', getScreenType());
	   gconfig['dashboards']['parc'] = obj;
	   webix.event(window, "resize", function(){

			   if($$('top:menu').getSelectedId() == 'parc') {
			   if(getScreenTypeByMenu('parc') != getScreenType()) {
							   setScreenTypeByMenu('parc', getScreenType());
							   if(gconfig['dashboards']['parc']._container != null)  gconfig['dashboards']['parc'].refresh();
			   }
			   if(getScreenType() == 'mobile_rotated') {
					   $$('parc:stats').hide()
					   return
			   }
			   $$('parc:stats').show()
			   var h = window.screen.width//view.getParentView().$width;
			   if(h/obj._colCount > 160 ) {

					   if (obj._colCount < obj._maxColCount) obj._colCount = obj._colCount+1;
					   else  return;
					   if(h/obj._colCount < 160 ) return;
			   }
			   else
					   while(h/obj._colCount < 160 )
							   obj._colCount = obj._colCount-1;
			   $$('parc:stats').define("gridColumns", obj._colCount);
			   $$('parc:stats').adjust();
			   }
	   })
	}

}
