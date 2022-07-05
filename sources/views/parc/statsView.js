/* eslint-disable no-empty */
import { JetView } from "webix-jet";
// import ParcStatView from "views/parc/vignetteView";
import { getScreenType } from "models/utils/home/utils";
import { getStats } from "views/parc/config/utils";
import { getMenuApp } from "models/referential/genReferentials";

export default class StatsView extends JetView {
  config() {
    /**
     * Take all stats and properties
     */
    var menu = getMenuApp("parc");
    // console.log(menu);
    /**
     * MENU ID
     */
    var menu_id = menu.id;
    // console.log(menu_id);

    // console.log(getStats(this.app, menu_id, menu.stats));

    this._colCount = menu.stats.col_count;
    this._maxColCount = menu.stats.max_col_count;
    var rowstat = {
      view:
        getScreenType() != "mobile" && getScreenType() != "mobile_rotated"
          ? "c-dashboard"
          : "m-dashboard",
      id: "parc:stats",
      gridColumns: this._colCount,
      gridRows: menu.stats.grid_rows,
      maxHeight: 100,
      responsive: "hide",
      cells: getStats(this.app, menu_id, menu.stats),
      // cells: [
      //   {
      //     view: "panel",
      //     x: 0,
      //     y: 0,
      //     dx: 1,
      //     dy: 1,
      //     body: new ParcStatView(this.app, "", "prepaid"),
      //   },
      //   {
      //     view: "panel",
      //     x: 1,
      //     y: 0,
      //     dx: 1,
      //     dy: 1,
      //     body: new ParcStatView(this.app, "", "postpaid"),
      //   },
      //   {
      //     view: "panel",
      //     x: 2,
      //     y: 0,
      //     dx: 1,
      //     dy: 1,
      //     body: new ParcStatView(this.app, "", "pmobile"),
      //   },
      //   {
      //     view: "panel",
      //     x: 3,
      //     y: 0,
      //     dx: 1,
      //     dy: 1,
      //     body: new ParcStatView(this.app, "", "pfixe"),
      //   },
      //   {
      //     view: "panel",
      //     x: 4,
      //     y: 0,
      //     dx: 1,
      //     dy: 1,
      //     body: new ParcStatView(this.app, "", "plte"),
      //   },
      //   //{ view:"panel", x:4, y:0, dx:1, dy:1, body : new ParcStatView(this.app, "", 'newclient') }
      // ],
    };
    return rowstat;
  }
  init(view) {
    var obj = this;
    webix.event(window, "resize", function () {
      if (
        typeof $$("top:menu") == "undefined" ||
        $$("top:menu").getSelectedId() == "parc"
      ) {
        if (getScreenType() == "mobile_rotated") {
          $$("parc:stats").hide();
          return;
        }
        $$("parc:stats").show();
        var h = window.screen.width; //view.getParentView().$width;
        if (h / obj._colCount > 160) {
          if (obj._colCount < obj._maxColCount)
            obj._colCount = obj._colCount + 1;
          else return;
          if (h / obj._colCount < 160) return;
        } else
          while (h / obj._colCount < 160) obj._colCount = obj._colCount - 1;
        $$("parc:stats").define("gridColumns", obj._colCount);
        $$("parc:stats").adjust();
      }
    });
    /*$$('parc:stats').attachEvent("onChange", function(){  
			console.log("view show");
			//window.dispatchEvent(new Event('resize'));
		});*/
  }

  ready(view) {
    var obj = this;
    if (getScreenType() == "mobile_rotated") {
      $$("parc:stats").hide();
      return;
    }
    $$("parc:stats").show();
    var h = window.screen.width;

    while (h / obj._colCount < 160) {
      obj._colCount = obj._colCount - 1;
    }
    if (h / obj._colCount > 160) {
      if (obj._colCount < obj._maxColCount) obj._colCount = obj._colCount + 1;
      if (h / obj._colCount < 160) obj._colCount = obj._colCount - 1;
    }

    view.define("gridColumns", obj._colCount);
    view.adjust();
  }
}
