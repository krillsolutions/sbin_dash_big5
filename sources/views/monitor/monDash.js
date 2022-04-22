import {JetView} from "webix-jet";
import GraphHeadView from "views/home/graphHeaders";
import MonCountTab from "views/monitor/monTab";
import MonByTypeTrendView from "views/monitor/monLine";
import {getScreenType} from "models/utils/home/utils";
export default class MonGraphDashView extends JetView{


	config ()
        
	{

        const kpi = 'rec';
		var gridColumns,
			gridRows,
			 cells = [];
		
		
                switch(getScreenType()) {

                        case 'mobile' :
			case 'mobile_rotated':
						gridColumns = 2;
						gridRows = 2;
						cells.push({ view:"panel", x:0, y:0, dx:2, dy:2, resize:true, header : new GraphHeadView(this.app, "", "monitor_line"),
						body : MonByTypeTrendView });
                        break;
                        default :
                        gridColumns = 3;
                        gridRows = 2;
                        cells.push({ view:"panel", x:0, y:0, dx:2, dy:2, resize:true,header : new GraphHeadView(this.app, "", "monitor_tab"),
                                body : MonCountTab });
                        cells.push({ view:"panel", x:2, y:0, dx:1, dy:2, resize:true, header : new GraphHeadView(this.app, "", "monitor_line"),
                                body : MonByTypeTrendView });
                        break;

                }		            
		var config = {
			view:(getScreenType() != "mobile" && getScreenType() != "mobile_rotated")?  "c-dashboard" : "m-dashboard",
			gridColumns:gridColumns, gridRows:gridRows,
			margin : 5,
			padding : 5,
			cells : cells,
			css : {"background-color" : "#EBEDF0"}
		};
		return {
			view : "scrollview",
			scroll : "y",
			body : config,

		};
	}

	init() {
		
	}
}
