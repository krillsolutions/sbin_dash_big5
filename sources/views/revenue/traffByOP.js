import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {kpi_field, components,dash_titles, color_ref} from "models/referential/genReferentials";
import { getRevChartData} from "models/data/revenue/data";
import { kFormatter, updateChartReady, formatter } from "models/utils/home/utils";

export default class TrVoiceByOPView extends JetView{


	config() {
       return color_ref.then((color_ref) => { 
		return {
			view : 'echarts-grid-dataset',
            id : 'rev:vue1:operators:traff',
			/*beforedisplay : function(dat, conf, echart_obj) {


				echart_obj.series[0].
			},*/
			options :{
                tooltip : {
			   trigger : 'axis',show : true,  axisPointer : {type : 'shadow'} ,
                    position: function (pos, params, el, elRect, size) {
                        var obj =  {top : pos[1]+10};
                        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                        return obj;
                    }		
		},
			xAxis: [
		        {
				    type: 'value',isDim : false,_type : 'op',_dim : 'name',
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
								text : dash_titles['revenue'].traff_by_op_dest? dash_titles['revenue'].traff_by_op_dest : "",
								left : '50%',
								top : 5,
								textAlign: 'center',
								textStyle : {
									fontSize : 12
								}
                                },

                        ],				
			yAxis: [{
				 type: 'category',
		//		 position : 'right',
				 axisLabel: {
				        interval: 0,
        				//rotate: 30
    				},
    				splitLine: {
        				show: false
                    },
                    axisTick: {show: true},
			    }
            ],	
            grid : {
                //right : 10,
		left : 5,
		top : 25,
                width : '70%',
                containLabel: true,
		bottom : 20
            },
            dataset : [
                {

                    dimensions : [ 'operator','traffic']
                }

            ],		
			series : [
				{
					type : 'bar',
					_type : 'op_split',
					z : 3,datasetIndex : 0,
					showBackground: true,barMaxWidth : 40,barMinHeight: 10, encode : {x : 'traffic', y : 'operator'},
					tooltip : {trigger : 'item',show : true, formatter: function(params) { return params.name+': '+  formatter(params.value.traffic, 't') }},
					itemStyle : {

						color : function(p) {
							return (p.value.operator)? color_ref.revenueOP[p.value.operator] : 'red';
						}
					},
					label : {
						position: 'right',
						show : true,
						formatter : function(params) {
							return kFormatter(params.data.traffic) +" ("+d3.format(".2%")(params.value.traffic/params.data.tot)+")";
						},
						textStyle : {fontSize : 10 }

					}
				}
			],
		}
		}
       })
	}

        init(view) {

                $$("rev:vue1:operators:traff").showProgress();
                $$("rev:vue1:operators:traff").disable();
                components['revenue'].push({cmp : "rev:vue1:operators:traff", data : getRevChartData('operators_traff').config.id});

                getRevChartData('operators_traff').waitData.then((d) => {
			$$("rev:vue1:operators:traff")._isDataLoaded = 1;
                        $$("rev:vue1:operators:traff").parse(getRevChartData('operators_traff'));
                        $$("rev:vue1:operators:traff").enable();
                        $$("rev:vue1:operators:traff").hideProgress();

                });

                $$("rev:vue1:operators:traff").data.attachEvent("onStoreLoad", function () {
                                updateChartReady("rev:vue1:operators:traff");
                });

        }

}
