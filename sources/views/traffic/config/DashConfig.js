import TraffByOfferView from "views/traffic/TrafficByOffer";
import TraffByTypeTrendView from "views/traffic/TrafficByTypeTrend";
import TraffIntView from "views/traffic/TrafficIntSplit";
import TraffIntGeoView from "views/traffic/TrafficIntGeo";
import TraffByDestView from "views/traffic/TrafficByDest";
import TraffByOPView from "views/traffic/TrafficByOP";
import DataParcView from "views/traffic/parcData";
import TraffDataSiteView from "views/traffic/TraffDataBySite";
import TraffDataByDestView from "views/traffic/TraffDataByType";
import DataSplitTypetSplitView from "views/traffic/trafficDataByType";

export function dashComponentsTraffic(app, kpi) {
  return {
    traff_by_offer: new TraffByOfferView(app, "", kpi),
    traff_by_type_trend: new TraffByTypeTrendView(app, "", kpi),
    traff_int: new TraffIntView(app, "", kpi),
    traff_int_geo: new TraffIntGeoView(app, "", kpi),
    traff_by_dest: new TraffByDestView(app, "", kpi),
    traff_by_op: new TraffByOPView(app, "", kpi),
    data_parc: DataParcView,
    traff_data_site: TraffDataSiteView,
    traff_data_by_dest: TraffDataByDestView,
    data_split_type_split: DataSplitTypetSplitView,
  };
}
