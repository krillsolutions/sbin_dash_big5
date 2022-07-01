import { JetView } from "webix-jet";
import { filter_ref } from "../../models/referential/genReferentials";

export default class RecouvCarControl extends JetView {
  constructor(app, name, fact) {
    super(app, name);
    this._fact = fact;
  }

  config() {
    return {
      view: "select",
      id: "recouv:control:" + this._fact,
      label: "Produit",
      labelAlign: "right",
      inputWidth: 200,
      align: "left",
      inputHeight: 25,
      css: { "font-size": "12px" },
      options: [],
      height: 30,
    };
  }

  init(view) {
    let fact = this._fact;
    filter_ref.then((filter_ref) => {
      let prd_options = [];

      if (filter_ref["filters"]["p"]["options"][0]) {
        prd_options = filter_ref["filters"]["p"]["options"][0].values;
      }

      view.define("options", prd_options);
    });

    view.define("on", {
      onChange: (n, o) => {
        if ($$("recouvr:vue2:decay:" + this._fact)) {
          $$("recouvr:vue2:decay:" + this._fact)._current_prod = n;
          $$("recouvr:vue2:decay:" + this._fact).filter(
            (d) => d.product == n && d.type == fact
          );
        }
        if ($$("recouv:vue2:curve:" + this._fact)) {
          $$("recouv:vue2:curve:" + this._fact)._current_prod = n;
          $$("recouv:vue2:curve:" + this._fact).render();
        }
      },
    });
  }
}
