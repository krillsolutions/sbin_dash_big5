import {JetView} from "webix-jet";
import * as ech from "views/newHome/echart_cmp_dataset";
import {components, color_ref, dataDesc} from "models/referential/genReferentials";
import { getRevChartData, getFiterDate} from "models/data/revenue/data";
import { getScreenType, kFormatter,updateChartReady , formatter} from "models/utils/home/utils";
import {getDates} from "models/utils/general/utils";
export default class RevByTypeTrendViewNew extends JetView{

	config() {

          return webix.promise.all([color_ref,dataDesc]).then((data) => {
                  let color_ref = data[0];
                  let dataDesc = data[1];
		return {
			view : 'echarts-grid-dataset',
            id : 'rev:vue1:trend',
            animation: true,
            beforedisplay : function(dat, conf, echart_obj) {
                let series = [], dataset = [],colors = [], revenues = {};
                let revs = dat.map(d => d.rev_type).filter((d,i,ar) => ar.indexOf(d) == i);
		if(dat.length == 0) return;	    

                echart_obj.off('click');
                revs.forEach(elm => {
                    if( dat.some(d => d._type == 'month_trend')  ){
                        dataset.push({dimensions : ['month', 'revenue'], source : dat.filter(d => (d.rev_type == elm) && d._type == 'month_trend'), isAdded : true});
                        series.push({type : 'bar', itemStyle : {color : color_ref.revenue[elm]  /*function(para) {return color_ref.revenue[para.name]}*/},stack : 'split', id :'rev_split_trend:'+elm, datasetIndex : dataset.length,barMinHeight: 10, //tooltip : {trigger : 'item'} ,
                        _isStack :true, name : elm/*dataDesc.revenue[elm]*/  , encode : {x : 'month', y : 'revenue'} ,gridIndex : 1 
                        }
                        );
                    }
                    if(dat.some(d => d._type == 'dt_trend')) {
                        dataset.push({dimensions : ['upd_dt', 'revenue'], source : dat.filter(d => (d.rev_type == elm) && d._type == 'dt_trend'), isAdded : true});
                        series.push({type : 'line', smooth : true,lineStyle : {color :color_ref.revenue[elm] },
                        itemStyle : {color : color_ref.revenue[elm]},
                        _isStack :true, name : elm/*dataDesc.revenue[elm]*/, enable : {x : 'upd_dt', y : 'revenue'}  ,  datasetIndex : dataset.length,gridIndex : 1
                    
                         });
                    }

                    if(dat.some(d => d._type == 'slot_trend')) {
                        dataset.push({dimensions : ['slot', 'revenue'], source : dat.filter(d => (d.rev_type == elm) && d._type == 'slot_trend'), isAdded : true});
                        series.push({type : 'bar', 
                        itemStyle : {color : color_ref.revenue[elm]},
                        _isStack :true, name :elm/*dataDesc.revenue[elm]*/, enable : {x : 'slot', y : 'revenue'}  ,  datasetIndex : dataset.length,gridIndex : 1
                    
                         });
                         
                    }
                    
                    echart_obj.on('click', {seriesId : 'rev_split_trend:'+elm,  seriesType : 'bar'}, (params) => { 
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
			    RevByTypeTrendViewNew.filterHandler(params)
		    });
		    colors.push(color_ref.rechargeEC[elm]);
                });
                
                conf.series = conf.series.filter(d => (typeof d._isStack == 'undefined'));
                conf.dataset = conf.dataset.filter(d => (typeof d.isAdded == 'undefined'));
                if(dataset.length != 0) conf.dataset = [...conf.dataset, ...dataset];
		if(colors.length != 0) conf.color = [...colors];
                if(series.length != 0) conf.series =  [...series, ...conf.series];
                if(dat.some(d => d._type == 'slot_trend')) conf.legend['selectedMode'] = 'single';
                else conf.legend['selectedMode'] = 'multiple';
                if(dat.some(d => d._type == 'dt_trend')) echart_obj.on('click', {seriesType : 'line'}, (params) => { 
		                        let tp =  (getScreenType() != 'mobile' && getScreenType() != 'mobile_rotated' )? true : false;
                                        if(!tp) {

                                                let obj = this;
                                                this.executeSDoubleClick = setTimeout(function(){ obj._sclicked = false; } , 500);
                                                if(this._sclicked) {tp = true; obj._sclicked = false; clearTimeout(this.executeSDoubleClick)  }
                                        }
                                        if(!tp) {
                                                this._sclicked = true;
                                                return
                                        }
			RevByTypeTrendViewNew.filterSlotHandler(params)
		
		});
            },
			options :{
                tooltip : {
                    trigger: "axis",
                    show : true,
                    z : 2 ,
                    formatter : function(param) {
                        let rt = param[0].name+'<br/>';
                        for (const elm of param) {
                          rt+= elm.marker+dataDesc.revenue[elm.seriesName]+' : '+ (  formatter(elm.value.revenue) )+'<br/>'; 
                          
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
				legend : {show : true, itemGap : 20, bottom : 5, type : 'scroll', textStyle : {fontSize : 10},formatter : function(pr) { return (dataDesc.revenue[pr]? dataDesc.revenue[pr] : pr)  }},
            dataset : [
		                {
                    dimensions : ['rev_type', 'revenue']
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
                

                $$("rev:vue1:trend").showProgress();
                $$("rev:vue1:trend").disable();
                $$('rev:vue1:trend')._filter_level = 'a';
                $$('rev:vue1:trend')._months = [];
                $$('rev:vue1:trend')._days = [];
                $$('rev:vue1:trend')._current_month = getDates()['d1'].substr(0,7);
                $$('rev:vue1:trend')._current_upd_dt = getDates()['d1'];
                components['revenue'].push( {cmp : "rev:vue1:trend", data :getRevChartData('revType_trend').config.id });
                getRevChartData('revType_trend').waitData.then((d) => {
			$$("rev:vue1:trend")._isDataLoaded = 1;
                        $$("rev:vue1:trend").parse(getRevChartData('revType_trend'));
                        $$("rev:vue1:trend").enable();
                        $$("rev:vue1:trend").hideProgress();

                });

                $$("rev:vue1:trend").data.attachEvent("onStoreLoad", function () {
                                updateChartReady("rev:vue1:trend");
                });
                $$("rev:vue1:trend").data.attachEvent("onBeforeLoad", function () {
                    $$('rev:vue1:trend')._filter_level = 'a';
                    $$('rev:vue1:trend')._months = [];
                    $$('rev:vue1:trend')._current_month = getDates()['d1'].substr(0,7);
                    $$('rev:vue1:trend')._current_upd_dt = getDates()['d1'];
                });
                $('button.ui.button.revByType_'+periodSplit[1]).on('click',function(){
                            if( $$('rev:vue1:trend')._filter_level != 'm')
                                    RevByTypeTrendViewNew.filterHandler({data : {month : $$('rev:vue1:trend')._current_month }})
                
                })

                $('button.ui.button.revByType_'+periodSplit[2]).on('click',function(){
                       if( $$('rev:vue1:trend')._filter_level != 's')
                            RevByTypeTrendViewNew.filterSlotHandler({data : {upd_dt : $$('rev:vue1:trend')._current_upd_dt , seriesName : $$('rev:vue1:trend')._current_serie_selected}})

                })

                $('button.ui.button.revByType_'+periodSplit[0]).on('click',function(){
                    if ($$('rev:vue1:trend')._filter_level == 'm' || $$('rev:vue1:trend')._filter_level  == 's') {
                                    $$('rev:vue1:trend')._filter_level = 'a';
                                    $$('rev:vue1:trend').data.filter((d)=> d._type == 'month_trend' || d._type == 'rev_split') ;

                    }
                }
                )

        }

        static filterHandler(params){
            if(!params.data) return;

	    $("button.ui.button.revByType_"+periodSplit[1]).addClass('active').siblings().removeClass('active')
            if(!$$('rev:vue1:trend')._months) $$('rev:vue1:trend')._months = [];
            if(!$$('rev:vue1:trend')._months.some(d => d == params.data.month)){
                    let dat = getFiterDate('revenue', 'dt_trend', params.data.month+'-01');
                    $$('rev:vue1:trend').showProgress();
                    $$('rev:vue1:trend').disable()                        
                    dat.then( (d) => {
                        $$('rev:vue1:trend')._months.push(params.data.month);
                        $$('rev:vue1:trend')._filter_level = 'm';
                        $$('rev:vue1:trend').parse(dat).then(()=>{$$('rev:vue1:trend').data.filter((d) =>  {
                            return (d._type != 'month_trend' && (d.period == params.data.month )) || d._type == 'rev_split';
                            });});
                        
                    $$('rev:vue1:trend')._current_month = params.data.month;
                    $$('rev:vue1:trend').enable();
                    $$('rev:vue1:trend').hideProgress();
            })}
            else {
                $$('rev:vue1:trend')._filter_level = 'm';
                $$('rev:vue1:trend')._current_month = params.data.month;
                $$('rev:vue1:trend').data.filter((d) =>  {
                    return (d._type != 'month_trend' && (d.period == params.data.month)) || d._type == 'rev_split';
                })
            }

        }
        static filterSlotHandler(params){
            if(!params.data) return;
	    $("button.ui.button.revByType_"+periodSplit[2]).addClass('active').siblings().removeClass('active')
            if(!$$('rev:vue1:trend')._days) $$('rev:vue1:trend')._days = [];
            if(!$$('rev:vue1:trend')._days.some(d => d == params.data.upd_dt)){
                    let dat = getFiterDate('revenue', 'slot_trend', params.data.upd_dt, 'vue3');
                    $$('rev:vue1:trend').showProgress();
                    $$('rev:vue1:trend').disable()                        
                    dat.then( (d) => {
                        $$('rev:vue1:trend')._days.push(params.data.upd_dt);
                        $$('rev:vue1:trend')._filter_level = 's';
                        $$('rev:vue1:trend').config.options.legend['selected'] = {};
                        $$('rev:vue1:trend').config.options.legend['selected'][params.seriesName] =  true;
                        $$('rev:vue1:trend').parse(dat).then(()=>{$$('rev:vue1:trend').data.filter((d) =>  {
                            return (d._type == 'slot_trend' && (d.period == params.data.upd_dt )) || d._type == 'rev_split';
                            });});
                        
                    $$('rev:vue1:trend')._current_upd_dt = params.data.upd_dt;
                    $$('rev:vue1:trend')._current_serie_selected = params.seriesName;
                    $$('rev:vue1:trend').enable();
                    $$('rev:vue1:trend').hideProgress();
            })}
            else {
                $$('rev:vue1:trend')._filter_level = 's';
                $$('rev:vue1:trend')._current_upd_dt = params.data.upd_dt;
                $$('rev:vue1:trend').config.options.legend['selected'] = {};
                $$('rev:vue1:trend').config.options.legend['selected'][params.seriesName] =  true;
                $$('rev:vue1:trend').data.filter((d) =>  {
                    return (d._type == 'slot_trend' && (d.period == params.data.upd_dt)) || d._type == 'rev_split';
                })
            }

        }
}

