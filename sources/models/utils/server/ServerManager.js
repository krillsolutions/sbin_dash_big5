import {rev_type} from 'models/referential/genReferentials';
import {getToken,getTreeHierachy} from 'models/utils/general/boot';

function groupBy(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  function getHierachy(data,levels=[], value = "value") {

    if(levels.length != 0){let lv = [...levels]
        let dat = groupBy(data,lv[0]);lv.shift()
        let res = []
        for (const key in dat) {
                const element = dat[key]
                
                let dd = {name : key , value : d3.sum(element, d => d[value])};

                let children = getHierachy(element,lv,value)
                if(children.length != 0) {
                    dd.children = children
                }
                res.push(dd)                 
        }
        return res
    }
    else {
            return []
    }

}

export default class HomeServerManager {


    constructor(url){

         HomeServerManager.api_url =  url;
    }

    static getStat(type,filters) {
        
        let data = {data : [{}]};
        let url = HomeServerManager.api_url;
        switch (type) {
            case 'parc':
                url += 'getParc/001';
                data['data'][0]['kpi'] = 'parc';
                break;

            case 'revenue':
                url += 'getRevenue/0100';
                data['data'][0]['kpi'] = 'revenue';
                break;

            case 'tvoix':
                url += 'getTraffic/001';
                data['data'][0]['kpi'] = 'tvoix';
                break;
                
            case 'tdata':
                url += 'getTraffic/002';
                data['data'][0]['kpi'] = 'tdata';
                break; 

            case 'topup':
                url += 'getRecharge/001';
                data['data'][0]['kpi'] = 'topup';
                break;

            case 'bndle':
                url += 'getRevenue/004';
                data['data'][0]['kpi'] = 'bndle';
                break;  
            case 'encaiss':
                url += 'getBill/0011';
                data['data'][0]['kpi'] = 'encaiss';
                break;                             
            default:
                break;
        }

        let k1 = 0;
        let k2 = 0;

        return $.when(
        $.ajax({
            method : 'GET',
            url : url,
            data : filters,
            dataType: 'json',
            headers : {
                "Authorization" : "Bearer "+getToken()
            }
        }).done(function(res){
            if( res.data && res['data'].length != 0) {
                k1 = Number.parseFloat(res['data'][0]['kpi']);
                k2 = Number.parseFloat(res['data'][0]['kpi_']);
                data['data'][0]['value'] = k1;
                data.data[0]['var'] = (k2 > 0)? (100*res['data'][0]['kpi_var']/k2).toFixed(2) : 100;
            }
        }),
        /*$.ajax({
            method : 'GET',
            url : url,
            data : f2
        }).done(function(res){
            k2 = Number.parseFloat(res['data'][0]['kpi']);
        })*/
        ).then(function(d){
            //data.data[0]['var'] = (k1 != 0)? (100*(k1 - k2)/k1).toFixed(2) : 100;
		return data;
        });        
    }
   static getParc(type,filters){
        let data = {data : []};
        
        let url1 = HomeServerManager.api_url+'getParc/002',
        url2 = HomeServerManager.api_url+'getParc/041',
        url3 = HomeServerManager.api_url+'getParc/014',
        url4 = HomeServerManager.api_url+'getParc/022';
        switch(type){

            case 'op' :
                return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url1,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            if(res.data){
                                res.data.sort((a,b) => a.kpi - b.kpi);
                                res.data.forEach(elm => {
                                    data['data'].push({operator : elm.op_name, op_qty : elm.kpi, _type : 'op_split'});
                                });
                            }
                            
                        })).then(function(){
                            return data;
                        }
                );

                break;
                case 'prod' :
                    return $.when(
                            $.ajax({
                                method : 'GET',
                                url : url4,
                                data : filters,
                                dataType: 'json',
                                headers : {
                                    "Authorization" : "Bearer "+getToken()
                                }
                            }).done(function(res){
                                res.data.sort((a,b) => a.kpi - b.kpi);
                                res.data.forEach(elm => {
                                    data['data'].push({off_group : elm.offer_group, qty : elm.kpi, _type : 'off_split'});
                                });
                                
                            })).then(function(){
                                return data;
                            }
                    );
    
                    break;

            case 'bill' :
                return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url2,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            res.data.forEach(elm => {
                                data['data'].push({bill_type : elm.bill_type, bill_qty : elm.kpi, _type : 'bill_split'});
                            });                            
                        })).then(function(){
                            return data;
                        });

                break;

            case 'month_trend':
                return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url3,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            res.data.forEach(elm => {
                                data['data'].push({month : elm.month, trend : elm.kpi, _type : 'month_trend'});
                            });
                        })
                    ).then(function(){
                        return data;
                    })
                break;
            case 'dt_trend' :
                let url12 = HomeServerManager.api_url+'getParc/015';
                return $.ajax({
                    method : 'GET',
                    url : url12,
                    data : filters,
                    dataType: 'json',
                    headers : {
                        "Authorization" : "Bearer "+getToken()
                    }
                }).done((res) => {
                    res.data.forEach(elm => {
                        data['data'].push({upd_dt : elm.upd_dt, trend_dt : elm.kpi, _type : 'dt_trend', period : elm.upd_dt.substr(0,7) });
                    });
                }).then(function(){
                    return data;
                })
            break;			
        }
   }	

   static getRevenue(type, filters, params) {
    let data = {data : []};
    let url01 = HomeServerManager.api_url+'getRevenue/0145',
            url1 = HomeServerManager.api_url+'getRevenue/0121',
            url11 = HomeServerManager.api_url+'getRevenue/0122',
            url12 = HomeServerManager.api_url+'getRevenue/01222';
    switch(type){



        case 'vue0' : 
           return $.ajax({
            method : 'GET',
            url : url01,
            data : filters,
            dataType: 'json',
            headers : {
                "Authorization" : "Bearer "+getToken()
            }
        }).done(function(res){
            res.data.forEach(elm => {
                for(let rt in rev_type) {
                    if(elm[rt] > 0 ) data['data'].push({rev_type : rt, revenue : Number.parseFloat(elm[rt]), _type : 'rev_split'});
                }

            });                            
        }).then(function(){
            return data;
        })

        break;
        case 'vue1' :
            
                return $.when(
                    $.ajax({
                        method : 'GET',
                        url : url1,
                        data : filters,
                        dataType: 'json',
                        headers : {
                            "Authorization" : "Bearer "+getToken()
                        }
                    }).done(function(res){
                        res.data.forEach(elm => {
                            for(let rt in rev_type) {
                                if(elm[rt] > 0 ) data['data'].push({rev_type : rt, revenue : Number.parseFloat(elm[rt]), _type : 'month_trend', month : elm.month});
                            }                                
                        });                            
                    })
                    ).then(function(){
                        return data;
                    })
        break;
        case 'vue2' : 
        return $.when(
            $.ajax({
                method : 'GET',
                url : url11,
                data : filters,
                dataType: 'json',
                headers : {
                    "Authorization" : "Bearer "+getToken()
                }
            }).done(function(res){
                res.data.forEach(elm => {
                    for(let rt in rev_type) {
                        if(elm[rt] > 0 ) data['data'].push({rev_type : rt, revenue : Number.parseFloat(elm[rt]),  _type : 'dt_trend', upd_dt : elm.upd_dt, period : elm.upd_dt.substr(0,7)});
                    }                        

                });                            
            })
            ).then(function(dat){
                return data;
            })
        break;
        case 'vue3' : 
            return $.when(
                $.ajax({
                    method : 'GET',
                    url : url12,
                    data : filters,
                    dataType: 'json',
                    headers : {
                        "Authorization" : "Bearer "+getToken()
                    }
                }).done(function(res){
                    res.data.forEach(elm => {
                       for(let rt in rev_type) {
                            if(elm[rt] > 0 ) data['data'].push({rev_type : rt, revenue : Number.parseFloat(elm[rt]),  _type : 'slot_trend', slot : elm.slot, period : res['d1']});
                        }                            
                    });                            
                })
                ).then(function(dat){
                    return data;
                })
        break;
                         
        break;
    }

}	

static getData(type, filters) {

    let data = {data : []};
    let url1 = HomeServerManager.api_url+'getTraffic/021',
    url2 = HomeServerManager.api_url+'getTraffic/0241';
    switch(type){

        case 'bill' :

            return $.when(
                    $.ajax({
                        method : 'GET',
                        url : url1,
                        data : filters,
                        dataType: 'json',
                        headers : {
                            "Authorization" : "Bearer "+getToken()
                        }
                    }).done(function(res){
                        res.data.forEach(elm => {
                           if(elm.data_traff > 0) data['data'].push({bill_tpe : elm.bill_tpe, traffic : elm.data_traff, category : 'data'});
                        });                            
                    })
                    ).then(function(){
                        return data;
                    });

            break;

        case 'month_trend' :
            return $.when(
                    $.ajax({
                        method : 'GET',
                        url : url2,
                        data : filters,
                        dataType: 'json',
                        headers : {
                            "Authorization" : "Bearer "+getToken()
                        }
                    }).done(function(res){
                        res.data.forEach(elm => {
                            if(elm.data_traff > 0) data['data'].push({month : elm.month, trend : elm.data_traff, _type : 'month_trend'});
                        });                            
                    })
                ).then(function(){
                    return data;
                })
            break;
            case 'dt_trend' :

                let url12 = HomeServerManager.api_url+'getTraffic/0242';
                return $.ajax({
                    method : 'GET',
                    url : url12,
                    data : filters,
                    dataType: 'json',
                    headers : {
                        "Authorization" : "Bearer "+getToken()
                    }
                }).done((res) => {
                    res.data.forEach(elm => {
                        if(elm.data_traff > 0) data['data'].push({upd_dt : elm.upd_dt, trend_dt : elm.data_traff, _type : 'dt_trend', period : elm.upd_dt.substr(0,7)});
                    });
                }).then(function(){
                    return data;
                })
            break; 
    }

}	
static getRecharge(type, filters){
    let data = {data : []};
    let url1 = HomeServerManager.api_url+'getRecharge/003',
    url2 = HomeServerManager.api_url+'getRecharge/006';
        switch(type){

            case 'split' :

                return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url1,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            res.data.forEach(elm => {
                                data['data'].push({rec_type : elm.type_rec, qty : elm.kpi_qty, amnt : elm.kpi_amnt, _type : 'rec_split'});
                            });
                        }).then(function(){
                            return data;
                        }));
                    break;

            case 'month_trend' :        
                return $.when($.ajax({
                            method : 'GET',
                            url : url2,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            res.data.forEach(elm => {
                                data['data'].push({month : elm.month, trend : elm.kpi_amnt, _type : 'month_trend'});
                            });                            
                        })
                    ).then(function(){
                        return data;
                    })
                break;
            case 'dt_trend' :
                let url12 = HomeServerManager.api_url+'getRecharge/007';
                return $.ajax({
                    method : 'GET',
                    url : url12,
                    data : filters,
                    dataType: 'json',
                    headers : {
                        "Authorization" : "Bearer "+getToken()
                    }
                }).done((res) => {
                    res.data.forEach(elm => {
                        data['data'].push({upd_dt : elm.upd_dt, trend_dt : elm.kpi_amnt, _type : 'dt_trend', period : elm.upd_dt.substr(0,7)  });
                    });
                }).then(function(){
                    return data;
                })
            break;                 
        }
    } 

static getBundle(type, filters) {
        let data = {data : []};
        let url1 = HomeServerManager.api_url+'getRevenue/0081',
        url2 = HomeServerManager.api_url+'getRevenue/0141';
        switch(type){

            case 'split' :

                return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url1,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            res.data.forEach(elm => {
                               if(elm.kpi > 0) data['data'].push({bndle_type : elm.bndle_type,  amnt : elm.kpi, _type : 'bndle_split'});
                            });
                        })
                    ).then(function(){
                        return data;
                    });

                break;

            case 'month_trend' :
                return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url2,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            res.data.forEach(elm => {
                               if(elm.bndle > 0) data['data'].push({month : elm.month, trend : elm.bndle, _type : 'month_trend'});
                            });
                        })
                    ).then(function(){
                        return data;
                    });
                break;
                case 'dt_trend' :
                    let url12 = HomeServerManager.api_url+'getRevenue/0142';
                    return $.ajax({
                        method : 'GET',
                        url : url12,
                        data : filters,
                        dataType: 'json',
                        headers : {
                            "Authorization" : "Bearer "+getToken()
                        }
                    }).done((res) => {
                        res.data.forEach(elm => {
                           if( elm.bndle > 0) data['data'].push({upd_dt : elm.upd_dt, trend_dt : elm.bndle, _type : 'dt_trend', period : elm.upd_dt.substr(0,7)  });
                        });
                    }).then(function(){
                        return data;
                    })
                break;
        }

    }
	
static getTrafficSplitAll(type, filters, params) {

    let data = {data : []},
    url1 = HomeServerManager.api_url+'getTraffic/028',
    url2 = HomeServerManager.api_url+'getTraffic/029',
    url3 = HomeServerManager.api_url+'getTraffic/030';
    switch (type) {
        case 'vue1' :
            return $.when(
                $.ajax({
                    method : 'GET',
                    url : url1,
                    data : filters,
                    dataType: 'json',
                    headers : {
                        "Authorization" : "Bearer "+getToken()
                    }
                }).done(function(res){
                    res.data.forEach(elm => {
                        if(elm.voice_pyg > 0 || elm.voice_free > 0) data['data'].push({_kpi : 'voice', traffic : Number.parseFloat(elm.voice_pyg)+Number.parseFloat(elm.voice_free), _type : 'month_trend', month : elm.month });
                        if(elm.sms_pyg > 0 || elm.sms_free > 0) data['data'].push({_kpi : 'sms', traffic : Number.parseFloat(elm.sms_pyg)+Number.parseFloat(elm.sms_free), _type : 'month_trend', month : elm.month});
                        if(elm.data_pyg > 0 || elm.data_free > 0) data['data'].push({_kpi : 'data', traffic : Number.parseFloat(elm.data_pyg)+Number.parseFloat(elm.data_free), _type : 'month_trend', month : elm.month});                            
                    });                            
                })
                ).then(function(dat){
                    return data;
                })
        break;

        case 'vue2' :
            return $.when(
                $.ajax({
                    method : 'GET',
                    url : url2,
                    data : filters,
                    dataType: 'json',
                    headers : {
                        "Authorization" : "Bearer "+getToken()
                    }
                }).done(function(res){
                    res.data.forEach(elm => {
                        if(elm.voice_pyg > 0 || elm.voice_free > 0) data['data'].push({_kpi : 'voice', traffic : Number.parseFloat(elm.voice_pyg)+Number.parseFloat(elm.voice_free), _type : 'dt_trend', upd_dt : elm.upd_dt, period : elm.upd_dt.substr(0,7) });
                        if(elm.sms_pyg > 0 || elm.sms_free > 0) data['data'].push({_kpi : 'sms', traffic : Number.parseFloat(elm.sms_pyg)+Number.parseFloat(elm.sms_free), _type : 'dt_trend', upd_dt : elm.upd_dt, period : elm.upd_dt.substr(0,7)});
                        if(elm.data_pyg > 0 || elm.data_free > 0) data['data'].push({_kpi : 'data', traffic : Number.parseFloat(elm.data_pyg)+Number.parseFloat(elm.data_free), _type : 'dt_trend', upd_dt : elm.upd_dt, period : elm.upd_dt.substr(0,7)});                            
                    });                            
                })
                ).then(function(dat){
                    return data;
                })
        break;     
        
        
        case 'vue3' :
            return $.when(
                $.ajax({
                    method : 'GET',
                    url : url3,
                    data : filters,
                    dataType: 'json',
                    headers : {
                        "Authorization" : "Bearer "+getToken()
                    }
                }).done(function(res){
                    res.data.forEach(elm => {
                        if(elm.voice_pyg > 0 || elm.voice_free > 0) data['data'].push({_kpi : 'voice', traffic : Number.parseFloat(elm.voice_pyg)+Number.parseFloat(elm.voice_free), _type : 'slot_trend', slot : elm.slot, period : res['d1'] });
                        if(elm.sms_pyg > 0 || elm.sms_free > 0) data['data'].push({_kpi : 'sms', traffic : Number.parseFloat(elm.sms_pyg)+Number.parseFloat(elm.sms_free), _type : 'slot_trend', slot : elm.slot, period : res['d1']});
                        if(elm.data_pyg > 0 || elm.data_free > 0) data['data'].push({_kpi : 'data', traffic :  Number.parseFloat(elm.data_pyg)+Number.parseFloat(elm.data_free), _type : 'slot_trend', slot : elm.slot, period : res['d1']});
                        
                    });                            
                })
                ).then(function(dat){
                    return data;
                })
        break;            
    }
}

static getArpu(type, filters) {
    let data = {data : []},
    url2 = HomeServerManager.api_url+'getRevenue/0149';
    switch(type){


        case 'month_trend' :
            return $.when(
                    $.ajax({
                        method : 'GET',
                        url : url2,
                        data : filters,
                        dataType: 'json',
                        headers : {
                            "Authorization" : "Bearer "+getToken()
                        }
                    }).done(function(res){
                        res.data.forEach(elm => {
                           if(elm.parc > 0) data['data'].push({month : elm.month, trend : Number.parseFloat(elm.rev)/ Number.parseInt(elm.parc), _type : 'month_trend'});
                        });
                    })
                ).then(function(){
                    return data;
                });
            break;
            case 'dt_trend' :
                let url12 = HomeServerManager.api_url+'getRevenue/0150';
                return $.ajax({
                    method : 'GET',
                    url : url12,
                    data : filters,
                    dataType: 'json',
                    headers : {
                        "Authorization" : "Bearer "+getToken()
                    }
                }).done((res) => {
                    res.data.forEach(elm => {
                       if( elm.parc > 0) data['data'].push({upd_dt : elm.upd_dt, trend_dt : Number.parseFloat(elm.rev)/ Number.parseInt(elm.parc), _type : 'dt_trend', period : elm.upd_dt.substr(0,7)  });
                    });
                }).then(function(){
                    return data;
                })
            break;
    }

}


