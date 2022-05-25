import { urls } from "models/referential/genReferentials";
import ServerController from "controllers/serverController";
import EventController from "controllers/viewController";
import { ParcServerManager } from "models/utils/server/ServerManager";

// console.log(urls);
// new ParcServerManager(urls.api_url);
new ParcServerManager(host);

const parc_stat = new webix.DataCollection({
  id: "parc_stat",
  url: function (params) {
    return ServerController.getData("parc", "getStat", "vue1");
  },
});
const parc_billing = new webix.DataCollection({
  id: "parc_billing",
  url: function (params) {
    return ServerController.getData("parc", "getParcByBill", "vue1");
  },
});
/*
const parc_off = new webix.DataCollection({
    id : 'parc_off',
    url :  function(params) { return ServerController.getData('parc', 'getParcByOffer', 'vue1')}
});

const parc_off_exp =  new webix.DataCollection({
    id : 'parc_off_exp',
    url :  function(params) { return ServerController.getData('parc', 'getParcByOffer', 'vue2')}
});
*/
const parc_off_grp = new webix.DataCollection({
  id: "parc_off_grp",
  url: function (params) {
    return ServerController.getData("parc", "getParcByOffer", "vue3");
  },
});

const parc_off_grp_exp = new webix.DataCollection({
  id: "parc_off_grp_exp",
  url: function (params) {
    return ServerController.getData("parc", "getParcByOffer", "vue4");
  },
});

const parc_bill_mark_prod = new webix.TreeCollection({
  id: "parc_bill_mark_prod",
  url: function (params) {
    return ServerController.getData("parc", "getParcByOffer", "vue5");
  },
});

const parc_bill_mark_prod_exp = new webix.DataCollection({
  id: "parc_bill_mark_prod_exp",
  url: function (params) {
    return ServerController.getData("parc", "getParcByOffer", "vue6");
  },
});

const parc_by_prod = new webix.DataCollection({
  id: "parc_by_prod",
  url: function (params) {
    return ServerController.getData("parc", "getParcByType", "split");
  },
});

const parc_by_prod_trend = new webix.DataCollection({
  id: "parc_by_prod_trend",
  url: function (params) {
    return ServerController.getData("parc", "getParcByType", "month_trend");
  },
});

const parc_by_status_by_net = new webix.DataCollection({
  id: "parc_by_status_by_net",
  url: function (params) {
    return ServerController.getData("parc", "getParcByStatus", "split");
  },
});

const parc_by_status_by_net_exp = new webix.DataCollection({
  id: "parc_by_status_by_net_exp",
  url: function (params) {
    return ServerController.getData("parc", "getParcByStatus", "exp");
  },
});

const parc_netadd = new webix.DataCollection({
  id: "parc_netadd",
  url: function (params) {
    return ServerController.getData("parc", "getNetAdd", "vue1");
  },
});

/*
const parc_fai_by_type = new webix.DataCollection({
    id : 'parc_fai_by_type',
    url :  function(params) { return ServerController.getData('parc', 'getParcByType', 'vue1')}
});

const parc_fai_by_type_trend = new webix.DataCollection({
    id : 'parc_fai_by_type_trend',
    url :  function(params) { return ServerController.getData('parc', 'getParcByType', 'month_trend', 'vue1')}
});


const parc_gros_by_type = new webix.DataCollection({
    id : 'parc_gros_by_type',
    url :  function(params) { return ServerController.getData('parc', 'getParcByType', 'vue2')}
});

const parc_gros_by_type_trend = new webix.DataCollection({
    id : 'parc_gros_by_type_trend',
    url :  function(params) { return ServerController.getData('parc', 'getParcByType', 'month_trend', 'vue2')}
});

const parc_line = new webix.DataCollection({
    id : 'parc_line',
    url :  function(params) { return ServerController.getData('parc', 'getParcLine', 'vue1')}
});

const parc_line_trend = new webix.DataCollection({
    id : 'parc_line_trend',
    url :  function(params) { return ServerController.getData('parc', 'getParcLine', 'month_trend')}
});


const parc_by_bill_market = new webix.DataCollection({
    id : 'parc_by_bill_market',
    url :  function(params) { return ServerController.getData('parc', 'getParcBillMkt', 'vue1')}
});


const parc_zones = new webix.DataCollection({
    id : 'parc_zones',
    url :  function(params) { return ServerController.getData('parc', 'getParcZones', 'vue1')}
});

const parc_gros = new webix.DataCollection({
    id : 'parc_gros',
    url :  function(params) { return ServerController.getData('parc', 'getParcGros', 'vue1')}
});

const parc_gros_offer = new webix.DataCollection({
    id : 'parc_gros_offer',
    url :  function(params) { return ServerController.getData('parc', 'getParcGros', 'off')}
});
*/
/*const parc_netadd = new webix.DataCollection({
    id : 'parc_netadd',
    url :  function(params) { return ServerController.getData('parc', 'getNetAdd', 'vue1')}
});

const parc_operators = new webix.DataCollection({
    id : 'parc_operators',
    url :  function(params) { return ServerController.getData('parc', 'getOpSplit', 'vue1')}
});

const parc_in_statuts = new webix.DataCollection({
    id : 'parc_in_statuts',
    url :  function(params) { return ServerController.getData('parc', 'getINSplit', 'vue1')}
});

//getParcByType

const parc_market_bill = new webix.DataCollection({
    id : 'parc_market_bill',
    url :  function(params) { return ServerController.getData('parc', 'getParcByType', 'vue1')}
});

const parc_market_bill_exp = new webix.DataCollection({
    id : 'parc_market_bill_exp',
    url :  function(params) { return ServerController.getData('parc', 'getParcByType', 'vue2')}
});
*/

