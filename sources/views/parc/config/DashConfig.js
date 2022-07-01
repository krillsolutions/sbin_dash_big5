import BillMarketParc from "views/parc/parcByBillByMark";
import ParcByTypeView from "views/parc/parcByType";
import ParcProdTypeView from "views/parc/parcByProdView";
import ParcByTypeTrendView from "views/parc/parcTypeTrend_new";
import ParcStatusNetView from "views/parc/parcByStatusNet";
import ParcNetAddView from "views/parc/netAddView";

export const dashComponentsParc = {
  bill_market_parc: BillMarketParc,
  parc_by_type: ParcByTypeView,
  parc_prod_type: ParcProdTypeView,
  parcByType_prod: ParcByTypeTrendView,
  parc_status_net: ParcStatusNetView,
  parc_net_add: ParcNetAddView,
};
