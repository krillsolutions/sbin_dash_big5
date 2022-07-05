import { urls } from "models/referential/genReferentials";
import ServerController from "controllers/serverController";
import EventController from "controllers/viewController";
import { TrafficServerManager } from "models/utils/server/ServerManager";

// new TrafficServerManager(urls.api_url);
new TrafficServerManager(host);

const traffic_stat = new webix.DataCollection({
  id: "traffic_stat",
  url: function (params) {
    return ServerController.getData("traffic", "getStat", "stat");
  },
});
/*
const voice_traffic_geo = new webix.DataCollection({
        id : 'voice_traffic_geo',
        url :  function(params) { return ServerController.getData('traffic', 'getTrafficGeo', 'vue1', 'voice')}
});

const sms_traffic_geo = new webix.DataCollection({
        id : 'sms_traffic_geo',
        url :  function(params) { return ServerController.getData('traffic', 'getTrafficGeo', 'vue1', 'sms')}
});

const data_traffic_geo = new webix.DataCollection({
        id : 'data_traffic_geo',
        url :  function(params) { return ServerController.getData('traffic', 'getTrafficGeo', 'vue1', 'data')}
});

const voice_traffic_int_geo = new webix.DataCollection({
        id : 'voice_traffic_int_geo',
        url :  function(params) { return ServerController.getData('traffic', 'getTrafficIntGeo', 'vue1', 'voice')}
});

const sms_traffic_int_geo = new webix.DataCollection({
        id : 'sms_traffic_int_geo',
        url :  function(params) { return ServerController.getData('traffic', 'getTrafficIntGeo', 'vue1', 'sms')}
});
*/ /*
const nat_traffic_geo = new webix.DataCollection({
        id : 'nat_traffic_geo',
        url :  function(params) { return ServerController.getData('traffic', 'getTrafficGeo', 'vue1', 'all')}
});
*/
const int_traffic_geo = new webix.DataCollection({
  id: "int_traffic_geo",
  url: function (params) {
    return ServerController.getData(
      "traffic",
      "getTrafficIntGeo",
      "vue1",
      "all"
    );
  },
});

const int_traffic_geo_sample = new webix.DataCollection({
  id: "int_traffic_geo_sample",
  url: function (params) {
    return ServerController.getData(
      "traffic",
      "getTrafficIntGeo",
      "vue2",
      "all"
    );
  },
});

//getTrafficSplit

const traffic_split = new webix.DataCollection({
  id: "traffic_split",
  url: function (params) {
    return ServerController.getData("traffic", "getTrafficSplit", "vue1");
  },
});

const traffic_dest_split = new webix.DataCollection({
  id: "traffic_dest_split",
  url: function (params) {
    return ServerController.getData("traffic", "getTrafficByDest", "vue1");
  },
});

const traffic_offer_split = new webix.DataCollection({
  id: "traffic_offer_split",
  url: function (params) {
    return ServerController.getData("traffic", "getTrafficByOff", "vue1");
  },
});

const traffic_offer_split_exp = new webix.DataCollection({
  id: "traffic_offer_split_exp",
  url: function (params) {
    return ServerController.getData("traffic", "getTrafficByOff", "vue2");
  },
});

const traffic_operator_split = new webix.DataCollection({
  id: "traffic_operator_split",
  url: function (params) {
    return ServerController.getData("traffic", "getTraffByOpType", "vue1");
  },
});
/*
const traffic_data_bill_split = new webix.DataCollection({
        id : 'traffic_data_bill_split',
        url :  function(params) { return ServerController.getData('traffic', 'getTraffDataBill', 'vue1')}
});
*/

const traffic_data_parc = new webix.DataCollection({
  id: "traffic_data_parc",
  url: function (params) {
    return ServerController.getData("traffic", "getTraffDataParc", "vue1");
  },
});

//
const traffic_data_type_trend = new webix.DataCollection({
  id: "traffic_data_type_trend",
  url: function (params) {
    return ServerController.getData("traffic", "getTraffDataType", "vue1");
  },
});

const traffic_data_type_split = new webix.DataCollection({
  id: "traffic_data_type_split",
  url: function (params) {
    return ServerController.getData("traffic", "getTraffDataType", "split");
  },
});

