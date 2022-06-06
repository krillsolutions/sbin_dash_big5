webix.protoUI({
    name:"echarts-grid-dataset",

    defaults:{
	options : {
        //backgroundColor : {},
        //tooltip: {},
        title : [],
        grid : [],
        xAxis : [],
        yAxis : [],
        series : [],
        test : 'test'
	}
        //dataset : {}
        
    },
//myChart.showLoading();
    $init:function(){
        this._ready_awaits = 1;
        this._is_init = 0;
        webix.extend(this, webix.ProgressBar);
        this.data.provideApi(this,true);
        var obj = this;
        this.data.attachEvent("onAfterLoad", function(){
                if (this._ready_awaits == 2){
                        //this._echart_obj.showLoading();
                        webix.delay(webix.bind(this.render, this));
                        //this._echart_obj.hideLoading();
                        if (this.config.ready){
                                this.config.ready.call(this, this.data);
                                this._ready_awaits = 3;
			}
                } else this._ready_awaits = 1;

        });
        this.data.attachEvent("onStoreUpdated", function() {
		this._isDataLoaded = 1;
                if (obj._ready_awaits == 2) webix.delay(webix.bind(obj.render, obj));
        });
        webix.delay(webix.bind(this.launch_init, this));

    },

    launch_init : function() {
            if (this._ready_awaits == 1) webix.delay(webix.bind(this._render_once, this));
            //else this._ready_awaits = 2;
    },

    _render_once : function(){
        let conf = {...this.defaults};
        conf = $.extend(true, conf, this.config );
	this._isDataLoaded = (typeof this._isDataLoaded == 'undefined')? 0 : this._isDataLoaded;
//        var rootelmt = d3.select(this.$view).append('div').attr('width' , this.$width).attr('height', this.$height);
	var obj = this;
	const echart =  echarts.init(obj.$view);
        this._echart_obj = echart;
        if(conf.charts_event){
            for (let ev in conf.charts_event){
                this._echart_obj.on(ev, conf.charts_event[ev][0], conf.charts_event[ev][1]);
            }
        }
        //echart.setOption(conf.options);

        this._ready_awaits = 2;
	this._echart_obj.showLoading();
        webix.delay(webix.bind(this.render, this));
        

    },

    render : function() {
        var conf = this.config.options;
        //if(!this.data) return
        var data = this.data.getRange();
        let dat = [...data];
        let i = 0;
	//if (dat.length > 0) {
       // if(typeof this.config.beforedisplay == 'function') this.config.beforedisplay(dat, conf,this._echart_obj);
        conf.series.filter(d => (typeof d._isStack == 'undefined')).forEach(elm => {
            let dt ;
            if(typeof elm.datasetIndex != 'undefined') {
                 
                dt = dat.filter((d) => d._type == elm._type);
		if(elm._kpi) dt = dt.filter((d) => d._kpi == elm._kpi)
                 conf.dataset[elm.datasetIndex]['source'] = dt;
            }
        });
        if(typeof this.config.beforedisplay == 'function') this.config.beforedisplay(dat, conf,this._echart_obj);
        this._echart_obj.setOption(conf,true);
		
        if((this._isDataLoaded == 1 && dat.length == 0) || (dat.length > 0)) this._echart_obj.hideLoading();
	//}
	/*else {
		if(this._isDataLoaded == 1) {
        		//if(typeof this.config.beforedisplay == 'function') this.config.beforedisplay(dat, conf,this._echart_obj);
        	//	this._echart_obj.setOption(conf);
			this.clearAll();
			//this.refresh();
			this._echart_obj.hideLoading();	
		}
	}*/
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
