import {JetView} from "webix-jet";
import {getTitle} from "models/utils/home/utils";
import RevFAIGraphDashView from "views/revenue/revFAIDash";
import RevGROSGraphDashView from "views/revenue/revGROSDash";

export default class RevTabView extends JetView{

        config ()
        {
                return {
                        view:"tabview", id : "rev:tab", animate:false,
                        cells : [
                                {
                                    id : 'tab:fai', header : getTitle("rev_fai"),
                                    body : RevFAIGraphDashView
                                },
                                {id : 'tab:gros',header : getTitle("rev_gros") , body :RevGROSGraphDashView}

                        ]
                };
        }

        init() {

        }
}
