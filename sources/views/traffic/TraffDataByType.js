import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components,dash_titles, color_ref} from "models/referential/genReferentials";
import { getTraffChartData,getFiterDate} from "models/data/traffic/data";
import { kFormatter,updateChartReady,DatakFormatter, getScreenType,formatter} from "models/utils/home/utils";
import {getDates} from "models/utils/general/utils";
export default class TraffDataByDestView extends JetView{

	config() {

        let kp = 'data';
	  return color_ref.then((color_ref) => {
		return {
			view : 'echarts-grid-dataset',
            id : 'traff:'+kp+':vue1:type',
	//		minHeight : 195,
            animation: true,
            beforedisplay : function(dat, conf, echart_obj) {
                let series = [], dataset = [],tr_type = [], xAxis = []
		        if(dat.length == 0) return;
//                let _Type = ['onnet', 'offnet', 'international'];

                if(dat[0].upd_dt) {
                    dat.sort((a,b) => (a.upd_dt > b.upd_dt) ? 1:-1);
                }
                if(dat[0]._type == 'dt_trend') {
                    dat.sort((a,b) => (b.upd_dt < a.upd_dt) ? 1 : -1 )
                    xAxis = dat.map(d => d.upd_dt).filter(d => typeof d != 'undefined')
                }
                if(dat[0]._type == 'slot_trend') {
                    dat.sort((a,b) => (b.slot < a.slot) ? 1 : -1 )
                    xAxis = dat.map(d => d.slot).filter(d => typeof d != 'undefined')
                }
                xAxis = xAxis.filter((d,i,ar) => ar.indexOf(d) == i)
                dat.forEach(elm => {

                        if (!tr_type[elm.traff_cat]) tr_type[elm.traff_cat] = 0;
                         tr_type[elm.traff_cat]++;
                 } );
                let _Type = Object.keys(tr_type).map((k) => { return {t : k, cnt : tr_type[k]}  }).sort((a,b) => (a.cnt > b.cnt)? -1 : 1 ).map(d => d.t);
                echart_obj.off('click');
                _Type.forEach(elm => {
                    if(dat[0]._type == 'dt_trend'){
                        dataset.push({dimensions : ['upd_dt', 'traffic'], source : dat.filter(d => (d._type == 'dt_trend' && d.traff_type == kp) && d.traff_dir == 'in'&& d.traff_cat == elm), isAdded : true});
                        series.push({type : 'bar',stack : elm+'_split', itemStyle : {color : function(para) {return color_ref.traffic[kp+'_in']}},
                        id :'traff_split_dest:in:'+elm+":"+kp+"type", datasetIndex : dataset.length-1,barMinHeight: 10, //tooltip : {trigger : 'item'} ,
                        _isStack :true, name : elm  , encode : {x : 'upd_dt', y : 'traffic'} , 
                        }
                        );

                        dataset.push({dimensions : ['upd_dt', 'traffic'], source : dat.filter(d => d._type == 'dt_trend' &&  (d.traff_type == kp) && d.traff_dir == 'out' && d.traff_cat == elm), isAdded : true});
                        series.push({type : 'bar',stack : elm+'_split', id :'traff_split_dest:out:'+elm+":"+kp, datasetIndex : dataset.length-1,barMinHeight: 10, //tooltip : {trigger : 'item'} ,
                        _isStack :true, name : elm  , encode : {x : 'upd_dt', y : 'traffic'} , itemStyle : {color : function(para) {return color_ref.traffic[kp+'_out']}},
                        }
                        );
                    }

                    if(dat[0]._type == 'slot_trend'){
                        dataset.push({dimensions : ['slot', 'traffic'], source : dat.filter(d => d._type == 'slot_trend' &&  (d.traff_type == kp) && d.traff_dir == 'in'&& d.traff_cat == elm), isAdded : true});
                        series.push({type : 'bar',stack : elm+'_split', itemStyle : {color : function(para) {return color_ref.traffic[kp+'_in']}},
                        id :'traff_split_dest:in:'+elm+":"+kp+"type", datasetIndex : dataset.length-1,barMinHeight: 10, //tooltip : {trigger : 'item'} ,
                        _isStack :true, name : elm  , encode : {x : 'slot', y : 'traffic'} , 
                        }
                        );

                        dataset.push({dimensions : ['slot', 'traffic'], source : dat.filter(d => d._type == 'slot_trend' && (d.traff_type == kp) && d.traff_dir == 'out' && d.traff_cat == elm), isAdded : true});
                        series.push({type : 'bar',stack : elm+'_split', id :'traff_split_dest:out:'+elm+":"+kp, datasetIndex : dataset.length-1,barMinHeight: 10, //tooltip : {trigger : 'item'} ,
                        _isStack :true, name : elm  , encode : {x : 'slot', y : 'traffic'} , itemStyle : {color : function(para) {return color_ref.traffic[kp+'_out']}},
                        }
                        );
                    }
                    
                    if(dat[0]._type == 'dt_trend') {
                        echart_obj.on('click', {seriesId : 'traff_split_dest:in:'+elm+":"+kp+"type"}, (params) => { 
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
                        TraffDataByDestView.filterSlotHandler(params,kp)

                        }); 

                        echart_obj.on('click', {seriesId : 'traff_split_dest:out:'+elm+":"+kp+"type"}, (params) => { 

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
                            TraffDataByDestView.filterSlotHandler(params,kp)
    
                            });                        
                    }                   
                });
                if(dat[0]._type == 'slot_trend') {
                    conf.dataZoom =  [
                        {
                            type: 'inside',
                            start: 25,
                            end: 75
                        },
                        {
                            show: true,
                            type: 'slider',
                            height : 20,
                            bottom: 5,
                            start: 25,
                            end: 75
                        }
                    ]
                }
                else if(conf.dataZoom) delete conf.dataZoom
                conf.series = conf.series.filter(d => (typeof d._isStack == 'undefined'));
                conf.dataset = conf.dataset.filter(d => (typeof d.isAdded == 'undefined'));
                if(dataset.length != 0) conf.dataset = [...conf.dataset, ...dataset];
                if(series.length != 0) conf.series = series;//[...series, ...conf.series];
                conf.legend['selectedMode'] = 'single';
                conf.xAxis[0].data = xAxis
            },
			options :{
                tooltip : {
                    trigger: "axis",
                    show : true,
                    z : 2 ,
                    formatter : function(param) {
                        let rt = param[0].name+'<br/>';
                        for (const elm of param) {
                          rt+= elm.marker+elm.seriesId.split(':')[1]+' : '+ (  formatter(elm.value.traffic) )+'<br/>';                        
                        }
                        return rt;
                        
    
                    }
                },
				legend : {show : true, itemGap : 20, top : '20', type : 'scroll', textStyle : {fontSize : 10}/*, orient : "vertical", top : '40', right : '20%'*/},
			title : [
				
				{
					text : dash_titles['traffic'].data_by_type_by_dir? dash_titles['traffic'].data_by_type_by_dir : "",
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
                            return DatakFormatter(val);
                        }
    				},
    				splitLine: {
        				show: true
    				}
			}
			],
           grid : [{
                left : 5,
                bottom : 30,
                //top : 40,
                containLabel: true
            }],
			series : [

            ],
           
		}
		}
	  })
	}

        init(view) {
                
            let kp = 'data';
                view.showProgress();
                view.disable();
                view._days = [];
                components['traffic'].push( {cmp : 'traff:'+kp+':vue1:type', data :getTraffChartData('traffic_data').config.id });
                getTraffChartData('traffic_data').waitData.then((d) => {
			view._isDataLoaded =1;
                        view.parse(getTraffChartData('traffic_data'));
                        view.enable();
                        view.hideProgress();

                });

                view.data.attachEvent("onStoreLoad", function () {
                                updateChartReady('traff:'+kp+':vue1:type');
                });

                getTraffChartData('traffic_data').data.attachEvent("onClearAll", function () {
                    if($$('top:menu').getSelectedId() == 'traffic'){
                    view._filter_level = 'm';
                    view._months = [];
                    view._current_month = getDates()['d1'].substr(0,7);
                    view._current_upd_dt = getDates()['d1'];
                    }
                });

                $$('traffByType_dest_'+kp).attachEvent("onViewShow", function(){

                $('button.ui.button.traffByType_dest_'+kp+"_"+periodSplit[2]).on('click',function(){
                       if( view._filter_level != 's')   
                       TraffDataByDestView.filterSlotHandler({data : {upd_dt : view._current_upd_dt , seriesName : view._current_serie_selected}}, kp)

                })

                $('button.ui.button.traffByType_dest_'+kp+"_"+periodSplit[1]).on('click',function(){
                    if (view._filter_level != 'm') {
                                    view._filter_level = 'm';
                                    view.data.filter((d)=> d._type == 'dt_trend') ;

                    }
                }
                )
            })

        }

        static filterSlotHandler(params,kp){
            if(!params.data) return;
	        $("button.ui.button.traffByType_dest_"+kp+"_"+periodSplit[2]).addClass('active').siblings().removeClass('active')
            if(!$$('traff:'+kp+':vue1:type')._days) $$('traff:'+kp+':vue1:type')._days = [];
            if(!$$('traff:'+kp+':vue1:type')._days.some(d => d == params.data.upd_dt)){
                    let dat = getFiterDate('data_type', 'vue2', params.data.upd_dt, 'vue2');
                    $$('traff:'+kp+':vue1:type').showProgress();
                    $$('traff:'+kp+':vue1:type').disable()                        
                    dat.then( (d) => {
                        $$('traff:'+kp+':vue1:type')._days.push(params.data.upd_dt);
                        $$('traff:'+kp+':vue1:type')._filter_level = 's';
                        $$('traff:'+kp+':vue1:type').config.options.legend['selected'] = {};
                        $$('traff:'+kp+':vue1:type').config.options.legend['selected'][params.seriesName] =  true;
                        $$('traff:'+kp+':vue1:type').parse(dat).then(()=>{$$('traff:'+kp+':vue1:type').data.filter((d) =>  {
                            return (d._type == 'slot_trend' && (d.period == params.data.upd_dt )) ;
                            });});
                        
                    $$('traff:'+kp+':vue1:type')._current_upd_dt = params.data.upd_dt;
                    $$('traff:'+kp+':vue1:type')._current_serie_selected = params.seriesName;
                    $$('traff:'+kp+':vue1:type').enable();
                    $$('traff:'+kp+':vue1:type').hideProgress();
            })}
            else {
                $$('traff:'+kp+':vue1:type')._filter_level = 's';
                $$('traff:'+kp+':vue1:type')._current_upd_dt = params.data.upd_dt;
                $$('traff:'+kp+':vue1:type').config.options.legend['selected'] = {};
                $$('traff:'+kp+':vue1:type').config.options.legend['selected'][params.seriesName] =  true;
                $$('traff:'+kp+':vue1:type').data.filter((d) =>  {
                    return (d._type == 'slot_trend' && (d.period == params.data.upd_dt)) ;
                })
            }

        }

}
