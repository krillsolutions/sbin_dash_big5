import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components} from "models/referential/genReferentials";
import { getRevChartData, getFiterDate} from "models/data/revenue/data";
import { kFormatter,getScreenType, formatter, updateChartReady } from "models/utils/home/utils";
import {getDates} from "models/utils/general/utils";
export default class RevPayTrendView extends JetView{


	config() {
    
		return {
			view : 'echarts-grid-dataset',
            id : 'rev:vue1:trend:pay',
            //minHeight : 107,
            animation: true,
            charts_event : {

            'click' : [  {seriesId : 'rev:pay_trend', seriesType : 'bar'}, function(params){

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

                $("button.ui.button.revPay_"+periodSplit[1]).addClass('active').siblings().removeClass('active')

                if(!$$('rev:vue1:trend:pay')._months) $$('rev:vue1:trend:pay')._months = [];
                if(!$$('rev:vue1:trend:pay')._months.some(d => d == params.data.month)){
                        let dat = getFiterDate('pay', 'dt_trend', params.data.month+'-01');
                        $$('rev:vue1:trend:pay').showProgress();
                        $$('rev:vue1:trend:pay').disable()                        
                        dat.then( (d) => {
                            $$('rev:vue1:trend:pay')._months.push(params.data.month);
                            $$('rev:vue1:trend:pay')._filter_level = 'm';
                            $$('rev:vue1:trend:pay').parse(dat).then(()=>{$$('rev:vue1:trend:pay').data.filter((d) =>  {
                                return d._type != 'month_trend' && (d.period == params.data.month || d._type == 'rev_split')
                                });});
                            
                        $$('rev:vue1:trend:pay')._current_month = params.data.month;
                        $$('rev:vue1:trend:pay').enable();
                        $$('rev:vue1:trend:pay').hideProgress();
                })}
                else {
                    $$('rev:vue1:trend:pay')._filter_level = 'm';
                    $$('rev:vue1:trend:pay')._current_month = params.data.month;
                    $$('rev:vue1:trend:pay').data.filter((d) =>  {
                        return d._type != 'month_trend' && (d.period == params.data.month || d._type == 'rev_split');// (d.period && d.period == params.data.month && !d.month || d.rev_type ); 
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
         title : {
            text : "Paiements",
            right : '15%',
            top : 5,
            textAlign: 'center',
            textStyle : {
                fontSize : 12
            }
         },
            grid : [{

                //height : '80%',
                left : 5,
                top : 10,
                bottom : 3,
                //top : 5,
                containLabel: true
            }],
            dataset : [
                {
                    dimensions : ['month', 'revenue']
                },
                {
                    dimensions : ['upd_dt', 'revenue']
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
                    type : 'line',gridIndex : 1, encode : {x : 'month', y : 'revenue'},seriesLayoutBy: 'row',datasetIndex : 0,
                    //stack : 'spl',
                    _type : 'month_trend',_dim :'key', id : 'rev:pay_trend',
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
                    type : 'line', gridIndex : 1, encode : {x : 'upd_dt', y : 'revenue'}, _type : 'dt_trend',datasetIndex : 1//,barMaxWidth : 20,barMinHeight: 10,
                }

			],
		
		}
		}
	}

        init(view) {

                $$("rev:vue1:trend:pay").showProgress();
                $$("rev:vue1:trend:pay").disable();
                components['revenue'].push({cmp : "rev:vue1:trend:pay", data :getRevChartData('pay_trend').config.id });
                $$('rev:vue1:trend:pay')._current_month = getDates()['d1'].substr(0,7);
                $$('rev:vue1:trend:pay')._months = [];
                $$('rev:vue1:trend:pay')._filter_level = 'a';
                getRevChartData('pay_trend').waitData.then((d) => {
			$$("rev:vue1:trend:pay")._isDataLoaded = 1;
                        $$("rev:vue1:trend:pay").parse(getRevChartData('pay_trend'));
                        $$("rev:vue1:trend:pay").enable();
                        $$("rev:vue1:trend:pay").hideProgress();

                });
                $$("rev:vue1:trend:pay").data.attachEvent("onBeforeLoad", function () {
                    if($$('top:menu').getSelectedId() == 'revenue') {
                    $$('rev:vue1:trend:pay')._current_month = getDates()['d1'].substr(0,7);
                    $$('rev:vue1:trend:pay')._months = [];
                    $$('rev:vue1:trend:pay')._filter_level = 'a';
                    }
                });
                $$("rev:vue1:trend:pay").data.attachEvent("onStoreLoad", function () {
                                updateChartReady("rev:vue1:trend:pay");
                });


                /*$$("revPay").attachEvent("onAfterRender", function(){

                    $('button.ui.button.revPay_'+periodSplit[1]).on('click',function(){
                        if( $$('rev:vue1:trend:pay')._filter_level == 'a'){
                           
                            $$('rev:vue1:trend:pay')._filter_level = 'm';
                            if(!$$('rev:vue1:trend:pay')._months.some(d => d == $$('rev:vue1:trend:pay')._current_month)){
                                let dat = getFiterDate('revenue', 'd_trend', $$('rev:vue1:trend:pay')._current_month+'-01');
                                $$('rev:vue1:trend:pay').showProgress();
                                $$('rev:vue1:trend:pay').disable()
                                dat.then( (d) => {
                                    $$('rev:vue1:trend:pay')._months.push($$('rev:vue1:trend:pay')._current_month);
                                    $$('rev:vue1:trend:pay').parse(dat).then(()=>{$$('rev:vue1:trend:pay').data.filter((d) =>  {
                                        return d._type != 'month_trend' && (d.period == $$('rev:vue1:trend:pay')._current_month || d._type == 'rev_split')
                                        });});
    
                                $$('rev:vue1:trend:pay')._current_month = $$('rev:vue1:trend:pay')._current_month;
                                $$('rev:vue1:trend:pay').enable();
                                $$('rev:vue1:trend:pay').hideProgress();
                            })}
                            else
                                $$('rev:vue1:trend:pay').data.filter((d)=> {
                                    return d._type != 'month_trend' && (d.period == $$('rev:vue1:trend:pay')._current_month || d._type == 'rev_split');
                                });
                        }
                            
    
                    })

                    $('button.ui.button.revPay_'+periodSplit[0]).on('click',function(){
                        if ($$('rev:vue1:trend:pay'))
                        if ($$('rev:vue1:trend:pay')._filter_level == 'm') {
                            $$('rev:vue1:trend:pay')._filter_level = 'a';
                            $$('rev:vue1:trend:pay').data.filter((d)=> d._type != 'dt_trend');
        
                     }
                    }
                    )

                })*/
        }

        ready(view) {


            $$("revPay").attachEvent("onAfterRender", function(){

                $('button.ui.button.revPay_'+periodSplit[1]).on('click',function(){
                    if( $$('rev:vue1:trend:pay')._filter_level == 'a'){
                       
                        $$('rev:vue1:trend:pay')._filter_level = 'm';
                        if(!$$('rev:vue1:trend:pay')._months.some(d => d == $$('rev:vue1:trend:pay')._current_month)){
                            let dat = getFiterDate('pay', 'd_trend', $$('rev:vue1:trend:pay')._current_month+'-01');
                            $$('rev:vue1:trend:pay').showProgress();
                            $$('rev:vue1:trend:pay').disable()
                            dat.then( (d) => {
                                $$('rev:vue1:trend:pay')._months.push($$('rev:vue1:trend:pay')._current_month);
                                $$('rev:vue1:trend:pay').parse(dat).then(()=>{$$('rev:vue1:trend:pay').data.filter((d) =>  {
                                    return d._type != 'month_trend' && (d.period == $$('rev:vue1:trend:pay')._current_month || d._type == 'rev_split')
                                    });});

                            $$('rev:vue1:trend:pay')._current_month = $$('rev:vue1:trend:pay')._current_month;
                            $$('rev:vue1:trend:pay').enable();
                            $$('rev:vue1:trend:pay').hideProgress();
                        })}
                        else
                            $$('rev:vue1:trend:pay').data.filter((d)=> {
                                return d._type != 'month_trend' && (d.period == $$('rev:vue1:trend:pay')._current_month || d._type == 'rev_split');
                            });
                    }
                        

                })

                $('button.ui.button.revPay_'+periodSplit[0]).on('click',function(){
                    if ($$('rev:vue1:trend:pay'))
                    if ($$('rev:vue1:trend:pay')._filter_level == 'm') {
                        $$('rev:vue1:trend:pay')._filter_level = 'a';
                        $$('rev:vue1:trend:pay').data.filter((d)=> d._type != 'dt_trend');
    
                 }
                }
                )

            })


        }

}
