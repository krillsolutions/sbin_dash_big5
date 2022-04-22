import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {color_ref,components,dash_titles} from "models/referential/genReferentials";
import { getBillsChartData} from "models/data/bills/data";
import {  updateChartReady, formatter } from "models/utils/home/utils";

export default class BillSplitView extends JetView{


    constructor(app,name, type,kpi ) {
        super(app,name);
        this._kpi = kpi;
        this._type = type
    }


	config() {

        let kp = this._kpi,
            tp = this._type

	return color_ref.then((color_ref) => {

        let series = [
            {type : 'pie',radius: ((kp == 'type') ? ['40%', '50%'] : [0, '50%']), //center : ['25%', '55%'],
            datasetIndex : 0,
             gridIndex : 0  , encode : {value : 'kpi', itemName : 'name'} , _type : tp+'_'+kp, label : {show : false},
            tooltip : {trigger : 'item',show : true, formatter: function(params) {
                if(params.value) return  params.name+' : '+formatter(params.value.kpi)+' ('+params.percent+'%)' ;
                }
            },
            selectedMode: 'single',avoidLabelOverlap: true,minAngle : 10,
    itemStyle : {
                    color : function(params) {
                        return color_ref[tp][kp][params.name];
                    }
            }
            },
        
        ]
        if(kp == 'type') {
            series[0].emphasis ={ itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
        },
        label: {
            show: true,
            fontSize: '15',
            fontWeight: 'bold'
        }
    }
        series[0].label = {show: false,position: 'center'}
        series[0].labelLine =  {show : false}
    }
	return {
            
			view : 'echarts-grid-dataset',
            id : 'bill:vue1:'+kp+':'+tp,

			options :{
				tooltip : {
					trigger : 'item',show : true,
                                position: function (pos, params, el, elRect, size) {
                                        var obj =  {top : pos[1]+10};
                                        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                                                return obj;
                                }					
				}, legend : {top : 10, textStyle : {fontSize : 10}, type : 'scroll'},

            title : [
                {
                    top : "30",
                    text :  dash_titles['bill'][tp+"_"+kp+"_split"]? dash_titles['bill'][tp+"_"+kp+"_split"] : "" ,
                    //subtext : 'Revenu',
                    left : '50%',
                    textAlign: 'center',
                    textStyle : {
                        fontSize : 12
                    }
                    
                }
            ],
                
            

            dataset : [
                {
                    dimensions : ['name', 'kpi']
                }
            ],		
			series : series/*[
                {type : 'pie',radius: ((kp == 'type') ? ['40%', '50%'] : [0, '50%']), //center : ['25%', '55%'],
                datasetIndex : 0,
                 gridIndex : 0  , encode : {value : 'kpi', itemName : 'name'} , _type : tp+'_'+kp, label : {show : false},
                tooltip : {trigger : 'item',show : true, formatter: function(params) {
                    if(params.value) return  params.name+' : '+formatter(params.value.kpi)+' ('+params.percent+'%)' ;
                    }
                },
                selectedMode: 'single',avoidLabelOverlap: true,minAngle : 10,
		itemStyle : {
                        color : function(params) {
                            return color_ref[tp][kp][params.name];
                        }
                },
                emphasis: {
                    itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                    },
                    label: {
                        show: true,
                        fontSize: '15',
                        fontWeight: 'bold'
                    }
                },
                label: {
                    show: false,
                    position: 'center'
                },
                labelLine: {
                    show: false
                }
                },
			],*/
		}
		}
	})
	}

        init(view) {
            let kp = this._kpi,
                tp = this._type
                view.showProgress();
                view.disable();
                components['bills'].push({cmp : 'bill:vue1:'+kp+':'+tp, data : getBillsChartData(tp+'_'+kp+'_split').config.id});

                getBillsChartData(tp+'_'+kp+'_split').waitData.then((d) => {
			            view._isDataLoaded = 1;
                        view.parse(getBillsChartData(tp+'_'+kp+'_split'));
                        view.enable();
                        view.hideProgress();

                });

                view.data.attachEvent("onStoreLoad", function () {
                                updateChartReady('bill:vue1:'+kp+':'+tp);
                });

        }

}
