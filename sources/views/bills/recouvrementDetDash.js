import { JetView } from "webix-jet";
//import { getDates, getMonthsFromDate } from "../../models/utils/general/utils";
import GraphHeadView from "../home/graphHeaders";
import RecouvGridView from "./recouvGridView";
//import RecouvreDetView from "./recouvrementDet";


export default class RecouvDetDash extends JetView{

    
    // getColNum(count){
    //     if(count == 4) return 2
    //     return  (count%4 == 0)?4 : ((count%3 == 0)? 3 : ((count%4) == 1 ? ((count%3 == 1)? 2 :3 ) : 4) )           
    // }    
    
    config() {

        //let nCol = this.getColNum(product_for_recouvrement.length)
      /*  let rows = {type : "clean",id : "recouv_split_fact_period_panel", margin : 0 , rows : []},rows1 = {type : "clean", margin : 0 , rows : []}
        this._month = getDates()['d1'].substr(0,7)
        let mths = getMonthsFromDate(getDates()['d1'], recouvr_months_offset)        
        let nCol = 2, k=0, cols = {type : "clean", margin : 0, cols : []}, cols1 = {type : "clean", margin : 0, cols : []}
        mths.forEach(p => {
            
            if(k != nCol) {                
                k++
            }
            else {
          //      rows.rows.push({...cols})
                rows1.rows.push({...cols1})
                cols = {type : "clean", margin : 0, cols : []}                
                cols1 = {type : "clean", margin : 0, cols : []}
                k = 0
            }
        //    cols.cols.push(new RecouvreDetView(this.app, "", p,"PERIODIQUE"))
            cols1.cols.push(new RecouvreDetView(this.app, "", p,"ISOLEE"))
        });*/
        //rows.rows.push({...cols})
        return {
            view : "c-dashboard", 
            gridColumns : 4,
            gridRows : 2,
            cells : [{
                view : "panel",
                header : new GraphHeadView(this.app,"","recouv_split_fact_period"),                
                x : 0,
                y : 0,
                dx : 2,
                dy : 2,
                body : {view : "scrollview", scroll : "y", body : new RecouvGridView(this.app,"","PERIODIQUE")}
            },
            {
                view : "panel",
                header : new GraphHeadView(this.app,"","recouv_split_fact_isolee"),
                x : 2,
                y : 0,
                dx : 2,
                dy : 2,
                body :{view : "scrollview", scroll : "y", body : new RecouvGridView(this.app,"","ISOLEE")}
            }
        ]
        }
    }

    init(view) {

    }
}