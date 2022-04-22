import {JetView} from "webix-jet";
import {filter_ref} from "models/referential/genReferentials";
import EventController from "controllers/viewController";
import {getScreenType} from "models/utils/home/utils";
export default class DateFiltersView extends JetView{

        config(){

                let filter_data = webix.storage.session.get("filter");
                let v = {
                        start : webix.Date.strToDate('%Y-%m-%d')(filter_data['d1']),
                        end : webix.Date.strToDate('%Y-%m-%d')(filter_data['d2'])
                }
           return {

                   localId : "date_filt",  view : "daterangepicker", name : 'datef', value : v, on : { 'onChange' :
                           function(newV, oldV) {
                                    EventController.callEvent( 'filter', 'change', 'datef', newV );

                           }
                   },
      suggest:{
        view:"daterangesuggest",
        body:{
          calendarCount:(getScreenType() == 'mobile')? 1 : 2
        }
      }
           }


        }

        init(view) {

                var type = this._type;
                filter_ref.then((filter_ref) => {
                        this.$$("date_filt").define('label', filter_ref['filters']["period"].desc);
                        this.$$("date_filt").refresh();

                });

        }

}