export function getParcChartData(type) {
  switch (type) {
    case "stat":
      return parc_stat;
      break;

    case "parc_bill":
      return parc_billing;
      break;
    /*              case 'parc_offer_acct' :
                    return parc_off;
                    break; 
                case 'parc_offer_acct_exp' :
                    return parc_off_exp;
                    break;
*/
    case "parc_offer_grp":
      return parc_off_grp;
      break;
    case "parc_offer_grp_exp":
      return parc_off_grp_exp;
      break;

    case "parc_offer_prod":
      return parc_by_prod;
      break;

    case "parc_offer_prod_trend":
      return parc_by_prod_trend;
      break;

    case "parc_status_split":
      return parc_by_status_by_net;
      break;

    case "parc_status_split_exp":
      return parc_by_status_by_net_exp;
      break;

    case "parc_bill_split":
      return parc_bill_mark_prod;
      break;

    case "parc_bill_split_exp":
      return parc_bill_mark_prod_exp;
      break;
    case "netadd":
      return parc_netadd;
      break;
  }
}

export function getAllParcData() {
  return [
    { type: "stat", data: parc_stat, func: "getStat" },
    { type: "vue1", data: parc_billing, func: "getParcByBill" },
    //{type : 'vue1', data : parc_off, func : 'getParcByOffer' },
    //{type : 'vue2', data : parc_off_exp, func : 'getParcByOffer' },
    { type: "vue3", data: parc_off_grp, func: "getParcByOffer" },
    { type: "vue4", data: parc_off_grp_exp, func: "getParcByOffer" },
    { type: "vue5", data: parc_bill_mark_prod, func: "getParcByOffer" },
    { type: "vue6", data: parc_bill_mark_prod_exp, func: "getParcByOffer" },
    //{type : 'vue2', data : parc_off_FAI_exp, func : 'getParcByOffer' },
    { type: "split", data: parc_by_prod, func: "getParcByType" },
    { type: "month_trend", data: parc_by_prod_trend, func: "getParcByType" },
    { type: "split", data: parc_by_status_by_net, func: "getParcByStatus" },
    { type: "exp", data: parc_by_status_by_net_exp, func: "getParcByStatus" },
    { type: "vue1", data: parc_netadd, func: "getNetAdd" },
    /* {type : 'month_trend', data : parc_gros_by_type_trend , func : 'getParcByType', params : 'vue2'},            

            {type : 'vue1', data : parc_line, func : 'getParcLine'},
            {type : 'month_trend', data : parc_line_trend, func : 'getParcLine'},
            {type : 'vue1', data : parc_by_bill_market, func : 'getParcBillMkt'},
            {type : 'vue1', data : parc_zones, func : 'getParcZones'},
            {type : 'vue1', data : parc_gros, func : 'getParcGros'},
            {type : 'off', data : parc_gros_offer, func : 'getParcGros'},*/
    /*{type : 'vue2', data : parc_market_bill_exp, func : 'getParcByType'}*/
  ];
}

for (const elm of getAllParcData()) {
  elm.data._menu = "parc";
  elm.data._func = elm.func;
  elm.data._param = elm.type;
  if (elm.params) elm.data._params = elm.params;
  elm.data.attachEvent("onFilterData", EventController.onFiterClicked);
}
export const functions_ref = {
  stat: "getStat",
  geo: "getParcGeo",
  type: "getParcByType",
  operator: "getOpSplit",
  markType: "getParcByType",
  markTypeExp: "getParcByType",
  in_statut: "getINSplit",
  line: "getParcLine",
};

export function getFiterDate(func, type, date, params) {
  return ServerController.getDrillData(
    "parc",
    functions_ref[func],
    type,
    date,
    params
  );
}
