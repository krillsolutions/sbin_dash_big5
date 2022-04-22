import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components, dash_titles} from "models/referential/genReferentials";
import { getRevChartData} from "models/data/revenue/data";
import { kFormatter,updateChartReady, formatter } from "models/utils/home/utils";
import { getTreeHierachy } from "models/utils/general/utils";

export default class RevTypeProdView extends JetView{

	config() {


		return {
            view : "treetable", id : "rev:type:vue1:split",math : true,
            css:"webix_header_border webix_footer_border",
            borderless : true,
            select : true,
            columns : [
                {id : "type" , header : [{text  :  dash_titles['revenue'].by_type_by_produit? dash_titles['revenue'].by_type_by_produit : "", colspan : 3 , css:{ "text-align":"center"}},{text : "Type", css : {"text-align" : "center", "font-size" : "12px"}}], 
               fillspace : 3, template:"{common.treetable()}#type#" },
                {id : "kpi", header : ['',{text : "Revenu", css : {"text-align" : "center", "font-size" : "12px"} }],  css:{ "text-align":"right" }, fillspace : 1,                        
                format: function(val) { 
                    if (val == "") return 0;
                    return webix.Number.format(val,{
                            groupDelimiter:" ",
                            groupSize:3,
                            decimalDelimiter:".",
                            decimalSize:0
                    });
                }},
                {id : "kpi_percent", header : ['',{text : "Part (%)", css : {"text-align" : "center", "font-size" : "12px"} }],  css:{ "text-align":"right" }, fillspace : 1,
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
                view._expDataId = getRevChartData('rev_type_split_exp').config.id 
                components['revenue'].push( {cmp : "rev:type:vue1:split", data :getRevChartData('rev_type_split').config.id });
                components['revenue'].push( {cmp : "rev:exp:split", data :getRevChartData('rev_type_split_exp').config.id });

                getRevChartData('rev_type_split').waitData.then((d) => {
			view._isDataLoaded = 1;
                    //let data = [...getRevChartData('rev_type_split').data.getRange()]
                  //  let dd = getTreeHierachy(data,['type',"grp"],"type",['kpi'])//.map(d => ({...d,open : true}))
                        //console.log(data);
                        view.parse(getRevChartData('rev_type_split'));
                        view.enable();
                        view.hideProgress();
                /*getRevChartData('rev_type_split').attachEvent("onAfterLoad", function () {
                    if($$('top:menu').getSelectedId() == 'revenue') {
                    let dat = [...getRevChartData('rev_type_split').data.getRange()]
                    let ddd = getTreeHierachy(dat,['type',"grp"],"type",['kpi'])
                            view.clearAll()
                           view.parse([...ddd]);
                            view.enable();
                            view.hideProgress();
                    }
                        });*/
                    

                });

                view.data.attachEvent("onStoreLoad", function () {
                                updateChartReady("rev:type:vue1:split");
                });

        }

}
