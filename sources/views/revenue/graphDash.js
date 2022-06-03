import { JetView } from "webix-jet";
import PeriodSelector from "views/others/periodSelector";
/*import RevGeoControlView from "views/revenue/revGeoControl";
import RevBndleTypeView from 'views/revenue/revBundleView';
import GraphHeadView from "views/home/graphHeaders";*/
/*import RevByZoneView from "views/revenue/revenueByZones";
import RevByBillView from "views/revenue/revenueByBill";
import RevBySalesTrendView from "views/revenue/revenueSalesTrend";
import RevSalesSplit from "views/revenue/revenueSaleSplit";*/
import RevByLineView from "views/revenue/revenueByLine";
import RevByLineTrendView from "views/revenue/revenueByLineTrend";
import RevByOPView from "views/revenue/revByOP";
import TrVoiceByOPView from "views/revenue/traffByOP";
import RevTypeProdView from "views/revenue/revenueByTypeByProd";
import GraphHeadView from "views/home/graphHeaders";
import RevByTypeSplitView from "views/revenue/revenueByTypeSplit";
import RevByTypeTrendViewNew from "views/revenue/revenueByTypeTrendNew";
import RevByCltView from "views/revenue/revByClient";
import {
  getScreenType,
  getScreenTypeByMenu,
  setScreenTypeByMenu,
} from "models/utils/home/utils";
import { gconfig } from "models/utils/general/boot";

import { getPanels } from "views/revenue/config/utils";
import { getMenuApp } from "models/referential/genReferentials";

