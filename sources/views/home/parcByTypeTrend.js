import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components, color_ref, dataDesc} from "models/referential/genReferentials";
import { getHomeChartData, getFiterDate} from "models/data/home/data";
import { getScreenType, kFormatter,updateChartReady , formatter} from "models/utils/home/utils";
import {getDates} from "models/utils/general/utils";
export default class ParcByTypeTrendViewNew extends JetView{

	config() {

          return webix.promise.all([color_ref,dataDesc]).then((data) => {
                  let color_ref = data[0];
                  let dataDesc = data[1];
		return {
			view : 'echarts-grid-dataset',
            id : 'parc:vue1:trend',
            animation: true,
            beforedisplay : function(dat, conf, echart_obj) {
                let series = [], dataset = [],colors = [], revenues = {};
                let types = dat.map(d => d.client_type).filter((d,i,ar) => ar.indexOf(d) == i);
		        if(dat.length == 0) return;	    

                echart_obj.off('click');
                types.forEach(elm => {
                    if( dat.some(d => d._type == 'month_trend')  ){
                        dataset.push({dimensions : ['month', 'parc'], source : dat.filter(d => (d.client_type == elm) && d._type == 'month_trend')});
                        series.push({
                            type : 'bar', itemStyle : {color : color_ref.parc[elm] }, id :'parc_type_trend:'+elm, datasetIndex : dataset.length -1,barMinHeight: 10,barMaxWidth : 20,
                            name : elm , encode : {x : 'month', y : 'parc'} ,gridIndex : 1 
                        }
                        );
                    }
                    if(dat.some(d => d._type == 'dt_trend')) {
                        dataset.push({dimensions : ['upd_dt', 'parc'], source : dat.filter(d => (d.client_type == elm) && d._type == 'dt_trend')});
                        series.push({type : 'line', smooth : true,lineStyle : {color :color_ref.parc[elm] },
                        itemStyle : {color : color_ref.parc[elm]},
                         name : elm, encode : {x : 'upd_dt', y : 'parc'}  ,  datasetIndex : dataset.length -1,gridIndex : 1
                    
                         });
                    }
                    
                    echart_obj.on('click', {seriesId : 'parc_type_trend:'+elm,  seriesType : 'bar'}, (params) => { 
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
			    ParcByTypeTrendViewNew.filterHandler(params)
		    });
		    colors.push(color_ref.parc[elm]);
                });
                
               // conf.series = series; //conf.series.filter(d => (typeof d._isStack == 'undefined'));
               // conf.dataset = dataset;// conf.dataset.filter(d => (typeof d.isAdded == 'undefined'));
                if(dataset.length != 0) conf.dataset = dataset;// [...conf.dataset, ...dataset];
		        if(colors.length != 0) conf.color = [...colors];
                if(series.length != 0) conf.series = series;// [...series, ...conf.series];
                
                conf.legend['selectedMode'] = 'multiple';
            },
			options :{
                tooltip : {
                    trigger: "axis",
                    show : true,
                    z : 2 ,
                    formatter : function(param) {
                        let rt = param[0].name+'<br/>';
                        for (const elm of param) {
                          rt+= elm.marker+dataDesc.parc[elm.seriesName]+' : '+ (  formatter(elm.value.parc) )+'<br/>'; 
                          
                        }
                        return rt;
                        
    
                    },
                    backgroundColor: 'rgba(245, 245, 245, 0.8)',
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 10,
                    textStyle: {
                        color: '#000'
                    },
                    position: function (pos, params, el, elRect, size) {
                       var obj =  {top : 10};
                        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                        return obj;
                    }			
                },
				legend : {show : true, itemGap : 20, bottom : 5, type : 'scroll', textStyle : {fontSize : 10},formatter : function(pr) { return (dataDesc.parc[pr]? dataDesc.parc[pr] : pr)  }},
            dataset : [
		                {
                    dimensions : ['client_type', 'parc']
                }
            ],
	   grid : [
	    {
		    left : 5,
		    //height : '60%',
		    top : 10,
		    right : 5,
		    bottom : 35,
		    containLabel: true
	    
	    }
	   ],				

			xAxis: [
               {
		       axisLabel: {show: true},axisTick: {show: true},type : 'category'//,gridIndex : 1,
                },
			],
			yAxis: [
                {
				type: 'value',
                splitNumber : 3,
			//	gridIndex : 1,
				 axisLabel: {
                        formatter : function(val, ind){
                            return kFormatter(val);
                        }
    				},
    				splitLine: {
        				show: true
    				}
			}
			],			
			series : [
            		],
		
		}
		}
	   })
	}

