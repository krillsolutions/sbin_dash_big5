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
	let obj = this
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
					obj.extractData($$("head:"+kp).getParentView().getChildViews()[1],filename,did)					
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


	extractData(component, filename, did) {
		
		if(!this._count) this._count = 0
		if(component.getChildViews().length> 0) {
			if(!this._count) this._count = 1
			for (const cmp of component.getChildViews()) {
				this.extractData(cmp,filename,did)
				
			}		
		}
		else{
			let filename1 = (this._count > 0)? filename+"_"+this._count : filename 
			if(component._eType == 'treemap') {
							    
				webix.toCSV($$(component._expDataId), {/*filter : (obj) => obj._type == did,*/  filename : filename1, ignore : {_type : true}});	
			}
			else{
				if(component.data && typeof component.data.getRange == 'function') {

					if(component._echart_obj) {
								
						let j = 1;
						let dat = ( $$(did) == null)? [...component.data.getRange().map(d => d._type)] : 
								[...$$(did).data.getRange().map(d => d._type)];
						let types = dat.filter((d,i,ar) => ar.indexOf(d) == i);
						if (component.config.view == 'echarts-map') {
							webix.toCSV(component, {filename : filename1});
							this._count++;
							return
						}

						if( typeof component._echart_obj.getModel().get("grid") != 'undefined' && component._echart_obj.getModel().get("grid").length <= 1 ) {
							webix.toCSV(component, {filename : filename1, ignore : {_type : true}});
							this._count++
							return
						}
						if(types.length == 0){
								let cols = {},
								opts = {};

							let serie = component._echart_obj.getOption().series;
							
							opts.filename = filename1+"_"+j;
							if(serie[0].type == "treemap") {
								
								if(serie[0]._type == elm) webix.toCSV($$(did),opts);		
							}
							else {

							let encode = serie.map(d => d.encode);
							for (const el in encode[0]) {
									cols[encode[0][el]] = true;																					
							}
							opts.columns = cols;
							webix.toCSV(component, opts)
							}
						}
						for (const elm of types) {
							console.log(elm)
							let cols = {},
								opts = {filter : (obj) => (typeof obj._type == 'undefined' || obj._type == elm), ignore : {_type : true}};

							let serie = component._echart_obj.getOption().series.filter(d => ( typeof d._type == 'undefined' || d._type == elm) );
							
							opts.filename = filename1+"_"+j;
							if(serie[0].type == "treemap") {
								
								if(serie[0]._type == elm) webix.toCSV($$(did),opts);		
							}
							else {

							let encode = serie.map(d => d.encode);
							for (const el in encode[0]) {
									cols[encode[0][el]] = true;																					
							}
							opts.columns = cols;
							webix.toCSV(component, opts)
							}
							j++;
						}
						this._count++
						return
					}
					else {
						webix.toCSV(component, {filename : filename1, ignore : {_type : true}});
			                        this._count++
						return
					}
				}
				 return
			}
            
		}
		

	}

}
