/* eslint-disable no-empty */
import {JetView} from "webix-jet";
import SLStatView from "views/sales/salesStats";
import {getScreenType} from "models/utils/home/utils";
export default class StatsView extends JetView{
        
	config () 
	{
		
		this._colCount = 6;
		this._maxColCount = 6;
		var rowstat = {
			view:"dashboard",id : "sl:stats",
			gridColumns : this._colCount, gridRows : 1,maxHeight:100,responsive : "hide",
			cells : [
                                { view:"panel", x:0, y:0, dx:1, dy:1, body : new SLStatView(this.app, "", 'rsales') },
                                { view:"panel", x:1, y:0, dx:1, dy:1, body :  new SLStatView(this.app, "", 'qsales') },
                                { view:"panel", x:2, y:0, dx:1, dy:1, body : new SLStatView(this.app, "", 'rproduit') },
                                { view:"panel", x:3, y:0, dx:1, dy:1, body : new SLStatView(this.app, "", 'rsouscription') },
                                { view:"panel", x:4, y:0, dx:1, dy:1, body : new SLStatView(this.app, "", 'rrecharge') },
                                { view:"panel", x:5, y:0, dx:1, dy:1, body : new SLStatView(this.app, "", 'rservice') }
			]
		};
	 return rowstat
	
	}
	init(view) {
		var obj = this;
		webix.event(window, "resize", function(){
			if( typeof $$('top:menu') == 'undefined' ||  $$('top:menu').getSelectedId() == 'sales') {
			if(getScreenType() == 'mobile_rotated') {
				$$("sl:stats").hide()
				return

			}
			$$("sl:stats").show()
			var h = window.screen.width//view.getParentView().$width;
			//console.log("ratio",h/obj._colCount)
			if(h/obj._colCount > 160 ) { 
				
				if (obj._colCount < obj._maxColCount) obj._colCount = obj._colCount+1;
				else  return;
				if(h/obj._colCount < 160 ) return;
			}
			else 
				while(h/obj._colCount < 160 ) 
					obj._colCount = obj._colCount-1;
			$$('sl:stats').define("gridColumns", obj._colCount);
			$$('sl:stats').adjust();
			}
		})
	}

	ready(view) {
        		var obj = this;
                        if(getScreenType() == 'mobile_rotated') {
                                $$("sl:stats").hide()
                                return

                        }
                        $$("sl:stats").show()		
			var h = window.screen.width;
			
                        while(h/obj._colCount < 160 ){
				obj._colCount = obj._colCount-1;
			}
                        if(h/obj._colCount > 160 ) {

                                if (obj._colCount < obj._maxColCount) obj._colCount = obj._colCount+1;
				if (h/obj._colCount < 160 ) obj._colCount = obj._colCount-1;
                        }
		
                        view.define("gridColumns", obj._colCount);
                        view.adjust();
         }	
		
	
}
