import {JetView} from "webix-jet";
import * as st from "views/home/statsingle";
import * as mst from "views/home/mobstatsingle";
import { getBillsChartData} from "models/data/bills/data";
import {updateChartReady, getScreenType} from 'models/utils/general/utils';
import {kpi_field, components} from "models/referential/genReferentials";

export default class BLStatView extends JetView{

        constructor(app,name, kpi) {

                super(app,name);
                this._kpi = kpi;

        }

        config ()
        {

                let kp = this._kpi;
                var rowstat = {
                                view : (getScreenType()=='mobile' || getScreenType()=='mobile_rotated' )?'mob-stats-card': 'stats-card',
				id :"bl:stat:"+kp, _type : kp,
                                tooltip : {
					template: (kpi_field['bill_'+kp].title?kpi_field['bill_'+kp].title : "")+"<br\>Def. : "+
                                        (kpi_field['bill_'+kp].definition?kpi_field['bill_'+kp].definition+"<br\>Variation par rapport au mois dernier" : "")
				},
                                content : { header : kpi_field['bill_'+kp].label, meta : kpi_field['bill_'+kp].desc ,

				shortheader : kpi_field['bill_'+kp].shortlab?kpi_field['bill_'+kp].shortlab : kpi_field['bill_'+kp].label.substr(0,4),
                                            seuil : kpi_field['bill_'+kp].wseuil? kpi_field['bill_'+kp].wseuil : 150,
                                            shortdesc : kpi_field['bill_'+kp].shortdesc? kpi_field['bill_'+kp].shortdesc : kpi_field['bill_'+kp].desc,
                                            wdseuil : kpi_field['bill_'+kp].wdseuil?kpi_field['bill_'+kp].wdseuil : 150, 
					     moblab : kpi_field['bill_'+kp].moblab?kpi_field['bill_'+kp].moblab : kpi_field['bill_'+kp].label.substr(0,2) 
				}
                         }


         return rowstat;

        }
        init(view) {
                let kp = this._kpi;
                $$("bl:stat:"+kp).showProgress();
                $$("bl:stat:"+kp).disable();
                //console.log(view.config.tooltip.template)
                if(kpi_field['bill_'+kp].title && view.config.tooltip) {
                        //console.log(view.config.tooltip.template);
                        webix.TooltipControl.addTooltip(view.$view, view.config.tooltip.template)
                }
                components['bills'].push({cmp : "bl:stat:"+kp, data : getBillsChartData('bills_stats').config.id });
                getBillsChartData('bills_stats').waitData.then((d) => {

                        $$("bl:stat:"+kp).parse(getBillsChartData('bills_stats'));
                        $$("bl:stat:"+kp).enable();
                        $$("bl:stat:"+kp).hideProgress();

            });
            view.attachEvent("onDestruct", function(){
                webix.TooltipControl.removeTooltip(view.$view)
            })
                $$("bl:stat:"+kp).data.attachEvent("onStoreLoad", function () {
                                updateChartReady("bl:stat:"+kp);
                });
        }
}  
