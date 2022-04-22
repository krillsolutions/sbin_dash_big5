webix.protoUI({
    name:"echarts-grid",

    defaults:{
	options : {
        //backgroundColor : {},
        //tooltip: {},
        title : [],
        grid : [],
        xAxis : [],
        yAxis : [],
        series : []
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
		console.log("onStoreUpdated");
                if (obj._ready_awaits == 2) webix.delay(webix.bind(obj.render, obj));
        });
        webix.delay(webix.bind(this.launch_init, this));

    },

    launch_init : function() {
            if (this._ready_awaits == 1) webix.delay(webix.bind(this._render_once, this));
            //else this._ready_awaits = 2;
    },

    _render_once : function(){

        const conf = $.extend(true, this.defaults, this.config );
//        var rootelmt = d3.select(this.$view).append('div').attr('width' , this.$width).attr('height', this.$height);
      //  console.log(this.$view);
	var obj = this;
	const echart =  echarts.init(obj.$view);
        this._echart_obj = echart;
        //echart.setOption(conf.options);

        this._ready_awaits = 2;
	this._echart_obj.showLoading();
        webix.delay(webix.bind(this.render, this));
        

    },

    render : function() {
        var conf = this.config.options;
        var root = this.rootelmt;
        var data = this.data.getRange();
        let i = 0;
	if (data.length > 0) {
        

        for(let el of conf.xAxis){
                let dim = (el._dim)?el._dim:'name';
                if (el.isDim)
                        if(data[0][el._type]) el.data = data[0][el._type].map((d) => d[dim]);
                i++;
        }
        i =0;
        for(let el of conf.yAxis){
                let dim = (el._dim)?el._dim:'name';
                if (el.isDim)
                        if(data[0][el._type]) el.data = data[0][el._type].map((d) => d[dim]);
                i++;
        }
        i =0;
        for(let el of conf.series){
                let value = (el._value) ? el._value : 'value';
                if(el._type)
                        if(el.type != 'pie') el.data = data[0][el._type].map(d => d[value]);// conf.xAxis[i].data = data[0][el._type].map((d) => d[el._dim]);
                        else el.data = data[0][el._type];
                i++;
        }

        if(this.config.stackChart){

                for(let el of data[0][this.config.stackChart._type]){

                        let dat = { 
                                name : el.name, type : 'bar',  
                                 data : [el.value], tooltip : {trigger : 'item'},// barMaxWidth : 40,
                                 barMinHeight: 10,
                                };
                        if(this.config.stackChart._split) dat['stack'] = 'split';
                        conf.series.push(dat);
                }
        }
        
        	this._echart_obj.setOption(conf, true);
		this._echart_obj.hideLoading();
	}
    },
    $getSize:function(x, y){

         return webix.ui.view.prototype.$getSize.call(this, x, y);
    }
	


}, webix.DataLoader, webix.EventSystem, webix.ui.view );
