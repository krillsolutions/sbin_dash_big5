import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components,dash_titles} from "models/referential/genReferentials";
import { getTraffChartData} from "models/data/traffic/data";
import { kFormatter,updateChartReady,formatter, DatakFormatter } from "models/utils/home/utils";

export default class TraffByOfferView extends JetView{


    constructor(app,name, kpi) {

        super(app,name);
        this._kpi = kpi;
        console.log(kpi);
    }

    config() {

        let kp = this._kpi;
	    this._eType = 'treemap';
		return {
			view : 'echarts-grid-dataset',
            id : 'traff:vue1:'+kp+':offer',
            animation: true,
	    _eType : "treemap",
            beforedisplay : function(dat, conf) {
		
                if(dat.length != 0) conf.series[0].data = dat.filter(d => d.traff_type == kp);
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
             /*legend : {

                top : 5, show : true
             },*/

             title : [
				
				{
			//		top : 5,
					text : dash_titles['traffic'].by_bill_by_prod_by_offer? dash_titles['traffic'].by_bill_by_prod_by_offer : "",
					//subtext : 'Revenu',
					left : '50%',
                    textAlign: 'center',
                    textStyle : {
                        fontSize : 12
                    }
				}				
			],
             label: {
                    position: 'insideTopLeft',
                    formatter: function (params) {
                        return params.name +' : '+ ((kp == 'data')? DatakFormatter(params.value) : kFormatter(params.value));
                    }
                
            },
           grid : [{
                left : 5,
                //bottom : 5,
		top : 8,
               // height : '80%',
                containLabel: true
            }],						
             series: [{
                name: 'Offre',
                type: 'treemap',
                //visibleMin: 300,
                leafDepth: 1,
		_type : kp,
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
	    view._expDataId = getTraffChartData('traffic_offer_exp').config.id;
	    view._eType = 'treemap';
            let kp = this._kpi;
                $$("traff:vue1:"+kp+":offer").showProgress();
                $$("traff:vue1:"+kp+":offer").disable();
                components['traffic'].push( {cmp : "traff:vue1:"+kp+":offer", data :getTraffChartData('traffic_offer').config.id });
		    components['traffic'].push( {cmp : "traff:vue1:export:offer", data :getTraffChartData('traffic_offer_exp').config.id });
                getTraffChartData('traffic_offer').waitData.then((d) => {
			$$("traff:vue1:"+kp+":offer")._isDataLoaded = 1;
                        $$("traff:vue1:"+kp+":offer").parse(getTraffChartData('traffic_offer'));
                        $$("traff:vue1:"+kp+":offer").enable();
                        $$("traff:vue1:"+kp+":offer").hideProgress();

                });

                $$("traff:vue1:"+kp+":offer").data.attachEvent("onStoreLoad", function () {
                                updateChartReady("traff:vue1:"+kp+":offer");
                });

        }

}
