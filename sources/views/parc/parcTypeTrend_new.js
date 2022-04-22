import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components, color_ref, dataDesc} from "models/referential/genReferentials";
import { getParcChartData, getFiterDate} from "models/data/parc/data";
import { getScreenType, kFormatter,updateChartReady , formatter} from "models/utils/home/utils";
import {getDates} from "models/utils/general/utils";
export default class ParcByTypeTrendView extends JetView{

/*
    constructor(app,name,kpi) {

        super(app,name);
        this._type = kpi;


    }*/

	config() {
          
        let typ = 'prod'
          return webix.promise.all([color_ref,dataDesc]).then((data) => {
                  let color_ref = data[0];
                  let dataDesc = data[1];
		return {
			view : 'echarts-grid-dataset',
            id : 'parc:vue1:off:trend:'+typ,
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
                        dataset.push({dimensions : ['month', 'qty'], source : dat.filter(d => (d.off_group == elm) && (d._type == 'month_trend')/* && d._kpi == kpi_type*/ ), isAdded : true});
                        series.push({type : 'bar', itemStyle : {color : color_ref.parcOff[elm] } , stack : 'split', id :typ+':parc_off_split_trend:'+elm, datasetIndex : dataset.length,barMinHeight: 10,barMaxWidth : 40,
                        _isStack :true, name : elm  , encode : {x : 'month', y : 'qty'} ,gridIndex : 1 
                        }
                        );
                    }
                    if(dat.some(d => d._type == 'dt_trend')) {
                        dataset.push({dimensions : ['upd_dt', 'qty'], source : dat.filter(d => (d.off_group == elm) && d._type == 'dt_trend' /*&& d._kpi == kpi_type*/), isAdded : true});
                        series.push({type : 'line', smooth : true,lineStyle : {color :color_ref.parcOff[elm] },
                        itemStyle : {color : color_ref.parcOff[elm]},
                        _isStack :true, name : elm, encode : {x : 'upd_dt', y : 'qty'}  ,  datasetIndex : dataset.length,gridIndex : 1
                    
                         });
                    }

                    
                    echart_obj.on('click', {seriesId : typ+':parc_off_split_trend:'+elm,  seriesType : 'bar'}, (params) => { 
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
			    ParcByTypeTrendView.filterHandler(params,typ)
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
                          rt+= elm.marker+(dataDesc.revenue[elm.seriesName]?dataDesc.revenue[elm.seriesName] :elm.seriesName )+' : '+ (  formatter(elm.value.qty) )+'<br/>'; 
                          
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
                    dimensions : ['off_group', 'qty']
                }
            ],
	   grid : [
	    {
		    left : 5,
		    //height : '60%',
		   // top : 20,
		    right : 5,
		    bottom : 35,
		    containLabel: true
	    
	    }
	   ],				
       title : {
        text : "Evolution",
        left : '50%',
        top : 5,
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
                
                let tp = 'prod';
                $$("parc:vue1:off:trend:"+tp).showProgress();
                $$("parc:vue1:off:trend:"+tp).disable();
                $$('parc:vue1:off:trend:'+tp)._filter_level = 'a';
                $$('parc:vue1:off:trend:'+tp)._months = [];
                $$('parc:vue1:off:trend:'+tp)._days = [];
                $$('parc:vue1:off:trend:'+tp)._current_month = getDates()['d1'].substr(0,7);
                $$('parc:vue1:off:trend:'+tp)._current_upd_dt = getDates()['d1'];
                components['parc'].push( {cmp : "parc:vue1:off:trend:"+tp, data :getParcChartData('parc_offer_prod_trend').config.id });
                getParcChartData('parc_offer_prod_trend').waitData.then((d) => {
			$$("parc:vue1:off:trend:"+tp)._isDataLoaded = 1;
                        $$("parc:vue1:off:trend:"+tp).parse(getParcChartData('parc_offer_prod_trend'));
                        $$("parc:vue1:off:trend:"+tp).enable();
                        $$("parc:vue1:off:trend:"+tp).hideProgress();

                });

                $$("parc:vue1:off:trend:"+tp).data.attachEvent("onStoreLoad", function () {
                                updateChartReady("parc:vue1:off:trend:"+tp);
                });
                getParcChartData('parc_offer_prod_trend').attachEvent("onBeforeLoad", function () {
                    if($$('top:menu').getSelectedId() == 'parc') {
                    $$('parc:vue1:off:trend:'+tp)._filter_level = 'a';
                    $$('parc:vue1:off:trend:'+tp)._months = [];
                    $$('parc:vue1:off:trend:'+tp)._current_month = getDates()['d1'].substr(0,7);
                    $$('parc:vue1:off:trend:'+tp)._current_upd_dt = getDates()['d1'];
                    }
                });
                $('button.ui.button.parcByType_'+tp+"_"+periodSplit[1]).on('click',function(){
                            if( $$('parc:vue1:off:trend:'+tp)._filter_level != 'm')
                                    ParcByTypeTrendView.filterHandler({data : {month : $$('parc:vue1:off:trend:'+tp)._current_month }}, tp)
                
                })

                $('button.ui.button.parcByType_'+tp+"_"+periodSplit[0]).on('click',function(){
                    if ($$('parc:vue1:off:trend:'+tp)._filter_level == 'm') {
                                    $$('parc:vue1:off:trend:'+tp)._filter_level = 'a';
                                    $$('parc:vue1:off:trend:'+tp).data.filter((d)=> d._type == 'month_trend') ;

                    }
                }
                )
                $$('parcByType_'+tp).disable()
                /*view.attachEvent("onAfterRender",function(){
                    $$('parcByType').enable()
                    view.adjust()
                    $$("home:dash").adjust()

                })*/

        }

        ready(view){
            let tp = 'prod';
            $$('parcByType_'+tp).enable()
            view.attachEvent("onAfterRender",function(){
                if($$('top:menu').getSelectedId() == 'parc'){
                console.log("READY")
                $$('parcByType_'+tp).enable()
                view.adjust()
                $$("home:dash").adjust()
            }

            })

        }

        static filterHandler(params,tp){
            if(!params.data) return;
            let v = (tp == 'fai')? 'vue1' : 'vue2'
	    $("button.ui.button.parcByType_"+tp+"_"+periodSplit[1]).addClass('active').siblings().removeClass('active')
            if(!$$('parc:vue1:off:trend:'+tp)._months) $$('parc:vue1:off:trend:'+tp)._months = [];
            if(!$$('parc:vue1:off:trend:'+tp)._months.some(d => d == params.data.month)){
                    let dat = getFiterDate('type', 'dt_trend', params.data.month+'-01', v);
                    $$('parc:vue1:off:trend:'+tp).showProgress();
                    $$('parc:vue1:off:trend:'+tp).disable()                        
                    dat.then( (d) => {
                        $$('parc:vue1:off:trend:'+tp)._months.push(params.data.month);
                        $$('parc:vue1:off:trend:'+tp)._filter_level = 'm';
                        $$('parc:vue1:off:trend:'+tp).parse(dat).then(()=>{$$('parc:vue1:off:trend:'+tp).data.filter((d) =>  {
                            return (d._type != 'month_trend' && (d.period == params.data.month ));
                            });});
                        
                    $$('parc:vue1:off:trend:'+tp)._current_month = params.data.month;
                    $$('parc:vue1:off:trend:'+tp).enable();
                    $$('parc:vue1:off:trend:'+tp).hideProgress();
            })}
            else {
                $$('parc:vue1:off:trend:'+tp)._filter_level = 'm';
                $$('parc:vue1:off:trend:'+tp)._current_month = params.data.month;
                $$('parc:vue1:off:trend:'+tp).data.filter((d) =>  {
                    return (d._type != 'month_trend' && (d.period == params.data.month));
                })
            }

        }

}

