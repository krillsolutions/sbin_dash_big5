import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components, color_ref,dash_titles, dataDesc} from "models/referential/genReferentials";
import { getRechargeChartData} from "models/data/recharge/data";
import { kFormatter,updateChartReady } from "models/utils/home/utils";

export default class RecByTypeView extends JetView{


	config() {
   	return color_ref.then((color_ref) => { 
		return {
			view : 'echarts-grid-dataset',
            id : 'rec:vue1:type:split',
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

             title : {
                text : dash_titles['recharge'].rec_by_type_split? dash_titles['recharge'].rec_by_type_split : "",
                left : '20%',
                textAlign: 'center',
                textStyle : {
                    fontSize : 12
                }
             },

           grid : [{
                left : 5,
                top : 20,
                containLabel: true
            },
           ],
            dataset : [

                {
                    dimensions : ['rec_type', 'amnt']
                }

            ],			
			series : [
                {
					type : 'pie',
					radius: [0, '40%'],
					center : ['50%','55%'],
					_type : 'rec_split',
                    minAngle : 10,
                    datasetIndex : 0,

					tooltip : {trigger : 'item',show : true, formatter: function(params) {  return params.name+': '+kFormatter(params.data.amnt) +' ('+params.percent+'%)'  }},
                    selectedMode: 'single',avoidLabelOverlap: true,
                    encode : {itemName : 'rec_type', value : 'amnt', tooltip : 'amnt'},
					emphasis: {
						itemStyle: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
						}
					}
                },

			],		
		}
		}
	})
	}

        init(view) {
                view.showProgress();
                view.disable();
                components['recharge'].push({cmp : "rec:vue1:type:split", data : getRechargeChartData('type_split').config.id});
                getRechargeChartData('type_split').waitData.then((d) => {
			            view._isDataLoaded = 1;
                        view.parse(getRechargeChartData('type_split'));
                        view.enable();
                        view.hideProgress();
                        
                });

                view.data.attachEvent("onStoreLoad", function () {
                                updateChartReady("rec:vue1:type:split");
                });

        }

}
