import {JetView} from "webix-jet";
import {getKpiColor,getLabel, getTreeData,getScreenType} from "models/utils/home/utils";
import {exportData} from "models/data/menuData";
export default class GraphHeadView extends JetView{

        
	constructor(app, name, kpi, dataid, viewid) {
	
		super(app,name);
		this._kpi = kpi;
		this._did = dataid;
		this._vid = viewid;
	}
	config ()
        {

		var kpi = this._kpi, did = this._did, vid = this._vid;
		//console.log(kpi);
		var temp = getLabel(kpi);
		var fsize = (getScreenType() == 'mobile' || getScreenType() == 'mobile_rotated')? '12px' : '16px';
				return {
					view:"toolbar",id : "head:"+kpi,  type:"clean",height : (getScreenType() == 'mobile' || getScreenType() == 'mobile_rotated')? 30:35,
					cols : [
                            {
				    template : temp/*"<span style='font-size:"+fsize+"'>"+temp+"</span>"*/, borderless : true, type : "header", css : getKpiColor(kpi)//, height : 30
			    },
                            {
								css : getKpiColor(kpi), width : 50 
							},
                        	{
								view: "icon",icon:"mdi mdi-export", css : getKpiColor(kpi), align : "right"
							},
							{
								view: "icon",icon:"mdi mdi-fullscreen", css : getKpiColor(kpi), align : "right"
							}
                          ]
				    }
	}

	init(view) {
	var kp = this._kpi,did = this._did, vid = this._vid;
        var menu = webix.ui({
                        view:"contextmenu",
                        click:function(id){
                               if(id == 'i')
				 					 webix.toPNG($$("head:"+kp).getParentView().getChildViews()[1], { filename: kp+"_export"  });
			       if(id == 'p') {
						webix.toPDF($$("head:"+kp).getParentView().getChildViews()[1], { filename:kp+"_export"  , display:"image"});
					}
				        
			       if (id  == 'c'){
					var filename = kp;
						if ($$("head:"+kp).getParentView().getChildViews()[1].getChildViews().length > 0) {
							let i = 1;
							$$("head:"+kp).getParentView().getChildViews()[1].getChildViews().forEach(element => {

							    if(element._eType == 'treemap') {
							    
							    	webix.toCSV($$(element._expDataId), {filter : (obj) => obj._type == did,  filename : filename+"_"+i, ignore : {_type : true}});	
								i++;
							    } 		
							else{
								if(element.data && typeof element.data.getRange == 'function') {
									 webix.toCSV(element, {filename : filename+"_"+i, ignore : {_type : true}});

									 i++;
								}
							}

							});

						}

						else {
							if ( $$("head:"+kp).getParentView().getChildViews()[1].data && typeof $$("head:"+kp).getParentView().getChildViews()[1].data.getRange == 'function') {
								if($$("head:"+kp).getParentView().getChildViews()[1]._echart_obj) {
								
								let j = 1;
								let dat = ( $$(did) == null)? [...$$("head:"+kp).getParentView().getChildViews()[1].data.getRange().map(d => d._type)] : 
										[...$$(did).data.getRange().map(d => d._type)];
								let types = dat.filter((d,i,ar) => ar.indexOf(d) == i);
								if ($$("head:"+kp).getParentView().getChildViews()[1].config.view == 'echarts-map') {
									webix.toCSV($$("head:"+kp).getParentView().getChildViews()[1], {filename : filename});
									return;
								}

								
								for (const elm of types) {
									
									let cols = {},
									    opts = {filter : (obj) => (typeof obj._type == 'undefined' || obj._type == elm)};

									let serie = $$("head:"+kp).getParentView().getChildViews()[1]._echart_obj.getOption().series.filter(d => ( typeof d._type == 'undefined' || d._type == elm) );
									
									opts.filename = filename+"_"+j;
									if(serie[0].type == "treemap") {
										
										if(serie[0]._type == elm) webix.toCSV($$(did),opts);		
									}
									else {

									let encode = serie.map(d => d.encode);
									for (const el in encode[0]) {
											cols[encode[0][el]] = true;																					
									}
									opts.columns = cols;
									webix.toCSV($$("head:"+kp).getParentView().getChildViews()[1], opts)
									}
									j++;
								}
								}
								else webix.toCSV($$("head:"+kp).getParentView().getChildViews()[1], {filename : filename, ignore : {_type : true}});
							}
							else webix.message("Les données ne peuvent pas être extraites");
						}				       
			       }
			       
                        },
                        data: exportData
        });
                webix.event($$("head:"+this._kpi).$view, "click", function(ev){
                var css = ev.target.className;
                if (css && css.toString().indexOf("mdi-export") != -1){
                menu.setContext(webix.$$(ev.target));
                menu.show(ev.target);
                }
				});	
				let head = {view : "toolbar",id : "head:full:"+kp,  type:"clean", 
					cols : [
						{},
					//	{view: "icon",icon:"mdi mdi-export", align : "right", click : function(ev){menu.setContext(webix.$$(ev));menu.show($$(ev).$view);}}, 
						{view: "icon",icon:"mdi mdi-fullscreen-exit",  align : "right" , click : function(){webix.fullscreen.exit();}}
					] };
				webix.event($$("head:"+this._kpi).$view, "click", function(ev){
					var css = ev.target.className;
					if (css && css.toString().indexOf("mdi-fullscreen") != -1){
						webix.fullscreen.set($$("head:"+kp).getParentView().getChildViews()[1], {head : head});
					}
					});		
	}

}
