import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {color_ref, components,dataDesc} from "models/referential/genReferentials";
import { getParcChartData} from "models/data/parc/data";
import { kFormatter, updateChartReady , formatter} from "models/utils/home/utils";
export default class ParcGROSView extends JetView{


	config() {
       
    let tp = this._type
	return   color_ref.then((color_ref) => {
        return dataDesc.then((dataDesc) => {
		return {
			view : 'echarts-grid-dataset',
            id : 'parc:gros:type',
            maxHeight : 165,
			options :{
			tooltip : {
					trigger : 'axis',
					show : true,  
                   
                    position: function (pos, params, el, elRect, size) {
                            var obj =  {top : pos[1]+5};
                            obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                                return obj;
                    },
                    formatter : function(param){
                        console.log(param)
                        /*
                        let rt = param[0].name+'<br/>';
                        for (const elm of param) {
                          rt+= elm.marker+(dataDesc.parc[elm.seriesName]?dataDesc.parc[elm.seriesName] :elm.seriesName )+' : '+ (  formatter(elm.value.qty) )+'<br/>'; 
                          
                        }
                        return rt */                       
                    }				
			},
			animation: true,
			/*title : [
				
				{
					text : 'Parc GROS',
					left : '50%',
					top : 5,
					textAlign: 'center',
					textStyle : {
						
						fontSize : 12
					}
				}				
			],*/
			grid : [{
                left : 5,
                bottom : 10,
                top : 25,
               // height : "25%",
                containLabel: true
            }],
			yAxis: [
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
			xAxis: [{
				 type: 'category',
				 axisLabel: {
                    show: true,
                    formatter : function(pr) { return (dataDesc.parc[pr]? dataDesc.parc[pr] : pr)  }
    				},
    				splitLine: {
        				show: false
                    },
                    axisTick: {show: true},
                    axisLine: {show: true},
			    }
            ],
            legend : {show : true, itemGap : 20, bottom : 5, type : 'scroll', textStyle : {fontSize : 10}},	
            dataset : [
                {

                    dimensions : [ 'type','qty']
                }
            ],		
			series : [
				{
					type : 'bar',
					z : 3,datasetIndex : 0,
					showBackground: true,barMaxWidth : 30,barMinHeight: 10, encode : {y : 'qty', x : 'type'},
                    tooltip : {trigger : 'item',show : true, formatter: function(params) { return (dataDesc.parc[params.name]?dataDesc.parc[params.name] : params.name )+': '+kFormatter(params.data.qty)  }},
                    itemStyle : {

						color : function(p) {
							return  color_ref.parc[p.value.type] ;
						}
					},
					label : {
						normal : {
							position: 'right',
							show : true,
                            formatter : function(params) {
                                return formatter(params.data.qty);
                            }
						},


					}
				}
			]
		}
		}
    })
	})
	}

        init(view) {
                view.showProgress();
                view.disable();
                components['parc'].push({cmp : 'parc:gros:type', data : getParcChartData('parc_gros_type').config.id});
                getParcChartData('parc_gros_type').waitData.then((d) => {
			view._isDataLoaded = 1;
                        view.parse(getParcChartData('parc_gros_type'));
                        view.enable();
                        view.hideProgress();

                });

                view.data.attachEvent("onStoreLoad", function () {
                                updateChartReady('parc:gros:type');
                });
        }

}
