/* eslint-disable no-empty */
import {JetView} from "webix-jet";
import RecTotStatView from "views/recharge/rechargeMontantStat";
import RecStatView from "views/recharge/rechargeTypeStat";
import {getScreenType} from "models/utils/general/utils";
export default class StatsView extends JetView{
        
	config () 
	{
		
		this._colCount = 5;
		this._maxColCount = 5;
		var rowstat = {
			view:(getScreenType() != "mobile" && getScreenType() != "mobile_rotated")?  "c-dashboard" : "m-dashboard",
			id : "topup:stats",
			gridColumns : this._colCount, gridRows : 1,maxHeight:100,responsive : "hide",
			cells : [
                                { view:"panel", x:0, y:0, dx:1, dy:1, body : RecTotStatView },
                                { view:"panel", x:1, y:0, dx:1, dy:1, body : new RecStatView(this.app, "", 'cash') },
                                { view:"panel", x:2, y:0, dx:1, dy:1, body :  new RecStatView(this.app, "", 'voucher') },
                                { view:"panel", x:3, y:0, dx:1, dy:1, body : new RecStatView(this.app, "", 'prepaid') },
								{ view:"panel", x:4, y:0, dx:1, dy:1, body : new RecStatView(this.app, "", 'postpaid') }

			]
		};
	 return rowstat
	
	}
	init(view) {
		var obj = this;
		webix.event(window, "resize", function(){
			if( typeof $$('top:menu') == 'undefined' ||  $$('top:menu').getSelectedId() == 'recharge') {
                        if(getScreenType() == 'mobile_rotated') {
                                $$('topup:stats').hide()
                                return
                        }
                        $$('topup:stats').show()			
			var h = window.screen.width//view.getParentView().$width;
			if(h/obj._colCount > 160 ) { 
				
				if (obj._colCount < obj._maxColCount) obj._colCount = obj._colCount+1;
				else  return;
				if(h/obj._colCount < 160 ) return;
			}
			else 
				while(h/obj._colCount < 160 ) 
					obj._colCount = obj._colCount-1;
			$$('topup:stats').define("gridColumns", obj._colCount);
			$$('topup:stats').adjust();
			}
		})
	}

	ready(view) {
        		var obj = this;
                        if(getScreenType() == 'mobile_rotated') {
                                $$('topup:stats').hide()
                                return
                        }
                        $$('topup:stats').show()		
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
