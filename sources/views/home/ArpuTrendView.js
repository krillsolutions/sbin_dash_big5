import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components, color_ref, dataDesc} from "models/referential/genReferentials";
import { getHomeChartData, getFiterDate} from "models/data/home/data";
import { formatter,getScreenType,kFormatter,updateChartReady } from "models/utils/home/utils";
import {getDates} from "models/utils/general/utils";
export default class HomearpuNewTrendView extends JetView{


	config() {

        return webix.promise.all([color_ref,dataDesc]).then((data) => {
            let color_ref = data[0];
            let dataDesc = data[1];
    
		return {
			view : 'echarts-grid-dataset',
            id : 'home:vue1:trend:arpu',
            animation: true,
//            minHeight : 115,

            beforedisplay : function(dat, conf, echart_obj) {
                let series = [], dataset = [],colors = [], revenues = {};
                let types = dat.map(d => d.client_type).filter((d,i,ar) => ar.indexOf(d) == i);
                if(dat.length == 0) return;	    
                //console.log(color_ref)
                types.forEach(elm => {
                    if( dat.some(d => d._type == 'month_trend')  ){
                        dataset.push({dimensions : ['month', 'trend'], source : dat.filter(d => (d.client_type == elm) && (d._type == 'month_trend')  ), isAdded : true});
                        series.push({type : 'line', itemStyle : {color : color_ref.revenue[elm] } , lineStyle : {color :color_ref.revenue[elm] }, datasetIndex : dataset.length -1, //tooltip : {trigger : 'item'} ,
                        name : elm  , encode : {x : 'month', y : 'trend'} ,gridIndex : 1 , smooth : true,
                        }
                        );
                    }
                    if(dat.some(d => d._type == 'dt_trend')) {
                        dataset.push({dimensions : ['upd_dt', 'trend_dt'], source : dat.filter(d => (d.client_type == elm) && d._type == 'dt_trend' ), isAdded : true});
                        series.push({type : 'bar', smooth : true,barMinHeight: 10,
                        itemStyle : {color : color_ref.revenue[elm]},
                        name : elm, encode : {x : 'upd_dt', y : 'trend_dt'}  ,  datasetIndex : dataset.length - 1,gridIndex : 1
                    
                        });
                    }

  
            colors.push(color_ref.revenue[elm]);
                });
                
                conf.series = conf.series.filter(d => (typeof d._isStack == 'undefined'));
                conf.dataset = conf.dataset.filter(d => (typeof d.isAdded == 'undefined'));
                if(dataset.length != 0) conf.dataset = dataset//[...conf.dataset, ...dataset];
                if(colors.length != 0) conf.color = [...colors];
                if(series.length != 0) conf.series =  series;//[...series, ...conf.series];
                //if(dat.some(d => d._type == 'dt_trend')) conf.legend['selectedMode'] = 'single';
                 conf.legend['selectedMode'] = 'single';
            },

            charts_event : {

                'click' : [  {seriesType : 'line'}, function(params){
    
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

                    $("button.ui.button.arpuHome_"+periodSplit[1]).addClass('active').siblings().removeClass('active')
    
                    if(!$$('home:vue1:trend:arpu')._months) $$('home:vue1:trend:arpu')._months = [];
                    if(!$$('home:vue1:trend:arpu')._months.some(d => d == params.data.month)){
                            let dat = getFiterDate('arpu', 'dt_trend', params.data.month+'-01');
                            $$('home:vue1:trend:arpu').showProgress();
                            $$('home:vue1:trend:arpu').disable()                        
                            dat.then( (d) => {
                                $$('home:vue1:trend:arpu')._months.push(params.data.month);
                                $$('home:vue1:trend:arpu')._filter_level = 'm';
                                $$('home:vue1:trend:arpu').parse(dat).then(()=>{$$('home:vue1:trend:arpu').data.filter((d) =>  {
                                    return d._type != 'month_trend' && (d.period == params.data.month || d.rec_type)
                                    });});
                                
                            $$('home:vue1:trend:arpu')._current_month = params.data.month;
                            $$('home:vue1:trend:arpu').enable();
                            $$('home:vue1:trend:arpu').hideProgress();
                    })}
                    else {
                        $$('home:vue1:trend:arpu')._filter_level = 'm';
                        $$('home:vue1:trend:arpu')._current_month = params.data.month;
                        $$('home:vue1:trend:arpu').data.filter((d) =>  {
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
		    /* formatter : function(param) {
                          let rt = param[0].name+'<br/>';
                          let dim = param[0].dimensionNames[1];
                          rt+= param[0].marker+formatter(param[0].data[dim]);
                          return rt
             }*/             
             formatter : function(param) {
                let rt = param[0].name+'<br/>';
                let dim = param[0].dimensionNames[1];
                console.log(dim)
                for (const elm of param) {
                  rt+= elm.marker+(dataDesc.revenue[elm.seriesName]?dataDesc.revenue[elm.seriesName] :elm.seriesName )+' : '+ (  formatter(elm.value[dim]) )+'<br/>'; 
                  
                }
                return rt;
                

            },

	     },

    			grid: [ {
                    left : 5,
                    //height : '60%',
                    top : 10,
                    right : 5,
                    bottom : 35,
                    containLabel: true
            }],
            legend : {show : true, itemGap : 20, bottom : 5, type : 'scroll', textStyle : {fontSize : 10},formatter : function(pr) { return (dataDesc.revenue[pr]? dataDesc.revenue[pr] : pr)  }},
            dataset : [

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
                /*{
                    type : 'line', encode : {x : 'month', y : 'trend'},datasetIndex : 0,
                    _type : 'month_trend', id : 'home:arpu_split',
                    areaStyle: {
            
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: 'grey'
                            }, {
                                offset: 1, color: 'white' 
                            }],
                            global: false 
                        }
                    },smooth :true,
                    lineStyle: {
                        color: "grey",
                        width: 2.5
                    },
                    itemStyle : {

                        color : "grey"
                    },
					z : 3               
                 },
                {
                    type : 'line', encode : {x : 'upd_dt', y : 'trend_dt'}, _type : 'dt_trend',datasetIndex : 1
                }*/

			]		
		}
		}})
	}


        init(view) {

                $$("home:vue1:trend:arpu").showProgress();
                $$("home:vue1:trend:arpu").disable();
                components['home'].push({cmp : "home:vue1:trend:arpu", data : getHomeChartData('trend_arpu').config.id});
                $$('home:vue1:trend:arpu')._months = [];
                $$('home:vue1:trend:arpu')._current_month = getDates()['d1'].substr(0,7);
                $$('home:vue1:trend:arpu')._filter_level = 'a';
                getHomeChartData('trend_arpu').waitData.then((d) => {
			$$("home:vue1:trend:arpu")._isDataLoaded = 1;
                        $$("home:vue1:trend:arpu").parse(getHomeChartData('trend_arpu'));
                        $$("home:vue1:trend:arpu").enable();
                        $$("home:vue1:trend:arpu").hideProgress();

                });

                $$("home:vue1:trend:arpu").data.attachEvent("onStoreLoad", function () {
                                updateChartReady("home:vue1:trend:arpu");
                });
                getHomeChartData('trend_arpu').attachEvent("onBeforeLoad", function () {
                    if($$('top:menu').getSelectedId() == 'home') {
                    $$('home:vue1:trend:arpu')._months = [];
                    $$('home:vue1:trend:arpu')._current_month = getDates()['d1'].substr(0,7);
                    $$('home:vue1:trend:arpu')._filter_level = 'a';
                    }
                });
        }


        ready(view){
            $$("arpuHome").attachEvent("onAfterRender", function(){
            $('button.ui.button.arpuHome_'+periodSplit[1]).on('click',function(){
                if( view._filter_level == 'a'){
                   
                    view._filter_level = 'm';
                    if(!view._months.some(d => d == view._current_month)){
                        let dat = getFiterDate('arpu', 'dt_trend', view._current_month+'-01');
                        view.showProgress();
                        view.disable()
                        dat.then( (d) => {
                            view._months.push(view._current_month);
                            view.parse(dat).then(()=>{view.data.filter((d) =>  {
                                return d._type != 'month_trend' && (d.period == view._current_month)
                            });});

                        view._current_month = view._current_month;
                        view.enable();
                        view.hideProgress();
                    })}
                    else
                        view.data.filter((d)=> {
                            return d._type != 'month_trend' && (d.period == view._current_month)

                        });
                }
                    

            })

            $('button.ui.button.arpuHome_'+periodSplit[0]).on('click',function(){
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
