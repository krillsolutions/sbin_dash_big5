import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components, color_ref,dash_titles, colors} from "models/referential/genReferentials";
import { getTraffChartData} from "models/data/traffic/data";
import {getScreenType, kFormatter, updateChartReady, formatter } from "models/utils/home/utils";
export default class TraffInTView extends JetView{


    constructor(app,name, kpi) {

        super(app,name);
        this._kpi = kpi;
    }	
	config() {
		var kp = this._kpi;
       var conf = color_ref.then((color_ref) => { 
		return {
			view : 'echarts-grid-dataset',
            id : 'traff:int:'+kp,
			options :{
                tooltip : {
				trigger : 'axis',show : true,  axisPointer : {type : 'shadow'} ,
                    position: function (pos, params, el, elRect, size) {
                       var obj =  {top : 10};
                        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                        return obj;
                    }				
		},
			xAxis: [
		        {
				    type: 'value',
			        splitLine: {
			        show: false
		        	},
			        axisLabel: {show: false},
                		axisLine: {show: false},
                		axisTick: {show: false},

                }
			],
			title : [

                    {
                        text : dash_titles['traffic'].top_int_traffic? dash_titles['traffic'].top_int_traffic : "",
                        left : '50%',
                        top : 5,
                        textAlign: 'center',
                        textStyle : {
                            fontSize : 10
                        }
                    }

                    ],
			yAxis: [{
				 type: 'category',
				 axisLabel: {
				        interval: 0,
        				show : /*(getScreenType() == 'mobile')? false :*/ true,
    				},
    				splitLine: {
        				show: false
                    },
                    axisTick: {show: true},
			    }
            ],	
            grid : {
                left : 10,
		top : 25,
		bottom : 5,
		right : 10,
                width : '70%',
                containLabel: true
            },
            dataset : [
                {

                    dimensions : [ 'country','value']
                }

            ],		
			series : [
				{
					type : 'bar',
					_type : kp+'_geo_split',
					z : 3,datasetIndex : 0,
					showBackground: true,barMaxWidth : 40,barMinHeight: 10, encode : {x : 'value', y : 'country'}, barMaxHeight : 200,
					tooltip : {trigger : 'item',show : true, formatter: function(params) { return params.name+': '+  formatter(params.value.value, 't') }},
					itemStyle : {

						color : function(p) {	
							if (p.dataIndex < colors.length && p.value.country != "Autres" && p.value.country != 'Inconnu') return colors[p.dataIndex];
							return 'black';
						}
					},
					label : {
						position: 'right',
						show : true,
						formatter : function(params) {
							return kFormatter(params.data.value) +" ("+d3.format(".2%")(params.data.value/params.data.tot)+")";
						},
						textStyle : {fontSize : 10 }
					}
				}
			],
				
		}
		}
       })
	console.log(getScreenType());
	//if(getScreenType() != 'small') conf['maxWidth'] = 270;
	return conf;
	}

        init(view) {
		let kp = this._kpi;
                $$('traff:int:'+kp).showProgress();
                $$('traff:int:'+kp).disable();
                components['traffic'].push({cmp : 'traff:int:'+kp, data : getTraffChartData('int_traffic_sample').config.id});

                getTraffChartData('int_traffic_sample').waitData.then((d) => {
			$$('traff:int:'+kp)._isDataLoaded = 1;
                        $$('traff:int:'+kp).parse(getTraffChartData('int_traffic_sample'));
			$$('traff:int:'+kp).data.sort("value", "asc", "int");
                        $$('traff:int:'+kp).enable();
                        $$('traff:int:'+kp).hideProgress();

                });

                $$('traff:int:'+kp).data.attachEvent("onStoreLoad", function () {
                                updateChartReady('traff:int:'+kp);
				$$('traff:int:'+kp).data.sort("value", "asc", "int");
                });

        }

}
