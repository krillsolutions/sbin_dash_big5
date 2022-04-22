import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import { components,color_ref,dataDesc} from "models/referential/genReferentials";
import { getSalesChartData, getFiterDate} from "models/data/sales/data";
import { kFormatter, updateChartReady,getScreenType } from "models/utils/home/utils";
export default class SalesCatView extends JetView{


	config() {

        return webix.promise.all([color_ref,dataDesc]).then((data) => {
            let color_ref = data[0];
            let dataDesc = data[1];
        let config =  {
			view : 'echarts-grid-dataset',
            id : 'sales:vue1:cat',
            maxHeight : (getScreenType() == 'small' || getScreenType() == 'mobile')? 150 :225,
			options :{
			 tooltip : {
				 trigger : 'axis',show : true,  textStyle : {fontSize : 10},
                                position: function (pos, params, el, elRect, size) {
                                        var obj =  {top : pos[1]+10};
                                        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                                                return obj;
                                }			 
			 },
			legend : {show : true, bottom : '5', type : 'scroll'},animation: true,
			title : [
                {
                        text : 'Par categorie',
                        top : 5,
                        left : '50%',
                        textAlign: 'center',
                        textStyle : {
						
                            fontSize : 12
                        }
                }				
			],
			grid : [{

                height : '90%',
                left : 5,
                bottom : 5,
                top : 20,
                containLabel: true
            }],
	
            dataset : [
                {
                    dimensions : ['cat', 'montant']
                }
            ],		
			series : [
				{
					type : 'pie',
					radius: ['50%', '60%'],
					minAngle : 10,
                   // roseType: 'radius',
                    itemStyle: {
                        borderRadius: 8
                      },
					datasetIndex : 0,label : {show : false},
					tooltip : {trigger : 'item',show : true, formatter: function(params) { return params.name+': '+kFormatter(params.data.montant) +' ('+params.percent+'%)'  }},
                    selectedMode: 'single',avoidLabelOverlap: false,
                    encode : {itemName : 'cat', value : 'montant', tooltip : 'montant'},
                    itemStyle : {
                        color : function(params) {
                            return color_ref.revenue[params.name];
                        }
                    },
					emphasis: {
						itemStyle: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
						}
					}
                }
			],

		}
		}
        if(getScreenType() == 'mobile_rotated') config['maxWidth'] = 190
        return config
	})
}

        init(view) {

                $$("sales:vue1:cat").showProgress();
                $$("sales:vue1:cat").disable();
                components['sales'].push({cmp : "sales:vue1:cat", data : getSalesChartData('sales_split').config.id});
                getSalesChartData('sales_split').waitData.then((d) => {
			$$("sales:vue1:cat")._isDataLoaded = 1;
                        $$("sales:vue1:cat").parse(getSalesChartData('sales_split'));
                        $$("sales:vue1:cat").enable();
                        $$("sales:vue1:cat").hideProgress();

                });

                $$("sales:vue1:cat").data.attachEvent("onStoreLoad", function () {
                                updateChartReady("sales:vue1:cat");
                });

        }

}
