import {JetView} from "webix-jet";
import GraphHeadView from "views/home/graphHeaders";
import TraffDataSiteView from "views/traffic/TraffDataBySite";
import TraffDataByDestView from "views/traffic/TraffDataByType";
import PeriodSelector from "views/others/periodSelector";
import TraffByTypeTrendView from "views/traffic/TrafficByTypeTrend";
import TraffByOfferView from "views/traffic/TrafficByOffer"
import DataParcView from "views/traffic/parcData";
import DataSplitTypetSplitView from "views/traffic/trafficDataByType";
import {getScreenType, getScreenTypeByMenu, setScreenTypeByMenu} from "models/utils/home/utils";
//import {gconfig} from "models/utils/general/boot";
export default class TraficDataGraphDashView extends JetView{



	config ()
        
	{

        const kpi = 'data'
		var gridColumns,
			gridRows,
			 cells = [];
                var config = {
                        view:(getScreenType() != "mobile" && getScreenType() != "mobile_rotated")?  "c-dashboard" : "m-dashboard",
                //      id : "traffic:dash:"+kpi,
                        margin : 5,
                        padding : 5,
                        cells : cells,
                        css : {"background-color" : "#EBEDF0"}
                };		
			switch(getScreenType()) {
                      /*          case 'mobile' :
                                        gridColumns = 2;
                                        gridRows = 8;
                                        cells.push({ view:"panel", x:0, y:0, dx:2, dy:2, resize:true,header : new GraphHeadView(this.app, "", "traffic_geo_orange_data"),
                                                body : {rows : [TrafDataGeoControlView, new TrafficGeoView(this.app, "","data")]},css : { "background-color":"#fff"}});
                                        cells.push({ view:"panel", x:0, y:2, dx:2, dy:2, resize:true,header : new GraphHeadView(this.app, "", "parc_data"),
                                                body : TraffParcTrendView,  css : { "background-color":"#fff"}});
                                        cells.push({ view:"panel", x:0, y:4, dx:2, dy:2, resize:true, header : new GraphHeadView(this.app, "", "traffic_data_type"),
                                                body : new TraffByTypeTrendView(this.app, "", 'data'), css : { "background-color":"#fff"}});
                                        cells.push({ view:"panel", x:0, y:6, dx:2, dy:2, resize:true, header : new GraphHeadView(this.app, "", "traffic_other_data"),
                                                body : {type : 'clean', margin : 0, rows : [DataSplitTypetSplitView,  new TraffByOfferView(this.app, "", 'data') ]} , css : { "background-color":"#fff"}});
                                        config['minHeight'] = 1500;

                                break;			
                                case 'mobile_rotated' :
                                        gridColumns = 4;
                                        gridRows = 5;

					cells.push({ view:"panel", x:0, y:0, dx:2, dy:3, resize:true,header : new GraphHeadView(this.app, "", "traffic_geo_orange_data"),
                                                body : {rows : [TrafDataGeoControlView, new TrafficGeoView(this.app, "","data")]},css : { "background-color":"#fff"}});

					cells.push({ view:"panel", x:2, y:0, dx:2, dy:3, resize:true, header : new GraphHeadView(this.app, "", "traffic_other_data"),
                                                body : {type : 'clean', margin : 0, rows : [DataSplitTypetSplitView,  new TraffByOfferView(this.app, "", 'data') ]} , css : { "background-color":"#fff"}});

                                        cells.push({ view:"panel", x:0, y:3, dx:2, dy:2, resize:true,header : new GraphHeadView(this.app, "", "parc_data"),
                                                body : TraffParcTrendView,  css : { "background-color":"#fff"}});
                                        cells.push({ view:"panel", x:2, y:3, dx:2, dy:2, resize:true, header : new GraphHeadView(this.app, "", "traffic_data_type"),
                                                body : new TraffByTypeTrendView(this.app, "", 'data'), css : { "background-color":"#fff"}});
                                        config['minHeight'] = 600;
                                break;					
				case 'small' :
                                        gridColumns = 9;
                                        gridRows = 3;
                                        cells.push({ view:"panel", x:0, y:0, dx:3, dy:3, resize:true,header : new GraphHeadView(this.app, "", "traffic_geo_orange_data"),
                                                body : {rows : [TrafDataGeoControlView, new TrafficGeoView(this.app, "","data")]},
                                                                css : { "background-color":"#fff"}});
                                        cells.push({ view:"panel", x:3, y:0, dx:2, dy:3, resize:true,header : new GraphHeadView(this.app, "", "parc_data"),
                                                body : TraffParcTrendView,  css : { "background-color":"#fff"}});
                                        cells.push({ view:"panel", x:5, y:0, dx:2, dy :3, resize:true, header : new GraphHeadView(this.app, "", "traffic_data_type"),
                                                body : new TraffByTypeTrendView(this.app, "", 'data'), css : { "background-color":"#fff"}});
                                        cells.push({ view:"panel", x:7, y:0, dx:2, dy :3, resize:true, header : new GraphHeadView(this.app, "", "traffic_other_data"),
                                                body : {type : 'clean', margin : 0, rows : [DataSplitTypetSplitView,  new TraffByOfferView(this.app, "", 'data') ]} , css : { "background-color":"#fff"}});

				break;*/
                case 'mobile' :
                        gridColumns = 4;
                        gridRows = 6;
                        cells.push({ view:"panel", x:0, y:0, dx:4, dy:2, resize:true,header : new GraphHeadView(this.app, "", "traffic_offer_data"),
                                                body : {type : 'clean', margin : 0, rows : [new TraffByOfferView(this.app, "", kpi), new PeriodSelector(this.app,"","traffByType_"+kpi,3), new TraffByTypeTrendView(this.app, "", kpi)]},  
                                                css : { "background-color":"#fff"}}); 
                                                
                        cells.push({ view:"panel", x:0, y:2, dx:4, dy:2, resize:true, header : new GraphHeadView(this.app, "", "traffic_other_data"), body :
                        {type : 'clean', margin : 0, rows : [new PeriodSelector(this.app,"","traffByType_dest_"+kpi,2,1),TraffDataByDestView, DataSplitTypetSplitView]} , css : { "background-color":"#fff"}});    
                        
                        cells.push({ view:"panel", x:0, y:4, dx:4, dy:2, resize:true,header : new GraphHeadView(this.app, "", "data_repartition"),
                        body : {type : 'clean', margin : 0, rows :[DataParcView,TraffDataSiteView]},  css : { "background-color":"#fff"}});    
                        config['minHeight'] = 1800  
                break
			
                case 'mobile_rotated' :
                        gridColumns = 4;
                        gridRows = 3;
                        cells.push({ view:"panel", x:0, y:0, dx:2, dy:2, resize:true,header : new GraphHeadView(this.app, "", "traffic_offer_data"),
                                                body : {type : 'clean', margin : 0, rows : [new TraffByOfferView(this.app, "", kpi), new PeriodSelector(this.app,"","traffByType_"+kpi,3), new TraffByTypeTrendView(this.app, "", kpi)]},  
                                                css : { "background-color":"#fff"}}); 
                                                
                        cells.push({ view:"panel", x:2, y:0, dx:2, dy:2, resize:true, header : new GraphHeadView(this.app, "", "traffic_other_data"), body :
                        {type : 'clean', margin : 0, rows : [new PeriodSelector(this.app,"","traffByType_dest_"+kpi,2,1),TraffDataByDestView, DataSplitTypetSplitView]} , css : { "background-color":"#fff"}});    
                        
                        cells.push({ view:"panel", x:0, y:2, dx:4, dy:1, resize:true,header : new GraphHeadView(this.app, "", "data_repartition"),
                        body : {type : 'clean', margin : 0, cols :[DataParcView,TraffDataSiteView]},  css : { "background-color":"#fff"}});    
                        config['minHeight'] = 700                     
                break
                
                default :
                        gridColumns = 9;
                        gridRows = 6;
                        cells.push({ view:"panel", x:0, y:0, dx:3, dy:6, resize:true,header : new GraphHeadView(this.app, "", "traffic_offer_data"),
                                                body : {type : 'clean', margin : 0, rows : [new TraffByOfferView(this.app, "", kpi), new PeriodSelector(this.app,"","traffByType_"+kpi,3), new TraffByTypeTrendView(this.app, "", kpi)]},  
                                                css : { "background-color":"#fff"}});
                        cells.push({ view:"panel", x:3, y:0, dx:3, dy:6, resize:true,header : new GraphHeadView(this.app, "", "data_repartition"),
                        body : {type : 'clean', margin : 0, rows :[DataParcView,TraffDataSiteView]},  css : { "background-color":"#fff"}});
                        cells.push({ view:"panel", x:6, y:0, dx:3, dy:6, resize:true, header : new GraphHeadView(this.app, "", "traffic_other_data"), body :
                                {type : 'clean', margin : 0, rows : [new PeriodSelector(this.app,"","traffByType_dest_"+kpi,2,1),TraffDataByDestView, DataSplitTypetSplitView]} , css : { "background-color":"#fff"}});
					if(getScreenType() == 'standard') config['minHeight'] = 600;
		break;
			}
                        config['cells'] = cells;
                        config['gridColumns'] = gridColumns;
                        config['gridRows'] = gridRows;		
		return {
			view : "scrollview",
			scroll : "y",
			body : config,

		};
	}

	init() {
                 /*var obj = this,
                     kpi = this._kpi;
                setScreenTypeByMenu('traffic', getScreenType());
                gconfig['dashboards']['traffic_'+kpi] = obj;
                webix.event(window, "resize", function(){

                        if($$('top:menu').getSelectedId() == 'traffic') {
                                if(getScreenTypeByMenu('traffic') != getScreenType()) {
                                        setScreenTypeByMenu('traffic', getScreenType());
                                        if(gconfig['dashboards']['traffic_'+kpi]._container != null)  gconfig['dashboards']['traffic_'+kpi].refresh();
                                }
                        }
                })
		*/
	}
}
