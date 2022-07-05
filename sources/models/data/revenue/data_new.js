import { urls } from "models/referential/genReferentials";
import ServerController from "controllers/serverController";
import EventController from "controllers/viewController";
import { RevenueServerManager } from "models/utils/server/ServerManager";

// new RevenueServerManager(urls.api_url);
new RevenueServerManager(host);

const rev_stat = new webix.DataCollection({
  id: "rev_stat",
  url: function (params) {
    return ServerController.getData("revenue", "getStat", "stat");
  },
});

const rev_split = new webix.DataCollection({
  id: "rev_split",
  url: function (params) {
    return ServerController.getData("revenue", "getRevenue", "split");
  },
});

const rev_type_split = new webix.DataCollection({
  id: "rev_type_split",
  url: function (params) {
    return ServerController.getData("revenue", "getRevenue", "vue0");
  },
});

const rev_trend_split = new webix.DataCollection({
  id: "rev_trend_split",
  url: function (params) {
    return ServerController.getData("revenue", "getRevenue", "vue1", "vue1");
  },
});

const rev_op_split = new webix.DataCollection({
  id: "rev_op_split",
  url: function (params) {
    return ServerController.getData("revenue", "getRevByOpType", "vue1");
  },
});

const traff_op_split = new webix.DataCollection({
  id: "traff_op_split",
  url: function (params) {
    return ServerController.getData("revenue", "getRevByOpType", "vue2");
  },
});

const rev_bndle_split = new webix.DataCollection({
  id: "rev_bndle_split",
  url: function (params) {
    return ServerController.getData("revenue", "getRevByBundleType", "vue1");
  },
});

const rev_bndle_split_exp = new webix.DataCollection({
  id: "rev_bndle_split_exp",
  url: function (params) {
    return ServerController.getData("revenue", "getRevByBundleType", "vue2");
  },
});

const rev_geo_split = new webix.DataCollection({
  id: "rev_geo_split",
  url: function (params) {
    return ServerController.getData("revenue", "getRevGeo", "vue2");
  },
});

const rev_roam_split = new webix.DataCollection({
  id: "rev_roam_split",
  url: function (params) {
    return ServerController.getData("revenue", "getRoaming", "vue1");
  },
});

const traf_roam_split = new webix.DataCollection({
  id: "traf_roam_split",
  url: function (params) {
    return ServerController.getData("revenue", "getRoaming", "vue2");
  },
});

export function getRevChartData(type) {
  switch (type) {
    case "stat":
      return rev_stat;
      break;
    case "split":
      return rev_split;
      break;
    case "rev_split":
      return rev_type_split;
      break;
    case "revs":
      return rev_trend_split;
      break;
    case "operators":
      return rev_op_split;
      break;
    case "operators_traff":
      return traff_op_split;
      break;

    case "bndle":
      return rev_bndle_split;
      break;
    case "bndle_exp":
      return rev_bndle_split_exp;
      break;

    case "rev_geo":
      return rev_geo_split;
      break;
    case "traf_roam":
      return traf_roam_split;
    case "rev_roam":
      return rev_roam_split;
    default:
      break;
  }
}

export function getAllRevData() {
  return [
    { type: "stat", data: rev_stat, func: "getStat" },
    { type: "split", data: rev_split, func: "getRevenue" },
    { type: "vue1", data: rev_trend_split, func: "getRevenue", params: "vue1" },
    { type: "vue0", data: rev_type_split, func: "getRevenue", params: "vue1" },
    { type: "vue1", data: rev_op_split, func: "getRevByOpType" },
    { type: "vue2", data: traff_op_split, func: "getRevByOpType" },
    { type: "vue1", data: rev_bndle_split, func: "getRevByBundleType" },
    { type: "vue2", data: rev_bndle_split_exp, func: "getRevByBundleType" },
    { type: "vue2", data: rev_geo_split, func: "getRevGeo" },
    { type: "vue1", data: rev_roam_split, func: "getRoaming" },
    { type: "vue2", data: traf_roam_split, func: "getRoaming" },
  ];
}

for (const elm of getAllRevData()) {
  elm.data._menu = "revenue";
  elm.data._func = elm.func;
  elm.data._param = elm.type;
  if (elm.params) elm.data._params = elm.params;
  elm.data.attachEvent("onFilterData", EventController.onFiterClicked);
}
export const functions_ref = {
  stat: "getStat",
  split_trend: "getRevenue",
  operators: "getRevByOpType",
  bndle: "getRevByBundleType",
  rev_geo: "getRevGeo",
  operators_traff: "getRevByOpType",
  traf_roam: "getRoaming",
  rev_roam: "getRoaming",
};

export function getFiterDate(func, type, date, params) {
  return ServerController.getDrillData(
    "revenue",
    functions_ref[func],
    type,
    date,
    params
  );
}
