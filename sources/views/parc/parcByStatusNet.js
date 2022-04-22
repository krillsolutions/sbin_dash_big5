import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components,dash_titles} from "models/referential/genReferentials";
import { getParcChartData} from "models/data/parc/data";
import { kFormatter,updateChartReady, formatter } from "models/utils/home/utils";

export default class ParcStatusNetView extends JetView{

	config() {

		return {
			view : 'echarts-grid-dataset',
            id : 'parc:vue1:status:net',
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
                name : "Parc",
             //   visibleMin: 300,
                //data: data.children,
                center : ['50%','55%'],
                minAngle : 10,
                emphasis: {
                    focus: 'descendant'
                  },
		      //  _type : '_mkbt',
                levels : [{
                    label: {
                        rotate: 'tangential',
                        formatter : function(obj) {return obj.name.replace("TELEPHONIE","TEL.")},
                        fontSize : 11

                      }
                },{
                    r0 : '15%',
                    r : '40%',
                    label: {
                        rotate: 'tangential',
                        formatter : function(obj) {return obj.name.replace("TELEPHONIE","TEL.")},
                        fontSize : 11

                      }
                },
                {
                    r0 : '40%',
                    r : '45%',
                    label: {
                        position: 'outside',
                        padding: 3,
                        silent: false,
                        formatter : function(obj) {return obj.name.replace("TELEPHONIE","TEL.")},
                        fontSize : 11
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

                $$("parc:vue1:status:net").showProgress();
                $$("parc:vue1:status:net").disable();
                view._eType = 'treemap'
                view._expDataId = getParcChartData('parc_status_split_exp').config.id 
                components['parc'].push( {cmp : "parc:vue1:status:net", data :getParcChartData('parc_status_split').config.id });
                components['parc'].push( {cmp : "parc:vue1:status:net:exp", data :getParcChartData('parc_status_split_exp').config.id });
                getParcChartData('parc_status_split').waitData.then((d) => {
			$$("parc:vue1:status:net")._isDataLoaded = 1;
                        $$("parc:vue1:status:net").parse(getParcChartData('parc_status_split'));
                        $$("parc:vue1:status:net").enable();
                        $$("parc:vue1:status:net").hideProgress();

                });

                $$("parc:vue1:status:net").data.attachEvent("onStoreLoad", function () {
                                updateChartReady("parc:vue1:status:net");
                });

        }

}
