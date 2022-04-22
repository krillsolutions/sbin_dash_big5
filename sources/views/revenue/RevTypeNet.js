import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components,dash_titles} from "models/referential/genReferentials";
import { getRevChartData} from "models/data/revenue/data";
import { kFormatter,updateChartReady, formatter } from "models/utils/home/utils";

export default class RevTypeNetView extends JetView{




	config() {

		return {
			view : 'echarts-grid-dataset',
            id : 'rev:vue1:type:net',
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
                        text : dash_titles['revenue'].by_type_by_produit? dash_titles['revenue'].by_type_by_produit : "", 
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
             //   visibleMin: 300,
                //data: data.children,
              //  _type : "_grpoff",
                leafDepth: 1,
                levels : [
                    {
                    colorMappingBy : 'index',
                    color : ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3']

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
        view._eType = 'treemap';
        view._expDataId = getRevChartData("rev_type_net_exp").config.id
            view.showProgress();
            view.disable();
            components['revenue'].push( {cmp : 'rev:vue1:type:net', data :getRevChartData('rev_type_net').config.id });
            components['revenue'].push( {cmp : 'rev:vue1:type:net:exp', data :getRevChartData('rev_type_net_exp').config.id });
            getRevChartData('rev_type_net').waitData.then((d) => {
        view._isDataLoaded = 1;
                    view.parse(getRevChartData('rev_type_net'));
                    view.enable();
                    view.hideProgress();

            });

            view.data.attachEvent("onStoreLoad", function () {
                            updateChartReady('rev:vue1:type:net');
            });

    }

}
