import {JetView} from "webix-jet";
import * as st from "views/home/statsingle";
import * as mst from "views/home/mobstatsingle";
import { getMonChartData} from "models/data/monitor/data";
import {updateChartReady, getScreenType} from 'models/utils/general/utils';
import {kpi_field, components} from "models/referential/genReferentials";

export default class MonStatView extends JetView{

        constructor(app,name, kpi) {

                super(app,name);
                this._kpi = kpi;

        }

        config ()
        {

                let kp = this._kpi;
                var rowstat = {
				 view : (getScreenType()=='mobile' || getScreenType()=='mobile_rotated' )?'mob-stats-card': 'stats-card',
				 id :"mon:stat:"+kp, _type : kp,
                                content : { header : kpi_field['mon_'+kp].label, meta : kpi_field['mon_'+kp].desc },
                                tooltip : {
					template: (kpi_field['mon_'+kp].title?kpi_field['mon_'+kp].title : "")+"<br\>Def.:"+(kpi_field['mon_'+kp].definition?kpi_field['mon_'+kp].definition : "")
				},
                         }


         return rowstat;

        }
        init(view) {
                let kp = this._kpi;
                $$("mon:stat:"+kp).showProgress();
                $$("mon:stat:"+kp).disable();
                if(kpi_field['mon_'+kp].title && view.config.tooltip) {
                        webix.TooltipControl.addTooltip(view.$view, view.config.tooltip.template)
                }
                components['monitor'].push({cmp : "mon:stat:"+kp, data : getMonChartData('mon_stats').config.id });
                getMonChartData('mon_stats').waitData.then((d) => {

                        $$("mon:stat:"+kp).parse(getMonChartData('mon_stats'));
                        $$("mon:stat:"+kp).enable();
                        $$("mon:stat:"+kp).hideProgress();

            });

            view.attachEvent("onDestruct", function(){
                webix.TooltipControl.removeTooltip(view.$view)
            })
                $$("mon:stat:"+kp).data.attachEvent("onStoreLoad", function () {
                                updateChartReady("mon:stat:"+kp);
                });
        }
}  
