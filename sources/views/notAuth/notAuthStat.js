/* eslint-disable no-empty */
import { JetView } from "webix-jet";
import { kpi_field } from "models/referential/genReferentials";

export default class NotAuthStatView extends JetView {
  constructor(app, name, kpi) {
    super(app, name);
    this._kpi = kpi;
  }

  config() {
    let kp = this._kpi;
    var rowstat = {
      view: "stats-card",
      disabled: true,
      css: "margin-zero",
      id: "home:stat:" + kp,
      _type: kp,
      content: {
        header: kpi_field[kp].label,
      },
    };

    return rowstat;
  }
}
