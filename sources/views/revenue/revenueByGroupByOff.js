import {JetView} from "webix-jet";
import * as ech from "views/general/echart_cmp_dataset";
import {components} from "models/referential/genReferentials";
import { getRevChartData} from "models/data/revenue/data";
import { kFormatter,updateChartReady, formatter } from "models/utils/home/utils";

export default class RevGrpOffView extends JetView{

    constructor(app,name,type){
        super(app,name);
        this._type = type;
    }

	config() {

        let typ = this._type;
		return {
			view : 'echarts-grid-dataset',
            id : 'rev:vue1:grptypeoff:'+typ,
            animation: true,
            beforedisplay : function(dat, conf) {
                let series = [];
                if(dat.length != 0) conf.series[0].data = dat;
            },
			options :{
		tooltip : {
                 formatter : function(params) {
                    return params.marker+params.name+" : "+formatter(params.value);
                 },			
             },
             title : [
                {
                        text : 'Par type par offre',
                        top : 0,
                        left : '50%',
                        textAlign: 'center',
                        textStyle : {
						
                            fontSize : 12
                        }
                }				
			],
            label: {
                //normal: {
                    position: 'insideTopLeft',
                    formatter: function (params) {

                        return params.name +' : '+kFormatter(params.value)
                    }
                //}
            },  
			
             series: [{
                type: 'treemap',
             //   visibleMin: 300,
                //data: data.children,
                leafDepth: 1,
                name : "revenu",
		        _type : '_rgrp',
                levels : [{
                    colorMappingBy : 'index',
                    color : ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3']

                },
                {
                    //colorAlpha : [0.3, 1],
                    colorMappingBy : 'index',
                    color : ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3']
                    //colorSaturation : [0.3, 1]
                },

                {
                    //colorAlpha : [0.3, 1],
                    colorMappingBy : 'index',
                    color : ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3']
                    //colorSaturation : [0.3, 1]
                },

                {
                    //colorAlpha : [0.3, 1],
                    colorMappingBy : 'index',
                    color : ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3']
                    //colorSaturation : [0.3, 1]
                }	                			
            ], bottom : 30,
                height : '80%'

            }]
		
		}
		}
	}

        init(view) {
                let typ = this._type;
                $$("rev:vue1:grptypeoff:"+typ).showProgress();
                $$("rev:vue1:grptypeoff:"+typ).disable();
                components['revenue'].push( {cmp : "rev:vue1:grptypeoff:"+typ, data :getRevChartData('rev_grp_type_split_'+typ).config.id });
                getRevChartData('rev_grp_type_split_'+typ).waitData.then((d) => {
			$$("rev:vue1:grptypeoff:"+typ)._isDataLoaded = 1;
                        $$("rev:vue1:grptypeoff:"+typ).parse(getRevChartData('rev_grp_type_split_'+typ));
                        $$("rev:vue1:grptypeoff:"+typ).enable();
                        $$("rev:vue1:grptypeoff:"+typ).hideProgress();

                });

                $$("rev:vue1:grptypeoff:"+typ).data.attachEvent("onStoreLoad", function () {
                                updateChartReady("rev:vue1:grptypeoff:"+typ);
                });

        }

}
