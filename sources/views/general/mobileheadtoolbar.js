/* eslint-disable indent */
import {JetView} from "webix-jet";
import {BarLogoView} from "views/general/loginBarElmt";
import {gconfig, getPeriod} from "models/utils/general/boot";
export default class MobileHeadToolBar extends JetView{
        
	config(){
        return {
            view: "toolbar",
            id : "loginbar",
	    margin: 2,
            css : {"background-color" : "#000"}, 
            margin:5,
            elements : [
                { 
                    view: "icon",
                    icon: "mdi mdi-menu",
                    width : 35,
                    click: function(){
                        if($$("top:menu").config.hidden) {
                            $$("top:menu").show();
                        }
                        else  $$("top:menu").hide();
                        webix.storage.session.put("mobileMenuhide", $$("top:menu").config.hidden);
                        gconfig['mobileMenuhide'] = $$("top:menu").config.hidden;
                    }
                },
               /* {
                    template : "<img src='images/orange.jpg' style='margin:0px;width:30px;height:30px'>",	    
                    borderless : true,
                    css : 'logo',
                    //width : 30
                    //width : 55//ressource_ref[this._src]['width']
                },
                {
                    template : "<img src='images/krill.png' style='margin:0px;width:30px;height:30px'>",	    
                    borderless : true,
                    css : 'logo',
                    padding : 4,
                    //width : 35//ressource_ref[this._src]['width']
                },*/
               // {view: "label", id : "dashtitle",label : "<span style='color:#fff'></span>", width : 50},
//		{resize : true},
                {view : "label", id : "title", align : "center"},
		//{resize : true},
		{template : '<span class="vertical-line"></span>', width : 0.4, height : 30},
		{
			view : "icon",icon : "mdi mdi-calendar-check",align : "left", id : "period", popup : 'filterelmt:popup:period'
		},
                {
                    view: "icon",
                    icon: "mdi mdi-filter",
		    align : "left",
		    width : 25, height : 25,
                    click: function(){
                        if( $$("general:filt_menu").config.hidden){
                                                $$("general:filt_menu").show();
                                              }
                                              else
                                                $$("general:filt_menu").hide();
                    }
                },
                {
                    view: "icon",
                    icon: "mdi mdi-logout",
                    css : "webix_transparent acc_butt",
		    align : "left",
		    click : function() {
                        webix.confirm({
                                title:"Confirmation",
                                ok:"Oui",
                                cancel:"Non",
                                text:"Voulez-vous vous déconnecter ?"
                        }).then(() => {
                                gconfig["app"].show("/logout");
                        });

                    },
		    width : 25, height : 25
                },
                //{width : 10}
            ]

        }
    }

    init() {
	 this.ui(
		 {
			 view : 'popup', id : 'filterelmt:popup:period', body : {template : 'Period : '+getPeriod()['d1']+' - '+getPeriod()['d2'] , autoheight : true}, maxWidth : 250,
			 css : "filter_tooltip"
		 }
	 ) 
        /*var app = this;
        this._jetFiltMenu = this.ui(FilterMenuView);
        if(gconfig["home"]["screenType"] != "large" && gconfig["home"]["screenType"] != "medium") {

			var menu = webix.ui({

							view : "contextmenu", data : [{'id':'logout', 'value' : '<span class ="mdi mdi-logout"></span>deconnexion'}] ,
							click : function(id) {
								if (id == 'logout') {
										app.show("/logout");
								}
							}
			});
			webix.event($$("acc_id").$view, "click", function(ev){

                menu.setContext(webix.$$(ev.target));
                menu.show(ev.target);
                }
                );	
		}*/
	}
}
