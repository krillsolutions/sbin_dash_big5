import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components} from "models/referential/genReferentials";
import { getRevChartData} from "models/data/revenue/data";
import { kFormatter,updateChartReady, formatter } from "models/utils/home/utils";

export default class RevSalesSplit extends JetView{

	config() {

		return {
			view : 'echarts-grid-dataset',
            id : 'rev:vue1:sales:split',
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
             },
             title : [
                {
                        text : 'Par category par type',
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
             },
             label: {
                //normal: {
                    position: 'insideTopLeft',
                    formatter: function (params) {

                        return params.name +' : '+kFormatter(params.value)
                    }
                //}
            }
               */   
            label: {
                //normal: {
                    position: 'insideTopLeft',
                    formatter: function (params) {

                        return params.name +' : '+kFormatter(params.value)
                    }
                //}
            },                 
			
             series: [{
                type: 'treemap',
                leafDepth: 1,
                name : "revenu",
		        _type : '_rsales',
                /*levels : [{},{
                    r0 : '15%',
                    r : '45%',
                    minAngle : 20,
                    label: {
                        rotate: 'tangential'
                      }
                },
                {
                    r0 : '45%',
                    r : '50%',
                    label: {
                        position: 'outside',
                        padding: 3,
                        silent: false
                      }
                }
            ]*/
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

                $$("rev:vue1:sales:split").showProgress();
                $$("rev:vue1:sales:split").disable();
                components['revenue'].push( {cmp : "rev:vue1:sales:split", data :getRevChartData('rev_sales_split').config.id });
                getRevChartData('rev_sales_split').waitData.then((d) => {
			$$("rev:vue1:sales:split")._isDataLoaded = 1;
                        $$("rev:vue1:sales:split").parse(getRevChartData('rev_sales_split'));
                        $$("rev:vue1:sales:split").enable();
                        $$("rev:vue1:sales:split").hideProgress();

                });

                $$("rev:vue1:sales:split").data.attachEvent("onStoreLoad", function () {
                                updateChartReady("rev:vue1:sales:split");
                });

        }

}
