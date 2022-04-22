import {JetView} from "webix-jet";
import * as ech from "views/home/echart_cmp_dataset";
import {components, bill_type} from "models/referential/genReferentials";
import { getHomeChartData} from "models/data/home/data";
import { DatakFormatter,updateChartReady } from "models/utils/home/utils";
export default class HomeDataiew extends JetView{


	config() {

        let dimensions = ['month', 'bill_type','traffic', 'trend'];

        let series = [];

        bill_type.forEach(elm => {
            series.push({type : 'bar',encode : { x : 'traffic'}, name : elm, stack : 'splt',  barMinHeight: 10});
        });
	
		return {
			view : 'echarts-grid-dataset',
            id : 'home:vue1:data',
            animation: true,
            stackChart : {_type : 'bill', gridIndex : 0, yAxisIndex : 0, _split : true},
			options :{
             tooltip : {trigger: "axis",show : true, z : 2, axisPointer : {type : 'shadow'} },//[{show : true, trigger : "item"},{trigger: "axis",show : true}],
             legend : {show : true, itemGap : 20, top : '40'/*, orient : "vertical", top : '40', right : '20%'*/},
			title : [
				
				{
					text : 'Trafic par Billing type',
					//subtext : 'Revenu',
					left : '50%',
                    textAlign: 'center',
                    textStyle : {
                        fontSize : 15
                    }
				},
                {
                    text : 'Evolution trafic data',
                   // subtext : 'evolution',
                    left : '50%',
                    bottom : '50%',
                    textAlign: 'center',
                    textStyle : {
                        fontSize : 15
                    }
                }
				
			],
            dataset : {
                dimensions : dimensions
            },
    			grid: [{
			        top: 60,
			        height: '20%',
				//width : '80%',
				right: 20,
			        left: 10,
			        containLabel: true
			       }, {
			        //top: 10,
			        height: '50%',
			        bottom: '5',
                    right: '5',
                    left : '5',
			        containLabel: true
			}],
			xAxis: [
               {
                    type : 'value', _type : 'bill', isDim : false, splitLine: { show : false}, axisLabel: {show: false},axisLine: {show: false},axisTick: {show: false}
                },
		        {
				type: 'category',isDim : true,_type : 'trend',gridIndex : 1,
			        splitLine: {
			        show: false
                    },
                    axisPointer: {
                        show: true
                      },
			        axisLabel: {show: true},
                		//axisLine: {show: true},
                		axisTick: {show: true},

    			}
			],
			yAxis: [
                {type : 'category', _type : 'bill', isDim : false,
                axisLabel: {
                    interval: 0,
                },
                splitLine: {
                    show: false
                }},
                {
				type: 'value',isDim : true,_type : 'trend',_dim : 'value',gridIndex : 1,
				 axisLabel: {
                        formatter : function(val, ind){
                            return DatakFormatter(val);
                        }
    				},
    				splitLine: {
        				show: false
    				}
			}, 
			],			
			series : [...series,
				{
                    type : 'bar',yAxisIndex : 1,xAxisIndex : 1,encode : {x : 'month', y : 'trend'},
                    _type : 'trend',_dim :'value',
					z : 3,
					barMaxWidth : 40,barMinHeight: 10,
				}

			],
		
		}
		}
	}

        init(view) {

                $$("home:vue1:data").showProgress();
                $$("home:vue1:data").disable();
                components['home'].push("home:vue1:data");
                getHomeChartData('data').waitData.then((d) => {

                        $$("home:vue1:data").parse(getHomeChartData('data'));
                        $$("home:vue1:data").enable();
                        $$("home:vue1:data").hideProgress();

                });

                $$("home:vue1:data").data.attachEvent("onStoreLoad", function () {
                                updateChartReady("home:vue1:data");
                });

        }

}
