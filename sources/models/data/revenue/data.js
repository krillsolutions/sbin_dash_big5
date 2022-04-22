
import {urls} from 'models/referential/genReferentials';
import ServerController from "controllers/serverController";
import EventController from "controllers/viewController";
import {RevenueServerManager} from "models/utils/server/ServerManager";


new RevenueServerManager(urls.api_url);

const rev_stat = new webix.DataCollection({
        id : 'rev_stat',
        url :  function(params) { return ServerController.getData('revenue', 'getStat', 'stat')}
});

const rev_split = new webix.DataCollection({
    id : 'rev_split',
    url :  function(params) { return ServerController.getData('revenue', 'getRevenue', 'split')}
});

const rev_trend_split = new webix.DataCollection({
    id : 'rev_trend_split',
    url :  function(params) { return ServerController.getData('revenue', 'getRevenue', 'month_trend','vue0')}
});

const rev_net_split = new webix.DataCollection({
    id : 'rev_net_split',
    url :  function(params) { return ServerController.getData('revenue', 'getRevTypeByNet','vue1')}
});

const rev_net_split_exp = new webix.DataCollection({
    id : 'rev_net_split_exp',
    url :  function(params) { return ServerController.getData('revenue', 'getRevTypeByNet','vue2')}
});


const rev_type_prod_split = new webix.TreeCollection({
    id : 'rev_type_prod_split',
    url :  function(params) { return ServerController.getData('revenue', 'getRevTypeByProd','vue1')}
});

const rev_type_prod_split_exp = new webix.DataCollection({
    id : 'rev_type_prod_split_exp',
    url :  function(params) { return ServerController.getData('revenue', 'getRevTypeByProd','vue2')}
});

const rev_line_split = new webix.DataCollection({
    id : 'rev_line_split',
    url :  function(params) { return ServerController.getData('revenue', 'getRevLine', 'split', 'vue1')}
});

const rev_line_trend = new webix.DataCollection({
    id : 'rev_line_trend',
    url :  function(params) { return ServerController.getData('revenue', 'getRevLine', 'month_trend')}
});


const rev_op_split = new webix.DataCollection({
    id : 'rev_op_split',
    url :  function(params) { return ServerController.getData('revenue', 'getRevByOpType', 'vue1')}
});

const traff_op_split = new webix.DataCollection({
    id : 'traff_op_split',
    url :  function(params) { return ServerController.getData('revenue', 'getRevByOpType', 'vue2')}
});

const rev_clt_split = new webix.DataCollection({
    id : 'rev_clt_split',
    url :  function(params) { return ServerController.getData('revenue', 'getRevTypeClt','vue1')}
});

const rev_clt_split_exp = new webix.DataCollection({
    id : 'rev_clt_split_exp',
    url :  function(params) { return ServerController.getData('revenue', 'getRevTypeClt','vue2')}
});


/*
const rev_split_fai = new webix.DataCollection({
    id : 'rev_split_fai',
    url :  function(params) { return ServerController.getData('revenue', 'getRevenue', 'split')}
});

const rev_trend_split_fai = new webix.DataCollection({
    id : 'rev_trend_split_fai',
    url :  function(params) { return ServerController.getData('revenue', 'getRevenue', 'month_trend','vue1')}
});

const rev_split_gros = new webix.DataCollection({
    id : 'rev_split_gros',
    url :  function(params) { return ServerController.getData('revenue', 'getRevenue', 'split_gros')}
});

const rev_trend_split_gros = new webix.DataCollection({
    id : 'rev_trend_split_gros',
    url :  function(params) { return ServerController.getData('revenue', 'getRevenue', 'month_trend', 'vue2')}
});


const rev_grp_split_fai = new webix.DataCollection({
    id : 'rev_grp_split_fai',
    url :  function(params) { return ServerController.getData('revenue', 'getRevGrpOff', 'vue1')}
});

const rev_grp_split_gros = new webix.DataCollection({
    id : 'rev_grp_split_gros',
    url :  function(params) { return ServerController.getData('revenue', 'getRevGrpOff', 'vue3')}
});



const rev_sales_split = new webix.DataCollection({
    id : 'rev_sales_split',
    url :  function(params) { return ServerController.getData('revenue', 'getSales', 'vue1')}
});

const rev_sales_trend = new webix.DataCollection({
    id : 'rev_sales_trend',
    url :  function(params) { return ServerController.getData('revenue', 'getSales', 'month_trend')}
});

const rev_pay_trend = new webix.DataCollection({
    id : 'rev_pay_trend',
    url :  function(params) { return ServerController.getData('revenue', 'getRevPay', 'month_trend')}
});

const rev_zone_split = new webix.DataCollection({
    id : 'rev_zone_split',
    url :  function(params) { return ServerController.getData('revenue', 'getRevZone', 'vue1')}
});

const rev_bill_split = new webix.DataCollection({
    id : 'rev_bill_split',
    url :  function(params) { return ServerController.getData('revenue', 'getRevBill', 'vue1')}
});
*/
/*
const traff_op_split = new webix.DataCollection({
    id : 'traff_op_split',
    url :  function(params) { return ServerController.getData('revenue', 'getRevByOpType', 'vue2')}
});


const rev_bndle_split = new webix.DataCollection({
    id : 'rev_bndle_split',
    url :  function(params) { return ServerController.getData('revenue', 'getRevByBundleType', 'vue1')}
});

const rev_bndle_split_exp = new webix.DataCollection({
    id : 'rev_bndle_split_exp',
    url :  function(params) { return ServerController.getData('revenue', 'getRevByBundleType', 'vue2')}
});


const rev_geo_split = new webix.DataCollection({
    id : 'rev_geo_split',
    url :  function(params) { return ServerController.getData('revenue', 'getRevGeo', 'vue2')}
});


const rev_roam_split = new webix.DataCollection({
    id : 'rev_roam_split',
    url :  function(params) { return ServerController.getData('revenue', 'getRoaming', 'vue1')}
});

const traf_roam_split = new webix.DataCollection({
    id : 'traf_roam_split',
    url :  function(params) { return ServerController.getData('revenue', 'getRoaming', 'vue2')}
});
*/


