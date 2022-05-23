import { dashComponentsHome } from "models/config/home/DashConfig";
import HomeStatView from "views/newHome/vignetteView";

export function getComponent(app, menu_id, comp_id, type) {
  switch (menu_id) {
    case "home":
      return type == "dash"
        ? dashComponentsHome[comp_id]
        : new HomeStatView(app, "", comp_id);
      break;
  }
}
