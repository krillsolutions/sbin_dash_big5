import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components, color_ref,dash_titles, dataDesc} from "models/referential/genReferentials";
import { getRevChartData, getFiterDate} from "models/data/revenue/data";
import { getScreenType, kFormatter,updateChartReady , formatter} from "models/utils/home/utils";
import {getDates} from "models/utils/general/utils";
export default class RevByLineTrendView extends JetView{


	config() {
          
        let typ = 'prod';
          return webix.promise.all([color_ref,dataDesc]).then((data) => {
                  let color_ref = data[0];
                  let dataDesc = data[1];
		return {
			view : 'echarts-grid-dataset',
            id : 'rev:vue1:off:trend:'+typ,
            animation: true,
            beforedisplay : function(dat, conf, echart_obj) {
                let series = [], dataset = [],colors = [], revenues = {};
                dat.sort()
                if(dat.length == 0) return;	 
                let offers = dat.filter(d => true).map(d => d.off_group).filter((d,i,ar) => ar.indexOf(d) == i);
                let tsplit = (dat[0]._type == 'month_trend')? dat.filter(d => true).map(d => d.month).filter((d,i,ar) => ar.indexOf(d) == i) :dat.map(d => d.upd_dt).filter((d,i,ar) => ar.indexOf(d) == i) ;

                tsplit.sort()
                echart_obj.off('click');
                offers.forEach(elm => {
                    if( dat.some(d => d._type == 'month_trend')  ){
                        dataset.push({dimensions : ['month', 'revenue'], source : dat.filter(d => (d.off_group == elm) && (d._type == 'month_trend') ), isAdded : true});
                        series.push({type : 'bar', itemStyle : {color : color_ref.parcOff[elm] } , stack : 'split', id :typ+':rev_off_split_trend:'+elm, datasetIndex : dataset.length,barMinHeight: 10,barMaxWidth : 40,
                        _isStack :true, name : elm  , encode : {x : 'month', y : 'revenue'} ,gridIndex : 1 
                        }
                        );
                    }
                    if(dat.some(d => d._type == 'dt_trend')) {
                        dataset.push({dimensions : ['upd_dt', 'revenue'], source : dat.filter(d => (d.off_group == elm) && d._type == 'dt_trend'), isAdded : true});
                        series.push({type : 'line', smooth : true,lineStyle : {color :color_ref.parcOff[elm] },
                        itemStyle : {color : color_ref.parcOff[elm]},
                        _isStack :true, name : elm, encode : {x : 'upd_dt', y : 'revenue'}  ,  datasetIndex : dataset.length,gridIndex : 1
                    
                         });
                    }

                    
                    echart_obj.on('click', {seriesId : typ+':rev_off_split_trend:'+elm,  seriesType : 'bar'}, (params) => { 
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
			    RevByLineTrendView.filterHandler(params,typ)
		    });
		    colors.push(color_ref.parcOff[elm]);
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
		    bottom : 40,
		    containLabel: true
	    
	    }
	   ],				
       title : {
        text : dash_titles['revenue'].by_prod_trend? dash_titles['revenue'].by_prod_trend : "", 
        right : '50%',
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
                
            let typ = 'prod';
                $$("rev:vue1:off:trend:"+typ).showProgress();
                $$("rev:vue1:off:trend:"+typ).disable();
                $$('rev:vue1:off:trend:'+typ)._filter_level = 'a';
                $$('rev:vue1:off:trend:'+typ)._months = [];
                $$('rev:vue1:off:trend:'+typ)._days = [];
                $$('rev:vue1:off:trend:'+typ)._current_month = getDates()['d1'].substr(0,7);
                $$('rev:vue1:off:trend:'+typ)._current_upd_dt = getDates()['d1'];
                components['revenue'].push( {cmp : "rev:vue1:off:trend:"+typ, data :getRevChartData('rev_off_trend').config.id });
                getRevChartData('rev_off_trend').waitData.then((d) => {
			$$("rev:vue1:off:trend:"+typ)._isDataLoaded = 1;
                        $$("rev:vue1:off:trend:"+typ).parse(getRevChartData('rev_off_trend'));
                        $$("rev:vue1:off:trend:"+typ).enable();
                        $$("rev:vue1:off:trend:"+typ).hideProgress();

                });

                $$("rev:vue1:off:trend:"+typ).data.attachEvent("onStoreLoad", function () {
                                updateChartReady("rev:vue1:off:trend:"+typ);
                });
                getRevChartData('rev_off_trend').attachEvent("onBeforeLoad", function () {
                    if($$('top:menu').getSelectedId() == 'revenue') {
                    $$('rev:vue1:off:trend:'+typ)._filter_level = 'a';
                    $$('rev:vue1:off:trend:'+typ)._months = [];
                    $$('rev:vue1:off:trend:'+typ)._current_month = getDates()['d1'].substr(0,7);
                    $$('rev:vue1:off:trend:'+typ)._current_upd_dt = getDates()['d1'];
                    }
                });
                $('button.ui.button.revByLine_'+periodSplit[1]).on('click',function(){
                            if( $$('rev:vue1:off:trend:'+typ)._filter_level != 'm')
                                    RevByLineTrendView.filterHandler({data : {month : $$('rev:vue1:off:trend:'+typ)._current_month }},typ)
                
                })

                $('button.ui.button.revByLine_'+periodSplit[0]).on('click',function(){
                    if ($$('rev:vue1:off:trend:'+typ)._filter_level == 'm') {
                                    $$('rev:vue1:off:trend:'+typ)._filter_level = 'a';
                                    $$('rev:vue1:off:trend:'+typ).data.filter((d)=> d._type == 'month_trend') ;

                    }
                }
                )
                $$('revByLine').disable()

        }

        ready(view){
            let typ = 'prod'
            $$('revByLine').enable()
            view.attachEvent("onAfterRender",function(){
                if($$('top:menu').getSelectedId() == 'revenue'){
                $$('revByLine').enable()
                view.adjust()
                $$("home:dash").adjust()
                }

            })

        }

        static filterHandler(params,typ){
            if(!params.data) return;

	    $('button.ui.button.revByLine_'+periodSplit[1]).addClass('active').siblings().removeClass('active')
            if(!$$('rev:vue1:off:trend:'+typ)._months) $$('rev:vue1:off:trend:'+typ)._months = [];
            if(!$$('rev:vue1:off:trend:'+typ)._months.some(d => d == params.data.month)){
                    let dat = getFiterDate('line', 'dt_trend', params.data.month+'-01', 'vue2');
                    $$('rev:vue1:off:trend:'+typ).showProgress();
                    $$('rev:vue1:off:trend:'+typ).disable()                        
                    dat.then( (d) => {
                        $$('rev:vue1:off:trend:'+typ)._months.push(params.data.month);
                        $$('rev:vue1:off:trend:'+typ)._filter_level = 'm';
                        $$('rev:vue1:off:trend:'+typ).parse(dat).then(()=>{$$('rev:vue1:off:trend:'+typ).data.filter((d) =>  {
                            return (d._type != 'month_trend' && (d.period == params.data.month ));
                            });});
                        
                    $$('rev:vue1:off:trend:'+typ)._current_month = params.data.month;
                    $$('rev:vue1:off:trend:'+typ).enable();
                    $$('rev:vue1:off:trend:'+typ).hideProgress();
            })}
            else {
                $$('rev:vue1:off:trend:'+typ)._filter_level = 'm';
                $$('rev:vue1:off:trend:'+typ)._current_month = params.data.month;
                $$('rev:vue1:off:trend:'+typ).data.filter((d) =>  {
                    return (d._type != 'month_trend' && (d.period == params.data.month));
                })
            }

        }

}

