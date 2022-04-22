import {JetView, plugins} from "webix-jet";
import {BarUserView,BarLogoView} from "views/general/loginBarElmt";
import {gconfig, getPeriod} from "models/utils/general/boot";
export default class HeadBarView extends JetView{
	config(){
		//boot();
			return {
				view:"toolbar",id : 'loginbar',
				height:46,
				css : {"background-color" : "#000"},
				elements:[
					{ 
						view: "icon",
						icon: "mdi mdi-menu",
						click: function(){
								$$("top:menu").toggle();
								gconfig['menucollapsed'] = !gconfig['menucollapsed'];
								webix.storage.session.put('menucollapsed', gconfig['menucollapsed']);
								window.dispatchEvent(new Event('resize'));
						}
					},
					{$subview : new BarLogoView(this.app, "", "ologo")},
                        		{$subview : new BarLogoView(this.app, "", "klogo")},
					{ view:"label",id : "dashtitle", label: "<span style='color:#fff;' ></span>"  },
					{resize : true},
					{view : "label", id : "title", align : "left", label : "<span style='color:#fff;' >Home</span>"},
					{resize : true},
					{template : '<span class="vertical-line"></span>', width : 0.5, height : 30},
					{view : "label", id : "period" , align : "left", minWidth : 240,
					label : "<span style='color:#fff;font-size:14px' class='mdi mdi-calendar-check' > Période : "+getPeriod()['d1']+' - '+getPeriod()['d2'] +"</span>",
						tooltip : function() {return 'Période : '+getPeriod()['d1']+' - '+getPeriod()['d2']}
					},
					{
                        view: "icon",
                        icon: "mdi mdi-filter",
                        click: function(){
                                if( $$("general:filt_menu").config.hidden){
                                                                $$("general:filt_menu").show();
                                                         }
                                                         else
                                                                $$("general:filt_menu").hide();
                        }
                                       },
				       {$subview : new BarUserView(this.app, "", "account")},
				       {$subview : new BarUserView(this.app, "", "logout")}
				]
			}
				
	}

	init(view){

	}
}
