import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components, color_ref} from "models/referential/genReferentials";
import { getParcChartData, getFiterDate} from "models/data/parc/data";
import { getScreenType,kFormatter,updateChartReady, formatter } from "models/utils/home/utils";
import {getDates} from "models/utils/general/utils";
export default class ParcOperatorsView extends JetView{

	config() {

	  return color_ref.then((color_ref) => {
		return {
			view : 'echarts-grid-dataset',
            id : 'parc:vue1:off:trend',
            animation: true,
            beforedisplay : function(dat, conf, echart_obj) {

                let series = [], dataset = [], colors = [];


                let offers = dat.map(d => d.off_group).filter((d,i,ar) => ar.indexOf(d) == i);
                let tsplit = (dat[0]._type == 'month_trend')? dat.map(d => d.month).filter((d,i,ar) => ar.indexOf(d) == i) :dat.map(d => d.upd_dt).filter((d,i,ar) => ar.indexOf(d) == i) ;

                tsplit.sort()
                //let offers = dat.map(d => d.operator).filter((d,i,ar) => ar.indexOf(d) == i);
                //let days = dat.map(d => d.month).filter((d,i,ar) => ar.indexOf(d) == i);
                //conf.xAxis[0].data = days;
                echart_obj.off('click');
                offers.forEach(elm => {
                    colors.push(color_ref.parcOff[elm]);
                    dataset.push({dimensions : ['month', 'trend'], source : dat.filter(d => (d.operator == elm) && d._type == 'month_trend'), isAdded : true});
                    series.push({type : 'bar', stack : 'split', id :'off_split_trend:'+elm, datasetIndex : dataset.length,barMinHeight: 10, _type : 'month_trend', //tooltip : {trigger : 'item'} ,
                    /*itemStyle : {

						color : function(p) {
							return (p.value.operator)? color_ref.parcOff[p.value.operator] : 'grey';
						}
					},*/
		    itemStyle : {color : color_ref.parcOff[elm] },
                    _isStack :true, name : elm  , encode : {x : 'month', y : 'trend'} , gridIndex : 1});
                    dataset.push({dimensions : ['upd_dt', 'trend'], source : dat.filter(d => (d.off_group == elm) && d._type == 'dt_trend'), isAdded : true});
                    series.push({type : 'line', smooth : true, _isStack :true, name : elm,itemStyle : {color : color_ref.parcOff[elm] }, 
			    enable : {x : 'upd_dt', y : 'trend'} , gridIndex : 1,  datasetIndex : dataset.length, _type : 'dt_trend'});
                    
                    echart_obj.on('click', {seriesId : 'off_split_trend:'+elm,  seriesType : 'bar'}, (params) => { 
		                        let tp =  (getScreenType() != 'mobile' && getScreenType() != 'mobile_rotated')? true : false;
                                        if(!tp) {

                                                let obj = this;
                                                this.executeDoubleClick = setTimeout(function(){ obj._clicked = false; } , 500);
                                                if(this._clicked) {tp = true; obj._clicked = false; clearTimeout(this.executeDoubleClick)  }
                                        }
                                        if(!tp) {
                                                this._clicked = true;
                                                return
                                        }
			    ParcOperatorsView.filterHandler(params)
		    
		    });
                });
                conf.series = conf.series.filter(d => (typeof d._isStack == 'undefined'));
                conf.dataset = conf.dataset.filter(d => (typeof d.isAdded == 'undefined'));
                if(colors.length != 0) conf.color = colors;
                if(dataset.length != 0) conf.dataset = [...conf.dataset, ...dataset];
                if(series.length != 0) conf.series = [...series, ...conf.series];
                conf.xAxis[0].data = [...tsplit];
            },
			options :{
                tooltip : {
                    trigger: "axis",
                    show : true,
                    z : 2 ,
                    formatter : function(param) {
                        let rt = param[0].name+'<br/>';
                        for (const elm of param) {
                          rt+= elm.marker+elm.seriesName+' : '+ (  formatter(elm.value.trend) )+'<br/>'; 
                          
                        }
                        return rt;
                    },
                    position: function (pos, params, el, elRect, size) {
                       var obj =  {top : 10};
                        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                        return obj;
                    }			
                },
				legend : {show : true, itemGap : 20, bottom : '5' /*data : Object.keys(color_ref.parcOff), orient : "vertical", top : '40', right : '20%'*/, type : 'scroll',
					textStyle : {fontSize : 12}
				},
            //color : Object.values(color_ref.parcOff),
			title : [
                {
                    text : 'Evolution du parc',
                   // subtext : 'evolution',
                    left : '50%',
                    textAlign: 'center',
                    textStyle : {
                        fontSize : 12
                    }
                }
				
			],
            dataset : [

                {
                    dimensions : ['off_group', 'qty']
                }


            ],
    			grid: [ {
			        top : 25,  
			        bottom: 35,
                    		right: 10,
                    		left : 5,
			        containLabel: true
			}],
			xAxis: [
               {
                    axisLabel: {show: true},axisTick: {show: true},type : 'category'
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
			}
			],			
			series : [ ],
            graphic : [

                {
                    type: 'group',
                    
                    top : 5,
                    right: '40',
                    onclick : function(params) {

                        if ($$('parc:vue1:off:trend')._filter_level == 'm') {
                            $$('parc:vue1:off:trend').config.options.graphic[0].children[0].style.fill = '#DADEE0';
                            $$('parc:vue1:off:trend').config.options.graphic[1].children[0].style.fill = '#fff';
                            $$('parc:vue1:off:trend')._filter_level = 'a';
                            $$('parc:vue1:off:trend').data.filter((d)=> d._type != 'dt_trend');

                        }

                    },
                    children: [
                        {
                            type: 'rect',
                            z: 100,
                            //id : 'a',
                            left: 'center',
                            top: 'middle',
                            shape: {
                                width: 20,
                                height: 20
                            },
                            style: {
                                fill: '#DADEE0',
                                stroke: '#555',
                                lineWidth: 2,
                                shadowBlur: 8,
                                shadowOffsetX: 3,
                                shadowOffsetY: 3,
                                shadowColor: 'rgba(0,0,0,0.3)'
                            },
                        },
                        {
                            type: 'text',
                            z: 100,
                            left: 'center',
                            top: 'middle',
                            style: {
                                fill: '#333',
                                text: 'Y',
                                font: '12px Microsoft YaHei'
                            }
                        }
                    ]
                },
                {
                    type: 'group',
                   
                    top : 5,
                    right: '15',
                    onclick : function(params) {
                        ParcOperatorsView.filterHandler({data : {month : $$('parc:vue1:off:trend')._current_month }})
                    },
                    children: [
                        {
                            type: 'rect',
                           // id : 'm',
                            z: 100,
                            left: 'center',
                            top: 'middle',
                            shape: {
                                width: 20,
                                height: 20
                            },
                            style: {
                                fill: '#fff',
                                stroke: '#555',
                                lineWidth: 2,
                                shadowBlur: 8,
                                shadowOffsetX: 3,
                                shadowOffsetY: 3,
                                shadowColor: 'rgba(0,0,0,0.3)'
                            }
                        },
                        {
                            type: 'text',
                            z: 100,
                            left: 'center',
                            top: 'middle',
                            style: {
                                fill: '#333',
                                text: 'M',
                                font: '12px Microsoft YaHei'
                            }
                       }
                    ]
                   }
                 ]	
		}
        }}
        )
	}

