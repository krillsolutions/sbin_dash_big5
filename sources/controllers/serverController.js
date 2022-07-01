import { getFilterString } from "models/utils/general/boot";
import HomeServerManager from "models/utils/server/ServerManager";
//import {OMManager, ParcServerManager, RevenueServerManager, TrafficServerManager, MonitorServerManager, WimaxServerManager, SalesServerManager} from "models/utils/server/ServerManager";
//import { TopupManager } from "models/utils/server/ServerManager";
import { controllerConfig } from "controllers/controllerConfig";
export default class ServerController {
  static getData(menu, func, type, params) {
    //console.log(func)
    //console.log(controllerConfig[menu][func])

    // console.log(filter);
    return controllerConfig[menu][func](type, getFilterString(), params);

    /*switch (menu) {
            case 'home':
                console.log(type)
                return HomeServerManager[func](type, getFilter(), params);
                break;
       	    case 'parc' : 
		        return ParcServerManager[func](type, getFilter(), params);
                break;
            case 'revenue' : 
		        return RevenueServerManager[func](type, getFilter(), params);
                break; 
            case 'traffic' : 
		        return TrafficServerManager[func](type, getFilter(), params);
                break; 
            case 'recharge' : 
                return TopupManager[func](type, getFilter(), params);
            break; 

            case 'om' :
                return OMManager[func](type, getFilter(), params);
            break;
	
            case 'monitor' :
                return MonitorServerManager[func](type, getFilter(), params);
            break;
			
            case 'wimax' :
                return WimaxServerManager[func](type, getFilter(), params);
            break;

            case 'sales' :
                return SalesServerManager[func](type,getFilter(),params);
            break;
			
            default:
                break;
        }*/
  }

  static getDrillData(menu, func, type, date, params) {
    let filter = getFilterString();
    filter["d1"] = date;
    return controllerConfig[menu][func](type, filter, params);
    /*switch (menu) {
            case 'home':
                return HomeServerManager[func](type, filter, params);
                break;
            case 'parc':
                return ParcServerManager[func](type, filter, params);
                break;
            case 'revenue':
                return RevenueServerManager[func](type, filter, params);
                break;
            case 'traffic':
                return TrafficServerManager[func](type, filter, params);
                break;   
            case 'recharge':
                return TopupManager[func](type, filter, params);
                break;
            case 'om':
                return OMManager[func](type, filter, params);
                break;

            case 'monitor':
                return MonitorServerManager[func](type, filter, params);
                break;
            case 'wimax':
                return WimaxServerManager[func](type, filter, params);
                break;
			case 'sales' :
                return SalesServerManager[func](type,filter,params);
            break;
			
            default:
                break;
        }   */
  }
}
