/* eslint-disable no-mixed-spaces-and-tabs */
import {JetView} from "webix-jet";
import BillsGraphDashView from "views/bills/graphDash";
//import TraficByTypeGraphDashViewVoix from "views/traffic/trafficByTypeVoice";
//import TraficByTypeGraphDashViewSMS from "views/traffic/trafficByTypeSMS";
import BillsDetGraphDashView from "views/bills/billsDetDash";

export default class BillTabView extends JetView{

	config ()
	{
		return {
			view:"tabview", id : "bill:tab", animate:false,
			cells : [
				{id : 'tab:resume', header : 'Global',body : BillsGraphDashView},
				{id : 'tab:details',header : 'Detail' , body: BillsDetGraphDashView },
		
			]
		};
	}

	init() {

	}
}
