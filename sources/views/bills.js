/* eslint-disable no-empty */
import {JetView} from "webix-jet";
import StatsView from "views/bills/statsView";
//import BillsGraphDashView from "views/bills/graphDash";
import BillTabView from "views/bills/billsTab";
export default class SalesView extends JetView{
        
	config () 
	{
		var rows = [];		
                /*var rowstat = {
                        view:"dashboard",
                        gridColumns :6 , gridRows : 1,maxHeight:100,
                        cells : [
                                { view:"panel", x:0, y:0, dx:1, dy:1, body : new SLStatView(this.app, "", 'qtot') },
                                { view:"panel", x:1, y:0, dx:1, dy:1, body :  new SLStatView(this.app, "", 'atot') },
                                { view:"panel", x:2, y:0, dx:1, dy:1, body : new SLStatView(this.app, "", 'qdiv') },
                                { view:"panel", x:3, y:0, dx:1, dy:1, body : new SLStatView(this.app, "", 'adiv') },
                                { view:"panel", x:4, y:0, dx:1, dy:1, body : new SLStatView(this.app, "", 'qgsm') },
                                { view:"panel", x:5, y:0, dx:1, dy:1, body : new SLStatView(this.app, "", 'agsm') },
                        ]
                };*/
		rows.push({$subview : StatsView});
		rows.push({$subview : BillTabView});
	 return {
			type:"space",margin : 5, css:"app-right-panel",  padding:4,
			rows : rows
		};
	
	}
	/*init(view) {

	}	*/
}
