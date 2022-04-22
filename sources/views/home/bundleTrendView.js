import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components} from "models/referential/genReferentials";
import { getHomeChartData, getFiterDate} from "models/data/home/data";
import {formatter, getScreenType,kFormatter, updateChartReady } from "models/utils/home/utils";
import {getDates} from "models/utils/general/utils";
export default class HomeBndleNewTrendView extends JetView{


	config() {
    
        
		return {
			view : 'echarts-grid-dataset',
            id : 'home:vue1:trend:bndle',
//            minHeight : 115,
            animation: true,
            charts_event : {

            'click' : [  {seriesId : 'home:bndle_split', seriesType : 'bar'}, function(params){
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

                    $("button.ui.button.bndleHome_"+periodSplit[1]).addClass('active').siblings().removeClass('active')

                if(!$$('home:vue1:trend:bndle')._months) $$('home:vue1:trend:bndle')._months = [];
                if(!$$('home:vue1:trend:bndle')._months.some(d => d == params.data.month)){
                        let dat = getFiterDate('bndle', 'dt_trend', params.data.month+'-01');
                        $$('home:vue1:trend:bndle').showProgress();
                        $$('home:vue1:trend:bndle').disable()                        
                        dat.then( (d) => {
                            $$('home:vue1:trend:bndle')._months.push(params.data.month);
                            $$('home:vue1:trend:bndle')._filter_level = 'm';
                            $$('home:vue1:trend:bndle').parse(dat).then(()=>{$$('home:vue1:trend:bndle').data.filter((d) =>  {
                                return d._type != 'month_trend' && (d.period == params.data.month || d._type == 'bndle_split')
                                });});
                            
                        $$('home:vue1:trend:bndle')._current_month = params.data.month;
                        $$('home:vue1:trend:bndle').enable();
                        $$('home:vue1:trend:bndle').hideProgress();
                })}
                else {
                    $$('home:vue1:trend:bndle')._filter_level = 'm';
                    $$('home:vue1:trend:bndle')._current_month = params.data.month;
                    $$('home:vue1:trend:bndle').data.filter((d) =>  {
                        return d._type != 'month_trend' && (d.period == params.data.month || d._type == 'bndle_split');
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
            dataset : [
                {
                    dimensions : ['month', 'trend']
                },
                {
                    dimensions : ['upd_dt', 'trend_dt']
                }

            ],

    			grid: [{
			        top: 6,
                   // height: '80%',
				//right: 5,
			        left: 5,
                    bottom : 3,
			        containLabel: true
			       }],
			xAxis: [
		        {
                type: 'category',isDim : true,splitNumber  : 6,
			    splitLine: {
			        show: false
                    },
                    axisPointer: {
                        show: true
                      },
                		axisTick: {show: true, alignWithLabel: true},

    			}
			],
			yAxis: [{
				type: 'value',
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
                    type : 'line',encode : {x : 'month', y : 'trend'},seriesLayoutBy: 'row',datasetIndex : 0,
                    //stack : 'spl',
                    _type : 'month_trend',_dim :'key', id : 'home:bndle_split',
                    z : 3,
                    areaStyle: {
            
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: 'blue'
                            }, {
                                offset: 1, color: 'white' 
                            }],
                            global: false 
                        }
                    },smooth :true,
                    lineStyle: {
                        color: "blue",
                        width: 2.5
                    },
                    itemStyle : {

                        color : "blue"
                    },
					barMaxWidth : 40,barMinHeight: 10,
                },
                {
                    type : 'line', encode : {x : 'upd_dt', y : 'trend_dt'}, _type : 'dt_trend',datasetIndex : 1//,barMaxWidth : 20,barMinHeight: 10,
                }

			],
		
		}
		}
	}

        init(view) {

                $$("home:vue1:trend:bndle").showProgress();
                $$("home:vue1:trend:bndle").disable();
                components['home'].push({cmp :"home:vue1:trend:bndle", data : getHomeChartData('trend_bndle').config.id});
                $$('home:vue1:trend:bndle')._current_month = getDates()['d1'].substr(0,7);
                $$('home:vue1:trend:bndle')._months = [];
                $$('home:vue1:trend:bndle')._filter_level = 'a';
                getHomeChartData('trend_bndle').waitData.then((d) => {
			$$("home:vue1:trend:bndle")._isDataLoaded = 1;
                        $$("home:vue1:trend:bndle").parse(getHomeChartData('trend_bndle'));
                        $$("home:vue1:trend:bndle").enable();
                        $$("home:vue1:trend:bndle").hideProgress();

                });
                $$("home:vue1:trend:bndle").data.attachEvent("onBeforeLoad", function () {
                    if ($$('top:menu').getSelectedId() == 'home'){
                    $$('home:vue1:trend:bndle')._current_month = getDates()['d1'].substr(0,7);
                    $$('home:vue1:trend:bndle')._months = [];
                    $$('home:vue1:trend:bndle')._filter_level = 'a';
                    }
                });
                $$("home:vue1:trend:bndle").data.attachEvent("onStoreLoad", function () {
                                updateChartReady("home:vue1:trend:bndle");
                });

        }


        ready(view){
            $$("bndleHome").attachEvent("onAfterRender", function(){
                if($$('top:menu').getSelectedId() == 'home'){
                    $('button.ui.button.bndleHome_'+periodSplit[1]).on('click',function(){
                        if( view._filter_level == 'a'){
                        
                            view._filter_level = 'm';
                            if(!view._months.some(d => d == view._current_month)){
                                let dat = getFiterDate('bndle', 'dt_trend', view._current_month+'-01');
                                view.showProgress();
                                view.disable()
                                dat.then( (d) => {
                                    view._months.push(view._current_month);
                                    view.parse(dat).then(()=>{view.data.filter((d) =>  {
                                        return d._type != 'month_trend' && (d.period == view._current_month || d._type == 'bndle_split')
                                    });});

                                view._current_month = view._current_month;
                                view.enable();
                                view.hideProgress();
                            })}
                            else
                                view.data.filter((d)=> {
                                    return d._type != 'month_trend' && (d.period == view._current_month || d._type == 'bndle_split')

                                });
                        }
                            

                    })

                    $('button.ui.button.bndleHome_'+periodSplit[0]).on('click',function(){
                        if (view)
                        if (view._filter_level == 'm') {
                            view._filter_level = 'a';
                            view.data.filter((d)=> d._type != 'dt_trend');

                    }
                    }
                    )
                }
        })
    }

}
