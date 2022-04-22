import {JetView} from "webix-jet";
import HomeStatView from "views/home/vignetteView";
import {getScreenType} from "models/utils/home/utils";
export default class StatsView extends JetView{

        config ()
        {

                this._colCount = 6;
                this._maxColCount = 6;
                var rowstat = {
                        view:"dashboard",id : "home:stats",
                        gridColumns : this._colCount, gridRows : 1,maxHeight:100,responsive : "hide",
                        cells : [
                                { view:"panel", x:0, y:0, dx:1, dy:1, body : new HomeStatView(this.app, "", 'parc') },
                                { view:"panel", x:1, y:0, dx:1, dy:1, body : new HomeStatView(this.app, "", 'revenue_fai')},
                                { view:"panel", x:2, y:0, dx:1, dy:1, body : new HomeStatView(this.app, "", 'revenue_gros')},
                                { view:"panel", x:3, y:0, dx:1, dy:1, body :  new HomeStatView(this.app, "", 'rsales')},
                                { view:"panel", x:4, y:0, dx:1, dy:1, body : new HomeStatView(this.app, "", 'fpaid') },
                                //{ view:"panel", x:5, y:0, dx:1, dy:1, body : new HomeStatView(this.app, "", 'demands') },
                                { view:"panel", x:5, y:0, dx:1, dy:1, body : new HomeStatView(this.app, "", 'tvoix')},
                        ]
                };
         return rowstat

        }
        init(view) {
                var obj = this;
                webix.event(window, "resize", function(){
                        if( typeof $$('top:menu') == 'undefined' ||  $$('top:menu').getSelectedId() == 'home') {
                        if(getScreenType() == 'mobile_rotated') {
                                $$('home:stats').hide()
                                return
                        }
                        $$('home:stats').show()
                        var h = window.screen.width
                        if(h/obj._colCount > 160 ) { 

                                if (obj._colCount < obj._maxColCount) obj._colCount = obj._colCount+1;
                                else  return;
                                if(h/obj._colCount < 160 ) return;
                        }
                        else
                                while(h/obj._colCount < 160 )
                                        obj._colCount = obj._colCount-1;
                        $$('home:stats').define("gridColumns", obj._colCount);
                        $$('home:stats').adjust();
                        }
                })
        }
        ready(view) {
            var obj = this;
            if(getScreenType() == 'mobile_rotated') {
                    $$('home:stats').hide()
                    return
            }
            $$('home:stats').show()
            var h = window.screen.width;

            while(h/obj._colCount < 160 ){
                    obj._colCount = obj._colCount-1;
            }
            if(h/obj._colCount > 160 ) {

                    if (obj._colCount < obj._maxColCount) obj._colCount = obj._colCount+1;
                    if (h/obj._colCount < 160 ) obj._colCount = obj._colCount-1;
            }

            view.define("gridColumns", obj._colCount);
            view.adjust();
}


}
