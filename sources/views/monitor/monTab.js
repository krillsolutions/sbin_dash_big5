import {JetView} from "webix-jet";
import { getMonChartData } from "models/data/monitor/data";
import {formatter, getLabel, updateChartReady} from "models/utils/home/utils";
import { components} from "models/referential/genReferentials";
export default class MonCountTab extends JetView {


    config() {

        let ui = {
            view : "datatable",
            id : "monitorTab",
            css : "webix_header_border",
            //scroll : true,
            scrollX:true,
	        resizeColumn:true,
            columns : [
                {id : "node", header : { text : "<span style='font-size: 11px;'>Type</span>", css:{ "text-align":"left" }}  , sort : "string", fillspace : 2, adjust : true,css:{ "text-align":"left" } },
                {id : "src",fillspace : 1, header : { text : "<span style='font-size: 11px;'>Source</span>", css:{ "text-align":"center" }},adjust : true, css:{ "text-align":"center" }, sort : "string"},
                {id : "count_b5", fillspace : 2, header : { text : "<span style='font-size: 11px;'>Fich. Big5</span>", css:{ "text-align":"center" }},adjust : true, css:{ "text-align":"center" }, sort : "int",format : function(value) { return  (value< 0)? "-" :formatter(value);}},
                {id : "count_IN", fillspace : 2, header : { text : "<span style='font-size: 11px;'>Fich. SBIN</span>", css:{ "text-align":"center" }},adjust : true, css:{ "text-align":"center" }, sort : "int",format : function(value) { return  (value< 0)? "-" :formatter(value);}},
		        {id : "fdiff",fillspace : 2, header : { text : "<span style='font-size: 11px;'>Big5 vs OCS</span>",  css:{ "text-align":"center" }},adjust : true, css:{ "text-align":"center" }, sort : "int"},
		        {id : "fcount", header : {text : "<span style='font-size: 11px;'>Fichiers</span>",  css:{ "text-align":"center" }}, adjust : true, css:{ "text-align":"right" }, sort : "int", fillspace : 2, format : function(value) {return formatter(value);}},
                {id : "fvar", header : {text : "<span style='font-size: 11px;'>Var. Fich.(%)</span>",  css:{ "text-align":"center" }}, adjust : true, css:{ "text-align":"right" }, sort : "abs_sort", fillspace : 2, format : function(value) {return formatter(value, "p");}},
		        {id : "count", header : {text : "<span style='font-size: 11px;'>Enregistrement</span>",  css:{ "text-align":"center" }}, adjust : true, css:{ "text-align":"right" }, sort : "int", fillspace : 2, format : function(value) {return formatter(value);}},
                {id : "last_dt",header : {text : "<span style='font-size: 11px;'>last date</span>",  css:{ "text-align":"center" }},minWidth : 160 ,adjust : true,css:{ "text-align":"right" } , sort : "string", fillspace : 2 },
                {id : "var", header : {text : "<span style='font-size: 11px;'>Var. Enreg.(%)</span>",  css:{ "text-align":"center" }}, adjust : true, css:{ "text-align":"right" }, sort : "abs_sort", fillspace : 2, format : function(value) {return formatter(value, "p");}}
            ],
            select : true,
            
        }
        return ui;
    }

    init(view) {

        webix.extend($$("monitorTab"), webix.ProgressBar);
		$$("monitorTab").showProgress();
        $$("monitorTab").disable();
        let dataStore = getMonChartData('mon_tab')
        dataStore.data.scheme({
            $init:function(item){
                if (Math.abs(item.fvar) > 5 && Math.abs(item.fvar) < 10)
                  item.$css = {"background-color" : "#ff9f40", "color" : "white"}
              
                  if (Math.abs(item.fvar) >= 10 && Math.abs(item.fvar) < 20)
                  item.$css = {"background-color" : "#cc6600","color" : "white"}
  
                  if (Math.abs(item.fvar) >= 20)
                  item.$css = {"background-color" : "red", "color" : "white"}
  
  
                  if (Math.abs(item.var) > 5 && Math.abs(item.var) < 10)
                  item.$css = {"background-color" : "#ff9f40", "color" : "white"}
              
                  if (Math.abs(item.var) >= 10 && Math.abs(item.var) < 20)
                  item.$css = {"background-color" : "#cc6600", "color" : "white"}
  
                  if (Math.abs(item.var) >= 20)
                  item.$css = {"background-color" : "red", "color" : "white"}                
              }
        })
       components['monitor'].push({cmp : "monitorTab", data : dataStore.config.id}); 
        dataStore.waitData.then( () => { 
            $$("monitorTab").parse(dataStore);
            view.sort("#var#","desc","abs_sort")
            $$("monitorTab").hideProgress();
            $$("monitorTab").enable();

        });
	$$("monitorTab").attachEvent("onSelectChange", function(){
		var item = this.getSelectedItem();
		$$('mon:vue1:trend')._legend_selected = item.node;
		let ops = $$('mon:vue1:trend')._echart_obj.getOption(),
			doc = ops.legend[0];// { type : "scroll" , selected : {}  };
//		console.log(doc.selected);
		let selected = Object.keys(doc.selected).filter( d => doc.selected[d]  );
//		console.log(selected);
		doc.selected[item.node] = true;
		doc.selected[selected[0]] = false;
		//ops.legend[0].selected  =doc;
		$$('mon:vue1:trend')._echart_obj.setOption({legend : doc});

//		console.log(doc);
	
	})
                view.data.attachEvent("onStoreLoad", function () {
                    view.sort("#var#","desc","abs_sort")
                                updateChartReady("monitorTab");
                });
	

       /* getMonChartData('mon_tab').attachEvent("onAfterLoad", function () {
            if (  $$("top:menu").getSelectedId() == "monitor") {
                $$("monitorTab").parse(getMonChartData('mon_tab'));
                //$$("monitorTab").sort("slot", "desc");
                $$("monitorTab").hideProgress();
                $$("monitorTab").enable();
            }

        })*/
    }
} 
