import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components,dash_titles, color_ref, dataDesc} from "models/referential/genReferentials";
import { getRechargeChartData} from "models/data/recharge/data";
import { kFormatter,updateChartReady } from "models/utils/home/utils";

export default class RecByValueView extends JetView{


	config() {
    
		return {
			view : 'echarts-grid-dataset',
            id : 'rec:values:split',
            animation: true,

			options :{
             tooltip : {
		     show : true ,
                                position: function (pos, params, el, elRect, size) {
                                        var obj =  {top : pos[1]+10};
                                        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                                                return obj;
                                }		     
	     
	        },
            
            legend : {
                top : 20,
                show : true,
                textStyle : {fontSize : 10},
                type : 'scroll'
            },
             title : [
				
				{
					text : dash_titles['recharge'].rec_voucher_by_value? dash_titles['recharge'].rec_voucher_by_value : "",
					//subtext : 'Revenu',
					left : '50%',
                    textAlign: 'center',
                    textStyle : {
                        fontSize : 12
                    }
				}				
			],
            dataset : [

                {
                    dimensions : ['amnt', 'qty']
                }

            ],
           grid : [{
                left : 5,
                //bottom : 5,
		top : 40,
                //height : '80%',
                containLabel: true
            }],				
			series : [
                {
					type : 'pie',
					radius: ['40%', '50%'],
                    _type : "rec_value",
                    minAngle : 10,
                    //center: ['50%', '35%'],
                    datasetIndex : 0,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    //roseType: 'area',
					tooltip : {trigger : 'item',show : true, formatter: function(params) { return params.name+': '+kFormatter(params.data.qty) +' ('+params.percent+'%)'  }},
                    selectedMode: 'single',avoidLabelOverlap: true,
                    encode : {itemName : 'amnt', value : 'qty', tooltip : 'qty'},
					emphasis: {
						itemStyle: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
                        },
                        label: {
                            show: true,
                            fontSize: '15',
                            fontWeight: 'bold'
                        }
					}
                },

			],		
		}
		}
	}

        init(view) {

                view.showProgress();
                view.disable();
                components['recharge'].push({cmp : "rec:values:split", data : getRechargeChartData('rec_value_split').config.id});
                view._isDataLoaded = 1;
                view.parse(getRechargeChartData('rec_value_split'));
                view.enable();
                view.hideProgress();                
                /* getRechargeChartData('rec_value_split').waitData.then((d) => {
			            view._isDataLoaded = 1;
                        //view._echart_obj.hideLoading();
                        view.parse(getRechargeChartData('rec_value_split'));
                        console.log("PARSED");


                });*/

                view.data.attachEvent("onStoreLoad", function () {
                                updateChartReady("rec:values:split");
                });

        }

}
