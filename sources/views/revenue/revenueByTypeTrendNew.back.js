import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components, color_ref, dataDesc} from "models/referential/genReferentials";
import { getRevChartData, getFiterDate} from "models/data/revenue/data";
import { getScreenType, kFormatter,updateChartReady , formatter} from "models/utils/home/utils";
import {getDates} from "models/utils/general/utils";
export default class RevByTypeTrendNewView extends JetView{


    constructor(app,name,type){
        super(app,name);
        this._type = type;
    }

	config() {
        let typ = this._type;
          return webix.promise.all([color_ref,dataDesc]).then((data) => {
                  let color_ref = data[0];
                  let dataDesc = data[1];
		return {
			view : 'echarts-grid-dataset',
            id : 'rev:vue1:trend:'+typ,
            animation: true,
	    //minHeight : 200,
            beforedisplay : function(dat, conf, echart_obj) {
                let series = [], dataset = [],colors = [], revenues = {};
                if(dat.length == 0) return;	
                let revs = dat.map(d => d.rev_type).filter((d,i,ar) => ar.indexOf(d) == i);
                let tsplit = (dat[0]._type == 'month_trend')? dat.map(d => d.month).filter((d,i,ar) => ar.indexOf(d) == i) :dat.map(d => d.upd_dt).filter((d,i,ar) => ar.indexOf(d) == i) ;

                tsplit.sort()                

                let xaxis  = []
                if(dat[0]._type == 'month_trend') {
                    dat.sort((a,b) => (b.month < a.month) ? 1 : -1 )
                    xaxis = dat.map(d => d.month).filter(d => typeof d != 'undefined')
                }
                if(dat[0]._type == 'dt_trend') {
                    dat.sort((a,b) => (b.upd_dt < a.upd_dt) ? 1 : -1 )
                    xaxis = dat.map(d => d.upd_dt).filter(d => typeof d != 'undefined')
                }
                if(dat[0]._type == 'slot_trend') {
                    dat.sort((a,b) => (b.slot < a.slot) ? 1 : -1 )
                    xaxis = dat.map(d => d.slot).filter(d => typeof d != 'undefined')
                }
                xaxis = xaxis.filter((d,i,ar) => ar.indexOf(d) == i)

                echart_obj.off('click');
                revs.forEach(elm => {
                    if( dat.some(d => d._type == 'month_trend')  ){
                        dataset.push({dimensions : ['month', 'revenue'], source : dat.filter(d => (d.rev_type == elm) && d._type == 'month_trend'), isAdded : true});
                        series.push({type : 'bar', itemStyle : {color : color_ref.revenue[elm]  /*function(para) {return color_ref.revenue[para.name]}*/},stack : 'split', id :typ+'_rev_split_trend:'+elm, datasetIndex : dataset.length,barMinHeight: 10, //tooltip : {trigger : 'item'} ,
                        _isStack :true, name : elm/*dataDesc.revenue[elm]*/  , encode : {x : 'month', y : 'revenue'} ,gridIndex : 1,barMinHeight: 10,barMaxWidth : 40 
  
                        }
                        );
                    }
                    if(dat.some(d => d._type == 'dt_trend')) {
                        dataset.push({dimensions : ['upd_dt', 'revenue'], source : dat.filter(d => (d.rev_type == elm) && d._type == 'dt_trend'), isAdded : true});
                        series.push({type : 'line', smooth : true,lineStyle : {color :color_ref.revenue[elm] },
                        itemStyle : {color : color_ref.revenue[elm]},
                        _isStack :true, name : elm/*dataDesc.revenue[elm]*/, enable : {x : 'upd_dt', y : 'revenue'}  ,  datasetIndex : dataset.length,gridIndex : 1
                    
                         });
                    }
                    
                    echart_obj.on('click', {seriesId : typ+'_rev_split_trend:'+elm,  seriesType : 'bar'}, (params) => { 
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
			    RevByTypeTrendNewView.filterHandler(params,typ)
		    });
		    colors.push(color_ref.rechargeEC[elm]);
                });
                
                conf.series = conf.series.filter(d => (typeof d._isStack == 'undefined'));
                conf.dataset = conf.dataset.filter(d => (typeof d.isAdded == 'undefined'));
                if(xaxis.length != 0) conf.xAxis[0].data = xaxis
                if(dataset.length != 0) conf.dataset = [...conf.dataset, ...dataset];
		        if(colors.length != 0) conf.color = [...colors];
                if(series.length != 0) conf.series =  [...series, ...conf.series];
                else conf.legend['selectedMode'] = 'multiple';
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
                          rt+= elm.marker+(dataDesc.revenue[elm.seriesName]? dataDesc.revenue[elm.seriesName] : elm.seriesName)+' : '+ (  formatter(elm.value.revenue) )+'<br/>'; 
                          
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
		title : [
				
				/*{
					top :5,
					text : 'Par type',
					//subtext : 'Revenu',
					left : '50%',
                    textAlign: 'center',
                    textStyle : {
                        fontSize : 12
                    }
				},*/
			{
				text : 'Evolution par type',
				//top : '35%',
	                        textStyle : {
                		        fontSize : 12
   	                        },
				left : '50%',
				textAlign: 'center'
			}
			

		],
            dataset : [
		                {
                    dimensions : ['rev_type', 'revenue']
                }
            ],
	   grid : [
		   /*{
                left : 5,
                height : '40%',
                top : 20,
                containLabel: true
            },*/
	    {
		    left : 5,
		    //height : '60%',
		    top : '25',
		    right : 10,
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
                
                let typ = this._type;
                $$("rev:vue1:trend:"+typ).showProgress();
                $$("rev:vue1:trend:"+typ).disable();
                $$('rev:vue1:trend:'+typ)._filter_level = 'a';
                $$('rev:vue1:trend:'+typ)._months = [];
                $$('rev:vue1:trend:'+typ)._days = [];
                $$('rev:vue1:trend:'+typ)._current_month = getDates()['d1'].substr(0,7);
                $$('rev:vue1:trend:'+typ)._current_upd_dt = getDates()['d1'];
                components['revenue'].push( {cmp : "rev:vue1:trend:"+typ, data :getRevChartData('revType_trend_'+typ).config.id });
                getRevChartData('revType_trend_'+typ).waitData.then((d) => {
			$$("rev:vue1:trend:"+typ)._isDataLoaded = 1;
                        $$("rev:vue1:trend:"+typ).parse(getRevChartData('revType_trend_'+typ));
                        $$("rev:vue1:trend:"+typ).enable();
                        $$("rev:vue1:trend:"+typ).hideProgress();

                });

                $('button.ui.button.revParType_'+typ+'_'+periodSplit[1]).on('click',function(){
                    if( $$('rev:vue1:trend:'+typ)._filter_level != 'm')
                            RevByTypeTrendNewView.filterHandler({data : {month : $$('rev:vue1:trend:'+typ)._current_month }}, typ)
        
                })

                $('button.ui.button.revParType_'+typ+'_'+periodSplit[0]).on('click',function(){
                    if ($$('rev:vue1:trend:'+typ)._filter_level == 'm') {
                                    $$('rev:vue1:trend:'+typ)._filter_level = 'a';
                                    $$('rev:vue1:trend:'+typ).data.filter((d)=> d._type == 'month_trend') ;

                    }
                }
                )                
                $$("rev:vue1:trend:"+typ).data.attachEvent("onStoreLoad", function () {
                                updateChartReady("rev:vue1:trend:"+typ);
                });
                getRevChartData('revType_trend_'+typ).attachEvent("onBeforeLoad", function () {
                    if($$('top:menu').getSelectedId() == 'revenue'){
                    $$('rev:vue1:trend:'+typ)._filter_level = 'a';
                    $$('rev:vue1:trend:'+typ)._months = [];
                    $$('rev:vue1:trend:'+typ)._current_month = getDates()['d1'].substr(0,7);
                    $$('rev:vue1:trend:'+typ)._current_upd_dt = getDates()['d1'];
                    }
                });
        }

        static filterHandler(params,typ){
            if(!params.data) return;
            let v = (typ == 'fai')?'vue1' : 'vue2'
            $("button.ui.button.revParType_"+typ+'_'+periodSplit[1]).addClass('active').siblings().removeClass('active')

            if(!$$('rev:vue1:trend:'+typ)._months) $$('rev:vue1:trend:'+typ)._months = [];
            if(!$$('rev:vue1:trend:'+typ)._months.some(d => d == params.data.month)){
                    let dat = getFiterDate('split_trend', 'dt_trend', params.data.month+'-01', v);
                    $$('rev:vue1:trend:'+typ).showProgress();
                    $$('rev:vue1:trend:'+typ).disable()                        
                    dat.then( (d) => {
                        $$('rev:vue1:trend:'+typ)._months.push(params.data.month);
                        $$('rev:vue1:trend:'+typ)._filter_level = 'm';
                        $$('rev:vue1:trend:'+typ).parse(dat).then(()=>{$$('rev:vue1:trend:'+typ).data.filter((d) =>  {
                            return (d._type != 'month_trend' && (d.period == params.data.month )) || d._type == 'rev_split';
                            });});
                        
                    $$('rev:vue1:trend:'+typ)._current_month = params.data.month;
                    $$('rev:vue1:trend:'+typ).enable();
                    $$('rev:vue1:trend:'+typ).hideProgress();
            })}
            else {
                $$('rev:vue1:trend:'+typ)._filter_level = 'm';
                $$('rev:vue1:trend:'+typ)._current_month = params.data.month;
                $$('rev:vue1:trend:'+typ).data.filter((d) =>  {
                    return (d._type != 'month_trend' && (d.period == params.data.month)) || d._type == 'rev_split';
                })
            }

        }
}
