import { JetView } from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {
  components,
  color_ref,
  dash_titles,
} from "models/referential/genReferentials";
import { getTraffChartData } from "models/data/traffic/data";
import {
  kFormatter,
  updateChartReady,
  formatter,
} from "models/utils/home/utils";
export default class TraffByDestView extends JetView {
  constructor(app, name, kpi) {
    super(app, name);
    this._kpi = kpi;
    // console.log(kpi);
  }

  config() {
    let kp = this._kpi;
    return color_ref.then((color_ref) => {
      return {
        view: "echarts-grid-dataset",
        id: "traff:" + kp + ":vue1:dest",
        //		minHeight : 195,
        animation: true,
        beforedisplay: function (dat, conf, echart_obj) {
          let series = [],
            dataset = [],
            tr_type = [],
            xAxis = [];
          if (dat.length == 0) return;
          //                let _Type = ['onnet', 'offnet', 'international'];

          if (dat[0].upd_dt) {
            dat.sort((a, b) => (a.upd_dt > b.upd_dt ? 1 : -1));
          }
          let days = dat
            .map((d) => d.upd_dt)
            .filter((v, i, arr) => arr.indexOf(v) == i);
          dat.forEach((elm) => {
            if (!tr_type[elm.traff_cat]) tr_type[elm.traff_cat] = 0;
            tr_type[elm.traff_cat]++;
          });
          let _Type = Object.keys(tr_type)
            .map((k) => {
              return { t: k, cnt: tr_type[k] };
            })
            .sort((a, b) => (a.cnt > b.cnt ? -1 : 1))
            .map((d) => d.t);
          days.sort();
          xAxis = days;
          echart_obj.off("click");
          _Type.forEach((elm) => {
            if (dat[0]._type == "dt_trend") {
              dataset.push({
                dimensions: ["upd_dt", "traffic"],
                source: dat.filter(
                  (d) =>
                    d.traff_type == kp &&
                    d.traff_dir == "in" &&
                    d.traff_cat == elm
                ),
                isAdded: true,
              });
              series.push({
                type: "bar",
                stack: elm + "_split",
                itemStyle: {
                  color: function (para) {
                    return color_ref.traffic[kp + "_in"];
                  },
                },
                id: "traff_split_dest:in:" + elm + ":" + kp,
                datasetIndex: dataset.length - 1,
                barMinHeight: 10, //tooltip : {trigger : 'item'} ,
                _isStack: true,
                name: elm,
                encode: { x: "upd_dt", y: "traffic" },
              });

              dataset.push({
                dimensions: ["upd_dt", "traffic"],
                source: dat.filter(
                  (d) =>
                    d.traff_type == kp &&
                    d.traff_dir == "out" &&
                    d.traff_cat == elm
                ),
                isAdded: true,
              });
              series.push({
                type: "bar",
                stack: elm + "_split",
                id: "traff_split_dest:out:" + elm + ":" + kp,
                datasetIndex: dataset.length - 1,
                barMinHeight: 10, //tooltip : {trigger : 'item'} ,
                _isStack: true,
                name: elm,
                encode: { x: "upd_dt", y: "traffic" },
                itemStyle: {
                  color: function (para) {
                    return color_ref.traffic[kp + "_out"];
                  },
                },
              });
            }
          });

          conf.series = conf.series.filter(
            (d) => typeof d._isStack == "undefined"
          );
          conf.dataset = conf.dataset.filter(
            (d) => typeof d.isAdded == "undefined"
          );
          if (dataset.length != 0) conf.dataset = [...conf.dataset, ...dataset];
          if (series.length != 0) conf.series = series; //[...series, ...conf.series];
          if (dat[0]._type == "dt_trend")
            conf.legend["selectedMode"] = "single";
          conf.xAxis[0].data = xAxis;
        },
        options: {
          tooltip: {
            trigger: "axis",
            show: true,
            z: 2,
            formatter: function (param) {
              let rt = param[0].name + "<br/>";
              for (const elm of param) {
                rt +=
                  elm.marker +
                  elm.seriesId.split(":")[1] +
                  " : " +
                  formatter(elm.value.traffic) +
                  "<br/>";
              }
              return rt;
            },
          },
          legend: {
            show: true,
            itemGap: 20,
            top: "20",
            type: "scroll",
            textStyle: {
              fontSize: 10,
            } /*, orient : "vertical", top : '40', right : '20%'*/,
          },
          title: [
            {
              text: dash_titles["traffic"].traff_by_dest
                ? dash_titles["traffic"].traff_by_dest
                : "",
              //subtext : 'Revenu',
              left: "50%",
              textAlign: "center",
              textStyle: {
                fontSize: 12,
              },
            },
          ],
          dataset: [],

          xAxis: [
            {
              axisLabel: { show: true },
              axisTick: { show: true },
              type: "category",
            },
          ],
          yAxis: [
            {
              type: "value",
              axisLabel: {
                formatter: function (val, ind) {
                  return kFormatter(val);
                },
              },
              splitLine: {
                show: true,
              },
            },
          ],
          grid: [
            {
              left: 5,
              bottom: 5,
              //top : 40,
              containLabel: true,
            },
          ],
          series: [],
        },
      };
    });
  }

  init(view) {
    let kp = this._kpi;
    $$("traff:" + kp + ":vue1:dest").showProgress();
    $$("traff:" + kp + ":vue1:dest").disable();

    components["traffic"].push({
      cmp: "traff:" + kp + ":vue1:dest",
      data: getTraffChartData("traffic_dest").config.id,
    });
    getTraffChartData("traffic_dest").waitData.then((d) => {
      $$("traff:" + kp + ":vue1:dest")._isDataLoaded = 1;
      $$("traff:" + kp + ":vue1:dest").parse(getTraffChartData("traffic_dest"));
      $$("traff:" + kp + ":vue1:dest").enable();
      $$("traff:" + kp + ":vue1:dest").hideProgress();
    });

    $$("traff:" + kp + ":vue1:dest").data.attachEvent(
      "onStoreLoad",
      function () {
        updateChartReady("traff:" + kp + ":vue1:dest");
      }
    );
  }
}
