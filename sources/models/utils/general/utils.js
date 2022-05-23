import { components, filters_list } from "models/referential/genReferentials";
import { FilterIconView } from "views/general/filters/filtersicons";
import {
  gconfig,
  getFilter,
  getPeriod,
  getToken,
} from "models/utils/general/boot";

import PeriodSelector from "views/others/periodSelector";
import { getComponent } from "models/config/refDash";
import GraphHeadView from "views/home/graphHeaders";
import { applyAuthorizations } from "models/referential/configDash";
import notAuthStat from "views/notAuth/notAuthStat";
// import notAuthDash from "views/notAuth/NotAuthDash";

export function getUrl(data) {
  return urls[data] + "&token=" + getToken();
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

/**
 * GET PANELS
 */
export function getPanels(app, menu_id, tab) {
  console.log(tab);
  let authorized = applyAuthorizations(menu_id, "tabs", tab.id);
  let authrz_panel = authorized.map((e) => e.split(".")[0]);
  return tab.panels.map((e) => {
    return {
      view: "panel",
      x: e.x,
      y: e.y,
      dx: e.dx,
      dy: e.dy,
      resize: true,
      header: new GraphHeadView(app, "", e.id, "homelines"),
      disabled: !(authrz_panel.indexOf(e.id) != -1),
      body: {
        type: "clean",
        margin: 0,
        ...getPanel(app, menu_id, e, authorized),
      },
      css: { "background-color": "#fff" },
    };
  });
}

/**
 * GET PANEL
 */
export function getPanel(app, menu_id, panel, authorized) {
  let doc = {};
  doc[panel.arrange] = getDashs(app, menu_id, panel.dashs, authorized);
  return doc;
  // if (panel.arrange == "rows") {
  //   return {
  //     rows: getDashs(app, menu_id, panel.dashs, authorized),
  //   };
  // } else {
  //   return { cols: getDashs(app, menu_id, panel.dashs, authorized) };
  // }
}

/**
 * GET DASHS
 */

function getDashs(app, menu_id, dashs, authorized) {
  return dashs.map((dash) => {
    if (dash.arrange == "rows") {
      return {
        rows: getChilds(app, menu_id, dash.childs, authorized),
      };
    } else {
      return {
        cols: getChilds(app, menu_id, dash.childs, authorized),
      };
    }
  });
}

/**
 * GET CHILD
 */
function getChilds(app, menu_id, childs, authorized) {
  authorized = authorized
    .filter((e) => e.split(".").length > 2)
    .map((e) => e.split(".").slice(-1)[0]);

  return childs.map((f) => {
    if (f.period_selector) {
      return {
        type: "clean",
        margin: 0,
        rows:
          authorized.indexOf(f.id) != -1
            ? [
                new PeriodSelector(app, "", f.id, f.nb_period_select),
                getComponent("", menu_id, f.id, "dash"),
              ]
            : [],
      };
    } else {
      return getComponent("", menu_id, f.id, "dash");
    }
  });
}

/**
 * GET STATS
 */
export function getStats(app, menu_id, stats) {
  let authorized = applyAuthorizations(menu_id, "stats");
  return stats.cards.map((e) => ({
    view: "panel",
    x: e.x,
    y: e.y,
    dx: e.dx,
    dy: e.dy,
    body:
      authorized.indexOf(e.id) != -1
        ? getComponent(app, menu_id, e.id, "stats")
        : new notAuthStat(app, "", e.id),
  }));
}
