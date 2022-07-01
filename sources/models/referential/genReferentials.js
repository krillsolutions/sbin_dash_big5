import { getUrl } from "models/utils/general/utils";
import { getToken } from "models/utils/general/boot";

//console.log(urls)

/**
 * INTERCEPTOR AJAX
 */

webix.attachEvent(
  "onBeforeAjax",
  function (mode, url, data, request, headers, files, promise) {
    headers["Authorization"] = "Bearer " + getToken();
  }
);

/**
 * GET APP LIST
 */
const dash_data_coll = new webix.DataCollection({
  id: "apps_list",
  url: urls["dash_apps"],
});

export function getAppList() {
  let current_app = dash_data_coll.data
    .getRange()
    .filter((e) => e.id == app_id)[0];

  return current_app;
}

export function getMenuApp(menu_id) {
  let menu = getAppList().menus.filter((e) => e.id == menu_id)[0];

  return menu;
}

export const refData = new webix.DataCollection({
  url: getUrl("refdata"),
  id: "refdata",
});

export const distref = new webix.DataCollection({
  url: getUrl("distref"),
  id: "distref",
});

export const trafficYaxisType = {
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
export const rev_type = {};
export const kpi_titles = {};
export const geo_config = {};
export const geo_files_loc = {};
export const kpi_field = {};
export const dash_titles = {};
export const urls = {};
// {
//   api_url: "https://server.krillsolutions.com/api/sbin/",
//   host: "https://server.krillsolutions.com/api/sbin/",
//   login_url: "https://server.krillsolutions.com/api/sbin/auth",
// };

export const ressource_ref = {};
export const filters_list = [];

export const filter_ref = new Promise((res, rej) => {
  refData.waitData.then(() => {
    let filters = refData.getItem(refData.getFirstId())["filters_opt"];
    // console.log(filters);
    let opt_ref = refData.getItem(refData.getFirstId())["opt_ref"];
    // console.log(opt_ref);
    const value = { filters: {} };
    //console.log(opt_ref);
    for (let ref of filters) {
      filters_list.push(ref.name);
      value["filters"][ref.name] = {
        default: ref.default,
        desc: ref.description,
        icon: ref.icon,
        illustration: ref.illustration,
        options: [...opt_ref[ref.name]],
      };
    }
    //	console.log(value);
    res(value);
  });
});
export const color_ref = new webix.promise((res, rej) => {
  refData.waitData.then(() => {
    let colors = refData.getItem(refData.getFirstId())["color_ref"];
    const value = {};
    for (let ref in colors) {
      value[ref] = colors[ref];
    }
    //console.log(value);
    res(value);
  });
});
export const bill_type = [];
export const dataDesc = new webix.promise((res, rej) => {
  refData.waitData.then(() => {
    let kpis = refData.getItem(refData.getFirstId())["kpis_long_name"];
    let value = {};
    for (let ref in kpis) {
      value[ref] = kpis[ref];
    }
    res(value);
  });
});
export const parcGeoOptions = new webix.promise((res, rej) => {
  refData.waitData.then(() => {
    let select_opt = refData.getItem(refData.getFirstId())["select_options"];
    let value = [];
    for (let elm of select_opt["parcGeoOptions"]) {
      value.push(elm);
    }
    res(value);
  });
});

export const recFilterOptions = new webix.promise((res, rej) => {
  refData.waitData.then(() => {
    let select_opt = refData.getItem(refData.getFirstId())["select_options"];
    let value = [];
    for (let elm of select_opt["recFilterOptions"]) {
      value.push(elm);
    }
    res(value);
  });
});

export const revGeoOptions = new webix.promise((res, rej) => {
  refData.waitData.then(() => {
    let select_opt = refData.getItem(refData.getFirstId())["select_options"];
    let value = [];
    for (let elm of select_opt["revGeoOptions"]) {
      value.push(elm);
    }
    res(value);
  });
});

refData.waitData.then(() => {
  let refs = refData.getItem(refData.getFirstId())["titles"];

  for (let ref in refs) {
    kpi_titles[ref] = refs[ref];
  }

  let fields = refData.getItem(refData.getFirstId())["kpi_labels"];

  for (let ref in fields) {
    //console.log(ref);
    kpi_field[ref] = fields[ref];
  }

  let titles = refData.getItem(refData.getFirstId())["dash_titles"];

  for (let ref in titles) {
    dash_titles[ref] = titles[ref];
  }

  let opt_ref = refData.getItem(refData.getFirstId())["opt_ref"];
  // for (let b of opt_ref["b"]) {
  //   //console.log(b);
  //   bill_type.push(b);
  // }
  for (const b of opt_ref.b.values) {
    bill_type.push(b);
  }
  let links = refData.getItem(refData.getFirstId())["urls"];
  //console.log(links);
  for (let ref in links) {
    urls[ref] = links[ref];
  }
  //   console.log(urls);
  // urls['api_url'] = 'https://192.168.11.105/api/';

  // urls["api_url"] = "https://server.krillsolutions.com/api/sbin/";
  // urls["host"] = "https://server.krillsolutions.com/api/sbin/";
  // urls["login_url"] = "https://server.krillsolutions.com/api/sbin/auth-sbin";

  let locs = refData.getItem(refData.getFirstId())["geo_files"];
  for (let ref in locs) {
    geo_files_loc[ref] = locs[ref];
  }
  let conf = refData.getItem(refData.getFirstId())["geo_config"];
  for (let ref in conf) {
    geo_config[ref] = conf[ref];
  }
  let ress = refData.getItem(refData.getFirstId())["tool_bar_refs"];
  // console.log(ress);
  for (let ref in ress) {
    ressource_ref[ref] = ress[ref];
  }

  let revs = refData.getItem(refData.getFirstId())["revenues"];
  for (let ref in revs) {
    rev_type[ref] = revs[ref];
  }
});

export const components = {
  home: [],
  revenue: [],
  traffic: [],
  parc: [],
  recharge: [],
  om: [],
  monitor: [],
  wimax: [],
  sales: [],
  bills: [],
};
export const recGeoOptions = [];

refData.waitData.then(() => {
  let refs = refData.getItem(refData.getFirstId())["recharge_type"];
  let i = 1;
  recGeoOptions.push({ id: i, value: "Tous", _type: "all" });
  for (const ref of refs) {
    i++;
    recGeoOptions.push({ id: i, value: ref, _type: ref });
  }
});

export const parcLabs = {
  geoLab: "",
};

export const revLabs = {
  geoLab: "",
};

export const recLabs = {
  geoLab: "",
};

export const colors = [
  "#c23531",
  "#2f4554",
  "#61a0a8",
  "#d48265",
  "#91c7ae",
  "#749f83",
  "#ca8622",
  "#bda29a",
  "#6e7074",
  "#546570",
  "#c4ccd3",
];
