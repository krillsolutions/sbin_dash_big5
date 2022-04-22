import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components} from "models/referential/genReferentials";
import { getParcChartData} from "models/data/parc/data";
import { kFormatter,updateChartReady, formatter } from "models/utils/home/utils";
import { getTreeHierachy } from "../../models/utils/general/utils";

export default class ParcGrosOff extends JetView{

	config() {


		return {
            view : "treetable", id : "parc:gros:off",math : true,
            css:"webix_header_border webix_footer_border",
            borderless : true,
            select : true,
            columns : [
                {id : "client" , header : [{text  : "Offre par catégorie par client ", colspan : 2, css:{ "text-align":"center"}},{text : "Client/Offre", css : {"text-align" : "center", "font-size" : "12px"}}], 
               fillspace : 3, template:"{common.treetable()}#client#" },
                {id : "qty", header : ['',{text : "Nombre", css : {"text-align" : "center", "font-size" : "12px"} }],  css:{ "text-align":"right" }, fillspace : 1,                        
                format: function(val) { 
                    if (val == "") return 0;
                    return webix.Number.format(val,{
                            groupDelimiter:" ",
                            groupSize:3,
                            decimalDelimiter:".",
                            decimalSize:0
                    });
                }}
            ]
        }
	}

        init(view) {
            webix.extend(view,webix.ProgressBar)
                view.showProgress();
                view.disable();
                components['parc'].push( {cmp : "parc:gros:off", data :getParcChartData('parc_gros_off').config.id });

                getParcChartData('parc_gros_off').waitData.then((d) => {
			view._isDataLoaded = 1;
                    let data = [...getParcChartData('parc_gros_off').data.getRange()]
                    let dd = getTreeHierachy(data,['client',"grp","art"],"client",['qty'])
                        view.parse([...dd]);
                        view.enable();
                        view.hideProgress();
                getParcChartData('parc_gros_off').attachEvent("onAfterLoad", function () {
                    if($$('top:menu').getSelectedId() == 'parc') {
                    let dat = [...getParcChartData('parc_gros_off').data.getRange()]
                    let ddd = getTreeHierachy(dat,['client',"grp","art"],"client",['qty'])
                            view.clearAll()
                           view.parse([...ddd]);
                            view.enable();
                            view.hideProgress();
                    }
                        });
                    

                });

                view.data.attachEvent("onStoreLoad", function () {
                                updateChartReady("parc:gros:off");
                });

        }

}
