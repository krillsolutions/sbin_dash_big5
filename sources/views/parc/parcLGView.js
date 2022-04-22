import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import { components} from "models/referential/genReferentials";
import { getParcChartData, getFiterDate} from "models/data/parc/data";
import { kFormatter, updateChartReady,getScreenType } from "models/utils/home/utils";
export default class ParcLGView extends JetView{


	config() {

        let config =  {
			view : 'echarts-grid-dataset',
            id : 'parc:vue1:lgst',
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
                        text : 'Par status',
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
                    dimensions : ['status', 'qty']
                }
            ],		
			series : [
				{
					type : 'pie',
					radius: ['40%', '50%'],
					minAngle : 10,
					datasetIndex : 0,label : {show : false},
					tooltip : {trigger : 'item',show : true, formatter: function(params) { return params.name+': '+kFormatter(params.data.qty) +' ('+params.percent+'%)'  }},
                    selectedMode: 'single',avoidLabelOverlap: false,
                    encode : {itemName : 'status', value : 'qty', tooltip : 'qty'},
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

                $$("parc:vue1:lgst").showProgress();
                $$("parc:vue1:lgst").disable();
                components['parc'].push({cmp : "parc:vue1:lgst", data : getParcChartData('parc_lg').config.id});
                getParcChartData('parc_lg').waitData.then((d) => {
			$$("parc:vue1:lgst")._isDataLoaded = 1;
                        $$("parc:vue1:lgst").parse(getParcChartData('parc_lg'));
                        $$("parc:vue1:lgst").enable();
                        $$("parc:vue1:lgst").hideProgress();

                });

                $$("parc:vue1:lgst").data.attachEvent("onStoreLoad", function () {
                                updateChartReady("parc:vue1:lgst");
                });

        }

}
