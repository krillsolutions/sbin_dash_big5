import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components, color_ref,dash_titles, colors} from "models/referential/genReferentials";
import { getTraffChartData} from "models/data/traffic/data";
import {getScreenType, DatakFormatter, updateChartReady, formatter } from "models/utils/home/utils";
export default class TraffDataSiteView extends JetView{
	
	config() {
		var kp = 'data';
       var conf = color_ref.then((color_ref) => { 
		return {
			view : 'echarts-grid-dataset',
            id : 'traff:site:'+kp,
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
                        text : dash_titles['traffic'].top_data_sites? dash_titles['traffic'].top_data_sites : "",
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
        				show :  true,
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

                    dimensions : [ 'site','value']
                }

            ],		
			series : [
				{
					type : 'bar',
					_type : 'traff_data_site_split',
					z : 3,datasetIndex : 0,
					showBackground: true,barMaxWidth : 40,barMinHeight: 10, encode : {x : 'value', y : 'site'}, barMaxHeight : 200,
					tooltip : {trigger : 'item',show : true, formatter: function(params) { return params.name+': '+  formatter(params.value.value, 't') }},
					itemStyle : {

						color : function(p) {	
							if (p.dataIndex < colors.length && p.value.site != "Autres" && p.value.site != 'Inconnu') return colors[p.dataIndex];
							return 'black';
						}
					},
					label : {
						position: 'right',
						show : true,
						formatter : function(params) {
							return DatakFormatter(params.data.value) +" ("+d3.format(".2%")(params.data.value/params.data.tot)+")";
						},
						textStyle : {fontSize : 10 }
					}
				}
			],
				
		}
		}
       })
	//if(getScreenType() != 'small') conf['maxWidth'] = 270;
	return conf;
	}

        init(view) {
		let kp = 'data';
                view.showProgress();
                view.disable();
                components['traffic'].push({cmp : 'traff:site:'+kp, data : getTraffChartData('data_site').config.id});

                getTraffChartData('data_site').waitData.then((d) => {
			view._isDataLoaded = 1;
                        view.parse(getTraffChartData('data_site'));
			view.data.sort("value", "asc", "int");
                        view.enable();
                        view.hideProgress();

                });

                view.data.attachEvent("onStoreLoad", function () {
                                updateChartReady('traff:site:'+kp);
				view.data.sort("value", "asc", "int");
                });

        }

}
