import { dashComponentsRevenue } from "views/revenue/config/DashConfig";

import RevStatView from "views/revenue/vignetteView";

export function getComponent(app, comp_id, type) {
  return type == "dash"
    ? dashComponentsRevenue[comp_id]
    : new RevStatView(app, "", comp_id);
}
