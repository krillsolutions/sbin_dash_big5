import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {color_ref, components} from "models/referential/genReferentials";
import { getParcChartData} from "models/data/parc/data";
import { kFormatter, updateChartReady } from "models/utils/home/utils";
export default class ParcByZoneView extends JetView{


	config() {
       
	return color_ref.then((color_ref) => {
		return {
			view : 'echarts-grid-dataset',
            id : 'parc:vue1:zones',
			//minHeight : 155,
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
					text : 'Parc par zone',
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

                    dimensions : [ 'zone','qty']
                }
            ],		
			series : [
				{
					type : 'bar',
					//_type : 'off_split',
					z : 3,datasetIndex : 0,
					showBackground: true,barMaxWidth : 30,barMinHeight: 10, encode : {x : 'qty', y : 'zone'},
                    tooltip : {trigger : 'item',show : true, formatter: function(params) { return params.name+': '+kFormatter(params.data.qty)  }},
                    /*itemStyle : {

						color : function(p) {
							return  color_ref.parcOff[p.value.zone] ;
						}
					},*/
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

                $$("parc:vue1:zones").showProgress();
                $$("parc:vue1:zones").disable();
                components['parc'].push({cmp : "parc:vue1:zones", data : getParcChartData('parc_zone').config.id});
                getParcChartData('parc_zone').waitData.then((d) => {
			$$("parc:vue1:zones")._isDataLoaded = 1;
                        $$("parc:vue1:zones").parse(getParcChartData('parc_zone'));
                        $$("parc:vue1:zones").enable();
                        $$("parc:vue1:zones").hideProgress();

                });

                $$("parc:vue1:zones").data.attachEvent("onStoreLoad", function () {
                                updateChartReady("parc:vue1:zones");
                });
        }

}
