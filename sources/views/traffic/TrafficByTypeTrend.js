import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components, color_ref,dash_titles, dataDesc} from "models/referential/genReferentials";
import { getTraffChartData, getFiterDate} from "models/data/traffic/data";
import { getScreenType,kFormatter,updateChartReady ,DatakFormatter, formatter} from "models/utils/home/utils";
import {getDates} from "models/utils/general/utils";
export default class TraffByTypeTrendView extends JetView{

    constructor(app,name, kpi) {

        super(app,name);
        this._kpi = kpi;
    }


	config() {

        let kp = this._kpi;
          return webix.promise.all([color_ref,dataDesc]).then((data) => {
                  let color_ref = data[0];
                  let dataDesc = data[1];
		return {
			view : 'echarts-grid-dataset',
            id : 'traff:'+kp+':vue1:trend',
	    //minHeight : 195,
            animation: true,
            beforedisplay : function(dat, conf, echart_obj) {
                let series = [], dataset = [], colors = [];
		    if (dat.length == 0) return;
		    dat = dat.filter(d => (d.traff_type == kp))
            if(dat.length == 0) return
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

                let _Type = dat.map(d => d.free).filter((d,i,ar) => ar.indexOf(d) == i)
                xaxis = xaxis.filter((d,i,ar) => ar.indexOf(d) == i)
		        //console.log(xaxis)
		if (dat.length == 0) return;
                echart_obj.off('click');
                _Type.forEach(elm => {
                    if(dat[0]._type == 'month_trend'){
                        dataset.push({dimensions : ['month', 'traffic'], source : dat.filter(d => (d.traff_type == kp) && d._type == 'month_trend' && d.free == elm), isAdded : true});
                        series.push({type : 'bar', itemStyle : {color : color_ref.traffic[elm]},stack : 'split', id :'traff_split_trend:'+elm+":"+kp, datasetIndex : dataset.length-1,barMinHeight: 10, //tooltip : {trigger : 'item'} ,
                        _isStack :true, name : dataDesc.traffic[elm]  , encode : {x : 'month', y : 'traffic'} , 
                        /*tooltip : {trigger : 'item',show : true, formatter: function(params) {
                            if(params.value) return params.marker+params.seriesName+'<br/>'+ params.name+' : '+formatter(params.value.traffic);
                            }
                        },*/
                        }
                        );
                    }
                    if(dat[0]._type == 'dt_trend') {
                        dataset.push({dimensions : ['upd_dt', 'traffic'], source : dat.filter(d => (d.traff_type == kp) && d._type == 'dt_trend' && d.free == elm), isAdded : true});
                        series.push({type : 'line', smooth : true,lineStyle : {color :color_ref.traffic[elm] },
                        itemStyle : {color : color_ref.traffic[elm]},
                        _isStack :true, name : dataDesc.traffic[elm], ecode : {x : 'upd_dt', y : 'traffic'}  ,  datasetIndex : dataset.length-1,
                    
                         });
                    }

                    if(dat[0]._type == 'slot_trend') {
                        dataset.push({dimensions : ['slot', 'traffic'], source : dat.filter(d => (d.traff_type == kp) && d._type == 'slot_trend' && d.free == elm), isAdded : true});
                        series.push({type : 'bar', 
                        itemStyle : {color : color_ref.traffic[elm]},
                        _isStack :true, name : dataDesc.traffic[elm], ecode : {x : 'slot', y : 'traffic'}  ,  datasetIndex : dataset.length-1,
                    
                         });
                         
                    }
                    colors.push(color_ref.traffic[elm]);
                    echart_obj.on('click', {seriesId : 'traff_split_trend:'+elm+":"+kp,  seriesType : 'bar'}, (params) => { 
                                        let tp =  (getScreenType() != 'mobile' && getScreenType() != 'mobile_rotated' )? true : false;
                                        if(!tp) {

                                                let obj = this;
                                                this.executeDoubleClick = setTimeout(function(){ obj._clicked = false; } , 500);
                                                if(this._clicked) {tp = true; obj._clicked = false; clearTimeout(this.executeDoubleClick)  }
                                        }
                                        if(!tp) {
                                                this._clicked = true;
                                                return
                                        }			    
			    TraffByTypeTrendView.filterHandler(params,kp)
		    
		    });
                });
                
                conf.series = conf.series.filter(d => (typeof d._isStack == 'undefined'));
                conf.dataset = conf.dataset.filter(d => (typeof d.isAdded == 'undefined'));
                if(xaxis.length != 0) conf.xAxis[0].data = xaxis
                if(dataset.length != 0) conf.dataset = [...conf.dataset, ...dataset];
                if(series.length != 0) conf.series = series;//[...series, ...conf.series];
                if(colors.length != 0) conf.color = [...colors];
                if(dat[0]._type == 'slot_trend') conf.legend['selectedMode'] = 'single';
                else conf.legend['selectedMode'] = 'multiple';
                if(dat[0]._type == 'dt_trend') echart_obj.on('click', {seriesType : 'line'}, (params) => { 

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
			TraffByTypeTrendView.filterSlotHandler(params,kp)
		
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
                          rt+= elm.marker+elm.seriesName+' : '+ (  formatter(elm.value.traffic) )+'<br/>'; 
                          
                        }
                        return rt;
                        
    
                    },
                    position: function (pos, params, el, elRect, size) {
                        var obj = {top: 10};
                        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                        return obj;
                    }			
                },
				legend : {show : true, itemGap : 20, top : '20', type : 'scroll', textStyle : {fontSize : 10}/*, orient : "vertical", top : '40', right : '20%'*/},
			title : [
				
				{
					text : dash_titles['traffic'].by_type? dash_titles['traffic'].by_type : "",
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
                            return (kp == 'data') ? DatakFormatter(val) : kFormatter(val);
                        }
    				},
    				splitLine: {
        				show: true
    				}
			}
			],			
			series : [

            ]
		}
		}
	 })
	}

        init(view) {
                
            let kp = this._kpi
            $$('traffByType_'+kp)._event_set = false
                $$("traff:"+kp+":vue1:trend").showProgress();
                $$("traff:"+kp+":vue1:trend").disable();
                $$('traff:'+kp+':vue1:trend')._filter_level = 'a';
                $$('traff:'+kp+':vue1:trend')._months = [];
                $$('traff:'+kp+':vue1:trend')._days = [];
                $$('traff:'+kp+':vue1:trend')._current_month = getDates()['d1'].substr(0,7);
                $$('traff:'+kp+':vue1:trend')._current_upd_dt = getDates()['d1'];
                components['traffic'].push( {cmp : "traff:"+kp+":vue1:trend", data :getTraffChartData('traffic_type').config.id });
                getTraffChartData('traffic_type').waitData.then((d) => {
			$$("traff:"+kp+":vue1:trend")._isDataLoaded = 1;
                        $$("traff:"+kp+":vue1:trend").parse(getTraffChartData('traffic_type'));
                        $$("traff:"+kp+":vue1:trend").enable();
                        $$("traff:"+kp+":vue1:trend").hideProgress();

                });

                $$("traff:"+kp+":vue1:trend").data.attachEvent("onStoreLoad", function () {
                                updateChartReady("traff:"+kp+":vue1:trend");
                });
                getTraffChartData('traffic_type').attachEvent("onBeforeLoad", function () {
                    if($$('top:menu').getSelectedId() == 'traffic'){
                    $$('traff:'+kp+':vue1:trend')._filter_level = 'a';
                    $$('traff:'+kp+':vue1:trend')._months = [];
                    $$('traff:'+kp+':vue1:trend')._current_month = getDates()['d1'].substr(0,7);
                    $$('traff:'+kp+':vue1:trend')._current_upd_dt = getDates()['d1'];
                    }
                });

                if(!$$('traffByType_'+kp)._event_set && $('button.ui.button.traffByType_'+kp+'_'+periodSplit[1]).length != 0) {
                    
                    $('button.ui.button.traffByType_'+kp+'_'+periodSplit[1]).on('click',function(){
                        if( $$("traff:"+kp+":vue1:trend")._filter_level != 'm')
                                TraffByTypeTrendView.filterHandler({data : {month : $$("traff:"+kp+":vue1:trend")._current_month }},kp)
            
                    })
    
                    $('button.ui.button.traffByType_'+kp+'_'+periodSplit[2]).on('click',function(){
                        if( $$("traff:"+kp+":vue1:trend")._filter_level != 's')
                                TraffByTypeTrendView.filterSlotHandler({data : {upd_dt : $$("traff:"+kp+":vue1:trend")._current_upd_dt , seriesName : $$("traff:"+kp+":vue1:trend")._current_serie_selected}},kp)
    
                    })
    
                    $('button.ui.button.traffByType_'+kp+'_'+periodSplit[0]).on('click',function(){
                        if ($$("traff:"+kp+":vue1:trend")._filter_level == 'm' || $$("traff:"+kp+":vue1:trend")._filter_level  == 's') {
                                        $$("traff:"+kp+":vue1:trend")._filter_level = 'a';
                                        $$("traff:"+kp+":vue1:trend").data.filter((d)=> d._type == 'month_trend' ) ;
    
                        }
                    }
                    )
                    $$('traffByType_'+kp)._event_set = true;
                }

                $$('traffByType_'+kp).attachEvent("onViewShow", function(){
                    if(!$$('traffByType_'+kp)._event_set) {
                        $('button.ui.button.traffByType_'+kp+'_'+periodSplit[1]).on('click',function(){
                            if( $$("traff:"+kp+":vue1:trend")._filter_level != 'm')
                                    TraffByTypeTrendView.filterHandler({data : {month : $$("traff:"+kp+":vue1:trend")._current_month }},kp)
                
                        })
        
                        $('button.ui.button.traffByType_'+kp+'_'+periodSplit[2]).on('click',function(){
                            if( $$("traff:"+kp+":vue1:trend")._filter_level != 's')
                                    TraffByTypeTrendView.filterSlotHandler({data : {upd_dt : $$("traff:"+kp+":vue1:trend")._current_upd_dt , seriesName : $$("traff:"+kp+":vue1:trend")._current_serie_selected}},kp)
        
                        })
        
                        $('button.ui.button.traffByType_'+kp+'_'+periodSplit[0]).on('click',function(){
                            if ($$("traff:"+kp+":vue1:trend")._filter_level == 'm' || $$("traff:"+kp+":vue1:trend")._filter_level  == 's') {
                                            $$("traff:"+kp+":vue1:trend")._filter_level = 'a';
                                            $$("traff:"+kp+":vue1:trend").data.filter((d)=> d._type == 'month_trend' ) ;
        
                            }
                        }
                        )
                        $$('traffByType_'+kp)._event_set = true;
                    }
                    
                })


        }


        static filterHandler(params,kp){
            if(!params.data) return;
            
	    $("button.ui.button.traffByType_"+kp+"_"+periodSplit[1]).addClass('active').siblings().removeClass('active')
            if(!$$("traff:"+kp+":vue1:trend")._months) $$("traff:"+kp+":vue1:trend")._months = [];
            if(!$$("traff:"+kp+":vue1:trend")._months.some(d => d == params.data.month)){
                    let dat = getFiterDate('traffic_type', 'vue2', params.data.month+'-01');
                    $$("traff:"+kp+":vue1:trend").showProgress();
                    $$("traff:"+kp+":vue1:trend").disable()                        
                    dat.then( (d) => {
                        $$("traff:"+kp+":vue1:trend")._months.push(params.data.month);
                        $$("traff:"+kp+":vue1:trend")._filter_level = 'm';
                        $$("traff:"+kp+":vue1:trend").parse(dat).then(()=>{$$("traff:"+kp+":vue1:trend").data.filter((d) =>  {
                            return (d._type != 'month_trend' && (d.period == params.data.month )) ;
                            });});
                        
                    $$("traff:"+kp+":vue1:trend")._current_month = params.data.month;
                    $$("traff:"+kp+":vue1:trend").enable();
                    $$("traff:"+kp+":vue1:trend").hideProgress();
            })}
            else {
                $$("traff:"+kp+":vue1:trend")._filter_level = 'm';
                $$("traff:"+kp+":vue1:trend")._current_month = params.data.month;
                $$("traff:"+kp+":vue1:trend").data.filter((d) =>  {
                    return (d._type != 'month_trend' && (d.period == params.data.month)) ;
                })
            }

        }
        static filterSlotHandler(params,kp){
            if(!params.data) return;
	    $("button.ui.button.traffByType_"+kp+"_"+periodSplit[2]).addClass('active').siblings().removeClass('active')
            if(!$$("traff:"+kp+":vue1:trend")._days) $$("traff:"+kp+":vue1:trend")._days = [];
            if(!$$("traff:"+kp+":vue1:trend")._days.some(d => d == params.data.upd_dt)){
                    let dat = getFiterDate('traffic_type', 'vue3', params.data.upd_dt, 'vue3');
                    $$("traff:"+kp+":vue1:trend").showProgress();
                    $$("traff:"+kp+":vue1:trend").disable()                        
                    dat.then( (d) => {
                        $$("traff:"+kp+":vue1:trend")._days.push(params.data.upd_dt);
                        $$("traff:"+kp+":vue1:trend")._filter_level = 's';
                        $$("traff:"+kp+":vue1:trend").config.options.legend['selected'] = {};
                        $$("traff:"+kp+":vue1:trend").config.options.legend['selected'][params.seriesName] =  true;
                        $$("traff:"+kp+":vue1:trend").parse(dat).then(()=>{$$("traff:"+kp+":vue1:trend").data.filter((d) =>  {
                            return (d._type == 'slot_trend' && (d.period == params.data.upd_dt )) ;
                            });});
                        
                    $$("traff:"+kp+":vue1:trend")._current_upd_dt = params.data.upd_dt;
                    $$("traff:"+kp+":vue1:trend")._current_serie_selected = params.seriesName;
                    $$("traff:"+kp+":vue1:trend").enable();
                    $$("traff:"+kp+":vue1:trend").hideProgress();
            })}
            else {
                $$("traff:"+kp+":vue1:trend")._filter_level = 's';
                $$("traff:"+kp+":vue1:trend")._current_upd_dt = params.data.upd_dt;
                $$("traff:"+kp+":vue1:trend").config.options.legend['selected'] = {};
                $$("traff:"+kp+":vue1:trend").config.options.legend['selected'][params.seriesName] =  true;
                $$("traff:"+kp+":vue1:trend").data.filter((d) =>  {
                    return (d._type == 'slot_trend' && (d.period == params.data.upd_dt)) ;
                })
            }

        }

    }
