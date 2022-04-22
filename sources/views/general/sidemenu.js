import {JetView, plugins} from "webix-jet";
import { menuData } from "models/data/menuData";
import {gconfig} from 'models/utils/general/boot';
export default class SideMenuView extends JetView{
        config(){
        return menuData.waitData.then(() => {
            const menu = {
                view:"sidebar", id:"top:menu",//scroll:"y",
                layout:"y", select:true,autowidth:true,collapsed:gconfig['menucollapsed'],
                on : {
                    onSelectChange:function(id){

                        $$("title").config.label = "<span style='color:#fff;' >"+$$("top:menu").getSelectedItem().value+"</span>";
                         $$("title").refresh();
                           webix.storage.session.put("top.currentmenu",$$("top:menu").getSelectedId(), "",webix.Date.add(new Date(), +1, "minute") );
                    }
                },
                data:menuData
            };
            return menu;
        });

        }

        init(view) {
                this.use(plugins.Menu, "top:menu");
        }
}