static getPay(type, filters){


   
    let data = {data : []};

    let url1 = HomeServerManager.api_url+'getBill/0021',
    url2 = HomeServerManager.api_url+'getBill/0031'
    switch(type){

        case 'month_trend':
            return $.when(
                    $.ajax({
                        method : 'GET',
                        url : url1,
                        data : filters,
                        dataType: 'json',
                        headers : {
                            "Authorization" : "Bearer "+getToken()
                        }
                    }).done(function(res){
                        //res = JSON.parse(res)
                        res.data.forEach(elm => {

                            data['data'].push({month : elm.month, revenue : Number.parseInt(elm.kpi), _type : 'month_trend', _kpi : elm.billing_type, clt_type : elm.billing_type});
                        });
                    })
                ).then(function(){
                    return data;
                })
            break;
        case 'dt_trend' :
            return $.ajax({
                method : 'GET',
                url : url2,
                data : filters,
                dataType: 'json',
                headers : {
                    "Authorization" : "Bearer "+getToken()
                }
            }).done((res) => {
                res.data.forEach(elm => {
                    data['data'].push({upd_dt : elm.upd_dt, revenue :  Number.parseInt(elm.kpi), _type : 'dt_trend',clt_type : elm.billing_type  ,_kpi : elm.billing_type,period : elm.upd_dt.substr(0,7) });
                });
            }).then(function(){
                return data;
            })
        break;

    }

}

}

export  class ParcServerManager {


    constructor(url){

        ParcServerManager.api_url =  url;

    }

    static getStat(type,filters) {

        let data = {data : []};
        let url = ParcServerManager.api_url+'getParc/0051';
	let k1 = 0, k2 = 0;
        let kpis = {};
        return $.when(
        $.ajax({
            method : 'GET',
            url : url,
            data : filters,
            dataType: 'json',
            headers : {
                "Authorization" : "Bearer "+getToken()
            }
        }).done(function(res){
		
	    k1 = res['data'][0]['prepaid_'];
	    k2 = res['data'][0]['prepaid'];
            data.data.push({ kpi : 'prepaid',  value : k2,
                var : (k1 > 0 )? (100*(k2 - k1)/k1).toFixed(2) : 100 });

	    k1 = res['data'][0]['postpaid_'];
            k2 = res['data'][0]['postpaid'];
            
            data.data.push({ kpi : 'postpaid',  value : k2,
                var : (k1 > 0 )? (100*(k2 - k1)/k1).toFixed(2) : 100 });

            k1 = res['data'][0]['pmobile_'];
            k2 = res['data'][0]['pmobile'];		
            data.data.push({ kpi : 'pmobile',  value : k2,
                var : ( k1 > 0 )? (100*(k2 - k1)/k1).toFixed(2) : 100 });
            
            k1 = res['data'][0]['pfixe_'];
            k2 = res['data'][0]['pfixe']; 		
            data.data.push({ kpi : 'pfixe',  value : k2,
                var : ( k1 > 0 )? (100*(k2- k1)/k1).toFixed(2) : 100 });

            k1 = res['data'][0]['plte_'];
            k2 = res['data'][0]['plte'];		
            data.data.push({kpi : 'plte', value : k2, 
            var : ( k1 > 0 )? (100*(k2 - k1)/k1).toFixed(2) : 100 })
            })
        ).then(function(d){
                return data;
        });
    }

    static getParcByBill(type,filters) {

        let data = {data : []};
        let url1 = ParcServerManager.api_url+'getParc/0041';
        switch(type){

            case 'vue1' :
                return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url1,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            res.data.forEach(elm => {
                                data['data'].push({bill_type : elm.bill_type, bill_qty : elm.kpi});
                            });                            
                        })).then(function(){
                            return data;
                        });

                break;               
        }
    }


/*
    static getOpSplit(type, filters) {
        let data = {data : []};
        switch(type){

            case 'vue1' :
                let url1 = ParcServerManager.api_url+'getParc/009',
                 url2 = ParcServerManager.api_url+'getParc/002';
                 let operators = {};
                return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url1,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            
                            res.data.forEach(elm => {
                                //operators[elm.op_name].push({month : elm.month, trend : elm.kpi})
                                data['data'].push({month : elm.month, operator : elm.op_name,trend : elm.kpi, _type : 'month_trend'});
                            });
                        }),
                        $.ajax({
                            method : 'GET',
                            url : url2,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            res.data.forEach(elm => {
                                data['data'].push({operator : elm.op_name, op_qty : elm.kpi, _type : 'op_split'});
                            });
                            
                        }),
                    ).then(function(){

                        return data;
                    })
            break;

            case 'vue2' :
                let url12 = ParcServerManager.api_url+'getParc/0091';
                return $.ajax({
                    method : 'GET',
                    url : url12,
                    data : filters,
                    dataType: 'json',
                    headers : {
                        "Authorization" : "Bearer "+getToken()
                    }
                }).done((res) => {
                    res.data.forEach(elm => {
                        data['data'].push({evt_dt : elm.evt_dt, operator : elm.op_name, trend : elm.kpi, _type : 'dt_trend', period : elm.evt_dt.substr(0,7) });
                    });
                }).then(function(){
                    return data;
                })
            break;
        }

    }
    */

    /*static getINSplit(type, filters) {
        let data = {data : []};
        switch(type){

            case 'vue1' :
                let url1 = ParcServerManager.api_url+'getParc/019',
                 url2 = ParcServerManager.api_url+'getParc/021';
                return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url1,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            
                            res.data.forEach(elm => {
                                data['data'].push({month : elm.month, statut : elm.statut,trend : elm.kpi, _type : 'month_trend'});
                            });
                        }),
                        $.ajax({
                            method : 'GET',
                            url : url2,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            res.data.forEach(elm => {
                                data['data'].push({statut : elm.statut, qty : elm.kpi, _type : 'statut_split'});
                            });
                            
                        }),
                    ).then(function(){

                        return data;
                    })
            break;

            case 'vue2' :
                let url12 = ParcServerManager.api_url+'getParc/020';
                return $.ajax({
                    method : 'GET',
                    url : url12,
                    data : filters,
                    dataType: 'json',
                    headers : {
                        "Authorization" : "Bearer "+getToken()
                    }
                }).done((res) => {
                    res.data.forEach(elm => {
                        data['data'].push({evt_dt : elm.upd_dt, statut : elm.statut, trend : elm.kpi, _type : 'dt_trend', period : elm.upd_dt.substr(0,7) });
                    });
                }).then(function(){
                    return data;
                })
            break;
        }

    }*/

    static getParcByType(type,filters,params) {

        let data = {data : []};
        let url1 = ParcServerManager.api_url+'getParc/022';
        let url2 = ParcServerManager.api_url+'getParc/024';
        let url3 = ParcServerManager.api_url+'getParc/025';
      
        switch(type){

            case 'split' :
                
                let dat = {};
                return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url1,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            res.data.sort((a,b) => a.kpi - b.kpi);
                            res.data.forEach(elm => {
                                data['data'].push({off_group : elm.offer_group, qty : elm.kpi , _type : 'off_split'});
                            });
                        })
                    ).then(function(){                            
                        return data;
                    })
                break;

                case 'month_trend':
                    return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url2,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            //res = JSON.parse(res)
                            res.data.forEach(elm => {

                                data['data'].push({month : elm.month, qty : Number.parseInt(elm.kpi), off_group : elm.grp,_type : 'month_trend'});
                            });
                        })
                    ).then(function(){
                        return data;
                    })                        
                    break;
                case 'dt_trend' :

                    return $.ajax({
                        method : 'GET',
                        url : url3,
                        data : filters,
                        dataType: 'json',
                        headers : {
                            "Authorization" : "Bearer "+getToken()
                        }
                    }).done((res) => {
                        res.data.forEach(elm => {
                            data['data'].push({upd_dt : elm.upd_dt, qty :  Number.parseInt(elm.kpi), _type : 'dt_trend',off_group : elm.grp,period : elm.upd_dt.substr(0,7) });
                        });
                    }).then(function(){
                        return data;
                    })

                break;                    
            
        }
    }

    static getParcByOffer(type,filters) {

        let data = {data : []};
        let url1 = ParcServerManager.api_url+'getParc/023',
            url2 = ParcServerManager.api_url+'getParc/026',
            url3 = ParcServerManager.api_url+'getParc/028'
        switch(type){

            case 'vue1' :
                
                //let dat = [];
                return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url1,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            
                            data.data = getHierachy(res.data,['net','bill','mark', 'seg','cat','off'],'kpi')

                        })
                    ).then(function(){
                        return data
                    })
                break;

            case 'vue2' :
                return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url1,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            res.data.forEach(elm => {
                                elm._type = '_grpoff';
                                data.data.push(elm);
                            });
                        })
                    ).then(function(){
                        return data;
                    })
                break;                      

                case 'vue3' :
                
                    //let dat = [];
                    return $.when(
                            $.ajax({
                                method : 'GET',
                                url : url2,
                                data : filters,
                                dataType: 'json',
                                headers : {
                                    "Authorization" : "Bearer "+getToken()
                                }
                            }).done(function(res){
                                
                                data.data = getHierachy(res.data,['grp','off'],'kpi')
    
                            })
                        ).then(function(){
                            return data
                        })
                    break;
    
                case 'vue4' :
                    return $.when(
                            $.ajax({
                                method : 'GET',
                                url : url2,
                                data : filters,
                                dataType: 'json',
                                headers : {
                                    "Authorization" : "Bearer "+getToken()
                                }
                            }).done(function(res){
                                res.data.forEach(elm => {
                                    elm._type = '_grpoff';
                                    data.data.push(elm);
                                });
                            })
                        ).then(function(){
                            return data;
                        })
                    break; 
                    
                    case 'vue5' :
                        //let dat = [];
                        return $.when(
                                $.ajax({
                                    method : 'GET',
                                    url : url3,
                                    data : filters,
                                    dataType: 'json',
                                    headers : {
                                        "Authorization" : "Bearer "+getToken()
                                    }
                                }).done(function(res){
                                    
                                    data.data = getTreeHierachy(res.data,['bill',"mark","cat","seg","prod"],"parc",['qty']).map(d => ({...d,open : true}))                                    
        
                                })
                            ).then(function(){
                                return data
                            })
                        break;
                        
                        case 'vue6' :
                            //let dat = [];
                            return $.when(
                                    $.ajax({
                                        method : 'GET',
                                        url : url3,
                                        data : filters,
                                        dataType: 'json',
                                        headers : {
                                            "Authorization" : "Bearer "+getToken()
                                        }
                                    }).done(function(res){
                                        
                                        data.data = res.data
            
                                    })
                                ).then(function(){
                                    return data
                                })
                            break;                        
                           
        }
    }

    static getParcByStatus(type,filters){

        let data = {data : []};
        let url1 = ParcServerManager.api_url+'getParc/027';
        switch(type){

            case 'split' :
                
                let dat = {};
                return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url1,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            
                            data.data = getHierachy(res.data,['bill','network'],'kpi')
                        })
                    ).then(function(){                            
                        return data;
                    })
                break;

            case 'exp' :
                return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url1,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            res.data.forEach(elm => {
                               // elm._type = '_mkbt';
                                data.data.push(elm);
                            });
                        })
                    ).then(function(){
                        return data;
                    })
                break;                
        }

    }

    static getNetAdd(type , filters) {

        let data = {data : []};
        switch(type){

            case 'vue1' :
                let url1 = ParcServerManager.api_url+'getParc/007',
                    url2 = ParcServerManager.api_url+'getParc/0071';

                return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url1,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            res.data.forEach(elm => {
                                data['data'].push({upd_dt : elm.upd_dt,  netadd : elm.netadd,  _type : (elm.netadd < 0) ? 'minus' : 'plus' });
                            });
                        }),
                        $.ajax({
                            method : 'GET',
                            url : url2,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            let tab = [];
                            res.data.forEach(elm => {
                                for (const type in elm) {
                                    if (elm[type] > 0 ) data['data'].push({mvt : type, qty : elm[type],_type : 'mvt_split' })
                                }
                            });
                        })
                    ).then(function(){
                        return data;
                    })
                break;
        }


    }


}


export class RevenueServerManager {


    constructor(url){

         RevenueServerManager.api_url =  url;
    }


    static getStat(type,filters) {        
        let f1 = {...filters, 'b' : 'Prepaid'};
        let f2 = {...filters, 'b' : 'Postpaid'};
        let data = {data : []};
        let url = RevenueServerManager.api_url,
            url1 = url+'getRevenue/0143';
        return $.when(
        $.ajax({
            method : 'GET',
            url : url1,
            data : filters,
            dataType: 'json',
            headers : {
                "Authorization" : "Bearer "+getToken()
            }
        }).done(function(res){
            data['data'].push({kpi : 'rpyg' , value : res['data'][0]['pyg'], var : (res['data'][0]['pyg_12'] != 0 && res['data'][0]['pyg'] != null  && res['data'][0]['pyg_12'] != null )? (100*(res['data'][0]['pyg'] - res['data'][0]['pyg_12']) /res['data'][0]['pyg_12']).toFixed(2) : 100 });           
            data['data'].push({kpi : 'rmob' , value : res['data'][0]['mob'], var : (res['data'][0]['mob_12'] != 0 && res['data'][0]['mob'] != null && res['data'][0]['mob_12'] != null )? (100*(res['data'][0]['mob'] - res['data'][0]['mob_12']) /res['data'][0]['mob_12']).toFixed(2) : 100 });           
            data['data'].push({kpi : 'rlte' , value : res['data'][0]['lte'], var : (res['data'][0]['lte_12'] != 0 && res['data'][0]['lte'] != null && res['data'][0]['lte_12'] != null )? (100*(res['data'][0]['lte'] - res['data'][0]['lte_12']) /res['data'][0]['lte_12']).toFixed(2) : 100 });           
            data['data'].push({kpi : 'rprepaid' , value : res['data'][0]['prep'], var : (res['data'][0]['prep_12'] != 0 && res['data'][0]['prep'] != null && res['data'][0]['prep_12'] != null )? (100*(res['data'][0]['prep'] - res['data'][0]['prep_12']) /res['data'][0]['prep_12']).toFixed(2) : 100 });           
            data['data'].push({kpi : 'rpostpaid' , value : res['data'][0]['post'], var : (res['data'][0]['post_12'] != 0 && res['data'][0]['post'] != null  && res['data'][0]['post_12'] != null )? (100*(res['data'][0]['post'] - res['data'][0]['post_12']) /res['data'][0]['post_12']).toFixed(2) : 100 });           
            data['data'].push({kpi : 'rtot' , value : res['data'][0]['tot'], var : (res['data'][0]['tot_12'] != 0 && res['data'][0]['tot'] != null  && res['data'][0]['tot_12'] != null)? (100*(res['data'][0]['tot'] - res['data'][0]['tot_12']) /res['data'][0]['tot_12']).toFixed(2) : 100 });           

        })        
        ).then(function(d){
            return data;
        });        
    }

    static getRevenue(type,filters,params) {

        let data = {data : []};
        let url1 = RevenueServerManager.api_url+'getRevenue/0145',
            url2 = RevenueServerManager.api_url+'getRevenue/0121',
            url3 = RevenueServerManager.api_url+'getRevenue/0122',
            url4 = RevenueServerManager.api_url+'getRevenue/01222';

        switch(type){

            case 'split' :                
                return $.ajax({
                    method : 'GET',
                    url : url1,
                    data : filters,
                    dataType: 'json',
                    headers : {
                        "Authorization" : "Bearer "+getToken()
                    }
                }).done(function(res){
                    res.data.forEach(elm => {
                        for(let rt in rev_type) {
                            if(elm[rt] > 0 ) data['data'].push({rev_type : rt, revenue : Number.parseFloat(elm[rt]), _type : 'rev_split'});
                        }
        
                    });                            
                }).then(function(){
                    return data;
                })
                break;                            
                                     
            case 'month_trend' :
        
                return $.when(
                    $.ajax({
                        method : 'GET',
                        url : url2,
                        data : filters,
                        dataType: 'json',
                        headers : {
                            "Authorization" : "Bearer "+getToken()
                        }
                    }).done(function(res){
                        res.data.forEach(elm => {
                            for(let rt in rev_type) {
                                if(elm[rt] > 0 ) data['data'].push({rev_type : rt, revenue : Number.parseFloat(elm[rt]), _type : 'month_trend', month : elm.month});
                            }                                
                        });                            
                    })
                    ).then(function(){
                        return data;
                    })
                break;
            case 'dt_trend' : 
            return $.when(
                $.ajax({
                    method : 'GET',
                    url : url3,
                    data : filters,
                    dataType: 'json',
                    headers : {
                        "Authorization" : "Bearer "+getToken()
                    }
                }).done(function(res){
                    res.data.forEach(elm => {
                        for(let rt in rev_type) {
                            if(elm[rt] > 0 ) data['data'].push({rev_type : rt, revenue : Number.parseFloat(elm[rt]),  _type : 'dt_trend', upd_dt : elm.upd_dt, period : elm.upd_dt.substr(0,7)});
                        }                        
    
                    });                            
                })
                ).then(function(dat){
                    return data;
                })
            break;
            case 'slot_trend' : 
                return $.when(
                    $.ajax({
                        method : 'GET',
                        url : url4,
                        data : filters,
                        dataType: 'json',
                        headers : {
                            "Authorization" : "Bearer "+getToken()
                        }
                    }).done(function(res){
                        res.data.forEach(elm => {
                           for(let rt in rev_type) {
                                if(elm[rt] > 0 ) data['data'].push({rev_type : rt, revenue : Number.parseFloat(elm[rt]),  _type : 'slot_trend', slot : elm.slot, period : res['d1']});
                            }                            
                        });                            
                    })
                    ).then(function(dat){
                        return data;
                    })
            break;
        }
    }  
    
    

