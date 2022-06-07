import {JetView} from "webix-jet"
import RecouvCarControl from "./recouDecControl"
import RecouvreCurveView from "./recouvCurves"

import RecouvGridView from "./recouvGridView"
import RecouvTableView from "./recouvTab"

export default class RecouvCaroussView extends JetView {

    constructor(app,name,type){

        super(app,name)
        this._type = type
    }

    config(){

        return {
            view : "carousel",
            id : "recouv:carous:"+this._type,
            css:"webix_dark",
            cols : [
                new RecouvGridView(this.app,"", this._type),
                {
                    type : "clean", margin : 0, rows : [
                        new RecouvCarControl(this.app, "", this._type),
                        {
                            view : "gridlayout", gridColumns : 2, gridRows : 4, 
                            cells : [
                                {view : "panel", x : 0, y : 0, dx : 2, dy : 2, body : new RecouvTableView(this.app,"", this._type)},
                                {view : "panel", x : 0, y : 2, dx : 2, dy : 2, body : new RecouvreCurveView(this.app, "", this._type)}
                            ]
                        }
                        
                    ]
                }
                
            ]
        }
    }
}