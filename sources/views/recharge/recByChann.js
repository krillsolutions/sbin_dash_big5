import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {color_ref, components,dash_titles} from "models/referential/genReferentials";
import { getRechargeChartData} from "models/data/recharge/data";
import { kFormatter, updateChartReady } from "models/utils/home/utils";
export default class RecByChanView extends JetView{


	config() {
	return color_ref.then((color_ref) => {
		return {
			view : 'echarts-grid-dataset',
            id : 'rec:chan:split',
			options :{
			tooltip : {
					trigger : 'axis',
					show : true,  
					axisPointer : {type : 'shadow'},
                                	position: function (pos, params, el, elRect, size) {
                                        	var obj =  {top : pos[1]+5};
                                        	obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                                                return obj;
                                	}				
			},
			animation: true,
			title : [
				
				{
					text : dash_titles['recharge'].rec_by_channel? dash_titles['recharge'].rec_by_channel : "",
					left : '50%',
					top : 5,
					textAlign: 'center',
					textStyle : {
						
						fontSize : 12
					}
				}				
			],
			grid : [{

             //   height : '90%',
                left : 5,
                bottom : 10,
                top : 20,
		right : '20%',
                containLabel: true
            }],
			xAxis: [
		        {
				    type: 'value',
			        splitLine: {
			        show: false
		        	},
			        axisLabel: {show: false},
                		axisLine: {show: false},
                		axisTick: {show: false},

                }
			],
			yAxis: [{
				 type: 'category',
				 axisLabel: {
				        interval: 0,
        				//rotate: 30
					textStyle : {fontSize : 10}
    				},
    				splitLine: {
        				show: false
                    },
                    axisTick: {show: true},
			    }
            ],	
            dataset : [
                {

                    dimensions : [ 'channel','amount']
                }
            ],		
			series : [
				{
					type : 'bar',
					_type : 'chan_split',
					z : 3,datasetIndex : 0,
					showBackground: true,barMaxWidth : 30,barMinHeight: 10, encode : {x : 'amount', y : 'channel'},
                    tooltip : {trigger : 'item',show : true, formatter: function(params) { return params.name+': '+kFormatter(params.data.amount)  }},
                    itemStyle : {

						color : function(p) {
							return  color_ref.recChann[p.value.channel] ;
						}
					},
					label : {
						normal : {
							position: 'right',
							show : true
						},
						formatter : function(params) {
						
							return kFormatter(params.value);
						}

					}
				}
			]
		}
		}
	})
	}

        init(view) {
                $$('rec:chan:split').showProgress();
                $$('rec:chan:split').disable();
                components['recharge'].push({cmp : 'rec:chan:split', data : getRechargeChartData('rec_chan_split').config.id});
                getRechargeChartData('rec_chan_split').waitData.then((d) => {
			$$('rec:chan:split')._isDataLoaded = 1;
                        $$('rec:chan:split').parse(getRechargeChartData('rec_chan_split'));
                        $$('rec:chan:split').enable();
                        $$('rec:chan:split').hideProgress();

                });

                $$('rec:chan:split').data.attachEvent("onStoreLoad", function () {
                                updateChartReady('rec:chan:split');
                });
        }

}
