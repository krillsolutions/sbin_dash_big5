import { dashComponentsTraffic } from "views/traffic/config/DashConfig";

import TraffStatView from "views/traffic/vignetteView";

// import TraficDataGraphDashView from "views/traffic/DataTrafficDash";
// import TraficByTypeGraphDashView from "views/traffic/TrafficDash";

export function getComponent(app, comp_id, type, kpi) {
  return type == "dash"
    ? dashComponentsTraffic(app, kpi)[comp_id]
    : new TraffStatView(app, "", comp_id);
}

// export function getComponentTraffic(app, tab_id, kpi, data) {
//   return tab_id == "tab:data"
//     ? TraficDataGraphDashView
//     : new TraficByTypeGraphDashView(app, "", kpi, data, tab_id);
// }
