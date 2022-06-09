import { components, filters_list } from "models/referential/genReferentials";
import { FilterIconView } from "views/general/filters/filtersicons";
import {
  gconfig,
  getFilter,
  getPeriod,
  getToken,
} from "models/utils/general/boot";

export function getUrl(data) {
  return urls[data];
  // return urls[data] + "&token=" + getToken();
}

export function showProcess(menu, cmp) {
  if (typeof cmp == "undefined") {
    for (const elmt of components[menu]) {
      if (typeof $$(elmt.cmp) != "undefined") {
        //console.log(elmt.cmp)
        $$(elmt.cmp).showProgress();
        $$(elmt.cmp).disable();
      }
    }
  } else if (typeof $$(components[menu][cmp]) != "undefined") {
    $$(components[menu][cmp]).showProgress();
    $$(components[menu][cmp]).disable();
  }
}

export function updateChartReady(chart) {
  $$(chart).hideProgress();
  $$(chart).enable();
}

export function getAllFilters() {
  return filters_list;
  //console.log(t)
  return ["d1", "d2", "o", "b", "p", "r", "s", "c"];
  /*return filter_ref.then((filter_ref) => {

		ft = [...ft,...Object.keys(filter_ref['filters'])]
		return ft
		console.log(ft)

	})*/
}

export function setLabels() {
  const app = gconfig["app"];
  let ind =
    getScreenType() == "mobile" || getScreenType() == "mobile_rotated" ? 3 : 8;
  for (let elm of getAllFilters()) {
    //console.log(elm);
    if (elm == "d1" || elm == "d2") continue;

    if (typeof $$("filterelmt:" + elm) != "undefined") {
      $$("loginbar").removeView("filterelmt:" + elm);
    }

    // if ($$("loginbar"))
    //   if (typeof getFilter()[elm] != "undefined")
    //     $$("loginbar").addView(new FilterIconView(app, "", elm), ind);

    if (
      (typeof getFilter()[elm] != "undefined" &&
        getFilter()[elm] != myFilters[elm].values.join(",")) ||
      (myFilters[elm] ? myFilters[elm].op != "all" : false)
    ) {
      $$("loginbar").addView(new FilterIconView(app, "", elm), ind);
    }
  }
  if ($$("period")) {
    $$("period").define(
      "label",
      "<span style='color:#fff;font-size:14px' class='mdi mdi-calendar-check' > Période : " +
        getPeriod()["d1"] +
        " - " +
        getPeriod()["d2"] +
        "</span>"
    );
    $$("period").refresh();
  }
}

export function getMonth(date) {
  return webix.Date.dateToStr("%Y-%m")(date);
}

export function getDates() {
  return getPeriod();
}
export function getMonthsFromDate(date, nbr) {
  let months = [],
    d = date.substr(0, 7) + "-01";
  for (let i = nbr; i >= 0; i--) {
    months.push(
      webix.Date.dateToStr("%Y-%m")(
        webix.Date.add(webix.Date.strToDate("%Y-%m-%d")(d), -i, "month")
      )
    );
  }
  return months;
}
function getDeepData(odata, t) {
  let data = { ...odata };
  if (data.children) {
    let i = typeof t != "undefined" ? t : 1;
    data.children.forEach((elm) => {
      data["name" + i] = elm.name;
      data["tot" + i] = elm.value;
      data = { ...data, ...getDeepData(data.children, i + 1) };
      i++;
    });
  }
  return data;
}

export function getTreeData(odata) {
  let data = [...odata];
  for (const dat of data) {
    (rvalue = dat.value), (rname = dat.name);
    delete dat.value;
    dat["tot"] = rvalue;
    dat = { ...dat, ...getDeepData(dat.children) };
  }

  return data;
}

export function setScreenType() {
  let h = document.body.offsetHeight,
    w = document.body.offsetWidth,
    type = "normal";

  if (h <= 740 && w >= 1000) type = "small";
  if (h >= 740 && w >= 1000) type = "standard";
  if (
    /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) &&
    window.screen.width <= 600
  )
    type = "mobile";
  if (
    /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) &&
    window.screen.height <= 600
  )
    type = "mobile_rotated";
  webix.storage.session.put("screenType", type);
  return type;
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

function groupBy(xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}

export function getTreeHierachy(
  data,
  levels = [],
  name = "name",
  values = ["value"]
) {
  if (levels.length != 0) {
    let lv = [...levels];
    let dat = groupBy(data, lv[0]);
    lv.shift();
    let res = [];
    let parts = {};
    for (const v of values) {
      parts[v] = d3.sum(data, (d) => d[v]);
    }
    for (const key in dat) {
      const element = dat[key];
      let dd = {};
      dd[name] = key;
      for (const val of values) {
        dd[val] = d3.sum(element, (d) => d[val]);
        if (parts[val] && parts[val] != 0)
          dd[val + "_percent"] = 100 * (dd[val] / parts[val]).toFixed(2);
      }

      //let dd = {name : key , value : d3.sum(element, d => d[value]) };
      let children = getTreeHierachy(element, lv, name, values);
      if (children.length != 0) {
        dd.data = children;
      }
      // else delete dd.webix_kids
      res.push(dd);
    }
    return res;
  } else {
    return [];
  }
}
