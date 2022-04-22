import {JetView} from "webix-jet";

import FilterFormView from "views/general/filters/filterForm";

export default class FilterMenuView extends JetView{

        config(){
                        return {
                                view : "sidemenu",
                                id : "general:filt_menu",
                                position: "right",
                                css : "filt_menu",
                                width: 900,
                                state:function(state){
                                        var toolbarHeight = $$("loginbar").$height;
                                        state.top = toolbarHeight;
                                        state.height -= toolbarHeight;
                                },
                                body: FilterFormView

                   }
           }
}


