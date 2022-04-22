import {JetView} from "webix-jet";
import * as ech from "views/newHome/echart_cmp_dataset";
import {color_ref, components} from "models/referential/genReferentials";
import { getHomeChartData} from "models/data/home/data_new";
import { kFormatter, updateChartReady } from "models/utils/home/utils";
export default class HomeParcOPView extends JetView{


	config() {
       
	return color_ref.then((color_ref) => {
		return {
			view : 'echarts-grid-dataset',
            id : 'home:vue1:operators:parc',
			//minHeight : 140,
			options :{
			tooltip : {
					trigger : 'axis',
					show : true,  
					axisPointer : {type : 'shadow'},
                                	position: function (pos, params, el, elRect, size) {
                                        	var obj =  {top : pos[1]+10};
                                        	obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                                                return obj;
                                	}				
			},
			animation: true,
			title : [
				
				{
					text : 'Par operateur',
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
                bottom : 5,
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

                    dimensions : [ 'operator','op_qty']
                }
            ],		
			series : [
				{
					type : 'bar',
					_type : 'op_split',
					z : 3,datasetIndex : 0,
					showBackground: true,barMaxWidth : 30,barMinHeight: 10, encode : {x : 'op_qty', y : 'operator'},
                    tooltip : {trigger : 'item',show : true, formatter: function(params) { return params.name+': '+kFormatter(params.data.op_qty)  }},
                    itemStyle : {

						color : function(p) {
							return  color_ref.revenueOP[p.value.operator] ;
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

                $$("home:vue1:operators:parc").showProgress();
                $$("home:vue1:operators:parc").disable();
                components['home'].push({cmp : "home:vue1:operators:parc", data : getHomeChartData('parc_operators').config.id});
                getHomeChartData('parc_operators').waitData.then((d) => {
			$$("home:vue1:operators:parc")._isDataLoaded = 1;
                        $$("home:vue1:operators:parc").parse(getHomeChartData('parc_operators'));
                        $$("home:vue1:operators:parc").enable();
                        $$("home:vue1:operators:parc").hideProgress();

                });

                $$("home:vue1:operators:parc").data.attachEvent("onStoreLoad", function () {
                                updateChartReady("home:vue1:operators:parc");
                });
        }

}
