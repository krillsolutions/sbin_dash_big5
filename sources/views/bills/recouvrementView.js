import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components, color_ref,dash_titles, dataDesc} from "models/referential/genReferentials";
import { getBillsChartData, getFiterDate} from "models/data/bills/data";
import { kFormatter,updateChartReady ,getScreenType,DatakFormatter, formatter} from "models/utils/home/utils";
import {getDates} from "models/utils/general/utils";
export default class RecouvrTrendView extends JetView{

	config() {

		return {
			view : 'echarts-grid-dataset',
            id : 'bill:recouvr:vue1:trend',
           /*charts_event : {

            'click' : [  'series', function(params){

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

		    ECReimbTrendView.filterHandler(params);
			}
	    ]
	    },*/
            animation: true,
			options :{
             tooltip : {
                        trigger: "axis",
                        show : true,
                        z : 2 ,
                        formatter : function(param) {
                            let rt = param[0].name+'<br/>';
                            for (const elm of param) {
                              rt+= elm.marker+elm.seriesName+' : '+ ( (elm.seriesId != "recouvr")? formatter(elm.value.value) : elm.value.value.toFixed(2)+'%')+'<br/>'; 
                              
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
             legend : {show : true, type : 'scroll', top : '20', textStyle : {fontSize : 12}/*, orient : "vertical", top : '40', right : '20%'*/},
			title : [
				
				{
					text : dash_titles['bill'].fact_encaissement_trend? dash_titles['bill'].fact_encaissement_trend : "",
					//subtext : 'Revenu',
					left : '50%',
                    textAlign: 'center',
                    textStyle : {
                        fontSize : 12
                    }
				}				
			],
            dataset : [
                {dimensions : ['value', 'name']},
                {dimensions : ['value' , 'name']},
        		{dimensions : ['value' , 'name']}
            ],

            grid : {
		top : 75,
                left : 10,
                containLabel: true,
		    bottom: 10
            },
			xAxis: [
               {
                    axisLabel: {show: true},axisTick: {show: true,  alignWithLabel: true},type : 'category'
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
            },
            {
                type : 'value', 
                axisLabel: {
                    formatter : function(val, ind){
                        return  val.toFixed(2)+'%';
                    }
                }
            }
            ],	
           /* dataZoom: [
                {
                    type: 'inside',                    
                    start: 50,
                    end: 100
                },
                {
                    show: true,                    
                    type: 'slider',
                    top: '90%',
                    start: 50,
                    end: 100
                }
            ],*/		
			series : [
                {
			        type : 'bar',id :'bill', name : 'Facturations', datasetIndex : 0,
			        barMinHeight: 10, 
			        encode : {x : 'name', y : 'value'}, _type : 'month_trend',_kpi : 'bill_trend'
		        },
                {
                        type : 'bar',id :'paid', name : 'Encaissements', datasetIndex : 1,
                        barMinHeight: 10,
                        encode : {x : 'name', y : 'value'}, _type : 'month_trend',_kpi : 'paid_trend',
                },		
                {type : 'line',id :'recouvr', name : 'Recouvrement', datasetIndex : 2,smooth : true, encode : {x : 'name', y : 'value'}, _type : 'month_trend',_kpi : 'recouvr_trend', yAxisIndex : 1},
            ]
           
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
                view._kpi = 'qty';
                components['bills'].push( {cmp : "bill:recouvr:vue1:trend", data :getBillsChartData('recouv_trend').config.id });
                getBillsChartData('recouv_trend').waitData.then((d) => {
			view._isDataLoaded = 1;
                        view.parse(getBillsChartData('recouv_trend'));
                        view.enable();
                        view.hideProgress();

                });

                view.data.attachEvent("onStoreLoad", function () {
                                updateChartReady("bill:recouvr:vue1:trend");
                });
                /*getBillsChartData('recouv_trend').attachEvent("onBeforeLoad", function () {
                    $$('bill:recouvr:vue1:trend')._filter_level = 'a';
                    $$('bill:recouvr:vue1:trend')._months = [];
                    $$('bill:recouvr:vue1:trend')._current_month = getDates()['d1'].substr(0,7);
                    $$('bill:recouvr:vue1:trend')._current_upd_dt = getDates()['d1'];
                    $$('bill:recouvr:vue1:trend')._kpi = 'qty';
                });*/
        }
/*
        static filterHandler(params, kp){
            if(!params.data) return;
            $$('bill:recouvr:vue1:trend').config.options.graphic[0].children[0].style.fill = '#fff';
            $$('bill:recouvr:vue1:trend').config.options.graphic[1].children[0].style.fill = '#DADEE0';

            if(!$$('bill:recouvr:vue1:trend')._months) $$('bill:recouvr:vue1:trend')._months = [];
            if(!$$('bill:recouvr:vue1:trend')._months.some(d => d == params.data.month)){
                    let dat = getFiterDate('recouv_trend', 'vue2', params.data.month+'-01');
                    $$('bill:recouvr:vue1:trend').showProgress();
                    $$('bill:recouvr:vue1:trend').disable()                        
                    dat.then( (d) => {
                        $$('bill:recouvr:vue1:trend')._months.push(params.data.month);
                        $$('bill:recouvr:vue1:trend')._filter_level = 'm';
                        $$('bill:recouvr:vue1:trend').parse(dat).then(()=>{$$('bill:recouvr:vue1:trend').data.filter((d) =>  {
                            return d._type != 'month_trend' && (d.period == params.data.month );
                            });});
                        
                    $$('bill:recouvr:vue1:trend')._current_month = params.data.month;
                    $$('bill:recouvr:vue1:trend').enable();
                    $$('bill:recouvr:vue1:trend').hideProgress();
            })}
            else {
                $$('bill:recouvr:vue1:trend')._filter_level = 'm';
                $$('bill:recouvr:vue1:trend')._current_month = params.data.month;
                $$('bill:recouvr:vue1:trend').data.filter((d) =>  {
                    return d._type != 'month_trend' && (d.period == params.data.month);
                })
            }

        }*/
}
