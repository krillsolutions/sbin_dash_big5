import {JetView} from "webix-jet";
import {userData} from "models/data/userSession";
import {ressource_ref} from "models/referential/genReferentials";
import {gconfig} from "models/utils/general/boot";
export class BarUserView extends JetView {

        constructor(app,name,src) {

                super(app,name);

                this._src = src;
        }
	
	config() {

		const name = userData.info.name;
		var config = { view:"button"};
		var ap = this;
		var obj = this;
		config['type'] = ressource_ref[this._src]['type'];

		if (config['type'] == 'iconTop' ) config['icon'] = ressource_ref[this._src]['ress'];
		else config[config['type']] = ressource_ref[this._src]['ress'];

		if (typeof ressource_ref[this._src]['label'] == 'undefined') config['label'] = name;
		else config['label'] = ressource_ref[this._src]['label'];

		config['css'] = ressource_ref[this._src]['css'];

		config['autowidth'] = true;

		if (this._src == 'logout') config['click'] = function() {
			webix.confirm({
				title:"Confirmation",
				ok:"Oui",
				cancel:"Non",
				text:"Voulez-vous vous déconnecter ?"
			}).then(() => {
				gconfig["app"].show("/logout");
			});
			
		};
	
		return config;
	}

	init(view) {
		
		view._app = this.app;
	
	}

}
export class BarLogoView extends JetView {

        constructor(app,name,src) {

                super(app,name);

                this._src = src;
        }
        config() {
		let src = this._src;
		let style = "style='float:"+ressource_ref[src]['position']+";margin:0px;width:"+ressource_ref[src]['width']+"px;height:"+ressource_ref[src]['height']+"px'";
                var config = {
			template : "<img src='"+ressource_ref[this._src]['ress']+"'"+style+">",
                        borderless : true,
                        css : {'background-color' : "#000"},
                        width : 54
                };
                return config;
        }
}


