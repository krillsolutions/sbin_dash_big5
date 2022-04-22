import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components} from "models/referential/genReferentials";
import { getParcChartData} from "models/data/parc/data";
import { kFormatter,updateChartReady, formatter } from "models/utils/home/utils";
import { getTreeHierachy } from "models/utils/general/utils";

export default class BillMarketParc extends JetView{

	config() {


		return {
            view : "treetable", id : "parc:vue1:split",math : true,
            css:"webix_header_border webix_footer_border",
            borderless : true,
            select : true,
            columns : [
                {id : "parc" , header : [{text  : "Répartition du parc", colspan : 3 , css:{ "text-align":"center"}},{text : "Parc", css : {"text-align" : "center", "font-size" : "12px"}}], 
               fillspace : 3, template:"{common.treetable()}#parc#" },
                {id : "qty", header : ['',{text : "Nombre", css : {"text-align" : "center", "font-size" : "12px"} }],  css:{ "text-align":"right" }, fillspace : 1,                        
                format: function(val) { 
                    if (val == "") return 0;
                    return webix.Number.format(val,{
                            groupDelimiter:" ",
                            groupSize:3,
                            decimalDelimiter:".",
                            decimalSize:0
                    });
                }},
                {id : "qty_percent", header : ['',{text : "Part (%)", css : {"text-align" : "center", "font-size" : "12px"} }],  css:{ "text-align":"right" }, fillspace : 1,
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
                view._expDataId = getParcChartData('parc_bill_split_exp').config.id 
                components['parc'].push( {cmp : "parc:vue1:split", data :getParcChartData('parc_bill_split').config.id });
                components['parc'].push( {cmp : "parc:exp:split", data :getParcChartData('parc_bill_split_exp').config.id });

                getParcChartData('parc_bill_split').waitData.then((d) => {
			view._isDataLoaded = 1;
                   // let data = [...Object.values(getParcChartData('parc_bill_split').data.pull)]
                   /* let dd = getTreeHierachy(data,['bill',"mark","cat","seg","prod"],"parc",['qty']).map(d => ({...d,open : true}))*/
                        //console.log(dd);
                        view.parse(getParcChartData('parc_bill_split'));
                        view.enable();
                        view.hideProgress();  
                        
                   /* getParcChartData('parc_bill_split').attachEvent("onAfterLoad", function () {
                        if($$('top:menu').getSelectedId() == 'parc') {
                        let dat = Object.values(getParcChartData('parc_bill_split').data.pull)
                       // let ddd = getTreeHierachy(dat,['bill',"mark","cat","seg","prod"],"parc",['qty']).map(d => ({...d,open : true}))
                        console.log(dat);
                                view.clearAll()
                                view.parse([...dat]);
                                view.enable();
                                view.hideProgress();
                        }
                    });   */                       
                });

              

                view.data.attachEvent("onStoreLoad", function () {
                                updateChartReady("parc:vue1:split");
                });

        }

}
