import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components,dash_titles} from "models/referential/genReferentials";
import { getBillsChartData} from "models/data/bills/data";
import { kFormatter,updateChartReady, formatter } from "models/utils/home/utils";

export default class BillByZoneView extends JetView{

	config() {

        let tp = this._type;
		return {
			view : 'echarts-grid-dataset',
            id : 'bill:vue1:loc',
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
                        text : dash_titles['bill'].fact_by_zone? dash_titles['bill'].fact_by_zone : "",
                        top : 5,
                        left : '50%',
                        textAlign: 'center',
                        textStyle : {
						
                            fontSize : 12
                        }
                }				
			],

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
                name: "Localisation",
                type: 'treemap',
             //   visibleMin: 300,
                //data: data.children,
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

                view.showProgress();
                view.disable()
                view._expDataId = getBillsChartData('bill_loc_exp').config.id;
                view._eType = 'treemap';
                components['bills'].push( {cmp : 'bill:vue1:loc', data :getBillsChartData('bill_loc').config.id});
                components['bills'].push( {cmp : 'bill:vue1:loc', data :getBillsChartData('bill_loc_exp').config.id});
                getBillsChartData('bill_loc').waitData.then((d) => {
			    view._isDataLoaded = 1;
                view.parse(getBillsChartData('bill_loc'));
                view.enable();
                view.hideProgress();

                });

                view.data.attachEvent("onStoreLoad", function () {
                    updateChartReady('bill:vue1:loc');
                  });
        }

}
