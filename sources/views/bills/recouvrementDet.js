import { JetView } from "webix-jet";
import * as ech from "views/newHome/echart_cmp_dataset";
import {
  color_ref,
  components,
} from "../../models/referential/genReferentials";
import { getBillsChartData } from "../../models/data/bills/data";
import {
  getDates,
  getMonthsFromDate,
  updateChartReady,
} from "../../models/utils/general/utils";

export default class RecouvreDetView extends JetView {
  constructor(app, name, period, type) {
    super(app, name);
    this._period = period;
    this._type = type;
  }

  config() {
    let type_fact = this._type,
      obj = this;
    let mths = getMonthsFromDate(getDates()["d1"], recouvr_months_offset);
    if (!mths[this._period]) return {};
    let periodIndex = this._period;
    let periodTitle = mths[obj._period];
    return webix.promise.all([color_ref]).then((data) => {
      let color_ref = data[0];
      return {
        view: "echarts-grid-dataset",
        id: "recouv:vue2:period:" + periodIndex + ":" + type_fact,
        beforedisplay: function (dat, conf, echart_obj) {
          let months = getMonthsFromDate(
            getDates()["d1"],
            recouvr_months_offset
          );
          let period = months[obj._period];
          let data = [...dat];
          let products = data
            .filter((d) => d.period == period && d.fact == type_fact)
            .map((d) => d.product)
            .filter((d, i, ar) => ar.indexOf(d) == i);
          let series = [],
            dataset = [],
            xaxis = [];
          data.sort((a, b) => (b.month < a.month ? 1 : -1));
          xaxis = data
            .filter((d) => d.period == period && d.fact == type_fact)
            .map((d) => d.month)
            .filter((d, i, ar) => ar.indexOf(d) == i);
          products.forEach((p) => {
            dataset.push({
              dimensions: ["month", "value"],
              source: data.filter(
                (d) =>
                  d.period == period && d.product == p && d.fact == type_fact
              ),
            });

            series.push({
              type: "line",
              _type: p,
              name: p,
              _kpi: period,
              encode: { x: "month", y: "value" },
              datasetIndex: dataset.length - 1,
              _isStack: true,
              lineStyle: { color: color_ref.parcOff[p] },
              itemStyle: { color: color_ref.parcOff[p] },
            });
          });
          conf.title[0].text = period;
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
              text: periodTitle,
              left: 40,
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
    });
  }

  init(view) {
    let mths = getMonthsFromDate(getDates()["d1"], recouvr_months_offset);

    if (!mths[this._period]) return;
    view.showProgress();
    view.disable();
    components["bills"].push({
      cmp: view.config.id,
      data: getBillsChartData("prodRec").config.id,
    });

    //if(!getBillsChartData("prodRec").data.getRange)
    getBillsChartData("prodRec").waitData.then((d) => {
      view._isDataLoaded = 1;
      view.parse(getBillsChartData("prodRec"));
      view.enable();
      view.hideProgress();
    });

    view.data.attachEvent("onStoreLoad", function () {
      updateChartReady(view.config.id);
    });
  }
}
