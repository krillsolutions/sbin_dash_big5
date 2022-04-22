import {JetView} from "webix-jet";
import * as st from "views/home/statsingle";
import * as mst from "views/home/mobstatsingle";
import { getRevChartData} from "models/data/revenue/data";
import {updateChartReady, getScreenType} from 'models/utils/general/utils';
import {kpi_field, components} from "models/referential/genReferentials";

export default class RevStatView extends JetView{

        constructor(app,name, kpi) {

                super(app,name);
                this._kpi = kpi;

        }

        config ()
        {

                let kp = this._kpi;
                var rowstat = {
                                 view : (getScreenType()=='mobile' || getScreenType()=='mobile_rotated' )?'mob-stats-card': 'stats-card',id :"rev:stat:"+kp, _type : kp,
                                 tooltip : {
					template: (kpi_field['rev_'+kp].title?kpi_field['rev_'+kp].title : "")+"<br\>Def. : "+
                                        (kpi_field['rev_'+kp].definition?kpi_field['rev_'+kp].definition+"<br\>Variation par rapport au mois dernier" : "")
				},
                                 content : { header : kpi_field['rev_'+kp].label, meta : kpi_field['rev_'+kp].desc,
				shortheader : kpi_field['rev_'+kp].shortlab?kpi_field['rev_'+kp].shortlab : kpi_field['rev_'+kp].label.substr(0,4),
                                            seuil : kpi_field['rev_'+kp].wseuil? kpi_field['rev_'+kp].wseuil : 150,
                                            shortdesc : kpi_field['rev_'+kp].shortdesc? kpi_field['rev_'+kp].shortdesc : kpi_field['rev_'+kp].desc,
                                            wdseuil : kpi_field['rev_'+kp].wdseuil?kpi_field['rev_'+kp].wdseuil : 150,
					    mobseuil : kpi_field['rev_'+kp].mobseuil?kpi_field['rev_'+kp].mobseuil : 140,
					    moblab : kpi_field['rev_'+kp].moblab?kpi_field['rev_'+kp].moblab : kpi_field['rev_'+kp].label.substr(0,2),
				//	    mobdesc : kpi_field['rev_'+kp].mobdesc? kpi_field['rev_'+kp].mobdesc : kpi_field['rev_'+kp].desc,
				
				}
                         }


         return rowstat;

        }
        init(view) {
                let kp = this._kpi;
                $$("rev:stat:"+kp).showProgress();
                $$("rev:stat:"+kp).disable();
                if(kpi_field['rev_'+kp].title && view.config.tooltip) {
                        webix.TooltipControl.addTooltip(view.$view, view.config.tooltip.template)
                }
                components['revenue'].push({cmp : "rev:stat:"+kp, data : getRevChartData('stat').config.id });
                getRevChartData('stat').waitData.then((d) => {

                        $$("rev:stat:"+kp).parse(getRevChartData('stat'));
                        $$("rev:stat:"+kp).enable();
                        $$("rev:stat:"+kp).hideProgress();

            });

            view.attachEvent("onDestruct", function(){
                webix.TooltipControl.removeTooltip(view.$view)
            })
                $$("rev:stat:"+kp).data.attachEvent("onStoreLoad", function () {
                                updateChartReady("rev:stat:"+kp);
                });
        }
}  
