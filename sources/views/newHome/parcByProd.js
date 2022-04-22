import {JetView} from "webix-jet";
import * as ech from "views/newHome/echart_cmp_dataset";
import {color_ref,dash_titles, components} from "models/referential/genReferentials";
import { getHomeChartData} from "models/data/home/data_new";
import { kFormatter, updateChartReady } from "models/utils/home/utils";
export default class ParcByProdView extends JetView{



	config() {
       let tp = 'prod';
	return color_ref.then((color_ref) => {
		return {
			view : 'echarts-grid-dataset',
            id : 'home:parc:offers:'+tp,
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
					text :  dash_titles['home'].parc_by_prod? dash_titles['home'].parc_by_prod : 'Parc par produit',
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

                    dimensions : [ 'off_group','qty']
                }
            ],		
			series : [
				{
					type : 'bar',
					_type : 'off_split',
					z : 3,datasetIndex : 0,
					showBackground: true,barMaxWidth : 30,barMinHeight: 10, encode : {x : 'qty', y : 'off_group'},
                    tooltip : {trigger : 'item',show : true, formatter: function(params) { return params.name+': '+kFormatter(params.data.qty)  }},
                    itemStyle : {

						color : function(p) {
							return  color_ref.parcOff[p.value.off_group] ;
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
				let tp = 'prod';
                $$("home:parc:offers:"+tp).showProgress();
                $$("home:parc:offers:"+tp).disable();
                components['home'].push({cmp : "home:parc:offers:"+tp, data : getHomeChartData('parc_prod').config.id});
                getHomeChartData('parc_prod').waitData.then((d) => {
			$$("home:parc:offers:"+tp)._isDataLoaded = 1;
                        $$("home:parc:offers:"+tp).parse(getHomeChartData('parc_prod'));
                        $$("home:parc:offers:"+tp).enable();
                        $$("home:parc:offers:"+tp).hideProgress();

                });

                $$("home:parc:offers:"+tp).data.attachEvent("onStoreLoad", function () {
                                updateChartReady("home:parc:offers:"+tp);
                });
        }

}
