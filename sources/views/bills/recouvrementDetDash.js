import { JetView } from "webix-jet";
//import { getDates, getMonthsFromDate } from "../../models/utils/general/utils";
import GraphHeadView from "../home/graphHeaders";
import RecouvGridView from "./recouvGridView";
//import RecouvreDetView from "./recouvrementDet";


export default class RecouvDetDash extends JetView{

    config() {

        let grid_cols = fact_type.length*2, grid_rows = 2, cells = []
        fact_type.forEach((f,i) => {
            cells.push(
                {
                    view : "panel",header : new GraphHeadView(this.app, "", "recouv_split_fact_"+f.id),
                    x : 2*i,y : 0, dx : 2, dy : 2,
                    body : {view : "scrollview", scroll : "y", body : new RecouvGridView(this.app, "", f.name)}
                }
            )
        })
        console.log(cells)
        return {
            view : "c-dashboard", 
            gridColumns : grid_cols,
            gridRows : grid_rows,
            cells : cells
        }
    }

    init(view) {

    }
}