import "./styles/app.css";
import {plugins} from "webix-jet";
import { JetApp } from "webix-jet";
import session from "models/data/userSession";
export default class App extends JetApp{
	constructor(config){
		const defaults = {
			id 		: APPNAME,
			version : VERSION,
			debug 	: !PRODUCTION,
			start 	: "/top/"+(webix.storage.session.get('top.currentmenu')? webix.storage.session.get('top.currentmenu') : "home" )
		};

		super({ ...defaults, ...config });
		this.use(plugins.User, { model: session /*, afterLogin : "afterLog"*/});
		/*wjet::plugin*/
	}
}

export {App};
