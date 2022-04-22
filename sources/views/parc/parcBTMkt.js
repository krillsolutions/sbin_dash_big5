import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components,dash_titles} from "models/referential/genReferentials";
import { getParcChartData} from "models/data/parc/data";
import { kFormatter,updateChartReady, formatter } from "models/utils/home/utils";

export default class ParcBillMarkView extends JetView{

	config() {

		return {
			view : 'echarts-grid-dataset',
            id : 'parc:vue1:billmkt',
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
                        text : dash_titles['parc'].by_bill_by_prod? dash_titles['parc'].by_bill_by_prod : "", 
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
			
             series: [{
                type: 'sunburst',
             //   visibleMin: 300,
                //data: data.children,
                emphasis: {
                    focus: 'descendant'
                  },
		        _type : '_mkbt',
                levels : [{},{
                    r0 : '15%',
                    r : '45%',
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
            ]
               /* levels : [{
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
            ]*/

            }]
		
		}
		}
	}

        init(view) {

                $$("parc:vue1:billmkt").showProgress();
                $$("parc:vue1:billmkt").disable();
                components['parc'].push( {cmp : "parc:vue1:billmkt", data :getParcChartData('parc_market').config.id });
                getParcChartData('parc_market').waitData.then((d) => {
			$$("parc:vue1:billmkt")._isDataLoaded = 1;
                        $$("parc:vue1:billmkt").parse(getParcChartData('parc_market'));
                        $$("parc:vue1:billmkt").enable();
                        $$("parc:vue1:billmkt").hideProgress();

                });

                $$("parc:vue1:billmkt").data.attachEvent("onStoreLoad", function () {
                                updateChartReady("parc:vue1:billmkt");
                });

        }

}