export function getRevChartData(type) {

        switch (type) {
                case 'stat':
                    return rev_stat;
                    break;   
                case 'rev_split':
                    return rev_split;
                    break; 
                case 'rev_type_net_exp' :
                    return rev_net_split_exp;
                    break;

                case 'rev_type_net':
                    return rev_net_split;
                    break; 
                    
                    
                case 'rev_type_split_exp' :
                    return rev_type_prod_split_exp;
                    break;

                case 'rev_type_split':
                    return rev_type_prod_split;
                    break;                     
                
                case 'operators':
                    return rev_op_split;
                    break;
                case 'operators_traff':
                    return traff_op_split;
                    break;

                case 'rev_client_split' :
                    return rev_clt_split;
                    break;

                case 'rev_client_split_exp':
                    return rev_clt_split_exp;
                    break;                       

                case 'rev_split_gros':
                    return rev_split_gros;
                    break;                                            
	        case 'rev_grp_type_split_fai':
			return rev_grp_split_fai;
			break;

	        case 'rev_grp_type_split_gros':
			return rev_grp_split_gros;
			break;            
                case 'revType_trend':
                    return rev_trend_split;
                    break;
                case 'revType_trend_fai':
                    return rev_trend_split_fai;
                    break;   
                case 'revType_trend_gros':
                    return rev_trend_split_gros;
                    break;                                         
                case 'rev_line_split':
                    return rev_line_split;
                    break;  
                case 'rev_off_trend':
                    return rev_line_trend;
                    break;

                case 'rev_sales_split':
                    return rev_sales_split;
                    break;
			
                case 'rev_sales_trend':
                    return rev_sales_trend;
                    break;
                case 'pay_trend':
                    return rev_pay_trend;
                    break;
			
                case 'rev_zone':
                    return rev_zone_split;
                    break;
		case 'rev_bill':
			return rev_bill_split;
            break;
		case 'rev_roam' :
			return rev_roam_split;
                default:
                        break;
        }
}

export function getAllRevData() {

        return [ 
            {type : 'stat',data : rev_stat, func : 'getStat'},
            {type : 'split', data : rev_split, func : 'getRevenue'},        
	        {type : 'vue1', data : rev_net_split, func : 'getRevTypeByNet', params : 'vue1'},
            {type : 'vue2', data : rev_net_split_exp, func : 'getRevTypeByNet', params : 'vue2'},
	        {type : 'vue1', data : rev_type_prod_split, func : 'getRevTypeByProd', params : 'vue1'},
            {type : 'vue2', data : rev_type_prod_split_exp, func : 'getRevTypeByProd', params : 'vue2'},            
            {type : 'split', data : rev_line_split, func : 'getRevLine'},
            {type : 'month_trend', data : rev_line_trend, func : 'getRevLine'}, 
            {type : 'vue1', data : rev_op_split, func : 'getRevByOpType'},
            {type : 'vue2', data : traff_op_split, func : 'getRevByOpType'},
            {type : 'vue1', data : rev_clt_split, func : 'getRevTypeClt', params : 'vue1'},
            {type : 'vue2', data : rev_clt_split_exp, func : 'getRevTypeClt', params : 'vue2'},
            {type : 'month_trend', data : rev_trend_split, func : 'getRevenue', params : 'vue2'},
            /*            {type : 'split_gros', data : rev_split_gros, func : 'getRevenue'},  
            {type : 'split', data : rev_split_fai, func : 'getRevenue'},    
           {type : 'vue1', data : rev_grp_split_fai, func : 'getRevGrpOff'},
           {type : 'vue3', data : rev_grp_split_gros, func : 'getRevGrpOff'},
          
	    {type : 'vue1', data : rev_sales_split, func : 'getSales'},
        {type : 'month_trend', data : rev_sales_trend, func : 'getSales'},
        {type : 'month_trend', data : rev_pay_trend, func : 'getRevPay'},
        {type : 'vue1', data : rev_zone_split, func : 'getRevZone'},
        {type : 'vue1', data : rev_bill_split, func : 'getRevBill'}*/
           /* {type : 'vue1', data  : rev_bndle_split, func : 'getRevByBundleType'},
	    {type : 'vue2', data  : rev_bndle_split_exp, func : 'getRevByBundleType'},
            {type : 'vue2', data : rev_geo_split, func : 'getRevGeo'},
	    {type : 'vue1' , data : rev_roam_split, func : 'getRoaming'},
	    {type : 'vue2' , data : traf_roam_split, func : 'getRoaming'},*/

        ];

}

for (const elm of getAllRevData()) {
    elm.data._menu = 'revenue';
    elm.data._func = elm.func;
    elm.data._param = elm.type;
    if(elm.params) elm.data._params = elm.params; 
    elm.data.attachEvent('onFilterData', EventController.onFiterClicked);
}
export const functions_ref = {
        'stat' : 'getStat', 'revenue' : 'getRevenue', 'operators' : 'getRevByOpType', 'bndle' : 'getRevByBundleType', 'rev_geo' : 'getRevGeo', 'operators_traff' : 'getRevByOpType',
	'line' : 'getRevLine', 'rev_roam' : 'getRoaming', 'sale' : 'getSales', 'pay' : 'getRevPay'
}   

export function getFiterDate(func, type, date, params){

                return ServerController.getDrillData('revenue',functions_ref[func], type, date, params);

}
