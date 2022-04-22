import {JetView} from "webix-jet";
import {getTitle} from "models/utils/home/utils";
import ParcGrosGraphDashView from "views/parc/parcGROSDash";
import ParcFAIGraphDashView from "views/parc/parcFAIDash";

export default class ParcTabView extends JetView{

        config ()
        {
                return {
                        view:"tabview", id : "parc:tab", animate:false,
                        cells : [
                                {
                                    id : 'tab:fai', header : getTitle("parc_fai"),
                                    body : ParcFAIGraphDashView
                                },
                                {id : 'tab:gros',header : getTitle("parc_gros") , body :ParcGrosGraphDashView}

                        ]
                };
        }

        init() {

        }
}
