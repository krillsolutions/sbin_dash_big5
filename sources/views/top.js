import { JetView, plugins } from "webix-jet";
import { refData } from "models/referential/genReferentials";
import SideMenuView from "views/general/sidemenu";
import HeadBarView from "views/general/headerToolBar";
import MobileHeadToolBar from "views/general/mobileheadtoolbar";
import FilterMenuView from "views/general/filters/filterMenue";
import { boot, gconfig } from "models/utils/general/boot";
import {
  setLabels,
  setScreenType,
  getScreenType,
} from "models/utils/general/utils";
import { initUserSession } from "models/data/userSession";
export default class TopView extends JetView {
  config() {
    // var obj = this;

    return initUserSession(this.app).then(function (response) {
      var authrz_app = response.authrz.filter((e) => e.split(".")[0] == app_id);
      webix.storage.local.put("authorizations", authrz_app);
      authorizations = webix.storage.local.get("authorizations");
      /**
       * BEGIN FILTER MAPPING
       */
      const keys = Object.keys(response.filters);
      keys.forEach((key) => {
        response.filters[key]["values"] = Object.values(
          response.filters[key]["values"]
        );
      });
      /**
       * END FILTER MAPPING
       */
      myFilters = response.filters;
      console.log(authorizations);
      console.log(myFilters);

      boot();
      return refData.waitData.then(() => {
        let ui = {
          rows: [
            getScreenType() == "mobile" || getScreenType() == "mobile_rotated"
              ? MobileHeadToolBar
              : HeadBarView, //HeadBarView,
            {
              cols: [
                { $subview: SideMenuView },
                {
                  type: "space",
                  margin: 5,
                  css: "app-right-panel",
                  padding: 4,
                  rows: [{ $subview: true }],
                },
              ],
            },
            {
              template: "<p class='title'></b></p>",
              height: 20,
              css: "footer",
            },
          ],
        };
        return ui;
      });
    });
  }

  init(view) {
    initUserSession(this.app);
    gconfig["app"] = this.app;
    setScreenType();
    webix.protoUI(
      {
        name: "c-dashboard",
        isDragNode: function (target) {
          var css = (target.className || "").toString();
          //check for webix header and look up
          if (css.indexOf("webix_header") != -1) return target;
          if (target.parentNode && target != this.$view)
            return this.isDragNode(target.parentNode);
          return false;
        },
        $dragCreate: function (object, e) {
          //check for header
          if (!this.isDragNode(e.target)) return false;
          //if ok, call parent logic
          return webix.ui.dashboard.prototype.$dragCreate.apply(
            this,
            arguments
          );
        },
      },
      webix.ui.dashboard
    );

    webix.protoUI(
      {
        name: "m-dashboard",
        isDragNode: function (target) {
          var css = (target.className || "").toString();
          //check for webix header and look up
          if (css.indexOf("webix_header") != -1) return target;
          if (target.parentNode && target != this.$view)
            return this.isDragNode(target.parentNode);
          return false;
        },
        $dragCreate: function (object, e) {
          //check for header
          return false;
          //if (!this.isDragNode(e.target)) return false;
          //if ok, call parent logic
          //return webix.ui.dashboard.prototype.$dragCreate.apply(this, arguments);
        },
      },
      webix.ui.dashboard
    );

    this._jetFiltMenu = this.ui(FilterMenuView);
    refData.waitData.then(() => {
      const refs = refData.getItem(refData.getFirstId());
      if (getScreenType() != "mobile" && getScreenType() != "mobile_rotated") {
        $$("dashtitle").define(
          "label",
          "<span style='color:#fff;'" +
            (getScreenType() == "mobile" ? "font-size:10px" : "") +
            " >" +
            (getScreenType() == "mobile" ? "" : refs.dashTitle) +
            "</span>"
        );
        $$("dashtitle").refresh();
      }
      setLabels();
    });
    gconfig["mobileMenuhide"] =
      webix.storage.session.get("mobileMenuhide") == null
        ? false
        : webix.storage.session.get("mobileMenuhide");
    webix.event(window, "resize", function () {
      if (getScreenType() != webix.storage.session.get("screenType"))
        setScreenType();
    });

    webix.DataStore.prototype.sorting.as.abs_sort = function (a, b) {
      return Math.abs(a) > Math.abs(b) ? 1 : -1;
    };
    //webix.Touch.disable();
    webix.Touch.limit(true);
  }
}
