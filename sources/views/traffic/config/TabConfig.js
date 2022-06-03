import TraficByTypeGraphDashView from "views/traffic/TrafficDash";
import TraficDataGraphDashView from "views/traffic/DataTrafficDash";

export function tabComponentsTraffic(app, id) {
  return {
    "tab:voix": new TraficByTypeGraphDashView(
      app,
      "",
      "voice",
      "trafficvoix",
      id
    ),
    "tab:sms": new TraficByTypeGraphDashView(app, "", "sms", "trafficsms", id),
    "tab:data": new TraficDataGraphDashView(app, "", id),
  };
}
