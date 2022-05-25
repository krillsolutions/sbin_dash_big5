import { dashComponentsHome } from "models/config/home/DashConfig";
import { dashComponentsParc } from "models/config/parc/DashConfig";
import HomeStatView from "views/newHome/vignetteView";
import ParcStatView from "views/parc/vignetteView";

export function getComponent(app, menu_id, comp_id, type) {
  switch (menu_id) {
    case "home":
      return type == "dash"
        ? dashComponentsHome[comp_id]
        : new HomeStatView(app, "", comp_id);
      break;
    case "parc":
      return type == "dash"
        ? dashComponentsParc[comp_id]
        : new ParcStatView(app, "", comp_id);
      break;
  }
}