    static getRevTypeByNet(type,filters) {

        let data = {data : []};
        let url1 = RevenueServerManager.api_url+'getRevenue/0180'
        switch(type){

            case 'vue1' :
                
                //let dat = [];
                return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url1,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            
                            data.data = getHierachy(res.data,['type', 'grp'],'kpi')

                        })
                    ).then(function(){
                        return data
                    })
                break;

            case 'vue2' :
                return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url1,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            res.data.forEach(elm => {
                                elm._type = '_grpoff';
                                data.data.push(elm);
                            });
                        })
                    ).then(function(){
                        return data;
                    })
                break;                      
        }
    }


    static getRevTypeByProd(type,filters) {

        let data = {data : []};
        let url1 = RevenueServerManager.api_url+'getRevenue/0180'
        switch(type){

            case 'vue1' :                
                //let dat = [];
                return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url1,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                           // console.log(res.data);
                          // data.data = res.data
                           data.data = getTreeHierachy(res.data,['type',"grp"],"type",['kpi'])

                        })
                    ).then(function(){
                        return data
                    })
                break;

                case 'vue2' :
                
                    //let dat = [];
                    return $.when(
                            $.ajax({
                                method : 'GET',
                                url : url1,
                                data : filters,
                                dataType: 'json',
                                headers : {
                                    "Authorization" : "Bearer "+getToken()
                                }
                            }).done(function(res){
                               // console.log(res.data);
                                data.data = res.data
    
                            })
                        ).then(function(){
                            return data
                        })
                    break;                
                      
        }
    }


    static getRevLine(type,filters) {

        let data = {data : []};
        let url1 = RevenueServerManager.api_url+'getRevenue/0190';
        let url2 = RevenueServerManager.api_url+'getRevenue/0200';
        let url3 = RevenueServerManager.api_url+'getRevenue/0210';
        switch(type){

            case 'split' :
                
                let dat = {};
                return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url1,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            res.data.sort((a,b) => a.kpi - b.kpi);
                            res.data.forEach(elm => {
                                if( Number.parseInt(elm.kpi) > 0)  data['data'].push({off_group : elm.grp, revenue : elm.kpi, _type : elm.cat});
                            });
                        })
                    ).then(function(){                            
                        return data;
                    })
                break;
                case 'month_trend':
                    return $.when(
                            $.ajax({
                                method : 'GET',
                                url : url2,
                                data : filters,
                                dataType: 'json',
                                headers : {
                                    "Authorization" : "Bearer "+getToken()
                                }
                            }).done(function(res){
                                //res = JSON.parse(res)
                                res.data.forEach(elm => {
    
                                    if( Number.parseInt(elm.kpi) > 0)  data['data'].push({month : elm.month, revenue : Number.parseInt(elm.kpi), off_group : elm.grp,_type : 'month_trend',  _kpi : elm.cat});
                                });
                            })
                        ).then(function(){
                            return data;
                        })
                    break;
                case 'dt_trend' :
                    return $.ajax({
                        method : 'GET',
                        url : url3,
                        data : filters,
                        dataType: 'json',
                        headers : {
                            "Authorization" : "Bearer "+getToken()
                        }
                    }).done((res) => {
                        res.data.forEach(elm => {
                            if( Number.parseInt(elm.kpi) > 0) data['data'].push({upd_dt : elm.upd_dt, revenue :  Number.parseInt(elm.kpi), _type : 'dt_trend',off_group : elm.grp,period : elm.upd_dt.substr(0,7), _kpi : elm.cat });
                        });
                    }).then(function(){
                        return data;
                    })
                break;                    
            
        }
    }


    static getRevByOpType(type, filters) {

        let data = {data : []}, dat = {};
        switch(type){

            case 'vue1' :
                let url1 = RevenueServerManager.api_url+'getRevenue/0070';
                
                return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url1,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            res.data.sort((a,b) => a.kpi - b.kpi);
                            let rev = d3.sum(res.data, (d) => d.kpi);
                            res.data.forEach(elm => {
                                data.data.push({operator : elm.op_name, revenue : elm.kpi, _type : 'op_split', tot : rev});
                            });
                        })
                    ).then(function(){
                        return data;
                    })
                break;

                case 'vue2' :
                    let url2 = RevenueServerManager.api_url+'getRevenue/0071';
                    return $.when(
                            $.ajax({
                                method : 'GET',
                                url : url2,
                                data : filters,
                                dataType: 'json',
                                headers : {
                                    "Authorization" : "Bearer "+getToken()
                                }
                            }).done(function(res){
                                res.data.sort((a,b) => a.kpi - b.kpi);
                                let traf = d3.sum(res.data, (d) => d.kpi);
                                res.data.forEach(elm => {
                                    data.data.push({operator : elm.op_name, traffic : elm.kpi, _type : 'op_split', tot : traf});
                                });
                            })
                        ).then(function(){
                            return data;
                        })
                    break;                
        }
    }

    static getRevTypeClt(type,filters){

        let data = {data : []};
        let url1 = RevenueServerManager.api_url+'getRevenue/01800';
        switch(type){

            case 'vue1' :
                
                let dat = {};
                return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url1,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            
                            data.data = getHierachy(res.data,['mark','cat','bill'],'kpi')
                        })
                    ).then(function(){                            
                        return data;
                    })
                break;

            case 'vue2' :
                return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url1,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            res.data.forEach(elm => {
                               // elm._type = '_mkbt';
                                data.data.push(elm);
                            });
                        })
                    ).then(function(){
                        return data;
                    })
                break;                
        }

    }


    static getRevByBundleType(type, filters) {

        let data = {data : []};
        let url1 = RevenueServerManager.api_url+'getRevenue/008';
        let dat = {};
        switch(type){

            case 'vue1' :
                
                
                return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url1,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            let rev = d3.sum(res.data, (d) => d.kpi);
                            let dat = [];
                            res.data.forEach(elm => {
                              if(elm.kpi > 0) dat[elm.bndle_type] = (typeof dat[elm.bndle_type] == 'undefined')? [{name : elm.bndle_group, value : elm.kpi}]: [...dat[elm.bndle_type],{name : elm.bndle_group, value : elm.kpi}];
                              
                              //if(elm.kpi != 0)  data.data.push({name : elm.bndle_type, value : elm.kpi, _type : 'bndle_split', tot : rev});
                            });
                            for (const type in dat) {
                                let doc = {name : type, children : [], _type : 'bndle_split'};
                                let tot = d3.sum(dat[type], (d) => d.value);
                                for (const elm of dat[type]) {
                                    doc.children.push({name : elm.name , value : elm.value, tot : tot});
                                }
                                doc.value = tot;
                                doc.tot = rev;
                                if(doc.children.length == 1 && doc.children[0]["name"] == "Inconnu") delete doc.children;
                                data.data.push(doc); 
                            }
                        })
                    ).then(function(){
                        return data;
                    })
                break;

            case 'vue2' :
                return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url1,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            res.data.forEach(elm => {
                                elm._type = 'bndle';
                                if(elm.kpi != 0)  data.data.push(elm);
                            });
                        })
                    ).then(function(){
                        return data;
                    })
                break;                
        }
    }

    static getRevGeo(type, filters){

        let data = {data : []};
        switch(type){

            case 'vue1' :
                let url1 = RevenueServerManager.api_url+'getRevenue/009';
                    return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url1,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            res.data.forEach(elm => {
                              if(elm.sms > 0)  data['data'].push({/*commune : elm.commune,  district : elm.district,*/ region :elm.region, zoneorange : elm.region, value : elm.sms, _type : 'sms_split'});
                              if(elm.voice > 0)  data['data'].push({/*commune : elm.commune,  district : elm.district,*/ region :elm.region, zoneorange : elm.region, value : elm.voice, _type : 'voice_split'});
                              if(elm.bndle > 0)  data['data'].push({/*commune : elm.commune,  district : elm.district,*/ region :elm.region, zoneorange : elm.region, value : elm.bndle, _type : 'bndle_split'});
                              if(elm.fees > 0)  data['data'].push({/*commune : elm.commune,  district : elm.district,*/ region :elm.region, zoneorange : elm.region, value : elm.fees, _type : 'fees_split'});

                            });
                        })                        
                    ).then(function(){
                        return data;
                    })
                break;

            case 'vue2' :
                let url2 = RevenueServerManager.api_url+'getRevenue/0090';
                    return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url2,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            data = res;
                        })                        
                    ).then(function(){
                        return data;
                    })
                break;
        }
    }


    static getRoaming(type, filters) {

        let data = {data : []}, dat = {};
        switch(type){

            case 'vue1' :
                let url1 = RevenueServerManager.api_url+'getRevenue/0147';
                
                return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url1,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            let rev = d3.sum(res.data, (d) => d.revenue);
                            res.data.sort((a,b) => b.revenue - a.revenue);
                            let i = 1, othrev = 0;
                            
                            res.data.forEach(elm => {
                                if(i <=10){
                                    if(elm.revenue > 0) data.data.push({country : elm.count, revenue : elm.revenue, _type : 'count_split', tot : rev});
                                }
                                //else othrev+= Number.parseFloat(elm.revenue);
                                i++;
                            });
			    data.data.sort((a,b) => a.revenue - b.revenue);
                            //if(othrev > 0) data.data.unshift({country : "Autres", revenue : othrev, tot : rev, _type : 'count_split'});
                            //data.data.sort((a,b) => a.revenue - b.revenue);
                            
                        })
                    ).then(function(){
                        return data;
                    })
                break;

                case 'vue2' :
                    let url2 = RevenueServerManager.api_url+'getRevenue/0148';
                    return $.when(
                            $.ajax({
                                method : 'GET',
                                url : url2,
                                data : filters,
                                dataType: 'json',
                                headers : {
                                    "Authorization" : "Bearer "+getToken()
                                }
                            }).done(function(res){
                                res.data.sort((a,b) => b.traffic - a.traffic);
                                let traf = d3.sum(res.data, (d) => d.traffic);
                                let i = 1;
                                let othrev = 0;
                            
                                res.data.forEach(elm => {
                                    if(i <=10){
                                        if(elm.traffic > 0) data.data.push({country : elm.count, traffic : elm.traffic, _type : 'count_split', tot : traf});
                                    }
                              //      else othrev+= Number.parseFloat(elm.traffic);
                                    i++;
                                });
                                data.data.sort((a,b) => a.traffic - b.traffic);
				//if(othrev > 0) data.data.unshift({country : "Autres", traffic : othrev, tot : traf, _type : 'count_split'});
                                //data.data.sort((a,b) => a.traffic - b.traffic);
                            })
                        ).then(function(){
                            return data;
                        })
                    break;                
        }
    }
    


}


export class TrafficServerManager {


    constructor(url){

         TrafficServerManager.api_url =  url;
    }

    static getStat(type,filters) {        

        let data = {data : []};
        let url = TrafficServerManager.api_url,
            url1 = url+'getTraffic/027',
            url2 = url+'getRevenue/0143';


        let k1 = 0,k2 = 0,
          rpyg = 0;
        return $.when(
        $.ajax({
            method : 'GET',
            url : url1,
            data : filters,
            dataType: 'json',
            headers : {
                "Authorization" : "Bearer "+getToken()
            }
        }).done(function(res){
            k1 = Number.parseFloat(res['data'][0]['voice_']);
	    k2 = Number.parseFloat(res['data'][0]['voice']);
            data['data'].push({kpi : 'voice' , value : k2, var : (k1 != 0 && k1 != null  ) ? (100*(k2 - k1)/k1).toFixed(2) : 100 }); 

            k1 = Number.parseFloat(res['data'][0]['sms_']);
	    k2 = Number.parseFloat(res['data'][0]['sms']);
            data['data'].push({kpi : 'sms' , value : k2, var : (k1 != 0 && k1 != null )? (100*(k2 - k1)/k1).toFixed(2) : 100 }); 

            k1 = Number.parseFloat(res['data'][0]['data_']);
	    k2 = Number.parseFloat(res['data'][0]['data']);
            data['data'].push({kpi : 'data' , value : k2, var : (k1 != 0 && k1 != null)? (100*(k2 - k1)/k1).toFixed(2) : 100 }); 

        }),
        $.ajax({
            method : 'GET',
            url : url2,
            data : filters,
            dataType: 'json',
            headers : {
                "Authorization" : "Bearer "+getToken()
            }
        }).done(function(res){
          data['data'].push({kpi : 'rpyg' , value : res['data'][0]['pyg'], var : (res['data'][0]['pyg'] != 0 && res['data'][0]['pyg_12'] != null && res['data'][0]['pyg'] != null)? (100*(res['data'][0]['pyg'] - res['data'][0]['pyg_12']) /res['data'][0]['pyg_12']).toFixed(2) : 100 });           
        })  
        ).then(function(d){
		    return data;
        });        
    }

    static getTrafficGeo(type, filters, params){

        let data = {data : []};
        switch(type){

            case 'vue1' :
                let url1 = TrafficServerManager.api_url+'getTraffic/006',
                    url2 = TrafficServerManager.api_url+'getTraffic/007',
                    url3 = TrafficServerManager.api_url+'getTraffic/008',
                    url4 = TrafficServerManager.api_url+'getTraffic/009',
                    url5 = TrafficServerManager.api_url+'getTraffic/0090';
                switch (params) {

                    case 'voice' : 
                        return $.when(
                                $.ajax({
                                    method : 'GET',
                                    url : url1,
                                    data : filters,
                                    dataType: 'json',
                                    headers : {
                                        "Authorization" : "Bearer "+getToken()
                                    }
                                }).done(function(res){
                                    data = res;
                                })                        
                            ).then(function(){
                                return data;
                            })
                        break;

                    case 'sms' : 
                        return $.when(
                            $.ajax({
                                method : 'GET',
                                url : url2,
                                data : filters,
                                dataType: 'json',
                                headers : {
                                    "Authorization" : "Bearer "+getToken()
                                }
                            }).done(function(res){
                                data = res;
                            })                        
                            ).then(function(){
                                return data;
                            })
                        break;                    
                        case 'data' : 
                            let url31 = TrafficServerManager.api_url+'getTraffic/035',
                                url32 = TrafficServerManager.api_url+'getRevenue/0146';
                        /*return $.when(
                            $.ajax({
                                method : 'GET',
                                url : url3,
                                data : filters,
                                dataType: 'json',
                                headers : {
                                    "Authorization" : "Bearer "+getToken()
                                }
                            }).done(function(res){
                                data = res;
                            }),

                            ).then(function(){
                                return data;
                            })*/
                            return $.when(
                                $.ajax({
                                    method : 'GET',
                                    url : url31,
                                    data : filters,
                                    dataType: 'json',
                                    headers : {
                                        "Authorization" : "Bearer "+getToken()
                                    }
                                }).done(function(res){
                                    data = res;
                                }),
                                /*$.ajax({
                                    method : 'GET',
                                    url : url32,
                                    data : filters,
                                    dataType: 'json',
                                    headers : {
                                        "Authorization" : "Bearer "+getToken()
                                    }
                                }).done(function(res){
                                    data = res;
                                })*/
    
                                ).then(function(){
                                    return data;
                                })
                        break;

                        case 'all' : 
                        return $.when(
                                $.ajax({
                                    method : 'GET',
                                    url : url4,
                                    data : filters,
                                    dataType: 'json',
                                    headers : {
                                        "Authorization" : "Bearer "+getToken()
                                    }
                                }).done(function(res){
                                    res.data.forEach(elm => {
                                    if(elm.voice > 0)  data['data'].push({/*commune : elm.commune,  district : elm.district,*/ zoneorange : elm.region, value : elm.voice, _type : 'voice_split'});
                                    if(elm.data > 0)  data['data'].push({/*commune : elm.commune,  district : elm.district,*/ zoneorange : elm.region, value : elm.data, _type : 'data_split'});
                                    if(elm.sms > 0)  data['data'].push({/*commune : elm.commune,  district : elm.district,*/ zoneorange : elm.region, value : elm.sms, _type : 'sms_split'});
                                    });
                                })                        
                            ).then(function(){
                                return data;
                            })
                        break;
                        case 'all0' : 
                        return $.when(
                                $.ajax({
                                    method : 'GET',
                                    url : url5,
                                    data : filters,
                                    dataType: 'json',
                                    headers : {
                                        "Authorization" : "Bearer "+getToken()
                                    }
                                }).done(function(res){
                                    data = res;
                                })                        
                            ).then(function(){
                                return data;
                            })
                        break;
                }
                break;
        }
    }


