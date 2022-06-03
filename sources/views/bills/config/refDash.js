import { dashComponentsBill } from "views/bills/config/DashConfig";

import BLStatView from "views/bills/billsStats";

// import TraficDataGraphDashView from "views/traffic/DataTrafficDash";
// import TraficByTypeGraphDashView from "views/traffic/TrafficDash";
// console.log("good");
export function getComponent(app, comp_id, type) {
  // return type == "dash"
  //   ? dashComponentsBill(app)[comp_id]
  //   : new BLStatView(app, "", comp_id);
  if (type == "dash") {
    // console.log("dash works");
    return dashComponentsBill(app)[comp_id];
  } else {
    // console.log("stats works");
    return new BLStatView(app, "", comp_id);
  }
}

// export function getComponentTraffic(app, tab_id, kpi, data) {
//   return tab_id == "tab:data"
//     ? TraficDataGraphDashView
//     : new TraficByTypeGraphDashView(app, "", kpi, data, tab_id);
// }
