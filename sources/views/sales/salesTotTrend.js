import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components} from "models/referential/genReferentials";
import { getSalesChartData, getFiterDate} from "models/data/sales/data";
import { kFormatter,getScreenType, formatter, updateChartReady } from "models/utils/home/utils";
import {getDates} from "models/utils/general/utils";
export default class saleTotTrendView extends JetView{


	config() {
    
		return {
			view : 'echarts-grid-dataset',
            id : 'sales:vue1:trend:tot',
            animation: true,
            beforedisplay : function(dat, conf, echart_obj){

                echart_obj.off('click');
                echart_obj.on('click', {seriesId : 'sale:month_split'}, (params) => { 
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
                    saleTotTrendView.filterHandler(params)
                });

                echart_obj.on('click', {seriesId : 'sale:dt_split'}, (params) => { 
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
                    saleTotTrendView.filterHandler(params)
                });

                echart_obj.on('click', {seriesId : 'sale:slot_split'}, (params) => { 
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
                    saleTotTrendView.filterHandler(params)
                });
            

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
         title : {
            text : "Ventes totales",
            left : '10%',
            top : 3,
            textAlign: 'center',
            textStyle : {
                fontSize : 12
            }
         },
            grid : [{

                //height : '80%',
                left : 5,
                top : 30,
                bottom : 3,
                //top : 5,
                containLabel: true
            }],
            dataset : [
                {
                    dimensions : ['month', 'amount']
                },
                {
                    dimensions : ['upd_dt', 'amount']
                },
                {
                    dimensions : ['slot', 'amount']
                }

            ],
			xAxis: [
		        {
                type: 'category',
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
                splitNumber  : 4,
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
                    type : 'line',gridIndex : 1, encode : {x : 'month', y : 'amount'},seriesLayoutBy: 'row',datasetIndex : 0,
                    //stack : 'spl',
                    _type : 'month_trend',_dim :'key', id : 'sale:month_split',
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
					z : 3,
					barMaxWidth : 40,barMinHeight: 10,
                },
                {
                    type : 'line', gridIndex : 1, encode : {x : 'upd_dt', y : 'amount'}, _type : 'dt_trend',datasetIndex : 1, id : 'sale:dt_split'//,barMaxWidth : 20,barMinHeight: 10,
                },
                {
                    type : 'bar',gridIndex : 1, encode : {x : 'slot',y : 'amount'}, _type : 'slot_trend',id : 'sale:slot_split',datasetIndex : 2
                }                

			],
		
		}
		}
	}

        init(view) {

                $$("sales:vue1:trend:tot").showProgress();
                $$("sales:vue1:trend:tot").disable();
                components['sales'].push({cmp : "sales:vue1:trend:tot", data :getSalesChartData('tot_trend').config.id });
                $$('sales:vue1:trend:tot')._current_month = getDates()['d1'].substr(0,7);
                $$('sales:vue1:trend:tot')._months = [];
                $$('sales:vue1:trend:tot')._filter_level = 'a';
                getSalesChartData('tot_trend').waitData.then((d) => {
			$$("sales:vue1:trend:tot")._isDataLoaded = 1;
                        $$("sales:vue1:trend:tot").parse(getSalesChartData('tot_trend'));
                        $$("sales:vue1:trend:tot").enable();
                        $$("sales:vue1:trend:tot").hideProgress();

                });
                getSalesChartData('tot_trend').attachEvent("onBeforeLoad", function () {
                    if($$('top:menu').getSelectedId() == 'sales'){
                        $$('sales:vue1:trend:tot')._current_month = getDates()['d1'].substr(0,7);
                        $$('sales:vue1:trend:tot')._months = [];
                        $$('sales:vue1:trend:tot')._filter_level = 'a';
                    }
                });
                $$("sales:vue1:trend:tot").data.attachEvent("onStoreLoad", function () {
                                updateChartReady("sales:vue1:trend:tot");
                });


                $$('saleTot').attachEvent("onAfterRender", function(){

                    $('button.ui.button.saleTot_'+periodSplit[1]).on('click',function(){
                        if( $$('sales:vue1:trend:tot')._filter_level != 'm'){

                            saleTotTrendView.filterHandler({data : {month : $$('sales:vue1:trend:tot')._current_month , _type : "month_trend"}})

                        }                         
    
                    })

                    $('button.ui.button.saleTot_'+periodSplit[2]).on('click',function(){
                        if( $$('sales:vue1:trend:tot')._filter_level != 's'){

                            saleTotTrendView.filterHandler({data : {upd_dt : $$('sales:vue1:trend:tot')._current_upd_dt , _type : "dt_trend",seriesName : $$('sales:vue1:trend:tot')._current_serie_selected}})

                        }                         
    
                    })

                    $('button.ui.button.saleTot_'+periodSplit[0]).on('click',function(){
                        if ($$('sales:vue1:trend:tot')._filter_level == 'm' || $$('sales:vue1:trend:tot')._filter_level  == 's') {
                                        $$('sales:vue1:trend:tot')._filter_level = 'a';
                                        $$('sales:vue1:trend:tot').data.filter((d)=> d._type == 'month_trend') ;
    
                        }
                    }
                    )

                })


                /*$$("saleTot").attachEvent("onAfterRender", function(){

                    $('button.ui.button.saleTot_'+periodSplit[1]).on('click',function(){
                        if( $$('sales:vue1:trend:tot')._filter_level == 'a'){
                           
                            $$('sales:vue1:trend:tot')._filter_level = 'm';
                            if(!$$('sales:vue1:trend:tot')._months.some(d => d == $$('sales:vue1:trend:tot')._current_month)){
                                let dat = getFiterDate('revenue', 'd_trend', $$('sales:vue1:trend:tot')._current_month+'-01');
                                $$('sales:vue1:trend:tot').showProgress();
                                $$('sales:vue1:trend:tot').disable()
                                dat.then( (d) => {
                                    $$('sales:vue1:trend:tot')._months.push($$('sales:vue1:trend:tot')._current_month);
                                    $$('sales:vue1:trend:tot').parse(dat).then(()=>{$$('sales:vue1:trend:tot').data.filter((d) =>  {
                                        return d._type != 'month_trend' && (d.period == $$('sales:vue1:trend:tot')._current_month || d._type == 'rev_split')
                                        });});
    
                                $$('sales:vue1:trend:tot')._current_month = $$('sales:vue1:trend:tot')._current_month;
                                $$('sales:vue1:trend:tot').enable();
                                $$('sales:vue1:trend:tot').hideProgress();
                            })}
                            else
                                $$('sales:vue1:trend:tot').data.filter((d)=> {
                                    return d._type != 'month_trend' && (d.period == $$('sales:vue1:trend:tot')._current_month || d._type == 'rev_split');
                                });
                        }
                            
    
                    })

                    $('button.ui.button.saleTot_'+periodSplit[0]).on('click',function(){
                        if ($$('sales:vue1:trend:tot'))
                        if ($$('sales:vue1:trend:tot')._filter_level == 'm') {
                            $$('sales:vue1:trend:tot')._filter_level = 'a';
                            $$('sales:vue1:trend:tot').data.filter((d)=> d._type != 'dt_trend');
        
                     }
                    }
                    )

                })*/
        }

