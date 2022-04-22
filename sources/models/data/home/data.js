import {urls} from 'models/referential/genReferentials';
import ServerController from "controllers/serverController";
import HomeServerManager from "models/utils/server/ServerManager";
import EventController from "controllers/viewController";
export const exportData = [{'id':'i', 'value' : '<span class ="mdi mdi-image"></span>Image'},
				{'id' : 'p', 'value' : '<span class ="mdi mdi-file-pdf"></span>PDF'}, 
					{'id' : 'c' , 'value' : '<span class ="mdi mdi-file-delimited"></span>CSV'}
			  ];

new HomeServerManager(urls.api_url);


// ------------------------- STATS GLOB --------------------------------- //

const parc_home_stat = new webix.DataCollection({
        id : 'parc_home_stat',
        url :  function(params) { return ServerController.getData('home', 'getStat', 'parc')}
});

const rev_fai_home_stat = new webix.DataCollection({
        id : 'rev_fai_home_stat',
        //url : getDUrl('home', 'rev_stat', filters)
        url :  function(params) { return ServerController.getData('home', 'getStat', 'revenue_fai')}
});

const rev_gros_home_stat = new webix.DataCollection({
        id : 'rev_gros_home_stat',
        //url : getDUrl('home', 'rev_stat', filters)
        url :  function(params) { return ServerController.getData('home', 'getStat', 'revenue_gros')}
});


const tvoix_home_stat = new webix.DataCollection({
        id : 'tvoix_home_stat',
        url :  function(params) { return ServerController.getData('home', 'getStat', 'tvoix')}
});



const tsales_home_stat = new webix.DataCollection({
        id : 'tsales_home_stat',
        url :  function(params) { return ServerController.getData('home', 'getStat', 'rsales')}
});


const rev_fact_paid = new webix.DataCollection({
        id : 'rev_fact_paid',
        url :  function(params) { return ServerController.getData('home', 'getStat', 'fpaid')}
});



const nb_demandes = new webix.DataCollection({  
        id : 'nb_demandes',
        url : function(params) { return ServerController.getData('home', 'getStat', 'ndemande')}
 });


// ------------------------ Evoliutions ----------------------------//



 const parc_trend = new webix.DataCollection({  
        id : 'parc_trend',
        url : function(params) { return ServerController.getData('home', 'getParc', 'month_trend')}
 });


 const rev_trend_home = new webix.DataCollection({  
        id : 'rev_trend_home',
        url : function(params) { return ServerController.getData('home', 'getRevenue', 'month_trend')}
 });

 const arpu_trend_home = new webix.DataCollection({  
        id : 'arpu_trend_home',
        url : function(params) { return ServerController.getData('home', 'getArpu', 'month_trend')}
 }); 


 const traffic_trend_home = new webix.DataCollection({  
        id : 'traffic_trend_home',
        url : function(params) { return ServerController.getData('home', 'getTrafficSplitAll', 'vue1')}
 });

 const trend_bndle = new webix.DataCollection({  
        id : 'trend_bndle',
        url : function(params) { return ServerController.getData('home', 'getBundle', 'month_trend')}
 });

 const trend_topup = new webix.DataCollection({  
        id : 'trend_topup',
        url : function(params) { return ServerController.getData('home', 'getRecharge', 'month_trend')}
 });



 const trend_pay = new webix.DataCollection({  
        id : 'trend_pay',
        url : function(params) { return ServerController.getData('home', 'getPay', 'month_trend')}
 });

 const trend_dmd = new webix.DataCollection({  
        id : 'trend_dmd',
        url : function(params) { return ServerController.getData('home', 'getDemand', 'month_trend')}
 });

export function getHomeStatData(type) {

	switch(type) {
	
		
		case 'parc' : 
			return parc_home_stat;
			break;
                case 'revenue_fai' :
                        return rev_fai_home_stat;
                        break;	
                case 'revenue_gros' :
                        return rev_gros_home_stat;
                        break;                        	
                case 'tvoix' :
                        return tvoix_home_stat;
                        break;
                case 'rsales' :
                        return tsales_home_stat;
                        break;
                case 'fpaid' :
                        return rev_fact_paid;
                        break;
                case 'demands' :
                        return nb_demandes;
                        break;

               
	
	}
}

export function getHomeChartData(type) {

        switch (type) {
                case 'parc_trend':
                        return parc_trend;
                        break;                                                 
                case 'rev_trend' :
                        return rev_trend_home;
                        break;                          
                case 'trend_arpu' :
                        return arpu_trend_home;
                        break;  
                case 'traffic_split':
                        return traffic_trend_home
                        break  
                
                
                case 'trend_topup':
                        return trend_topup;
                        break;  

                case 'trend_bndle':
                        return trend_bndle;
                        break;     
                
                case 'pay_trend':
                        return trend_pay;
                        break;      
                        
                case 'dmd_trend':
                        return trend_dmd;
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
                 {type : "revenue_fai", data : rev_fai_home_stat,id : 'rev_fai_home_stat', func : 'getStat'}, 
                 {type : "revenue_gros", data : rev_fai_home_stat,id : 'rev_gros_home_stat', func : 'getStat'}, 
                 {type : "tvoix", data : tvoix_home_stat,id : 'tvoix_home_stat', func : 'getStat'}, 
                 {type : "rsales", data : tsales_home_stat,id : 'tsales_home_stat', func : 'getStat'}, 
                 {type : "fpaid", data : rev_fact_paid,id : 'rev_fact_paid', func : 'getStat'}, 
                 {type : 'ndemande', data : nb_demandes,id : 'nb_demandes', func : 'getStat'} ,
                 {type : 'month_trend', data : parc_trend,id : 'parc_trend', func : 'getParc'},
                 {type : 'month_trend', data : rev_trend_home,id : 'rev_trend_home', func : 'getRevenue'},
                 {type : 'month_trend', data : arpu_trend_home,id : 'arpu_trend_home', func : 'getArpu'},
                 {type : 'vue1',data : traffic_trend_home, id : 'traffic_trend_home', func : 'getTrafficSplitAll'},
                 {type : 'month_trend',data : trend_bndle, id : 'trend_bndle', func : 'getBundle'},
                 {type : 'month_trend',data : trend_topup, id : 'trend_topup', func : 'getRecharge'},
                 {type : 'month_trend',data : trend_pay, id : 'trend_pay', func : 'getPay'},
                 {type : 'month_trend',data : trend_dmd, id : 'trend_dmd', func : 'getDemand'}
                ];

        }

for (const elm of getAllHomeData()) {
        elm.data._menu = 'home';
        elm.data._func = elm.func;
        elm.data._param = elm.type;
        elm.data.attachEvent('onFilterData', EventController.onFiterClicked);
}
export const functions_ref = {
        'stat' : 'getStat', 'parc' : 'getParc', 'revenue' : 'getRevenue', 'data' : 'getData', 'topup' : 'getRecharge', 'pay' : 'getPay','bndle' : 'getBundle','traffic' : 'getTrafficSplitAll','arpu' : 'getArpu',
        'demand' : 'getDemand'
}   

export function getFiterDate(func, params, date){

                return ServerController.getDrillData('home',functions_ref[func], params, date);

}
