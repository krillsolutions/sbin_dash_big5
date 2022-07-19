import {JetView} from "webix-jet";
import * as echMap from "views/others/mapChart_World";
import {components,dash_titles} from "models/referential/genReferentials";
import { getTraffChartData} from "models/data/traffic/data";
import { kFormatter, updateChartReady } from "models/utils/home/utils";
export default class TraffIntGeoView extends JetView{


    constructor(app,name, kpi) {

        super(app,name);
        this._kpi = kpi;
    }

	config() {
    
        let kp = this._kpi;
        
		return {
			view : 'echarts-map-world',
            id : 'traff:'+kp+':test:geo',
            animation: true,
            beforedisplay : function(dat, conf) {
                let colors = [], func;//interpolateRainbow
                func = d3.scaleSequentialLog(d3.interpolatePuBuGn).domain([conf.visualMap.min, conf.visualMap.max]);
                //func = d3.scaleSequentialLog(d3.interpolateRainbow).domain([conf.visualMap.min, conf.visualMap.max]);
                if(conf.visualMap.max > 99) {

                    for (const elmt of d3.range(conf.visualMap.min,99,10)) {

                        colors.push(func(elmt));
                        
                    }

                    for (const elmt of d3.range(100,conf.visualMap.max,100)) {

                        colors.push(func(elmt));
                        
                    }
                }

                else {
                    for (const elmt of d3.range(conf.visualMap.min,conf.visualMap.max,10)) {

                        colors.push(func(elmt));
                        
                    }
                }
                conf.visualMap.inRange.color = (colors.length > 0) ? colors : ['white','red'];

            },
			options :{

                title : [
				
                    {
                        text : dash_titles['traffic'].int_traff_map? dash_titles['traffic'].int_traff_map : "",
			top : 0,
                        //subtext : 'Revenu',
                        left : '50%',
                        textAlign: 'center',
                        textStyle : {
                            fontSize : 10
                        }
                    }				
                ],

                series : [
                    {
                        type : 'map',map : 'world_map', name : 'Traffic international '+kp, roam : true, nameProperty : 'iso_a3' , _type : kp+'_geo_split', valueProperty : kp+'_traff'                  
                    }
    
                ],
                tooltip: {
                    trigger: 'item',
                    formatter: function(params) {
                        return (params.data)?  params.data.country+': '+kFormatter(params.value) : params.name +" : 0" ; 
                    },
                                position: function (pos, params, el, elRect, size) {
                                        var obj =  {top : pos[1]+10};
                                        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                                                return obj;
                                }			
                },
                dataset : [
                    {
                        source : []
                    },

                ],

                visualMap: {
                    min: 0,
                    max: 0,
		    orient: 'horizontal',
		    right : 0,
                    seriesIndex : 0,
                    text: ['High', 'Low'],
                    realtime: false,
                    calculable: true,
                    formatter : function (value) {
                        return kFormatter(value);
                    },
                    inRange: {
                        //opacity : [0.5, 1],
                       // color: ["#313695", "#4575b4", "#74add1", "#abd9e9", "#e0f3f8", "#ffffbf", "#fee090", "#fdae61", "#f46d43", "#d73027", "#a50026"]//['grey', 'green', 'yellow','orange', 'red']
                    }

                }
		
		}
		}
	}

        init(view) {

            let kp = this._kpi;
                $$('traff:'+kp+':test:geo').showProgress();
                $$('traff:'+kp+':test:geo').disable();
                $$('traff:'+kp+':test:geo')._current_type = kp+'_geo_split';
                components['traffic'].push({cmp : 'traff:'+kp+':test:geo', data : getTraffChartData('int_traffic').config.id});
                getTraffChartData('int_traffic').waitData.then((d) => {
                    $$('traff:'+kp+':test:geo')._isDataLoaded = 1;
                        $$('traff:'+kp+':test:geo').parse(getTraffChartData('int_traffic'));
                        $$('traff:'+kp+':test:geo').enable();
                        $$('traff:'+kp+':test:geo').hideProgress();

                });
                $$('traff:'+kp+':test:geo').data.attachEvent("onStoreLoad", function () {
                                updateChartReady('traff:'+kp+':test:geo');
                });
                $$('traff:'+kp+':test:geo').data.attachEvent("onBeforeLoad", function () {
                    $$('parc:vue1:geo')._current_type = kp+'_geo_split';
                });

        }

}
