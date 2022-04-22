import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {color_ref, dash_titles,components} from "models/referential/genReferentials";
import { getBillsChartData} from "models/data/bills/data";
import { kFormatter, updateChartReady , formatter} from "models/utils/home/utils";
export default class BillByOfferView extends JetView{

    constructor(app, name , type) {
        super(app,name)
        this._type = type
    }


	config() {
       
    let tp = this._type
	return color_ref.then((color_ref) => {
		return {
			view : 'echarts-grid-dataset',
            id : 'bill:vue1:offers:'+tp,
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
					text : dash_titles['bill'].by_prod? dash_titles['bill'].by_prod : "",
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

                    dimensions : [ 'off_group','revenue']
                }
            ],		
			series : [
				{
					type : 'bar',
					_type : 'off_split',
					z : 3,datasetIndex : 0,
					showBackground: true,barMaxWidth : 30,barMinHeight: 10, encode : {x : 'revenue', y : 'off_group'},
                    tooltip : {trigger : 'item',show : true, formatter: function(params) { return params.name+': '+kFormatter(params.data.revenue)  }},
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
                                return formatter(params.data.revenue);
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
                let tp = this._type;
                $$("bill:vue1:offers:"+tp).showProgress();
                $$("bill:vue1:offers:"+tp).disable();
                components['bills'].push({cmp : "bill:vue1:offers:"+tp, data : getBillsChartData(tp+'_offer').config.id});
                getBillsChartData(tp+'_offer').waitData.then((d) => {
			$$("bill:vue1:offers:"+tp)._isDataLoaded = 1;
                        $$("bill:vue1:offers:"+tp).parse(getBillsChartData(tp+'_offer'));
                        $$("bill:vue1:offers:"+tp).enable();
                        $$("bill:vue1:offers:"+tp).hideProgress();

                });

                $$("bill:vue1:offers:"+tp).data.attachEvent("onStoreLoad", function () {
                                updateChartReady("bill:vue1:offers:"+tp);
                });
        }

}