    static getTrafficIntGeo(type, filters, params){

        let data = {data : []};
        let url1 = TrafficServerManager.api_url+'getTraffic/014',
        url2 = TrafficServerManager.api_url+'getTraffic/020',
        url3 = TrafficServerManager.api_url+'getTraffic/0140';
        switch(type){
            case 'vue1' :                
                switch (params) {
                    case 'voice' : 
                        return $.when(
                                $.ajax({
                                    method : 'GET',
                                    url : url1,
                                    data : filters,
                                    dataType: 'json',
                                    headers : {
                                        "Authorization" : "Bearer "+getToken()
                                    }
                                }).done(function(res){
                                    res.data.forEach(elm => {
                                    if(elm.voice_traff > 0)  data['data'].push({code : elm.code, country : elm.country, value : Number.parseFloat(elm.voice_traff), _type : 'voice_geo_split'});
                                    });
                                })                        
                            ).then(function(){
                                return data;
                            })
                        break;

                    case 'sms' : 
                        return $.when(
                            $.ajax({
                                method : 'GET',
                                url : url2,
                                data : filters,
                                dataType: 'json',
                                headers : {
                                    "Authorization" : "Bearer "+getToken()
                                }
                            }).done(function(res){
                                res.data.forEach(elm => {
                                    if(elm.sms_traff > 0)  data['data'].push({code : elm.code, country : elm.country, value : Number.parseFloat(elm.sms_traff), _type : 'sms_geo_split'});
                                });
                            })                        
                            ).then(function(){
                                return data;
                            })
                        break;
                    case 'all' : 
                    return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url3,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            res.data.forEach(elm => {
                                if(elm.sms_traff > 0)  data['data'].push({code : elm.code, country : elm.country, value : Number.parseFloat(elm.sms_traff), _type : 'sms_geo_split'});
                                if(elm.voice_traff > 0)  data['data'].push({code : elm.code, country : elm.country, value : Number.parseFloat(elm.voice_traff), _type : 'voice_geo_split'});
                            });
                        })                        
                        ).then(function(){
                            return data;
                        })
                    break;                                            
                }
                break;

                case 'vue2' :

                    switch (params) {

                        case "all" :
                            return $.when(
                                $.ajax({
                                    method : 'GET',
                                    url : url3,
                                    data : filters,
                                    dataType: 'json',
                                    headers : {
                                        "Authorization" : "Bearer "+getToken()
                                    }
                                }).done(function(res){
                                    let smsdata = res.data.map((d) => {return {country : d.country, value : d.sms_traff}});
                                    let voicedata = res.data.map((d) => {return {country : d.country, value : d.voice_traff}});
                                    let smstot = d3.sum(smsdata, (d) => d.value);
                                    smsdata.sort((a,b) => b.value - a.value);
                                    let voicetot = d3.sum(voicedata, (d) => d.value);
                                    voicedata.sort((a,b) => b.value - a.value);                                    
                                    let i = 1, othsms = 0, othvoice = 0;
                                    
                                    smsdata.forEach(elm => {
                                        if(elm.country != "" && elm.country != "Inconnu"){
                                            if(i <=10){
                                                if(elm.value > 0)  data['data'].push({country : elm.country, value : elm.value, _type : 'sms_geo_split', tot : smstot});
                                            }
                                            /*else {
                                                if(elm.value > 0) othsms+= elm.value;
                                            }*/
                                            i++;
                                        }
                                        /*else {
                                            if(elm.value > 0) othsms+= elm.value;
                                        }*/
                                    });
                                    i = 1;
                                    voicedata.forEach(elm => {
                                        if(elm.country != "" && elm.country != "Inconnu"){
                                            if(i <=10){
                                                if(elm.value > 0)  data['data'].push({country : elm.country, value : elm.value, _type : 'voice_geo_split', tot : voicetot});
                                            }
                                            /*else {
                                                if(elm.value > 0) othvoice+= elm.value;
                                            }*/
                                            i++;
                                        }
                                        /*else {
                                            if(elm.value > 0) othvoice+= elm.value;
                                        }*/
                                    });                                    
                                   // if(othsms > 0) data.data.push({country : "Autres", value : othsms, tot : smstot, _type : 'sms_geo_split'});
                                    //if(othvoice > 0) data.data.push({country : "Autres", value : othvoice, tot : voicetot, _type : 'voice_geo_split'});
                                    //data.data.sort((a,b) => a.revenue - b.revenue);                                    
                                })
                            ).then(function(){
                                return data;
                            })
                        break;
                    }
                break;
        }
    }

    static getTrafficSplit(type, filters, params) {

        let data = {data : []},
        url1 = TrafficServerManager.api_url+'getTraffic/028',
        url2 = TrafficServerManager.api_url+'getTraffic/029',
        url3 = TrafficServerManager.api_url+'getTraffic/030';
        switch (type) {
            case 'vue1' :
                return $.when(
                    $.ajax({
                        method : 'GET',
                        url : url1,
                        data : filters,
                        dataType: 'json',
                        headers : {
                            "Authorization" : "Bearer "+getToken()
                        }
                    }).done(function(res){
                        res.data.forEach(elm => {
                            if(elm.voice_pyg > 0) data['data'].push({traff_type : 'voice', traffic : Number.parseFloat(elm.voice_pyg), _type : 'month_trend', month : elm.month, free : 'pyg' });
                            if(elm.sms_pyg > 0) data['data'].push({traff_type : 'sms', traffic : Number.parseFloat(elm.sms_pyg), _type : 'month_trend', month : elm.month, free : 'pyg'});
                            if(elm.data_pyg > 0) data['data'].push({traff_type : 'data', traffic : Number.parseFloat(elm.data_pyg), _type : 'month_trend', month : elm.month, free : 'pyg'});
                            
                            if(elm.voice_free > 0) data['data'].push({traff_type : 'voice', traffic : Number.parseFloat(elm.voice_free), _type : 'month_trend', month : elm.month, free : 'bundle' });
                            if(elm.sms_free > 0) data['data'].push({traff_type : 'sms', traffic : Number.parseFloat(elm.sms_free), _type : 'month_trend', month : elm.month, free : 'bundle'});
                            if(elm.data_free > 0) data['data'].push({traff_type : 'data', traffic : Number.parseFloat(elm.data_free), _type : 'month_trend', month : elm.month, free : 'bundle'});                            

                        });                            
                    })
                    ).then(function(dat){
                        return data;
                    })
            break;

            case 'vue2' :
                return $.when(
                    $.ajax({
                        method : 'GET',
                        url : url2,
                        data : filters,
                        dataType: 'json',
                        headers : {
                            "Authorization" : "Bearer "+getToken()
                        }
                    }).done(function(res){
                        res.data.forEach(elm => {
                            if(elm.voice_pyg > 0) data['data'].push({traff_type : 'voice', traffic : Number.parseFloat(elm.voice_pyg), _type : 'dt_trend', upd_dt : elm.upd_dt, free : 'pyg', period : elm.upd_dt.substr(0,7) });
                            if(elm.sms_pyg > 0) data['data'].push({traff_type : 'sms', traffic : Number.parseFloat(elm.sms_pyg), _type : 'dt_trend', upd_dt : elm.upd_dt, free : 'pyg', period : elm.upd_dt.substr(0,7)});
                            if(elm.data_pyg > 0) data['data'].push({traff_type : 'data', traffic : Number.parseFloat(elm.data_pyg), _type : 'dt_trend', upd_dt : elm.upd_dt, free : 'pyg', period : elm.upd_dt.substr(0,7)});
                            
                            if(elm.voice_free > 0) data['data'].push({traff_type : 'voice', traffic : Number.parseFloat(elm.voice_free), _type : 'dt_trend', upd_dt : elm.upd_dt, free : 'bundle', period : elm.upd_dt.substr(0,7) });
                            if(elm.sms_free > 0) data['data'].push({traff_type : 'sms', traffic : Number.parseFloat(elm.sms_free), _type : 'dt_trend', upd_dt : elm.upd_dt, free : 'bundle', period : elm.upd_dt.substr(0,7)});
                            if(elm.data_free > 0) data['data'].push({traff_type : 'data', traffic : Number.parseFloat(elm.data_free), _type : 'dt_trend', upd_dt : elm.upd_dt, free : 'bundle', period : elm.upd_dt.substr(0,7)});                            

                        });                            
                    })
                    ).then(function(dat){
                        return data;
                    })
            break;     
            
            
            case 'vue3' :
                return $.when(
                    $.ajax({
                        method : 'GET',
                        url : url3,
                        data : filters,
                        dataType: 'json',
                        headers : {
                            "Authorization" : "Bearer "+getToken()
                        }
                    }).done(function(res){
                        res.data.forEach(elm => {
                            if(elm.voice_pyg > 0) data['data'].push({traff_type : 'voice', traffic : Number.parseFloat(elm.voice_pyg), _type : 'slot_trend', slot : elm.slot, free : 'pyg', period : res['d1'] });
                            if(elm.sms_pyg > 0) data['data'].push({traff_type : 'sms', traffic : Number.parseFloat(elm.sms_pyg), _type : 'slot_trend', slot : elm.slot, free : 'pyg', period : res['d1']});
                            if(elm.data_pyg > 0) data['data'].push({traff_type : 'data', traffic : Number.parseFloat(elm.data_pyg), _type : 'slot_trend', slot : elm.slot, free : 'pyg', period : res['d1']});
                            
                            if(elm.voice_free > 0) data['data'].push({traff_type : 'voice', traffic : Number.parseFloat(elm.voice_free), _type : 'slot_trend', slot : elm.slot, free : 'bundle', period : res['d1'] });
                            if(elm.sms_free > 0) data['data'].push({traff_type : 'sms', traffic : Number.parseFloat(elm.sms_free), _type : 'slot_trend', slot : elm.slot, free : 'bundle', period : res['d1']});
                            if(elm.data_free > 0) data['data'].push({traff_type : 'data', traffic : Number.parseFloat(elm.data_free), _type : 'slot_trend', slot : elm.slot, free : 'bundle', period : res['d1']});                            

                        });                            
                    })
                    ).then(function(dat){
                        return data;
                    })
            break;            
        }
    }


    static getTrafficSplitAll(type, filters, params) {

        let data = {data : []},
        url1 = TrafficServerManager.api_url+'getTraffic/028',
        url2 = TrafficServerManager.api_url+'getTraffic/029',
        url3 = TrafficServerManager.api_url+'getTraffic/030';
        switch (type) {
            case 'vue1' :
                return $.when(
                    $.ajax({
                        method : 'GET',
                        url : url1,
                        data : filters,
                        dataType: 'json',
                        headers : {
                            "Authorization" : "Bearer "+getToken()
                        }
                    }).done(function(res){
                        res.data.forEach(elm => {
                            if(elm.voice_pyg > 0 || elm.voice_free > 0) data['data'].push({traff_type : 'voice', traffic : Number.parseFloat(elm.voice_pyg)+Number.parseFloat(elm.voice_free), _type : 'month_trend', month : elm.month });
                            if(elm.sms_pyg > 0 || elm.sms_free > 0) data['data'].push({traff_type : 'sms', traffic : Number.parseFloat(elm.sms_pyg)+Number.parseFloat(elm.sms_free), _type : 'month_trend', month : elm.month});
                            if(elm.data_pyg > 0 || elm.data_free) data['data'].push({traff_type : 'data', traffic : Number.parseFloat(elm.data_pyg)+Number.parseFloat(elm.data_free), _type : 'month_trend', month : elm.month});                            
                        });                            
                    })
                    ).then(function(dat){
                        return data;
                    })
            break;

            case 'vue2' :
                return $.when(
                    $.ajax({
                        method : 'GET',
                        url : url2,
                        data : filters,
                        dataType: 'json',
                        headers : {
                            "Authorization" : "Bearer "+getToken()
                        }
                    }).done(function(res){
                        res.data.forEach(elm => {
                            if(elm.voice_pyg > 0 || elm.voice_free > 0) data['data'].push({traff_type : 'voice', traffic : Number.parseFloat(elm.voice_pyg)+Number.parseFloat(elm.voice_free), _type : 'dt_trend', upd_dt : elm.upd_dt, period : elm.upd_dt.substr(0,7) });
                            if(elm.sms_pyg > 0 || elm.sms_free > 0) data['data'].push({traff_type : 'sms', traffic : Number.parseFloat(elm.sms_pyg)+Number.parseFloat(elm.sms_free), _type : 'dt_trend', upd_dt : elm.upd_dt, period : elm.upd_dt.substr(0,7)});
                            if(elm.data_pyg > 0 || elm.data_free) data['data'].push({traff_type : 'data', traffic : Number.parseFloat(elm.data_pyg)+Number.parseFloat(elm.data_free), _type : 'dt_trend', upd_dt : elm.upd_dt, period : elm.upd_dt.substr(0,7)});                            
                        });                            
                    })
                    ).then(function(dat){
                        return data;
                    })
            break;     
            
            
            case 'vue3' :
                return $.when(
                    $.ajax({
                        method : 'GET',
                        url : url3,
                        data : filters,
                        dataType: 'json',
                        headers : {
                            "Authorization" : "Bearer "+getToken()
                        }
                    }).done(function(res){
                        res.data.forEach(elm => {
                            if(elm.voice_pyg > 0 || elm.voice_free > 0) data['data'].push({traff_type : 'voice', traffic : Number.parseFloat(elm.voice_pyg)+Number.parseFloat(elm.voice_free), _type : 'slot_trend', slot : elm.slot, period : res['d1'] });
                            if(elm.sms_pyg > 0 || elm.sms_free > 0) data['data'].push({traff_type : 'sms', traffic : Number.parseFloat(elm.sms_pyg)+Number.parseFloat(elm.sms_free), _type : 'slot_trend', slot : elm.slot, period : res['d1']});
                            if(elm.data_pyg > 0 || elm.data_free) data['data'].push({traff_type : 'data', traffic :  Number.parseFloat(elm.data_pyg)+Number.parseFloat(elm.data_free), _type : 'slot_trend', slot : elm.slot, period : res['d1']});
                            
                        });                            
                    })
                    ).then(function(dat){
                        return data;
                    })
            break;            
        }
    }

    static getTrafficByDest(type, filters, params) {

        let data = {data : []},
        url1 = TrafficServerManager.api_url+'getTraffic/031';
        switch (type) {
            case 'vue1' :
                return $.when(
                    $.ajax({
                        method : 'GET',
                        url : url1,
                        data : filters,
                        dataType: 'json',
                        headers : {
                            "Authorization" : "Bearer "+getToken()
                        }
                    }).done(function(res){
                        res.data.forEach(elm => {
                            if(elm.voice_in > 0) data['data'].push({traff_type : 'voice', traffic : Number.parseFloat(elm.voice_in), _type : 'dt_trend', upd_dt : elm.upd_dt, traff_dir : 'in' , traff_cat : elm.type });
                            if(elm.voice_out > 0) data['data'].push({traff_type : 'voice', traffic : Number.parseFloat(elm.voice_out), _type : 'dt_trend', upd_dt : elm.upd_dt, traff_dir : 'out' , traff_cat : elm.type });
                            if(elm.sms_in > 0) data['data'].push({traff_type : 'sms', traffic : Number.parseFloat(elm.sms_in), _type : 'dt_trend', upd_dt : elm.upd_dt, traff_dir : 'in' , traff_cat : elm.type });
                            if(elm.sms_out > 0) data['data'].push({traff_type : 'sms', traffic : Number.parseFloat(elm.sms_out), _type : 'dt_trend', upd_dt : elm.upd_dt, traff_dir : 'out' , traff_cat : elm.type });
                        });                            
                    })
                    ).then(function(dat){
                        return data;
                    })
            break;
        }

    }

    //dat[elm.bill_type] = (typeof dat[elm.bill_type] == 'undefined') ? [{name : elm.market, value : elm.kpi}] : [...dat[elm.bill_type], {name : elm.market, value : elm.kpi}];

    static getTrafficByOff(type, filters, params) {

        let data = {data : []},dat = {voice : {}, sms : {},data : {} },
        url1 = TrafficServerManager.api_url+'getTraffic/032';
        switch (type) {
            case 'vue1' :
                return $.when(
                    $.ajax({
                        method : 'GET',
                        url : url1,
                        data : filters,
                        dataType: 'json',
                        headers : {
                            "Authorization" : "Bearer "+getToken()
                        }
                    }).done(function(res){
                        data.data = getHierachy(res.data,['billing_type','offer_group','offer'],'voice_traff').map(d => ({...d, traff_type : "voice"}))
                        console.log(data.data)
                        data.data = [...data.data,... (getHierachy(res.data,['billing_type','offer_group','offer'],'sms_traff').map(d => ({...d, traff_type : "sms"})))] 
                        data.data = [...data.data,...(getHierachy(res.data,['billing_type','offer_group','offer'],'data_traff').map(d => ({...d, traff_type : "data"})))]
                    })
                    ).then(function(d){
                        console.log(data.data)
                        return data;
                    })
            break;

            case 'vue2' :
                return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url1,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            res.data.forEach(elm => {
                                if(elm.voice_traff > 0) data.data.push({_type : 'voice', offer : elm.offer, produit : elm.offer_group, bill_tpe : elm.billing_type, value : elm.voice_traff });
                                if(elm.sms_traff > 0) data.data.push({_type : 'sms', offer : elm.offer, produit : elm.offer_group,bill_tpe : elm.billing_type, value : elm.sms_traff});
                                if(elm.data_traff > 0) data.data.push({_type : 'data', offer : elm.offer,produit : elm.offer_group, bill_tpe : elm.billing_type, value : elm.data_traff});
                            });
                        })
                    ).then(function(){
                        return data;
                    })
                break;            
        }

    }


    static getTraffByOpType(type, filters) {

        let data = {data : []};
        switch(type){

            case 'vue1' :
                let url1 = TrafficServerManager.api_url+'getTraffic/033';
                    return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url1,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            let rev = d3.sum(res.data, (d) => d.kpi);
                            res.data.forEach(elm => {
                                if(elm.voice_in > 0) data['data'].push({traff_type : 'voice', traffic : Number.parseFloat(elm.voice_in), _type : 'in',operator : elm.operator, traff_dir : 'in', tot : Number.parseFloat(elm.voice_in)+Number.parseFloat(elm.voice_out) });
                                if(elm.voice_out > 0) data['data'].push({traff_type : 'voice', traffic : Number.parseFloat(elm.voice_out), _type : 'out',operator : elm.operator, traff_dir : 'out', tot : Number.parseFloat(elm.voice_in)+Number.parseFloat(elm.voice_out) });
                                if(elm.sms_in > 0) data['data'].push({traff_type : 'sms', traffic : Number.parseFloat(elm.sms_in), _type : 'in',operator : elm.operator, traff_dir : 'in', tot : Number.parseFloat(elm.sms_in)+Number.parseFloat(elm.sms_out) });
                                if(elm.sms_out > 0) data['data'].push({traff_type : 'sms', traffic : Number.parseFloat(elm.sms_out), _type : 'out',operator : elm.operator, traff_dir : 'out', tot : Number.parseFloat(elm.sms_in)+Number.parseFloat(elm.sms_out) });
                                });
                        })
                    ).then(function(){
                        return data;
                    })
                break;
        }
    }

    static getTraffDataBill(type, filters) {

        let data = {data : []};
        switch(type){

            case 'vue1' :
                let url1 = TrafficServerManager.api_url+'getTraffic/021',
                dat = {};
                return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url1,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            res.data.forEach(elm => {
                                data.data.push({bill_type : elm.bill_tpe, traffic : elm.data_traff, _type : 'bill_split'});
                            });
                        })
                    ).then(function(){
                        return data;
                    })
                break;
        }
    }


    static getTraffDataParc(type, filters) {

        let data = {data : []};
        switch(type){

            case 'vue1' :
                let url1 = TrafficServerManager.api_url+'getParc/017';
                return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url1,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            res.data.forEach(elm => {
                                data.data.push({traffic : elm.kpi, _type : 'parc_data', upd_dt : elm.upd_dt});
                            });
                        })
                    ).then(function(){
                        return data;
                    })
                break;
        }
    }


    static getTraffDataType(type, filters) {

        let data = {data : []};
        let url1 = TrafficServerManager.api_url+'getTraffic/034',
            url2 = TrafficServerManager.api_url+'getTraffic/035',
            url3 = TrafficServerManager.api_url+'getTraffic/036'
        switch(type){

            case 'split' :
                return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url1,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            res.data.forEach(elm => {
                                data.data.push({traffic : elm.data_traff, _type : 'data_type', data_type : elm.type});
                            });
                        })
                    ).then(function(){
                        return data;
                    })
                break;

                case 'vue1' :
                    return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url2,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            res.data.forEach(elm => {
                                if(elm.data_in > 0) data['data'].push({traff_type : 'data', traffic : Number.parseFloat(elm.data_in), _type : 'dt_trend', upd_dt : elm.upd_dt, traff_dir : 'in' , traff_cat : elm.type });
                                if(elm.data_out > 0) data['data'].push({traff_type : 'data', traffic : Number.parseFloat(elm.data_out), _type : 'dt_trend', upd_dt : elm.upd_dt, traff_dir : 'out' , traff_cat : elm.type });
                            });                            
                        })
                        ).then(function(dat){
                            return data;
                        })
                break;  
                
                case 'vue2' :
                    return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url3,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            res.data.forEach(elm => {
                                if(elm.data_in > 0) data['data'].push({traff_type : 'data', traffic : Number.parseFloat(elm.data_in), _type : 'slot_trend', slot : elm.slot, traff_dir : 'in' , traff_cat : elm.type , period : res['d1']});
                                if(elm.data_out > 0) data['data'].push({traff_type : 'data', traffic : Number.parseFloat(elm.data_out), _type : 'slot_trend', slot : elm.slot, traff_dir : 'out' , traff_cat : elm.type , period : res['d1']});
                            });                            
                        })
                        ).then(function(dat){
                            return data;
                        })
                break;                 
        }
    }

    static getTraffDataBySite(type,filters){
        let data = {data : []};
        let url1 = TrafficServerManager.api_url+'getTraffic/037'
        switch(type){
            case 'vue1' :                
            return $.when(
                $.ajax({
                    method : 'GET',
                    url : url1,
                    data : filters,
                    dataType: 'json',
                    headers : {
                        "Authorization" : "Bearer "+getToken()
                    }
                }).done(function(res){
                    let trafftot = d3.sum(res.data, (d) => d.traffic);
                    res.data.sort((a,b) => b.traffic - a.traffic);                                  
                    let i = 1
                    
                    res.data.forEach(elm => {
                        if(elm.site != "" && elm.site != "Inconnu"){
                            if(i <=10){
                                if(elm.traffic > 0)  data['data'].push({site : elm.site, value : elm.traffic, _type : 'traff_data_site_split', tot : trafftot});
                            }
                            i++;
                        }
                    });                                   
                })
            ).then(function(){
                return data;
            })                    
                break;

        }
    }

}


