import {JetView} from "webix-jet";
import { getBillsChartData} from "models/data/bills/data";
import {formatter, getLabel, updateChartReady} from "models/utils/home/utils";
import { components} from "models/referential/genReferentials";
export default class AgentTabView extends JetView {


    config() {

        let ui = {
            view : "treetable", id : "agent:tab:vue1",math : true,
            css:"webix_header_border",
            borderless : true,
            select : true,
            columns : [
                {id : "agence" , header : { text : "Agence", css:{ "text-align":"left" }},sort : "string", fillspace : 2, adjust : true,css:{ "text-align":"left" },
               fillspace : 3, template:"{common.treetable()}#agence#" },
               {id : "qty",fillspace : 1, header : { text : "Nombre", css:{ "text-align":"center" }},adjust : true, css:{ "text-align":"center" }, sort : "int"},
               {id : "amount", fillspace : 2, header : { text : "Montant", css:{ "text-align":"center" }},adjust : true, css:{ "text-align":"right" }, sort : "int",format : function(value) { return  (value< 0)? "-" :formatter(value);}},

            ]
            
        }
        return ui;
    }

    init(view) {

        webix.extend(view, webix.ProgressBar);
		view.showProgress();
        view.disable();
        view._eType = 'treemap'
        view._expDataId = getBillsChartData('agent_tab_exp').config.id 
       components['bills'].push({cmp : "agent:tab:vue1", data : getBillsChartData("agent_tab").config.id}); 
       components['bills'].push({cmp : "agent:tab:vue1:exp", data : getBillsChartData("agent_tab_exp").config.id});
       getBillsChartData("agent_tab").waitData.then((d) => {
        view._isDataLoaded = 1;
        view.parse(getBillsChartData("agent_tab"));
        view.sort("#qty","desc","int")
        view.enable();
        view.hideProgress();

        });

        view.data.attachEvent("onStoreLoad", function () {
            updateChartReady("agent:tab:vue1");
            view.sort("#qty","desc","int")
          })

    }
} 
