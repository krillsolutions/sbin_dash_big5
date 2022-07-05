import { urls } from "models/referential/genReferentials";
import ServerController from "controllers/serverController";
import { MonitorServerManager } from "models/utils/server/ServerManager";
import EventController from "controllers/viewController";

// new MonitorServerManager(urls.api_url);
new MonitorServerManager(host);

const monitor_stats = new webix.DataCollection({
  id: "monitor_stats",
  url: function (params) {
    return ServerController.getData("monitor", "getStat", "vue1");
  },
});

const monitor_tab = new webix.DataCollection({
  id: "monitor_tab",
  url: function (params) {
    return ServerController.getData("monitor", "getMonTab", "vue1");
  },
});

const monitor_line = new webix.DataCollection({
  id: "monitor_line",
  url: function (params) {
    return ServerController.getData("monitor", "getMonLine", "vue1");
  },
});
/*
const monitor_kpi_tab = new webix.DataCollection({
    id : 'monitor_kpi_tab',
    url :  function(params) { return ServerController.getData('monitor', 'getMonTab', 'vue2')}
});

const monitor_kpi_line = new webix.DataCollection({
    id : 'monitor_kpi_line',
    url :  function(params) { return ServerController.getData('monitor', 'getMonLine', 'vue2')}
});


const monitor_kpi_slot_bar = new webix.DataCollection({
        id : 'bar_slot_kpi_trend',
        url :  function(params) { return ServerController.getData('monitor', 'getMonLine', 'vue3')}
    });
*/
export function getMonChartData(type) {
  switch (type) {
    case "mon_stats":
      return monitor_stats;
      break;
    case "mon_tab":
      return monitor_tab;
      break;
    case "line_trend":
      return monitor_line;
      break;

    /*            case 'mon_kpi_tab':
                        return monitor_kpi_tab;
                        break;
                case 'line_kpi_trend':
                        return monitor_kpi_line;
                        break;
                        
                case 'bar_slot_kpi_trend':
                        return monitor_kpi_slot_bar
                        break;*/

    default:
      break;
  }
}

function getAllParcData() {
  return [
    { type: "vue1", data: monitor_stats, func: "getStat" },
    { type: "vue1", data: monitor_tab, func: "getMonTab" },
    { type: "vue1", data: monitor_line, func: "getMonLine" },
  ];
}

for (const elm of getAllParcData()) {
  elm.data._menu = "monitor";
  elm.data._func = elm.func;
  elm.data._param = elm.type;
  elm.data.attachEvent("onFilterData", EventController.onFiterClicked);
}
