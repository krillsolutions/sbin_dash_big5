import {JetView} from "webix-jet";
import DateFiltersView from "views/general/filters/dateFilter";
import FiltersView from "views/general/filters/filterElement";
import EventController from "controllers/viewController";
import {filter_ref} from "models/referential/genReferentials";
import {setLabels} from 'models/utils/general/utils';
export default class FilterFormView extends JetView{

        config(){
                let obj = this
                return filter_ref.then((filter_ref) => {

                        let elements = [{$subview :  DateFiltersView}]
                        for(let f in filter_ref['filters']) {
                                if (f == 'period') continue
                                elements.push({$subview : new FiltersView(obj.app,"",f)})
                        }

                        elements.push({
                                cols : [
                                        {
                                                view : "button",
                                                value : "annuler",
                                                id : 'general:cancel_button',
                                                name : "submit",
                                                width: 100,
                                                align: "left"
        
                                        },{},
                                     {
                                        view : "button",
                                        value : "filtrer",
                                        id : 'general:filter_button',
                                        name : "submit",
                                        width: 100,
                                        align: "right",
                                        on :{
                                              onItemClick : function () {
                                                      $$('general:filt_menu').hide();
                                                      setLabels();
                                                      EventController.callEvent('filterButton', 'click');
                                              }
                                      }
                                     }   
                                ]
                        })
/*
                        elements.push({
                                view : "button",
                                value : "filtrer",
                                id : 'general:filter_button',
                                name : "submit",
                                width: 100,
                                align: "right",
                                on :{
                                      onItemClick : function () {
                                              $$('general:filt_menu').hide();
                                              setLabels();
                                              EventController.callEvent('filterButton', 'click');
                                      }
                              }
                              })
                        elements.push({
                                view : "button",
                                value : "annuler",
                                id : 'general:cancel_button',
                                name : "submit",
                                width: 100,
                                align: "left",
                              })
*/
                        return {
                                view : "form",
                                id : "menu:filt_form",
                                width:450,
                                elements : elements/*[
                                                        {$subview :  DateFiltersView},
                                                        {$subview : new FiltersView(this.app, "", 'r')},
                                                        {$subview : new FiltersView(this.app, "",'m')},
                                                        {$subview : new FiltersView(this.app, "",'b')},
                                                        {$subview : new FiltersView(this.app, "",'p')},
                                                        {
                                                          view : "button",
                                                          value : "filtrer",
							  id : 'general:filter_button',
                                                          name : "submit",
                                                          width: 100,
                                                          align: "right",
                                                          on :{
                                                                onItemClick : function () {
                                                                        $$('general:filt_menu').hide();
                                                                        setLabels();
                                                                        EventController.callEvent('filterButton', 'click');
                                                                }
                                                        }
                                                        }

                                ]*/

                   }
	})
}
}
