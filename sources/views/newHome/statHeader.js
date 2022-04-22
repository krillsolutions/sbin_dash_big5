import {JetView} from "webix-jet";
import {getKpiColor,getLabel} from "models/utils/home/utils";
export default class StatHeadView extends JetView{

        
	constructor(app, name, kpi) {
	
		super(app,name);
		this._kpi = kpi;
	}
	config ()
        {

		var kpi = this._kpi;
		var temp = getLabel(kpi);
                return  { 
				view:"toolbar", type:"clean",cols : [
					{template : temp, type : "header",css : getKpiColor(kpi), height : 30 }
			]
		}
}
}
