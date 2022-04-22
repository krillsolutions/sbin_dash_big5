import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {color_ref,dash_titles, components} from "models/referential/genReferentials";
import { getBillsChartData} from "models/data/bills/data";
import { kFormatter, updateChartReady , formatter} from "models/utils/home/utils";
export default class RecouvrByOfferView extends JetView{


	config() {
       
    let tp = this._type
	return color_ref.then((color_ref) => {
		return {
			view : 'echarts-grid-dataset',
            id : 'bill:vue1:recouvr:split',
			//minHeight : 155,
			options :{
			tooltip : {
					trigger : 'axis',
					show : true,  
					//axisPointer : {type : 'shadow'},
                                	position: function (pos, params, el, elRect, size) {
                                        	var obj =  {top : pos[1]+5};
                                        	obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                                                return obj;
                                	}				
			},
			animation: true,
			title : [
				
				{
					text : dash_titles['bill'].recouv_by_prod? dash_titles['bill'].recouv_by_prod : "",
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
                top : 25,
		        //right : '20%',
                containLabel: true
            }],
			yAxis: [
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
			xAxis: [{
				 type: 'category',
				 axisLabel: {
                    show: true,
                    align : "left",
                    rotate : -15
    				},
    				splitLine: {
        				show: false
                    },
                    axisTick: {show: true},
                    axisLine: {show: true},
			    }
            ],
            legend : {show : true, itemGap : 20, bottom : 5, type : 'scroll', textStyle : {fontSize : 10}},	
            dataset : [
                {

                    dimensions : [ 'off_group','recouvr']
                }
            ],		
			series : [
				{
					type : 'bar',
					//_type : 'off_split',
					z : 3,datasetIndex : 0,
					showBackground: true,barMaxWidth : 30,barMinHeight: 10, encode : {y : 'recouvr', x : 'off_group'},
                    tooltip : {trigger : 'item',show : true, formatter: function(params) { return params.name+': '+kFormatter(params.data.recouvr)  }},
                    itemStyle : {

						color : function(p) {
							return  color_ref.parcOff[p.value.off_group] ;
						}
					},
					label : {
						normal : {
							position: 'right',
							show : true,
                            formatter : function(params) {
                               // console.log(params)
                                return formatter(params.data.recouvr);
                            }
						},


					}
				}
			]
		}
		}
	})
	}

        init(view) {
                $$('bill:vue1:recouvr:split').showProgress();
                $$('bill:vue1:recouvr:split').disable();
                components['bills'].push({cmp : 'bill:vue1:recouvr:split', data : getBillsChartData('recouvr_split').config.id});
                getBillsChartData('recouvr_split').waitData.then((d) => {
			$$('bill:vue1:recouvr:split')._isDataLoaded = 1;
                        $$('bill:vue1:recouvr:split').parse(getBillsChartData('recouvr_split'));
                        $$('bill:vue1:recouvr:split').enable();
                        $$('bill:vue1:recouvr:split').hideProgress();

                });

                $$('bill:vue1:recouvr:split').data.attachEvent("onStoreLoad", function () {
                                updateChartReady('bill:vue1:recouvr:split');
                });
        }

}
