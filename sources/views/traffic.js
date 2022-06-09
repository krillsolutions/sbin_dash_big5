/* eslint-disable no-empty */
import { JetView } from "webix-jet";
import TraffStatView from "views/traffic/vignetteView";
import TraffTabView from "views/traffic/TrafficTab";
import {
  getScreenType,
  getScreenTypeByMenu,
  setScreenTypeByMenu,
} from "models/utils/home/utils";
import { gconfig } from "models/utils/general/boot";

import { getStats } from "views/traffic/config/utils";
import { getMenuApp } from "models/referential/genReferentials";

export default class TraffViewView extends JetView {
  config() {
    /**
     * Take all stats and properties
     */
    var menu = getMenuApp("traffic");
    // console.log(menu);
    /**
     * MENU ID
     */
    var menu_id = menu.id;
    var rows = [];

    this._colCount = menu.stats.col_count;
    this._maxColCount = menu.stats.max_col_count;

    var rowstat = {
      view:
        getScreenType() != "mobile" && getScreenType() != "mobile_rotated"
          ? "c-dashboard"
          : "m-dashboard",
      id: "traff:stats",
      gridColumns: this._colCount,
      gridRows: 1,
      maxHeight: 100,
      responsive: "hide",
      cells: getStats(this.app, menu_id, menu.stats),
      //       cells: [
      //         {
      //           view: "panel",
      //           x: 0,
      //           y: 0,
      //           dx: 1,
      //           dy: 1,
      //           body: new TraffStatView(this.app, "", "voice"),
      //         },
      //         {
      //           view: "panel",
      //           x: 1,
      //           y: 0,
      //           dx: 1,
      //           dy: 1,
      //           body: new TraffStatView(this.app, "", "sms"),
      //         },
      //         {
      //           view: "panel",
      //           x: 2,
      //           y: 0,
      //           dx: 1,
      //           dy: 1,
      //           body: new TraffStatView(this.app, "", "data"),
      //         },
      //         {
      //           view: "panel",
      //           x: 3,
      //           y: 0,
      //           dx: 1,
      //           dy: 1,
      //           body: new TraffStatView(this.app, "", "rpyg"),
      //         },
      //       ],
    };

    rows.push(rowstat);
    rows.push({ $subview: TraffTabView });
    //rows.push({template : 'TODO'});
    // console.log(rowstat);
    return {
      type: "space",
      margin: 5,
      css: "app-right-panel",
      padding: 4,
      rows: rows,
    };
  }
  init(view) {
    var obj = this;
    setScreenTypeByMenu("traffic", getScreenType());
    gconfig["dashboards"]["traffic"] = obj;
    webix.event(window, "resize", function () {
      if ($$("top:menu").getSelectedId() == "traffic") {
        if (getScreenTypeByMenu("traffic") != getScreenType()) {
          setScreenTypeByMenu("traffic", getScreenType());
          if (gconfig["dashboards"]["traffic"]._container != null)
            gconfig["dashboards"]["traffic"].refresh();
        }
        if (getScreenType() == "mobile_rotated") {
          $$("traff:stats").hide();
          return;
        }
        $$("traff:stats").show();
        var h = window.screen.width; //view.getParentView().$width;
        if (h / obj._colCount > 160) {
          if (obj._colCount < obj._maxColCount)
            obj._colCount = obj._colCount + 1;
          else return;
          if (h / obj._colCount < 160) return;
        } else
          while (h / obj._colCount < 160) obj._colCount = obj._colCount - 1;
        $$("traff:stats").define("gridColumns", obj._colCount);
        $$("traff:stats").adjust();
      }
    });
  }

  ready(view) {
    var obj = this;
    if (getScreenType() == "mobile_rotated") {
      $$("traff:stats").hide();
      return;
    }
    $$("traff:stats").show();
    var h = window.screen.width;

    while (h / obj._colCount < 160) {
      obj._colCount = obj._colCount - 1;
    }
    if (h / obj._colCount > 160) {
      if (obj._colCount < obj._maxColCount) obj._colCount = obj._colCount + 1;
      if (h / obj._colCount < 160) obj._colCount = obj._colCount - 1;
    }

    $$("traff:stats").define("gridColumns", obj._colCount);
    $$("traff:stats").adjust();
  }
}
