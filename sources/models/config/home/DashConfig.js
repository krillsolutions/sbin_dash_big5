import ParcByProdView from "views/newHome/parcByProd";
import HomeParcNewTrendView from "views/newHome/parcTrendView";
import PayByTypeTrendView from "views/newHome/payByTypeTrend";
import RevByTypeTrendViewNew from "views/newHome/revenueByTypeTrend_new";
import HomeTopupNewTrendView from "views/newHome/topupTrendView";
import HomearpuNewTrendView from "views/newHome/ArpuTrendView";
import HomeTraffTrendView from "views/newHome/trafficByTypeTrend";

// console.log(ParcByProdView);
export const dashComponentsHome = {
  parcProd: ParcByProdView,
  parcHome: HomeParcNewTrendView,
  arpuHome: HomearpuNewTrendView,
  revByType: RevByTypeTrendViewNew,
  traff_per: HomeTraffTrendView,
  topupHome: HomeTopupNewTrendView,
  payByType: PayByTypeTrendView,
};
