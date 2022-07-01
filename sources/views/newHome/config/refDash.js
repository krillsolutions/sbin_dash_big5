import { dashComponentsHome } from "views/newHome/config/DashConfig";

import HomeStatView from "views/newHome/vignetteView";

export function getComponent(app, comp_id, type) {
  return type == "dash"
    ? dashComponentsHome[comp_id]
    : new HomeStatView(app, "", comp_id);
}
