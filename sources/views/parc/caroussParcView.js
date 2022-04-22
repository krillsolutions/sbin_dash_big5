import {JetView} from "webix-jet";

import ParcView from "views/parc/parcView";

export default class CarouselParcView extends JetView{

        config (){

                return {
                        view:"carousel",
                       // id : "parc_car",
                        css:"webix_dark",

                        cols : [

                                {type : "clean", rows : [
                                        new ParcView(this.app,"","FAI"),
                                ]},

                                {type : "clean", rows : [
                                        new ParcView(this.app,"","GROS"),
                                ]}
                        ]

                }
        }

        init(){
        }

}
