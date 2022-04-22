import {JetView} from "webix-jet";
import * as ech from "views/newHome/echart_cmp_dataset";
import {components} from "models/referential/genReferentials";
import { getHomeChartData, getFiterDate} from "models/data/home/data_new";
import { formatter,getScreenType,kFormatter,updateChartReady } from "models/utils/home/utils";
import {getDates} from "models/utils/general/utils";
export default class HomeTopupNewTrendView extends JetView{


	config() {
    
		return {
			view : 'echarts-grid-dataset',
            id : 'home:vue1:trend:topup',
            animation: true,
//            minHeight : 115,
            charts_event : {

                'click' : [  {seriesId : 'home:topup_split', seriesType : 'bar'}, function(params){
    
                    let tp =  (getScreenType() != 'mobile' && getScreenType() != 'mobile_rotated') ? true : false;
                    if(!tp) {

                        let obj = this;
                            this.executeDoubleClick = setTimeout(function(){ obj._clicked = false; } , 500);
                             if(this._clicked) {tp = true; obj._clicked = false; clearTimeout(this.executeDoubleClick)  }

                    }
                    if(!tp) {
                            this._clicked = true;
                            return
                    }    

                    $("button.ui.button.topupHome_"+periodSplit[1]).addClass('active').siblings().removeClass('active')
    
                    if(!$$('home:vue1:trend:topup')._months) $$('home:vue1:trend:topup')._months = [];
                    if(!$$('home:vue1:trend:topup')._months.some(d => d == params.data.month)){
                            let dat = getFiterDate('topup', 'dt_trend', params.data.month+'-01');
                            $$('home:vue1:trend:topup').showProgress();
                            $$('home:vue1:trend:topup').disable()                        
                            dat.then( (d) => {
                                $$('home:vue1:trend:topup')._months.push(params.data.month);
                                $$('home:vue1:trend:topup')._filter_level = 'm';
                                $$('home:vue1:trend:topup').parse(dat).then(()=>{$$('home:vue1:trend:topup').data.filter((d) =>  {
                                    return d._type != 'month_trend' && (d.period == params.data.month || d.rec_type)
                                    });});
                                
                            $$('home:vue1:trend:topup')._current_month = params.data.month;
                            $$('home:vue1:trend:topup').enable();
                            $$('home:vue1:trend:topup').hideProgress();
                    })}
                    else {
                        $$('home:vue1:trend:topup')._filter_level = 'm';
                        $$('home:vue1:trend:topup')._current_month = params.data.month;
                        $$('home:vue1:trend:topup').data.filter((d) =>  {
                            return d._type != 'month_trend' && (d.period == params.data.month || d.rec_type);
                        })
                    }
    
                
                }]
    
            },

			options :{
             tooltip : {trigger: "axis",show : true, z : 2, axisPointer : {show : true} ,
                    position: function (pos, params, el, elRect, size) {
                       var obj =  {top : 10};
                        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                        return obj;
                    },		     
		     formatter : function(param) {
                          let rt = param[0].name+'<br/>';
                          let dim = param[0].dimensionNames[1];
                          rt+= param[0].marker+formatter(param[0].data[dim]);
                          return rt
             }

	     },
			/*title : [
                {
                    text : 'Evolution',
                   top : 5,
                    left : '50%',
                    textAlign: 'center',
                    textStyle : {
                        fontSize : 12
                    }
                }
				
			],*/

    			grid: [ {
			        //height: '80%',
			        top: 6,
                    bottom : 3,

                    //right: '5',
                    left : 5,
			        containLabel: true
            }],
            dataset : [

                {
                    dimensions : ['month', 'trend']
                },
                {
                    dimensions : ['upd_dt', 'trend_dt']
                }

            ],
			xAxis: [
		        {
				type: 'category',isDim : true,_type : 'trend',
			        splitLine: {
			        show: false
                    },
                    axisPointer: {
                        show: true
                      },
			        axisLabel: {show: true},
                		axisTick: {show: true, alignWithLabel: true},

    			}
			],
			yAxis: [
                {
				type: 'value',isDim : true,
                splitNumber : 3,
				 axisLabel: {
                        formatter : function(val, ind){
                            return kFormatter(val);
                        }
    				},
    				splitLine: {
        				show: true
    				}
			}, 
			],			
			series : [
                {
                    type : 'line', encode : {x : 'month', y : 'trend'},datasetIndex : 0,
                    _type : 'month_trend', id : 'home:topup_split',
                    areaStyle: {
            
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: 'orange'
                            }, {
                                offset: 1, color: 'white' 
                            }],
                            global: false 
                        }
                    },smooth :true,
                    lineStyle: {
                        color: "orange",
                        width: 2.5
                    },
                    itemStyle : {

                        color : "orange"
                    },
					z : 3               
                 },
                {
                    type : 'line', encode : {x : 'upd_dt', y : 'trend_dt'}, _type : 'dt_trend',datasetIndex : 1
                }

			]		
		}
		}
	}

        init(view) {

                $$("home:vue1:trend:topup").showProgress();
                $$("home:vue1:trend:topup").disable();
                components['home'].push({cmp : "home:vue1:trend:topup", data : getHomeChartData('month_trend').config.id});
                $$('home:vue1:trend:topup')._months = [];
                $$('home:vue1:trend:topup')._current_month = getDates()['d1'].substr(0,7);
                $$('home:vue1:trend:topup')._filter_level = 'a';
                getHomeChartData('month_trend').waitData.then((d) => {
			$$("home:vue1:trend:topup")._isDataLoaded = 1;
                        $$("home:vue1:trend:topup").parse(getHomeChartData('month_trend'));
                        $$("home:vue1:trend:topup").enable();
                        $$("home:vue1:trend:topup").hideProgress();

                });

                $$("home:vue1:trend:topup").data.attachEvent("onStoreLoad", function () {
                                updateChartReady("home:vue1:trend:topup");
                });
                getHomeChartData('month_trend').data.attachEvent("onClearAll", function () {
                    if($$('top:menu').getSelectedId() == 'home') {
                    $$('home:vue1:trend:topup')._months = [];
                    $$('home:vue1:trend:topup')._current_month = getDates()['d1'].substr(0,7);
                    $$('home:vue1:trend:topup')._filter_level = 'a';
                    }
                });
        }


        ready(view){
            $$("topupHome").attachEvent("onAfterRender", function(){
            $('button.ui.button.topupHome_'+periodSplit[1]).on('click',function(){
                if( view._filter_level == 'a'){
                   
                    view._filter_level = 'm';
                    if(!view._months.some(d => d == view._current_month)){
                        let dat = getFiterDate('topup', 'dt_trend', view._current_month+'-01');
                        view.showProgress();
                        view.disable()
                        dat.then( (d) => {
                            view._months.push(view._current_month);
                            view.parse(dat).then(()=>{view.data.filter((d) =>  {
                                return d._type != 'month_trend' && (d.period == view._current_month || d.rec_type)
                            });});

                        view._current_month = view._current_month;
                        view.enable();
                        view.hideProgress();
                    })}
                    else
                        view.data.filter((d)=> {
                            return d._type != 'month_trend' && (d.period == view._current_month || d.rec_type)

                        });
                }
                    

            })

            $('button.ui.button.topupHome_'+periodSplit[0]).on('click',function(){
                if (view)
                if (view._filter_level == 'm') {
                    view._filter_level = 'a';
                    view.data.filter((d)=> d._type != 'dt_trend');

             }
            }
            )
        })
    }

}
