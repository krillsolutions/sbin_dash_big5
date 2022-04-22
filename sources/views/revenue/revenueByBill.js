import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import { components} from "models/referential/genReferentials";
import { getRevChartData, getFiterDate} from "models/data/revenue/data";
import { kFormatter, updateChartReady,getScreenType } from "models/utils/home/utils";
export default class RevByBillView extends JetView{


	config() {

        let config =  {
			view : 'echarts-grid-dataset',
            id : 'rev:vue1:bill',
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
                        text : 'Par billing type',
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
                    dimensions : ['bill', 'revenue']
                }
            ],		
			series : [
				{
					type : 'pie',
					radius: ['40%', '50%'],
					minAngle : 10,
					datasetIndex : 0,label : {show : false},
					tooltip : {trigger : 'item',show : true, formatter: function(params) { return params.name+': '+kFormatter(params.data.revenue) +' ('+params.percent+'%)'  }},
                    selectedMode: 'single',avoidLabelOverlap: false,
                    encode : {itemName : 'bill', value : 'revenue', tooltip : 'revenue'},
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

                $$("rev:vue1:bill").showProgress();
                $$("rev:vue1:bill").disable();
                components['revenue'].push({cmp : "rev:vue1:bill", data : getRevChartData('rev_bill').config.id});
                getRevChartData('rev_bill').waitData.then((d) => {
			$$("rev:vue1:bill")._isDataLoaded = 1;
                        $$("rev:vue1:bill").parse(getRevChartData('rev_bill'));
                        $$("rev:vue1:bill").enable();
                        $$("rev:vue1:bill").hideProgress();

                });

                $$("rev:vue1:bill").data.attachEvent("onStoreLoad", function () {
                                updateChartReady("rev:vue1:bill");
                });

        }

}
