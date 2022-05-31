import { JetView } from "webix-jet";
import * as ech from "views/newHome/echart_cmp_dataset"
import { components } from "../../models/referential/genReferentials";
import { getBillsChartData } from "../../models/data/bills/data";
import { updateChartReady } from "../../models/utils/general/utils";

export default class RecouvreDetView extends JetView {


    constructor(app,name,prod) {

        super(app,name)
        this._prod = prod
    }

    config(){
        
        let prod = this._prod
        return {
            view : "echarts-grid-dataset",
            id : "recouv:vue2:prod:"+prod,
            beforedisplay : function(dat,conf,echart_obj) {
                
                let periods = dat.filter(d => d.product == prod).map(d => d.period).filter((d,i,ar) => ar.indexOf(d) == i)
                let series = [], dataset = []

                let ncolumn =  getColNum(nS)

                let q = Math.floor(nS/ncolumn)
                let c = Math.floor(100/ncolumn)
                let hPart = Math.floor(100/q)
                let k = 0

                dat.sort((a,b) => (b.month < a.month)? 1 : -1 )
                xAxis = dat.filter(d => d.product == prod).map(d => d.month).filter((d,i,ar) => ar.indexOf(d) == i)
                periods.forEach(p => {
                    dataset.push({
                        dimensions : ['month','value']
                    })

                    series.push({
                        type : "line", _type : p, name : p, _kpi : prod, encode : {x : "month", y : "value"}, datasetIndex : dataset.length
                    })                    
                });
                if(series.length != 0) conf.series = [...series,...conf.series]
                if(dataset.length != 0) conf.dataset = [...conf.dataset, ...dataset];
                if(xaxis.length != 0) conf.xAxis[0].data = xaxis

            },
			options :{


                tooltip : {
                    trigger: "axis",
                    show : true,
                    position: function (pos, params, el, elRect, size) {
                        var obj = {top: 10};
                        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                        return obj;
                    },
                    backgroundColor: 'rgba(40, 40, 40, 0.6)',
			        textStyle : {color : '#fff'},
                    z : 100 ,

                    borderWidth: 1,
                    padding: 10,
                   
                },
				legend : {show : true, top : 5, type : 'scroll', textStyle : {fontSize : 10},
                formatter: function(x) {
                    return getMonth(x); 
                    
                }
            },
                
                dataset : [],
	            grid : {
                         left : 35,
                         bottom : 30,
                         containLabel: true
                },	   				
			    xAxis: [
                   {
		           axisLabel: {show: true},axisTick: {show: true},type : 'category', nameLocation: "middle",
                   nameTextStyle: {
                    verticalAlign: "top",
                    lineHeight: 30
                  },
                   name : "Mois d'observation",
                   axisLabel: { 
                    formatter: function(x) {
                        return getMonth(x); 
                        
                    }
                },
                    },
			    ],
			    yAxis: [
                    {
			    	type: 'value',
    		    		splitLine: {
        	    			show: true
    		    		},
                        axisLabel: {
                            formatter: function (value) {
                            return kFormatter(value);
                        }
                    }
			    }
			    ],
                series : []
		
		}
            
        }
    }

    init(view) {

        view.showProgress()
        view.disable()
        components['bills'].push({
            cmp : view.config.id, data : getBillsChartData("prodRec").config.id
        })

        getBillsChartData("prodRec").waitData.then(d => {

            view._isDataLoaded = 1
            view.parse(getBillsChartData('prodRec'))
            view.enable()
            view.hideProgress()
        })
        view.data.attachEvent("onStoreLoad", function () {
            updateChartReady(view.config.id)
        })
    }
}