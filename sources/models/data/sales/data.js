
import {urls} from 'models/referential/genReferentials';
import ServerController from "controllers/serverController";
import {SalesServerManager} from "models/utils/server/ServerManager";
import EventController from "controllers/viewController";

new SalesServerManager(urls.api_url);

const sales_stats = new webix.DataCollection({
        id : 'sales_stats',
        url :  function(params) { return ServerController.getData('sales', 'getStat', 'vue1')}
});

const sales_cat_split = new webix.DataCollection({
    id : 'sales_cat_split',
    url :  function(params) { return ServerController.getData('sales', 'getSales', 'split')}
});


const sales_cat_trend = new webix.DataCollection({
    id : 'sales_cat_trend',
    url :  function(params) { return ServerController.getData('sales', 'getSales', 'month_trend')}
});

const sales_cat_prod_split = new webix.DataCollection({
    id : 'sales_cat_prod_split',
    url :  function(params) { return ServerController.getData('sales', 'getSaleSplit', 'vue1')}
});

const sales_pop_user_prod = new webix.DataCollection({
    id : 'sales_pop_user_prod',
    url :  function(params) { return ServerController.getData('sales', 'getSaleSplit', 'pop1')}
});


const sales_tot_trend = new webix.DataCollection({
    id : 'sales_tot_trend',
    url :  function(params) { return ServerController.getData('sales', 'getSalesTrend', 'tot','month_trend')}
});
//salesUser_trend
const sales_user_split_trend = new webix.DataCollection({
    id : 'sales_user_split_trend',
    url :  function(params) { return ServerController.getData('sales', 'getSalesTrend', 'users', 'month_trend')}
});

const sales_pop_split_trend = new webix.DataCollection({
    id : 'sales_pop_split_trend',
    url :  function(params) { return ServerController.getData('sales', 'getSalesTrend', 'pops', 'month_trend')}
});

//salespop_trend
/*

/*


const product_trend = new webix.DataCollection({
    id : 'product_trend',
    url :  function(params) { return ServerController.getData('sales', 'getProduct', 'trend', 'vue1')}
});

const client_split = new webix.DataCollection({
    id : 'client_split',
    url :  function(params) { return ServerController.getData('sales', 'getSaleClientType', 'split')}
});

const client_trend = new webix.DataCollection({
    id : 'client_trend',
    url :  function(params) { return ServerController.getData('sales', 'getSaleClientType', 'trend','vue1')}
});

const product_item = new webix.DataCollection({
    id : 'product_item',
    url :  function(params) { return ServerController.getData('sales', 'getProductItem', 'vue1')}
});

const product_item_exp = new webix.DataCollection({
    id : 'product_item_exp',
    url :  function(params) { return ServerController.getData('sales', 'getProductItem', 'vue2')}
});

const sales_trend = new webix.DataCollection({
    id : 'sales_trend',
    url :  function(params) { return ServerController.getData('sales', 'getSalesTrend', 'vue1')}
});

*/
export function getSalesChartData(type) {

        switch (type) {
                case 'sales_stats':
                        return sales_stats;
                        break;
                case 'sales_split':
                        return sales_cat_split;
                        break;   
                case 'saleType_trend':
                    return sales_cat_trend;
                    break; 
                case 'sales_type_split':
                    return sales_cat_prod_split;
                    break;   
                case 'sales_pop_split':
                    return sales_pop_user_prod;
                    break;                                                               
                case 'tot_trend':
                        return sales_tot_trend;
                        break;

                case 'salesUser_trend':
                    return sales_user_split_trend;
                    break;
                        
                case 'salespop_trend':
                    return sales_pop_split_trend;
                    break;			
                default:
                        break;
        }
}

 function getAllSalesData() {
        return [ 
            {type : "vue1", data : sales_stats, func : 'getStat'}, 
            {type : 'split', data : sales_cat_split, func : 'getSales'},
            {type : 'month_trend', data : sales_cat_trend, func : 'getSales'},
            {type : 'vue1', data : sales_cat_prod_split, func : 'getSaleSplit'},
            {type : 'pop1', data : sales_pop_user_prod, func : 'getSaleSplit'},
            {type : 'tot', data : sales_tot_trend, func : 'getSalesTrend',params : 'month_trend'},
            {type : 'users', data : sales_user_split_trend, func : 'getSalesTrend',params : 'month_trend'},
            {type : 'pops', data : sales_pop_split_trend, func : 'getSalesTrend',params : 'month_trend'},
            /*{type : 'trend', data : product_trend, func : 'getProduct', params : 'vue1'},
            {type : 'split', data : client_split, func : 'getSaleClientType'},
            {type : 'trend', data : client_trend, func : 'getSaleClientType', params : 'vue1'},
	        {type : 'vue1', data : product_item, func : 'getProductItem'},
            {type : 'vue1', data : sales_trend, func : 'getSalesTrend'}*/
        ];
}
for (const elm of getAllSalesData()) {
    elm.data._menu = 'sales';
    elm.data._func = elm.func;
    elm.data._param = elm.type;
    if(elm.params) elm.data._params = elm.params; 
    elm.data.attachEvent('onFilterData', EventController.onFiterClicked);
}

export const functions_ref = {
    'stat' : 'getStat', 'product' : 'getProduct', 'client' : 'getSaleClientType', 'proditem' : 'getProductItem', 'sales' : 'getSalesTrend','split_trend' : 'getSales'
}   

export function getFiterDate(func, type, date, params){

            return ServerController.getDrillData('sales',functions_ref[func], type, date, params);

}