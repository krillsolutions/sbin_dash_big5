import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components} from "models/referential/genReferentials";
import { getSalesChartData} from "models/data/sales/data";
import { kFormatter,updateChartReady, formatter } from "models/utils/home/utils";

export default class SalesTypeProdView extends JetView{

	config() {


		return {
			view : 'echarts-grid-dataset',
            id : 'sales:vue1:typeprod',
            animation: true,
            beforedisplay : function(dat, conf) {
                let series = [];
                if(dat.length != 0) conf.series[0].data = dat;
            },
			options :{
		tooltip : {
                 formatter : function(params) {
                    return params.marker+params.name+" : "+formatter(params.value);
                 },
                                position: function (pos, params, el, elRect, size) {
                                        var obj =  {top : pos[1]+10};
                                        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                                                return obj;
                                }			
             },
             title : [
                {
                        text : 'Par catégorie par type',
                        top : 5,
                        left : '50%',
                        textAlign: 'center',
                        textStyle : {
						
                            fontSize : 12
                        }
                }				
			],
             /*legend : {

                top : 5, show : true
             },*/
             label: {
                //normal: {
                    position: 'insideTopLeft',
                    formatter: function (params) {

                        return params.name +' : '+kFormatter(params.value)
                    }
                //}
            }
                    ,
			
             series: [{
                name: 'Ventes',
                type: 'treemap',
             //   visibleMin: 300,
                //data: data.children,
                leafDepth: 1,
		_type : '_mkbt',
                levels : [{
                    colorMappingBy : 'index',
                    color : ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3']

                },
                {
                    //colorAlpha : [0.3, 1],
                    colorMappingBy : 'index',
                    color : ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3']
                    //colorSaturation : [0.3, 1]
                },

                {
                    //colorAlpha : [0.3, 1],
                    colorMappingBy : 'index',
                    color : ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3']
                    //colorSaturation : [0.3, 1]
                }			
            ]

            }]
		
		}
		}
	}

        init(view) {

                $$("sales:vue1:typeprod").showProgress();
                $$("sales:vue1:typeprod").disable();
                components['sales'].push( {cmp : "sales:vue1:typeprod", data :getSalesChartData('sales_type_split').config.id });
                getSalesChartData('sales_type_split').waitData.then((d) => {
			$$("sales:vue1:typeprod")._isDataLoaded = 1;
                        $$("sales:vue1:typeprod").parse(getSalesChartData('sales_type_split'));
                        $$("sales:vue1:typeprod").enable();
                        $$("sales:vue1:typeprod").hideProgress();

                });

                $$("sales:vue1:typeprod").data.attachEvent("onStoreLoad", function () {
                                updateChartReady("sales:vue1:typeprod");
                });

        }

}
