import {JetView} from "webix-jet";
//import HomeLineView from "views/home/lineCharts";
//import HomeParcView from 'views/home/parcView_new';
//import HomeParcOPView from "views/home/parcOPView";
import ParcByTypeTrendViewNew from "views/home/parcByTypeTrend";
//import HomeRevView from 'views/home/revenueView_tst';
import RevByTypeTrendView from "views/home/revenueByTypeTrend";
import PeriodSelector from "views/others/periodSelector";
//import HomeTopupNewTrendView from 'views/home/topupTrendView';
import PayByTypeTrendView from "views/home/payByTypeTrend"
import HomearpuNewTrendView from 'views/home/ArpuTrendView';
import GraphHeadView from "views/home/graphHeaders";
import HomeTraffTrendView from "views/home/trafficByTypeTrend";
import {getScreenType, getScreenTypeByMenu, setScreenTypeByMenu,getLabel} from "models/utils/home/utils";
import DmDByTypeTrendView from "views/home/dmdByTypeTrend";
import {gconfig} from "models/utils/general/boot";
export default class GraphDashView extends JetView{

	config ()
        
	{
		var gridColumns,
			gridRows,
			 cells = [];
                var config = {
                        view:"c-dashboard",
                        id : "home:dash",
                        margin : 5,
                        padding : 5,
                        css : {"background-color" : "#EBEDF0"}
                }		
			 
			switch(getScreenType()) {
				default :
					gridColumns = 6;
                        		gridRows = 4;
								
										cells.push(
											{ 
												view:"panel", x:0, y:0, dx:2, dy:2, resize:true, header : new GraphHeadView(this.app, "", "parc", "homelines"),
                                			body : {
												type : 'clean', margin : 0, rows : [ {height : 10}, new PeriodSelector(this.app,"","parcByType",2), ParcByTypeTrendViewNew]
											},  css : { "background-color":"#fff"}});


										cells.push({
											view : "panel",x : 0,y : 2, dx : 2, dy : 2,resize : true,header : new GraphHeadView(this.app,"","arpu","homelines"),body : {
												type : 'clean', margin : 0, 
												rows : [
													{height : 10},new PeriodSelector(this.app,"","arpuHome",2), HomearpuNewTrendView
												]
											},css : { "background-color":"#fff"}
										})

										cells.push({ view:"panel", x:2, y:0, dx:2, dy:2, resize:true, header : new GraphHeadView(this.app, "", "rev", "homelines"),
                                		body : {type : 'clean', margin : 0, 
										rows : [
											{height : 10},new PeriodSelector(this.app,"","revByType",2),RevByTypeTrendView
										]
										} ,
										css : { "background-color":"#fff"}});

										cells.push({ view:"panel", x:4, y:0, dx:2, dy:2, resize:true, header : new GraphHeadView(this.app, "", "traffics", "homelines"),
                                		body : {type : 'clean', margin : 0, 
										rows : [
											{height : 10},new PeriodSelector(this.app,"","traff_per",3),HomeTraffTrendView
										]
										} ,
										css : { "background-color":"#fff"}});


										cells.push({ view:"panel", x:2, y:2, dx:2, dy:2, resize:true, header : new GraphHeadView(this.app, "", "mnt_paid", "homelines"),
                                		body : {type : 'clean', margin : 0, 
										rows : [
											{height : 10},new PeriodSelector(this.app,"","payByType",2),PayByTypeTrendView
										]
										} ,
										css : { "background-color":"#fff"}});										


										cells.push({ view:"panel", x:4, y:2, dx:2, dy:2, resize:true, header : new GraphHeadView(this.app, "", "demandes", "homelines"),
                                		body : {type : 'clean', margin : 0, 
										rows : [
											{height : 10},new PeriodSelector(this.app,"","dmdByType",2),DmDByTypeTrendView
										]
										} ,
										css : { "background-color":"#fff"}});											





				break;
			}
			config['cells'] = cells;
			config['gridColumns'] = gridColumns;
			config['gridRows'] = gridRows;
		return {
		//	id : "homedscrl",
			view : "scrollview",
			scroll : "y",
			body : config,

		};
	}

	init(view) {
		var obj = this;
		setScreenTypeByMenu('home', getScreenType());
		gconfig['dashboards']['home'] = obj;
		webix.event(window, "resize", function(){

			if($$('top:menu').getSelectedId() == 'home') {
				if(getScreenTypeByMenu('home') != getScreenType()) {
					setScreenTypeByMenu('home', getScreenType());
					if(gconfig['dashboards']['home']._container != null) {
						gconfig['dashboards']['home'].refresh();						
					}

				}
			}
		})
		
	}

}
