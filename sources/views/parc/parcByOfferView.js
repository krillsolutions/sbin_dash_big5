import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components} from "models/referential/genReferentials";
import { getParcChartData} from "models/data/parc/data";
import { kFormatter,updateChartReady, formatter } from "models/utils/home/utils";

export default class ParcOfferTypeView extends JetView{




	config() {

        let tp = 'acct'
		return {
			view : 'echarts-grid-dataset',
            id : 'parc:vue1:grpoff:'+tp,
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
                        text : 'Par produit par offre',
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
                name: 'Parc',
                type: 'treemap',
             //   visibleMin: 300,
                //data: data.children,
                _type : "_grpoff",
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
            let tp = 'acct'
           view._eType = 'treemap';
            view._expDataId = getParcChartData("parc_offer_acct_exp").config.id
                view.showProgress();
                view.disable();
                components['parc'].push( {cmp : "parc:vue1:grpoff:"+tp, data :getParcChartData('parc_offer_'+tp).config.id });
                components['parc'].push( {cmp : "parc:vue1:grpoff:acct:exp", data :getParcChartData("parc_offer_acct_exp").config.id });
                getParcChartData('parc_offer_'+tp).waitData.then((d) => {
			view._isDataLoaded = 1;
                        view.parse(getParcChartData('parc_offer_'+tp));
                        view.enable();
                        view.hideProgress();

                });

                view.data.attachEvent("onStoreLoad", function () {
                                updateChartReady("parc:vue1:grpoff:"+tp);
                });

        }

}
