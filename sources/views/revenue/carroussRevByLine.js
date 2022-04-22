import {JetView} from "webix-jet";

import RevByLineView from "views/revenue/revenueByLine";
import RevByLineTrendView from "views/revenue/revenueByLineTrend";
import PeriodSelector from "views/others/periodSelector";

export default class CarouselRevByLineView extends JetView{

        config (){

                return {
                        view:"carousel",
                        id : "rev_line",
                        css:"webix_dark",

                        cols : [

                                {type : "clean", rows : [
                                        new RevByLineView(this.app,"","FAI"), new PeriodSelector(this.app,"","revByLine_FAI",2),new RevByLineTrendView(this.app, "","FAI")
                                ]},

                                {type : "clean", rows : [
                                    new RevByLineView(this.app,"","GROS"), new PeriodSelector(this.app,"","revByLine_GROS",2),new RevByLineTrendView(this.app, "","GROS")
                                ]}
                        ]

                }
        }

        init(){
        }

}
