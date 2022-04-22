import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components, color_ref, dash_titles,dataDesc} from "models/referential/genReferentials";
import { getBillsChartData, getFiterDate} from "models/data/bills/data";
import { getScreenType, kFormatter,updateChartReady , formatter} from "models/utils/home/utils";
import {getDates} from "models/utils/general/utils";
export default class BillByOffTrendView extends JetView{


    constructor(app,name,kpi) {

        super(app,name);
        this._kpi = kpi;


    }

	config() {
          
        let kpi_type = this._kpi
          return webix.promise.all([color_ref,dataDesc]).then((data) => {
                  let color_ref = data[0];
                  let dataDesc = data[1];
		return {
			view : 'echarts-grid-dataset',
            id : 'bill:vue1:off:trend:'+kpi_type,
            animation: true,
            beforedisplay : function(dat, conf, echart_obj) {
                let series = [], dataset = [],colors = [], revenues = {};
                dat.sort()
                if(dat.length == 0) return;	 
                let offers = dat.map(d => d.off_group).filter((d,i,ar) => ar.indexOf(d) == i);
                let tsplit = (dat[0]._type == 'month_trend')? dat.map(d => d.month).filter((d,i,ar) => ar.indexOf(d) == i) :dat.map(d => d.upd_dt).filter((d,i,ar) => ar.indexOf(d) == i) ;

                tsplit.sort()
                echart_obj.off('click');
                offers.forEach(elm => {
                    if( dat.some(d => d._type == 'month_trend')  ){
                        dataset.push({dimensions : ['month', 'revenue'], source : dat.filter(d => (d.off_group == elm) && (d._type == 'month_trend')), isAdded : true});
                        series.push({type : 'bar', itemStyle : {color : color_ref.parcOff[elm] } , stack : 'split', id :'parc_off_split_trend:'+kpi_type+elm, datasetIndex : dataset.length,barMinHeight: 10,barMaxWidth : 40,
                        _isStack :true, name : elm  , encode : {x : 'month', y : 'revenue'} ,gridIndex : 1 
                        }
                        );
                    }
                    if(dat.some(d => d._type == 'dt_trend')) {
                        dataset.push({dimensions : ['upd_dt', 'revenue'], source : dat.filter(d => (d.off_group == elm) && d._type == 'dt_trend' /*&& d._kpi == kpi_type*/), isAdded : true});
                        series.push({type : 'line', smooth : true,lineStyle : {color :color_ref.parcOff[elm] },
                        itemStyle : {color : color_ref.parcOff[elm]},
                        _isStack :true, name : elm, encode : {x : 'upd_dt', y : 'revenue'}  ,  datasetIndex : dataset.length,gridIndex : 1
                    
                         });
                    }

                    
                    echart_obj.on('click', {seriesId : 'parc_off_split_trend:'+kpi_type+elm,  seriesType : 'bar'}, (params) => { 
                                        let tp =  ( getScreenType() != 'mobile' && getScreenType() != 'mobile_rotated' )? true : false;
                                        if(!tp) {

                                                let obj = this;
                                                this.executeDoubleClick = setTimeout(function(){ obj._clicked = false; } , 500);
                                                if(this._clicked) {tp = true; obj._clicked = false; clearTimeout(this.executeDoubleClick)  }
                                        }
                                        if(!tp) {
                                                this._clicked = true;
                                                return
                                        }		
			    BillByOffTrendView.filterHandler(params, kpi_type)
		    });
		    colors.push(color_ref.parcOff[elm]);
            //console.log(colors)
                });
                
                conf.series = conf.series.filter(d => (typeof d._isStack == 'undefined'));
                conf.dataset = conf.dataset.filter(d => (typeof d.isAdded == 'undefined'));
                if(dataset.length != 0) conf.dataset = [...conf.dataset, ...dataset];
		        if(colors.length != 0) conf.color = [...colors];
                if(series.length != 0) conf.series =  [...series, ...conf.series];
                conf.legend['selectedMode'] = 'multiple';
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
                          rt+= elm.marker+(dataDesc.revenue[elm.seriesName]?dataDesc.revenue[elm.seriesName] :elm.seriesName )+' : '+ (  formatter(elm.value.revenue) )+'<br/>'; 
                          
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
                       var obj =  {top : 10};
                        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                        return obj;
                    }			
                },
				legend : {show : true, itemGap : 20, bottom : 5, type : 'scroll', textStyle : {fontSize : 10},formatter : function(pr) { return (dataDesc.revenue[pr]? dataDesc.revenue[pr] : pr)  }},
            dataset : [
		                {
                    dimensions : ['off_group', 'revenue']
                }
            ],
	   grid : [
	    {
		    left : 5,
		    //height : '60%',
		    top : 20,
		    right : 5,
		    bottom : 35,
		    containLabel: true
	    
	    }
	   ],				
       title : {
        text : dash_titles['bill'].by_prod_trend? dash_titles['bill'].by_prod_trend : "",
        right : '15%',
        top : 2,
        textAlign: 'center',
        textStyle : {
            fontSize : 12
        }
     },
			xAxis: [
               {
		       axisLabel: {show: true},axisTick: {show: true},type : 'category'//,gridIndex : 1,
                },
			],
			yAxis: [
                {
				type: 'value',
                splitNumber : 3,
			//	gridIndex : 1,
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
			series : [
            		],
		
		}
		}
	   })
	}

