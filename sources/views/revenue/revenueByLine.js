import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components,color_ref, dataDesc} from "models/referential/genReferentials";
import { getRevChartData} from "models/data/revenue/data";
import { formatter,updateChartReady } from "models/utils/home/utils";
export default class RevByLineView extends JetView{



	config() {

        let typ = 'prod';
        return webix.promise.all([color_ref,dataDesc]).then((data) => {
            let color_ref = data[0];
            let dataDesc = data[1];
		return {
			view : 'echarts-grid-dataset',
            id : 'rev:vue1:line:split:'+typ,
            maxHeight : 145,
            animation: true,
            //minHeight : 95,
            beforedisplay : function(dat, conf) {
                let series = [],colors = [];
                dat.filter(d => true).forEach(elm => {
                    if(elm.off_group) series.push({type : 'bar', stack : 'split', data : [elm.revenue],barMinHeight: 10, barMaxWidth : 40
                     , name : elm.off_group, _isStack : true , itemStyle : {color : color_ref.parcOff[elm.off_group] } }); 
                     colors.push(color_ref.parcOff[elm.off_group]);
                });
                conf.series = conf.series.filter(d => (typeof d._isStack == 'undefined'));
                if(series.length != 0) conf.series = [...series, ...conf.series];
                
                if(colors.length != 0) conf.color = [...colors];
            },
			options :{
				legend : {show : true, bottom : 5,type :'scroll', textStyle : {fontSize : 10} /*, orient : "vertical", top : '40', right : '20%'*/},
             tooltip : {
	
		     	trigger : 'item', show : true, formatter : function(params) { return params.seriesName+"<br/>"+params.marker+formatter(params.value)},
                                position: function (pos, params, el, elRect, size) {
                                        var obj =  {top : pos[1]+10};
                                        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                                                return obj;
                                }		     
	     
	     },
			/*title : [
				
				{
					text : 'Par type de ligne/offre',
					top : 5,
					left : '50%',
                    textAlign: 'center',
                    textStyle : {
                        fontSize : 12
                    }
				}
				
            ],*/
            
            grid : [{
			        height: '80%',
			        top: 10,
                    right: '5',
                    left : '5',
			        containLabel: true
            }],
			xAxis: [
               {
                    type : 'value', _type : 'bill', isDim : false, splitLine: { show : false}, axisLabel: {show: false},axisLine: {show: false},axisTick: {show: false}
                }
			],
			yAxis: [
                {type : 'category', _type : 'bill', isDim : false,
                axisLabel: {
                    interval: 0,show : false
                },axisLine: {show: false},
                splitLine: {
                    show: false
                }},
			],			
			series : [
            ],
		
		}
		}
    })
	}

        init(view) {
                let typ = 'prod';
                $$("rev:vue1:line:split:"+typ).showProgress();
                $$("rev:vue1:line:split:"+typ).disable();
                components['revenue'].push( {cmp : "rev:vue1:line:split:"+typ, data :getRevChartData('rev_line_split').config.id });
                getRevChartData('rev_line_split').waitData.then((d) => {
			$$("rev:vue1:line:split:"+typ)._isDataLoaded = 1;
                        $$("rev:vue1:line:split:"+typ).parse(getRevChartData('rev_line_split'));
                        $$("rev:vue1:line:split:"+typ).enable();
                        $$("rev:vue1:line:split:"+typ).hideProgress();

                });

                $$("rev:vue1:line:split:"+typ).data.attachEvent("onStoreLoad", function () {
                                updateChartReady("rev:vue1:line:split:"+typ);
                });
        }

}
