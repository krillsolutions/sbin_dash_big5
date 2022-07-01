import PeriodSelector from "views/others/periodSelector";
import { getComponent } from "views/revenue/config/refDash";
import GraphHeadView from "views/newHome/graphHeaders";
import { applyAuthorizations } from "models/referential/configDash";
import notAuthStat from "views/notAuth/notAuthStat";
// import notAuthDash from "views/notAuth/NotAuthDash";

/**
 * GET PANELS
 */
export function getPanels(app, menu_id, tab) {
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
}

/**
 * GET DASHS
 */

function getDashs(app, menu_id, dashs, authorized) {
  return dashs.map((dash) => {
    let doc = {};
    doc[dash.arrange] = getChilds(app, menu_id, dash.childs, authorized).filter(
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
                getComponent("", f.id, "dash"),
              ]
            : [],
      };
    } else {
      return authorized.indexOf(f.id) != -1
        ? getComponent("", f.id, "dash")
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
