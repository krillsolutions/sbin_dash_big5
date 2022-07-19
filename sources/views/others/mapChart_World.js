import {world_promise} from "models/data/geo/files";
webix.protoUI({
    name:"echarts-map-world",

    defaults:{
        options : {
            series : []
        }        
    },
    $init:function(){
        this._ready_awaits = 1;
        this._is_init = 0;
        webix.extend(this, webix.ProgressBar);
        this.data.provideApi(this,true);
        var obj = this;
        this.data.attachEvent("onAfterLoad", function(){
                if (this._ready_awaits == 2){

                        webix.delay(webix.bind(this.render, this));
                        if (this.config.ready){
                                this.config.ready.call(this, this.data);
                                this._ready_awaits = 3;
			}
                } else this._ready_awaits = 1;
        });
        this.data.attachEvent("onStoreUpdated", function() {
                obj._isDataLoaded = 1;
                if (obj._ready_awaits == 2) webix.delay(webix.bind(obj.render, obj));
        });
        webix.delay(webix.bind(this.launch_init, this));
    },
    launch_init : function() {
            if (this._ready_awaits == 1) webix.delay(webix.bind(this._render_once, this));
    },
    _render_once : function(){
        const conf = this.config;
        var obj = this;

        const echart =  echarts.init(obj.$view);

        this._echart_obj = echart;
        //console.log(conf);
        this._isDataLoaded = (typeof this._isDataLoaded == 'undefined')? 0 : this._isDataLoaded;
        this._echart_obj.showLoading();
        world_promise.then(function (geojson) {

            if (!echarts.getMap("world_map")) echarts.registerMap('world_map',geojson);
            
            if(conf.charts_event){
                for (let ev in conf.charts_event){
                    obj._echart_obj.on(ev, conf.charts_event[ev][0], conf.charts_event[ev][1]);
                }
            }
            obj._ready_awaits = 2;
            
            obj._echart_obj.setOption(conf.options,true);
            webix.delay(webix.bind(obj.render, obj));
    })
    },
    render : function() {
        var conf = this.config.options,obj = this;
        //this.data.filter();
        var data = this.data.getRange();
        let dat = [...data];
        let i = 0;
        dat = dat.filter((d) => d._type == obj._current_type);
        dat = dat.filter(d => (d.country && d.country != 'Inconnu' && d.country != "null"  && d.country != ""));
        if (dat.length > 0) {
            
            conf.series[0].data = dat.map((d) => ({ name : d.code.trim(), value : d.value, country : d.country })) ;
            conf.visualMap.max = Number.parseFloat(d3.max(conf.series[0].data.map((d) => d.value)));
            conf.visualMap.min = Number.parseFloat(d3.min(conf.series[0].data.map((d) => d.value)));
            conf.visualMap.min = (conf.visualMap.max == conf.visualMap.min)?1 : conf.visualMap.min;		
            if(typeof this.config.beforedisplay == 'function') this.config.beforedisplay(data, conf);
            this._echart_obj.setOption(conf,true);
            this._echart_obj.hideLoading();
        }
        else{
            conf.visualMap.max = 0;
            conf.visualMap.min  = 0;
            if(this._isDataLoaded == 1) this._echart_obj.hideLoading();
        }
    },
    $getSize:function(x, y){
         return webix.ui.view.prototype.$getSize.call(this, x, y);
    },
    $setSize:function(x,y){
        if (webix.ui.view.prototype.$setSize.call(this,x,y)){
                if(this._ready_awaits == 2)
                    this._echart_obj.resize();
        }
    }
}, webix.DataLoader, webix.EventSystem, webix.ui.view );