export class TopupManager {

    constructor(url) {

        TopupManager.api_url =  url;
    }


    static getStat(type, filters, params) {
        
        let data = {data : []};
        let url = TopupManager.api_url,
            url1 = url+'getRecharge/009',
            url2 = url+'getRecharge/010';
            switch (type) {
                case 'mnt_tot':
                    return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url1,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            res.data.forEach(elm => {
                                let k1 = Number.parseFloat(res['data'][0]['kpi_']);
				let k2 = Number.parseFloat(res['data'][0]['kpi']);
                                data['data'].push({kpi : 'mnt_rec' , value : k2, var : (k1 != 0 && k1 != null  )? (100*(k2 - k1)/k1).toFixed(2) : 100 }); 
                            });
                        })
                    ).then(function(){
                        return data;
                    })
                    break;

                    case 'mnt_rec_type':
                        let k1 = 0, k2 = 0;
                        return $.when(
                            $.ajax({
                                method : 'GET',
                                url : url2,
                                data : filters,
                                dataType: 'json',
                                headers : {
                                    "Authorization" : "Bearer "+getToken()
                                }
                            }).done(function(res){
                                res.data.forEach(elm => {
                                    k1 = Number.parseFloat(res['data'][0]['cash_']);
				    k2 = Number.parseFloat(res['data'][0]['cash']);
                                    data['data'].push({kpi : 'cash' , value : k2, var : (k1 != 0 && k1 != null  )? (100*(k2 - k1)/k1).toFixed(2) : 100, _type : 'cash' }); 
                                    k1 = Number.parseFloat(res['data'][0]['voucher_']);
			 	    k2 = Number.parseFloat(res['data'][0]['voucher']);
                                    data['data'].push({kpi : 'voucher' , value : k2, var : (k1 != 0 && k1 != null )? (100*(k2 - k1)/k1).toFixed(2) : 100, _type : 'voucher' }); 
                                    k1 = Number.parseFloat(res['data'][0]['prepaid_']);
				                    k2 = Number.parseFloat(res['data'][0]['prepaid']);
                                    data['data'].push({kpi : 'prepaid' , value : k2, var : (k1 != 0 && k1 != null )? (100*(k2 - k1)/k1).toFixed(2) : 100 , _type : 'prepaid'}); 

                                    k1 = Number.parseFloat(res['data'][0]['postpaid_']);
				                    k2 = Number.parseFloat(res['data'][0]['postpaid']);
                                    data['data'].push({kpi : 'postpaid' , value : k2, var : (k1 != 0 && k1 != null )? (100*(k2 - k1)/k1).toFixed(2) : 100 , _type : 'postpaid'});                                     
                                });
                            })
                        ).then(function(){
                            return data;
                        })
                        break;            
             }

    }

    static getRechargeType(type, filters){
        let data = {data : []};
            switch(type){
    
                case 'vue1' :
                    let url1 = TopupManager.api_url+'getRecharge/003'
                        //url2 = TopupManager.api_url+'getRecharge/006';
                    return $.when(
                            $.ajax({
                                method : 'GET',
                                url : url1,
                                data : filters,
                                dataType: 'json',
                                headers : {
                                    "Authorization" : "Bearer "+getToken()
                                }
                            }).done(function(res){
                                res.data.forEach(elm => {
                                  if(elm.kpi_amnt > 0)  data['data'].push({rec_type : elm.type_rec, qty : elm.kpi_qty, amnt : elm.kpi_amnt, _type : 'rec_split'});
                                });
                            })
                        ).then(function(){
                            return data;
                        })
                    break;                 
            }
        } 



        static getRechargeChannel(type, filters){
            let data = {data : []},
                url1 = TopupManager.api_url+'getRecharge/0110'
                switch(type){
        
                    case 'split' :                
                        let dat = {};
                        return $.when(
                                $.ajax({
                                    method : 'GET',
                                    url : url1,
                                    data : filters,
                                    dataType: 'json',
                                    headers : {
                                        "Authorization" : "Bearer "+getToken()
                                    }
                                }).done(function(res){
                                    res.data.sort((a,b) => a.kpi - b.kpi);
                                    res.data.forEach(elm => {
                                        data['data'].push({channel : elm.channel, amount : elm.kpi , _type : 'chan_split'});
                                    });
                                })
                            ).then(function(){                            
                                return data;
                            })
                        break;                 
                }
            } 

    static getRechargeTrend(type, filters, params) {

            let data = {data : []},
            url1 = TopupManager.api_url+'getRecharge/0100',
            url2 = TopupManager.api_url+'getRecharge/0101',
            url3 = TopupManager.api_url+'getRecharge/0102';
            switch (type) {
                case 'vue1' :
                    return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url1,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            res.data.forEach(elm => {
                                if(elm.kpi_amnt > 0) data['data'].push({amnt : Number.parseFloat(elm.kpi_amnt), _type : 'month_trend', month : elm.month, rec_type  : elm.rec_type });    
                            });                            
                        })
                        ).then(function(dat){
                            return data;
                        })
                break;
    
                case 'vue2' :
                    return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url2,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            res.data.forEach(elm => {
                                if(elm.kpi_amnt > 0) data['data'].push({ amnt : Number.parseFloat(elm.kpi_amnt), _type : 'dt_trend', upd_dt : elm.upd_dt, rec_type : elm.rec_type, period : elm.upd_dt.substr(0,7) });    
                            });                            
                        })
                        ).then(function(dat){
                            return data;
                        })
                break;     
                
                
                case 'vue3' :
                    return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url3,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            res.data.forEach(elm => {
                                if(elm.kpi_amnt > 0) data['data'].push({amnt : Number.parseFloat(elm.kpi_amnt), _type : 'slot_trend', slot : elm.slot, rec_type : elm.rec_type, period : res['d1'] });                        
    
                            });                            
                        })
                        ).then(function(dat){
                            return data;
                        })
                break;            
            }
    }


    static getRechargeGeoSplit(type, filters) {

            let data = {data : []};
            switch(type){
    
                case 'vue1' :
                    let url1 = TopupManager.api_url+'getRecharge/0103';
                    return $.when(
                            $.ajax({
                                method : 'GET',
                                url : url1,
                                data : filters,
                                dataType: 'json',
                                headers : {
                                    "Authorization" : "Bearer "+getToken()
                                }
                            }).done(function(res){
                                res.data.forEach(elm => {
                                    data.data.push({value : elm.amnt, region : elm.region, zoneorange : elm.region, _type : elm.rec_type});
                                });
                            })
                        ).then(function(){
                            return data;
                        })
                    break;

                    case 'vue2' :
                        let url2 = TopupManager.api_url+'getRecharge/01030';
                        return $.when(
                                $.ajax({
                                    method : 'GET',
                                    url : url2,
                                    data : filters,
                                    dataType: 'json',
                                    headers : {
                                        "Authorization" : "Bearer "+getToken()
                                    }
                                }).done(function(res){
                                    res.data.forEach(elm => {
                                        let doc = {...elm};
					    let tot = 0;
                                            doc[elm.rec_type] = elm.amnt;
					    doc['Tous'] = Number.parseFloat(elm.amnt);
                                            delete doc['amnt'];
                                            delete doc['rec_type']; 
                                            /*for (const key in doc) {
						    let t = Number.parseFloat(doc[key]);
                                                if (typeof t == 'number') {
                                                    tot = t ;
                                                }
                                            }*/
                                            //doc['Tous'] = tot;
                                            data.data.push(doc);
                                    })
                                })
                            ).then(function(){
                                return data;
                            })
                        break;                    
            }
        }


    static getRechargeValueSplit(type, filters) {

            let data = {data : []};
            switch(type){
    
                case 'vue1' :
                    let url1 = TopupManager.api_url+'getRecharge/0104';
                    return $.when(
                            $.ajax({
                                method : 'GET',
                                url : url1,
                                data : filters,
                                dataType: 'json',
                                headers : {
                                    "Authorization" : "Bearer "+getToken()
                                }
                            }).done(function(res){
                                res.data.forEach(elm => {
                                    data.data.push({amnt : elm.amount, qty : Number.parseInt(elm.qty), _type : 'rec_value'});
                                });
                            })
                        ).then(function(){
                            return data//{data : [{amnt : 'test1', qty : 100, _type : 'rec_value'}, {amnt : 'test2', qty : 120, _type : 'rec_value'}]};
                        })
                    break;
            }
        }

        static getECTrend(type, filters, params) {

            let data = {data : []},
            url1 = TopupManager.api_url+'getRecharge/0105',
            url2 = TopupManager.api_url+'getRecharge/0106',
            url3 = TopupManager.api_url+'getRecharge/0107';
            switch (type) {
                case 'vue1' :
                    return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url1,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            res.data.forEach(elm => {
                                if(elm.kpi_qty > 0) data['data'].push({value : Number.parseFloat(elm.kpi_qty), _type : 'month_trend', month : elm.month, ec_type  : elm.ec_type, _kpi : 'qty' });
                                if(elm.kpi_loan > 0) data['data'].push({value : Number.parseFloat(elm.kpi_loan), _type : 'month_trend', month : elm.month, ec_type  : elm.ec_type, _kpi : 'loan' });
                                if(elm.kpi_fees > 0) data['data'].push({value : Number.parseFloat(elm.kpi_fees), _type : 'month_trend', month : elm.month, ec_type  : elm.ec_type, _kpi : 'fees' });
                            });                            
                        })
                        ).then(function(dat){
                            return data;
                        })
                break;
    
                case 'vue2' :
                    return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url2,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            res.data.forEach(elm => {
                                if(elm.kpi_qty > 0) data['data'].push({value : Number.parseFloat(elm.kpi_qty), _type : 'dt_trend', upd_dt : elm.upd_dt, ec_type  : elm.ec_type, _kpi : 'qty', period : elm.upd_dt.substr(0,7)  });
                                if(elm.kpi_loan > 0) data['data'].push({value : Number.parseFloat(elm.kpi_loan), _type : 'dt_trend', upd_dt : elm.upd_dt, ec_type  : elm.ec_type, _kpi : 'loan', period : elm.upd_dt.substr(0,7)  });
                                if(elm.kpi_fees > 0) data['data'].push({value : Number.parseFloat(elm.kpi_fees), _type : 'dt_trend', upd_dt : elm.upd_dt, ec_type  : elm.ec_type, _kpi : 'fees', period : elm.upd_dt.substr(0,7)  });
                            });                            
                        })
                        ).then(function(dat){
                            return data;
                        })
                break;     
                
                
                case 'vue3' :
                    return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url3,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            res.data.forEach(elm => {
                                if(elm.kpi_qty > 0) data['data'].push({value : Number.parseFloat(elm.kpi_qty), _type : 'slot_trend', slot : elm.slot, ec_type  : elm.ec_type, _kpi : 'qty', period : res['d1']  });
                                if(elm.kpi_loan > 0) data['data'].push({value : Number.parseFloat(elm.kpi_loan), _type : 'slot_trend', slot : elm.slot, ec_type  : elm.ec_type, _kpi : 'loan', period : res['d1']  });
                                if(elm.kpi_fees > 0) data['data'].push({value : Number.parseFloat(elm.kpi_fees), _type : 'slot_trend', slot : elm.slot, ec_type  : elm.ec_type, _kpi : 'fees', period : res['d1']  });
    
                            });                            
                        })
                        ).then(function(dat){
                            return data;
                        })
                break;            
            }
        }


        static getECRemb(type, filters, params) {

            let data = {data : []},
            url1 = TopupManager.api_url+'getRecharge/0108',
            url2 = TopupManager.api_url+'getRecharge/0109';
            switch (type) {
                case 'vue1' :
                    return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url1,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            res.data.forEach(elm => {
                                if(elm.borrow > 0) data['data'].push({value : Number.parseFloat(elm.borrow), _type : 'month_trend', month : elm.month, _kpi : 'borrow_trend' });
                                if(elm.reimb > 0) data['data'].push({value : Number.parseFloat(elm.reimb), _type : 'month_trend', month : elm.month, _kpi : 'reimburse_trend' });
				if(elm.fs > 0) data['data'].push({value : Number.parseFloat(elm.fs), _type : 'month_trend', month : elm.month, _kpi : 'fees_trend' });
                                if(elm.borrow > 0) 
				    data['data'].push({value : Math.abs(100*((Number.parseFloat(elm.reimb) - Number.parseFloat(elm.fs))/Number.parseFloat(elm.borrow)).toFixed(2)), _type : 'month_trend', month : elm.month, _kpi : 'portion' });
                            });                            
                        })
                        ).then(function(dat){
                            return data;
                        })
                break;
    
                case 'vue2' :
                    return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url2,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            res.data.forEach(elm => {
                                if(elm.borrow > 0) data['data'].push({value : Number.parseFloat(elm.borrow), _type : 'dt_trend', upd_dt : elm.upd_dt, _kpi : 'borrow_trend', period : elm.upd_dt.substr(0,7) });
                                if(elm.reimb > 0) data['data'].push({value : Number.parseFloat(elm.reimb), _type : 'dt_trend', upd_dt : elm.upd_dt, _kpi : 'reimburse_trend', period : elm.upd_dt.substr(0,7) });
				if(elm.fs > 0) 
				    data['data'].push({value : Number.parseFloat(elm.fs), _type : 'dt_trend', upd_dt : elm.upd_dt,period : elm.upd_dt.substr(0,7), _kpi : 'fees_trend' });
                                if(elm.borrow > 0) data['data'].push({value : Math.abs(100*((Number.parseFloat(elm.reimb) - Number.parseFloat(elm.fs))/Number.parseFloat(elm.borrow)).toFixed(2)), _type : 'dt_trend', upd_dt : elm.upd_dt, _kpi : 'portion', period : elm.upd_dt.substr(0,7) });
                            });                            
                        })
                        ).then(function(dat){
                            return data;
                        })
                break;                     
            }
        }

        static getRechargeSplit(type,filters){

            let data = {data : []};
            let url1 = TopupManager.api_url+'getRecharge/0111'
            switch(type){
    
                case 'vue1' :
                case 'vue2' :
                        //let dat = [];
                        return $.when(
                                $.ajax({
                                    method : 'GET',
                                    url : url1,
                                    data : filters,
                                    dataType: 'json',
                                    headers : {
                                        "Authorization" : "Bearer "+getToken()
                                    }
                                }).done(function(res){
                                    data.data = res.data
        
                                })
                            ).then(function(){
                                return data
                            })
                        break;
            }            
        }


}


