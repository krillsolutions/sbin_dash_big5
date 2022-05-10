/* eslint-disable no-empty */
import { JetView } from "webix-jet";
import HomeStatView from "views/newHome/vignetteView";
import { getScreenType } from "models/utils/home/utils";
import notAuthStat from "views/notAuth/notAuthStat";
import { applyAuthorizations } from "models/referential/configDash";
export default class StatsView extends JetView {
  config() {
    let authorized = applyAuthorizations(1, 1, 1, 6);

    // var menu_home_dashboard = app_orange.menus
    //   .filter((e) => e.menu_id == 1)[0]
    //   .tabs[0].dashboards.filter((f) => f.dash_id <= 6);

    this._colCount = 6;
    this._maxColCount = 6;
    var rowstat = {
      view:
        getScreenType() != "mobile" && getScreenType() != "mobile_rotated"
          ? "c-dashboard"
          : "m-dashboard",
      id: "home:stats",
      gridColumns: this._colCount,
      gridRows: 1,
      maxHeight: 100,
      responsive: "hide",
      cells: [
        {
          view: "panel",
          x: 0,
          y: 0,
          dx: 1,
          dy: 1,
          body: authorized[0].authorized
            ? new HomeStatView(this.app, "", "parc")
            : new notAuthStat(this.app, "", "parc"),
        },
        {
          view: "panel",
          x: 1,
          y: 0,
          dx: 1,
          dy: 1,
          body: authorized[1].authorized
            ? new HomeStatView(this.app, "", "revenue")
            : new notAuthStat(this.app, "", "revenue"),
        },
        {
          view: "panel",
          x: 2,
          y: 0,
          dx: 1,
          dy: 1,
          body: authorized[2].authorized
            ? new HomeStatView(this.app, "", "tvoix")
            : new notAuthStat(this.app, "", "tvoix"),
        },
        {
          view: "panel",
          x: 3,
          y: 0,
          dx: 1,
          dy: 1,
          body: authorized[3].authorized
            ? new HomeStatView(this.app, "", "tdata")
            : new notAuthStat(this.app, "", "tdata"),
        },
        {
          view: "panel",
          x: 4,
          y: 0,
          dx: 1,
          dy: 1,
          body: authorized[4].authorized
            ? new HomeStatView(this.app, "", "topup")
            : new notAuthStat(this.app, "", "topup"),
        },
        {
          view: "panel",
          x: 5,
          y: 0,
          dx: 1,
          dy: 1,
          body: authorized[5].authorized
            ? new HomeStatView(this.app, "", "encaiss")
            : new notAuthStat(this.app, "", "encaiss"),
        },
      ],
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
