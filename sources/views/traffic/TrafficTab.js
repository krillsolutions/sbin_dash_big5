/* eslint-disable no-mixed-spaces-and-tabs */
import {JetView} from "webix-jet";
import {getTitle} from "models/utils/home/utils"; 
import TraficByTypeGraphDashView from "views/traffic/TrafficDash";
//import TraficByTypeGraphDashViewVoix from "views/traffic/trafficByTypeVoice";
//import TraficByTypeGraphDashViewSMS from "views/traffic/trafficByTypeSMS";
import TraficDataGraphDashView from "views/traffic/DataTrafficDash";

export default class TraffTabView extends JetView{

	config ()
	{
		return {
			view:"tabview", id : "traffic:tab", animate:false,
			cells : [
				{id : 'tab:voix', header : getTitle("traffic_voix_tab"),body : new TraficByTypeGraphDashView(this.app, "", "voice", "trafficvoix" )},
				{id : 'tab:sms',header : getTitle("traffic_sms_tab") , body : new TraficByTypeGraphDashView(this.app, "", "sms", "trafficsms") },
				{id : 'tab:data',header : getTitle("traffic_data_tab") , body :TraficDataGraphDashView}
		
			]
		};
	}

	init() {

	}
}
