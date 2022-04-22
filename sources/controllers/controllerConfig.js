import {getFilter} from "models/utils/general/boot";
import HomeServerManager from "models/utils/server/ServerManager";
//import {OMManager, ParcServerManager, RevenueServerManager, TrafficServerManager, MonitorServerManager, WimaxServerManager, SalesServerManager} from "models/utils/server/ServerManager";
import { ParcServerManager,RevenueServerManager,TopupManager, TrafficServerManager,BillingServerManager,MonitorServerManager} from "models/utils/server/ServerManager";
//import { BillingServerManager } from "../models/utils/server/ServerManager";


export const controllerConfig = {

    'home' : HomeServerManager,
    'parc' : ParcServerManager,
    'revenue' : RevenueServerManager,
    'recharge' : TopupManager,
    'traffic' : TrafficServerManager,
    'bills' : BillingServerManager,
    'monitor': MonitorServerManager



}

