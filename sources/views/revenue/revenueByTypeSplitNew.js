import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components, color_ref, dataDesc} from "models/referential/genReferentials";
import { getRevChartData} from "models/data/revenue/data";
import { getScreenType, kFormatter,updateChartReady , formatter} from "models/utils/home/utils";
export default class RevByTypeSplitNewView extends JetView{


    constructor(app,name,type){
        super(app,name);
        this._type = type;
    }

	config() {

        let tp = this._type;
          return webix.promise.all([color_ref,dataDesc]).then((data) => {
                  let color_ref = data[0];
                  let dataDesc = data[1];
		return {
			view : 'echarts-grid-dataset',
            id : 'rev:vue1:split:'+tp,
            maxHeight : 145,
            animation: true,
	    options :{
		legend : {show : true, itemGap : 20, top : 15, type : 'scroll', textStyle : {fontSize : 10},formatter : function(pr) { return (dataDesc.revenue[pr]? dataDesc.revenue[pr] : pr)  }},
		tooltip : {
				trigger : 'item',
				show : true, 
				formatter: function(params) {  return (dataDesc.revenue[params.name]?dataDesc.revenue[params.name] : params.name )+': '+kFormatter(params.data.revenue) +' ('+params.percent+'%)'  },
				position: function (pos, params, el, elRect, size) {
                       			var obj =  {top : pos[1]+10};
                        		obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                        			return obj;
                    		}
			},
		/*title : [
				
				{
					text : 'Par type',
					left : '50%',
                    textAlign: 'center',
                    textStyle : {
                        fontSize : 12
                    }
				}
			

		],*/
            dataset : [
		                {
                    dimensions : ['rev_type', 'revenue']
                }
            ],
	   grid : [{
                left : 5,
                top : 20,
                containLabel: true
            },
	   ],				

			series : [
                {
		     type : 'pie',
                                        radius: [0, '60%'],
                                        _type : 'rev_split',
                                        minAngle : '10',
                    center: ['50%', '60%'],
                    datasetIndex : 0,gridIndex : 0,
                    label : {
                            show : false,
                        formatter : function(params) {
                            return dataDesc.revenue[params.name];
                        }
                    },
                    //roseType: 'area',
                    //tooltip : {trigger : 'item',show : true, formatter: function(params) {  return dataDesc.revenue[params.name]+': '+kFormatter(params.data.revenue) +' ('+params.percent+'%)'  }},
                    selectedMode: 'single',avoidLabelOverlap: true,
                    encode : {itemName : 'rev_type', value : 'revenue', tooltip : 'revenue'},
                    itemStyle : {
                        color : function(params) {
                            return color_ref.revenue[params.name];
                        }
                    },
                                        emphasis: {
                                                itemStyle: {
                                                                shadowBlur: 10,
                                                                shadowOffsetX: 0,
                                                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                                                }
                                        }
                }
            ]}
	   }})
	}

        init(view) {
                
                let tp = this._type;
                $$("rev:vue1:split:"+tp).showProgress();
                $$("rev:vue1:split:"+tp).disable();
                components['revenue'].push( {cmp : "rev:vue1:split:"+tp, data :getRevChartData('rev_split_'+tp).config.id });
                getRevChartData('rev_split_'+tp).waitData.then((d) => {
			$$("rev:vue1:split:"+tp)._isDataLoaded = 1;
                        $$("rev:vue1:split:"+tp).parse(getRevChartData('rev_split_'+tp));
                        $$("rev:vue1:split:"+tp).enable();
                        $$("rev:vue1:split:"+tp).hideProgress();

                });
		
                view.data.attachEvent("onStoreLoad", function () {
                                updateChartReady("rev:vue1:split:"+tp);
                });	

	}        
}
