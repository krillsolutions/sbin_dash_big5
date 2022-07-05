import { urls } from "models/referential/genReferentials";
import ServerController from "controllers/serverController";
import EventController from "controllers/viewController";
import { TopupManager } from "models/utils/server/ServerManager";

// new TopupManager(urls.api_url);
new TopupManager(host);

const rec_stat_tot = new webix.DataCollection({
  id: "rec_stat_tot",
  url: function (params) {
    return ServerController.getData("recharge", "getStat", "mnt_tot");
  },
});

const rec_stat_type = new webix.DataCollection({
  id: "rec_stat_type",
  url: function (params) {
    return ServerController.getData("recharge", "getStat", "mnt_rec_type");
  },
});

const rec_type_split = new webix.DataCollection({
  id: "rec_type_split",
  url: function (params) {
    return ServerController.getData("recharge", "getRechargeType", "vue1");
  },
});

const rec_type_trend = new webix.DataCollection({
  id: "rec_type_trend",
  url: function (params) {
    return ServerController.getData("recharge", "getRechargeTrend", "vue1");
  },
});

const rec_by_channel_split = new webix.DataCollection({
  id: "rec_by_channel_split",
  url: function () {
    return ServerController.getData("recharge", "getRechargeChannel", "split");
  },
});

const rec_voucher_value_split = new webix.DataCollection({
  id: "rec_voucher_value_split",
  url: function (params) {
    return ServerController.getData(
      "recharge",
      "getRechargeValueSplit",
      "vue1"
    );
  },
});

const rec_by_prod_by_type = new webix.DataCollection({
  id: "rec_by_prod_by_type",
  url: function (params) {
    return ServerController.getData("recharge", "getRechargeSplit", "vue1");
  },
});

const rec_by_prod_by_type_exp = new webix.DataCollection({
  id: "rec_by_prod_by_type_exp",
  url: function (params) {
    return ServerController.getData("recharge", "getRechargeSplit", "vue2");
  },
});

/*
const rec_geo_split = new webix.DataCollection({
        id : 'rec_geo_split',
        url :  function(params) { return ServerController.getData('recharge', 'getRechargeGeoSplit', 'vue2')}
    });
    
const rec_scratch_value_split = new webix.DataCollection({
id : 'rec_scratch_value_split',
url :  function(params) { return ServerController.getData('recharge', 'getRechargeScratchValuesSplit', 'vue1')}
});

const ec_split_trend = new webix.DataCollection({
        id : 'ec_split_trend',
        url :  function(params) { return ServerController.getData('recharge', 'getECTrend', 'vue1')}
});

const ec_remb_trend = new webix.DataCollection({
        id : 'ec_remb_trend',
        url :  function(params) { return ServerController.getData('recharge', 'getECRemb', 'vue1')}
});
*/

export function getRechargeChartData(type) {
  switch (type) {
    case "type_split":
      return rec_type_split;
      break;
    case "stat_tot":
      return rec_stat_tot;
      break;
    case "stat_type":
      return rec_stat_type;
      break;
    case "type_trend":
      return rec_type_trend;
      break;
    case "rec_chan_split":
      return rec_by_channel_split;
      break;
    case "rec_value_split":
      return rec_voucher_value_split;
      break;
    case "rec_hiera_split":
      return rec_by_prod_by_type;
      break;
    case "rec_hiera_split_exp":
      return rec_by_prod_by_type_exp;
      break;
    /*case 'geo_split' :
                        return rec_geo_split;
                        break;                        
                case 'sc_value_split' :
                    return rec_scratch_value_split;
                    break;
                case 'ec_trend' :
                        return ec_split_trend;
                break;                                               
                case 'remb_trend' :
                        return ec_remb_trend;
                break;     */
  }
}

export function getAllRecData() {
  return [
    { type: "vue1", data: rec_type_split, func: "getRechargeType" },
    { type: "mnt_tot", data: rec_stat_tot, func: "getStat" },
    { type: "mnt_rec_type", data: rec_stat_type, func: "getStat" },
    { type: "vue1", data: rec_type_trend, func: "getRechargeTrend" },
    { type: "split", data: rec_by_channel_split, func: "getRechargeChannel" },
    {
      type: "vue1",
      data: rec_voucher_value_split,
      func: "getRechargeValueSplit",
    },
    { type: "vue1", data: rec_by_prod_by_type, func: "getRechargeSplit" },
    { type: "vue2", data: rec_by_prod_by_type_exp, func: "getRechargeSplit" },
    /*{type : "vue2", data : rec_geo_split, func : 'getRechargeGeoSplit'},
                 {type : 'vue1', data : rec_scratch_value_split, func : 'getRechargeScratchValuesSplit'},
                 {type : 'vue1', data : ec_split_trend, func : 'getECTrend'},
                 {type : 'vue1', data : ec_remb_trend, func : 'getECRemb'}*/
  ];
}

for (const elm of getAllRecData()) {
  elm.data._menu = "recharge";
  elm.data._func = elm.func;
  elm.data._param = elm.type;
  if (elm.params) elm.data._params = elm.params;
  elm.data.attachEvent("onFilterData", EventController.onFiterClicked);
}
export const functions_ref = {
  stat_tot: "getStat",
  stat_type: "getStat",
  type_split: "getRechargeType",
  type_trend: "getRechargeTrend",
  sc_value_split: "getRechargeScratchValuesSplit",
  geo_split: "getRechargeGeoSplit",
  ec_trend: "getECTrend",
  remb_trend: "getECRemb",
};

export function getFiterDate(func, params, date) {
  return ServerController.getDrillData(
    "recharge",
    functions_ref[func],
    params,
    date
  );
}
