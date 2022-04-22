import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components, dash_titles} from "models/referential/genReferentials";
import { getParcChartData} from "models/data/parc/data";
import { kFormatter,updateChartReady } from "models/utils/home/utils";
export default class ParcNetAddView extends JetView{


	config() {
    
		return {
			view : 'echarts-grid-dataset',
            id : 'parc:vue1:netadd',
            animation: true,
            beforedisplay : function(data, conf){
	    
            let dat = data.filter((d) => d.upd_dt);
            conf.xAxis[0].data = dat.map((d) => d.upd_dt).sort();
             },
			options :{
             tooltip : {
		     	trigger: "item",
		     	show : true, 
		     	z : 2 ,
                    	position: function (pos, params, el, elRect, size) {
                       		var obj =  {top : pos[1]};
                        	obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                        	return obj;
                    	}		     
	         },
             title : [
				
				{
					text : dash_titles['parc'].parc_mvt? dash_titles['parc'].parc_mvt : "",
                    top : 5,
					left : '50%',
                    textAlign: 'center',
                    textStyle : {
                        fontSize : 12
                    }
				},
                {
                    text : dash_titles['parc'].net_add_trend? dash_titles['parc'].net_add_trend : "",
                    left : '50%',
                    top : '49%',
                    textAlign: 'center',
                    textStyle : {
                        fontSize : 12
                    }
                }
				
			],

             legend : {
		     show : true, type : 'scroll', textStyle : {fontSize : 10}, top : '20'
             },
             grid : [
                {
			        top: 70,
                    height: '25%',
                    width : '25%',
				    right: '40%',
			        //left: 10,
			        containLabel: true
                }, 
                {
			        //height: '50%',
			        bottom: '30',
		    top : '55%',
                    right: '5',
                    left : '5',
                    containLabel: true
                }
             ],

            dataset : [

                {
                    dimensions : ['upd_dt', 'netadd']
                },
                {
                    dimensions : ['upd_dt', 'netadd']
                },
                {
                    dimensions : ['mvt', 'qty']
                }

            ],
            dataZoom: [
                {
                    type: 'inside',
                    start: 50,
                    end: 100
                },
                {
                    show: true,
                    type: 'slider',
                    bottom: 5,
                    start: 50,
                    end: 100
                }
            ],	    
			xAxis: [
		        {
				//type: 'category',
			        splitLine: {
			        show: false
                    },
			        axisLabel: {show: true},
                    axisTick: {show: true},
                    gridIndex : 1

                },
			],
			yAxis: [
                {
				type: 'value',
				 axisLabel: {
                        formatter : function(val, ind){
                            return kFormatter(val);
                        }
    			},gridIndex : 1
            }
			],			
			series : [
                {
					type : 'pie',
					radius: ['20%', '30%'],
					center: ['50%', '35%'],_type : 'mvt_split', datasetIndex : 2,
					tooltip : {trigger : 'item',show : true, formatter: function(params) { return params.name+': '+kFormatter(params.data.qty) +' ('+params.percent+'%)'  }},
					selectedMode: 'single',
					emphasis: {
                        label: {
                            show: true,
                            fontSize: '15',
                            fontWeight: 'bold'
                        }
                    },
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    labelLine: {
                        show: false
                    },
                    encode : {itemName : 'mvt', value : 'qty', tooltip : 'qty'}
				},
				{
                    type : 'bar',encode : {x : 'upd_dt', y : 'netadd'},
                    _type : 'plus',datasetIndex : 0,id : 'parc:netadd',gridIndex : 1, itemStyle : {color: "rgba(69, 227, 29, 1)"},
					z : 3,
					barMinWidth : 7,barMinHeight: 10
                },
                {
                    type : 'bar', encode : {x : 'upd_dt',y : 'netadd'}, _type : 'minus',datasetIndex : 1, barMinWidth : 7,barMinHeight: 10, gridIndex : 1,
                    itemStyle : {color: "rgba(227, 46, 29, 1)"}
                },

			]	
		}
		}
	}

        init(view) {

                $$("parc:vue1:netadd").showProgress();
                $$("parc:vue1:netadd").disable();
                components['parc'].push({cmp : "parc:vue1:netadd", data : getParcChartData('netadd').config.id});
                getParcChartData('netadd').waitData.then((d) => {
			$$("parc:vue1:netadd")._isDataLoaded = 1;
                        $$("parc:vue1:netadd").parse(getParcChartData('netadd'));
                        $$("parc:vue1:netadd").enable();
                        $$("parc:vue1:netadd").hideProgress();

                });

                $$("parc:vue1:netadd").data.attachEvent("onStoreLoad", function () {
                                updateChartReady("parc:vue1:netadd");
                });
        }

}
