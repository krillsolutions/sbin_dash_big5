import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components, color_ref, dataDesc} from "models/referential/genReferentials";
import { getHomeChartData, getFiterDate} from "models/data/home/data";
import { getScreenType, kFormatter,updateChartReady , formatter} from "models/utils/home/utils";
import {getDates} from "models/utils/general/utils";
export default class RevByTypeTrendView extends JetView{


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
            id : 'rev:vue1:trend',
            animation: true,
            beforedisplay : function(dat, conf, echart_obj) {
                let series = [], dataset = [],colors = [], revenues = {};
                dat.sort()
                if(dat.length == 0) return;	 
                let revs = dat.map(d => d.rev_type).filter((d,i,ar) => ar.indexOf(d) == i);
                let tsplit = (dat[0]._type == 'month_trend')? dat.map(d => d.month).filter((d,i,ar) => ar.indexOf(d) == i) :dat.map(d => d.upd_dt).filter((d,i,ar) => ar.indexOf(d) == i) ;

                tsplit.sort()
                //console.log(revs)
                echart_obj.off('click');
                revs.forEach(elm => {
                    if( dat.some(d => d._type == 'month_trend')  ){
                        dataset.push({dimensions : ['month', 'revenue'], source : dat.filter(d => (d.rev_type == elm) && (d._type == 'month_trend')/* && d._kpi == kpi_type*/ ), isAdded : true});
                        series.push({type : 'bar', itemStyle : {color : color_ref.revenue[elm] } , stack : 'split', id :'rev_split_trend:'+elm, datasetIndex : dataset.length,barMinHeight: 10,barMaxWidth : 40,
                        _isStack :true, name : elm  , encode : {x : 'month', y : 'revenue'} ,gridIndex : 1 
                        }
                        );
                    }
                    if(dat.some(d => d._type == 'dt_trend')) {
                        dataset.push({dimensions : ['upd_dt', 'revenue'], source : dat.filter(d => (d.rev_type == elm) && d._type == 'dt_trend' /*&& d._kpi == kpi_type*/), isAdded : true});
                        series.push({type : 'line', smooth : true,lineStyle : {color :color_ref.revenue[elm] },
                        itemStyle : {color : color_ref.revenue[elm]},
                        _isStack :true, name : elm, encode : {x : 'upd_dt', y : 'revenue'}  ,  datasetIndex : dataset.length,gridIndex : 1
                    
                         });
                    }

                    
                    echart_obj.on('click', {seriesId : 'rev_split_trend:'+elm,  seriesType : 'bar'}, (params) => { 
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
			    RevByTypeTrendView.filterHandler(params)
		    });
		    colors.push(color_ref.revenue[elm]);
            console.log(colors)
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
                    dimensions : ['rev_type', 'revenue']
                }
            ],
	   grid : [
	    {
		    left : 5,
		    //height : '60%',
		    top : 10,
		    right : 5,
		    bottom : 35,
		    containLabel: true
	    
	    }
	   ],				

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
                

                $$("rev:vue1:trend").showProgress();
                $$("rev:vue1:trend").disable();
                $$('rev:vue1:trend')._filter_level = 'a';
                $$('rev:vue1:trend')._months = [];
                $$('rev:vue1:trend')._days = [];
                $$('rev:vue1:trend')._current_month = getDates()['d1'].substr(0,7);
                $$('rev:vue1:trend')._current_upd_dt = getDates()['d1'];
                components['home'].push( {cmp : "rev:vue1:trend", data :getHomeChartData('rev_trend').config.id });
                getHomeChartData('rev_trend').waitData.then((d) => {
			$$("rev:vue1:trend")._isDataLoaded = 1;
                        $$("rev:vue1:trend").parse(getHomeChartData('rev_trend'));
                        $$("rev:vue1:trend").enable();
                        $$("rev:vue1:trend").hideProgress();

                });

                $$("rev:vue1:trend").data.attachEvent("onStoreLoad", function () {
                                updateChartReady("rev:vue1:trend");
                });
                getHomeChartData('rev_trend').attachEvent("onBeforeLoad", function () {
                    if($$('top:menu').getSelectedId() == 'home'){
                    $$('rev:vue1:trend')._filter_level = 'a';
                    $$('rev:vue1:trend')._months = [];
                    $$('rev:vue1:trend')._current_month = getDates()['d1'].substr(0,7);
                    $$('rev:vue1:trend')._current_upd_dt = getDates()['d1'];
                    }
                });
                $('button.ui.button.revByType_'+periodSplit[1]).on('click',function(){
                            if( $$('rev:vue1:trend')._filter_level != 'm')
                                    RevByTypeTrendView.filterHandler({data : {month : $$('rev:vue1:trend')._current_month }})
                
                })

                $('button.ui.button.revByType_'+periodSplit[0]).on('click',function(){
                    if ($$('rev:vue1:trend')._filter_level == 'm') {
                                    $$('rev:vue1:trend')._filter_level = 'a';
                                    $$('rev:vue1:trend').data.filter((d)=> d._type == 'month_trend') ;

                    }
                }
                )
                $$('revByType').disable()
                /*view.attachEvent("onAfterRender",function(){
                    $$('revByType').enable()
                    view.adjust()
                    $$("home:dash").adjust()

                })*/

        }

        ready(view){

            $$('revByType').enable()
            view.attachEvent("onAfterRender",function(){
                if($$('top:menu').getSelectedId() == 'home'){
                console.log("READY")
                $$('revByType').enable()
                view.adjust()
                $$("home:dash").adjust()
                }

            })

        }

        static filterHandler(params){
            if(!params.data) return;

	    $("button.ui.button.revByType_"+periodSplit[1]).addClass('active').siblings().removeClass('active')
            if(!$$('rev:vue1:trend')._months) $$('rev:vue1:trend')._months = [];
            if(!$$('rev:vue1:trend')._months.some(d => d == params.data.month)){
                    let dat = getFiterDate('revenue', 'dt_trend', params.data.month+'-01', 'vue2');
                    $$('rev:vue1:trend').showProgress();
                    $$('rev:vue1:trend').disable()                        
                    dat.then( (d) => {
                        $$('rev:vue1:trend')._months.push(params.data.month);
                        $$('rev:vue1:trend')._filter_level = 'm';
                        $$('rev:vue1:trend').parse(dat).then(()=>{$$('rev:vue1:trend').data.filter((d) =>  {
                            return (d._type != 'month_trend' && (d.period == params.data.month ));
                            });});
                        
                    $$('rev:vue1:trend')._current_month = params.data.month;
                    $$('rev:vue1:trend').enable();
                    $$('rev:vue1:trend').hideProgress();
            })}
            else {
                $$('rev:vue1:trend')._filter_level = 'm';
                $$('rev:vue1:trend')._current_month = params.data.month;
                $$('rev:vue1:trend').data.filter((d) =>  {
                    return (d._type != 'month_trend' && (d.period == params.data.month));
                })
            }

        }

}

