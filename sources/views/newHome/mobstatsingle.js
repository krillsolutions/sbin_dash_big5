import { kFormatter, DatakFormatter } from "models/utils/home/utils";
webix.protoUI({
    name:"mob-stats-card",

    defaults:{


//        "height" : 110,
//	"max-width" : 250,
        content :
            {
                header : "",
		shortheader : "",
		wseuil : 210,
                meta : "",
                description : "",
                kpi_class : "ui blue huge header",
                kpi_val : "",
                kpi_variation : "ui tiny caret up icon",
                kpi_variation_val : ""
            }
        
    },

    $init:function(){
        this._ready_awaits = 1;
        this._is_init = 0;
        webix.extend(this, webix.ProgressBar);
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
            //else this._ready_awaits = 2;
    },

    _render_once : function(){

        const conf = $.extend(true, this.defaults, this.config );
//	console.log(this.$height);
        var rootelmt = d3.select(this.$view).append("div");//.style('height','90px');//.style('position', 'absolute').style('left', '1%').style('right', '1%');
	var width = this.$width;
        rootelmt.attr("class", "ui link fluid card");
	rootelmt.style('height', '100%');
        this.rootelmt = rootelmt;
        
            
             var childelm = rootelmt.append("div");//.style('height','90px');
            childelm.classed("content", true);
	   //childelm.style('display','inline-block');
            var vartionelmt =  childelm.append("div");
            vartionelmt.classed("right floated", true);

            vartionelmt.append("i").classed(conf.content.kpi_variation, true);
            vartionelmt.append("span").attr("class","ui description").html("...");
            var head = (width < conf.content.seuil)? conf.content.shortheader  : conf.content.header;
            var desc = (width < conf.content.wdseuil)? conf.content.shortdesc :  conf.content.meta;

	    if(conf.content.moblab) {
		    childelm.append("div").attr("class","tiny header lab").html(conf.content.moblab)
	    }
	    else childelm.append("div").attr("class","tiny header lab").html(head);
            
	    if(conf.content.mobdesc) childelm.append("div").attr("class","ui tiny meta desc").html(conf.content.mobdesc)
	    else childelm.append("div").attr("class","ui tiny meta desc").html(desc);
            //childelm.append("div").attr("class","description").html(conf.content.description);

            childelm.append("p").attr("class", "ui blue tiny header").html("...");
            
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

	if(this.config.content.moblab) root.select("div div").select('.lab').html(this.config.content.moblab)
	else root.select("div div").select('.lab').html(( width < this.config.content.seuil)? this.config.content.shortheader  : this.config.content.header);
	
	if(this.config.content.mobdesc) root.select("div div").select('.desc').html(this.config.content.mobdesc)
	else root.select("div div").select('.desc').html((width < conf.content.wdseuil)? conf.content.shortdesc :  conf.content.meta);
	root.selectAll("div div i").data(data)
            .attr('class' , d => (d.var < 0)? 'ui red tiny caret down icon' : 'ui green tiny caret up icon' );
//            .classed('green large caret up icon', d => d.var >= 0 );
	
        root.selectAll("div div span").data(data)
            .attr('class', d => (d.var < 0)? 'ui red tiny header' : 'ui green tiny header' ).html((d,i) => Math.abs(d.var)+"%");

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
