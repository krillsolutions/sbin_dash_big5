import { kFormatter, DatakFormatter } from "models/utils/home/utils";
webix.protoUI({
    name:"stats-card",

    defaults:{

        content :
            {
                header : "",
		shortheader : "",
		wseuil : 210,
                meta : "",
                description : "",
                kpi_class : "ui blue huge header",
                kpi_val : "",
                kpi_variation : "small caret up icon",
                kpi_variation_val : ""
            }
        
    },

    $init:function(){
        this._ready_awaits = 1;
        this._is_init = 0;
        webix.extend(this, webix.ProgressBar);
        //webix.extend(this, webix.TooltipControl);
        this.data.provideApi(this,true);
        var obj = this;
	webix.event(window, "resize", function(){
		if (obj._ready_awaits == 2){
			if(obj.data != null) webix.delay(webix.bind(obj.render, obj));
		}
	})
        this.attachEvent("onAfterLoad", function(){
                if (this._ready_awaits == 2){
                        webix.delay(webix.bind(this.render, this));
                        if (this.config.ready){
                                this.config.ready.call(this, this.data);
                                this._ready_awaits = 3;
                        }
                } else this._ready_awaits = 1;

        });
        this.data.attachEvent("onStoreUpdated", function() {
                if (obj._ready_awaits == 2) webix.delay(webix.bind(obj.render, obj));
        });
        webix.delay(webix.bind(this.launch_init, this));

    },

    launch_init : function() {
            if (this._ready_awaits == 1) webix.delay(webix.bind(this._render_once, this));
    },

    _render_once : function(){
        let conf = {...this.defaults};
        conf = $.extend(true, conf, this.config );
        var rootelmt = d3.select(this.$view).append("div");//.style('height','90px');//.style('position', 'absolute').style('left', '1%').style('right', '1%');
	var width = this.$width;
        rootelmt.attr("class", "ui link fluid card");
	rootelmt.style('height', '100%');
        this.rootelmt = rootelmt;
        
            
             var childelm = rootelmt.append("div");//.style('height','90px');
            childelm.classed("content", true);
            var vartionelmt =  childelm.append("div");
            vartionelmt.classed("right floated", true);

            vartionelmt.append("i").classed(conf.content.kpi_variation, true);
            vartionelmt.append("span").attr("class","ui description").html("...");

            childelm.append("div").attr("class","header lab").html( (width < conf.content.seuil)? conf.content.shortheader  : conf.content.header);

            childelm.append("div").attr("class","ui tiny meta desc").html( (width < conf.content.wdseuil)? conf.content.shortdesc :  conf.content.meta);
            childelm.append("p").attr("class", "ui blue header").html("...");
            
        this._ready_awaits = 2;
        webix.delay(webix.bind(this.render, this)); 

    },

    render : function() {

        var root = this.rootelmt;
	var conf = this.config;
        var data = [...this.data.getRange()];
	var data = data.filter((d) => d.kpi == conf._type);
	var width = this.$width;
	var conf = this.config;
	root.select("div div").select('.lab').html(( width < this.config.content.seuil)? this.config.content.shortheader  : this.config.content.header);
	root.select("div div").select('.desc').html((width < conf.content.wdseuil)? conf.content.shortdesc :  conf.content.meta);
        root.selectAll("div div i").data(data)
            .attr('class' , d => (d.var < 0)? 'red small caret down icon' : 'green small caret up icon' );
	
        root.selectAll("div div span").data(data)
            .attr('class', d => (d.var < 0)? 'ui red small header' : 'ui green small header' ).html((d,i) => Math.abs(d.var)+"%");

            root.selectAll("div p").data(data)
            .html((d,i) => ((d.kpi).indexOf("data") < 0)? kFormatter(d.value) : DatakFormatter(d.value));
	
    },
	$setSize:function(x,y){
		if (webix.ui.view.prototype.$setSize.call(this,x,y)){
		}
	},

	$getSize:function(x, y){

		return webix.ui.view.prototype.$getSize.call(this, x, y);
	}	


}, webix.DataLoader, webix.EventSystem, webix.ui.view );