        init(view) {
                

                $$("parc:vue1:trend").showProgress();
                $$("parc:vue1:trend").disable();
                $$('parc:vue1:trend')._filter_level = 'a';
                $$('parc:vue1:trend')._months = [];
                $$('parc:vue1:trend')._days = [];
                $$('parc:vue1:trend')._current_month = getDates()['d1'].substr(0,7);
                $$('parc:vue1:trend')._current_upd_dt = getDates()['d1'];
                components['home'].push( {cmp : "parc:vue1:trend", data :getHomeChartData('parc_trend').config.id });
                getHomeChartData('parc_trend').waitData.then((d) => {
			$$("parc:vue1:trend")._isDataLoaded = 1;
                        $$("parc:vue1:trend").parse(getHomeChartData('parc_trend'));
                        $$("parc:vue1:trend").enable();
                        $$("parc:vue1:trend").hideProgress();
                });
                $$("parc:vue1:trend").data.attachEvent("onStoreLoad", function () {
                                updateChartReady("parc:vue1:trend");
                });
                getHomeChartData('parc_trend').attachEvent("onBeforeLoad", function () {
                    if($$('top:menu').getSelectedId() == 'home'){
                    $$('parc:vue1:trend')._filter_level = 'a';
                    $$('parc:vue1:trend')._months = [];
                    $$('parc:vue1:trend')._current_month = getDates()['d1'].substr(0,7);
                    $$('parc:vue1:trend')._current_upd_dt = getDates()['d1'];
                    }
                });
                $('button.ui.button.parcByType_'+periodSplit[1]).on('click',function(){
                            if( $$('parc:vue1:trend')._filter_level != 'm')
                                    ParcByTypeTrendViewNew.filterHandler({data : {month : $$('parc:vue1:trend')._current_month }})                
                })

                $('button.ui.button.parcByType_'+periodSplit[0]).on('click',function(){
                    if ($$('parc:vue1:trend')._filter_level == 'm') {
                                    $$('parc:vue1:trend')._filter_level = 'a';
                                    $$('parc:vue1:trend').data.filter((d)=> d._type == 'month_trend' || d._type == 'parc_type') ;

                    }
                }
                )

        }

        static filterHandler(params){
            if(!params.data) return;

	    $("button.ui.button.parcByType_"+periodSplit[1]).addClass('active').siblings().removeClass('active')
            if(!$$('parc:vue1:trend')._months) $$('parc:vue1:trend')._months = [];
            if(!$$('parc:vue1:trend')._months.some(d => d == params.data.month)){
                    let dat = getFiterDate('parc', 'dt_trend', params.data.month+'-01', 'vue2');
                    $$('parc:vue1:trend').showProgress();
                    $$('parc:vue1:trend').disable()                        
                    dat.then( (d) => {
                        $$('parc:vue1:trend')._months.push(params.data.month);
                        $$('parc:vue1:trend')._filter_level = 'm';
                        $$('parc:vue1:trend').parse(dat).then(()=>{$$('parc:vue1:trend').data.filter((d) =>  {
                            return (d._type != 'month_trend' && (d.period == params.data.month ));
                            });});
                        
                    $$('parc:vue1:trend')._current_month = params.data.month;
                    $$('parc:vue1:trend').enable();
                    $$('parc:vue1:trend').hideProgress();
            })}
            else {
                $$('parc:vue1:trend')._filter_level = 'm';
                $$('parc:vue1:trend')._current_month = params.data.month;
                $$('parc:vue1:trend').data.filter((d) =>  {
                    return (d._type != 'month_trend' && (d.period == params.data.month));
                })
            }

        }
        
}

