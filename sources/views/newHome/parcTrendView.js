import { JetView } from "webix-jet";
import * as ech from "views/newHome/echart_cmp_dataset";
import { components, dash_titles } from "models/referential/genReferentials";
import { getHomeChartData, getFiterDate } from "models/data/home/data_new";
import {
  formatter,
  getScreenType,
  kFormatter,
  updateChartReady,
} from "models/utils/home/utils";
import { getDates } from "models/utils/general/utils";
export default class HomeParcNewTrendView extends JetView {
  config() {
    return {
      view: "echarts-grid-dataset",
      id: "home:vue1:trend:parc",
      minHeight: 80,
      charts_event: {
        click: [
          { seriesId: "home:parc_split", seriesType: "bar" },
          function (params) {
            let tp =
              getScreenType() != "mobile" && getScreenType() != "mobile_rotated"
                ? true
                : false;
            if (!tp) {
              let obj = this;
              this.executeDoubleClick = setTimeout(function () {
                obj._clicked = false;
              }, 500);
              if (this._clicked) {
                tp = true;
                obj._clicked = false;
                clearTimeout(this.executeDoubleClick);
              }
            }
            if (!tp) {
              this._clicked = true;
              return;
            }
            $("button.ui.button.parcHome_" + periodSplit[1])
              .addClass("active")
              .siblings()
              .removeClass("active");

            if (!$$("home:vue1:trend:parc")._months)
              $$("home:vue1:trend:parc")._months = [];
            if (
              !$$("home:vue1:trend:parc")._months.some(
                (d) => d == params.data.month
              )
            ) {
              let dat = getFiterDate(
                "parc",
                "dt_trend",
                params.data.month + "-01"
              );
              $$("home:vue1:trend:parc").showProgress();
              $$("home:vue1:trend:parc").disable();
              dat.then((d) => {
                $$("home:vue1:trend:parc")._months.push(params.data.month);
                $$("home:vue1:trend:parc")._filter_level = "m";
                $$("home:vue1:trend:parc")
                  .parse(dat)
                  .then(() => {
                    $$("home:vue1:trend:parc").data.filter((d) => {
                      return (
                        d._type != "month_trend" &&
                        (d.period == params.data.month ||
                          d._type == "op_split" ||
                          d._type == "bill_split")
                      );
                    });
                  });

                $$("home:vue1:trend:parc")._current_month = params.data.month;
                $$("home:vue1:trend:parc").enable();
                $$("home:vue1:trend:parc").hideProgress();
              });
            } else {
              $$("home:vue1:trend:parc")._filter_level = "m";
              $$("home:vue1:trend:parc")._current_month = params.data.month;
              $$("home:vue1:trend:parc").data.filter((d) => {
                return (
                  d._type != "month_trend" &&
                  (d.period == params.data.month ||
                    d._type == "op_split" ||
                    d._type == "bill_split")
                );
              });
            }
          },
        ],
      },
      options: {
        tooltip: {
          trigger: "axis",
          show: true,
          axisPointer: { show: true },
          position: function (pos, params, el, elRect, size) {
            var obj = { top: 10 };
            obj[["left", "right"][+(pos[0] < size.viewSize[0] / 2)]] = 30;
            return obj;
          },
          formatter: function (param) {
            let rt = param[0].name + "<br/>";
            let dim = param[0].dimensionNames[1];
            rt += param[0].marker + formatter(param[0].data[dim]);
            return rt;
          },
        },
        grid: [
          {
            //height : '90%',
            left: 5,
            bottom: 5,
            top: 6,
            containLabel: true,
          },
        ],

        xAxis: [
          {
            type: "category",
            splitLine: {
              show: false,
            },
            axisPointer: {
              show: true,
            },
            axisTick: { show: true, alignWithLabel: true },
          },
        ],
        yAxis: [
          {
            type: "value",
            isDim: true,
            _type: "trend",
            _dim: "value",
            splitNumber: 4,
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
        title: [
          {
            text: dash_titles["parc"]["parc_trend"],
            top: 5,
            left: "50%",
            textAlign: "center",
            textStyle: {
              fontSize: 12,
            },
          },
        ],
        dataset: [
          {
            dimensions: ["month", "trend"],
          },
          {
            dimensions: ["upd_dt", "trend_dt"],
          },
        ],
        series: [
          {
            type: "line",
            encode: { x: "month", y: "trend" },
            datasetIndex: 0,
            _type: "month_trend",
            id: "home:parc_split",
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "blue",
                  },
                  {
                    offset: 1,
                    color: "white",
                  },
                ],
                global: false,
              },
            },
            smooth: true,
            lineStyle: {
              color: "blue",
              width: 2.5,
            },
            itemStyle: {
              color: "blue",
            },
            z: 3,
          },
          {
            type: "line",
            encode: { x: "upd_dt", y: "trend_dt" },
            _type: "dt_trend",
            datasetIndex: 1,
            barMaxWidth: 20,
            barMinHeight: 10,
            itemStyle: { color: "blue" },
          },
        ],
      },
    };
  }

  init(view) {
    $$("home:vue1:trend:parc").showProgress();
    $$("home:vue1:trend:parc").disable();
    components["home"].push({
      cmp: "home:vue1:trend:parc",
      data: getHomeChartData("parc_trend").config.id,
    });
    $$("home:vue1:trend:parc")._months = [];
    $$("home:vue1:trend:parc")._current_month = getDates()["d1"].substr(0, 7);
    $$("home:vue1:trend:parc")._filter_level = "a";
    getHomeChartData("parc_trend").waitData.then((d) => {
      $$("home:vue1:trend:parc")._isDataLoaded = 1;
      $$("home:vue1:trend:parc").parse(getHomeChartData("parc_trend"));
      $$("home:vue1:trend:parc").enable();
      $$("home:vue1:trend:parc").hideProgress();
    });

    $$("home:vue1:trend:parc").data.attachEvent("onStoreLoad", function () {
      updateChartReady("home:vue1:trend:parc");
    });

    getHomeChartData("parc_trend").data.attachEvent("onClearAll", function () {
      if ($$("top:menu").getSelectedId() == "home") {
        $$("home:vue1:trend:parc")._months = [];
        $$("home:vue1:trend:parc")._current_month = getDates()["d1"].substr(
          0,
          7
        );
        $$("home:vue1:trend:parc")._filter_level = "a";
      }
    });
  }

  ready(view) {
    $$("parcHome").attachEvent("onAfterRender", function () {
      $("button.ui.button.parcHome_" + periodSplit[1]).on("click", function () {
        if (view._filter_level == "a") {
          view._filter_level = "m";
          if (!view._months.some((d) => d == view._current_month)) {
            let dat = getFiterDate(
              "parc",
              "dt_trend",
              view._current_month + "-01"
            );
            view.showProgress();
            view.disable();
            dat.then((d) => {
              view._months.push(view._current_month);
              view.parse(dat).then(() => {
                view.data.filter((d) => {
                  return (
                    d._type != "month_trend" &&
                    (d.period == view._current_month ||
                      d._type == "op_split" ||
                      d._type == "bill_split")
                  );
                });
              });

              view._current_month = view._current_month;
              view.enable();
              view.hideProgress();
            });
          } else
            view.data.filter((d) => {
              return (
                d._type != "month_trend" &&
                (d.period == view._current_month ||
                  d._type == "op_split" ||
                  d._type == "bill_split")
              );
            });
        }
      });

      $("button.ui.button.parcHome_" + periodSplit[0]).on("click", function () {
        if (view)
          if (view._filter_level == "m") {
            view._filter_level = "a";
            view.data.filter((d) => d._type != "dt_trend");
          }
      });
    });
  }
}
