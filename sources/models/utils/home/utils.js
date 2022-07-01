import {
  refData,
  kpi_field,
  kpi_titles,
} from "models/referential/genReferentials";
export function kFormatter(num) {
  if (!num || num == null || typeof num == "undefined") return 0;
  return Math.abs(num) > 999
    ? Math.abs(num) > 999999
      ? Math.abs(num) > 999999999
        ? Math.abs(num) > 999999999999
          ? Math.sign(num) * (Math.abs(num) / 1000000000000).toFixed(2) + " kMd"
          : Math.sign(num) * (Math.abs(num) / 1000000000).toFixed(2) + " Md"
        : Math.sign(num) * (Math.abs(num) / 1000000).toFixed(2) + " M"
      : Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + " k"
    : (Math.sign(num) * Math.abs(num)).toFixed(2);
}

export function DatakFormatter(num) {
  if (!num || num == null || typeof num == "undefined") return 0;
  return Math.abs(num) >= 1024
    ? Math.abs(num) >= 1048576
      ? Math.abs(num) >= 1073741824
        ? Math.abs(num) >= 1073741824 * 1024
          ? Math.abs(num) >= 1073741824 * 1024 * 1024
            ? Math.sign(num) *
                (Math.abs(num) / 1073741824 / 1024 / 1024).toFixed(1) +
              " Po"
            : Math.sign(num) * (Math.abs(num) / 1073741824 / 1024).toFixed(1) +
              " To"
          : Math.sign(num) * (Math.abs(num) / 1073741824).toFixed(2) + " Go"
        : Math.sign(num) * (Math.abs(num) / 1048576).toFixed(2) + " Mo"
      : Math.sign(num) * (Math.abs(num) / 1024).toFixed(1) + " ko"
    : (Math.sign(num) * Math.abs(num)).toFixed(2);
}

export function getLabel(kpi) {
  const refs = refData.getItem(refData.getFirstId());
  //   console.log(refs.kpi_fields);
  if (
    getScreenType() != "small" &&
    getScreenType() != "mobile" &&
    getScreenType() != "mobile_rotated"
  )
    return refs.kpi_fields[kpi]
      ? refs.kpi_fields[kpi].label
      : kpi_field[kpi]
      ? kpi_field[kpi].label
      : "";

  return refs.kpi_fields[kpi]
    ? refs.kpi_fields[kpi].shortlab
      ? refs.kpi_fields[kpi].shortlab
      : refs.kpi_fields[kpi].label
    : kpi_field[kpi]
    ? kpi_field[kpi].shortlab
      ? kpi_field[kpi].shortlab
      : kpi_field[kpi].label
    : "";
}

export function getTitle(kpi) {
  if (kpi_titles[kpi]) return kpi_titles[kpi];
  return "";
}

export function updateChartReady(chart) {
  $$(chart).hideProgress();
  $$(chart).enable();
  //    console.log(chart);
}

