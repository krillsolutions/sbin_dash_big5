import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import { components,dash_titles} from "models/referential/genReferentials";
import { getBillsChartData} from "models/data/bills/data";
import { kFormatter, updateChartReady,getScreenType } from "models/utils/home/utils";
export default class PayMethView extends JetView{


	config() {

        let config =  {
			view : 'echarts-grid-dataset',
            id : 'pay:vue1:meth',
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
                        text : dash_titles['bill'].enc_mode? dash_titles['bill'].enc_mode : "", 
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
                    dimensions : ['method', 'amount']
                }
            ],		
			series : [
				{
					type : 'pie',
					radius: ['40%', '50%'],
					minAngle : 10,
					datasetIndex : 0,//label : {show : false},
					tooltip : {trigger : 'item',show : true, formatter: function(params) { return params.name+': '+kFormatter(params.data.amount) +' ('+params.percent+'%)'  }},
                    selectedMode: 'single',avoidLabelOverlap: false,
                    encode : {itemName : 'method', value : 'amount', tooltip : 'amount'},
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
                }
			],

		}
		}
        if(getScreenType() == 'mobile_rotated') config['maxWidth'] = 190
        return config
	}

        init(view) {

                view.showProgress();
                view.disable();
                components['bills'].push({cmp : "pay:vue1:meth", data : getBillsChartData('pay_meth').config.id});
                getBillsChartData('pay_meth').waitData.then((d) => {
			view._isDataLoaded = 1;
                        view.parse(getBillsChartData('pay_meth'));
                        view.enable();
                        view.hideProgress();

                });

                view.data.attachEvent("onStoreLoad", function () {
                                updateChartReady("pay:vue1:meth");
                });

        }

}