const traffic_data_site_split = new webix.DataCollection({
  id: "traffic_data_site_split",
  url: function (params) {
    return ServerController.getData("traffic", "getTraffDataBySite", "vue1");
  },
});

export function getTraffChartData(type) {
  switch (type) {
    case "stat":
      return traffic_stat;
      break;
    /*case 'nat_traffic':
                        return nat_traffic_geo;*/
    /*case 'sms_geo':
                        return sms_traffic_geo;
                case 'data_geo':
                        return data_traffic_geo;
		case 'voice_geo':
			return voice_traffic_geo;
                        */
    case "int_traffic":
      return int_traffic_geo;
    case "int_traffic_sample":
      return int_traffic_geo_sample;
    /*case 'sms_int_geo':
                        return sms_traffic_int_geo;   */
    case "traffic_type":
      return traffic_split;
    case "traffic_dest":
      return traffic_dest_split;
    case "traffic_offer":
      return traffic_offer_split;
    case "traffic_offer_exp":
      return traffic_offer_split_exp;
    case "traffic_operator":
      return traffic_operator_split;
    case "traffic_data_bill":
      return traffic_data_bill_split;
    case "parc_data":
      return traffic_data_parc;
    case "traffic_data":
      return traffic_data_type_trend;
    case "data_type":
      return traffic_data_type_split;
    case "data_site":
      return traffic_data_site_split;

    default:
      break;
  }
}

export function getAllRevData() {
  return [
    { type: "stat", data: traffic_stat, func: "getStat" },
    //{type :'vue1', data : nat_traffic_geo, func : 'getTrafficGeo', params : 'all'},
    /*{type :'vue1', data : voice_traffic_geo, func : 'getTrafficGeo', params : 'voice'},
	    {type :'vue1', data : sms_traffic_geo, func : 'getTrafficGeo', params : 'sms'},
	    {type :'vue1', data : data_traffic_geo, func : 'getTrafficGeo', params : 'data'},*/
    {
      type: "vue1",
      data: int_traffic_geo,
      func: "getTrafficIntGeo",
      params: "all",
    },
    {
      type: "vue2",
      data: int_traffic_geo_sample,
      func: "getTrafficIntGeo",
      params: "all",
    },
    { type: "vue1", data: traffic_split, func: "getTrafficSplit" },
    { type: "vue1", data: traffic_dest_split, func: "getTrafficByDest" },
    { type: "vue1", data: traffic_offer_split, func: "getTrafficByOff" },
    { type: "vue2", data: traffic_offer_split_exp, func: "getTrafficByOff" },
    { type: "vue1", data: traffic_operator_split, func: "getTraffByOpType" },
    //{type : 'vue1', data : traffic_data_bill_split, func : 'getTraffDataBill'},
    { type: "vue1", data: traffic_data_parc, func: "getTraffDataParc" },
    { type: "vue1", data: traffic_data_type_trend, func: "getTraffDataType" },
    { type: "split", data: traffic_data_type_split, func: "getTraffDataType" },
    { type: "vue1", data: traffic_data_site_split, func: "getTraffDataBySite" },
  ];
}

for (const elm of getAllRevData()) {
  elm.data._menu = "traffic";
  elm.data._func = elm.func;
  elm.data._param = elm.type;
  if (elm.params) elm.data._params = elm.params;
  elm.data.attachEvent("onFilterData", EventController.onFiterClicked);
}
export const functions_ref = {
  stat: "getStat",
  nat_traffic: "getTrafficGeo",
  int_traffic: "getTrafficIntGeo",
  traffic_type: "getTrafficSplit",
  traffic_dest: "getTrafficByDest",
  traffic_offer: "getTrafficByOff",
  traffic_operator: "getTraffByOpType",
  traffic_data_bill: "getTraffDataBill",
  parc_data: "getTraffDataParc",
  data_type: "getTraffDataType",
};

export function getFiterDate(func, type, date, params) {
  return ServerController.getDrillData(
    "traffic",
    functions_ref[func],
    type,
    date,
    params
  );
}
