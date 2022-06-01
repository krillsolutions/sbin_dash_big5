import { JetView } from "webix-jet";
import GraphHeadView from "../home/graphHeaders";
import RecouvreDetView from "./recouvrementDet";


export default class RecouvDetDash extends JetView{

    
    getColNum(count){
        if(count == 4) return 2
        return  (count%4 == 0)?4 : ((count%3 == 0)? 3 : ((count%4) == 1 ? ((count%3 == 1)? 2 :3 ) : 4) )           
    }    
    
    config() {

        let nCol = this.getColNum(product_for_recouvrement.length),
        nRow = Math.floor(product_for_recouvrement.length/nCol)

        let rows = {type : "clean", margin : 0 , rows : []}

        let k = 0, cols = {type : "clean", margin : 0, cols : []}
        product_for_recouvrement.forEach(p => {
            
            if(k != nCol) {                
                k++
            }
            else {
                rows.rows.push({...cols})
                cols = {type : "clean", margin : 0, cols : []}                
                k = 0
            }
            cols.cols.push(new RecouvreDetView(this.app, "", p))
        });
        rows.rows.push({...cols})
        return {
            view : "dashboard", 
            gridColumns : 2,
            gridRows : 2,
            cells : [{
                view : "panel",
                header : new GraphHeadView(this.app,"",""),
                x : 0,
                y : 0,
                dx : 2,
                dy : 2,
                body : rows
            }]
        }
    }
}