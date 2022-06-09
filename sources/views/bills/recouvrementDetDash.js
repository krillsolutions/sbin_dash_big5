import { JetView } from "webix-jet";
//import { getDates, getMonthsFromDate } from "../../models/utils/general/utils";
import GraphHeadView from "../home/graphHeaders";
import RecouvGridView from "./recouvGridView";
//import RecouvreDetView from "./recouvrementDet";
import { getPanels } from "views/bills/config/utils";
import { getMenuApp } from "models/referential/genReferentials";

export default class RecouvDetDash extends JetView {
  constructor(app, name, tab_id) {
    super(app, name);
    this._tab_id = tab_id;
  }
  config() {
    let cells = [];

    //  GET TAB ID FROM CONSTRUCT
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

    let grid_cols = tab.grid_cols,
      grid_rows = tab.grid_rows;

    // fact_type.forEach((f, i) => {
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
    //       body: new RecouvGridView(this.app, "", f.name),
    //     },
    //   });
    // });

    // console.log(cells);
    return {
      view: "c-dashboard",
      gridColumns: grid_cols,
      gridRows: grid_rows,
      cells: getPanels(this.app, menu_id, tab),
      // cells: cells,
    };
  }

  init(view) {}
}
