import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {color_ref,components,dash_titles} from "models/referential/genReferentials";
import { getTraffChartData} from "models/data/traffic/data";
import {  updateChartReady, formatter } from "models/utils/home/utils";

export default class TraffByOPView extends JetView{


    constructor(app,name, kpi) {
        super(app,name);
        this._kpi = kpi;
    }


	config() {

        let kp = this._kpi;
	return color_ref.then((color_ref) => {
	return {
			view : 'echarts-grid-dataset',
            id : 'traff:vue1:'+kp+':operators',

			options :{
				tooltip : {
					trigger : 'item',show : true,
                                /*position: function (pos, params, el, elRect, size) {
                                        var obj =  {top : pos[1]+10};
                                        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                                                return obj;
                                }	*/				
				}, legend : {top : 10, textStyle : {fontSize : 10}, type : 'scroll'},

            title : [{
                top : "30",
                text : dash_titles['traffic'].traffic_in? dash_titles['traffic'].traffic_in : "" ,
                //subtext : 'Revenu',
                left : '25%',
                textAlign: 'center',
                textStyle : {
                    fontSize : 12
                }},
                {
                    top : "30",
                    text : dash_titles['traffic'].traffic_out? dash_titles['traffic'].traffic_out : "" ,
                    //subtext : 'Revenu',
                    left : '75%',
                    textAlign: 'center',
                    textStyle : {
                        fontSize : 12
                    }
                    
                }
            ],
                
            
            grid : [{
                left : 10,
                //width : '70%',
                containLabel: true
            },
            {
                right : 10,
                containLabel : true

            }
            ],

            dataset : [
                {
                    dimensions : ['operator', 'traffic']
                },
                {
                    dimensions : ['operator', 'traffic']
                }
            ],		
			series : [
                {type : 'pie',radius: [0, '50%'], center : ['25%', '55%'],
                datasetIndex : 0,
                 gridIndex : 0  , encode : {value : 'traffic', itemName : 'operator'} , _type : 'in', label : {show : false},
                tooltip : {trigger : 'item',show : true, formatter: function(params) {
                    if(params.value) return  params.name+' : '+formatter(params.value.traffic)+' ('+params.percent+'%)' ;
                    }
                },
                selectedMode: 'single',avoidLabelOverlap: true,minAngle : 10,
		itemStyle : {
                        color : function(params) {
                            return color_ref.revenueOP[params.name];
                        }
                }
                },
                {type : 'pie',radius: [0, '50%'], center : ['75%', '55%'],
                datasetIndex : 1,
                 gridIndex : 1  , encode : {value : 'traffic', itemName : 'operator'} , _type : 'out',label : {show : false},
                itemStyle : {
                        color : function(params) {
                            return color_ref.revenueOP[params.name];
                        }
                },		
                tooltip : {trigger : 'item',show : true, formatter: function(params) {
                    if(params.value) return  params.name+' : '+formatter(params.value.traffic)+' ('+params.percent+'%)' ;
                    }
                },
                selectedMode: 'single',avoidLabelOverlap: true, minAngle : 10
                }
			],
		}
		}
	})
	}

        init(view) {
            let kp = this._kpi;
                $$('traff:vue1:'+kp+':operators').showProgress();
                $$('traff:vue1:'+kp+':operators').disable();
                components['traffic'].push({cmp : 'traff:vue1:'+kp+':operators', data : getTraffChartData('traffic_operator').config.id});

                getTraffChartData('traffic_operator').waitData.then((d) => {
			$$('traff:vue1:'+kp+':operators')._isDataLoaded = 1;
                        $$('traff:vue1:'+kp+':operators').parse(getTraffChartData('traffic_operator'));
                        $$('traff:vue1:'+kp+':operators').filter(d => d.traff_type == kp);
                        $$('traff:vue1:'+kp+':operators').enable();
                        $$('traff:vue1:'+kp+':operators').hideProgress();

                });

                $$('traff:vue1:'+kp+':operators').data.attachEvent("onStoreLoad", function () {
                                $$('traff:vue1:'+kp+':operators').filter(d => d.traff_type == kp);
                                updateChartReady('traff:vue1:'+kp+':operators');
                });

        }

}
