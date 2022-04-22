import {JetView} from "webix-jet";
import * as st from "views/home/statsingle";
import * as mst from "views/home/mobstatsingle";
import { getSalesChartData} from "models/data/sales/data";
import {updateChartReady, getScreenType} from 'models/utils/general/utils';
import {kpi_field, components} from "models/referential/genReferentials";

export default class SLStatView extends JetView{

        constructor(app,name, kpi) {

                super(app,name);
                this._kpi = kpi;

        }

        config ()
        {

                let kp = this._kpi;
                var rowstat = {
                                view : (getScreenType()=='mobile' || getScreenType()=='mobile_rotated' )?'mob-stats-card': 'stats-card',
				id :"sl:stat:"+kp, _type : kp,
                                content : { header : kpi_field['sl_'+kp].label, meta : kpi_field['sl_'+kp].desc ,
				shortheader : kpi_field['sl_'+kp].shortlab?kpi_field['sl_'+kp].shortlab : kpi_field['sl_'+kp].label.substr(0,4),
                                            seuil : kpi_field['sl_'+kp].wseuil? kpi_field['sl_'+kp].wseuil : 150,
                                            shortdesc : kpi_field['sl_'+kp].shortdesc? kpi_field['sl_'+kp].shortdesc : kpi_field['sl_'+kp].desc,
                                            wdseuil : kpi_field['sl_'+kp].wdseuil?kpi_field['sl_'+kp].wdseuil : 150, 
					     moblab : kpi_field['sl_'+kp].moblab?kpi_field['sl_'+kp].moblab : kpi_field['sl_'+kp].label.substr(0,2) 
				}
                         }


         return rowstat;

        }
        init(view) {
                let kp = this._kpi;
                $$("sl:stat:"+kp).showProgress();
                $$("sl:stat:"+kp).disable();
                components['sales'].push({cmp : "sl:stat:"+kp, data : getSalesChartData('sales_stats').config.id });
                getSalesChartData('sales_stats').waitData.then((d) => {

                        $$("sl:stat:"+kp).parse(getSalesChartData('sales_stats'));
                        $$("sl:stat:"+kp).enable();
                        $$("sl:stat:"+kp).hideProgress();

            });
                $$("sl:stat:"+kp).data.attachEvent("onStoreLoad", function () {
                                updateChartReady("sl:stat:"+kp);
                });
        }
}  