export class OMManager {

    constructor(url) {

        OMManager.api_url =  url;
    }
    static getStat(type, filters, params) {
        
        let data = {data : []};
        let url = OMManager.api_url,
            url1 = url+'getOM/001',
            url2 = url+'getOM/002';
            switch (type) {
                case 'parc':
                    return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url1,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            res.data.forEach(elm => {
                                let k1 = Number.parseFloat(res['data'][0]['kpi_']);
				let k2 = Number.parseFloat(res['data'][0]['kpi']);
                                data['data'].push({kpi : 'parc' , value : k2, var : (k1 != 0 && k1 != null )? (100*(k2 - k1)/k1).toFixed(2) : 100 }); 
                            });
                        })
                    ).then(function(){
                        return data;
                    })
                    break;

                case 'others':
                    let k1 = 0, k2 = 0;
                    return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url2,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            res.data.forEach(elm => {
                                k1 = Number.parseFloat(res['data'][0]['tr_qty_']);
				k2 = Number.parseFloat(res['data'][0]['tr_qty']);
                                data['data'].push({kpi : 'qty' , value : k2, var : (k1 != 0 && k1 != null  )? (100*(k2 - k1)/k1).toFixed(2) : 100, _type : 'qty' }); 
                                k1 = Number.parseFloat(res['data'][0]['tr_amnt_']);
				k2 = Number.parseFloat(res['data'][0]['tr_amnt']);
                                data['data'].push({kpi : 'mnt' , value : k2, var : (k1 != 0 && k1 != null )? (100*(k2 - k1)/k1).toFixed(2) : 100, _type : 'mnt' }); 
                                k1 = Number.parseFloat(res['data'][0]['revenue_']);
				k2 = Number.parseFloat(res['data'][0]['revenue']);
                                data['data'].push({kpi : 'rev' , value : k2, var : (k1 != 0 && k1 != null)? (100*(k2 - k1)/k1).toFixed(2) : 100, _type : 'rev' }); 
                                k1 = Number.parseFloat(res['data'][0]['commission_']);
				k2 = Number.parseFloat(res['data'][0]['commission']);
                                data['data'].push({kpi : 'comm' , value : k2, var : (k1 != 0 && k1 != null )? (100*(k2 - k1)/k1).toFixed(2) : 100 , _type : 'comm'}); 
                            });
                        })
                    ).then(function(){
                        return data;
                    })
                    break;
            
            }
    }


    static getOMTrend(type, filters, params) {

        let data = {data : []},_type = 'month_trend',range = 'month',
        url1 = '';
        switch (type) {
            case 'parc' :
                switch (params) {
                    case 'vue1':
                        url1 = OMManager.api_url+'getOM/0031';
                        return $.when(
                            $.ajax({
                                method : 'GET',
                                url : url1,
                                data : filters,
                                dataType: 'json',
                                headers : {
                                    "Authorization" : "Bearer "+getToken()
                                }
                            }).done(function(res){
                                res.data.forEach(elm => {
                                    if(elm.kpi_val > 0) 
					data['data'].push({trend : Number.parseFloat(elm.kpi_val), _type : 'month_trend', month : elm.month });
                                });                            
                            })
                            ).then(function(dat){
                                return data;
                            })
                        
                        break;
                
                    case 'vue2':
                        url1 = OMManager.api_url+'getOM/003';
                        return $.when(
                            $.ajax({
                                method : 'GET',
                                url : url1,
                                data : filters,
                                dataType: 'json',
                                headers : {
                                    "Authorization" : "Bearer "+getToken()
                                }
                            }).done(function(res){
                                res.data.forEach(elm => {
                                    if(elm.kpi_val > 0) 
					data['data'].push({trend_dt : Number.parseFloat(elm.kpi_val),_type :'dt_trend',upd_dt : elm.upd_dt , period : elm.upd_dt.substr(0,7)});
                                });                            
                            })
                            ).then(function(dat){
                                return data;
                            })
                        break;
                    
                    default :

                    break;
                }
            break;

            case 'parc_usr' :
                switch (params) {
                    case 'vue1':
                        url1 = OMManager.api_url+'getOM/00311';
                        return $.when(
                            $.ajax({
                                method : 'GET',
                                url : url1,
                                data : filters,
                                dataType: 'json',
                                headers : {
                                    "Authorization" : "Bearer "+getToken()
                                }
                            }).done(function(res){
                                res.data.forEach(elm => {
                                    if(elm.kpi_val > 0)
                                        if(elm.user_type)
                                                data['data'].push({trend : Number.parseFloat(elm.kpi_val), _scale : 'month_trend',_type : elm.user_type+'_month_trend', month : elm.month });
                                        else data['data'].push({trend : Number.parseFloat(elm.kpi_val), _scale : 'month_trend', _type : 'subs_month_trend', month : elm.month });
                                });
                            })
                            ).then(function(dat){
                                return data;
                            })

                        break;

                    case 'vue2':
                        url1 = OMManager.api_url+'getOM/00301';
                        return $.when(
                            $.ajax({
                                method : 'GET',
                                url : url1,
                                data : filters,
                                dataType: 'json',
                                headers : {
                                    "Authorization" : "Bearer "+getToken()
                                }
                            }).done(function(res){
                                res.data.forEach(elm => {
                                    if(elm.kpi_val > 0)
                                        if(elm.user_type)
                                                data['data'].push({trend_dt : Number.parseFloat(elm.kpi_val), _type : elm.user_type+'_dt_trend',_scale :'dt_trend',upd_dt : elm.upd_dt , period : elm.upd_dt.substr(0,7)});
                                        else data['data'].push({trend_dt : Number.parseFloat(elm.kpi_val),_type :'subs_dt_trend', _scale : 'dt_trend', upd_dt : elm.upd_dt , period : elm.upd_dt.substr(0,7)});
                                });
                            })
                            ).then(function(dat){
                                return data;
                            })
                        break;

                    default :

                    break;
                }
            break;

            case 'comm_rev' :
                switch (params) {
                    case 'vue1':
                        url1 = OMManager.api_url+'getOM/0111';
                        return $.when(
                            $.ajax({
                                method : 'GET',
                                url : url1,
                                data : filters,
                                dataType: 'json',
                                headers : {
                                    "Authorization" : "Bearer "+getToken()
                                }
                            }).done(function(res){
                                res.data.forEach(elm => {
                                    if(elm.comm_val > 0) data['data'].push({value : Number.parseFloat(elm.comm_val), _kpi : 'comm',  _type : 'month_trend', trans_type : elm.tpe, month : elm.month});
                                    if(elm.rev_val > 0) data['data'].push({value : Number.parseFloat(elm.rev_val), _kpi : 'rev',_type : 'month_trend', trans_type : elm.tpe, month : elm.month});
                                });                            
                            })
                            ).then(function(dat){
                                return data;
                            })
                        
                        break;
                
                    case 'vue2':
                        url1 = OMManager.api_url+'getOM/0110';
                        return $.when(
                            $.ajax({
                                method : 'GET',
                                url : url1,
                                data : filters,
                                dataType: 'json',
                                headers : {
                                    "Authorization" : "Bearer "+getToken()
                                }
                            }).done(function(res){
                                res.data.forEach(elm => {
                                    if(elm.comm_val > 0) data['data'].push({value : Number.parseFloat(elm.comm_val), _kpi : 'comm',  _type : 'dt_trend', trans_type : elm.tpe , upd_dt : elm.upd_dt , period : elm.upd_dt.substr(0,7)});
                                    if(elm.rev_val > 0) data['data'].push({value : Number.parseFloat(elm.rev_val), _kpi : 'rev',_type : 'dt_trend', trans_type : elm.tpe, upd_dt : elm.upd_dt , period : elm.upd_dt.substr(0,7)});
                                });                            
                            })
                            ).then(function(dat){
                                return data;
                            })
                        break;
                    
                    default :

                    break;
                }
            break;            

            case 'rev' :
                switch (params) {
                    case 'vue1':
                        url1 = OMManager.api_url+'getOM/0051';
                        
                        break;
                    case 'vue2':
                        url1 = OMManager.api_url+'getOM/005';
                        _type = 'dt_trend';
                        range = 'upd_dt';
                        break;
                
                    default:
                        break;
                }
            break;

            case 'mnt' : 
                switch (params) {
                    case 'vue1':
                        url1 = OMManager.api_url+'getOM/0041';
                        break;
                    case 'vue2':
                        url1 = OMManager.api_url+'getOM/004';
                        _type = 'dt_trend';
                        range = 'upd_dt';
                        break;
                
                    default:
                        break;
                }
            break;
           
            case 'comm' : 
                switch (params) {
                    case 'vue1':
                        url1 = OMManager.api_url+'getOM/0061';
                        break;
                    case 'vue2':
                        url1 = OMManager.api_url+'getOM/006';
                        _type = 'dt_trend';
                        range = 'upd_dt';
                        break;
                
                    default:
                        break;
                }
            break;            
        }

        return $.when(
            $.ajax({
                method : 'GET',
                url : url1,
                data : filters,
                dataType: 'json',
                headers : {
                    "Authorization" : "Bearer "+getToken()
                }
            }).done(function(res){
                res.data.forEach(elm => {
                    if(elm.kpi_val > 0) {
                        let doc = {trend : Number.parseFloat(elm.kpi_val),trans_type : elm.tpe,  _type : _type};
                        doc[range] = elm[range];
                        if(range == 'upd_dt') doc['period'] = elm[range].substr(0,7);
                        data.data.push(doc);
                    }    
                });                            
            })
            ).then(function(dat){
                return data;
            })
    }


    static getOMSplit(type, filters, params) {

        let data = {data : []},
        url1 = '';
        switch (type) {
            case 'parc':
                url1 = OMManager.api_url+'getOM/007';
                break;
            case 'parc_usr':
                url1 = OMManager.api_url+'getOM/0070';
        return $.when(
            $.ajax({
                method : 'GET',
                url : url1,
                data : filters,
                dataType: 'json',
                headers : {
                    "Authorization" : "Bearer "+getToken()
                }
            }).done(function(res){
                res.data.forEach(elm => {

                    if(elm.kpi_val > 0)
			if(elm.user_type)
                        	data['data'].push({value : Number.parseFloat(elm.kpi_val), _type : elm.user_type+'_parc_split', trans_type : elm.tpe });
			else data['data'].push({value : Number.parseFloat(elm.kpi_val), _type : 'subs_parc_split', trans_type : elm.tpe });
                });
            })
            ).then(function(dat){
                return data;
            })			
                break;			
            case 'rev':
                url1 = OMManager.api_url+'getOM/008';
                break;        
            case 'comm' :
                url1 = OMManager.api_url+'getOM/010';
                break; 
            case 'mnt' :
                url1 = OMManager.api_url+'getOM/009';
                break;   
                
            case 'comm_rev' :
                url1 = OMManager.api_url+'getOM/011';
                return $.when(
                    $.ajax({
                        method : 'GET',
                        url : url1,
                        data : filters,
                        dataType: 'json',
                        headers : {
                            "Authorization" : "Bearer "+getToken()
                        }
                    }).done(function(res){
                        res.data.forEach(elm => {
                            if(elm.comm_val > 0) data['data'].push({value : Number.parseFloat(elm.comm_val), _type : 'comm_split', trans_type : elm.tpe });
                            if(elm.rev_val > 0) data['data'].push({value : Number.parseFloat(elm.rev_val), _type : 'rev_split', trans_type : elm.tpe });
                        });                            
                    })
                    ).then(function(dat){
                        return data;
                    })
            default:
                break;
        }

        return $.when(
            $.ajax({
                method : 'GET',
                url : url1,
                data : filters,
                dataType: 'json',
                headers : {
                    "Authorization" : "Bearer "+getToken()
                }
            }).done(function(res){
                res.data.forEach(elm => {
                    if(elm.kpi_val > 0)
			data['data'].push({value : Number.parseFloat(elm.kpi_val), _type : type+'_split', trans_type : elm.tpe });
                });                            
            })
            ).then(function(dat){
                return data;
            })


    }

    static getOMGeoSplit(type,filters) {
        let data = {data : []};
        switch(type){

            case 'vue1' :
                let url1 = OMManager.api_url+'getOM/0112';
                    return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url1,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            data = res;
                        })                        
                    ).then(function(){
                        return data;
                    })
                break;
        }
    }

}

export class MonitorServerManager {


    constructor (url) {

        MonitorServerManager.api_url = url;
    }

    static getStat(type, filters, params) {
        
        let data = {data : []};
        let url = MonitorServerManager.api_url,
            url1 = url+'getMon/001',
            k1 = 0, k2 = 0;
            return $.when(
                $.ajax({
                    method : 'GET',
                    url : url1,
                    data : filters,
                    dataType: 'json',
                    headers : {
                        "Authorization" : "Bearer "+getToken()
                    }
                }).done(function(res){
                    res.data.forEach(elm => {
                        k1 = Number.parseFloat(res['data'][0]['tot_']);
			k2 = Number.parseFloat(res['data'][0]['tot']);
                        data['data'].push({kpi : 'tot' , value : k2, var : (k1 != 0 && k1 != null  )? (100*(k2 - k1)/k1).toFixed(2) : 100, _type : 'tot' });
                        k1 = Number.parseFloat(res['data'][0]['tot_files']);
                        k2 = Number.parseFloat(res['data'][0]['tot_files_']);
                                    data['data'].push({kpi : 'tot_files' , value : k2, var : (k1 != 0 && k1 != null  )? (100*(k2 - k1)/k1).toFixed(2) : 100, _type : 'tot_files' });                         
                        k1 = Number.parseFloat(res['data'][0]['ocs_']);
			k2 = Number.parseFloat(res['data'][0]['ocs']);
                        data['data'].push({kpi : 'ocs' , value : k2, var : (k1 != 0 && k1 != null  )? (100*(k2 - k1)/k1).toFixed(2) : 100, _type : 'ocs' }); 
                        k1 = Number.parseFloat(res['data'][0]['msc_']);
			k2 = Number.parseFloat(res['data'][0]['msc']);
                        data['data'].push({kpi : 'msc' , value : k2, var : (k1 != 0 && k1 != null )? (100*(k2 - k1)/k1).toFixed(2) : 100, _type : 'msc' }); 
                        k1 = Number.parseFloat(res['data'][0]['ims_']);
			k2 = Number.parseFloat(res['data'][0]['ims']);
                        data['data'].push({kpi : 'ims' , value : k2, var : (k1 != 0 && k1 != null )? (100*(k2 - k1)/k1).toFixed(2) : 100, _type : 'ims' }); 
                        k1 = res['data'][0]['ocb_'] ? Number.parseFloat(res['data'][0]['ocb_']) : 0;
			            k2 = res['data'][0]['ocb']? Number.parseFloat(res['data'][0]['ocb']) : 0;
                        data['data'].push({kpi : 'ocb' , value : k2, var : (k1 != 0 && k1 != null )? (100*(k2 - k1)/k1).toFixed(2) : 100 , _type : 'ocb'}); 
                        k1 = Number.parseFloat(res['data'][0]['pgw_']);
			            k2 = Number.parseFloat(res['data'][0]['pgw']);
                        data['data'].push({kpi : 'pgw' , value : k2, var : (k1 != 0 && k1 != null )? (100*(k2 - k1)/k1).toFixed(2) : 100 , _type : 'pgw'});
                        k1 = Number.parseFloat(res['data'][0]['sico_']);
			            k2 = Number.parseFloat(res['data'][0]['sico']);
                        data['data'].push({kpi : 'sico' , value : k2, var : (k1 != 0 && k1 != null )? (100*(k2 - k1)/k1).toFixed(2) : 100 , _type : 'sico'}); 


                    });
                })
            ).then(function(){
                return data;
            })

    }


