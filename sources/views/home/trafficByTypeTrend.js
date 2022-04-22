import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components,dataDesc,color_ref} from "models/referential/genReferentials";
import { getHomeChartData, getFiterDate} from "models/data/home/data";
import { kFormatter,getScreenType, DatakFormatter,formatter, updateChartReady } from "models/utils/home/utils";
import {getDates} from "models/utils/general/utils";
export default class HomeTraffTrendView extends JetView{


	config() {

        let series = [], dataset = [], yAxis = []

        for (const elm of traffType) {

            dataset.push({
                dimensions : ['month','traffic']
            },
            {
                dimensions : ['upd_dt','traffic']
            },
            {
                dimensions : ['slot','traffic']
            })
            let yAxisIn = trafficYaxisType[elm] ? trafficYaxisType[elm].index : 0

            yAxis.push(
                {
                    type : 'value',position : 'left',
                    axisLabel: {
                        formatter : function(val, ind){
                            return (elm.indexOf("data") >= 0 )? DatakFormatter(val) : kFormatter(val)
                        }
                    },
                    splitLine: {
                        show: true
                    }
    
                }
            )
            series.push({
                type : 'line',gridIndex : 1, encode : {x : 'month', y : 'traffic'},seriesLayoutBy: 'row',datasetIndex : dataset.length - 3,_kpi : elm,name : elm,yAxisIndex : yAxisIn,
                _type : 'month_trend', id : 'traff:month_split:'+elm,
                areaStyle: {
        
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: ((elm == 'voice')? 'red' : ((elm == 'sms')? 'green' : 'blue'))
                        }, {
                            offset: 1, color: 'white' 
                        }],
                        global: false 
                    }
                },smooth :true,
                lineStyle: {
                    color:((elm == 'voice')? 'red' : ((elm == 'sms')? 'green' : 'blue')),
                    width: 2.5
                },
                itemStyle : {

                    color : ((elm == 'voice')? 'red' : ((elm == 'sms')? 'green' : 'blue'))
                },
                z : 3
            },
            {
                type : 'line', gridIndex : 1, encode : {x : 'upd_dt', y : 'traffic'}, _type : 'dt_trend',_kpi : elm,id : 'traff:dt_split:'+elm,datasetIndex : dataset.length - 2, name : elm,
                itemStyle : {color : ((elm == 'voice')? 'red' : ((elm == 'sms')? 'green' : 'blue'))},yAxisIndex : yAxisIn
            },
            {
                type : 'bar',gridIndex : 1, encode : {x : 'slot',y : 'traffic'}, _kpi : elm,_type : 'slot_trend',id : 'traff:slot_split:'+elm,datasetIndex : dataset.length - 1, name : elm,
                itemStyle : {color : ((elm == 'voice')? 'red' : ((elm == 'sms')? 'green' : 'blue'))},yAxisIndex : yAxisIn
            })
        }

        return webix.promise.all([color_ref,dataDesc]).then((data) => {
            let color_ref = data[0];
            let dataDesc = data[1];

		return {
			view : 'echarts-grid-dataset',
            id : 'home:vue1:trend:traff',
            //minHeight : 107,
            animation: true,
            beforedisplay : function(dat, conf, echart_obj){

                echart_obj.off('click');

                echart_obj.on('legendselectchanged',function(ev){
                    echart_obj.setOption({
                        title : {text : trafficYaxisType[ev.name].name}
                    })
                })

                for (const elm of traffType) {
                echart_obj.on('click', {seriesId : 'traff:month_split:'+elm}, (params) => { 
                    let tp =  ( getScreenType() != 'mobile' && getScreenType() != 'mobile_rotated' )? true : false;
                    if(!tp) {

                            let obj = this;
                            this.executeDoubleClick = setTimeout(function(){ obj._clicked = false; } , 500);
                            if(this._clicked) {tp = true; obj._clicked = false; clearTimeout(this.executeDoubleClick)  }
                    }
                    if(!tp) {
                            this._clicked = true;
                            return
                    }		
                    HomeTraffTrendView.filterHandler(params)
                });

                echart_obj.on('click', {seriesId : 'traff:dt_split:'+elm}, (params) => { 
                    let tp =  ( getScreenType() != 'mobile' && getScreenType() != 'mobile_rotated' )? true : false;
                    if(!tp) {

                            let obj = this;
                            this.executeDoubleClick = setTimeout(function(){ obj._clicked = false; } , 500);
                            if(this._clicked) {tp = true; obj._clicked = false; clearTimeout(this.executeDoubleClick)  }
                    }
                    if(!tp) {
                            this._clicked = true;
                            return
                    }		
                    HomeTraffTrendView.filterHandler(params)
                });

                echart_obj.on('click', {seriesId : 'traff:slot_split:'+elm}, (params) => { 
                    let tp =  ( getScreenType() != 'mobile' && getScreenType() != 'mobile_rotated' )? true : false;
                    if(!tp) {

                            let obj = this;
                            this.executeDoubleClick = setTimeout(function(){ obj._clicked = false; } , 500);
                            if(this._clicked) {tp = true; obj._clicked = false; clearTimeout(this.executeDoubleClick)  }
                    }
                    if(!tp) {
                            this._clicked = true;
                            return
                    }		
                    HomeTraffTrendView.filterHandler(params)
                });
            }

            },
			options :{
                legend : {show : true, itemGap : 20, bottom : 5, selectedMode : "single",type : 'scroll', textStyle : {fontSize : 10},formatter : function(pr) { return (dataDesc.revenue[pr]? dataDesc.revenue[pr] : pr)  }},
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
         title : {
            text : trafficYaxisType['voice'].name,
            left : '20%',
            textAlign: 'center',
            textStyle : {
                fontSize : 10
            }
         },
            grid : [{

               // height : '80%',
                left : 5,
                right : 5,
                top :20,
                bottom : 35,
                //top : 5,
                containLabel: true
            }],
            dataset : dataset,
			xAxis: [
		        {
                type: 'category',splitNumber  : 6,
			    splitLine: {
			            show: false
                },
                axisPointer: {
                        show: true
                },
                		axisTick: {show: true, alignWithLabel: true},

    			}
			],
			yAxis: yAxis,	
	
			series : series		
		}
		}})
	}



        init(view) {
                let obj = this
                $$('home:vue1:trend:traff').showProgress();
                $$('home:vue1:trend:traff').disable();
                components['home'].push({cmp : 'home:vue1:trend:traff', data :getHomeChartData('traffic_split').config.id });
                $$('home:vue1:trend:traff')._current_month = getDates()['d1'].substr(0,7);
                $$('home:vue1:trend:traff')._months = [];
                $$('home:vue1:trend:traff')._filter_level = 'a';
                $$('home:vue1:trend:traff')._current_upd_dt = getDates()['d1'];
                getHomeChartData('traffic_split').waitData.then((d) => {
			$$('home:vue1:trend:traff')._isDataLoaded = 1;
                        $$('home:vue1:trend:traff').parse(getHomeChartData('traffic_split'));
                        $$('home:vue1:trend:traff').enable();
                        $$('home:vue1:trend:traff').hideProgress();

                });
                $$('home:vue1:trend:traff').data.attachEvent("onClearAll", function () {
                    console.log("BEFORE LOADING")
                    if($$('top:menu').getSelectedId() == 'home'){
                    $$('home:vue1:trend:traff')._current_month = getDates()['d1'].substr(0,7);
                    $$('home:vue1:trend:traff')._months = [];
                    $$('home:vue1:trend:traff')._filter_level = 'a';
                    $$('home:vue1:trend:traff')._current_upd_dt = getDates()['d1'];
                    }
                });
                $$('home:vue1:trend:traff').data.attachEvent("onStoreLoad", function () {
                                updateChartReady('home:vue1:trend:traff');
                });


                $$('traff_per').attachEvent("onAfterRender", function(){
                    if($$('top:menu').getSelectedId() == 'home') {

                    $('button.ui.button.traff_per_'+periodSplit[1]).on('click',function(){
                        if( $$('home:vue1:trend:traff')._filter_level != 'm'){

                            HomeTraffTrendView.filterHandler({data : {month : $$('home:vue1:trend:traff')._current_month , _type : "month_trend"}})

                        }                         
    
                    })

                    $('button.ui.button.traff_per_'+periodSplit[2]).on('click',function(){
                        if( $$('home:vue1:trend:traff')._filter_level != 's'){

                            HomeTraffTrendView.filterHandler({data : {upd_dt : $$('home:vue1:trend:traff')._current_upd_dt , _type : "dt_trend",seriesName : $$('home:vue1:trend:traff')._current_serie_selected}})

                        }                         
    
                    })

                    $('button.ui.button.traff_per_'+periodSplit[0]).on('click',function(){
                        if ($$('home:vue1:trend:traff')._filter_level == 'm' || $$('home:vue1:trend:traff')._filter_level  == 's') {
                                        $$('home:vue1:trend:traff')._filter_level = 'a';
                                        $$('home:vue1:trend:traff').data.filter((d)=> d._type == 'month_trend') ;
    
                        }
                    }
                    )
                }
                })

        }
        ready(view){
         //   $$('traff_per').callEvent("onAfterRender")
        }


        static filterHandler(params){

            if(!params.data) return;
            switch (params.data._type) {
                case 'month_trend':
                    $("button.ui.button.traff_per_"+periodSplit[1]).addClass('active').siblings().removeClass('active')
                    if(!$$('home:vue1:trend:traff')._months) $$('home:vue1:trend:traff')._months = [];
                    if(!$$('home:vue1:trend:traff')._months.some(d => d == params.data.month)){
                            let dat = getFiterDate('traffic', 'vue2', params.data.month+'-01', 'vue2');
                            $$('home:vue1:trend:traff').showProgress();
                            $$('home:vue1:trend:traff').disable()                        
                            dat.then( (d) => {
                                $$('home:vue1:trend:traff')._months.push(params.data.month);
                                $$('home:vue1:trend:traff')._filter_level = 'm';
                                $$('home:vue1:trend:traff').parse(dat).then(()=>{$$('home:vue1:trend:traff').data.filter((d) =>  {
                                    return (d._type != 'month_trend' && (d.period == params.data.month ));
                                    });});
                                
                            $$('home:vue1:trend:traff')._current_month = params.data.month;
                            $$('home:vue1:trend:traff').enable();
                            $$('home:vue1:trend:traff').hideProgress();
                    })}
                    else {
                        $$('home:vue1:trend:traff')._filter_level = 'm';
                        $$('home:vue1:trend:traff')._current_month = params.data.month;
                        $$('home:vue1:trend:traff').data.filter((d) =>  {
                            return (d._type != 'month_trend' && (d.period == params.data.month));
                        })
                    }
                    break;

                case 'dt_trend' : 
                $("button.ui.button.traff_per_"+periodSplit[2]).addClass('active').siblings().removeClass('active')
                if(!$$('home:vue1:trend:traff')._days) $$('home:vue1:trend:traff')._days = [];
                if(!$$('home:vue1:trend:traff')._days.some(d => d == params.data.upd_dt)){
                        let dat = getFiterDate('traffic', 'vue3', params.data.upd_dt, 'vue3');
                        $$('home:vue1:trend:traff').showProgress();
                        $$('home:vue1:trend:traff').disable()                        
                        dat.then( (d) => {
                            $$('home:vue1:trend:traff')._days.push(params.data.upd_dt);
                            $$('home:vue1:trend:traff')._filter_level = 's';
                            $$('home:vue1:trend:traff').parse(dat).then(()=>{$$('home:vue1:trend:traff').data.filter((d) =>  {
                                return (d._type == 'slot_trend' && (d.period == params.data.upd_dt )) 
                                });});
                            
                        $$('home:vue1:trend:traff')._current_upd_dt = params.data.upd_dt;
                        $$('home:vue1:trend:traff')._current_serie_selected = params.seriesName;
                        $$('home:vue1:trend:traff').enable();
                        $$('home:vue1:trend:traff').hideProgress();
                })}
                else {
                    $$('home:vue1:trend:traff')._filter_level = 's';
                    $$('home:vue1:trend:traff')._current_upd_dt = params.data.upd_dt;
                    $$('home:vue1:trend:traff').data.filter((d) =>  {
                        return (d._type == 'slot_trend' && (d.period == params.data.upd_dt)) 
                    })
                }
                break
            
                default:
                    break;
            }
        }

}
