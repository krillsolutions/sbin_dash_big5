/* eslint-disable no-empty */
import {JetView} from "webix-jet";
import * as st from "views/home/statsingle";
import * as mst from "views/home/mobstatsingle";
import { getHomeStatData} from "models/data/home/data";
import {updateChartReady, getScreenType} from 'models/utils/general/utils';
import {kpi_field, components} from "models/referential/genReferentials";

export default class HomeStatView extends JetView{

        constructor(app,name, kpi) {

                super(app,name);
                this._kpi = kpi;

        }

        config ()
        {

                let kp = this._kpi;
                var rowstat = {
                        view : (getScreenType()=='mobile' || getScreenType()=='mobile_rotated')?'mob-stats-card': 'stats-card',
                        id :"home:stat:"+kp,_type : kp,
                        content : { header : kpi_field[kp].label, meta : kpi_field[kp].desc ,
                                            shortheader : kpi_field[kp].shortlab?kpi_field[kp].shortlab : kpi_field[kp].label.substr(0,4),
                                            seuil : kpi_field[kp].wseuil? kpi_field[kp].wseuil : 200,
                                            shortdesc : kpi_field[kp].shortdesc? kpi_field[kp].shortdesc : kpi_field[kp].desc,
                                            wdseuil : kpi_field[kp].wdseuil?kpi_field[kp].wdseuil : 200,
                                            moblab : kpi_field[kp].moblab?kpi_field[kp].moblab : kpi_field[kp].label.substr(0,2)
                                }
                         }


         return rowstat;

        }
        init(view) {
            let kp = this._kpi;
            $$("home:stat:"+kp).showProgress();
            $$("home:stat:"+kp).disable();
            components['home'].push({cmp : "home:stat:"+kp, data : getHomeStatData(kp).config.id});
            getHomeStatData(kp).waitData.then((d) => {
                    $$("home:stat:"+kp).parse(getHomeStatData(kp));
                    $$("home:stat:"+kp).enable();
                    $$("home:stat:"+kp).hideProgress();

            });

            $$("home:stat:"+kp).data.attachEvent("onStoreLoad", function () {
                            updateChartReady("home:stat:"+kp);
            });
    } 
}
  