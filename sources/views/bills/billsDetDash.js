import { JetView } from "webix-jet";
import GraphHeadView from "views/home/graphHeaders";
//import RecouvrTrendView from "views/bills/recouvrementView";
import PayMethView from "views/bills/payByMeth";
import BillByZoneView from "views/bills/billByZone";
import AgentTabView from "views/bills/agentTab";
import BillByAggByItem from "views/bills/billByAgView";
import BillSplitView from "views/bills/billSplitView";
import {
  getScreenType,
  getScreenTypeByMenu,
  setScreenTypeByMenu,
} from "models/utils/home/utils";
import { gconfig } from "models/utils/general/boot";

import { getPanels } from "views/bills/config/utils";
import { getMenuApp } from "models/referential/genReferentials";
export default class BillsDetGraphDashView extends JetView {
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
        gridRows = 5;
        cells.push({
          view: "panel",
          x: 0,
          y: 0,
          dx: 2,
          dy: 2,
          resize: true,
          header: new GraphHeadView(this.app, "", "bills_pay_split"),
          body: {
            type: "clean",
            margin: 0,
            rows: [
              { template: "Factures", align: "center", type: "header" },
              {
                type: "clean",
                margin: 0,
                cols: [
                  new BillSplitView(this.app, "", "bill", "type"),
                  new BillSplitView(this.app, "", "bill", "status"),
                ],
              },
              { template: "Encaissement", align: "center", type: "header" },
              {
                type: "clean",
                margin: 0,
                cols: [
                  new BillSplitView(this.app, "", "pay", "type"),
                  new BillSplitView(this.app, "", "pay", "status"),
                ],
              },
            ],
            css: { "background-color": "#fff" },
          },
        });

        cells.push({
          view: "panel",
          x: 0,
          y: 2,
          dx: 2,
          dy: 1,
          resize: true,
          header: new GraphHeadView(this.app, "", "bills_others"),
          body: {
            type: "clean",
            margin: 0,
            cols: [BillByAggByItem, BillByZoneView],
          },
          css: { "background-color": "#fff" },
        });

        cells.push({
          view: "panel",
          x: 0,
          y: 3,
          dx: 2,
          dy: 2,
          header: new GraphHeadView(this.app, "", "pay_others"),
          body: {
            type: "clean",
            margin: 0,
            rows: [
              { template: "Encaissement par agent", type: "header" },
              AgentTabView,
              PayMethView,
            ],
          },
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
          header: new GraphHeadView(this.app, "", "bills_pay_split"),
          body: {
            type: "clean",
            margin: 0,
            rows: [
              { template: "Factures", align: "center", type: "header" },
              {
                type: "clean",
                margin: 0,
                cols: [
                  new BillSplitView(this.app, "", "bill", "type"),
                  new BillSplitView(this.app, "", "bill", "status"),
                ],
              },
              { template: "Encaissement", align: "center", type: "header" },
              {
                type: "clean",
                margin: 0,
                cols: [
                  new BillSplitView(this.app, "", "pay", "type"),
                  new BillSplitView(this.app, "", "pay", "status"),
                ],
              },
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
          header: new GraphHeadView(this.app, "", "pay_others"),
          body: {
            type: "clean",
            margin: 0,
            rows: [
              { template: "Encaissement par agent", type: "header" },
              AgentTabView,
              PayMethView,
            ],
          },
        });

        cells.push({
          view: "panel",
          x: 0,
          y: 3,
          dx: 4,
          dy: 2,
          resize: true,
          header: new GraphHeadView(this.app, "", "bills_others"),
          body: {
            type: "clean",
            margin: 0,
            cols: [BillByAggByItem, BillByZoneView],
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

        gridColumns = 7;
        gridRows = 4;

        // cells.push({
        //   view: "panel",
        //   x: 0,
        //   y: 0,
        //   dx: 2,
        //   dy: 4,
        //   resize: true,
        //   header: new GraphHeadView(this.app, "", "bills_pay_split"),
        //   body: {
        //     type: "clean",
        //     margin: 0,
        //     rows: [
        //       { template: "Factures", align: "center", type: "header" },
        //       {
        //         type: "clean",
        //         margin: 0,
        //         cols: [
        //           new BillSplitView(this.app, "", "bill", "type"),
        //           new BillSplitView(this.app, "", "bill", "status"),
        //         ],
        //       },
        //       { template: "Encaissement", align: "center", type: "header" },
        //       {
        //         type: "clean",
        //         margin: 0,
        //         cols: [
        //           new BillSplitView(this.app, "", "pay", "type"),
        //           new BillSplitView(this.app, "", "pay", "status"),
        //         ],
        //       },
        //     ],
        //     css: { "background-color": "#fff" },
        //   },
        // });

        // cells.push({
        //   view: "panel",
        //   x: 2,
        //   y: 0,
        //   dx: 3,
        //   dy: 4,
        //   resize: true,
        //   header: new GraphHeadView(this.app, "", "bills_others"),
        //   body: {
        //     type: "clean",
        //     margin: 0,
        //     cols: [BillByAggByItem, BillByZoneView],
        //   },
        //   css: { "background-color": "#fff" },
        // });

        // cells.push({
        //   view: "panel",
        //   x: 5,
        //   y: 0,
        //   dx: 2,
        //   dy: 4,
        //   header: new GraphHeadView(this.app, "", "pay_others"),
        //   body: {
        //     type: "clean",
        //     margin: 0,
        //     rows: [
        //       { template: "Encaissement par agent", type: "header" },
        //       AgentTabView,
        //       PayMethView,
        //     ],
        //   },
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
    if (getScreenType() == "mobile") config["minHeight"] = 1500;
    if (getScreenType() == "mobile_rotated") config["minHeight"] = 900;
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
