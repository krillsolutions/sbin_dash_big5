import { JetView } from "webix-jet";
import TraffIntGeoView from "views/traffic/TrafficIntGeo";
import GraphHeadView from "views/home/graphHeaders";
import PeriodSelector from "views/others/periodSelector";
//import TrafficGeoView from "views/traffic/trafficGeoSplitView_new";
import TraffByTypeTrendView from "views/traffic/TrafficByTypeTrend";
import TraffByDestView from "views/traffic/TrafficByDest";
import TraffByOfferView from "views/traffic/TrafficByOffer";
import TraffByOPView from "views/traffic/TrafficByOP";
//import {geo_config} from "models/referential/genReferentials";
import TraffIntView from "views/traffic/TrafficIntSplit";
import {
  getScreenType,
  getScreenTypeByMenu,
  setScreenTypeByMenu,
} from "models/utils/home/utils";
//import {gconfig} from "models/utils/general/boot";

import { getPanels } from "views/traffic/config/utils";
import { getMenuApp } from "models/referential/genReferentials";

export default class TraficByTypeGraphDashView extends JetView {
  constructor(app, name, kpi, data, tab_id) {
    super(app, name);

    this._kpi = kpi;
    this._feeddata = data;
    this._tab_id = tab_id;
  }

  config() {
    const kpi = this._kpi,
      data = this._data;
    var gridColumns,
      gridRows,
      cells = [];

    var config = {
      view:
        getScreenType() != "mobile" && getScreenType() != "mobile_rotated"
          ? "c-dashboard"
          : "m-dashboard",
      id: "traffic:dash:" + kpi,
      margin: 5,
      padding: 5,
      cells: cells,
      css: { "background-color": "#EBEDF0" },
    };
    switch (getScreenType()) {
      /*                 case 'mobile' :
                                        gridColumns = 2;
                                        gridRows = 11;
					cells.push({ view:"panel", x:0, y:0, dx:2, dy:2, resize:true,header : new GraphHeadView(this.app, "", "traffic_offer_"+kpi, kpi),
                                                body : new TrafficGeoView(this.app, "",kpi),  css : { "background-color":"#fff"}});
                                        cells.push({ view:"panel", x:0, y:2, dx:2, dy:3, resize:true,header : new GraphHeadView(this.app, "", "traffic_geo_int_"+kpi, kpi),
                                                body : {type : 'clean', margin : 0, rows : [ new TraffIntView(this.app, "",kpi), new TestGeoView(this.app, "", kpi) ],
                                                },css : { "background-color":"#fff"}});
                                        cells.push({ view:"panel", x:0, y:5, dx:2, dy:3, resize:true, header : new GraphHeadView(this.app, "", "traffic_other_"+kpi, kpi),
                                                body : {type : 'clean', margin : 0, rows :[ new TraffByDestTrendView(this.app, "", kpi), new TraffByOPView(this.app, "",kpi)] },css :{ "background-color":"#fff"}})
                                        cells.push({ view:"panel", x:0, y:8, dx:2, dy:3, resize:true, header : new GraphHeadView(this.app, "", "traffic_oth_"+kpi, kpi), body :
                                {type : 'clean', margin : 0, rows : [new TraffByOfferView(this.app, "", kpi), new TraffByTypeTrendView(this.app, "", kpi)]} , css : { "background-color":"#fff"}});
                                        config['minHeight'] = 1500;
				break;

                                case 'mobile_rotated' :
                                        gridColumns = 4;
                                        gridRows = 7;

					cells.push({ view:"panel", x:0, y:0, dx:2, dy:3, resize:true,header : new GraphHeadView(this.app, "", "traffic_offer_"+kpi, kpi),
                                                body : new TrafficGeoView(this.app, "",kpi),  css : { "background-color":"#fff"}});

					cells.push({ view:"panel", x:2, y:0, dx:2, dy:3, resize:true, header : new GraphHeadView(this.app, "", "traffic_oth_"+kpi, kpi), 
						body : {type : 'clean', margin : 0, rows : [new TraffByOfferView(this.app, "", kpi), new TraffByTypeTrendView(this.app, "", kpi)]} , css : { "background-color":"#fff"}});

                                        cells.push({ view:"panel", x:0, y:3, dx:4, dy:2, resize:true,header : new GraphHeadView(this.app, "", "traffic_geo_int_"+kpi, kpi),
                                                body : {type : 'clean', margin : 0, cols : [ new TraffIntView(this.app, "",kpi), new TestGeoView(this.app, "", kpi) ],
                                                },css : { "background-color":"#fff"}});
                                        cells.push({ view:"panel", x:0, y:5, dx:4, dy:2, resize:true, header : new GraphHeadView(this.app, "", "traffic_other_"+kpi, kpi),
                                                body : {type : 'clean', margin : 0, cols :[ new TraffByDestTrendView(this.app, "", kpi), new TraffByOPView(this.app, "",kpi)] },css :{ "background-color":"#fff"}})
                                        config['minHeight'] = 750;
                                break;
					
				case 'small':
                                	gridColumns = 9;
                                	gridRows = 3;
					cells.push({ view:"panel", x:0, y:0, dx:2, dy:3, resize:true,header : new GraphHeadView(this.app, "", "traffic_offer_"+kpi, kpi),
                                                body : new TrafficGeoView(this.app, "",kpi),  css : { "background-color":"#fff"}});
					cells.push({ view:"panel", x:2, y:0, dx:3, dy:3, resize:true,header : new GraphHeadView(this.app, "", "traffic_geo_int_"+kpi, kpi),
						body : {type : 'clean', margin : 0, rows : [ new TraffIntView(this.app, "",kpi), new TestGeoView(this.app, "", kpi) ],
						},css : { "background-color":"#fff"}});
					cells.push({ view:"panel", x:5, y:0, dx:2, dy:3, resize:true, header : new GraphHeadView(this.app, "", "traffic_other_"+kpi, kpi), 
						body : {type : 'clean', margin : 0, rows :[ new TraffByDestTrendView(this.app, "", kpi), new TraffByOPView(this.app, "",kpi)] },css :{ "background-color":"#fff"}});
					cells.push({ view:"panel", x:7, y:0, dx:2, dy:3, resize:true, header : new GraphHeadView(this.app, "", "traffic_oth_"+kpi, kpi), body :
                                {type : 'clean', margin : 0, rows : [new TraffByOfferView(this.app, "", kpi), new TraffByTypeTrendView(this.app, "", kpi)]} , css : { "background-color":"#fff"}});
				break;*/

      case "mobile":
        gridColumns = 4;
        gridRows = 6;

        cells.push({
          view: "panel",
          x: 0,
          y: 0,
          dx: 4,
          dy: 2,
          resize: true,
          header: new GraphHeadView(this.app, "", "traffic_offer_" + kpi, kpi),
          body: {
            type: "clean",
            margin: 0,
            rows: [
              new TraffByOfferView(this.app, "", kpi),
              new PeriodSelector(this.app, "", "traffByType_" + kpi, 3),
              new TraffByTypeTrendView(this.app, "", kpi),
            ],
          },
          css: { "background-color": "#fff" },
        });

        cells.push({
          view: "panel",
          x: 0,
          y: 2,
          dx: 4,
          dy: 2,
          resize: true,
          header: new GraphHeadView(
            this.app,
            "",
            "traffic_geo_int_" + kpi,
            kpi
          ),
          body: {
            type: "clean",
            margin: 0,
            rows: [
              new TraffIntView(this.app, "", kpi),
              new TraffIntGeoView(this.app, "", kpi),
            ],
          },
          css: { "background-color": "#fff" },
        });

        cells.push({
          view: "panel",
          x: 0,
          y: 4,
          dx: 4,
          dy: 2,
          resize: true,
          header: new GraphHeadView(this.app, "", "traffic_other_" + kpi, kpi),
          body: {
            type: "clean",
            margin: 0,
            rows: [
              new TraffByDestView(this.app, "", kpi),
              new TraffByOPView(this.app, "", kpi),
            ],
          },
          css: { "background-color": "#fff" },
        });
        config["minHeight"] = 1900;
        break;

      case "mobile_rotated":
        gridColumns = 4;
        gridRows = 4;

        cells.push({
          view: "panel",
          x: 0,
          y: 0,
          dx: 2,
          dy: 2,
          resize: true,
          header: new GraphHeadView(this.app, "", "traffic_offer_" + kpi, kpi),
          body: {
            type: "clean",
            margin: 0,
            rows: [
              new TraffByOfferView(this.app, "", kpi),
              new PeriodSelector(this.app, "", "traffByType_" + kpi, 3),
              new TraffByTypeTrendView(this.app, "", kpi),
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
          header: new GraphHeadView(this.app, "", "traffic_other_" + kpi, kpi),
          body: {
            type: "clean",
            margin: 0,
            rows: [
              new TraffByDestView(this.app, "", kpi),
              new TraffByOPView(this.app, "", kpi),
            ],
          },
          css: { "background-color": "#fff" },
        });

        cells.push({
          view: "panel",
          x: 0,
          y: 2,
          dx: 4,
          dy: 2,
          resize: true,
          header: new GraphHeadView(
            this.app,
            "",
            "traffic_geo_int_" + kpi,
            kpi
          ),
          body: {
            type: "clean",
            margin: 0,
            cols: [
              new TraffIntView(this.app, "", kpi),
              new TraffIntGeoView(this.app, "", kpi),
            ],
          },
          css: { "background-color": "#fff" },
        });

        config["minHeight"] = 850;
        break;

      default:
        /**
         * GET TAB ID FROM CONSTRUCT
         */
        let tab_id = this._tab_id;
        /**
         * Take all stats and properties
         */
        var menu = getMenuApp("traffic");

        var menu_id = menu.id;
        // console.log(menu_id);

        var tab = menu.tabs.filter((e) => e.id == tab_id)[0];
        // console.log(tab);
        // console.log(tab_id);

        // console.log(getPanels(this.app, menu_id, tab, kpi));

        gridColumns = 9;
        gridRows = 3;
        // cells.push({
        //   view: "panel",
        //   x: 0,
        //   y: 0,
        //   dx: 3,
        //   dy: 3,
        //   resize: true,
        //   header: new GraphHeadView(this.app, "", "traffic_offer_" + kpi, kpi),
        //   body: {
        //     type: "clean",
        //     margin: 0,
        //     rows: [
        //       new TraffByOfferView(this.app, "", kpi),
        //       new PeriodSelector(this.app, "", "traffByType_" + kpi, 3),
        //       new TraffByTypeTrendView(this.app, "", kpi),
        //     ],
        //   },
        //   css: { "background-color": "#fff" },
        // });

        // cells.push({
        //   view: "panel",
        //   x: 3,
        //   y: 0,
        //   dx: 3,
        //   dy: 3,
        //   resize: true,
        //   header: new GraphHeadView(
        //     this.app,
        //     "",
        //     "traffic_geo_int_" + kpi,
        //     kpi
        //   ),
        //   body: {
        //     type: "clean",
        //     margin: 0,
        //     rows: [
        //       new TraffIntView(this.app, "", kpi),
        //       new TraffIntGeoView(this.app, "", kpi),
        //     ],
        //   },
        //   css: { "background-color": "#fff" },
        // });

        // cells.push({
        //   view: "panel",
        //   x: 6,
        //   y: 0,
        //   dx: 3,
        //   dy: 3,
        //   resize: true,
        //   header: new GraphHeadView(this.app, "", "traffic_other_" + kpi, kpi),
        //   body: {
        //     type: "clean",
        //     margin: 0,
        //     rows: [
        //       new TraffByDestView(this.app, "", kpi),
        //       new TraffByOPView(this.app, "", kpi),
        //     ],
        //   },
        //   css: { "background-color": "#fff" },
        // });

        if (getScreenType() == "standard") config["minHeight"] = 600;
        break;
    }
    config["cells"] = getPanels(this.app, menu_id, tab, kpi);
    // config["cells"] = cells;
    config["gridColumns"] = gridColumns;
    config["gridRows"] = gridRows;
    return {
      //	id : "trafficdscrl:"+kpi,
      view: "scrollview",
      scroll: "y",
      body: config,
    };
  }

  init(view) {}
}