    static getMonTab(type, filters, params) {

        let data = {data : []};
        let url = MonitorServerManager.api_url,
            url1 = url+'getMon/002',
            url2 = url+'getMon/0021',
            k1 = 0,k2 = 0,b5 = 0,IN = 0
            switch (type) {
                case 'vue1':
                    return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url1,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            res.data.forEach(elm => {
                                let fv = "-"
                                k1 = Number.parseFloat(elm.count_);
				k2 = Number.parseFloat(elm.count);
                                elm.var = (k1 != 0 && k1 != null && k1 )? (100*(k2 - k1)/k1).toFixed(2) : 100;
                                k1 = Number.parseFloat(elm.fcount_);
				                k2 = Number.parseFloat(elm.fcount);
                                elm.fvar = (k1 != 0 && k1 != null && k1 )? (100*(k2 - k1)/k1).toFixed(2) : 100;  
                                b5= elm.count_b5,IN=elm.count_IN
                                if(b5 >=0 && IN >= 0) fv = b5 -IN
                                elm.fdiff = fv                              
                                data['data'].push(elm);
                            });
                        })
                    ).then(function(){
                        return data;
                    })
                    break;

                case 'vue2':
                    return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url2,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            res.data.forEach(elm => {

                                k1 = Number.parseFloat(elm.kpi_);
				k2 = Number.parseFloat(elm.kpi);
                                elm.var = (k1 != 0 && k1 != null && k1 )? (100*(k2 - k1)/k1).toFixed(2) : 100;
                                data['data'].push(elm);
                            });
                        })
                    ).then(function(){
                        return data;
                    })
                    break;
            }

    }


    static getMonLine(type, filters, params) {

        let data = {data : []};
        let url = MonitorServerManager.api_url,
            url1 = url+'getMon/003',
            url2 = url+'getMon/0031',
            url3 = url+'getMon/0032';
            switch (type) {
                case 'vue1':
                    return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url1,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            res.data.forEach(elm => {

                                //k1 = Number.parseFloat(elm.count);
                                elm._type  = 'monitor_trend';
                                data['data'].push(elm);
                            });
                           // data.data = res.data;
                        })
                    ).then(function(){
                        return data;
                    })
                    break;

                case 'vue2':
                    return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url2,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            res.data.forEach(elm => {
                                elm._type  = 'monitor_trend';
                                data['data'].push(elm);
                            });
                        })
                    ).then(function(){
                        return data;
                    })
                    break;

                case 'vue3' :
                    return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url3,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            res.data.forEach(elm => {
                                elm._type  = 'monitor_trend';
                                data['data'].push(elm);
                            });
                        })
                    ).then(function(){
                        return data;
                    })
                    break;
            }
}
}

export class WimaxServerManager {


    constructor (url) {

        WimaxServerManager.api_url = url;
    }

    static getStat(type, filters, params) {
        
        let data = {data : []};
        let url = WimaxServerManager.api_url,
            url1 = url+'getWimax/001',
            k1 = 0;
            return $.when(
                $.ajax({
                    method : 'GET',
                    url : url1,
                    data : filters,
                    dataType: 'json',
                    headers : {
                        "Authorization" : "Bearer "+getToken()
                    }
                }).done(function(res){
                    res.data.forEach(elm => {
                        k1 = Number.parseFloat(res['data'][0]['nb_profile']);
                        data['data'].push({kpi : 'nb_profile' , value : k1, var : (k1 != 0 && k1 != null && res['data'][0]['var_nb_profile'] )? (100*res['data'][0]['var_nb_profile']/k1).toFixed(2) : 100, _type : 'nb_profile' });                         
                        k1 = Number.parseFloat(res['data'][0]['nb_actif']);
                        data['data'].push({kpi : 'nb_actif' , value : k1, var : (k1 != 0 && k1 != null && res['data'][0]['var_nb_actif'] )? (100*res['data'][0]['var_nb_actif']/k1).toFixed(2) : 100, _type : 'nb_actif' }); 
                        k1 = Number.parseFloat(res['data'][0]['nb_susp']);
                        data['data'].push({kpi : 'nb_susp' , value : k1, var : (k1 != 0 && k1 != null && res['data'][0]['var_nb_susp'] )? (100*res['data'][0]['var_nb_susp']/k1).toFixed(2) : 100, _type : 'nb_susp' }); 
                        k1 = Number.parseFloat(res['data'][0]['nb_rsl']);
                        data['data'].push({kpi : 'nb_rsl' , value : k1, var : (k1 != 0 && k1 != null && res['data'][0]['var_nb_rsl'] != null)? (100*res['data'][0]['var_nb_rsl']/k1).toFixed(2) : 100, _type : 'nb_rsl' }); 
                        k1 = Number.parseFloat(res['data'][0]['nb_total']);
                        data['data'].push({kpi : 'nb_total' , value : k1, var : (k1 != 0 && k1 != null && res['data'][0]['var_nb_total'] != null )? (100*res['data'][0]['var_nb_total']/k1).toFixed(2) : 100 , _type : 'nb_total'}); 
                    });
                })
            ).then(function(){
                return data;
            })

    }


    static getParc(type, filters, params) {

        let data = {data : []};
        let url = WimaxServerManager.api_url,
            url1 = url+'getWimax/002',
            k1 = 0;
            return $.when(
                $.ajax({
                    method : 'GET',
                    url : url1,
                    data : filters,
                    dataType: 'json',
                    headers : {
                        "Authorization" : "Bearer "+getToken()
                    }
                }).done(function(res){
                    let tot = d3.sum(res.data, (d) => d.qty);
                    res.data.sort((a,b) => a.qty - b.qty);
                    res.data.forEach(elm => {
                        elm._type  = 'parc_split';
                        elm.tot =tot; 
                        data['data'].push(elm);
                    });
                    
                })
            ).then(function(){
                data.data.sort((a,b) => b.qty - a.qty);
                return data;
            })

    }


    static getResilCmp(type, filters, params) {

        let data = {data : []};
        let url = WimaxServerManager.api_url,
            url1 = url+'getWimax/003',
            k1 = 0;
            return $.when(
                $.ajax({
                    method : 'GET',
                    url : url1,
                    data : filters,
                    dataType: 'json',
                    headers : {
                        "Authorization" : "Bearer "+getToken()
                    }
                }).done(function(res){
                    let tot = d3.sum(res.data, (d) => d.qty);
                    res.data.sort((a,b) => a.qty - b.qty);
                    res.data.forEach(elm => {

                        elm._type  = 'cmpt_split'; 
                        elm.tot = tot;
                        data['data'].push(elm);
                    });                    
                })
            ).then(function(){
                data.data.sort((a,b) => b.qty - a.qty);
                return data;
            })

    }

    static getTrend(type, filters, params) {

        let data = {data : []};
        let url = WimaxServerManager.api_url,
            url1 = url+'getWimax/004',
            k1 = 0;
            return $.when(
                $.ajax({
                    method : 'GET',
                    url : url1,
                    data : filters,
                    dataType: 'json',
                    headers : {
                        "Authorization" : "Bearer "+getToken()
                    }
                }).done(function(res){
                    res.data.forEach(elm => {

                        data.data.push({profile : elm.service, trend: elm.actif, _type : "month_trend_act", month : elm.month });
                        data.data.push({profile : elm.service, trend: elm.susp, _type : "month_trend_susp", month : elm.month });
                    });
                })
            ).then(function(){
                return data;
            })

    }



}


export class SalesServerManager {


    constructor (url) {

        SalesServerManager.api_url = url;
    }

    static getStat(type, filters, params) {
        
        let data = {data : []};
        let url = SalesServerManager.api_url,
            url1 = url+'getSale/001',
            k1 = 0;
            return $.when(
                $.ajax({
                    method : 'GET',
                    url : url1,
                    data : filters,
                    dataType: 'json',
                    headers : {
                        "Authorization" : "Bearer "+getToken()
                    }
                }).done(function(res){
                    res.data.forEach(elm => {
                        k1 = Number.parseFloat(res['data'][0]['tqty']);
                        data['data'].push({kpi : 'qtot' , value : k1, var : (k1 != 0 && k1 != null && res['data'][0]['var_tqty'] )? (100*res['data'][0]['var_tqty']/k1).toFixed(2) : 100, _type : 'tqty' });                         
                        k1 = Number.parseFloat(res['data'][0]['tamnt']);
                        data['data'].push({kpi : 'atot' , value : k1, var : (k1 != 0 && k1 != null && res['data'][0]['var_tamnt'] )? (100*res['data'][0]['var_tamnt']/k1).toFixed(2) : 100, _type : 'tamnt' }); 
                        k1 = Number.parseFloat(res['data'][0]['div_qty']);
                        data['data'].push({kpi : 'qdiv' , value : k1, var : (k1 != 0 && k1 != null && res['data'][0]['var_div_qty'] )? (100*res['data'][0]['var_div_qty']/k1).toFixed(2) : 100, _type : 'div_qty' }); 
                        k1 = Number.parseFloat(res['data'][0]['div_amnt']);
                        data['data'].push({kpi : 'adiv' , value : k1, var : (k1 != 0 && k1 != null && res['data'][0]['var_div_amnt'] != null)? (100*res['data'][0]['var_div_amnt']/k1).toFixed(2) : 100, _type : 'div_amnt' }); 
                        k1 = Number.parseFloat(res['data'][0]['gsm_qty']);
                        data['data'].push({kpi : 'qgsm' , value : k1, var : (k1 != 0 && k1 != null && res['data'][0]['var_gsm_qty'] != null )? (100*res['data'][0]['var_gsm_qty']/k1).toFixed(2) : 100 , _type : 'gsm_qty'});
                        k1 = Number.parseFloat(res['data'][0]['gsm_amnt']);
                        data['data'].push({kpi : 'agsm' , value : k1, var : (k1 != 0 && k1 != null && res['data'][0]['var_gsm_amnt'] != null )? (100*res['data'][0]['var_gsm_amnt']/k1).toFixed(2) : 100 , _type : 'gsm_amnt'});
                                        
                    });
                        
                })
            ).then(function(){
                return data;
            })

    }

    static getProduct(type, filters, params) {
        let data = {data : []};
        switch(type) {
            case  'split' :
                let url = SalesServerManager.api_url,
                url1 = url+'getSale/002';
                return $.when(
                    $.ajax({
                        method : 'GET',
                        url : url1,
                        data : filters,
                        dataType: 'json',
                        headers : {
                            "Authorization" : "Bearer "+getToken()
                        }
                    }).done(function(res){
                        res.data.forEach(elm => {
                            if(elm.qty > 0 ) data['data'].push({qty : elm.qty, product : elm.product, _type : 'qty_split'});
                            if(elm.amnt > 0 ) data['data'].push({amnt : elm.amnt, product : elm.product, _type : 'amnt_split'});
                        });
                    })
                ).then(function(){
                    return data;
                })
            break;

            case 'trend' :
                let url11 = SalesServerManager.api_url+'getSale/003',
                url2 = SalesServerManager.api_url+'getSale/004';
                switch (params) {
                    case 'vue1' :
                        return $.when(
                            $.ajax({
                                method : 'GET',
                                url : url11,
                                data : filters,
                                dataType: 'json',
                                headers : {
                                    "Authorization" : "Bearer "+getToken()
                                }
                            }).done(function(res){
                                res.data.forEach(elm => {
                                    if(elm.kpi_amnt > 0) data['data'].push({trend : Number.parseFloat(elm.kpi_amnt), _type : 'month_trend', month : elm.month, product : elm.product});    
                                });                            
                            })
                            ).then(function(dat){
                                return data;
                            })
                    break;
        
                    case 'vue2' :
                        return $.when(
                            $.ajax({
                                method : 'GET',
                                url : url2,
                                data : filters,
                                dataType: 'json',
                                headers : {
                                    "Authorization" : "Bearer "+getToken()
                                }
                            }).done(function(res){
                                res.data.forEach(elm => {
                                    if(elm.kpi_amnt > 0) data['data'].push({ trend : Number.parseFloat(elm.kpi_amnt), _type : 'dt_trend', upd_dt : elm.upd_dt,period : elm.upd_dt.substr(0,7) , product : elm.product});    
                                });                            
                            })
                            ).then(function(dat){
                                return data;
                            })
                    break;                                
                }
            break;

        }
    }
    
    static getSaleClientType(type, filters, params) {
        let data = {data : []};
        let url11 = SalesServerManager.api_url+'getSale/006',
        url2 = SalesServerManager.api_url+'getSale/007';
        switch(type) {
            case 'split' :
                let url = SalesServerManager.api_url,
                url1 = url+'getSale/005';
                return $.when(
                    $.ajax({
                        method : 'GET',
                        url : url1,
                        data : filters,
                        dataType: 'json',
                        headers : {
                            "Authorization" : "Bearer "+getToken()
                        }
                    }).done(function(res){
                        res.data.forEach(elm => {
                            elm._type  = 'clt_split'; 
                            data['data'].push(elm);
                        });
                    })
                ).then(function(){
                    return data;
                })
            break

            case 'trend':

                switch (params) {
                    case 'vue1' :
                        return $.when(
                            $.ajax({
                                method : 'GET',
                                url : url11,
                                data : filters,
                                dataType: 'json',
                                headers : {
                                    "Authorization" : "Bearer "+getToken()
                                }
                            }).done(function(res){
                                res.data.forEach(elm => {
                                    if(elm.kpi_amnt > 0) data['data'].push({trend : Number.parseFloat(elm.kpi_amnt), _type : 'month_trend', month : elm.month, client : elm.client});    
                                });                            
                            })
                            ).then(function(dat){
                                return data;
                            })
                    break;
        
                    case 'vue2' :
                        return $.when(
                            $.ajax({
                                method : 'GET',
                                url : url2,
                                data : filters,
                                dataType: 'json',
                                headers : {
                                    "Authorization" : "Bearer "+getToken()
                                }
                            }).done(function(res){
                                res.data.forEach(elm => {
                                    if(elm.kpi_amnt > 0) data['data'].push({ trend : Number.parseFloat(elm.kpi_amnt), _type : 'dt_trend', upd_dt : elm.upd_dt,period : elm.upd_dt.substr(0,7) , client : elm.client});    
                                });                            
                            })
                            ).then(function(dat){
                                return data;
                            })
                    break;                                
                }
            break;
        }
    }

    static getProductItem(type, filters) {
        let data = {data : []};
        let url1 = SalesServerManager.api_url+'getSale/008';
        switch(type){
            case 'vue1' :                
                let dat = {}, amnt = 0;
                return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url1,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){   
                            amnt = d3.sum(res.data, d => d.amnt);                      
                            res.data.forEach(elm => {
                                dat[elm.product] = (typeof dat[elm.product] == 'undefined') ? [elm] : [...dat[elm.product], elm];
                            });
                        })
                    ).then(function(){ 
                        for (const prod  in dat) {
                                const element = dat[prod];
                                let prods = d3.sum(element, d => d.amnt);
                                const items = element.map( function(d) {return {name : d.item, value : d.amnt, tot : prods}})
                                data['data'].push({name : prod, value : prods,children : items, tot : amnt}); 
                        }
                        return data;
                    })
                break; 
                
                case 'vue2' :
                    return $.when(
                            $.ajax({
                                method : 'GET',
                                url : url1,
                                data : filters,
                                dataType: 'json',
                                headers : {
                                    "Authorization" : "Bearer "+getToken()
                                }
                            }).done(function(res){
                                res.data.forEach(elm => {
                                    elm._type = 'sales_split';
                                    if(elm.kpi != 0)  data.data.push(elm);
                                });
                            })
                        ).then(function(){
                            return data;
                        })
                    break;                 
        }

    }

    static getSalesTrend(type, filters, params) {

        let data = {data : []},
        url1 = SalesServerManager.api_url+'getSale/009',
        url2 = SalesServerManager.api_url+'getSale/010';
        switch (type) {
            case 'vue1' :
                return $.when(
                    $.ajax({
                        method : 'GET',
                        url : url1,
                        data : filters,
                        dataType: 'json',
                        headers : {
                            "Authorization" : "Bearer "+getToken()
                        }
                    }).done(function(res){
                        res.data.forEach(elm => {
                            if(elm.kpi_amnt > 0) data['data'].push({trend : Number.parseFloat(elm.kpi_amnt), _type : 'month_trend', month : elm.month});    
                        });                            
                    })
                    ).then(function(dat){
                        return data;
                    })
            break;

            case 'vue2' :
                return $.when(
                    $.ajax({
                        method : 'GET',
                        url : url2,
                        data : filters,
                        dataType: 'json',
                        headers : {
                            "Authorization" : "Bearer "+getToken()
                        }
                    }).done(function(res){
                        res.data.forEach(elm => {
                            if(elm.kpi_amnt > 0) data['data'].push({ trend_dt : Number.parseFloat(elm.kpi_amnt), _type : 'dt_trend', upd_dt : elm.upd_dt,period : elm.upd_dt.substr(0,7) });    
                        });                            
                    })
                    ).then(function(dat){
                        return data;
                    })
            break;                                
        }
    }

    /*static getSalesProductTrend(type, filters, params) {

        let data = {data : []},
        url1 = SalesServerManager.api_url+'getSale/007',
        url2 = SalesServerManager.api_url+'getSale/008',
        switch (type) {
            case 'vue1' :
                return $.when(
                    $.ajax({
                        method : 'GET',
                        url : url1,
                        data : filters,
                        dataType: 'json',
                        headers : {
                            "Authorization" : "Bearer "+getToken()
                        }
                    }).done(function(res){
                        res.data.forEach(elm => {
                            if(elm.kpi_amnt > 0) data['data'].push({amnt : Number.parseFloat(elm.kpi_amnt), _type : 'month_trend', month : elm.month, product : elm.product});    
                        });                            
                    })
                    ).then(function(dat){
                        return data;
                    })
            break;

            case 'vue2' :
                return $.when(
                    $.ajax({
                        method : 'GET',
                        url : url2,
                        data : filters,
                        dataType: 'json',
                        headers : {
                            "Authorization" : "Bearer "+getToken()
                        }
                    }).done(function(res){
                        res.data.forEach(elm => {
                            if(elm.kpi_amnt > 0) data['data'].push({ amnt : Number.parseFloat(elm.kpi_amnt), _type : 'dt_trend', upd_dt : elm.upd_dt,period : elm.upd_dt.substr(0,7) , product : elm.product});    
                        });                            
                    })
                    ).then(function(dat){
                        return data;
                    })
            break;                                
        }
    }*/

    /*static getSalesClientTrend(type, filters, params) {

        let data = {data : []},
        url1 = SalesServerManager.api_url+'getSale/009',
        url2 = SalesServerManager.api_url+'getSale/010',
        switch (type) {
            case 'vue1' :
                return $.when(
                    $.ajax({
                        method : 'GET',
                        url : url1,
                        data : filters,
                        dataType: 'json',
                        headers : {
                            "Authorization" : "Bearer "+getToken()
                        }
                    }).done(function(res){
                        res.data.forEach(elm => {
                            if(elm.kpi_amnt > 0) data['data'].push({amnt : Number.parseFloat(elm.kpi_amnt), _type : 'month_trend', month : elm.month, client : elm.client});    
                        });                            
                    })
                    ).then(function(dat){
                        return data;
                    })
            break;

            case 'vue2' :
                return $.when(
                    $.ajax({
                        method : 'GET',
                        url : url2,
                        data : filters,
                        dataType: 'json',
                        headers : {
                            "Authorization" : "Bearer "+getToken()
                        }
                    }).done(function(res){
                        res.data.forEach(elm => {
                            if(elm.kpi_amnt > 0) data['data'].push({ amnt : Number.parseFloat(elm.kpi_amnt), _type : 'dt_trend', upd_dt : elm.upd_dt,period : elm.upd_dt.substr(0,7) , client : elm.client});    
                        });                            
                    })
                    ).then(function(dat){
                        return data;
                    })
            break;                                
        }
    } */   
}

