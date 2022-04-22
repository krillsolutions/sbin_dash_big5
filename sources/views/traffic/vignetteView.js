import {JetView} from "webix-jet";
import * as st from "views/home/statsingle";
import * as mst from "views/home/mobstatsingle";
import { getTraffChartData} from "models/data/traffic/data";
import {updateChartReady, getScreenType} from 'models/utils/general/utils';
import {kpi_field, components} from "models/referential/genReferentials";

export default class TraffStatView extends JetView{

        constructor(app,name, kpi) {

                super(app,name);
                this._kpi = kpi;

        }

        config ()
        {

                let kp = this._kpi;
                //console.log(kp);
                var rowstat = {
                                 view : (getScreenType()=='mobile' || getScreenType()=='mobile_rotated')?'mob-stats-card': 'stats-card',id :"traff:stat:"+kp, _type : kp,
                                 tooltip : {
					template: (kpi_field['traffic_'+kp].title?kpi_field['traffic_'+kp].title : "")+"<br\>Def. : "+
                                        (kpi_field['traffic_'+kp].definition?kpi_field['traffic_'+kp].definition+"<br\>Variation par rapport au mois dernier" : "")
				},
                                content : { header : kpi_field['traffic_'+kp].label, meta : kpi_field['traffic_'+kp].desc, moblab : kpi_field['traffic_'+kp].moblab }
                         }


         return rowstat;

        }
        init(view) {
                let kp = this._kpi;
                $$("traff:stat:"+kp).showProgress();
                $$("traff:stat:"+kp).disable();
                if(kpi_field['traffic_'+kp].title && view.config.tooltip) {
                        webix.TooltipControl.addTooltip(view.$view, view.config.tooltip.template)
                }
                components['traffic'].push({cmp : "traff:stat:"+kp, data : getTraffChartData('stat').config.id });
                getTraffChartData('stat').waitData.then((d) => {

                        $$("traff:stat:"+kp).parse(getTraffChartData('stat'));
                        $$("traff:stat:"+kp).enable();
                        $$("traff:stat:"+kp).hideProgress();

            });
            view.attachEvent("onDestruct", function(){
                webix.TooltipControl.removeTooltip(view.$view)
            })
                $$("traff:stat:"+kp).data.attachEvent("onStoreLoad", function () {
                                updateChartReady("traff:stat:"+kp);
                });
        }
}  
