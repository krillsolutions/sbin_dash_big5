import {JetView} from "webix-jet";

import ParcByTypeView from "views/parc/parcByType";
import ParcByTypeTrendView from "views/parc/parcTypeTrend_new";
import PeriodSelector from "views/others/periodSelector";

export default class CarouselParcByTypeView extends JetView{

        config (){

                return {
                        view:"carousel",
                        id : "parc_type",
                        css:"webix_dark",

                        cols : [

                                {type : "clean", rows : [
                                        new ParcByTypeView(this.app,"","fai"), new PeriodSelector(this.app,"","parcByType_fai",2),new ParcByTypeTrendView(this.app, "","fai")
                                ]},

                                {type : "clean", rows : [
                                    new ParcByTypeView(this.app,"","gros"), new PeriodSelector(this.app,"","parcByType_gros",2),new ParcByTypeTrendView(this.app, "","gros")
                                ]}
                        ]

                }
        }

        init(){
        }

}