export function getKpiColor(kpi) {
  var bg = {};
  switch (kpi) {
    case "rev_global":
    case "rev":
    case "rev_pyg":
    case "command_glob":
    case "bills_fact":
      bg = {
        "font-weight": "bold",
        background: "#59d0eb",
        "font-size": "medium",
      };
      break;
    case "traffic_voix":
    case "command_split":
    case "rev_bundle":
    case "offer_type":
    case "bills_paie":
      bg = {
        "font-weight": "bold",
        background: "#b09fb5",
        "font-size": "medium",
      };
      break;
    case "traffic_data":
    case "tot":
    case "sales_split":
    case "parc_other":
    case "rev_other":
    case "bills_recouvr":
      bg = {
        "font-weight": "bold",
        background: "#dcdede",
        "font-size": "medium",
      };
      break;
    case "mnt_recharge":
    case "mnt_paid":
    case "revtab":
    case "rev_sales":
      bg = {
        "font-weight": "bold",
        background: "#e8d0a7",
        "font-size": "medium",
      };
      break;
    case "mnt_bundle":
    case "parc_status_ligne":
    case "gros_offer_type":
    case "rev_by_line":
    case "rev_by_offer_gros":
      bg = {
        "font-weight": "bold",
        background: "#59d0eb",
        "font-size": "medium",
      };
      break; //rev_by_bill
    case "parc_by_bill":
    case "rev_by_line":
      bg = {
        "font-weight": "bold",
        background: "#e8d0a7",
        "font-size": "medium",
      };
      break;
    case "rev_geo_split":
      bg = {
        "font-weight": "bold",
        background: "#e8d0a7",
        "font-size": "medium",
      };
      break;
    //rev_by_op
    case "rev_by_op":
      bg = {
        "font-weight": "bold",
        background: "#b09fb5",
        "font-size": "medium",
      };
      break;

    case "rev_by_bndle":
      bg = {
        "font-weight": "bold",
        background: "#dcdede",
        "font-size": "medium",
      };
      break;
    //traffic_geo_orange_voice
    case "traffic_geo_orange_voice":
      bg = {
        "font-weight": "bold",
        background: "#dcdede",
        "font-size": "medium",
      };
      break;
    case "traffic_geo_int_voice":
    case "rec_by_prod":
      bg = {
        "font-weight": "bold",
        background: "#e8d0a7",
        "font-size": "medium",
      };
      break;

    case "traffic_other_voice":
    case "rec_by_type":
      bg = {
        "font-weight": "bold",
        background: "#59d0eb",
        "font-size": "medium",
      };
      break;

    case "traffic_geo_orange_sms":
      bg = {
        "font-weight": "bold",
        background: "#ffc4cb",
        "font-size": "medium",
      };
      break;
    case "traffic_geo_int_sms":
    case "data_repartition":
      bg = {
        "font-weight": "bold",
        background: "#e8d0a7",
        "font-size": "medium",
      };
      break;

    case "traffic_other_sms":
    case "traffic_other_data":
      bg = {
        "font-weight": "bold",
        background: "#b09fb5",
        "font-size": "medium",
      };
      break;

    case "arpu":
      bg = {
        "font-weight": "bold",
        background: "#20c997",
        "font-size": "medium",
      };
      break;

    case "traffics":
      bg = {
        "font-weight": "bold",
        background: "#dcdede",
        "font-size": "medium",
      };
      break;

    default:
      bg = {
        "font-weight": "bold",
        background: "#ffc4cb",
        "font-size": "medium",
      };
      break;
  }
  return bg;
}

export function formatter(n, t) {
  //var n = (typeof t == "undefined" )? num/1000 : num;
  if (typeof t != "undefined")
    return webix.Number.format(n, {
      groupDelimiter: " ",
      groupSize: 3,
      decimalDelimiter: ".",
      decimalSize: 2,
    });
  return webix.Number.format(n, {
    groupDelimiter: " ",
    groupSize: 3,
    decimalDelimiter: ".",
    decimalSize: 0,
  });
  //return d3.format(',.0f')(num/1000);
}

export function getPlotableItems(v) {
  const refs = refData.getItem(refData.getFirstId());
  const arr = [];
  const result = [];
  const d = v >= 10 ? v / 10 : 1;
  for (var i = 0; i < v; i += d) {
    arr.push(Math.round(i));
  }
  arr.pop();
  arr.push(v);
  for (var elmt in refs.slots) {
    if (arr.includes(refs.slots[elmt])) result.push(elmt);
  }
  return result;
}
const url = "http://localhost:8000/api/";
const api_rf = {
  home: {
    parc_stat: "getParc/001",
    rev_stat: "getRevenue/001",
    tvoix_stat: "getTraffic/001",
    tdata_stat: "getTraffic/002",
    topup_stat: "getRecharge/0011",
    bndle_stat: "getRevenue/0041",
  },

  parc: {},
};
export function getDUrl(place, kpi, filters) {
  let filt = "";
  for (let elmt in filters) {
    filt += elmt + "=" + filters[elmt] + "&";
  }

  return url + api_rf[place][kpi] + "?" + filt;
}

export function getScreenType() {
  let h = document.body.offsetHeight,
    w = document.body.offsetWidth;
  if (
    /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) &&
    window.screen.width <= 600
  )
    return "mobile";
  if (
    /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) &&
    window.screen.height <= 600
  )
    return "mobile_rotated";
  if (h <= 740 && w >= 1000) return "small";
  if (h >= 740 && w >= 1000) return "standard";
  return "normal";
}

export function getScreenTypeByMenu(menu) {
  return /*(webix.storage.session.get('screenType:'+menu) == null)? getScreenType() :*/ webix.storage.session.get(
    "screenType:" + menu
  );
}

export function setScreenTypeByMenu(menu, val) {
  webix.storage.session.put("screenType:" + menu, val);
}
