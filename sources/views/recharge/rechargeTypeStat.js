import {JetView} from "webix-jet";
import * as st from "views/home/statsingle";
import * as mst from "views/home/mobstatsingle";
import { getRechargeChartData} from "models/data/recharge/data";
import {updateChartReady, getScreenType} from 'models/utils/general/utils';
import {kpi_field, components} from "models/referential/genReferentials";

export default class RecStatView extends JetView{

        constructor(app,name, kpi) {

                super(app,name);
                this._kpi = kpi;

        }

        config ()
        {

                let kp = this._kpi;
                //console.log(kp);
                var rowstat = {
                                 view : (getScreenType()=='mobile' || getScreenType()=='mobile_rotated')?'mob-stats-card': 'stats-card',id :"rec:stat:"+kp, _type : kp,
                                 tooltip : {
                                        template: "<span style='background-color:#1212120d;'>"+(kpi_field['rec_'+kp].title?kpi_field['rec_'+kp].title : "")+"<br\>Def. : "+
                                        (kpi_field['rec_'+kp].definition?kpi_field['rec_'+kp].definition+"<br\>Variation par rapport au mois dernier" : "")+"</span>"
                                },
                                content : { header : kpi_field['rec_'+kp].label, meta : kpi_field['rec_'+kp].desc ,
			shortheader : kpi_field['rec_'+kp].shortlab?kpi_field['rec_'+kp].shortlab : kpi_field['rec_'+kp].label.substr(0,4),
                                            seuil : kpi_field['rec_'+kp].wseuil? kpi_field['rec_'+kp].wseuil : 200,
                                            shortdesc : kpi_field['rec_'+kp].shortdesc? kpi_field['rec_'+kp].shortdesc : kpi_field['rec_'+kp].desc,
                                            wdseuil : kpi_field['rec_'+kp].wdseuil?kpi_field['rec_'+kp].wdseuil : 200, moblab : kpi_field['rec_'+kp].moblab
				}
                         }


         return rowstat;

        }
        init(view) {
                let kp = this._kpi;
                view.showProgress();
                view.disable();
                if(kpi_field['rec_'+kp].title && view.config.tooltip) {
                        webix.TooltipControl.addTooltip(view.$view, view.config.tooltip.template)
                }
                components['recharge'].push({cmp : "rec:stat:"+kp, data : getRechargeChartData('stat_type').config.id });
                getRechargeChartData('stat_type').waitData.then((d) => {

                        view.parse(getRechargeChartData('stat_type'));
                        view.enable();
                        view.hideProgress();

            });
            view.attachEvent("onDestruct", function(){
                webix.TooltipControl.removeTooltip(view.$view)
        })
                view.data.attachEvent("onStoreLoad", function () {
                                updateChartReady("rec:stat:"+kp);
                });
        }
}  
