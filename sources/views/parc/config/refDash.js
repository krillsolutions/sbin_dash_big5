import { dashComponentsParc } from "views/parc/config/DashConfig";

import ParcStatView from "views/parc/vignetteView";

export function getComponent(app, comp_id, type) {
  return type == "dash"
    ? dashComponentsParc[comp_id]
    : new ParcStatView(app, "", comp_id);
}
