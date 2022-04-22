import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components,dash_titles, color_ref, dataDesc} from "models/referential/genReferentials";
import { getParcChartData, getFiterDate} from "models/data/parc/data";
import { getScreenType, kFormatter,updateChartReady , formatter} from "models/utils/home/utils";
import {getDates} from "models/utils/general/utils";
export default class ParcLGTrendView extends JetView{


    /*constructor(app,name,kpi) {

        super(app,name);
        this._kpi = kpi;


    }*/

	config() {
          
        let kpi_type = this._kpi
          return webix.promise.all([color_ref,dataDesc]).then((data) => {
                  let color_ref = data[0];
                  let dataDesc = data[1];
		return {
			view : 'echarts-grid-dataset',
            id : 'parc:vue1:lgst:trend',
            animation: true,
            beforedisplay : function(dat, conf, echart_obj) {
                let series = [], dataset = [],colors = [], revenues = {};
                dat.sort()
                if(dat.length == 0) return;	 
                let offers = dat.map(d => d.status).filter((d,i,ar) => ar.indexOf(d) == i);
                let tsplit = (dat[0]._type == 'month_trend')? dat.map(d => d.month).filter((d,i,ar) => ar.indexOf(d) == i) :dat.map(d => d.upd_dt).filter((d,i,ar) => ar.indexOf(d) == i) ;

                tsplit.sort()
                echart_obj.off('click');
                offers.forEach(elm => {
                    if( dat.some(d => d._type == 'month_trend')  ){
                        dataset.push({dimensions : ['month', 'qty'], source : dat.filter(d => (d.status == elm) && (d._type == 'month_trend')/* && d._kpi == kpi_type*/ ), isAdded : true});
                        series.push({type : 'bar', /*itemStyle : {color : color_ref.parcOff[elm] } ,*/ stack : 'split', id :'parc_lg_trend:'+elm, datasetIndex : dataset.length,barMinHeight: 10,barMaxWidth : 40,
                        _isStack :true, name : elm  , encode : {x : 'month', y : 'qty'} ,gridIndex : 1 
                        }
                        );
                    }
                    if(dat.some(d => d._type == 'dt_trend')) {
                        dataset.push({dimensions : ['upd_dt', 'qty'], source : dat.filter(d => (d.status == elm) && d._type == 'dt_trend' /*&& d._kpi == kpi_type*/), isAdded : true});
                        series.push({type : 'line', smooth : true,//lineStyle : {color :color_ref.parcOff[elm] },
                        //itemStyle : {color : color_ref.parcOff[elm]},
                        _isStack :true, name : elm, encode : {x : 'upd_dt', y : 'qty'}  ,  datasetIndex : dataset.length,gridIndex : 1
                    
                         });
                    }

                    
                    echart_obj.on('click', {seriesId : 'parc_lg_trend:'+elm,  seriesType : 'bar'}, (params) => { 
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
			    ParcLGTrendView.filterHandler(params)
		    });
		    colors.push(color_ref.parcOff[elm]);
            //console.log(colors)
                });
                
                conf.series = conf.series.filter(d => (typeof d._isStack == 'undefined'));
                conf.dataset = conf.dataset.filter(d => (typeof d.isAdded == 'undefined'));
                if(dataset.length != 0) conf.dataset = [...conf.dataset, ...dataset];
		       // if(colors.length != 0) conf.color = [...colors];
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
                    dimensions : ['status', 'qty']
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
        text : dash_titles['parc'].by_prod_trend? dash_titles['parc'].by_prod_trend : "",
        right : '15%',
       // top : 10,
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
                

                $$("parc:vue1:lgst:trend").showProgress();
                $$("parc:vue1:lgst:trend").disable();
                $$('parc:vue1:lgst:trend')._filter_level = 'a';
                $$('parc:vue1:lgst:trend')._months = [];
                $$('parc:vue1:lgst:trend')._days = [];
                $$('parc:vue1:lgst:trend')._current_month = getDates()['d1'].substr(0,7);
                $$('parc:vue1:lgst:trend')._current_upd_dt = getDates()['d1'];
                components['parc'].push( {cmp : "parc:vue1:lgst:trend", data :getParcChartData('parc_lg_trend').config.id });
                getParcChartData('parc_lg_trend').waitData.then((d) => {
			$$("parc:vue1:lgst:trend")._isDataLoaded = 1;
                        $$("parc:vue1:lgst:trend").parse(getParcChartData('parc_lg_trend'));
                        $$("parc:vue1:lgst:trend").enable();
                        $$("parc:vue1:lgst:trend").hideProgress();

                });

                $$("parc:vue1:lgst:trend").data.attachEvent("onStoreLoad", function () {
                                updateChartReady("parc:vue1:lgst:trend");
                });
                getParcChartData('parc_lg_trend').attachEvent("onBeforeLoad", function () {
                    if($$('top:menu').getSelectedId() == 'parc'){
                    $$('parc:vue1:lgst:trend')._filter_level = 'a';
                    $$('parc:vue1:lgst:trend')._months = [];
                    $$('parc:vue1:lgst:trend')._current_month = getDates()['d1'].substr(0,7);
                    $$('parc:vue1:lgst:trend')._current_upd_dt = getDates()['d1'];
                    }
                });
                $('button.ui.button.parcLG_'+periodSplit[1]).on('click',function(){
                            if( $$('parc:vue1:lgst:trend')._filter_level != 'm')
                                    ParcLGTrendView.filterHandler({data : {month : $$('parc:vue1:lgst:trend')._current_month }})
                
                })

                $('button.ui.button.parcLG_'+periodSplit[0]).on('click',function(){
                    if ($$('parc:vue1:lgst:trend')._filter_level == 'm') {
                                    $$('parc:vue1:lgst:trend')._filter_level = 'a';
                                    $$('parc:vue1:lgst:trend').data.filter((d)=> d._type == 'month_trend') ;

                    }
                }
                )
                $$('parcLG').disable()
                /*view.attachEvent("onAfterRender",function(){
                    $$('parcLG').enable()
                    view.adjust()
                    $$("home:dash").adjust()

                })*/

        }

        ready(view){

            $$('parcLG').enable()
            view.attachEvent("onAfterRender",function(){
                if($$('top:menu').getSelectedId() == 'parc'){
                console.log("READY")
                $$('parcLG').enable()
                view.adjust()
                $$("home:dash").adjust()
                }

            })

        }

        static filterHandler(params){
            if(!params.data) return;

	    $("button.ui.button.parcLG_"+periodSplit[1]).addClass('active').siblings().removeClass('active')
            if(!$$('parc:vue1:lgst:trend')._months) $$('parc:vue1:lgst:trend')._months = [];
            if(!$$('parc:vue1:lgst:trend')._months.some(d => d == params.data.month)){
                    let dat = getFiterDate('line', 'dt_trend', params.data.month+'-01', 'vue2');
                    $$('parc:vue1:lgst:trend').showProgress();
                    $$('parc:vue1:lgst:trend').disable()                        
                    dat.then( (d) => {
                        $$('parc:vue1:lgst:trend')._months.push(params.data.month);
                        $$('parc:vue1:lgst:trend')._filter_level = 'm';
                        $$('parc:vue1:lgst:trend').parse(dat).then(()=>{$$('parc:vue1:lgst:trend').data.filter((d) =>  {
                            return (d._type != 'month_trend' && (d.period == params.data.month ));
                            });});
                        
                    $$('parc:vue1:lgst:trend')._current_month = params.data.month;
                    $$('parc:vue1:lgst:trend').enable();
                    $$('parc:vue1:lgst:trend').hideProgress();
            })}
            else {
                $$('parc:vue1:lgst:trend')._filter_level = 'm';
                $$('parc:vue1:lgst:trend')._current_month = params.data.month;
                $$('parc:vue1:lgst:trend').data.filter((d) =>  {
                    return (d._type != 'month_trend' && (d.period == params.data.month));
                })
            }

        }

}

