/* eslint-disable no-mixed-spaces-and-tabs */
import { JetView } from "webix-jet";
import BillsGraphDashView from "views/bills/graphDash";
//import TraficByTypeGraphDashViewVoix from "views/traffic/trafficByTypeVoice";
//import TraficByTypeGraphDashViewSMS from "views/traffic/trafficByTypeSMS";
import BillsDetGraphDashView from "views/bills/billsDetDash";
//import RecouvDetDash from "./recouvrementDetDash";
import { getTabDash } from "views/bills/config/utils";
import { getMenuApp } from "models/referential/genReferentials";
import { applyAuthorizations } from "models/referential/configDash";
import RecouvDetDash from "./recouvrementDetDash";

export default class BillTabView extends JetView {
  config() {
    var cells = [];
    /**
     * Take all stats and properties
     */
    var menu = getMenuApp("bills");

    // var menu_id = menu.id;
    var tabs = menu.tabs;
    // console.log(menu.tabs);
    // console.log(getTabs(this.app, menu.tabs));

    tabs.forEach((tab) => {
      // let authorized = applyAuthorizations(menu_id, "tabs", tab.id);
      // console.log(tab.id);
      // if (authorized.length > 0) {
      cells.push({
        id: tab.id,
        header: tab.title_id,
        body: getTabDash(this.app, tab.id),
      });
      // }
    });

    // cells.push({
    //   id: "tab:recouvre",
    //   header: "Recouvrement",
    //   body: RecouvDetDash,
    // });

    // console.log(cells);

    // var cells = [];
    // /**
    //  * Take all stats and properties
    //  */
    // var menu = all_apps
    //   .filter((e) => e.id == app_id)[0]
    //   .menus.filter((e) => e.id == "bills")[0];

    // // var menu_id = menu.id;

    // var tabs = menu.tabs;
    // // console.log(menu.tabs);
    // // console.log(getTabs(this.app, menu.tabs));

    // tabs.forEach((tab) => {
    //   cells.push({
    //     id: tab.id,
    //     header: tab.title_id,
    //     body: getTabDash(this.app, tab.id),
    //   });
    // });

    // console.log(cells);

    return {
      view: "tabview",
      id: "bill:tab",
      animate: false,
      cells: cells,
      // cells: [
      //   { id: "tab:resume", header: "Global", body: BillsGraphDashView },
      //   { id: "tab:details", header: "Detail", body: BillsDetGraphDashView },
      //{id : 'tab:recouvre', header : 'Recouvrement', body : RecouvDetDash}
      // ],
    };
  }

  init() {}
}
