import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components,dash_titles} from "models/referential/genReferentials";
import { getRevChartData} from "models/data/revenue/data";
import { kFormatter,updateChartReady, formatter } from "models/utils/home/utils";

export default class RevByCltView extends JetView{

	config() {

		return {
			view : 'echarts-grid-dataset',
            id : 'rev:vue1:client:compte',
            animation: true,
            beforedisplay : function(dat, conf) {
                let series = [];
                if(dat.length != 0) conf.series[0].data = dat;
            },
			options :{
		tooltip : {
                 formatter : function(params) {
                     //console.log(params)
                    return params.marker+params.name+" : "+formatter(params.value);
                 },			
             },
             title : [
                {
                        text : dash_titles['revenue'].by_market_by_bill? dash_titles['revenue'].by_market_by_bill : "",
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
                 
                name: 'Revenu',
                type: 'treemap',
                leafDepth: 1,             
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

                $$("rev:vue1:client:compte").showProgress();
                $$("rev:vue1:client:compte").disable();
                view._eType = 'treemap';
                view._expDataId = getRevChartData("rev_client_split_exp").config.id
                components['revenue'].push( {cmp : "rev:vue1:client:compte", data :getRevChartData('rev_client_split').config.id });
                components['revenue'].push( {cmp : "rev:vue1:client:compte:exp", data :getRevChartData('rev_client_split_exp').config.id });
                getRevChartData('rev_client_split').waitData.then((d) => {
			$$("rev:vue1:client:compte")._isDataLoaded = 1;
                        $$("rev:vue1:client:compte").parse(getRevChartData('rev_client_split'));
                        $$("rev:vue1:client:compte").enable();
                        $$("rev:vue1:client:compte").hideProgress();

                });

                $$("rev:vue1:client:compte").data.attachEvent("onStoreLoad", function () {
                                updateChartReady("rev:vue1:client:compte");
                });

        }

}
