import PeriodSelector from "views/others/periodSelector";
import {
  getComponent,
  // getComponentTraffic,
} from "views/traffic/config/refDash";
import { tabComponentsTraffic } from "views/traffic/config/TabConfig";
import GraphHeadView from "views/newHome/graphHeaders";
import { applyAuthorizations } from "models/referential/configDash";
import notAuthStat from "views/notAuth/notAuthStat";
// import { getTitle } from "models/utils/home/utils";

export function getTabDash(app, id) {
  return tabComponentsTraffic(app, id)[id];
}

// /**
//  * GET TABS
//  */
// export function getTabs(app, tabs) {
//   return tabs.map((e) => getTab(app, e.id, e.title_id, e.kpi, e.data));
// }
// /**
//  * GET TAB
//  */
// export function getTab(app, tab_id, title_id, kpi, data) {
//   return {
//     id: tab_id,
//     header: getTitle(title_id),
//     body: getComponentTraffic(app, tab_id, kpi, data),
//   };
// }

/**
 * GET PANELS
 */
export function getPanels(app, menu_id, tab, kpi) {
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
      header: new GraphHeadView(app, "", e.id + "_" + kpi, kpi),
      disabled: !(authrz_panel.indexOf(e.id) != -1),
      body: {
        type: "clean",
        margin: 0,
        ...getPanel(app, menu_id, e, authorized, kpi),
      },
      css: { "background-color": "#fff" },
    };
  });
}

/**
 * GET PANEL
 */
export function getPanel(app, menu_id, panel, authorized, kpi) {
  let doc = {};
  doc[panel.arrange] = getDashs(app, panel.dashs, authorized, kpi);
  return doc;
}

/**
 * GET DASHS
 */

function getDashs(app, dashs, authorized, kpi) {
  return dashs.map((dash) => {
    let doc = {};
    doc[dash.arrange] = getChilds(app, dash.childs, authorized, kpi).filter(
      (e) =>
        (typeof e == "object" && Object.keys(e).length != 0) ||
        typeof e == "function"
    );

    return doc;
  });
}

/**
 * GET CHILD
 */
function getChilds(app, childs, authorized, kpi) {
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
                new PeriodSelector(
                  app,
                  "",
                  f.period_prefix + kpi,
                  f.nb_period_select
                ),
                getComponent(app, f.id, "dash", kpi),
              ]
            : [],
      };
    } else {
      return authorized.indexOf(f.id) != -1
        ? getComponent(app, f.id, "dash", kpi)
        : {};
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
        ? getComponent(app, e.id, "stats")
        : new notAuthStat(app, "", menu_id, e.id),
  }));
}