export class BillingServerManager {


    constructor(url){

            BillingServerManager.api_url =  url;
    }


    static getStat(type,filters) {        

        let data = {data : []};
        let url = BillingServerManager.api_url,
            url1 = url+'getBill/0042';
        return $.when(
        $.ajax({
            method : 'GET',
            url : url1,
            data : filters,
            dataType: 'json',
            headers : {
                "Authorization" : "Bearer "+getToken()
            }
        }).done(function(res){
            data['data'].push({kpi : 'rv' , value : res['data'][0]['rv'], var : (res['data'][0]['rv_'] != 0 && res['data'][0]['rsales'] != null  && res['data'][0]['rv_'] != null )? (100*(res['data'][0]['rsales'] - res['data'][0]['rv_']) /res['data'][0]['rv_']).toFixed(2) : 100 });           
            data['data'].push({kpi : 'rv_post' , value : res['data'][0]['rv_post'], var : (res['data'][0]['rv_post_'] != 0 && res['data'][0]['rv_post'] != null && res['data'][0]['rv_post_'] != null )? (100*(res['data'][0]['rv_post'] - res['data'][0]['rv_post_']) /res['data'][0]['rv_post_']).toFixed(2) : 100 });           
            data['data'].push({kpi : 'rv_pre' , value : res['data'][0]['rv_pre'], var : (res['data'][0]['rv_pre_'] != 0 && res['data'][0]['rv_pre'] != null && res['data'][0]['rv_pre_'] != null )? (100*(res['data'][0]['rv_pre'] - res['data'][0]['rv_pre_']) /res['data'][0]['rv_pre_']).toFixed(2) : 100 });           
            data['data'].push({kpi : 'qte' , value : res['data'][0]['qte'], var : (res['data'][0]['qte_'] != 0 && res['data'][0]['qte'] != null  && res['data'][0]['qte_'] != null )? (100*(res['data'][0]['qte'] - res['data'][0]['qte_']) /res['data'][0]['qte_']).toFixed(2) : 100 });           
            data['data'].push({kpi : 'fpaid' , value : res['data'][0]['fpaid'], var : (res['data'][0]['fpaid_'] != 0 && res['data'][0]['fpaid'] != null && res['data'][0]['fpaid_'] != null )? (100*(res['data'][0]['fpaid'] - res['data'][0]['fpaid_']) /res['data'][0]['fpaid_']).toFixed(2) : 100 });           
            data['data'].push({kpi : 'qpaid' , value : res['data'][0]['qpaid'], var : (res['data'][0]['qpaid_'] != 0 && res['data'][0]['qpaid'] != null  && res['data'][0]['qpaid_'] != null )? (100*(res['data'][0]['qpaid'] - res['data'][0]['qpaid_']) /res['data'][0]['qpaid_']).toFixed(2) : 100 });           

        })                    
        ).then(function(d){
            return data;
        });        
    }


    static getBilling(type,filters,params) {

        let data = {data : []};
        let url1 = BillingServerManager.api_url+'getBill/0061';
        let url2 = BillingServerManager.api_url+'getBill/0071';
        let url3 = BillingServerManager.api_url+'getBill/0081';
        let url4 = BillingServerManager.api_url+'getBill/0091';

        let url11 = BillingServerManager.api_url+'getBill/0101';
        let url21 = BillingServerManager.api_url+'getBill/0111';
        let url31 = BillingServerManager.api_url+'getBill/0121';
        let url41 = BillingServerManager.api_url+'getBill/0131';   
   
        switch(type){

            case 'fact' :
             switch (params) {
                 case 'bill_mark':                
                        let dat = {};
                        return $.when(
                                $.ajax({
                                    method : 'GET',
                                    url : url1,
                                    data : filters,
                                    dataType: 'json',
                                    headers : {
                                        "Authorization" : "Bearer "+getToken()
                                    }
                                }).done(function(res){
                                    
                                    data.data = getHierachy(res.data,['billing_type','market','offer_group'],'revenue')
                                })
                            ).then(function(){                            
                                return data;
                            })
                    break;
        
                    case 'bill_mark_' :
                        return $.when(
                                $.ajax({
                                    method : 'GET',
                                    url : url1,
                                    data : filters,
                                    dataType: 'json',
                                    headers : {
                                        "Authorization" : "Bearer "+getToken()
                                    }
                                }).done(function(res){
                                    res.data.forEach(elm => {
                                        elm._type = '_grpoff';
                                        data.data.push(elm);
                                    });
                                })
                            ).then(function(){
                                return data;
                            })                                                           

                     break;
                case 'offer':

                    return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url2,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            res.data.sort((a,b) => a.revenue - b.revenue);
                            res.data.forEach(elm => {
                                data['data'].push({off_group : elm.offer_group, revenue : elm.revenue , _type : 'off_split'});
                            });
                        })
                    ).then(function(){                            
                        return data;
                    })
                
                break; 
                
                case 'month_trend':
                    return $.when(
                            $.ajax({
                                method : 'GET',
                                url : url3,
                                data : filters,
                                dataType: 'json',
                                headers : {
                                    "Authorization" : "Bearer "+getToken()
                                }
                            }).done(function(res){
                                //res = JSON.parse(res)
                                res.data.forEach(elm => {
    
                                    data['data'].push({month : elm.month, revenue : Number.parseInt(elm.kpi), off_group : elm.offer_group,_type : 'month_trend'});
                                });
                            })
                        ).then(function(){
                            return data;
                        })
                    break;
                case 'dt_trend' :
                    return $.ajax({
                        method : 'GET',
                        url : url4,
                        data : filters,
                        dataType: 'json',
                        headers : {
                            "Authorization" : "Bearer "+getToken()
                        }
                    }).done((res) => {
                        res.data.forEach(elm => {
                            data['data'].push({upd_dt : elm.upd_dt, revenue :  Number.parseInt(elm.kpi), _type : 'dt_trend',off_group : elm.offer_group,period : elm.month });
                        });
                    }).then(function(){
                        return data;
                    })
                break;                    
                                           
                 default:
                     break;
             }
             break

             case 'pay' :
                switch (params) {
                    case 'bill_mark':                
                           let dat = {};
                           return $.when(
                                   $.ajax({
                                       method : 'GET',
                                       url : url11,
                                       data : filters,
                                       dataType: 'json',
                                       headers : {
                                           "Authorization" : "Bearer "+getToken()
                                       }
                                   }).done(function(res){
                                       
                                       data.data = getHierachy(res.data,['billing_type','market','offer_group'],'revenue')
                                   })
                               ).then(function(){                            
                                   return data;
                               })
                       break;
           
                       case 'bill_mark_' :
                           return $.when(
                                   $.ajax({
                                       method : 'GET',
                                       url : url11,
                                       data : filters,
                                       dataType: 'json',
                                       headers : {
                                           "Authorization" : "Bearer "+getToken()
                                       }
                                   }).done(function(res){
                                       res.data.forEach(elm => {
                                           elm._type = '_grpoff';
                                           data.data.push(elm);
                                       });
                                   })
                               ).then(function(){
                                   return data;
                               })                                                           
   
                        break;
                   case 'offer':
   
                       return $.when(
                           $.ajax({
                               method : 'GET',
                               url : url21,
                               data : filters,
                               dataType: 'json',
                               headers : {
                                   "Authorization" : "Bearer "+getToken()
                               }
                           }).done(function(res){
                               res.data.sort((a,b) => a.revenue - b.revenue);
                               res.data.forEach(elm => {
                                   data['data'].push({off_group : elm.offer_group, revenue : elm.revenue , _type : 'off_split'});
                               });
                           })
                       ).then(function(){                            
                           return data;
                       })
                   
                   break; 
                   
                   case 'month_trend':
                       return $.when(
                               $.ajax({
                                   method : 'GET',
                                   url : url31,
                                   data : filters,
                                   dataType: 'json',
                                   headers : {
                                       "Authorization" : "Bearer "+getToken()
                                   }
                               }).done(function(res){
                                   //res = JSON.parse(res)
                                   res.data.forEach(elm => {
       
                                       data['data'].push({month : elm.month, revenue : Number.parseInt(elm.kpi), off_group : elm.offer_group,_type : 'month_trend'});
                                   });
                               })
                           ).then(function(){
                               return data;
                           })
                       break;
                   case 'dt_trend' :
                       return $.ajax({
                           method : 'GET',
                           url : url41,
                           data : filters,
                           dataType: 'json',
                           headers : {
                               "Authorization" : "Bearer "+getToken()
                           }
                       }).done((res) => {
                           res.data.forEach(elm => {
                               data['data'].push({upd_dt : elm.upd_dt, revenue :  Number.parseInt(elm.kpi), _type : 'dt_trend',off_group : elm.offer_group,period : elm.month });
                           });
                       }).then(function(){
                           return data;
                       })
                   break;                    
                                              
                    default:
                        break;
                }             
             break
         }
    }


    static getRecouvr(type,filters) {

        let data = {data : []};
        let url = BillingServerManager.api_url,
            url1 = url+'getBill/0152',
            url2 = url+'getBill/0162'
        switch (type) {
            case 'split':
                    let rev = 0, paid = 0;
                    
                    return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url1,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            let recouv
                                res.data.forEach(elm => {
                                        recouv = 100
                                        if(elm.rev_fact && Number.parseInt(elm.rev_fact) != 0){
                                            recouv = 100*(Number.parseInt(elm.rev_paid)/Number.parseInt(elm.rev_fact)).toFixed(2)
                                        }
                                        /*if(recouv != 0)*/ data.data.push({off_group : elm.off_group, recouvr : recouv})                                  
                                })
                        })        
                                  
                        ).then(function(d){
                            return data
                        });                      
                break;

            case 'trend':
               // let rev = 0, paid = 0;
                
                return $.when(
                    $.ajax({
                        method : 'GET',
                        url : url2,
                        data : filters,
                        dataType: 'json',
                        headers : {
                            "Authorization" : "Bearer "+getToken()
                        }
                    }).done(function(res){
                        let rcv 
                            res.data.forEach(elm => {
                                rcv = 100
                                if(elm.rev_fact && Number.parseInt(elm.rev_fact) != 0){
                                    rcv = 100*(Number.parseInt(elm.rev_paid)/Number.parseInt(elm.rev_fact)).toFixed(2)
                                }
                                data.data.push({name : elm.month, value :Number.parseInt(elm.rev_fact), _kpi : 'bill_trend', _type : 'month_trend' })
                                data.data.push({name : elm.month, value :Number.parseInt(elm.rev_paid), _kpi : 'paid_trend', _type : 'month_trend' })
                                data.data.push({name : elm.month, value :rcv, _kpi : 'recouvr_trend', _type : 'month_trend' })
                            })
                    })        
                              
                    ).then(function(d){
                        return data
                    });                      
            break;                
        
            default:
                break;
        }

    }


    static getSplit(type, filters,params){
        let data = {data : []};
        let url1 = BillingServerManager.api_url+'getBill/018';
        let url2 = BillingServerManager.api_url+'getBill/019';
        let url3 = BillingServerManager.api_url+'getBill/020';
        let url4 = BillingServerManager.api_url+'getBill/0201';

        switch (type) {
            case 'bill':
                switch (params) {
                    case 'type':
                        return $.ajax({
                            method : 'GET',
                            url : url1,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done((res) => {
                            res.data.forEach(elm => {
                               if(elm.amount> 0) data['data'].push({ name : elm.type, kpi : elm.amount, _type : "bill_type" });
                            });
                        }).then(function(){
                            return data;
                        })
                        break;                        
                
                    case 'status':
                        return $.ajax({
                            method : 'GET',
                            url : url2,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done((res) => {
                            res.data.forEach(elm => {
                               if(elm.amount> 0) data['data'].push({ name : elm.etat, kpi : elm.amount, _type : "bill_status" });
                            });
                        }).then(function(){
                            return data;
                        })
                        break;
                }
                break;
        
            case 'pay':
                switch (params) {
                    case 'type':
                        return $.ajax({
                            method : 'GET',
                            url : url3,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done((res) => {
                            res.data.forEach(elm => {
                               if(elm.amount> 0) data['data'].push({ name : elm.type, kpi : elm.amount, _type : "pay_type" });
                            });
                        }).then(function(){
                            return data;
                        })
                        break;                        
                
                    case 'status':
                        return $.ajax({
                            method : 'GET',
                            url : url4,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done((res) => {
                            res.data.forEach(elm => {
                               if(elm.amount> 0) data['data'].push({ name : elm.etat, kpi : elm.amount, _type : "pay_status" });
                            });
                        }).then(function(){
                            return data;
                        })
                        break;
                }
                break;
        }
    }

    static getBillZone(type,filters) {

        let url1 = BillingServerManager.api_url+'getBill/022';
        let data = {data : []}
        switch (type) {
            case 'vue1':
                return $.when(
                    $.ajax({
                        method : 'GET',
                        url : url1,
                        data : filters,
                        dataType: 'json',
                        headers : {
                            "Authorization" : "Bearer "+getToken()
                        }
                    }).done(function(res){
                        
                        data.data = getHierachy(res.data,['region','commune','quartier'],'amount')
                    })
                ).then(function(){                            
                    return data;
                })
                break;
        
            case 'vue2':
                return $.when(
                    $.ajax({
                        method : 'GET',
                        url : url1,
                        data : filters,
                        dataType: 'json',
                        headers : {
                            "Authorization" : "Bearer "+getToken()
                        }
                    }).done(function(res){
                        res.data.forEach(elm => {
                            data.data.push(elm);
                        });
                    })
                ).then(function(){
                    return data;
                })
                break;
        }
    }

    static getBillLib(type,filters) {

        let url1 = BillingServerManager.api_url+'getBill/023';
        let data = {data : []}
        switch (type) {
            case 'vue1':
                return $.when(
                    $.ajax({
                        method : 'GET',
                        url : url1,
                        data : filters,
                        dataType: 'json',
                        headers : {
                            "Authorization" : "Bearer "+getToken()
                        }
                    }).done(function(res){
                        
                        data.data = getHierachy(res.data,['aggregat','libele'],'amount')
                    })
                ).then(function(){                            
                    return data;
                })
                break;
        
            case 'vue2':
                return $.when(
                    $.ajax({
                        method : 'GET',
                        url : url1,
                        data : filters,
                        dataType: 'json',
                        headers : {
                            "Authorization" : "Bearer "+getToken()
                        }
                    }).done(function(res){
                        res.data.forEach(elm => {
                            data.data.push(elm);
                        });
                    })
                ).then(function(){
                    return data;
                })
                break;
        }
    }



    static getEncaiss(type,filters) {

        let url1 = BillingServerManager.api_url+'getBill/024';
        let url2 = BillingServerManager.api_url+'getBill/025';
        let data = {data : []}
        switch (type) {
            case 'vue1':
                return $.when(
                    $.ajax({
                        method : 'GET',
                        url : url1,
                        data : filters,
                        dataType: 'json',
                        headers : {
                            "Authorization" : "Bearer "+getToken()
                        }
                    }).done(function(res){
                        
                        res.data.forEach(elm => {
                            if (elm.qty > 0) data.data.push(elm);
                        });
                    })
                ).then(function(){                            
                    return data;
                })
                break;


                case 'meth':
                    return $.when(
                        $.ajax({
                            method : 'GET',
                            url : url2,
                            data : filters,
                            dataType: 'json',
                            headers : {
                                "Authorization" : "Bearer "+getToken()
                            }
                        }).done(function(res){
                            
                            res.data.forEach(elm => {
                                if (elm.amount > 0) data.data.push(elm);
                            });
                        })
                    ).then(function(){                            
                        return data;
                    })
                    break;                
        }
    }
}
