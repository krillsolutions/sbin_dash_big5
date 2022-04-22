/* eslint-disable no-empty */
import {JetView} from "webix-jet";
import StatsView from "views/monitor/statsView";
import MonGraphDashView from "views/monitor/monDash";
//import MonTabView from "views/monitor/montabView"
export default class MonView extends JetView{
        
	config () 
	{
		var rows = [];		
		rows.push({$subview : StatsView});
		//rows.push({$subview : MonGraphDashView});
		rows.push({$subview : MonGraphDashView});
		//rows.push({template : 'TODO'});
	 return {
			type:"space",margin : 5, css:"app-right-panel",  padding:4,
			rows : rows
		};
	
	}
	/*init(view) {

	}	*/
}
