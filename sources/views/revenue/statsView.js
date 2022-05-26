/* eslint-disable no-empty */
import { JetView } from "webix-jet";
import RevStatView from "views/revenue/vignetteView";
import { getScreenType } from "models/utils/home/utils";
import { getStats } from "views/revenue/config/utils";

export default class StatsView extends JetView {
  config() {
    /**
     * Take all stats and properties
     */
    var menu = all_apps
      .filter((e) => e.id == app_id)[0]
      .menus.filter((e) => e.id == "revenue")[0];
    // console.log(menu);
    /**
     * MENU ID
     */
    var menu_id = menu.id;
    // console.log(menu_id);

    this._colCount = 6;
    this._maxColCount = 6;
    var rowstat = {
      view:
        getScreenType() != "mobile" && getScreenType() != "mobile_rotated"
          ? "c-dashboard"
          : "m-dashboard",
      id: "rev:stats",
      gridColumns: this._colCount,
      gridRows: 1,
      maxHeight: 100,
      responsive: "hide",
      cells: getStats(this.app, menu_id, menu.stats),
      //   cells: [
      //     {
      //       view: "panel",
      //       x: 0,
      //       y: 0,
      //       dx: 1,
      //       dy: 1,
      //       body: new RevStatView(this.app, "", "rtot"),
      //     },
      //     {
      //       view: "panel",
      //       x: 1,
      //       y: 0,
      //       dx: 1,
      //       dy: 1,
      //       body: new RevStatView(this.app, "", "rpyg"),
      //     },
      //     {
      //       view: "panel",
      //       x: 2,
      //       y: 0,
      //       dx: 1,
      //       dy: 1,
      //       body: new RevStatView(this.app, "", "rmob"),
      //     },
      //     {
      //       view: "panel",
      //       x: 5,
      //       y: 0,
      //       dx: 1,
      //       dy: 1,
      //       body: new RevStatView(this.app, "", "rlte"),
      //     },
      //     {
      //       view: "panel",
      //       x: 3,
      //       y: 0,
      //       dx: 1,
      //       dy: 1,
      //       body: new RevStatView(this.app, "", "rprepaid"),
      //     },
      //     {
      //       view: "panel",
      //       x: 4,
      //       y: 0,
      //       dx: 1,
      //       dy: 1,
      //       body: new RevStatView(this.app, "", "rpostpaid"),
      //     },
      //   ],
    };
    return rowstat;
  }
  init(view) {
    var obj = this;
    webix.event(window, "resize", function () {
      if (
        typeof $$("top:menu") == "undefined" ||
        $$("top:menu").getSelectedId() == "revenue"
      ) {
        if (getScreenType() == "mobile_rotated") {
          $$("rev:stats").hide();
          return;
        }
        $$("rev:stats").show();
        var h = window.screen.width; //view.getParentView().$width;
        if (h / obj._colCount > 160) {
          if (obj._colCount < obj._maxColCount)
            obj._colCount = obj._colCount + 1;
          else return;
          if (h / obj._colCount < 160) return;
        } else
          while (h / obj._colCount < 160) obj._colCount = obj._colCount - 1;
        $$("rev:stats").define("gridColumns", obj._colCount);
        $$("rev:stats").adjust();
      }
    });
    /*$$('rev:stats').attachEvent("onChange", function(){  
			console.log("view show");
			//window.dispatchEvent(new Event('resize'));
		});*/
  }

  ready(view) {
    var obj = this;
    if (getScreenType() == "mobile_rotated") {
      $$("rev:stats").hide();
      return;
    }
    $$("rev:stats").show();
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
