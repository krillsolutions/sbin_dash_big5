webix.ui.custom_smui= webix.protoUI({
    name:"smui-cmp",
    defaults:{
        content :
            {
                name : "div"
            }
    },
    $init : function(){
        if(!this._cmp) webix.delay(webix.bind(this.__render_once, this));
    },
    __build : function(parent,opts) {
        const name = opts.name?opts.name : "div"
        let elmt = parent.append(name)
        if(opts.view) {
            if(opts.id)
                elmt.attr("class", opts.view+" "+opts.id)
            else
                elmt.attr("class", opts.view)
            
        }
        if(opts.props) {
            for (const prop in opts.props) {                
                elmt.attr(prop, opts.props[prop])                                    
            }
        }
        if(opts.style) {
            for (const s in opts.style) {                
                elmt.style(s, opts.style[s])                                    
            }
        }
        if(opts.children) {
            for (const child of opts.children) {
                this.__build(elmt,child)
            }            
        }
        if(opts.value) elmt.append("span").html(opts.value)
	if(opts.html) elmt.html(opts.html)
        if(opts.events){
            for (const ev in opts.events){
        	elmt.on(ev,opts.events[ev])        
            }
        }	
        this._cmp = elmt
    },
    __render_once : function(){
	    let conf = {...this.config};
            //$.extend(true, conf, this.config )
        var rootelmt = d3.select(this.$view)
        if(!this._cmp) this.__build(rootelmt,conf.content)
        this.callEvent("onAfterRender")
        
    },

    $getSize:function(x, y){

        return webix.ui.view.prototype.$getSize.call(this, x, y);
    }
}, webix.EventSystem, webix.ui.view)
