import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components,dash_titles } from "models/referential/genReferentials";
import { getMonChartData } from "models/data/monitor/data";
import { kFormatter,updateChartReady , formatter} from "models/utils/home/utils";

export default class MonByTypeTrendView extends JetView{

	config() {
		return {
			view : 'echarts-grid-dataset',
            id : 'mon:vue1:trend',
            animation: true,
            beforedisplay : function(dat, conf, echart_obj) {
                let series = [], dataset = [];
                let revs = dat.map(d => d.nodetype).filter((d,i,ar) => ar.indexOf(d) == i);
		let dates = dat.map(d => d.upd_dt).filter((d,i,ar) => ar.indexOf(d) == i);
		    dates.sort();
		if(dat.length == 0) return;
                if(dat[0].upd_dt) {
                    dat.sort((a,b) => (a.upd_dt > b.upd_dt) ? 1:-1);
                }
                revs.sort();
                revs.forEach(elm => {
                        dataset.push({dimensions : ['upd_dt','fcount', 'count', 'nodetype'], source : dat.filter(d => (d.nodetype == elm)), isAdded : true});
                        series.push({type : 'line', smooth : true, _isStack :true, name : elm, encode : {x : 'upd_dt', y : 'count', /*seriesName : 'nodetype'*/ }  ,  datasetIndex : dataset.length-1,
			xAxisIndex : 1, yAxisIndex : 1
                    
                         });
                        series.push({type : 'line', smooth : true, _isStack :true, name : elm, encode : {x : 'upd_dt', y : 'fcount'/*, seriesName : 'nodetype'*/ }  ,  datasetIndex : dataset.length-1,
                         });			

                });
                
                //conf.series = conf.series.filter(d => (typeof d._isStack == 'undefined'));
               // conf.dataset = conf.dataset.filter(d => (typeof d.isAdded == 'undefined'));
                if(dataset.length != 0) conf.dataset = dataset;
		//if(colors.length != 0) conf.color = [...colors];
                if(series.length != 0) conf.series = series;//[...series, ...conf.series];
                conf.legend['selectedMode'] = 'single';
		conf.xAxis[0].data = dates;
		   // let sel = {};
		  //  console.log(this);
		//if(this._legend_selected) sel[this._legend_selected] = true;
		  //  conf.legend[]['selected'] = sel;

            },
			options :{
                tooltip : {
                    trigger: "axis",
                    show : true,
                    z : 2 ,
                    formatter : function(param) {
                        let rt = param[0].name+'<br/>';
                        for (const elm of param) {
			  //console.log(param)
                          rt+= elm.marker+elm.seriesName+' : '+ (  formatter(elm.value[elm.dimensionNames[elm.encode['y']]]) )+'<br/>'; 
                          
                        }
                        return rt;
                        
    
                    },
                    backgroundColor: 'rgba(245, 245, 245, 0.8)',
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 10,
                    textStyle: {
                        color: '#000'
                    },
                    position: function (pos, params, el, elRect, size) {
                        var obj = {top: 10};
                        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                        return obj;
                    }			
                },
				legend : {show : true, itemGap : 20, top : '20', type : 'scroll'/*, orient : "vertical", top : '40', right : '20%'*/},
				
					title : [
			                              {
                        		                text : dash_titles['monitor'].files? dash_titles['monitor'].files : "",
                                        		left : '50%',
                    					textAlign: 'center',
                    					textStyle : {
                        					fontSize : 12
                    					},
							top : 35
                                		      },
                                                      {
                                                        text : dash_titles['monitor'].lines? dash_titles['monitor'].lines : "",
                                                        left : '50%',
                                                        textAlign: 'center',
                                                        textStyle : {
                                                                fontSize : 12
                                                        },
							top : '51%'
                                                      }

					
					]
				
				,
			
            dataset : [
            ],
           grid : [{
                left : 5,
                containLabel: true,
		top : 50,
		height : '38%'
            }, {left : 5, containLabel: true, bottom : 40, top : '60%'}],				
            dataZoom: [
                {
                    type: 'inside',
                    start: 75,
                    end: 100
                },
                {
                    show: true,
                    type: 'slider',
                    top: '45%',
                    start: 75,
                    end: 100

                },
                {
                    type: 'inside',
                    start: 75,
		    xAxisIndex : 1,
                    end: 100
                },
                {
                    show: true,
                    type: 'slider',
                    bottom: 5,
		    xAxisIndex : 1,
                    start: 75,
                    end: 100
                }
		    
            ],
		xAxis: [
               {
                    axisLabel: {show: true},axisTick: {show: true},type : 'category'
                },
               {
		       axisLabel: {show: true},axisTick: {show: true},type : 'category', gridIndex : 1
                },			
			],
			yAxis: [
                {
				type: 'value',
				 axisLabel: {
                        formatter : function(val, ind){
                            return kFormatter(val);
                        }
    				},
    				splitLine: {
        				show: true
    				}
			},
                {
                                type: 'value',
                                 axisLabel: {
                        formatter : function(val, ind){
                            return kFormatter(val);
                        }
                                },
                                splitLine: {
                                        show: true
                                }, gridIndex : 1
                        }				
			],			
			series : [

            ],
		
		}
		}
	}
//	   })
//	}

        init(view) {
                

                $$("mon:vue1:trend").showProgress();
                $$("mon:vue1:trend").disable();
                
                components['monitor'].push( {cmp : "mon:vue1:trend", data :getMonChartData('line_trend').config.id });
                getMonChartData('line_trend').waitData.then((d) => {
			$$("mon:vue1:trend")._isDataLoaded = 1;
                        $$("mon:vue1:trend").parse(getMonChartData('line_trend'));
                        $$("mon:vue1:trend").enable();
                        $$("mon:vue1:trend").hideProgress();

                });

                $$("mon:vue1:trend").data.attachEvent("onStoreLoad", function () {
                                updateChartReady("mon:vue1:trend");
                });
        }

}
