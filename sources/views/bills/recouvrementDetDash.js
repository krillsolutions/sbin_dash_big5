import { JetView } from "webix-jet";
//import { getDates, getMonthsFromDate } from "../../models/utils/general/utils";
import GraphHeadView from "../home/graphHeaders";
import RecouvGridView from "./recouvGridView";
import RecouvCaroussView from "./recouvCarouss";
//import RecouvreDetView from "./recouvrementDet";
import { getPanels } from "views/bills/config/utils";
import { getMenuApp } from "models/referential/genReferentials";
import { applyAuthorizations } from "models/referential/configDash";

export default class RecouvDetDash extends JetView {
  constructor(app, name, tab_id) {
    super(app, name);
    this._tab_id = tab_id;
  }

  config() {
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
    console.log(tab);
    // console.log(tab_id);

    let grid_cols = fact_type.length * 2,
      grid_rows = 2,
      cells = [];
    let authorized = applyAuthorizations(menu_id, "tabs", tab.id);
    let authrz_panel = authorized.map((e) => e.split(".")[0]);
    tab.panels.forEach((e) => {
      // console.log("authorized: " + (authrz_panel.indexOf(e.id) != -1));

      cells.push({
        view: "panel",
        header: new GraphHeadView(this.app, "", e.id),
        disabled: !(authrz_panel.indexOf(e.id) != -1),
        x: e.x,
        y: e.y,
        dx: e.dx,
        dy: e.dy,
        body: {
          view: "scrollview",
          scroll: "y",
          body:
            authrz_panel.indexOf(e.id) != -1
              ? new RecouvCaroussView(this.app, "", e.name)
              : [] /* new RecouvGridView(this.app, "", f.name)*/,
        },
      });
    });

    // fact_type.forEach((f, i) => {
    //   console.log(f.name);
    //   cells.push({
    //     view: "panel",
    //     header: new GraphHeadView(this.app, "", "recouv_split_fact_" + f.id),
    //     x: 2 * i,
    //     y: 0,
    //     dx: 2,
    //     dy: 2,
    //     body: {
    //       view: "scrollview",
    //       scroll: "y",
    //       body: new RecouvCaroussView(
    //         this.app,
    //         "",
    //         f.name
    //       ) /* new RecouvGridView(this.app, "", f.name)*/,
    //     },
    //   });
    // });
    return {
      view: "c-dashboard",
      gridColumns: grid_cols,
      gridRows: grid_rows,
      cells: cells,
    };
  }

  init(view) {}
}
