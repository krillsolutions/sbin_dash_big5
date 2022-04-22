/* eslint-disable no-empty */
import {JetView} from "webix-jet";
import MonStatView from "views/monitor/monStat";
import {getScreenType} from "models/utils/home/utils";
export default class StatsView extends JetView{
        
	config () 
	{
		
		this._colCount = 7;
		this._maxColCount = 7;
		var rowstat = {
			view:(getScreenType() != "mobile" && getScreenType() != "mobile_rotated")?  "c-dashboard" : "m-dashboard",
			id : "mon:stats",
			gridColumns : this._colCount, gridRows : 1,maxHeight:100,responsive : "hide",
			cells : [
                                { view:"panel", x:0, y:0, dx:1, dy:1, body : new MonStatView(this.app, "", 'tot') },
                                { view:"panel", x:1, y:0, dx:1, dy:1, body : new MonStatView(this.app, "", 'ocs') },
                                { view:"panel", x:2, y:0, dx:1, dy:1, body :  new MonStatView(this.app, "", 'ims') },
								{ view:"panel", x:3, y:0, dx:1, dy:1, body :  new MonStatView(this.app, "", 'ocb') },
                                { view:"panel", x:4, y:0, dx:1, dy:1, body : new MonStatView(this.app, "", 'pgw') },
                                { view:"panel", x:5, y:0, dx:1, dy:1, body : new MonStatView(this.app, "", 'msc') },
								{ view:"panel", x:6, y:0, dx:1, dy:1, body : new MonStatView(this.app, "", 'sico') }
			]
		};
	 return rowstat
	
	}
	init(view) {
		var obj = this;
		webix.event(window, "resize", function(){
			if( typeof $$('top:menu') == 'undefined' ||  $$('top:menu').getSelectedId() == 'monitor') {
			if(getScreenType() == 'mobile_rotated') {
				$$("mon:stats").hide()
				return

			}
			$$("mon:stats").show()
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
			$$('mon:stats').define("gridColumns", obj._colCount);
			$$('mon:stats').adjust();
			}
		})
	}

	ready(view) {
        		var obj = this;
                        if(getScreenType() == 'mobile_rotated') {
                                $$("mon:stats").hide()
                                return

                        }
                        $$("mon:stats").show()		
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
