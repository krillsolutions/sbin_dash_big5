import {JetView} from "webix-jet";
import RecByTypeView from "views/recharge/recByTypeView";
import GraphHeadView from "views/home/graphHeaders";
import RecByTypeTrendView from "views/recharge/recByTypeTrendView";
import PeriodSelector from "views/others/periodSelector";
/*import RecGeoView from "views/recharge/recGeoSplitView_new";
import RecGeoControlView from "views/recharge/recGeoControl";
import {geo_config} from "models/referential/genReferentials";*/
import RecByProdByType from "views/recharge/recByProdByType";
import RecByChanView from "views/recharge/recByChann";
import RecByValueView from "views/recharge/recByValueView";
import {getScreenType, getScreenTypeByMenu, setScreenTypeByMenu} from "models/utils/home/utils";
import {gconfig} from "models/utils/general/boot";
export default class RecGraphDashView extends JetView{


	config ()
        
	{

		var gridColumns,
			gridRows,
			 cells = [];
		
                        switch(getScreenType()) {
				
                                case 'mobile_rotated':
                                        gridColumns = 4;
                                        gridRows = 4;
                                        cells.push({ view:"panel", x:0, y:0, dx:2, dy:2, resize:true,header : new GraphHeadView(this.app, "", "rec_by_type"),
                                        body : { type : 'clean' , margin : 0, rows :[ RecByTypeView ,new PeriodSelector(this.app,"","recByType_trend",3),RecByTypeTrendView ],  css : { "background-color":"#fff"}}});
                                        cells.push({ view:"panel", x:2, y:0, dx:2, dy:2, resize:true, header : new GraphHeadView(this.app, "", "rec_split"),
                                                body :  {type : 'clean',margin : 0, rows :  [RecByChanView, RecByValueView  ]}, css : { "background-color":"#fff"}});
                                        cells.push({ view:"panel", x:0, y:2, dx:4, dy:2, resize:true, header : new GraphHeadView(this.app, "", 'rec_by_prod'),
                                        body :  RecByProdByType/*RecByValueSplitView */, css : { "background-color":"#fff"}});   
                                        //config['minHeight'] = 850                                             

                                break

                                case 'mobile':
                                        gridColumns = 2;
                                        gridRows = 6;
                                        cells.push({ view:"panel", x:0, y:0, dx:2, dy:2, resize:true,header : new GraphHeadView(this.app, "", "rec_by_type"),
                                        body : { type : 'clean' , margin : 0, rows :[ RecByTypeView ,new PeriodSelector(this.app,"","recByType_trend",3),RecByTypeTrendView ],  css : { "background-color":"#fff"}}});
                                        cells.push({ view:"panel", x:0, y:2, dx:2, dy:2, resize:true, header : new GraphHeadView(this.app, "", "rec_split"),
                                                body :  {type : 'clean',margin : 0, rows :  [RecByChanView, RecByValueView  ]}, css : { "background-color":"#fff"}});
                                        cells.push({ view:"panel", x:0, y:4, dx:2, dy:2, resize:true, header : new GraphHeadView(this.app, "", 'rec_by_prod'),
                                        body :  RecByProdByType/*RecByValueSplitView */, css : { "background-color":"#fff"}});   
                                        //config['minHeight'] = 850                                             

                                break                                

                                default :
                                        gridColumns = 6;
                                        gridRows = 3;
                                        cells.push({ view:"panel", x:0, y:0, dx:2, dy:3, resize:true,header : new GraphHeadView(this.app, "", "rec_by_type"),
                                                body : { type : 'clean' , margin : 0, rows :[ RecByTypeView ,new PeriodSelector(this.app,"","recByType_trend",3),RecByTypeTrendView ],  css : { "background-color":"#fff"}}});
                                        cells.push({ view:"panel", x:2, y:0, dx:2, dy:3, resize:true, header : new GraphHeadView(this.app, "", "rec_split"),
                                                body :  {type : 'clean',margin : 0, rows :  [RecByChanView, RecByValueView  ]}, css : { "background-color":"#fff"}});
                                        cells.push({ view:"panel", x:4, y:0, dx:2, dy:3, resize:true, header : new GraphHeadView(this.app, "", 'rec_by_prod'),
                                                body :  RecByProdByType/*RecByValueSplitView */, css : { "background-color":"#fff"}});
				break;
			}
		var config = {
			view:(getScreenType() != "mobile" && getScreenType() != "mobile_rotated")?  "c-dashboard" : "m-dashboard",
			gridColumns:gridColumns, gridRows:gridRows,
			margin : 5,
			padding : 5,
			cells : cells,
			css : {"background-color" : "#EBEDF0"}
		};
		if(getScreenType() == 'standard') config['minHeight'] = 520;
		if(getScreenType() == 'mobile') config['minHeight'] = 1400;
		if(getScreenType() == 'mobile_rotated') config['minHeight'] = 850;
		return {
			view : "scrollview",
			scroll : "y",
			body : config,

		};
	}

	init() {
                 var obj = this;
                setScreenTypeByMenu('recharge', getScreenType());
		gconfig['dashboards']['recharge'] = obj;                
                webix.event(window, "resize", function(){

                        if($$('top:menu').getSelectedId() == 'recharge') {
                                if(getScreenTypeByMenu('recharge') != getScreenType()) {
                                        setScreenTypeByMenu('recharge', getScreenType());
                                        if (gconfig['dashboards']['recharge']._container != null) gconfig['dashboards']['recharge'].refresh();
                                }
                        }
                })
		
	}
}
