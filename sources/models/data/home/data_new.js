import {urls} from 'models/referential/genReferentials';
import ServerController from "controllers/serverController";
import HomeServerManager from "models/utils/server/ServerManager";
import EventController from "controllers/viewController";
export const exportData = [{'id':'i', 'value' : '<span class ="mdi mdi-image"></span>Image'},
				{'id' : 'p', 'value' : '<span class ="mdi mdi-file-pdf"></span>PDF'}, 
					{'id' : 'c' , 'value' : '<span class ="mdi mdi-file-delimited"></span>CSV'}
			  ];

new HomeServerManager(urls.api_url);

//const url = 'http://localhost:8000/api/';

const parc_home_stat = new webix.DataCollection({
        id : 'parc_home_stat',
        url :  function(params) { return ServerController.getData('home', 'getStat', 'parc')}//getDUrl('home', 'getStat', 'parc')
	//url : function(params) { return webix.remote.home.getStat('parc',filters )}
});

const rev_home_stat = new webix.DataCollection({
        id : 'rev_home_stat',
        //url : getDUrl('home', 'rev_stat', filters)
        url :  function(params) { return ServerController.getData('home', 'getStat', 'revenue')}
});


const tvoix_home_stat = new webix.DataCollection({
        id : 'tvoix_home_stat',
        url :  function(params) { return ServerController.getData('home', 'getStat', 'tvoix')}
});


const tdata_home_stat = new webix.DataCollection({
        id :'tdata_home_stat',
        url :  function(params) { return ServerController.getData('home', 'getStat', 'tdata')}
});

const topup_home_stat = new webix.DataCollection({
        id : 'topup_home_stat',
        url :  function(params) { return ServerController.getData('home', 'getStat', 'topup')}
});

/*
const bndl_home_stat = new webix.DataCollection({
        id : 'bndl_home_stat',
        url :  function(params) { return ServerController.getData('home', 'getStat', 'bndle')}
});
*/
const encaiss_home_stat = new webix.DataCollection({
    id : 'encaiss_home_stat',
    url :  function(params) { return ServerController.getData('home', 'getStat', 'encaiss')}
});

/*const parc_operator = new webix.DataCollection({  
        id : 'parc_operator',
        url : function(params) { return ServerController.getData('home', 'getParc', 'op')}
 });
 */

 const parc_bill = new webix.DataCollection({  
        id : 'parc_bill',
        url : function(params) { return ServerController.getData('home', 'getParc', 'bill')}
 });

 const parc_trend = new webix.DataCollection({  
        id : 'parc_trend',
        url : function(params) { return ServerController.getData('home', 'getParc', 'month_trend')}
 });

/*
 const rev_split_home = new webix.DataCollection({  
        id : 'rev_split_home',
        url : function(params) { return ServerController.getData('home', 'getRevenue', 'vue0')}
 });
 */

 const rev_trend_home = new webix.DataCollection({  
        id : 'rev_trend_home',
        url : function(params) { return ServerController.getData('home', 'getRevenue', 'vue1')}
 });

 const data_bill_home = new webix.DataCollection({  
        id : 'data_bill_home',
        url : function(params) { return ServerController.getData('home', 'getData', 'bill')}
 }); 

 const data_trend_home = new webix.DataCollection({  
        id : 'data_trend_home',
        url : function(params) { return ServerController.getData('home', 'getData', 'month_trend')}
 });

 const recharge_split_home = new webix.DataCollection({  
        id : 'recharge_split_home',
        url : function(params) { return ServerController.getData('home', 'getRecharge', 'split')}
 }); 

 const recharge_trend_home = new webix.DataCollection({  
        id : 'recharge_trend_home',
        url : function(params) { return ServerController.getData('home', 'getRecharge', 'month_trend')}
 }); 

 const home_parc_by_prod = new webix.DataCollection({
    id : 'home_parc_by_prod',
    url :  function(params) { return ServerController.getData('home', 'getParc', 'prod')}
});

/*
 const bndle_split_home = new webix.DataCollection({  
        id : 'bndle_split_home',
        url : function(params) { return ServerController.getData('home', 'getBundle', 'split')}
 }); 

 const bndle_trend_home = new webix.DataCollection({  
        id : 'bndle_trend_home',
        url : function(params) { return ServerController.getData('home', 'getBundle', 'month_trend')}
 }); 
*/

 const arpu_trend_home = new webix.DataCollection({  
        id : 'arpu_trend_home',
        url : function(params) { return ServerController.getData('home', 'getArpu', 'month_trend')}
 }); 


 const traffic_trend_home = new webix.DataCollection({  
        id : 'traffic_trend_home',
        url : function(params) { return ServerController.getData('home', 'getTrafficSplitAll', 'vue1')}
 });

 const trend_pay = new webix.DataCollection({  
    id : 'trend_pay',
    url : function(params) { return ServerController.getData('home', 'getPay', 'month_trend')}
});



