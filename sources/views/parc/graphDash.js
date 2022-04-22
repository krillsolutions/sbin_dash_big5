import {JetView} from "webix-jet";
/*import GeoControlView from "views/parc/geoControlView";
import ParcGeoView from 'views/parc/geoView_new';
import GraphHeadView from "views/home/graphHeaders";*/
//import ParcByZoneView from "views/parc/parcByZone";
//import ParcBillMarkView from "views/parc/parcBTMkt";
//import ParcOfferTypeView from "views/parc/parcByOfferView";
//import {geo_config} from "models/referential/genReferentials";
import {getScreenType, getScreenTypeByMenu, setScreenTypeByMenu} from "models/utils/home/utils";
import {gconfig} from "models/utils/general/boot";
import GraphHeadView from "views/home/graphHeaders";
import ParcByTypeView from "views/parc/parcByType";
import ParcByTypeTrendView from "views/parc/parcTypeTrend_new"
//import CarouselParcByTypeView from "views/parc/CaroussParcType";
import ParcProdTypeView from "views/parc/parcByProdView";
import ParcNetAddView from "views/parc/netAddView";
//import ParcBTView from "views/parc/parcBTView";
import BillMarketParc from "views/parc/parcByBillByMark"
import PeriodSelector from "views/others/periodSelector";
import ParcStatusNetView from "views/parc/parcByStatusNet"
export default class ParcGraphDashView extends JetView{

	config ()
        
	{

		var gridColumns,
			gridRows,
			 cells = [];
                var config = {
                        view:(getScreenType() != "mobile" && getScreenType() != "mobile_rotated")?  "c-dashboard" : "m-dashboard",
			id : 'parc:dash',
                        margin : 5,
                        padding : 5,
                        css : {"background-color" : "#EBEDF0"}
                };
		
			switch(getScreenType()) {

				case 'mobile' :
					gridColumns = 4;
					gridRows = 15;
					cells.push({
						view:"panel", x:0, y:0, dx:4, dy:5, resize:true,header : new GraphHeadView(this.app, "", "parc", "homelines"),
						body : BillMarketParc
					})
					cells.push({ 
						view:"panel", x:0, y:5, dx:4, dy:5, resize:true,header : new GraphHeadView(this.app, "", "offer_type", "homelines"),
						body : { type : 'clean', margin : 0, 
						rows : [  { type : 'clean', margin : 0, cols :  [ParcByTypeView,ParcProdTypeView ]}, new PeriodSelector(this.app,"","parcByType_prod",2), ParcByTypeTrendView]
					
					} ,css : { "background-color":"#fff"}
					})

					cells.push({ 
						view:"panel", x:0, y:10, dx:4, dy:5, resize:true, header : new GraphHeadView(this.app, "", "parc_other", "homelines"), 
						body :{ type : 'clean', margin : 0, rows :[ ParcStatusNetView,ParcNetAddView]}, css : { "background-color":"#fff"}
					});	

				 config['minHeight'] = 1900;
				break;
				case 'mobile_rotated' :
					gridColumns = 4;
					gridRows = 14;
					cells.push({
						view:"panel", x:0, y:0, dx:4, dy:5, resize:true,header : new GraphHeadView(this.app, "", "parc", "homelines"),
						body : BillMarketParc
					})
					cells.push({ 
						view:"panel", x:0, y:5, dx:4, dy:5, resize:true,header : new GraphHeadView(this.app, "", "offer_type", "homelines"),
						body : { type : 'clean', margin : 0, 
						rows : [  { type : 'clean', margin : 0, cols :  [ParcByTypeView,ParcProdTypeView ]}, new PeriodSelector(this.app,"","parcByType_prod",2), ParcByTypeTrendView]
					
					} ,css : { "background-color":"#fff"}
					})

					cells.push({ 
						view:"panel", x:0, y:10, dx:4, dy:4, resize:true, header : new GraphHeadView(this.app, "", "parc_other", "homelines"), 
						body :{ type : 'clean', margin : 0, cols :[ ParcStatusNetView,ParcNetAddView]}, css : { "background-color":"#fff"}
					});	

				config['minHeight'] = 1200;
				break;				

				default :
   	                         gridColumns = 10;
                        	 gridRows = 6;
				 cells.push({ view:"panel", x:0, y:0, dx:3, dy:6, resize:true,header : new GraphHeadView(this.app, "", "parc", "homelines"),
                                         body :  { type : 'clean', margin : 0, 
										 rows :  [BillMarketParc] //[ParcBTView,ParcOfferTypeView]
										},
                                        css : { "background-color":"#fff"}});				
				
				cells.push({ view:"panel", x:3, y:0, dx:4, dy:6, resize:true,header : new GraphHeadView(this.app, "", "offer_type", "homelines"),
						body : { type : 'clean', margin : 0, 
						rows : [  { type : 'clean', margin : 0, cols :  [ParcByTypeView,ParcProdTypeView ]}, new PeriodSelector(this.app,"","parcByType_prod",2), ParcByTypeTrendView]
					
					} ,css : { "background-color":"#fff"} });
				/*cells.push({ view:"panel", x:, y:0, dx:2, dy:6, resize:true, header : new GraphHeadView(this.app, "", "parc_status_ligne", "homelines"), 
				body :{ type : 'clean', margin : 0, rows :[ {}]}, css : { "background-color":"#fff"}});*/

						cells.push({ view:"panel", x:7, y:0, dx:3, dy:6, resize:true, header : new GraphHeadView(this.app, "", "parc_other", "homelines"), 
				body :{ type : 'clean', margin : 0, rows :[ ParcStatusNetView,ParcNetAddView]}, css : { "background-color":"#fff"}});						

					if(getScreenType() == 'standard') config['minHeight'] = 555;
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

	                var obj = this;
                setScreenTypeByMenu('parc', getScreenType());
                gconfig['dashboards']['parc'] = obj;
                webix.event(window, "resize", function(){

                        if($$('top:menu').getSelectedId() == 'parc') {
                                if(getScreenTypeByMenu('parc') != getScreenType()) {
                                        setScreenTypeByMenu('parc', getScreenType());
                                       if(gconfig['dashboards']['parc']._container != null)  gconfig['dashboards']['parc'].refresh();
                                }
                        }
                })


		
	}
}
