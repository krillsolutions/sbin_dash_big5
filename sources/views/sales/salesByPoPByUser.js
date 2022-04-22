import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components} from "models/referential/genReferentials";
import { getSalesChartData} from "models/data/sales/data";
import { kFormatter,updateChartReady, formatter } from "models/utils/home/utils";
import { getTreeHierachy } from "../../models/utils/general/utils";

export default class SalesPoPUserView extends JetView{

	config() {


		return {
            view : "treetable", id : "sales:vue1:popuser",math : true,
            css:"webix_header_border webix_footer_border",
            borderless : true,
            select : true,
            columns : [
                {id : "pop" , header : [{text  : "Produits par agent par pop ", colspan : 3 , css:{ "text-align":"center"}},{text : "POP", css : {"text-align" : "center", "font-size" : "12px"}}], 
               fillspace : 3, template:"{common.treetable()}#pop#" },
                {id : "qty", header : ['',{text : "Quantité", css : {"text-align" : "center", "font-size" : "12px"} }],  css:{ "text-align":"right" }, fillspace : 1,                        
                format: function(val) { 
                    if (val == "") return 0;
                    return webix.Number.format(val,{
                            groupDelimiter:" ",
                            groupSize:3,
                            decimalDelimiter:".",
                            decimalSize:0
                    });
                }},
                {id : "montant", header : ['',{text : "Montant", css : {"text-align" : "center", "font-size" : "12px"} }],  css:{ "text-align":"right" }, fillspace : 1,
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
                components['sales'].push( {cmp : "sales:vue1:popuser", data :getSalesChartData('sales_pop_split').config.id });

                getSalesChartData('sales_pop_split').waitData.then((d) => {
			view._isDataLoaded = 1;
                    let data = [...getSalesChartData('sales_pop_split').data.getRange()]
                    let dd = getTreeHierachy(data,['pop',"user","cat","tp","prod"],"pop",['qty','montant'])
                        view.parse([...dd]);
                        view.enable();
                        view.hideProgress();
                getSalesChartData('sales_pop_split').attachEvent("onAfterLoad", function () {
                    if($$('top:menu').getSelectedId() == 'sales') {
                    let dat = [...getSalesChartData('sales_pop_split').data.getRange()]
                    let ddd = getTreeHierachy(dat,['pop',"user","cat","tp","prod"],"pop",['qty','montant'])
                            view.clearAll()
                           view.parse([...ddd]);
                            view.enable();
                            view.hideProgress();
                    }
                        });
                    

                });

                view.data.attachEvent("onStoreLoad", function () {
                                updateChartReady("sales:vue1:popuser");
                });

        }

}
