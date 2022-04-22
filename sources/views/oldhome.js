import {JetView} from "webix-jet";
import GraphDashView from "views/home/graphDash";
import StatsView from "views/home/statsView";
export default class HomeView extends JetView{

        config ()
        {

                var rows = [];

                rows.push({$subview : StatsView});
                rows.push({$subview : GraphDashView});
         return {
                        type:"space",margin : 5, css:"app-right-panel",  padding:4,
                        rows : rows
                };
        }
}
