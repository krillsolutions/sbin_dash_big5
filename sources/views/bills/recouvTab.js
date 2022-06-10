import { JetView } from "webix-jet";
import {
  getDates,
  getMonthsFromDate,
  updateChartReady,
} from "../../models/utils/general/utils";
import { getBillsChartData } from "../../models/data/bills/data";
import {
  components,
  filter_ref,
} from "../../models/referential/genReferentials";

export default class RecouvTableView extends JetView {
  constructor(app, name, fact) {
    super(app, name);
    this._fact_type = fact;
  }

  config() {
    let mths = getMonthsFromDate(
        getDates()["d2"],
        recouvr_months_offset
      ).sort(),
      cols = [
        {
          id: "month",
          header: {
            height: 20,
            text: "Mois d'observation",
            css: { "text-align": "center" },
          },
          adjust: true,
          css: {
            "background-color": "#ffffdd",
            "text-align": "center",
            "font-family": "Roboto, sans-serif",
            "font-size": "12px",
          },
        },
      ],
      m_size = mths.length - 1;

    mths.forEach((m, i) => {
      if (i == 0)
        cols.push({
          id: "P_" + (m_size - i),
          adjust: true,
          header: [
            {
              text: "Mois de création",
              colspan: m_size + 1,
              css: { "text-align": "center" },
            },
            { text: m, css: { "text-align": "center" } },
          ],
          css: {
            "text-align": "center",
            "font-family": "Roboto, sans-serif",
            "font-size": "12px",
          },
        });
      else
        cols.push({
          id: "P_" + (m_size - i),
          adjust: true,
          header: [
            "",
            {
              text: m,
              css: { "text-align": "center" },
            },
          ],
          css: {
            "text-align": "center",
            "font-family": "Roboto, sans-serif",
            "font-size": "12px",
          },
          fillspace: 1,
        });
    });

    return {
      view: "datatable",
      id: "recouvr:vue2:decay:" + this._fact_type,
      leftSplit: 1,
      select: true,
      borderless: false,
      rowHeight: 20,
      css: "webix_data_border webix_header_border",
      columns: cols,
    };
  }

  init(view) {
    var fact = this._fact_type;
    webix.extend(view, webix.ProgressBar);
    view.showProgress();
    view.disable();
    components["bills"].push({
      cmp: "recouvr:vue2:decay",
      data: getBillsChartData("recouvDecTab").config.id,
    });
    view._isDataLoaded = 0;

    Promise.resolve(filter_ref).then((filter_ref) => {
      //   view._current_prod = filter_ref["filters"]["p"]["options"][0].id
      //     ? filter_ref["filters"]["p"]["options"][0].id
      //     : filter_ref["filters"]["p"]["options"][0];
      view._current_prod = filter_ref["filters"]["p"]["options"][0];
    });

    getBillsChartData("recouvDecTab").waitData.then(function (d) {
      //let data = [...getBillsChartData("recouvDecTab").data.getRange()].filter(d => d.type == fact).sort((a,b) => (b<a? 1: -1))

      view.parse(getBillsChartData("recouvDecTab"));
      view._isDataLoaded = 1;
      view.enable();
      view.hideProgress();
    });

    getBillsChartData("recouvDecTab").attachEvent("onAfterLoad", () => {
      if (
        $$("top:menu").getSelectedId() == "bills" &&
        view._isDataLoaded == 1
      ) {
        // view.filter(d => d.type == fact )
        let mths = getMonthsFromDate(
          getDates()["d2"],
          recouvr_months_offset
        ).sort((a, b) => (b < a ? 1 : -1));
        mths.forEach((m, i) => {
          view.config.columns[i + 1].header[1].text = m;
        });
        view.refreshColumns();
        view.enable();
        view.hideProgress();
      }
    });

    getBillsChartData("recouvDecTab").attachEvent("onBeforeLoad", () => {
      if (
        $$("top:menu").getSelectedId() == "bills" &&
        view._isDataLoaded == 1
      ) {
        view.disable();
        view.showProgress();
      }
    });

    view.data.attachEvent("onStoreLoad", function () {
      let prod = view._current_prod;
      view.filter((d) => d.type == fact && d.product == prod);
      view.sort((a, b) => (b.month < a.month ? 1 : -1));
      view.disable();
      view.showProgress();
      //updateChartReady("recouvr:vue2:decay:"+fact);
    });
  }
}
