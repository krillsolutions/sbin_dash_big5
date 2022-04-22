import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components, color_ref,dash_titles, dataDesc} from "models/referential/genReferentials";
import { getRechargeChartData, getFiterDate} from "models/data/recharge/data";
import { getScreenType,kFormatter,updateChartReady , formatter} from "models/utils/home/utils";
import {getDates} from "models/utils/general/utils";
export default class RecByTypeTrendView extends JetView{

	config() {

        let kp = this._kpi;
		return {
			view : 'echarts-grid-dataset',
            id : 'rec:type:vue1:trend',
            animation: true,
            beforedisplay : function(dat, conf, echart_obj) {
                let series = [], dataset = [], recharges = {};
//                let rec = dat.map(d => d.rec_type).filter((d,i,ar) => ar.indexOf(d) == i);
		if(dat.length == 0 ) return;
                if(dat[0].upd_dt) {
                    dat.sort((a,b) => (a.upd_dt > b.upd_dt) ? 1:-1);
                }
                dat.forEach(elm => {

                        if (!recharges[elm.rec_type]) recharges[elm.rec_type] = 0;
                         recharges[elm.rec_type]++;
                 } );
                let rec = Object.keys(recharges).map((k) => { return {op : k, cnt : recharges[k]}  }).sort((a,b) => (a.cnt > b.cnt)? -1 : 1 ).map(d => d.op);
                
                let xaxis  = []
                if(dat[0]._type == 'month_trend') {
                    dat.sort((a,b) => (b.month < a.month) ? 1 : -1 )
                    xaxis = dat.map(d => d.month).filter(d => typeof d != 'undefined')
                }
                if(dat[0]._type == 'dt_trend') {
                    dat.sort((a,b) => (b.upd_dt < a.upd_dt) ? 1 : -1 )
                    xaxis = dat.map(d => d.upd_dt).filter(d => typeof d != 'undefined')
                }
                if(dat[0]._type == 'slot_trend') {
                    dat.sort((a,b) => (b.slot < a.slot) ? 1 : -1 )
                    xaxis = dat.map(d => d.slot).filter(d => typeof d != 'undefined')
                }
                xaxis = xaxis.filter((d,i,ar) => ar.indexOf(d) == i)
                echart_obj.off('click');
                rec.forEach(elm => {
                    if(dat[0]._type == 'month_trend'){
                        dataset.push({dimensions : ['month', 'amnt'], source : dat.filter(d => (d.rec_type == elm) && d._type == 'month_trend'), isAdded : true});
                        series.push({type : 'bar',stack : 'split', id :'rec_split_trend:'+elm, datasetIndex : dataset.length-1,barMinHeight: 10,// tooltip : {trigger : 'item'} ,
                        _isStack :true, name : elm  , encode : {x : 'month', y : 'amnt'} , 
                       /* tooltip : {trigger : 'item',show : true, formatter: function(params) {
                            if(params.value) return params.marker+params.seriesName+'<br/>'+ params.name+' : '+formatter(params.value.amnt);
                            }
                        },*/
                        }
                        );
                    }
                    if(dat[0]._type == 'dt_trend') {
                        dataset.push({dimensions : ['upd_dt', 'amnt'], source : dat.filter(d => (d.rec_type == elm) && d._type == 'dt_trend' ), isAdded : true});
                        series.push({type : 'line', smooth : true,//lineStyle : {color :color_ref.amnt[elm] },
                        //itemStyle : {color : color_ref.amnt[elm]},
                        _isStack :true, name : elm, ecode : {x : 'upd_dt', y : 'amnt'}  ,  datasetIndex : dataset.length-1,
                    
                         });
                    }

                    if(dat[0]._type == 'slot_trend') {
                        dataset.push({dimensions : ['slot', 'amnt'], source : dat.filter(d => (d.rec_type == elm) && d._type == 'slot_trend'), isAdded : true});
                        series.push({type : 'bar', 
                        //itemStyle : {color : color_ref.amnt[elm]},
                        _isStack :true, name : elm, ecode : {x : 'slot', y : 'amnt'}  ,  datasetIndex : dataset.length-1,
                    
                         });
                         
                    }
                    
                    echart_obj.on('click', {seriesId : 'rec_split_trend:'+elm,  seriesType : 'bar'}, (params) => { 
                                        let tp =  (getScreenType() != 'mobile' && getScreenType() != 'mobile_rotated')? true : false;
                                        if(!tp) {

                                                let obj = this;
                                                this.executeDoubleClick = setTimeout(function(){ obj._clicked = false; } , 500);
                                                if(this._clicked) {tp = true; obj._clicked = false; clearTimeout(this.executeDoubleClick)  }
                                        }
                                        if(!tp) {
                                                this._clicked = true;
                                                return
                                        } 		
			    RecByTypeTrendView.filterHandler(params)
		    });
                });
                
                conf.series = conf.series.filter(d => (typeof d._isStack == 'undefined'));
                conf.dataset = conf.dataset.filter(d => (typeof d.isAdded == 'undefined'));
                if(xaxis.length != 0) conf.xAxis[0].data = xaxis
                if(dataset.length != 0) conf.dataset = [...conf.dataset, ...dataset];
                if(series.length != 0) conf.series = series;//[...series, ...conf.series];
                if(dat[0]._type == 'slot_trend') conf.legend['selectedMode'] = 'single';
                else conf.legend['selectedMode'] = 'multiple';
                if(dat[0]._type == 'dt_trend') echart_obj.on('click', {seriesType : 'line'}, (params) => { 
                                        let tp =  (getScreenType() != 'mobile' &&  getScreenType() != 'mobile_rotated')? true : false;
                                        if(!tp) {

                                                let obj = this;
                                                this.executeSDoubleClick = setTimeout(function(){ obj._sclicked = false; } , 500);
                                                if(this._sclicked) {tp = true; obj._sclicked = false; clearTimeout(this.executeSDoubleClick)  }
                                        }
                                        if(!tp) {
                                                this._sclicked = true;
                                                return
                                        } 		
			RecByTypeTrendView.filterSlotHandler(params)
		});
            },
			options :{
                tooltip : {
                    trigger: "axis",
                    show : true,
                    z : 2 ,
                    formatter : function(param) {
                        //console.log(param);
                        let rt = param[0].name+'<br/>';
                        for (const elm of param) {
                          rt+= elm.marker+elm.seriesName+' : '+ (  formatter(elm.value.amnt) )+'<br/>'; 
                          
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
                        var obj = {top: 10};
                        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                        return obj;
                    }
                },
                legend : {show : true, type : 'scroll', top : '20', textStyle : {fontSize : 10}/*, orient : "vertical", top : '40', right : '20%'*/},
			    title : [
				
				{
					text : dash_titles['recharge'].rec_by_type_trend? dash_titles['recharge'].rec_by_type_trend : "",
					//subtext : 'Revenu',
					left : '50%',
                    textAlign: 'center',
                    textStyle : {
                        fontSize : 12
                    }
				}				
			],
            dataset : [
            ],

            grid : {
                left : 10,
                containLabel: true,
		bottom : 5
            },
			xAxis: [
               {
                    axisLabel: {show: true},axisTick: {show: true},type : 'category'
                },
			],
			yAxis: [
                {
				type: 'value',
				 axisLabel: {
                        formatter : function(val, ind){
                            return  kFormatter(val);
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
	}

    

        init(view) {
                
               view.showProgress();
               view.disable();
                view._filter_level = 'a';
                view._months = [];
                view._days = [];
                view._current_month = getDates()['d1'].substr(0,7);
                view._current_upd_dt = getDates()['d1'];
                components['recharge'].push( {cmp : "rec:type:vue1:trend", data :getRechargeChartData('type_trend').config.id });
                getRechargeChartData('type_trend').waitData.then((d) => {
			view._isDataLoaded = 1;
                       view.parse(getRechargeChartData('type_trend'));
                       view.enable();
                       view.hideProgress();

                });

               view.data.attachEvent("onStoreLoad", function () {
                                updateChartReady("rec:type:vue1:trend");
                });
               view.data.attachEvent("onBeforeLoad", function () {
                if($$('top:menu').getSelectedId() == 'recharge'){
                    view._filter_level = 'a';
                    view._months = [];
                    view._current_month = getDates()['d1'].substr(0,7);
                    view._current_upd_dt = getDates()['d1'];
                }
                });
                let kp = 'trend'

                $$('recByType_'+kp).attachEvent("onAfterRender", function(){
                        
                        $('button.ui.button.recByType_'+kp+'_'+periodSplit[1]).on('click',function(){
                            if( view._filter_level != 'm')
                                    RecByTypeTrendView.filterHandler({data : {month : view._current_month }})
                
                        })
        
                        $('button.ui.button.recByType_'+kp+'_'+periodSplit[2]).on('click',function(){
                            if( view._filter_level != 's')
                                    RecByTypeTrendView.filterSlotHandler({data : {upd_dt : view._current_upd_dt , seriesName : view._current_serie_selected}})
        
                        })
        
                        $('button.ui.button.recByType_'+kp+'_'+periodSplit[0]).on('click',function(){
                            if (view._filter_level == 'm' || view._filter_level  == 's') {
                                            view._filter_level = 'a';
                                            view.data.filter((d)=> d._type == 'month_trend' ) ;
        
                            }
                        }
                        )
                    
                    
                })

        }

        
        /*ready(view) {
            let kp = 'trend'
            $$('recByType_'+kp).attachEvent("onViewShow", function(){
            console.log( $('button.ui.button.recByType_'+kp+'_'+periodSplit[1]))
            $('button.ui.button.recByType_'+kp+'_'+periodSplit[1]).on('click',function(){
                if( view._filter_level != 'm')
                        RecByTypeTrendView.filterHandler({data : {month : view._current_month }})
    
            })

            $('button.ui.button.recByType_'+kp+'_'+periodSplit[2]).on('click',function(){
                if( view._filter_level != 's')
                        RecByTypeTrendView.filterSlotHandler({data : {upd_dt : view._current_upd_dt , seriesName : view._current_serie_selected}})

            })

            $('button.ui.button.recByType_'+kp+'_'+periodSplit[0]).on('click',function(){
                if (view._filter_level == 'm' || view._filter_level  == 's') {
                                view._filter_level = 'a';
                                view.data.filter((d)=> d._type == 'month_trend' ) ;

                }
            }
            
            )
        })
        }*/

        static filterHandler(params){
            if(!params.data) return;
            let kp = 'trend'
	    $("button.ui.button.recByType_"+kp+"_"+periodSplit[1]).addClass('active').siblings().removeClass('active')
            if(!$$("rec:type:vue1:trend")._months) $$("rec:type:vue1:trend")._months = [];
            if(!$$("rec:type:vue1:trend")._months.some(d => d == params.data.month)){
                    let dat = getFiterDate('type_trend', 'vue2', params.data.month+'-01');
                    $$("rec:type:vue1:trend").showProgress();
                    $$("rec:type:vue1:trend").disable()                        
                    dat.then( (d) => {
                        $$("rec:type:vue1:trend")._months.push(params.data.month);
                        $$("rec:type:vue1:trend")._filter_level = 'm';
                        $$("rec:type:vue1:trend").parse(dat).then(()=>{$$("rec:type:vue1:trend").data.filter((d) =>  {
                            return (d._type != 'month_trend' && (d.period == params.data.month )) ;
                            });});
                        
                    $$("rec:type:vue1:trend")._current_month = params.data.month;
                    $$("rec:type:vue1:trend").enable();
                    $$("rec:type:vue1:trend").hideProgress();
            })}
            else {
                $$("rec:type:vue1:trend")._filter_level = 'm';
                $$("rec:type:vue1:trend")._current_month = params.data.month;
                $$("rec:type:vue1:trend").data.filter((d) =>  {
                    return (d._type != 'month_trend' && (d.period == params.data.month)) ;
                })
            }

        }

        static filterSlotHandler(params){
            if(!params.data) return;
            let kp = 'trend'
	        $("button.ui.button.recByType_"+kp+"_"+periodSplit[2]).addClass('active').siblings().removeClass('active')
            if(!$$("rec:type:vue1:trend")._days) $$("rec:type:vue1:trend")._days = [];
            if(!$$("rec:type:vue1:trend")._days.some(d => d == params.data.upd_dt)){
                    let dat = getFiterDate('type_trend', 'vue3', params.data.upd_dt, 'vue3');
                    $$("rec:type:vue1:trend").showProgress();
                    $$("rec:type:vue1:trend").disable()                        
                    dat.then( (d) => {
                        $$("rec:type:vue1:trend")._days.push(params.data.upd_dt);
                        $$("rec:type:vue1:trend")._filter_level = 's';
                        $$("rec:type:vue1:trend").config.options.legend['selected'] = {};
                        $$("rec:type:vue1:trend").config.options.legend['selected'][params.seriesName] =  true;
                        $$("rec:type:vue1:trend").parse(dat).then(()=>{$$("rec:type:vue1:trend").data.filter((d) =>  {
                            return (d._type == 'slot_trend' && (d.period == params.data.upd_dt )) ;
                            });});
                        
                    $$("rec:type:vue1:trend")._current_upd_dt = params.data.upd_dt;
                    $$("rec:type:vue1:trend")._current_serie_selected = params.seriesName;
                    $$("rec:type:vue1:trend").enable();
                    $$("rec:type:vue1:trend").hideProgress();
            })}
            else {
                $$("rec:type:vue1:trend")._filter_level = 's';
                $$("rec:type:vue1:trend")._current_upd_dt = params.data.upd_dt;
                $$("rec:type:vue1:trend").config.options.legend['selected'] = {};
                $$("rec:type:vue1:trend").config.options.legend['selected'][params.seriesName] =  true;
                $$("rec:type:vue1:trend").data.filter((d) =>  {
                    return (d._type == 'slot_trend' && (d.period == params.data.upd_dt)) ;
                })
            }

        }
}
