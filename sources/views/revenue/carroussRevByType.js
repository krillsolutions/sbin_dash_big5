import {JetView} from "webix-jet";

import RevByTypeSplitNewView from "views/revenue/revenueByTypeSplitNew";
import RevByTypeTrendNewView from "views/revenue/revenueByTypeTrendNew";
import RevGrpOffView from "views/revenue/revenueByGroupByOff";

import PeriodSelector from "views/others/periodSelector";
export default class CarouselRevByTypeView extends JetView{

        config (){

                return {
                        view:"carousel",
                        id : "rev_type",
                        css:"webix_dark",

                        cols : [

                                {type : "clean", rows : [
                                        new RevByTypeSplitNewView(this.app,"","fai"), new PeriodSelector(this.app,"","revParType_fai",2),new RevByTypeTrendNewView(this.app, "","fai"),
                                        new RevGrpOffView(this.app,"","fai")
                                ]},

                                {type : "clean", rows : [
                                    new RevByTypeSplitNewView(this.app,"","gros"), new PeriodSelector(this.app,"","revParType_gros",2),new RevByTypeTrendNewView(this.app, "","gros"),
                                    new RevGrpOffView(this.app,"","gros")
                                ]}
                        ]

                }
        }

        init(){
        }

}
