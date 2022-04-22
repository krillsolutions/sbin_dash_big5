import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components,dash_titles} from "models/referential/genReferentials";
import { getTraffChartData} from "models/data/traffic/data";
import { kFormatter,updateChartReady} from "models/utils/home/utils";

export default class TraffParcTrendView extends JetView{


	config() {
		return {
			view : 'echarts-grid-dataset',
            id : 'traff:data:parc:vue1:trend',
            animation: true,

			options :{
             tooltip : {
                        trigger: "axis",
                        show : true,
                        z : 2 ,
                    },
//             legend : {show : true, itemGap : 20, top : '20'},

            dataset : [
                    {dimensions : ['traffic', 'upd_dt'] }
            ],
            grid : {
                left : 10,
                containLabel: true,
		bottom : 5,
		top : 25
            },

			title : [

                {
                    text : dash_titles['traffic'].parc_data? dash_titles['traffic'].parc_data : "",
                    left : '50%',
                    top : 5,
                    textAlign: 'center',
                    textStyle : {
                        fontSize : 12
                    }
                }

                ],

			xAxis: [
               {
                    axisLabel: {show: true},axisTick: {show: true},type : 'category'
                },
			],
			yAxis: [
                {
				type: 'value',
				 axisLabel: {
                        formatter : function(val, ind){
                            return kFormatter(val);
                        }
    				},
    				splitLine: {
        				show: true
    				}
			}
			],			
			series : [
                {type : 'bar', datasetIndex : 0 , encode : {x : 'upd_dt', y : 'traffic'}, _type : 'parc_data' , smooth : true, barMaxWidth : 40,barMinHeight: 10}
            ],
		
		}
		}
	}

        init(view) {
                
                $$("traff:data:parc:vue1:trend").showProgress();
                $$("traff:data:parc:vue1:trend").disable();
                components['traffic'].push( {cmp : "traff:data:parc:vue1:trend", data :getTraffChartData('parc_data').config.id });
                getTraffChartData('parc_data').waitData.then((d) => {
			$$("traff:data:parc:vue1:trend")._isDataLoaded = 1;
                        $$("traff:data:parc:vue1:trend").parse(getTraffChartData('parc_data'));
                        $$("traff:data:parc:vue1:trend").enable();
                        $$("traff:data:parc:vue1:trend").hideProgress();

                });

                $$("traff:data:parc:vue1:trend").data.attachEvent("onStoreLoad", function () {
                                updateChartReady("traff:data:parc:vue1:trend");
                });
        }

}
