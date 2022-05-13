
import {urls} from 'models/referential/genReferentials';
import ServerController from "controllers/serverController";
import {BillingServerManager} from "models/utils/server/ServerManager";
import EventController from "controllers/viewController";

new BillingServerManager(urls.api_url);

const bills_stats = new webix.DataCollection({
        id : 'bills_stats',
        url :  function(params) { return ServerController.getData('bills', 'getStat', 'vue1')}
});

const bills_bill_mk_split = new webix.DataCollection({
    id : 'bills_bill_mk_split',
    url :  function(params) { return ServerController.getData('bills', 'getBilling', 'fact', 'bill_mark')}
});

const bills_off_split = new webix.DataCollection({
    id : 'bills_off_split',
    url :  function(params) { return ServerController.getData('bills', 'getBilling', 'fact', 'offer')}
});

const bills_off_trend = new webix.DataCollection({
    id : 'bills_off_trend',
    url :  function(params) { return ServerController.getData('bills', 'getBilling', 'fact', 'month_trend')}
});


const pays_bill_mk_split = new webix.DataCollection({
    id : 'pays_bill_mk_split',
    url :  function(params) { return ServerController.getData('bills', 'getBilling', 'pay', 'bill_mark')}
});

const pays_off_split = new webix.DataCollection({
    id : 'pays_off_split',
    url :  function(params) { return ServerController.getData('bills', 'getBilling', 'pay', 'offer')}
});

const pays_off_trend = new webix.DataCollection({
    id : 'pays_off_trend',
    url :  function(params) { return ServerController.getData('bills', 'getBilling', 'pay', 'month_trend')}
});



const recouvr_off_split = new webix.DataCollection({
    id : 'recouvr_off_split',
    url :  function(params) { return ServerController.getData('bills', 'getRecouvr', 'split')}
});

const recouvr_trend = new webix.DataCollection({
    id : 'recouvr_trend',
    url :  function(params) { return ServerController.getData('bills', 'getRecouvr', 'trend')}
});

const bills_by_type_split = new webix.DataCollection({
    id : 'bills_by_type_split',
    url :  function(params) { return ServerController.getData('bills', 'getSplit', 'bill','type')}
});

const bills_by_status_split = new webix.DataCollection({
    id : 'bills_by_status_split',
    url :  function(params) { return ServerController.getData('bills', 'getSplit', 'bill','status')}
});


const pay_by_type_split = new webix.DataCollection({
    id : 'pay_by_type_split',
    url :  function(params) { return ServerController.getData('bills', 'getSplit', 'pay','type')}
});

const pay_by_status_split = new webix.DataCollection({
    id : 'pay_by_status_split',
    url :  function(params) { return ServerController.getData('bills', 'getSplit', 'pay','status')}
});


const bill_by_zone = new webix.DataCollection({
    id : 'bill_by_zone',
    url :  function(params) { return ServerController.getData('bills', 'getBillZone', 'vue1')}
});

const bill_by_zone_exp = new webix.DataCollection({
    id : 'bill_by_zone_exp',
    url :  function(params) { return ServerController.getData('bills', 'getBillZone', 'vue2')}
});


const bill_by_lib = new webix.DataCollection({
    id : 'bill_by_lib',
    url :  function(params) { return ServerController.getData('bills', 'getBillLib', 'vue1')}
});

const bill_by_lib_exp = new webix.DataCollection({
    id : 'bill_by_lib_exp',
    url :  function(params) { return ServerController.getData('bills', 'getBillLib', 'vue2')}
});

const agent_pay = new webix.TreeCollection({
    id : 'agent_pay',
    url :  function(params) { return ServerController.getData('bills', 'getEncaiss', 'vue1')}
});

const agent_pay_exp = new webix.DataCollection({
    id : 'agent_pay_exp',
    url :  function(params) { return ServerController.getData('bills', 'getEncaiss', 'vue10')}
});

const pay_by_method = new webix.DataCollection({
    id : 'pay_by_method',
    url :  function(params) { return ServerController.getData('bills', 'getEncaiss', 'meth')}
});

