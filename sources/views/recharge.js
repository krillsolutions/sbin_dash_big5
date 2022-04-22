/* eslint-disable no-empty */
import {JetView} from "webix-jet";
import StatsView from "views/recharge/statsView";
import RecGraphDashView from "views/recharge/recDashGraph";
export default class RecView extends JetView{
        
	config () 
	{
		var rows = [];		
		rows.push({$subview : StatsView});
		rows.push({$subview : RecGraphDashView});
	 return {
			type:"space",margin : 5, css:"app-right-panel",  padding:4,
			rows : rows
		};
	
	}
	/*init(view) {

	}	*/
}
