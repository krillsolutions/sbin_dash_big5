import {JetView} from "webix-jet";
import ParcBTView from "views/parc/parcBTView";

import ParcOfferTypeView from "views/parc/parcByOfferView";
import ParcGROSView from "views/parc/parcGrosView";
import ParcGrosOff from "views/parc/parcGrosOffView"

export default class ParcView extends JetView{


        constructor(app, name, type) {

            super(app,name);
            this._type  = type;
        }

        config (){

                let tp = this._type;
                let rows = []
                if(tp == 'FAI') {
                    rows = [new  ParcBTView(this.app,"",tp),new ParcOfferTypeView(this.app,"",tp)]
                }
                else {
                    rows = [ParcGROSView, ParcGrosOff]
                }
                return {

                    type : 'clean', margin : 0, rows :rows

                }
        }

        init(){
        }

}
