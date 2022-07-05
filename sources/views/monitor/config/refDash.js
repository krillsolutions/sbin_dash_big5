import { dashComponentsMonitor } from "views/monitor/config/DashConfig";

import MonStatView from "views/monitor/monStat";

export function getComponent(app, comp_id, type) {
  return type == "dash"
    ? dashComponentsMonitor[comp_id]
    : new MonStatView(app, "", comp_id);
}
