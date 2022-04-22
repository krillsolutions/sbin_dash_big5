import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components, color_ref,dash_titles, dataDesc} from "models/referential/genReferentials";
import { getTraffChartData} from "models/data/traffic/data";
import { DatakFormatter,updateChartReady } from "models/utils/home/utils";

export default class DataSplitTypetSplitView extends JetView{


	config() {
    
		return {
			view : 'echarts-grid-dataset',
            id : 'data:vue1:type:split',
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
					text : dash_titles['traffic'].data_by_type? dash_titles['traffic'].data_by_type : "",
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
                    dimensions : ['data_type', 'traffic']
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
                    _type : 'data_type',
                    minAngle : 10,
                    //center: ['50%', '35%'],

                    datasetIndex : 0,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    //roseType: 'area',
					tooltip : {trigger : 'item',show : true, formatter: function(params) {  return params.name+': '+DatakFormatter(params.data.traffic) +' ('+params.percent+'%)'  }},
                    selectedMode: 'single',avoidLabelOverlap: true,
                    encode : {itemName : 'data_type', value : 'traffic', tooltip : 'traffic'},
                    /*itemStyle : {
                        color : function(params) {
                            return color_ref.revenue[params.name];
                        }
                    }*/
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

                $$("data:vue1:type:split").showProgress();
                $$("data:vue1:type:split").disable();
                components['traffic'].push({cmp : "data:vue1:type:split", data : getTraffChartData('data_type').config.id});
                getTraffChartData('data_type').waitData.then((d) => {
			$$("data:vue1:type:split")._isDataLoaded = 1;
                        $$("data:vue1:type:split").parse(getTraffChartData('data_type'));
                        $$("data:vue1:type:split").enable();
                        $$("data:vue1:type:split").hideProgress();

                });

                $$("data:vue1:type:split").data.attachEvent("onStoreLoad", function () {
                                updateChartReady("data:vue1:type:split");
                });

        }

}
