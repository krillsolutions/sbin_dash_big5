/* eslint-disable no-empty */
import { JetView } from "webix-jet";
import HomeStatView from "views/newHome/vignetteView";
import { getScreenType } from "models/utils/home/utils";
// import notAuthStat from "views/notAuth/notAuthStat";
// import { applyAuthorizations } from "models/referential/configDash";
import { getStats } from "models/utils/general/utils";

export default class StatsView extends JetView {
  config() {
    /**
     * Take all stats and properties
     */
    var menu = all_apps
      .filter((e) => e.id == app_id)[0]
      .menus.filter((e) => e.id == "home")[0];
    /**
     * MENU ID
     */
    var menu_id = menu.id;

    this._colCount = menu.stats.col_count;
    this._maxColCount = menu.stats.max_col_count;

    var rowstat = {
      view:
        getScreenType() != "mobile" && getScreenType() != "mobile_rotated"
          ? "c-dashboard"
          : "m-dashboard",
      id: "home:stats",
      gridColumns: menu.stats.grid_cols,
      gridRows: menu.stats.grid_rows,
      maxHeight: 100,
      responsive: "hide",
      cells: getStats(this.app, menu_id, menu.stats),
    };
    return rowstat;
  }

  init(view) {
    var obj = this;
    webix.event(window, "resize", function () {
      if (
        typeof $$("top:menu") == "undefined" ||
        $$("top:menu").getSelectedId() == "home"
      ) {
        if (getScreenType() == "mobile_rotated") {
          $$("home:stats").hide();
          return;
        }
        $$("home:stats").show();
        var h = window.screen.width;
        if (h / obj._colCount > 160) {
          if (obj._colCount < obj._maxColCount)
            obj._colCount = obj._colCount + 1;
          else return;
          if (h / obj._colCount < 160) return;
        } else
          while (h / obj._colCount < 160) obj._colCount = obj._colCount - 1;
        $$("home:stats").define("gridColumns", obj._colCount);
        $$("home:stats").adjust();
      }
    });
  }

  ready(view) {
    var obj = this;
    if (getScreenType() == "mobile_rotated") {
      $$("home:stats").hide();
      return;
    }
    $$("home:stats").show();
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
