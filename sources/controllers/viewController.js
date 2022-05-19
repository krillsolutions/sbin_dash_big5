import { showProcess } from "models/utils/general/utils";
import { components } from "models/referential/genReferentials";
import { setLabels } from "models/utils/general/utils";
import ServerController from "controllers/serverController";
export default class EventController {
  static callEvent(elmt, type, filter, value) {
    switch (elmt) {
      case "filter":
        let filter_obj = webix.storage.session.get("filter");
        if (typeof value != "undefined" && value != "") {
          if (filter == "datef") {
            filter_obj["d1"] = webix.Date.dateToStr("%Y-%m-%d")(value.start);
            filter_obj["d2"] =
              value.end != null
                ? webix.Date.dateToStr("%Y-%m-%d")(value.end)
                : webix.Date.dateToStr("%Y-%m-%d")(value.start);
          } else {
            filter_obj[filter] = value.join(",");
          }
        } else {
          // delete filter_obj[filter];
          if (myFilters[filter]["op"] == "all") {
            delete filter_obj[filter];
          } else if (myFilters[filter]["values"].length > 0) {
            console.log(myFilters[filter]["values"].join(","));
            filter_obj[filter] = myFilters[filter]["values"].join(",");
          }
        }
        webix.storage.session.put("filter", filter_obj);

        break;

      case "filterButton":
        if (type == "click") {
          setLabels();
          EventController.loadData();
        }
        break;
    }
  }

  static loadData() {
    let menu = $$("top:menu").getSelectedItem().id;
    let dat = [],
      comp = [];
    components[menu].forEach((element) => {
      if (!dat.some((d) => d == element.data)) {
        if (typeof $$(element.data) != "undefined")
          $$(element.data).callEvent("onFilterData", [
            menu,
            $$(element.data)._func,
            $$(element.data)._param,
            $$(element.data)._params ? $$(element.data)._params : "",
          ]);
        comp.push($$(element.data).waitData);
        dat.push(element.data);
      }
    });

    showProcess(menu);

    webix.promise.all(comp).then(() => {
      for (const mn in components) {
        if (mn == menu) continue;
        const element = components[mn];
        element.forEach((elm) => {
          if (typeof $$(elm.data) != "undefined") {
            if (!dat.some((d) => d == elm.data)) {
              $$(elm.data).callEvent("onFilterData", [
                $$(elm.data)._menu,
                $$(elm.data)._func,
                $$(elm.data)._param,
                $$(elm.data)._params ? $$(elm.data)._params : "",
              ]);
              dat.push(elm.data);
            }
          }
        });
      }
    });
  }
  static onFiterClicked(menu, func, type, params) {
    let obj = this.$eventSource || this;

    obj.clearAll();
    obj.parse(ServerController.getData(menu, func, type, params));
  }
}
