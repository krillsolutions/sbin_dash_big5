import { JetView } from "webix-jet";
import { getDates, getMonthsFromDate } from "../../models/utils/general/utils";
import RecouvreDetView from "./recouvrementDet";

export default class RecouvGridView extends JetView {
  constructor(app, name, type) {
    super(app, name);

    this._type_fact = type;
  }

  config() {
    let cells = [],
      type_fact = this._type_fact;

    console.log(type_fact);
    let mths = getMonthsFromDate(getDates()["d1"], recouvr_months_offset);
    let nCol = 2,
      k = 0,
      r = 0,
      p = 0;
    // console.log(mths);
    mths.forEach((pp) => {
      if (k != nCol) {
        cells.push({
          view: "panel",
          x: nCol * k,
          y: nCol * r,
          dx: 2,
          dy: 2,
          body: new RecouvreDetView(this.app, "", p, type_fact),
        });
        k++;
      } else {
        (k = 0), r++;
        cells.push({
          view: "panel",
          x: nCol * k,
          y: nCol * r,
          dx: 2,
          dy: 2,
          body: new RecouvreDetView(this.app, "", p, type_fact),
          // header : {view : "toolbar", type : "clean", heigth : 20, cols : [{template : "TEST",  borderless : true, type : "header"}, {}, {view: "icon",icon:"mdi mdi-export"}]}
        });
        k++;
      }
      p++;
    });

    console.log(cells);

    return {
      view: "gridlayout",
      gridColumns: 4,
      gridRows: mths.length,
      cells: cells,
      id: "grid:" + type_fact,
      minHeight: Math.floor(mths.length / 2) * 250,
    };
  }

  init(view) {
    /* let obj = this,type_fact = this._type_fact
        this.app.attachEvent("app:ButtonClicked:dateChange", function(){
            let d = getDates()['d1']
            if(obj._month != d.substr(0,7)) {
                obj._month = d.substr(0,7)
                view.clearAll()
                let mths = getMonthsFromDate(d, recouvr_months_offset)        
                let nCol = 2, k=0, r = 0
                mths.forEach(p => {
                    console.log(p)
                    if(k != nCol) {  
                        view.addView({view : "panel", x : nCol*k, y : nCol*r,dx : 2,dy : 2, body : new RecouvreDetView(obj.app, "", p,type_fact) })              
                        k++
                    }
                    else {
                        k =0 ,r++
                        view.addView({view : "panel",x : nCol*k, y : nCol*r,dx : 2,dy : 2,  body : new RecouvreDetView(obj.app, "", p,type_fact) })
                        k++
                    }
                });
                
            }

        })*/
  }
}
