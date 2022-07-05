/* eslint-disable no-empty */
import { JetView } from "webix-jet";
import { kpi_field } from "models/referential/genReferentials";

export default class NotAuthStatView extends JetView {
  constructor(app, name, menu_id, kpi) {
    super(app, name);
    this._kpi = kpi;
    this._menu_id = menu_id;
  }

  config() {
    let kp = this._kpi;
    let menu_id = this._menu_id;

    let my_header = "";
    // console.log(menu_id);
    // console.log(kpi_field);
    // console.log(kp);
    switch (menu_id) {
      case "home":
        my_header = kpi_field[kp].label;
        break;

      case "parc":
        my_header = kpi_field["parc_" + kp].label;
        break;

      case "revenue":
        my_header = kpi_field["rev_" + kp].label;
        break;

      case "recharge":
        my_header = kpi_field["rec_" + kp].label;
        break;

      case "traffic":
        my_header = kpi_field["traffic_" + kp].label;
        break;

      case "bills":
        my_header = kpi_field["bill_" + kp].label;

      case "monitor":
        my_header = kpi_field["mon_" + kp].label;
        break;
    }

    var rowstat = {
      view: "stats-card",
      disabled: true,
      css: "margin-zero",
      id: "home:stat:" + kp,
      _type: kp,
      content: {
        header: my_header,
      },
    };

    return rowstat;
  }
}
