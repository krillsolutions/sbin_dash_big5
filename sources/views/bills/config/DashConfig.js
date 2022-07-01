//imports views tab 1
import BillByBillByMarketView from "views/bills/billsByBTByMkt";
import BillByOfferView from "views/bills/billsByOffer";
import BillByOffTrendView from "views/bills/billsByOffTrend";
import RecouvrByOfferView from "views/bills/recouvrByOff";
import RecouvrTrendView from "views/bills/recouvrementView";
//imports views tab 2
import BillSplitView from "views/bills/billSplitView";
import BillByAggByItem from "views/bills/billByAgView";
import BillByZoneView from "views/bills/billByZone";
import PayMethView from "views/bills/payByMeth";
import AgentTabView from "views/bills/agentTab";
//rec
import RecouvGridView from "views/bills/recouvGridView";

export function dashComponentsBill(app) {
  return {
    bill_by_bill_by_market_b: new BillByBillByMarketView(app, "", "b"),
    bill_by_offer_b: new BillByOfferView(app, "", "b"),
    bParOff: new BillByOffTrendView(app, "", "b"),
    bill_by_bill_by_market_p: new BillByBillByMarketView(app, "", "p"),
    bill_by_offer_p: new BillByOfferView(app, "", "p"),
    pParOff: new BillByOffTrendView(app, "", "p"),
    rec_by_offer: RecouvrByOfferView,
    rec_trend: RecouvrTrendView,
    facture_title: { template: "Factures", align: "center", type: "header" },
    bill_split_bill: {
      type: "clean",
      margin: 0,
      cols: [
        new BillSplitView(app, "", "bill", "type"),
        new BillSplitView(app, "", "bill", "status"),
      ],
    },
    encaissement_title: {
      template: "Encaissement",
      align: "center",
      type: "header",
    },
    bill_split_pay: {
      type: "clean",
      margin: 0,
      cols: [
        new BillSplitView(app, "", "pay", "type"),
        new BillSplitView(app, "", "pay", "status"),
      ],
    },
    bill_by_agg_by_item: BillByAggByItem,
    bill_by_zone: BillByZoneView,
    encaissement_agent_title: {
      template: "Encaissement par agent",
      type: "header",
    },
    agent_tab: AgentTabView,
    pay_meth: PayMethView,
    Recouv_grid_period: new RecouvGridView(app, "", "PERIODIQUE"),
    Recouv_grid_iso: new RecouvGridView(app, "", "ISOLEE"),
  };
}
