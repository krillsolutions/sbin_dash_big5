/* eslint-disable no-empty */
import { JetView } from "webix-jet";
// import { kpi_field } from "models/referential/genReferentials";

export default class NotAuthDashView extends JetView {
  config() {
    return {
      // view: "echarts-grid-dataset",
      disabled: true,
    };
  }
}
