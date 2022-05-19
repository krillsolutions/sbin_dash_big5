import { JetView } from "webix-jet";
//import HomeLineView from "views/home/lineCharts";
//import HomeParcView from 'views/home/parcView_new';
import ParcByProdView from "views/newHome/parcByProd";
import HomeParcNewTrendView from "views/newHome/parcTrendView";
import PayByTypeTrendView from "views/newHome/payByTypeTrend";
import RevByTypeTrendViewNew from "views/newHome/revenueByTypeTrend_new";
import PeriodSelector from "views/others/periodSelector";
import HomeTopupNewTrendView from "views/newHome/topupTrendView";
import HomearpuNewTrendView from "views/newHome/ArpuTrendView";
import GraphHeadView from "views/home/graphHeaders";
import HomeTraffTrendView from "views/newHome/trafficByTypeTrend";
import {
  getScreenType,
  getScreenTypeByMenu,
  setScreenTypeByMenu,
  getLabel,
} from "models/utils/home/utils";
//import {/*HomeBndleNewTrendView*/} from "views/newHome/bundleTrendView";
import { gconfig } from "models/utils/general/boot";
import notAuthDash from "views/notAuth/NotAuthDash";
import { applyAuthorizations } from "models/referential/configDash";
export default class GraphDashView extends JetView {
  config() {
    let authorized = applyAuthorizations(1, 1, "dash");

    console.log(authorized);

    var gridColumns,
      gridRows,
      cells = [];
    var config = {
      view:
        getScreenType() != "mobile" && getScreenType() != "mobile_rotated"
          ? "c-dashboard"
          : "m-dashboard",
      id: "home:dash",
      margin: 5,
      padding: 5,
      css: { "background-color": "#EBEDF0" },
    };

    switch (getScreenType()) {
      case "mobile":
        gridColumns = 2;
        gridRows = 30;
        cells.push({
          view: "panel",
          x: 0,
          y: 0,
          dx: 2,
          dy: 6,
          resize: true,
          header: new GraphHeadView(this.app, "", "parc", "homelines"),
          body: {
            type: "clean",
            margin: 0,
            rows: [
              ParcByProdView,
              {
                type: "clean",
                margin: 0,
                rows: [
                  /*{template : "Parc actif",type : "header", width : 30, css: {"font-size" : "12px", "font-weight": "bold"} },*/ new PeriodSelector(
                    this.app,
                    "",
                    "parcHome",
                    2
                  ),
                  HomeParcNewTrendView,
                ],
              },
            ],
          },
          css: { "background-color": "#fff" },
        });

        cells.push({
          view: "panel",
          x: 0,
          y: 6,
          dx: 2,
          dy: 4,
          resize: true,
          header: new GraphHeadView(this.app, "", "arpu", "homelines"),
          body: {
            type: "clean",
            margin: 0,
            rows: [
              { height: 10 },
              new PeriodSelector(this.app, "", "arpuHome", 2),
              HomearpuNewTrendView,
            ],
          },
          css: { "background-color": "#fff" },
        });

        cells.push({
          view: "panel",
          x: 0,
          y: 10,
          dx: 2,
          dy: 5,
          resize: true,
          header: new GraphHeadView(this.app, "", "rev", "homelines"),
          body: {
            type: "clean",
            margin: 0,
            rows: [
              { height: 10 },
              new PeriodSelector(this.app, "", "revByType", 3),
              RevByTypeTrendViewNew,
            ],
          },
          css: { "background-color": "#fff" },
        });

        cells.push({
          view: "panel",
          x: 0,
          y: 15,
          dx: 2,
          dy: 5,
          resize: true,
          header: new GraphHeadView(this.app, "", "traffics", "homelines"),
          body: {
            type: "clean",
            margin: 0,
            rows: [
              { height: 10 },
              new PeriodSelector(this.app, "", "traff_per", 3),
              HomeTraffTrendView,
            ],
          },
          css: { "background-color": "#fff" },
        });

        cells.push({
          view: "panel",
          x: 0,
          y: 20,
          dx: 2,
          dy: 5,
          resize: true,
          header: new GraphHeadView(this.app, "", "mnt_recharge", "homelines"),
          body: {
            type: "clean",
            margin: 0,
            rows: [
              { height: 10 },
              new PeriodSelector(this.app, "", "topupHome", 2),
              HomeTopupNewTrendView,
            ],
          },
          css: { "background-color": "#fff" },
        });

        cells.push({
          view: "panel",
          x: 0,
          y: 25,
          dx: 2,
          dy: 5,
          resize: true,
          header: new GraphHeadView(this.app, "", "mnt_encaiss", "homelines"),
          body: {
            type: "clean",
            margin: 0,
            rows: [
              { height: 10 },
              new PeriodSelector(this.app, "", "payByType", 2),
              PayByTypeTrendView,
            ],
          },
          css: { "background-color": "#fff" },
        });

        config["minHeight"] = 1900;
        break;

      case "mobile_rotated":
        gridColumns = 4;
        gridRows = 6;
        cells.push({
          view: "panel",
          x: 0,
          y: 0,
          dx: 2,
          dy: 2,
          resize: true,
          header: new GraphHeadView(this.app, "", "parc", "homelines"),
          body: {
            type: "clean",
            margin: 0,
            rows: [
              ParcByProdView,
              {
                type: "clean",
                margin: 0,
                rows: [
                  /*{template : "Parc actif",type : "header", width : 30, css: {"font-size" : "12px", "font-weight": "bold"} },*/ new PeriodSelector(
                    this.app,
                    "",
                    "parcHome",
                    2
                  ),
                  HomeParcNewTrendView,
                ],
              },
            ],
          },
          css: { "background-color": "#fff" },
        });

        cells.push({
          view: "panel",
          x: 2,
          y: 0,
          dx: 2,
          dy: 2,
          resize: true,
          header: new GraphHeadView(this.app, "", "arpu", "homelines"),
          body: {
            type: "clean",
            margin: 0,
            rows: [
              { height: 10 },
              new PeriodSelector(this.app, "", "arpuHome", 2),
              HomearpuNewTrendView,
            ],
          },
          css: { "background-color": "#fff" },
        });

        cells.push({
          view: "panel",
          x: 0,
          y: 2,
          dx: 2,
          dy: 2,
          resize: true,
          header: new GraphHeadView(this.app, "", "rev", "homelines"),
          body: {
            type: "clean",
            margin: 0,
            rows: [
              { height: 10 },
              new PeriodSelector(this.app, "", "revByType", 3),
              RevByTypeTrendViewNew,
            ],
          },
          css: { "background-color": "#fff" },
        });

        cells.push({
          view: "panel",
          x: 2,
          y: 2,
          dx: 2,
          dy: 2,
          resize: true,
          header: new GraphHeadView(this.app, "", "traffics", "homelines"),
          body: {
            type: "clean",
            margin: 0,
            rows: [
              { height: 10 },
              new PeriodSelector(this.app, "", "traff_per", 3),
              HomeTraffTrendView,
            ],
          },
          css: { "background-color": "#fff" },
        });

        cells.push({
          view: "panel",
          x: 0,
          y: 4,
          dx: 2,
          dy: 2,
          resize: true,
          header: new GraphHeadView(this.app, "", "mnt_recharge", "homelines"),
          body: {
            type: "clean",
            margin: 0,
            rows: [
              { height: 10 },
              new PeriodSelector(this.app, "", "topupHome", 2),
              HomeTopupNewTrendView,
            ],
          },
          css: { "background-color": "#fff" },
        });

        cells.push({
          view: "panel",
          x: 2,
          y: 4,
          dx: 2,
          dy: 2,
          resize: true,
          header: new GraphHeadView(this.app, "", "mnt_encaiss", "homelines"),
          body: {
            type: "clean",
            margin: 0,
            rows: [
              { height: 10 },
              new PeriodSelector(this.app, "", "payByType", 2),
              PayByTypeTrendView,
            ],
          },
          css: { "background-color": "#fff" },
        });

        config["minHeight"] = 850;
        break;

      default:
        gridColumns = 6;
        gridRows = 10;

        cells.push({
          view: "panel",
          x: 0,
          y: 0,
          dx: 2,
          dy: 6,
          resize: true,
          header: new GraphHeadView(this.app, "", "parc", "homelines"),
          // disabled: authorized.indexOf("parc_par_produit") != -1,
          body: {
            type: "clean",
            margin: 0,
            rows: [
              authorized.indexOf("parc_par_produit") != -1
                ? ParcByProdView
                : notAuthDash,
              authorized.indexOf("parc_dash") != -1
                ? {
                    type: "clean",
                    margin: 0,
                    rows: [
                      /*{template : "Parc actif",type : "header", height : 30, css: {"font-size" : "12px", "font-weight": "bold"} },*/ new PeriodSelector(
                        this.app,
                        "",
                        "parcHome",
                        2
                      ),
                      HomeParcNewTrendView,
                    ],
                  }
                : notAuthDash,
            ],
          },
          css: { "background-color": "#fff" },
        });

        cells.push({
          view: "panel",
          x: 0,
          y: 6,
          dx: 2,
          dy: 4,
          resize: true,
          header: new GraphHeadView(this.app, "", "arpu", "homelines"),
          // disabled: !authorized[1].authorized,
          body: {
            type: "clean",
            margin: 0,
            rows:
              authorized.indexOf("arpu_dash") != -1
                ? [
                    { height: 10 },
                    new PeriodSelector(this.app, "", "arpuHome", 2),
                    HomearpuNewTrendView,
                  ]
                : [notAuthDash],
          },
          css: { "background-color": "#fff" },
        });

        cells.push({
          view: "panel",
          x: 2,
          y: 0,
          dx: 2,
          dy: 5,
          resize: true,
          header: new GraphHeadView(this.app, "", "rev", "homelines"),
          // disabled: !authorized[2].authorized,
          body: {
            type: "clean",
            margin: 0,
            rows:
              authorized.indexOf("revenu_dash") != -1
                ? [
                    { height: 10 },
                    new PeriodSelector(this.app, "", "revByType", 3),
                    RevByTypeTrendViewNew,
                  ]
                : [notAuthDash],
          },
          css: { "background-color": "#fff" },
        });

        cells.push({
          view: "panel",
          x: 2,
          y: 5,
          dx: 2,
          dy: 5,
          resize: true,
          header: new GraphHeadView(this.app, "", "traffics", "homelines"),
          // disabled: !authorized[3].authorized,
          body: {
            type: "clean",
            margin: 0,
            rows:
              authorized.indexOf("trafic_dash") != -1
                ? [
                    { height: 10 },
                    new PeriodSelector(this.app, "", "traff_per", 3),
                    HomeTraffTrendView,
                  ]
                : [notAuthDash],
          },
          css: { "background-color": "#fff" },
        });

        cells.push({
          view: "panel",
          x: 4,
          y: 0,
          dx: 2,
          dy: 5,
          resize: true,
          header: new GraphHeadView(this.app, "", "mnt_recharge", "homelines"),
          // disabled: !true,
          body: {
            type: "clean",
            margin: 0,
            rows:
              authorized.indexOf("recharge_dash") != -1
                ? [
                    { height: 10 },
                    new PeriodSelector(this.app, "", "topupHome", 2),
                    HomeTopupNewTrendView,
                  ]
                : [notAuthDash],
          },
          css: { "background-color": "#fff" },
        });

        cells.push({
          view: "panel",
          x: 4,
          y: 5,
          dx: 2,
          dy: 5,
          resize: true,
          header: new GraphHeadView(this.app, "", "mnt_encaiss", "homelines"),
          // disabled: !authorized[5].authorized,
          body: {
            type: "clean",
            margin: 0,
            rows:
              authorized.indexOf("encaissement_dash") != -1
                ? [
                    { height: 10 },
                    new PeriodSelector(this.app, "", "payByType", 2),
                    PayByTypeTrendView,
                  ]
                : [notAuthDash],
          },
          css: { "background-color": "#fff" },
        });

        break;
    }
    config["cells"] = cells;
    config["gridColumns"] = gridColumns;
    config["gridRows"] = gridRows;
    return {
      //	id : "homedscrl",
      view: "scrollview",
      scroll: "y",
      body: config,
    };
  }

  init(view) {
    var obj = this;
    setScreenTypeByMenu("home", getScreenType());
    gconfig["dashboards"]["home"] = obj;
    webix.event(window, "resize", function () {
      if ($$("top:menu").getSelectedId() == "home") {
        if (getScreenTypeByMenu("home") != getScreenType()) {
          setScreenTypeByMenu("home", getScreenType());
          if (gconfig["dashboards"]["home"]._container != null)
            gconfig["dashboards"]["home"].refresh();
        }
      }
    });
  }
}