        ready(view) {

            $$('saleTot').callEvent("onAfterRender")

        }


        static filterHandler(params){

            if(!params.data) return;
            switch (params.data._type) {
                case 'month_trend':
                    $("button.ui.button.saleTot_"+periodSplit[1]).addClass('active').siblings().removeClass('active')
                    if(!$$('sales:vue1:trend:tot')._months) $$('sales:vue1:trend:tot')._months = [];
                    if(!$$('sales:vue1:trend:tot')._months.some(d => d == params.data.month)){
                            let dat = getFiterDate('sales', 'tot', params.data.month+'-01', 'dt_trend');
                            $$('sales:vue1:trend:tot').showProgress();
                            $$('sales:vue1:trend:tot').disable()                        
                            dat.then( (d) => {
                                $$('sales:vue1:trend:tot')._months.push(params.data.month);
                                $$('sales:vue1:trend:tot')._filter_level = 'm';
                                $$('sales:vue1:trend:tot').parse(dat).then(()=>{$$('sales:vue1:trend:tot').data.filter((d) =>  {
                                    return (d._type != 'month_trend' && (d.period == params.data.month ));
                                    });});
                                
                            $$('sales:vue1:trend:tot')._current_month = params.data.month;
                            $$('sales:vue1:trend:tot').enable();
                            $$('sales:vue1:trend:tot').hideProgress();
                    })}
                    else {
                        $$('sales:vue1:trend:tot')._filter_level = 'm';
                        $$('sales:vue1:trend:tot')._current_month = params.data.month;
                        $$('sales:vue1:trend:tot').data.filter((d) =>  {
                            return (d._type != 'month_trend' && (d.period == params.data.month));
                        })
                    }
                    break;

                case 'dt_trend' : 
                $("button.ui.button.saleTot_"+periodSplit[2]).addClass('active').siblings().removeClass('active')
                if(!$$('sales:vue1:trend:tot')._days) $$('sales:vue1:trend:tot')._days = [];
                if(!$$('sales:vue1:trend:tot')._days.some(d => d == params.data.upd_dt)){
                        let dat = getFiterDate('sales', 'tot', params.data.upd_dt, 'slot_trend');
                        $$('sales:vue1:trend:tot').showProgress();
                        $$('sales:vue1:trend:tot').disable()                        
                        dat.then( (d) => {
                            $$('sales:vue1:trend:tot')._days.push(params.data.upd_dt);
                            $$('sales:vue1:trend:tot')._filter_level = 's';
                            $$('sales:vue1:trend:tot').parse(dat).then(()=>{$$('sales:vue1:trend:tot').data.filter((d) =>  {
                                return (d._type == 'slot_trend' && (d.period == params.data.upd_dt )) 
                                });});
                            
                        $$('sales:vue1:trend:tot')._current_upd_dt = params.data.upd_dt;
                        $$('sales:vue1:trend:tot')._current_serie_selected = params.seriesName;
                        $$('sales:vue1:trend:tot').enable();
                        $$('sales:vue1:trend:tot').hideProgress();
                })}
                else {
                    $$('sales:vue1:trend:tot')._filter_level = 's';
                    $$('sales:vue1:trend:tot')._current_upd_dt = params.data.upd_dt;
                    $$('sales:vue1:trend:tot').data.filter((d) =>  {
                        return (d._type == 'slot_trend' && (d.period == params.data.upd_dt)) 
                    })
                }
                break
            
                default:
                    break;
            }
        }        

}
