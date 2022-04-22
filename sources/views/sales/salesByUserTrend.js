import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components, color_ref, dataDesc} from "models/referential/genReferentials";
import { getSalesChartData, getFiterDate} from "models/data/sales/data";
import { getScreenType, kFormatter,updateChartReady , formatter} from "models/utils/home/utils";
import {getDates} from "models/utils/general/utils";
export default class SalesByUserTrendView extends JetView{

	config() {

          return webix.promise.all([color_ref,dataDesc]).then((data) => {
                  let color_ref = data[0];
                  let dataDesc = data[1];
		return {
			view : 'echarts-grid-dataset',
            id : 'sales:vue1:users:trend',
            animation: true,
            beforedisplay : function(dat, conf, echart_obj) {
                let series = [], dataset = [],colors = [], revenues = {};
                if(dat.length == 0) return;	
                let users = dat.map(d => d.user).filter((d,i,ar) => ar.indexOf(d) == i);
                let tsplit = (dat[0]._type == 'month_trend')? dat.map(d => d.month).filter((d,i,ar) => ar.indexOf(d) == i) :dat.map(d => d.upd_dt).filter((d,i,ar) => ar.indexOf(d) == i) ;

                tsplit.sort()                

		    

                echart_obj.off('click');
                users.forEach(elm => {
                    if( dat.some(d => d._type == 'month_trend')  ){
                        dataset.push({dimensions : ['month', 'montant'], source : dat.filter(d => (d.user == elm) && d._type == 'month_trend'), isAdded : true});
                        series.push({type : 'bar'/*, itemStyle : {color : color_ref.revenue[elm]  /*function(para) {return color_ref.revenue[para.name]}}*/,stack : 'split', id :'sales_user_trend:'+elm, datasetIndex : dataset.length,barMinHeight: 10, //tooltip : {trigger : 'item'} ,
                        _isStack :true, name : elm/*dataDesc.revenue[elm]*/  , encode : {x : 'month', y : 'montant'} ,gridIndex : 1,barMinHeight: 10,barMaxWidth : 40 
  
                        }
                        );
                    }
                    if(dat.some(d => d._type == 'dt_trend')) {
                        dataset.push({dimensions : ['upd_dt', 'montant'], source : dat.filter(d => (d.user == elm) && d._type == 'dt_trend'), isAdded : true});
                        series.push({type : 'line', smooth : true,lineStyle : {color :color_ref.revenue[elm] },
                      //  itemStyle : {color : color_ref.revenue[elm]},
                        _isStack :true, name : elm/*dataDesc.revenue[elm]*/, enable : {x : 'upd_dt', y : 'montant'}  ,  datasetIndex : dataset.length,gridIndex : 1
                    
                         });
                    }
                    
                    echart_obj.on('click', {seriesId : 'sales_user_trend:'+elm,  seriesType : 'bar'}, (params) => { 
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
			    SalesByUserTrendView.filterHandler(params)
		    });
                });
                
                conf.series = conf.series.filter(d => (typeof d._isStack == 'undefined'));
                conf.dataset = conf.dataset.filter(d => (typeof d.isAdded == 'undefined'));
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
                          rt+= elm.marker+(dataDesc.revenue[elm.seriesName]? dataDesc.revenue[elm.seriesName] : elm.seriesName)+' : '+ (  formatter(elm.value.montant) )+'<br/>'; 
                          
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
				text : 'Ventes par agent',
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
                    dimensions : ['user', 'montant']
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
                

                $$("sales:vue1:users:trend").showProgress();
                $$("sales:vue1:users:trend").disable();
                $$('sales:vue1:users:trend')._filter_level = 'a';
                $$('sales:vue1:users:trend')._months = [];
                $$('sales:vue1:users:trend')._days = [];
                $$('sales:vue1:users:trend')._current_month = getDates()['d1'].substr(0,7);
                $$('sales:vue1:users:trend')._current_upd_dt = getDates()['d1'];
                components['sales'].push( {cmp : "sales:vue1:users:trend", data :getSalesChartData('salesUser_trend').config.id });
                getSalesChartData('salesUser_trend').waitData.then((d) => {
			$$("sales:vue1:users:trend")._isDataLoaded = 1;
                        $$("sales:vue1:users:trend").parse(getSalesChartData('salesUser_trend'));
                        $$("sales:vue1:users:trend").enable();
                        $$("sales:vue1:users:trend").hideProgress();

                });

                $('button.ui.button.salesParUser_'+periodSplit[1]).on('click',function(){
                    if( $$('sales:vue1:users:trend')._filter_level != 'm')
                            SalesByUserTrendView.filterHandler({data : {month : $$('sales:vue1:users:trend')._current_month }})
        
                })

                $('button.ui.button.salesParUser_'+periodSplit[0]).on('click',function(){
                    if ($$('sales:vue1:users:trend')._filter_level == 'm') {
                                    $$('sales:vue1:users:trend')._filter_level = 'a';
                                    $$('sales:vue1:users:trend').data.filter((d)=> d._type == 'month_trend') ;

                    }
                }
                )                
                $$("sales:vue1:users:trend").data.attachEvent("onStoreLoad", function () {
                                updateChartReady("sales:vue1:users:trend");
                });
                getSalesChartData('salesUser_trend').attachEvent("onBeforeLoad", function () {
                    if($$('top:menu').getSelectedId() == "sales") {
                    $$('sales:vue1:users:trend')._filter_level = 'a';
                    $$('sales:vue1:users:trend')._months = [];
                    $$('sales:vue1:users:trend')._current_month = getDates()['d1'].substr(0,7);
                    $$('sales:vue1:users:trend')._current_upd_dt = getDates()['d1'];
                    }
                });
        }

        static filterHandler(params){
            if(!params.data) return;
            $("button.ui.button.salesParUser_"+periodSplit[1]).addClass('active').siblings().removeClass('active')

            if(!$$('sales:vue1:users:trend')._months) $$('sales:vue1:users:trend')._months = [];
            if(!$$('sales:vue1:users:trend')._months.some(d => d == params.data.month)){
                    let dat = getFiterDate('sales', 'users', params.data.month+'-01', 'dt_trend');
                    $$('sales:vue1:users:trend').showProgress();
                    $$('sales:vue1:users:trend').disable()                        
                    dat.then( (d) => {
                        $$('sales:vue1:users:trend')._months.push(params.data.month);
                        $$('sales:vue1:users:trend')._filter_level = 'm';
                        $$('sales:vue1:users:trend').parse(dat).then(()=>{$$('sales:vue1:users:trend').data.filter((d) =>  {
                            return (d._type != 'month_trend' && (d.period == params.data.month )) ;
                            });});
                        
                    $$('sales:vue1:users:trend')._current_month = params.data.month;
                    $$('sales:vue1:users:trend').enable();
                    $$('sales:vue1:users:trend').hideProgress();
            })}
            else {
                $$('sales:vue1:users:trend')._filter_level = 'm';
                $$('sales:vue1:users:trend')._current_month = params.data.month;
                $$('sales:vue1:users:trend').data.filter((d) =>  {
                    return (d._type != 'month_trend' && (d.period == params.data.month)) ;
                })
            }

        }
}
