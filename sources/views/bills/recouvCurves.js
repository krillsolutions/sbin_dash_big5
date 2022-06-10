import { JetView } from "webix-jet";
import * as ech from "views/newHome/echart_cmp_dataset";
import {
  components,
  filter_ref,
} from "../../models/referential/genReferentials";
import { getBillsChartData } from "../../models/data/bills/data";
import {
  getDates,
  getMonthsFromDate,
  updateChartReady,
} from "../../models/utils/general/utils";

export default class RecouvreCurveView extends JetView {
  constructor(app, name, type) {
    super(app, name);
    this._type = type;
  }

  config() {
    let type_fact = this._type,
      obj = this;
    return {
      view: "echarts-grid-dataset",
      id: "recouv:vue2:curve:" + type_fact,
      beforedisplay: function (dat, conf, echart_obj) {
        let months = getMonthsFromDate(getDates()["d2"], recouvr_months_offset); //.sort((a,b) => b>a ? 1 : -1)
        let data = [...dat],
          prod = obj.getRoot()._current_prod;

        //let products = data.filter(d => d.period == period && d.fact == type_fact).map(d => d.product).filter((d,i,ar) => ar.indexOf(d) == i)
        let series = [],
          dataset = [],
          xaxis = [];
        data.sort((a, b) => (b.month < a.month ? 1 : -1));
        xaxis = data
          .filter((d) => d.type == type_fact && d.product == prod)
          .map((d) => d.month)
          .filter((d, i, ar) => ar.indexOf(d) == i);
        months.forEach((p, i) => {
          dataset.push({
            dimensions: ["month", "P_" + (months.length - 1 - i)],
            source: data.filter(
              (d) => d.type == type_fact && d.product == prod
            ),
          });

          series.push({
            type: "line",
            name: p,
            encode: { x: "month", y: "P_" + (months.length - 1 - i) },
            datasetIndex: dataset.length - 1,
            _isStack: true,
          });
        });
        //conf.title[0].text = period
        conf.series = [...series];
        conf.dataset = [...dataset];
        conf.xAxis[0].data = xaxis;
      },

      options: {
        tooltip: {
          trigger: "axis",
          show: true,
          position: function (pos, params, el, elRect, size) {
            var obj = { top: 10 };
            obj[["left", "right"][+(pos[0] < size.viewSize[0] / 2)]] = 30;
            return obj;
          },
          backgroundColor: "rgba(40, 40, 40, 0.6)",
          textStyle: { color: "#fff" },
          z: 100,
          borderWidth: 1,
          padding: 10,
        },
        legend: {
          show: true,
          top: 5,
          type: "scroll",
          textStyle: { fontSize: 10 },
        },

        title: [
          {
            text: "Evolution du recouvrement",
            left: "25%",
            top: 25,
            textAlign: "center",
            textStyle: {
              fontSize: 12,
            },
          },
        ],

        dataset: [],
        grid: {
          left: 35,
          bottom: 30,
          containLabel: true,
        },
        xAxis: [
          {
            axisLabel: { show: true },
            axisTick: { show: true },
            type: "category",
            nameLocation: "middle",
            nameTextStyle: {
              verticalAlign: "top",
              lineHeight: 30,
            },
            name: "Mois d'observation",
          },
        ],
        yAxis: [
          {
            type: "value",
            splitLine: {
              show: true,
            },
          },
        ],
        series: [],
      },
    };
  }

  init(view) {
    view.showProgress();
    view.disable();
    components["bills"].push({
      cmp: view.config.id,
      data: getBillsChartData("recouvDecTab").config.id,
    });

    Promise.resolve(filter_ref).then((filter_ref) => {
      //   view._current_prod = filter_ref["filters"]["p"]["options"][0].id
      //     ? filter_ref["filters"]["p"]["options"][0].id
      //     : filter_ref["filters"]["p"]["options"][0];
      view._current_prod = filter_ref["filters"]["p"]["options"][0];
    });

    //if(!getBillsChartData("recouvDecTab").data.getRange)
    getBillsChartData("recouvDecTab").waitData.then((d) => {
      view._isDataLoaded = 1;
      view.parse(getBillsChartData("recouvDecTab"));
      view.enable();
      view.hideProgress();
    });

    view.data.attachEvent("onStoreLoad", function () {
      updateChartReady(view.config.id);
    });
  }
}
