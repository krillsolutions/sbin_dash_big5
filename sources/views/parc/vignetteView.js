/* eslint-disable no-empty */
import {JetView} from "webix-jet";
import * as st from "views/home/statsingle";
import * as mst from "views/home/mobstatsingle";
import { getParcChartData} from "models/data/parc/data";
import {updateChartReady, getScreenType} from 'models/utils/general/utils';
import {kpi_field, components} from "models/referential/genReferentials";

export default class ParcStatView extends JetView{
        
	constructor(app,name, kpi) {
	
		super(app,name);
		this._kpi = kpi;
	
	}

	config () 
	{
		
		let kp = this._kpi;
		var rowstat = { 
				 view : (getScreenType()=='mobile' || getScreenType()=='mobile_rotated' )?'mob-stats-card': 'stats-card',id :"parc:stat:"+kp, _type : kp,
				 tooltip : {
					template: (kpi_field['parc_'+kp].title?kpi_field['parc_'+kp].title : "")+"<br\>Def. : "+(kpi_field['parc_'+kp].definition?kpi_field['parc_'+kp].definition+"<br\>Variation par rapport au mois dernier" : "")
				},
			   	content : { header : kpi_field['parc_'+kp].label, meta : kpi_field['parc_'+kp].desc,
				shortheader : kpi_field['parc_'+kp].shortlab?kpi_field['parc_'+kp].shortlab : kpi_field['parc_'+kp].label.substr(0,4),
                                            seuil : kpi_field['parc_'+kp].wseuil? kpi_field['parc_'+kp].wseuil : 200,
                                            shortdesc : kpi_field['parc_'+kp].shortdesc? kpi_field['parc_'+kp].shortdesc : kpi_field['parc_'+kp].desc,
                                            wdseuil : kpi_field['parc_'+kp].wdseuil?kpi_field['parc_'+kp].wdseuil : 200, 
					    moblab : kpi_field['parc_'+kp].moblab ? kpi_field['parc_'+kp].moblab : kpi_field['parc_'+kp].label.substr(0,3)
				}
			 }

		
	 return rowstat;
	
	}
	init(view) {
		let kp = this._kpi;		
                $$("parc:stat:"+kp).showProgress();
                $$("parc:stat:"+kp).disable();
				if(kpi_field['parc_'+kp].title && view.config.tooltip) {
					webix.TooltipControl.addTooltip(view.$view, view.config.tooltip.template)
				}
				components['parc'].push({cmp : "parc:stat:"+kp, data : getParcChartData('stat').config.id });
                getParcChartData('stat').waitData.then((d) => {
			
			$$("parc:stat:"+kp).parse(getParcChartData('stat'));
                        $$("parc:stat:"+kp).enable();
                        $$("parc:stat:"+kp).hideProgress();

            });
		$$("parc:stat:"+kp).data.attachEvent("onStoreLoad", function () {
                                updateChartReady("parc:stat:"+kp);
		});

		view.attachEvent("onDestruct", function(){
			webix.TooltipControl.removeTooltip(view.$view)
		})
	}	
}
