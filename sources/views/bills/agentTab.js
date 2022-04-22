import {JetView} from "webix-jet";
import { getBillsChartData} from "models/data/bills/data";
import {formatter, getLabel, updateChartReady} from "models/utils/home/utils";
import { components} from "models/referential/genReferentials";
export default class AgentTabView extends JetView {


    config() {

        let ui = {
            view : "datatable",
            id : "agent:tab:vue1",
            css : "webix_header_border",
            //scroll : true,
            scrollX:true,
	        resizeColumn:true,
            columns : [
                {id : "agent", header : { text : "Agent", css:{ "text-align":"left" }}  , sort : "string", fillspace : 2, adjust : true,css:{ "text-align":"left" } },
                {id : "qty",fillspace : 1, header : { text : "Nombre", css:{ "text-align":"center" }},adjust : true, css:{ "text-align":"center" }, sort : "int"},
                {id : "amount", fillspace : 2, header : { text : "Montant", css:{ "text-align":"center" }},adjust : true, css:{ "text-align":"right" }, sort : "int",format : function(value) { return  (value< 0)? "-" :formatter(value);}},

            ],
            select : true,
            
        }
        return ui;
    }

    init(view) {

        webix.extend(view, webix.ProgressBar);
		view.showProgress();
        view.disable();

       components['bills'].push({cmp : "agent:tab:vue1", data : getBillsChartData("agent_tab").config.id}); 
       getBillsChartData("agent_tab").waitData.then((d) => {
        view._isDataLoaded = 1;
        view.parse(getBillsChartData("agent_tab"));
        view.enable();
        view.hideProgress();

        });

        view.data.attachEvent("onStoreLoad", function () {
            updateChartReady("agent:tab:vue1");
          })

    }
} 