export function getBillsChartData(type) {

        switch (type) {
                case 'bills_stats':
                        return bills_stats;
                        break;
                case 'b_bill_market':
                        return bills_bill_mk_split;
                        break;

                case 'b_offer' :
                    return bills_off_split;
                    break;

                case 'b_offer_trend' :
                    return bills_off_trend;

                case 'p_bill_market':
                        return pays_bill_mk_split;
                        break;

                case 'p_offer' :
                    return pays_off_split;
                    break;

                case 'p_offer_trend' :
                    return pays_off_trend;   
                    
                case 'recouvr_split' :
                    return recouvr_off_split;

                case 'recouv_trend' :
                    return recouvr_trend;

                case 'bill_type_split':
                    return bills_by_type_split;

                case 'bill_status_split':
                    return bills_by_status_split

                case 'pay_type_split':
                    return pay_by_type_split;

                case 'pay_status_split':
                    return pay_by_status_split  ;
                    
                case 'bill_agg' :
                    return bill_by_lib;
                case 'bill_agg_exp' :
                    return bill_by_lib_exp;  

                case 'bill_loc' :
                    return bill_by_zone;
                case 'bill_loc_exp' :
                    return bill_by_zone_exp;                      

                case 'agent_tab' :
                    return agent_pay;   
                    
                case 'agent_tab_exp' :
                    return agent_pay_exp;   
                                        
                case 'pay_meth':
                    return pay_by_method;
        }
}

 function getAllBillsData() {
        return [ 
            {type : "vue1", data : bills_stats, func : 'getStat'}, 
            {type : 'fact', data : bills_bill_mk_split, func : 'getBilling', params : 'bill_mark'},
            {type : 'fact', data : bills_off_split, func : 'getBilling', params : 'offer'},
            {type : 'fact', data : bills_off_trend, func : 'getBilling', params : 'month_trend'},

            {type : 'pay', data : pays_bill_mk_split, func : 'getBilling', params : 'bill_mark'},
            {type : 'pay', data : pays_off_split, func : 'getBilling', params : 'offer'},
            {type : 'pay', data : pays_off_trend, func : 'getBilling', params : 'month_trend'},
            {type : 'split', data : recouvr_off_split, func : 'getRecouvr'},
            {type : 'trend', data : recouvr_trend, func : 'getRecouvr'},
            {type : 'bill', data : bills_by_type_split, func : 'getSplit', params : 'type'},
            {type : 'bill', data : bills_by_status_split, func : 'getSplit', params : 'status'},
            {type : 'pay', data : pay_by_type_split, func : 'getSplit', params : 'type'},
            {type : 'pay', data : pay_by_status_split, func : 'getSplit', params : 'status'},
            {type : 'vue1', data : bill_by_lib, func : 'getBillLib'},
            {type : 'vue2', data : bill_by_lib_exp, func : 'getBillLib'},
            {type : 'vue1', data : bill_by_zone, func : 'getBillZone'},
            {type : 'vue2', data : bill_by_zone_exp, func : 'getBillZone'},            
            {type : 'vue1', data : agent_pay, func : 'getEncaiss'},
            {type : 'vue10', data : agent_pay_exp, func : 'getEncaiss'},  
            {type : 'meth', data : pay_by_method, func : 'getEncaiss'},  
            /*{type : 'trend', data : product_trend, func : 'getProduct', params : 'vue1'},
            {type : 'split', data : client_split, func : 'getSaleClientType'},
            {type : 'trend', data : client_trend, func : 'getSaleClientType', params : 'vue1'},
	        {type : 'vue1', data : product_item, func : 'getProductItem'},
            {type : 'vue1', data : sales_trend, func : 'getSalesTrend'}*/
        ];
}
for (const elm of getAllBillsData()) {
    elm.data._menu = 'bills';
    elm.data._func = elm.func;
    elm.data._param = elm.type;
    if(elm.params) elm.data._params = elm.params; 
    elm.data.attachEvent('onFilterData', EventController.onFiterClicked);
}

export const functions_ref = {
    'stat' : 'getStat', 'billing' : 'getBilling'
}   

export function getFiterDate(func, type, date, params){

            return ServerController.getDrillData('bills',functions_ref[func], type, date, params);

}