        init(view) {
                

                $$("parc:vue1:off:trend").showProgress();
                $$("parc:vue1:off:trend").disable();
                $$('parc:vue1:off:trend')._filter_level = 'a';
                $$('parc:vue1:off:trend')._months = [];
                $$('parc:vue1:off:trend')._current_month = getDates()['d1'].substr(0,7);
                components['parc'].push( {cmp : "parc:vue1:off:trend", data :getParcChartData('parc_off_trend').config.id });
                getParcChartData('parc_off_trend').waitData.then((d) => {
			$$("parc:vue1:off:trend")._isDataLoaded = 1;
                        $$("parc:vue1:off:trend").parse(getParcChartData('parc_off_trend'));
                        $$("parc:vue1:off:trend").enable();
                        $$("parc:vue1:off:trend").hideProgress();

                });

                $$("parc:vue1:off:trend").data.attachEvent("onStoreLoad", function () {
                                updateChartReady("parc:vue1:off:trend");
                });
                $$("parc:vue1:off:trend").data.attachEvent("onBeforeLoad", function () {
                    if($$('top:menu').getSelectedId() == 'parc'){
                    $$('parc:vue1:off:trend')._filter_level = 'a';
                    $$('parc:vue1:off:trend')._months = [];
                    $$('parc:vue1:off:trend')._current_month = getDates()['d1'].substr(0,7);
                    }
                });
        }

        static filterHandler(params){
            $$('parc:vue1:off:trend').config.options.graphic[0].children[0].style.fill = '#fff';
            $$('parc:vue1:off:trend').config.options.graphic[1].children[0].style.fill = '#DADEE0';

            if(!$$('parc:vue1:off:trend')._months) $$('parc:vue1:off:trend')._months = [];
            if(!$$('parc:vue1:off:trend')._months.some(d => d == params.data.month)){
                    let dat = getFiterDate('operator', 'vue2', params.data.month+'-01');
                    $$('parc:vue1:off:trend').showProgress();
                    $$('parc:vue1:off:trend').disable()                        
                    dat.then( (d) => {
                        $$('parc:vue1:off:trend')._months.push(params.data.month);
                        $$('parc:vue1:off:trend')._filter_level = 'm';
                        $$('parc:vue1:off:trend').parse(dat).then(()=>{$$('parc:vue1:off:trend').data.filter((d) =>  {
                            return d._type != 'month_trend' && (d.period == params.data.month || d._type == 'op_split');
                            });});
                        
                    $$('parc:vue1:off:trend')._current_month = params.data.month;
                    $$('parc:vue1:off:trend').enable();
                    $$('parc:vue1:off:trend').hideProgress();
            })}
            else {
                $$('parc:vue1:off:trend')._filter_level = 'm';
                $$('parc:vue1:off:trend')._current_month = params.data.month;
                $$('parc:vue1:off:trend').data.filter((d) =>  {
                    return d._type != 'month_trend' && (d.period == params.data.month || d._type == 'op_split');
                })
            }
            
        }
	
}
