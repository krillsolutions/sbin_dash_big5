/* eslint-disable no-mixed-spaces-and-tabs */
import { JetView } from "webix-jet";
import { getTitle } from "models/utils/home/utils";
import { getTabDash } from "views/traffic/config/utils";
import TraficByTypeGraphDashView from "views/traffic/TrafficDash";
//import TraficByTypeGraphDashViewVoix from "views/traffic/trafficByTypeVoice";
//import TraficByTypeGraphDashViewSMS from "views/traffic/trafficByTypeSMS";
import TraficDataGraphDashView from "views/traffic/DataTrafficDash";

// import { getTabs } from "views/traffic/config/utils";
import { getMenuApp } from "models/referential/genReferentials";
import { applyAuthorizations } from "models/referential/configDash";

export default class TraffTabView extends JetView {
  config() {
    var cells = [];
    /**
     * Take all stats and properties
     */
    var menu = getMenuApp("traffic");

    var menu_id = menu.id;

    var tabs = menu.tabs;
    // console.log(menu.tabs);
    // console.log(getTabs(this.app, menu.tabs));

    tabs.forEach((tab) => {
      let authorized = applyAuthorizations(menu_id, "tabs", tab.id);
      // console.log(authorized);
      if (authorized.length > 0) {
        cells.push({
          id: tab.id,
          header: getTitle(tab.title_id),
          body: getTabDash(this.app, tab.id),
        });
      }
    });

    // console.log(cells);

    return {
      view: "tabview",
      id: "traffic:tab",
      animate: false,
      cells: cells,
      //   cells: getTabs(this.app, menu.tabs),
      // cells: [
      //   {
      //     id: "tab:voix",
      //     header: getTitle("traffic_voix_tab"),
      //     body: new TraficByTypeGraphDashView(
      //       this.app,
      //       "",
      //       "voice",
      //       "trafficvoix"
      //       // "tab:voix"
      //     ),
      //   },

      //   {
      //     id: "tab:sms",
      //     header: getTitle("traffic_sms_tab"),
      //     body: new TraficByTypeGraphDashView(
      //       this.app,
      //       "",
      //       "sms",
      //       "trafficsms"
      //       // "tab:sms"
      //     ),
      //   },
      //   {
      //     id: "tab:data",
      //     header: getTitle("traffic_data_tab"),
      //     body: TraficDataGraphDashView,
      //     //   body: new TraficDataGraphDashView(this.app, "", "tab:data"),
      //   },
      // ],
    };
  }

  init() {}
}
