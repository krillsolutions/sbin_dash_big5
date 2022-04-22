import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components} from "models/referential/genReferentials";
import { getRechargeChartData} from "models/data/recharge/data";
import { kFormatter,updateChartReady, formatter } from "models/utils/home/utils";
import { getTreeHierachy } from "models/utils/general/utils";

export default class RecByProdByType extends JetView{

	config() {

		return {
            view : "treetable", id : "rec:hierachy:split",math : true,
            css:"webix_header_border webix_footer_border",
            borderless : true,
            select : true,
            columns : [
                {id : "recharge" , header :{text : "Recharge", css : {"text-align" : "center", "font-size" : "12px"}}, 
               fillspace : 3, template:"{common.treetable()}#recharge#" },
                {id : "qty", header : {text : "Quantité", css : {"text-align" : "center", "font-size" : "12px"} },  css:{ "text-align":"right" }, fillspace : 1,                        
                format: function(val) { 
                    if (val == "") return 0;
                    return webix.Number.format(val,{
                            groupDelimiter:" ",
                            groupSize:3,
                            decimalDelimiter:".",
                            decimalSize:0
                    });
                }},
                {id : "amount", header :{text : "Montant", css : {"text-align" : "center", "font-size" : "12px"} },  css:{ "text-align":"right" }, fillspace : 1,
                format: function(val) { 
                    if (val == "") return 0;
                    return webix.Number.format(val,{
                            groupDelimiter:" ",
                            groupSize:3,
                            decimalDelimiter:".",
                            decimalSize:0
                    });
                } },
            ]
        }
	}

        init(view) {
            webix.extend(view,webix.ProgressBar)
                view.showProgress();
                view.disable();
                view._eType = 'treemap'
                view._expDataId = getRechargeChartData('rec_hiera_split_exp').config.id 
                components['recharge'].push( {cmp : "rec:hierachy:split", data :getRechargeChartData('rec_hiera_split').config.id });
                components['recharge'].push( {cmp : "rec:hierachy:exp:split", data :getRechargeChartData('rec_hiera_split_exp').config.id });

                getRechargeChartData('rec_hiera_split').waitData.then((d) => {
			view._isDataLoaded = 1;
                    let data = [...getRechargeChartData('rec_hiera_split').data.getRange()]
                    let dd = getTreeHierachy(data,['group',"off","chan","type"],"recharge",['qty','amount']).map(d => ({...d,open : true}))
                        view.parse([...dd]);
                        view.enable();
                        view.hideProgress();
                getRechargeChartData('rec_hiera_split').attachEvent("onAfterLoad", function () {
                    if($$('top:menu').getSelectedId() == 'recharge') {
                    let dat = [...getRechargeChartData('rec_hiera_split').data.getRange()]
                    let ddd = getTreeHierachy(dat,['group',"off","chan","type"],"recharge",['qty','amount']).map(d => ({...d,open : true}))
                            view.clearAll()
                           view.parse([...ddd]);
                            view.enable();
                            view.hideProgress();
                    }
                        });
                    

                });

                view.data.attachEvent("onStoreLoad", function () {
                                updateChartReady("rec:hierachy:split");
                });

        }

}