export function getHomeStatData(type) {

	switch(type) {
	
		
		case 'parc' : 
			return parc_home_stat;
			break;
                case 'revenue' :
                        return rev_home_stat;
                        break;		
                case 'tvoix' :
                        return tvoix_home_stat;
                        break;
                case 'tdata' :
                        return tdata_home_stat;
                        break;
                case 'topup' :
                        return topup_home_stat;
                        break;
                /*case 'bndle' :
                        return bndl_home_stat;
                        break;*/
                case 'encaiss' :
                    return encaiss_home_stat;
                    break;               
	
	}
}

export function getHomeChartData(type) {

        switch (type) {
                /*case 'parc_operators':
                        return parc_operator;
                        break;*/
                case 'parc_billing':
                        return parc_bill;
                        break;
                case 'parc_prod':
                    return home_parc_by_prod;
                    break;                          
                case 'parc_trend':
                        return parc_trend;
                        break;                                                 
                /*case 'rev_split' :
                        return rev_split_home;
                        break;*/
                case 'rev_trend' :
                        return rev_trend_home;
                        break;                        
                case 'bill_data' :
                        return data_bill_home;
                        break;
                case 'trend_data' :
                        return data_trend_home;
                        break;                        
                case 'split_topup' :
                        return recharge_split_home;
                        break;
                case 'month_trend' :
                        return recharge_trend_home;
                        break;                        
                /*case 'split_bndle' :
                        return bndle_split_home;
                        break; 
                case 'trend_bndle' :
                        return bndle_trend_home;
                        break;   */

                case 'trend_arpu' :
                        return arpu_trend_home;
                        break;  
                case 'traffic_split':
                        return traffic_trend_home
                        break    
                case 'pay_trend':
                    return trend_pay;
                    break;                                               
                default:
                        break;
        }
}

export function getHomeDataById(id) {
        
        return getAllHomeData().filter((d) => d.id == id);
}

export function getAllHomeData() {

        return [ {type : "parc", data : parc_home_stat,id : 'parc_home_stat', func : 'getStat'},
                 {type : "revenue", data : rev_home_stat,id : 'rev_home_stat', func : 'getStat'}, 
                 {type : "tvoix", data : tvoix_home_stat,id : 'tvoix_home_stat', func : 'getStat'}, 
                 {type : "tdata", data : tdata_home_stat,id : 'tdata_home_stat', func : 'getStat'}, 
                 {type : "topup", data : topup_home_stat,id : 'topup_home_stat', func : 'getStat'}, 
               //  {type : 'bndle', data : bndl_home_stat,id : 'bndl_home_stat', func : 'getStat'} ,
                 {type : 'encaiss', data : encaiss_home_stat,id : 'encaiss_home_stat', func : 'getStat'} ,
                // {type : 'op', data : parc_operator,id : 'parc_operator', func : 'getParc'},
                 {type : 'prod', data : home_parc_by_prod,id : 'home_parc_by_prod', func : 'getParc'},
                 {type : 'bill', data : parc_bill,id : 'parc_bill', func : 'getParc'},
                 {type : 'month_trend', data : parc_trend,id : 'parc_trend', func : 'getParc'},
               //  {type : 'vue0', data : rev_split_home,id : 'rev_split_home', func : 'getRevenue'},
                 {type : 'vue1', data : rev_trend_home,id : 'rev_trend_home', func : 'getRevenue'},
                 {type : 'bill', data : data_bill_home,id : 'data_bill_home', func : 'getData'},
                 {type : 'month_trend', data : data_trend_home,id : 'data_trend_home', func : 'getData'},
                 {type : 'split', data : recharge_split_home,id : 'recharge_split_home', func : 'getRecharge'},
                 {type : 'month_trend', data : recharge_trend_home,id : 'recharge_trend_home', func : 'getRecharge'},
                 //{type : 'split', data : bndle_split_home,id : 'bndle_split_home', func : 'getBundle'},
                // {type : 'month_trend', data : bndle_trend_home,id : 'bndle_trend_home', func : 'getBundle'},
                 {type : 'month_trend', data : arpu_trend_home,id : 'arpu_trend_home', func : 'getArpu'},
                 {type : 'vue1',data : traffic_trend_home, id : 'traffic_trend_home', func : 'getTrafficSplitAll'},
                 {type : 'month_trend',data : trend_pay, id : 'trend_pay', func : 'getPay'}
                ];

        }

for (const elm of getAllHomeData()) {
        elm.data._menu = 'home';
        elm.data._func = elm.func;
        elm.data._param = elm.type;
        elm.data.attachEvent('onFilterData', EventController.onFiterClicked);
}
export const functions_ref = {
        'stat' : 'getStat', 'parc' : 'getParc', 'revenue' : 'getRevenue', 'data' : 'getData', 'topup' : 'getRecharge', 'bndle' : 'getBundle','traffic' : 'getTrafficSplitAll','arpu' : 'getArpu', 'pay' : 'getPay'
}   

export function getFiterDate(func, params, date){

                return ServerController.getDrillData('home',functions_ref[func], params, date);

}