export default class RevGraphDashView extends JetView {
  config() {
    var gridColumns,
      gridRows,
      cells = [];
    var config = {
      view:
        getScreenType() != "mobile" && getScreenType() != "mobile_rotated"
          ? "c-dashboard"
          : "m-dashboard",
      margin: 5,
      padding: 5,
      css: { "background-color": "#EBEDF0" },
    };

    switch (getScreenType()) {
      case "mobile":
        gridColumns = 4;
        gridRows = 21;
        cells.push({
          view: "panel",
          x: 0,
          y: 0,
          dx: 4,
          dy: 5,
          resize: true,
          header: new GraphHeadView(this.app, "", "rev_global", "homelines"),
          body: {
            type: "clean",
            margin: 0,
            rows: [
              RevByTypeSplitView,
              new PeriodSelector(this.app, "", "revByType", 3),
              RevByTypeTrendViewNew,
            ],
          },
          css: { "background-color": "#fff" },
        });

        cells.push({
          view: "panel",
          x: 0,
          y: 5,
          dx: 4,
          dy: 5,
          resize: true,
          header: new GraphHeadView(this.app, "", "rev_by_line", "homelines"),
          body: {
            type: "clean",
            margin: 0,
            rows: [
              RevByLineView,
              new PeriodSelector(this.app, "", "revByLine", 2),
              RevByLineTrendView,
            ],
          },
          css: { "background-color": "#fff" },
        });

        cells.push({
          view: "panel",
          x: 0,
          y: 10,
          dx: 4,
          dy: 5,
          resize: true,
          header: new GraphHeadView(this.app, "", "rev_by_op", "homelines"),
          body: {
            type: "clean",
            margin: 0,
            rows: [RevByOPView, TrVoiceByOPView],
          },
          css: { "background-color": "#fff" },
        });

        cells.push({
          view: "panel",
          x: 0,
          y: 15,
          dx: 4,
          dy: 6,
          resize: true,
          header: new GraphHeadView(this.app, "", "rev_other", ""),
          body: {
            type: "clean",
            margin: 0,
            rows: [RevTypeProdView, RevByCltView],
          },
        });
        config["minHeight"] = 1900;

        break;

      case "mobile_rotated":
        gridColumns = 6;
        gridRows = 4;
        cells.push({
          view: "panel",
          x: 0,
          y: 0,
          dx: 3,
          dy: 2,
          resize: true,
          header: new GraphHeadView(this.app, "", "rev_global", "homelines"),
          body: {
            type: "clean",
            margin: 0,
            rows: [
              RevByTypeSplitView,
              new PeriodSelector(this.app, "", "revByType", 3),
              RevByTypeTrendViewNew,
            ],
          },
          css: { "background-color": "#fff" },
        });

        cells.push({
          view: "panel",
          x: 3,
          y: 0,
          dx: 3,
          dy: 2,
          resize: true,
          header: new GraphHeadView(this.app, "", "rev_by_line", "homelines"),
          body: {
            type: "clean",
            margin: 0,
            rows: [
              RevByLineView,
              new PeriodSelector(this.app, "", "revByLine", 2),
              RevByLineTrendView,
            ],
          },
          css: { "background-color": "#fff" },
        });

        cells.push({
          view: "panel",
          x: 0,
          y: 2,
          dx: 3,
          dy: 2,
          resize: true,
          header: new GraphHeadView(this.app, "", "rev_by_op", "homelines"),
          body: {
            type: "clean",
            margin: 0,
            rows: [RevByOPView, TrVoiceByOPView],
          },
          css: { "background-color": "#fff" },
        });

        cells.push({
          view: "panel",
          x: 3,
          y: 2,
          dx: 3,
          dy: 2,
          resize: true,
          header: new GraphHeadView(this.app, "", "rev_other", ""),
          body: {
            type: "clean",
            margin: 0,
            rows: [RevTypeProdView, RevByCltView],
          },
        });
        config["minHeight"] = 850;
        break;

      default:
        /**
         * Take all stats and properties
         */
        var menu = getMenuApp("revenue");

        var menu_id = menu.id;
        // console.log(menu_id);

        var tab = menu.tabs[0];

        gridColumns = 8;
        gridRows = 6;
        // cells.push({
        //   view: "panel",
        //   x: 0,
        //   y: 0,
        //   dx: 2,
        //   dy: 6,
        //   resize: true,
        //   header: new GraphHeadView(this.app, "", "rev_global", "homelines"),
        //   body: {
        //     type: "clean",
        //     margin: 0,
        //     rows: [
        //       RevByTypeSplitView,
        //       new PeriodSelector(this.app, "", "revByType", 3),
        //       RevByTypeTrendViewNew,
        //     ],
        //   },
        //   css: { "background-color": "#fff" },
        // });

        // cells.push({
        //   view: "panel",
        //   x: 2,
        //   y: 0,
        //   dx: 2,
        //   dy: 6,
        //   resize: true,
        //   header: new GraphHeadView(this.app, "", "rev_by_line", "homelines"),
        //   body: {
        //     type: "clean",
        //     margin: 0,
        //     rows: [
        //       RevByLineView,
        //       new PeriodSelector(this.app, "", "revByLine", 2),
        //       RevByLineTrendView,
        //     ],
        //   },
        //   css: { "background-color": "#fff" },
        // });

        // cells.push({
        //   view: "panel",
        //   x: 4,
        //   y: 0,
        //   dx: 2,
        //   dy: 6,
        //   resize: true,
        //   header: new GraphHeadView(this.app, "", "rev_by_op", "homelines"),
        //   body: {
        //     type: "clean",
        //     margin: 0,
        //     rows: [RevByOPView, TrVoiceByOPView],
        //   },
        //   css: { "background-color": "#fff" },
        // });

        // cells.push({
        //   view: "panel",
        //   x: 6,
        //   y: 0,
        //   dx: 2,
        //   dy: 6,
        //   resize: true,
        //   header: new GraphHeadView(this.app, "", "rev_other", ""),
        //   body: {
        //     type: "clean",
        //     margin: 0,
        //     rows: [RevTypeProdView, RevByCltView],
        //   },
        //   /*{ type : 'clean', margin : 0, rows : [RevByBillView, RevByZoneView] },css : { "background-color":"#fff"}*/
        // });
        // cells.push({ view:"panel", x:0, y:4, dx:2, dy:2, resize:true, header : new GraphHeadView(this.app, "", "rev_by_bndle", "rev_bndle_split_exp"), body : {template : "vue1"},css : { "background-color":"#fff"}});
        //if(getScreenType() == 'standard') config['minHeight'] = 606;

        break;
    }
    config["cells"] = getPanels(this.app, menu_id, tab);
    // config["cells"] = cells;
    config["gridColumns"] = gridColumns;
    config["gridRows"] = gridRows;
    return {
      view: "scrollview",
      scroll: "y",
      body: config,
    };
  }

  init() {
    var obj = this;
    setScreenTypeByMenu("revenue", getScreenType());
    gconfig["dashboards"]["revenue"] = obj;
    webix.event(window, "resize", function () {
      if ($$("top:menu").getSelectedId() == "revenue") {
        if (getScreenTypeByMenu("revenue") != getScreenType()) {
          setScreenTypeByMenu("revenue", getScreenType());
          if (gconfig["dashboards"]["revenue"]._container != null)
            gconfig["dashboards"]["revenue"].refresh();
        }
      }
    });
  }
}
