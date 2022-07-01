var app_id = "dash_app_sbin";

//var host = 'https://192.168.35.8/api/';
// var host = 'https://192.168.11.105/api/';
var host = "https://server.krillsolutions.com/api/sbin/";
var urls = {
  refdata: host + "getRef-sbin?kpi=00",
  distref: host + "getRef-sbin?kpi=dist",
  menudata: host + "getRef-sbin?kpi=01&p=" + app_id,
  dash_apps: host + "getDashApps",
};

var api_url = "";

var default_dates = {
  d1: "",
  d2: "",
};

var periodSplit = ["1y", "1m", "1d"];

var traffType = ["voice", "sms", "data"];

var traffTypeSplit = [
  { name: "voice", split: ["pyg", "bndle", "free"] },
  { name: "sms", split: ["pyg", "bndle", "free"] },
  { name: "data", split: ["pyg", "bndle", "free"] },
];

var trafficYaxisType = {
  voice: {
    index: 0,
    name: "Voix (min.)",
  },
  sms: {
    index: 1,
    name: "SMS (Qte.)",
  },
  data: {
    index: 2,
    name: "Data (Octets)",
  },
};

var billings_rf = {
  b: {
    name: "Factures",
    bill_mk_tl: "Parc billing type/marché/Type de ligne",
    type_line: "Par type de ligne",
    type_line_trend: "Evolution",
  },

  p: {
    name: "Encaissements",
    bill_mk_tl: "Parc billing type/marché/Type de ligne",
    type_line: "Par type de ligne",
    type_line_trend: "Evolution",
  },
};

var authorizations = [];

var myFilters = {};

var product_for_recouvrement = [
  "LTE",
  "Téléphone",
  "ADSL",
  "FTTH",
  "GROS",
  "Internet",
];

var product_for_recouvrement = [
  "MOBILE",
  "LTE",
  "TELEPHONIE",
  "ADSL", //,"FTTH","INTERNET", "GROS"
];

var recouvr_months_offset = 3;

var fact_type = [
  { name: "PERIODIQUE", id: "period" },
  { name: "ISOLEE", id: "isolee" },
];
