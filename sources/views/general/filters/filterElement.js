import { JetView } from "webix-jet";
import { filter_ref } from "models/referential/genReferentials";
import EventController from "controllers/viewController";
import { getScreenType } from "models/utils/home/utils";
export default class FiltersView extends JetView {
  constructor(app, name, type) {
    super(app, name);
    this._type = type;
  }
  config() {
    let type = this._type;
    return {
      localId: type + "_filt",
      view:
        getScreenType() != "mobile" && getScreenType() != "mobile_rotated"
          ? "multicombo"
          : "multiselect",
      tagMode: false,
      stringResult: true,
    };
  }
  init(view) {
    var type = this._type;
    const _this = this;
    let filter_data = webix.storage.session.get("filter");
    filter_ref.then((filter_ref) => {
      var options_filter = [
        // filter_ref["filters"][type].default,
        ...filter_ref["filters"][type].options[0].values,
      ];
      // console.log(options_filter);
      this.$$(type + "_filt").define("suggest", {
        button: true,
        selectAll: true,
        data: options_filter,
      });
      this.$$(type + "_filt").define("label", filter_ref["filters"][type].desc);
      if (typeof filter_data[type] == "undefined")
        this.$$(this._type + "_filt").define("value", options_filter.join(","));
      else this.$$(this._type + "_filt").define("value", filter_data[type]);

      view.define(
        "placeholder",
        // filter_ref["filters"][type].options[0].op == "all"
        // ?
        filter_ref["filters"][type].default
        // : filter_ref["filters"][type].options[0].length
      );

      view.define("tagTemplate", function (values) {
        if (values.length) {
          if (
            values.length ==
              filter_ref["filters"][type].options[0].values.length &&
            filter_ref["filters"][type].options[0].op == "all"
          )
            return filter_ref["filters"][type].default;
          else return values.length + " " + filter_ref["filters"][type].desc;
        }

        return filter_ref["filters"][type].default;
      });

      view.define("on", {
        onChange: function (newV, oldV) {
          // if (newV.length != filter_ref["filters"][type].options.length)
          EventController.callEvent("filter", "change", type, newV);
          // else EventController.callEvent("filter", "change", type, "");
        },
      });
      this.$$(this._type + "_filt").refresh();
    });
  }
}
