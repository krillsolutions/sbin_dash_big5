import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import { components} from "models/referential/genReferentials";
import { getParcChartData, getFiterDate} from "models/data/parc/data";
import { kFormatter, updateChartReady,getScreenType } from "models/utils/home/utils";
export default class ParcBTView extends JetView{


    constructor(app, name, type) {

        super(app,name);
        this._type  = type;
    }


	config() {
        let tp = this._type;
        let config =  {
			view : 'echarts-grid-dataset',
            id : 'parc:vue1:billType:'+tp,
            maxHeight : (getScreenType() == 'small' || getScreenType() == 'mobile')? 150 :225,
			options :{
			 tooltip : {
				 trigger : 'axis',show : true,  textStyle : {fontSize : 10},
                                position: function (pos, params, el, elRect, size) {
                                        var obj =  {top : pos[1]+10};
                                        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                                                return obj;
                                }			 
			 },
			legend : {show : true, bottom : '5', type : 'scroll'},animation: true,
			title : [
                {
                        text : 'Par Billing type',
                        top : 5,
                        left : '50%',
                        textAlign: 'center',
                        textStyle : {
						
                            fontSize : 12
                        }
                }				
			],
			grid : [{

                height : '90%',
                left : 5,
                bottom : 5,
                top : 20,
                containLabel: true
            }],
	
            dataset : [
                {
                    dimensions : ['bill_type', 'bill_qty']
                }
            ],		
			series : [
				{
					type : 'pie',
					radius: [0, '50%'],
					minAngle : 10,
					_type : tp,datasetIndex : 0,label : {show : false},
					tooltip : {trigger : 'item',show : true, formatter: function(params) { return params.name+': '+kFormatter(params.data.bill_qty) +' ('+params.percent+'%)'  }},
                    selectedMode: 'single',avoidLabelOverlap: false,
                    encode : {itemName : 'bill_type', value : 'bill_qty', tooltip : 'bill_qty'},
					emphasis: {
						itemStyle: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
						}
					}
                }
			],

		}
		}
        if(getScreenType() == 'mobile_rotated') config['maxWidth'] = 190
        return config
	}

        init(view) {
                let tp = this._type
                view.showProgress();
                view.disable();
                components['parc'].push({cmp : "parc:vue1:billType:"+tp, data : getParcChartData('parc_bill').config.id});
                getParcChartData('parc_bill').waitData.then((d) => {
			view._isDataLoaded = 1;
                        view.parse(getParcChartData('parc_bill'));
                        view.enable();
                        view.hideProgress();

                });

                view.data.attachEvent("onStoreLoad", function () {
                                updateChartReady("parc:vue1:billType:"+tp);
                });

        }

}
