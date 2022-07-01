import { JetView } from "webix-jet";
import GraphHeadView from "views/home/graphHeaders";
import RecouvrTrendView from "views/bills/recouvrementView";
import RecouvrByOfferView from "views/bills/recouvrByOff";
import BillByOffTrendView from "views/bills/billsByOffTrend";
import PeriodSelector from "views/others/periodSelector";
import BillByOfferView from "views/bills/billsByOffer";
import BillByBillByMarketView from "views/bills/billsByBTByMkt";
import {
  getScreenType,
  getScreenTypeByMenu,
  setScreenTypeByMenu,
} from "models/utils/home/utils";
import { gconfig } from "models/utils/general/boot";

import { getPanels } from "views/bills/config/utils";
import { getMenuApp } from "models/referential/genReferentials";
export default class BillsGraphDashView extends JetView {
  constructor(app, name, tab_id) {
    super(app, name);
    this._tab_id = tab_id;
  }

  config() {
    var gridColumns,
      gridRows,
      cells = [];

    switch (getScreenType()) {
      case "mobile":
        gridColumns = 2;
        gridRows = 8;
        cells.push({
          view: "panel",
          x: 0,
          y: 0,
          dx: 2,
          dy: 3,
          resize: true,
          header: new GraphHeadView(this.app, "", "bills_fact"),
          body: {
            type: "clean",
            margin: 0,
            rows: [
              new BillByBillByMarketView(this.app, "", "b"),
              new BillByOfferView(this.app, "", "b"),
              new PeriodSelector(this.app, "", "bParOff", 2),
              new BillByOffTrendView(this.app, "", "b"),
            ],
            css: { "background-color": "#fff" },
          },
        });

        cells.push({
          view: "panel",
          x: 0,
          y: 3,
          dx: 2,
          dy: 3,
          resize: true,
          header: new GraphHeadView(this.app, "", "bills_paie"),
          body: {
            type: "clean",
            margin: 0,
            rows: [
              new BillByBillByMarketView(this.app, "", "p"),
              new BillByOfferView(this.app, "", "p"),
              new PeriodSelector(this.app, "", "pParOff", 2),
              new BillByOffTrendView(this.app, "", "p"),
            ],
          },
          css: { "background-color": "#fff" },
        });

        cells.push({
          view: "panel",
          x: 0,
          y: 6,
          dx: 2,
          dy: 2,
          resize: true,
          header: new GraphHeadView(this.app, "", "bills_recouvr"),
          body: {
            type: "clean",
            margin: 0,
            rows: [RecouvrByOfferView, RecouvrTrendView],
          },
          css: { "background-color": "#fff" },
        });
        break;

      case "mobile_rotated":
        gridColumns = 4;
        gridRows = 5;
        cells.push({
          view: "panel",
          x: 0,
          y: 0,
          dx: 2,
          dy: 3,
          resize: true,
          header: new GraphHeadView(this.app, "", "bills_fact"),
          body: {
            type: "clean",
            margin: 0,
            rows: [
              new BillByBillByMarketView(this.app, "", "b"),
              new BillByOfferView(this.app, "", "b"),
              new PeriodSelector(this.app, "", "bParOff", 2),
              new BillByOffTrendView(this.app, "", "b"),
            ],
            css: { "background-color": "#fff" },
          },
        });

        cells.push({
          view: "panel",
          x: 2,
          y: 0,
          dx: 2,
          dy: 3,
          resize: true,
          header: new GraphHeadView(this.app, "", "bills_paie"),
          body: {
            type: "clean",
            margin: 0,
            rows: [
              new BillByBillByMarketView(this.app, "", "p"),
              new BillByOfferView(this.app, "", "p"),
              new PeriodSelector(this.app, "", "pParOff", 2),
              new BillByOffTrendView(this.app, "", "p"),
            ],
          },
          css: { "background-color": "#fff" },
        });

        cells.push({
          view: "panel",
          x: 0,
          y: 3,
          dx: 4,
          dy: 2,
          resize: true,
          header: new GraphHeadView(this.app, "", "bills_recouvr"),
          body: {
            type: "clean",
            margin: 0,
            rows: [RecouvrByOfferView, RecouvrTrendView],
          },
          css: { "background-color": "#fff" },
        });
        break;

      default:
        /**
         * GET TAB ID FROM CONSTRUCT
         */
        let tab_id = this._tab_id;
        /**
         * Take all stats and properties
         */
        var menu = getMenuApp("bills");
        // console.log(menu);
        var menu_id = menu.id;
        // console.log(menu_id);

        var tab = menu.tabs.filter((e) => e.id == tab_id)[0];
        // console.log(tab);
        // console.log(tab_id);

        // console.log(getPanels(this.app, menu_id, tab));

        gridColumns = tab.grid_cols;
        gridRows = tab.grid_rows;

        // cells.push({
        //   view: "panel",
        //   x: 0,
        //   y: 0,
        //   dx: 2,
        //   dy: 3,
        //   resize: true,
        //   header: new GraphHeadView(this.app, "", "bills_fact"),
        //   body: {
        //     type: "clean",
        //     margin: 0,
        //     rows: [
        //       new BillByBillByMarketView(this.app, "", "b"),
        //       new BillByOfferView(this.app, "", "b"),
        //       new PeriodSelector(this.app, "", "bParOff", 2),
        //       new BillByOffTrendView(this.app, "", "b"),
        //     ],
        //     css: { "background-color": "#fff" },
        //   },
        // });

        // cells.push({
        //   view: "panel",
        //   x: 2,
        //   y: 0,
        //   dx: 2,
        //   dy: 3,
        //   resize: true,
        //   header: new GraphHeadView(this.app, "", "bills_paie"),
        //   body: {
        //     type: "clean",
        //     margin: 0,
        //     rows: [
        //       new BillByBillByMarketView(this.app, "", "p"),
        //       new BillByOfferView(this.app, "", "p"),
        //       new PeriodSelector(this.app, "", "pParOff", 2),
        //       new BillByOffTrendView(this.app, "", "p"),
        //     ],
        //   },
        //   css: { "background-color": "#fff" },
        // });

        // cells.push({
        //   view: "panel",
        //   x: 4,
        //   y: 0,
        //   dx: 2,
        //   dy: 3,
        //   resize: true,
        //   header: new GraphHeadView(this.app, "", "bills_recouvr"),
        //   body: {
        //     type: "clean",
        //     margin: 0,
        //     rows: [RecouvrByOfferView, RecouvrTrendView],
        //   },
        //   css: { "background-color": "#fff" },
        // });

        break;
    }
    var config = {
      view:
        getScreenType() != "mobile" && getScreenType() != "mobile_rotated"
          ? "c-dashboard"
          : "m-dashboard",
      gridColumns: gridColumns,
      gridRows: gridRows,
      margin: 5,
      padding: 5,
      cells: getPanels(this.app, menu_id, tab),
      // cells: cells,
      css: { "background-color": "#EBEDF0" },
    };
    if (getScreenType() == "mobile") config["minHeight"] = 1700;
    if (getScreenType() == "mobile_rotated") config["minHeight"] = 1000;
    return {
      view: "scrollview",
      scroll: "y",
      body: config,
    };
  }

  init() {
    var obj = this;
    setScreenTypeByMenu("bills", getScreenType());
    gconfig["dashboards"]["bills"] = obj;
    webix.event(window, "resize", function () {
      if ($$("top:menu").getSelectedId() == "bills") {
        if (getScreenTypeByMenu("bills") != getScreenType()) {
          setScreenTypeByMenu("bills", getScreenType());
          if (gconfig["dashboards"]["bills"]._container != null)
            gconfig["dashboards"]["bills"].refresh();
        }
      }
    });
  }
}
