import {JetView} from "webix-jet";
import * as st from "views/home/statsingle";
import * as mst from "views/home/mobstatsingle";
import { getRechargeChartData} from "models/data/recharge/data";
import {updateChartReady, getScreenType} from 'models/utils/general/utils';
import {kpi_field, components} from "models/referential/genReferentials";

export default class RecTotStatView extends JetView{


        config ()
        {

		let kp = 'tot';
                var rowstat = {
                                 view : (getScreenType()=='mobile' || getScreenType()=='mobile_rotated')?'mob-stats-card': 'stats-card',id :"rec:stat:tot", _type : 'mnt_rec',
                                 tooltip : {
                                        template: "<span style='background-color:#1212120d;'>"+(kpi_field[kp].title?kpi_field[kp].title : "")+"<br\>Def. : "+
                                        (kpi_field[kp].definition?kpi_field[kp].definition+"<br\>Variation par rapport au mois dernier" : "")+"</span>"
                                },
                                content : { header : kpi_field['rec_tot'].label, meta : kpi_field['rec_tot'].desc,
				shortheader : kpi_field['rec_'+kp].shortlab?kpi_field['rec_'+kp].shortlab : kpi_field['rec_'+kp].label.substr(0,4),
                                            seuil : kpi_field['rec_'+kp].wseuil? kpi_field['rec_'+kp].wseuil : 200,
                                            shortdesc : kpi_field['rec_'+kp].shortdesc? kpi_field['rec_'+kp].shortdesc : kpi_field['rec_'+kp].desc,
                                            wdseuil : kpi_field['rec_'+kp].wdseuil?kpi_field['rec_'+kp].wdseuil : 200, moblab : kpi_field['rec_'+kp].moblab
				}
                         }


         return rowstat;

        }
        init(view) {
                let kp = "rec_tot"
                $$("rec:stat:tot").showProgress();
                $$("rec:stat:tot").disable();
                if(kpi_field[kp].title && view.config.tooltip) {
                        webix.TooltipControl.addTooltip(view.$view, view.config.tooltip.template)
                }
                components['recharge'].push({cmp : "rec:stat:tot", data : getRechargeChartData('stat_tot').config.id });
                getRechargeChartData('stat_tot').waitData.then((d) => {

                        $$("rec:stat:tot").parse(getRechargeChartData('stat_tot'));
                        $$("rec:stat:tot").enable();
                        $$("rec:stat:tot").hideProgress();

            });
            view.attachEvent("onDestruct", function(){
                webix.TooltipControl.removeTooltip(view.$view)
        })
                $$("rec:stat:tot").data.attachEvent("onStoreLoad", function () {
                                updateChartReady("rec:stat:tot");
                });
        }
}  
