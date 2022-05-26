import { dashComponentsRecharge } from "views/recharge/config/DashConfig";

import RecStatView from "views/recharge/rechargeTypeStat";
import RecTotStatView from "views/recharge/rechargeMontantStat";

export function getComponent(app, comp_id, type) {
  return type == "dash"
    ? dashComponentsRecharge[comp_id]
    : comp_id == "rectot"
    ? RecTotStatView
    : new RecStatView(app, "", comp_id);
}
