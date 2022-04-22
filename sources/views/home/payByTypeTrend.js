import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components, color_ref, dataDesc} from "models/referential/genReferentials";
import { getHomeChartData, getFiterDate} from "models/data/home/data";
import { getScreenType, kFormatter,updateChartReady , formatter} from "models/utils/home/utils";
import {getDates} from "models/utils/general/utils";
export default class PayByTypeTrendView extends JetView{


    /*constructor(app,name,kpi) {

        super(app,name);
        this._kpi = kpi;


    }*/

	config() {
          
        let kpi_type = this._kpi
          return webix.promise.all([color_ref,dataDesc]).then((data) => {
                  let color_ref = data[0];
                  let dataDesc = data[1];
		return {
			view : 'echarts-grid-dataset',
            id : 'pay:vue1:trend',
            animation: true,
            beforedisplay : function(dat, conf, echart_obj) {
                let series = [], dataset = [],colors = [], revenues = {};
                dat.sort()
                if(dat.length == 0) return;	 
                let types = dat.map(d => d.clt_type).filter((d,i,ar) => ar.indexOf(d) == i);
                let tsplit = (dat[0]._type == 'month_trend')? dat.map(d => d.month).filter((d,i,ar) => ar.indexOf(d) == i) :dat.map(d => d.upd_dt).filter((d,i,ar) => ar.indexOf(d) == i) ;

                tsplit.sort()
                echart_obj.off('click');
                types.forEach(elm => {
                    if( dat.some(d => d._type == 'month_trend')  ){
                        dataset.push({dimensions : ['month', 'revenue'], source : dat.filter(d => (d.clt_type == elm) && (d._type == 'month_trend')/* && d._kpi == kpi_type*/ ), isAdded : true});
                        series.push({type : 'bar', itemStyle : {color : color_ref.payments[elm] } , stack : 'split', id :'pay_split_trend:'+elm, datasetIndex : dataset.length,barMinHeight: 10,barMaxWidth : 40,
                        _isStack :true, name : elm  , encode : {x : 'month', y : 'revenue'} ,gridIndex : 1 
                        }
                        );
                    }
                    if(dat.some(d => d._type == 'dt_trend')) {
                        dataset.push({dimensions : ['upd_dt', 'revenue'], source : dat.filter(d => (d.clt_type == elm) && d._type == 'dt_trend' /*&& d._kpi == kpi_type*/), isAdded : true});
                        series.push({type : 'line', smooth : true,lineStyle : {color :color_ref.payments[elm] },
                        itemStyle : {color : color_ref.payments[elm]},
                        _isStack :true, name : elm, encode : {x : 'upd_dt', y : 'revenue'}  ,  datasetIndex : dataset.length,gridIndex : 1
                    
                         });
                    }

                    
                    echart_obj.on('click', {seriesId : 'pay_split_trend:'+elm,  seriesType : 'bar'}, (params) => { 
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
			    PayByTypeTrendView.filterHandler(params)
		    });
		    colors.push(color_ref.payments[elm]);
                });
                
                conf.series = conf.series.filter(d => (typeof d._isStack == 'undefined'));
                conf.dataset = conf.dataset.filter(d => (typeof d.isAdded == 'undefined'));
                if(dataset.length != 0) conf.dataset = [...conf.dataset, ...dataset];
		        if(colors.length != 0) conf.color = [...colors];
                if(series.length != 0) conf.series =  [...series, ...conf.series];
                conf.legend['selectedMode'] = 'multiple';
                conf.xAxis[0].data = [...tsplit];
            },
			options :{
                tooltip : {
                    trigger: "axis",
                    show : true,
                    z : 2 ,
                    formatter : function(param) {
                        let rt = param[0].name+'<br/>';
                        for (const elm of param) {
                          rt+= elm.marker+(dataDesc.revenue[elm.seriesName]?dataDesc.revenue[elm.seriesName] :elm.seriesName )+' : '+ (  formatter(elm.value.revenue) )+'<br/>'; 
                          
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
                

                $$("pay:vue1:trend").showProgress();
                $$("pay:vue1:trend").disable();
                $$('pay:vue1:trend')._filter_level = 'a';
                $$('pay:vue1:trend')._months = [];
                $$('pay:vue1:trend')._days = [];
                $$('pay:vue1:trend')._current_month = getDates()['d1'].substr(0,7);
                $$('pay:vue1:trend')._current_upd_dt = getDates()['d1'];
                components['home'].push( {cmp : "pay:vue1:trend", data :getHomeChartData('pay_trend').config.id });
                getHomeChartData('pay_trend').waitData.then((d) => {
			            $$("pay:vue1:trend")._isDataLoaded = 1;
                        $$("pay:vue1:trend").parse(getHomeChartData('pay_trend'));
                        $$("pay:vue1:trend").enable();
                        $$("pay:vue1:trend").hideProgress();
                        $$("pay:vue1:trend").data.attachEvent("onStoreLoad", function () {
                            updateChartReady("pay:vue1:trend");
            });
            getHomeChartData('pay_trend').attachEvent("onBeforeLoad", function () {
                if($$('top:menu').getSelectedId() == 'home'){
                    $$('pay:vue1:trend')._filter_level = 'a';
                    $$('pay:vue1:trend')._months = [];
                    $$('pay:vue1:trend')._current_month = getDates()['d1'].substr(0,7);
                    $$('pay:vue1:trend')._current_upd_dt = getDates()['d1'];
                }
                });                        

                });
/*
                $$("pay:vue1:trend").data.attachEvent("onStoreLoad", function () {
                                updateChartReady("pay:vue1:trend");
                });
                $$("pay:vue1:trend").data.attachEvent("onBeforeLoad", function () {
                    $$('pay:vue1:trend')._filter_level = 'a';
                    $$('pay:vue1:trend')._months = [];
                    $$('pay:vue1:trend')._current_month = getDates()['d1'].substr(0,7);
                    $$('pay:vue1:trend')._current_upd_dt = getDates()['d1'];
                });
               */
                $('button.ui.button.payByType_'+periodSplit[1]).on('click',function(){
                            if( $$('pay:vue1:trend')._filter_level != 'm')
                                    PayByTypeTrendView.filterHandler({data : {month : $$('pay:vue1:trend')._current_month }})
                
                })

                $('button.ui.button.payByType_'+periodSplit[0]).on('click',function(){
                    if ($$('pay:vue1:trend')._filter_level == 'm') {
                                    $$('pay:vue1:trend')._filter_level = 'a';
                                    $$('pay:vue1:trend').data.filter((d)=> d._type == 'month_trend') ;

                    }
                }
                )

        }

        /*ready(view){
            $$("payByType").attachEvent("onAfterRender", function(){
            $('button.ui.button.payByType_'+periodSplit[1]).on('click',function(){
                if( view._filter_level == 'a'){
                   
                    view._filter_level = 'm';
                    if(!view._months.some(d => d == view._current_month)){
                        
                        let dat = getFiterDate('pay', 'dt_trend', view._current_month+'-01','vue2');
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

            $('button.ui.button.payByType_'+periodSplit[0]).on('click',function(){
                if (view)
                if (view._filter_level == 'm') {
                    view._filter_level = 'a';
                    view.data.filter((d)=> d._type != 'dt_trend');

             }
            }
            )
        })
        }  */      

        static filterHandler(params){
            if(!params.data) return;

	    $("button.ui.button.payByType_"+periodSplit[1]).addClass('active').siblings().removeClass('active')
            if(!$$('pay:vue1:trend')._months) $$('pay:vue1:trend')._months = [];
            if(!$$('pay:vue1:trend')._months.some(d => d == params.data.month)){
                    let dat = getFiterDate('pay', 'dt_trend', params.data.month+'-01', 'vue2');
                    $$('pay:vue1:trend').showProgress();
                    $$('pay:vue1:trend').disable()                        
                    dat.then( (d) => {
                        $$('pay:vue1:trend')._months.push(params.data.month);
                        $$('pay:vue1:trend')._filter_level = 'm';
                        $$('pay:vue1:trend').parse(dat).then(()=>{$$('pay:vue1:trend').data.filter((d) =>  {
                            return (d._type != 'month_trend' && (d.period == params.data.month ));
                            });});
                        
                    $$('pay:vue1:trend')._current_month = params.data.month;
                    $$('pay:vue1:trend').enable();
                    $$('pay:vue1:trend').hideProgress();
            })}
            else {
                $$('pay:vue1:trend')._filter_level = 'm';
                $$('pay:vue1:trend')._current_month = params.data.month;
                $$('pay:vue1:trend').data.filter((d) =>  {
                    return (d._type != 'month_trend' && (d.period == params.data.month));
                })
            }

        }

}