        init(view) {
                
                let kpi_type = this._kpi
                $$("bill:vue1:off:trend:"+kpi_type).showProgress();
                $$("bill:vue1:off:trend:"+kpi_type).disable();
                $$('bill:vue1:off:trend:'+kpi_type)._filter_level = 'a';
                $$('bill:vue1:off:trend:'+kpi_type)._months = [];
                $$('bill:vue1:off:trend:'+kpi_type)._days = [];
                $$('bill:vue1:off:trend:'+kpi_type)._current_month = getDates()['d1'].substr(0,7);
                $$('bill:vue1:off:trend:'+kpi_type)._current_upd_dt = getDates()['d1'];
                components['bills'].push( {cmp : "bill:vue1:off:trend:"+kpi_type, data :getBillsChartData(kpi_type+'_offer_trend').config.id });
                getBillsChartData(kpi_type+'_offer_trend').waitData.then((d) => {
			$$("bill:vue1:off:trend:"+kpi_type)._isDataLoaded = 1;
                        $$("bill:vue1:off:trend:"+kpi_type).parse(getBillsChartData(kpi_type+'_offer_trend'));
                        $$("bill:vue1:off:trend:"+kpi_type).enable();
                        $$("bill:vue1:off:trend:"+kpi_type).hideProgress();

                });

                $$("bill:vue1:off:trend:"+kpi_type).data.attachEvent("onStoreLoad", function () {
                                updateChartReady("bill:vue1:off:trend:"+kpi_type);
                });
                getBillsChartData(kpi_type+'_offer_trend').attachEvent("onBeforeLoad", function () {
                    if($$('top:menu').getSelectedId() == 'bills') {
                    $$('bill:vue1:off:trend:'+kpi_type)._filter_level = 'a';
                    $$('bill:vue1:off:trend:'+kpi_type)._months = [];
                    $$('bill:vue1:off:trend:'+kpi_type)._current_month = getDates()['d1'].substr(0,7);
                    $$('bill:vue1:off:trend:'+kpi_type)._current_upd_dt = getDates()['d1'];
                    }
                });
                $('button.ui.button.'+kpi_type+"ParOff_"+periodSplit[1]).on('click',function(){
                            if( $$('bill:vue1:off:trend:'+kpi_type)._filter_level != 'm')
                                    BillByOffTrendView.filterHandler({data : {month : $$('bill:vue1:off:trend:'+kpi_type)._current_month }}, kpi_type)
                
                })

                $('button.ui.button.'+kpi_type+"ParOff_"+periodSplit[0]).on('click',function(){
                    if ($$('bill:vue1:off:trend:'+kpi_type)._filter_level == 'm') {
                                    $$('bill:vue1:off:trend:'+kpi_type)._filter_level = 'a';
                                    $$('bill:vue1:off:trend:'+kpi_type).data.filter((d)=> d._type == 'month_trend') ;

                    }
                }
                )
                $$(kpi_type+'ParOff').disable()
                /*view.attachEvent("onAfterRender",function(){
                    $$(kpi_type+'ParOff').enable()
                    view.adjust()
                    $$("home:dash").adjust()

                })*/

        }

        ready(view){
            let kpi_type = this._kpi
            $$(kpi_type+'ParOff').enable()
            view.attachEvent("onAfterRender",function(){
                if($$('top:menu').getSelectedId() == 'parc'){
                $$(kpi_type+'ParOff').enable()
                view.adjust()
                $$("bills:dash").adjust()
            }

            })

        }

        static filterHandler(params,kpi_type){
           // let kpi_type = this._kpi
            if(!params.data) return;

	    $("button.ui.button."+kpi_type+"ParOff_"+periodSplit[1]).addClass('active').siblings().removeClass('active')
            if(!$$('bill:vue1:off:trend:'+kpi_type)._months) $$('bill:vue1:off:trend:'+kpi_type)._months = [];
            if(!$$('bill:vue1:off:trend:'+kpi_type)._months.some(d => d == params.data.month)){
                      let p = (kpi_type == 'b') ? 'fact' :'pay'
                    let dat = getFiterDate('billing', p, params.data.month+'-01', 'dt_trend');
                    $$('bill:vue1:off:trend:'+kpi_type).showProgress();
                    $$('bill:vue1:off:trend:'+kpi_type).disable()                        
                    dat.then( (d) => {
                        $$('bill:vue1:off:trend:'+kpi_type)._months.push(params.data.month);
                        $$('bill:vue1:off:trend:'+kpi_type)._filter_level = 'm';
                        $$('bill:vue1:off:trend:'+kpi_type).parse(dat).then(()=>{$$('bill:vue1:off:trend:'+kpi_type).data.filter((d) =>  {
                            return (d._type != 'month_trend' && (d.period == params.data.month ));
                            });});
                        
                    $$('bill:vue1:off:trend:'+kpi_type)._current_month = params.data.month;
                    $$('bill:vue1:off:trend:'+kpi_type).enable();
                    $$('bill:vue1:off:trend:'+kpi_type).hideProgress();
            })}
            else {
                $$('bill:vue1:off:trend:'+kpi_type)._filter_level = 'm';
                $$('bill:vue1:off:trend:'+kpi_type)._current_month = params.data.month;
                $$('bill:vue1:off:trend:'+kpi_type).data.filter((d) =>  {
                    return (d._type != 'month_trend' && (d.period == params.data.month));
                })
            }

        }

}

