import {getToken} from 'models/utils/general/boot';


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


function getTreeHierachy(data,levels=[], name = "name", values = ["value"]) {

    if(levels.length != 0){let lv = [...levels]
        let dat = groupBy(data,lv[0]);lv.shift()
        let res = []
        for (const key in dat) {
                const element = dat[key]
                let dd = {}
                dd[name] = key
                for (const val of values) {
                    dd[val] = d3.sum(element, d => d[val])
                }
                //let dd = {name : key , value : d3.sum(element, d => d[value]) };
                let children = getTreeHierachy(element,lv,name,values)
                if(children.length != 0) {
                    dd.data = children
                }
               // else delete dd.webix_kids
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

            case 'revenue_fai':
                url += 'getRevenue/001';
                data['data'][0]['kpi'] = 'revenue_fai';
                break;
            case 'revenue_gros':
                url += 'getRevenue/00101';
                data['data'][0]['kpi'] = 'revenue_gros';
                break;                

            case 'tvoix':
                url += 'getTraffic/001';
                data['data'][0]['kpi'] = 'tvoix';
                break;

            case 'rsales':
                url += 'getSale/001';
                data['data'][0]['kpi'] = 'rsales';
                break;

            case 'fpaid':
                url += 'getBill/001';
                data['data'][0]['kpi'] = 'fpaid';
                break;

            case 'ndemande':
                url += 'getDemand/001';
                data['data'][0]['kpi'] = 'demands';
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
                dataType : 'json',
                headers : {
                    "Authorization" : "Bearer "+getToken()
                }
            }).done(function(res){
                //res = JSON.parse(res)
                k1 = (res['data'][0]['kpi'] != null) ? Number.parseFloat(res['data'][0]['kpi']) : 0;
                data['data'][0]['value'] = k1;
                data.data[0]['var'] = (k1 > 0)? (100*res['data'][0]['kpi_var']/k1).toFixed(2) : -100;
            }),
            ).then(function(d){
                    return data;
            });
    }

    static getParc(type, filters){

        let data = {data : []};

        let url1 = HomeServerManager.api_url+'getParc/002',
        url2 = HomeServerManager.api_url+'getParc/003'
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

                                data['data'].push({month : elm.month, parc : Number.parseInt(elm.kpi), _type : 'month_trend', client_type : elm.client_type});
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
                        data['data'].push({upd_dt : elm.upd_dt, parc :  Number.parseInt(elm.kpi), _type : 'dt_trend', client_type : elm.client_type ,period : elm.upd_dt.substr(0,7) });
                    });
                }).then(function(){
                    return data;
                })
            break;

        }
    }

    static getRevenue(type, filters){


   
        let data = {data : []};

        let url1 = HomeServerManager.api_url+'getRevenue/002',
        url2 = HomeServerManager.api_url+'getRevenue/003'
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

                                data['data'].push({month : elm.month, revenue : Number.parseInt(elm.kpi), _type : 'month_trend', _kpi : elm.client_category, rev_type : elm.client_category});
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
                        data['data'].push({upd_dt : elm.upd_dt, revenue :  Number.parseInt(elm.kpi), _type : 'dt_trend',rev_type : elm.client_category  ,_kpi : elm.client_category,period : elm.upd_dt.substr(0,7) });
                    });
                }).then(function(){
                    return data;
                })
            break;

        }

    }


    static getPay(type, filters){


   
        let data = {data : []};

        let url1 = HomeServerManager.api_url+'getBill/002',
        url2 = HomeServerManager.api_url+'getBill/003'
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

                                data['data'].push({month : elm.month, revenue : Number.parseInt(elm.kpi), _type : 'month_trend', _kpi : elm.category_client, clt_type : elm.category_client});
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
                        data['data'].push({upd_dt : elm.upd_dt, revenue :  Number.parseInt(elm.kpi), _type : 'dt_trend',clt_type : elm.category_client  ,_kpi : elm.category_client,period : elm.upd_dt.substr(0,7) });
                    });
                }).then(function(){
                    return data;
                })
            break;

        }

    }

    static getDemand(type, filters){


   
        let data = {data : []};

        let url1 = HomeServerManager.api_url+'getDemand/002',
        url2 = HomeServerManager.api_url+'getDemand/003'
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

                                data['data'].push({month : elm.month, qty : Number.parseInt(elm.kpi), _type : 'month_trend', clt_type : elm.category_client});
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
                        data['data'].push({upd_dt : elm.upd_dt, qty :  Number.parseInt(elm.kpi), _type : 'dt_trend',clt_type : elm.category_client  ,period : elm.upd_dt.substr(0,7) });
                    });
                }).then(function(){
                    return data;
                })
            break;

        }

    }


    static getArpu(type,filters){

        let data =  {data : []}
        let url1 = HomeServerManager.api_url+'getRevenue/004',
        url2 = HomeServerManager.api_url+'getRevenue/005'
        switch(type){


            case 'month_trend' :
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
                               if(elm.parc > 0) data['data'].push({month : elm.month, trend : Number.parseFloat(elm.rev)/ Number.parseInt(elm.parc),client_type :elm.client_type, _type : 'month_trend'});
                            });
                        })
                    ).then(function(){
                        return data;
                    });
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
                           if( elm.parc > 0) data['data'].push({upd_dt : elm.upd_dt, trend_dt : Number.parseFloat(elm.rev)/ Number.parseInt(elm.parc), _type : 'dt_trend', client_type :elm.client_type,period : elm.upd_dt.substr(0,7)  });
                        });
                    }).then(function(){
                        return data;
                    })
                break;
        }
    }

    static getTrafficSplitAll(type, filters, params) {

        let data = {data : []},
        url1 = HomeServerManager.api_url+'getTraffic/002',
        url2 = HomeServerManager.api_url+'getTraffic/003',
        url3 = HomeServerManager.api_url+'getTraffic/004';
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
                            if(elm.voice > 0 ) data['data'].push({_kpi : 'voice', traffic : Number.parseFloat(elm.voice), _type : 'month_trend', month : elm.month });
                            if(elm.sms > 0 ) data['data'].push({_kpi : 'sms', traffic : Number.parseFloat(elm.sms), _type : 'month_trend', month : elm.month});
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
                            if(elm.voice > 0 ) data['data'].push({_kpi : 'voice', traffic : Number.parseFloat(elm.voice), _type : 'dt_trend', upd_dt : elm.upd_dt, period : elm.upd_dt.substr(0,7) });
                            if(elm.sms > 0 ) data['data'].push({_kpi : 'sms', traffic : Number.parseFloat(elm.sms), _type : 'dt_trend', upd_dt : elm.upd_dt, period : elm.upd_dt.substr(0,7)});
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
                            if(elm.voice > 0 ) data['data'].push({_kpi : 'voice', traffic : Number.parseFloat(elm.voice),_type : 'slot_trend', slot : elm.slot, period : res['d1'] });
                            if(elm.sms > 0 ) data['data'].push({_kpi : 'sms', traffic : Number.parseFloat(elm.sms), _type : 'slot_trend', slot : elm.slot, period : res['d1']});
                            
                        });                            
                    })
                    ).then(function(dat){
                        return data;
                    })
            break;            
        }
    }

    static getBundle(type, filters) {
        let data = {data : []};
        let url1 = HomeServerManager.api_url+'getRevenue/006',
        url2 = HomeServerManager.api_url+'getRevenue/007';
        switch(type){

           /* case 'split' :

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

                break;*/

            case 'month_trend' :
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
                               if(elm.bndle > 0) data['data'].push({month : elm.month, trend : elm.bndle, _type : 'month_trend'});
                            });
                        })
                    ).then(function(){
                        return data;
                    });
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
                           if( elm.bndle > 0) data['data'].push({upd_dt : elm.upd_dt, trend_dt : elm.bndle, _type : 'dt_trend', period : elm.upd_dt.substr(0,7)  });
                        });
                    }).then(function(){
                        return data;
                    })
                break;
        }

    }
    
    static getRecharge(type, filters){
        let data = {data : []};
        let url1 = HomeServerManager.api_url+'getRevenue/008',
        url2 = HomeServerManager.api_url+'getRevenue/009';
            switch(type){

    
                case 'month_trend' :        
                    return $.when($.ajax({
                                method : 'GET',
                                url : url1,
                                data : filters,
                                dataType: 'json',
                                headers : {
                                    "Authorization" : "Bearer "+getToken()
                                }
                            }).done(function(res){
                                res.data.forEach(elm => {
                                    data['data'].push({month : elm.month, trend : elm.recharge, _type : 'month_trend'});
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
                            data['data'].push({upd_dt : elm.upd_dt, trend_dt : elm.recharge, _type : 'dt_trend', period : elm.upd_dt.substr(0,7)  });
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
        let url = ParcServerManager.api_url+'getParc/004';
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

            k1 = res['data'][0]['postsimule_'];
            k2 = res['data'][0]['postsimule_'];		
            data.data.push({ kpi : 'postsimule',  value : k2,
                var : ( k1 > 0 )? (100*(k2 - k1)/k1).toFixed(2) : 100 });
            
            k1 = res['data'][0]['parc_lg_'];
            k2 = res['data'][0]['parc_lg']; 		
            data.data.push({ kpi : 'parc_lg',  value : k2,
                var : ( k1 > 0 )? (100*(k2- k1)/k1).toFixed(2) : 100 });

            k1 = res['data'][0]['gros_'];
            k2 = res['data'][0]['gros'];		
            data.data.push({kpi : 'gros', value : k2, 
            var : ( k1 > 0 )? (100*(k2 - k1)/k1).toFixed(2) : 100 })
            })
        ).then(function(d){
                return data;
        });
    }

    static getParcByBill(type,filters) {

        let data = {data : []};
        let url1 = ParcServerManager.api_url+'getParc/005';
        let url2 = ParcServerManager.api_url+'getParc/006';
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
                                data['data'].push({bill_type : elm.bill_type, bill_qty : elm.kpi, _type : elm.category_client});
                            });                            
                        })).then(function(){
                            return data;
                        });

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
                                data['data'].push({month : elm.month, bill_qty : elm.kpi, _type : elm.category_client, _kpi : elm.category_client, bill_type : elm.bill_type });
                            });
                        })
                    ).then(function(){
                        return data;
                    })
                break;                
        }
    }

    static getParcByOffer(type,filters) {

        let data = {data : []};
        let url1 = ParcServerManager.api_url+'getParc/007';
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
                            
                            data.data = getHierachy(res.data,['type','grp','off'],'kpi')

                        })
                    ).then(function(){
                        console.log(data)                            
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

    static getParcByType(type,filters,params) {

        let data = {data : []};
        let url1 = ParcServerManager.api_url+'getParc/008';
        let url2 = ParcServerManager.api_url+'getParc/009';
        let url3 = ParcServerManager.api_url+'getParc/010';

        let url4 = ParcServerManager.api_url+'getParc/0081';
        let url5 = ParcServerManager.api_url+'getParc/0091';
        let url6 = ParcServerManager.api_url+'getParc/0101';        
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
                            res.data.sort((a,b) => a.kpi - b.kpi);
                            res.data.forEach(elm => {
                                data['data'].push({off_group : elm.grp, qty : elm.kpi , _type : 'off_split'});
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
                                url : url4,
                                data : filters,
                                dataType: 'json',
                                headers : {
                                    "Authorization" : "Bearer "+getToken()
                                }
                            }).done(function(res){
                                res.data.sort((a,b) => a.kpi - b.kpi);
                                res.data.forEach(elm => {
                                    data['data'].push({off_group : elm.grp, qty : elm.kpi , _type : 'off_split'});
                                });
                            })
                        ).then(function(){                            
                            return data;
                        })
                    break;

                case 'month_trend':

                        switch (params) {
                            case 'vue1':
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
                        
                            case 'vue2':
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
                                        //res = JSON.parse(res)
                                        res.data.forEach(elm => {
            
                                            data['data'].push({month : elm.month, qty : Number.parseInt(elm.kpi), off_group : elm.grp,_type : 'month_trend'});
                                        });
                                    })
                                ).then(function(){
                                    return data;
                                })                                
                                break;
                        }                        
                    break;
                case 'dt_trend' :

                        switch (params) {
                            case 'vue1':
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
                        
                            case 'vue2':
                                return $.ajax({
                                    method : 'GET',
                                    url : url6,
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

                break;                    
            
        }
    }

    static getParcLine(type,filters) {

        let data = {data : []};
        let url1 = ParcServerManager.api_url+'getParc/011';
        let url2 = ParcServerManager.api_url+'getParc/012';
        let url3 = ParcServerManager.api_url+'getParc/013';
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
                            res.data.sort((a,b) => a.kpi - b.kpi);
                            res.data.forEach(elm => {
                                data['data'].push({status : elm.status, qty : elm.kpi});
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
    
                                    data['data'].push({month : elm.month, qty : Number.parseInt(elm.kpi), status : elm.status,_type : 'month_trend'});
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
                            data['data'].push({upd_dt : elm.upd_dt, qty :  Number.parseInt(elm.kpi), _type : 'dt_trend',status : elm.status,period : elm.upd_dt.substr(0,7) });
                        });
                    }).then(function(){
                        return data;
                    })
                break;                    
            
        }
    }

    static getParcBillMkt(type,filters){

        let data = {data : []};
        let url1 = ParcServerManager.api_url+'getParc/014';
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
                            
                            data.data = getHierachy(res.data,['billing_type','market'],'kpi')
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
                                elm._type = '_mkbt';
                                data.data.push(elm);
                            });
                        })
                    ).then(function(){
                        return data;
                    })
                break;                
        }

    }

    static getParcZones(type,filters){


        let data = {data : []};
        let url1 = ParcServerManager.api_url+'getParc/015';
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
                            res.data.sort((a,b) => a.kpi - b.kpi);
                            res.data.forEach(elm => {

                                data.data.push({zone : elm.zone, qty :  Number.parseInt(elm.kpi)})
                            })
                        })
                    ).then(function(){                            
                        return data;
                    })
                break;

        }

    }



    static getParcGros(type,filters){


        let data = {data : []};
        let url1 = ParcServerManager.api_url+'getParc/016';
        let url2 = ParcServerManager.api_url+'getParc/017';
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
                            data.data = res.data
                        })
                    ).then(function(){                            
                        return data;
                    })
                break;


            case 'off' :
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
                        data.data = res.data
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
        //let f1 = {...filters, 'b' : 'Prepaid'};
        //let f2 = {...filters, 'b' : 'Postpaid'};
        let data = {data : []};
        let url = RevenueServerManager.api_url,
            url1 = url+'getRevenue/014',
            url2 = url+'getBill/001';
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
            data['data'].push({kpi : 'rsales' , value : res['data'][0]['rsales'], var : (res['data'][0]['rsales_7'] != 0 && res['data'][0]['rsales'] != null  && res['data'][0]['rsales_7'] != null )? (100*(res['data'][0]['rsales'] - res['data'][0]['rsales_7']) /res['data'][0]['rsales_7']).toFixed(2) : 100 });           
            data['data'].push({kpi : 'rpostsimul' , value : res['data'][0]['postsimul'], var : (res['data'][0]['postsimul_7'] != 0 && res['data'][0]['postsimul'] != null && res['data'][0]['postsimul_7'] != null )? (100*(res['data'][0]['postsimul'] - res['data'][0]['postsimul_7']) /res['data'][0]['postsimul_7']).toFixed(2) : 100 });           
            data['data'].push({kpi : 'rprepaid' , value : res['data'][0]['prep'], var : (res['data'][0]['prep_7'] != 0 && res['data'][0]['prep'] != null && res['data'][0]['prep_7'] != null )? (100*(res['data'][0]['prep'] - res['data'][0]['prep_7']) /res['data'][0]['prep_7']).toFixed(2) : 100 });           
            data['data'].push({kpi : 'rpostpaid' , value : res['data'][0]['post'], var : (res['data'][0]['post_7'] != 0 && res['data'][0]['post'] != null  && res['data'][0]['post_7'] != null )? (100*(res['data'][0]['post'] - res['data'][0]['post_7']) /res['data'][0]['post_7']).toFixed(2) : 100 });           
            data['data'].push({kpi : 'rtot' , value : res['data'][0]['tot'], var : (res['data'][0]['tot_7'] != 0 && res['data'][0]['tot'] != null  && res['data'][0]['tot_7'] != null)? (100*(res['data'][0]['tot'] - res['data'][0]['tot_7']) /res['data'][0]['tot_7']).toFixed(2) : 100 });           

        })        
        ,
        $.ajax({
            method : 'GET',
            url : url2,
            data : filters,
            dataType: 'json',
            headers : {
                "Authorization" : "Bearer "+getToken()
            }
        }).done(function(res){
            let k1 = (res['data'][0]['kpi'] != null) ? Number.parseFloat(res['data'][0]['kpi']) : 0;
            // data['data'][0]['value'] = k1;
            let kvar = (k1 > 0)? (100*res['data'][0]['kpi_var']/k1).toFixed(2) : -100;
            data['data'].push({kpi : 'fpaid' , value : k1, var : kvar});    
        })            
        ).then(function(d){
            return data;
        });        
    }


    static getRevenue(type,filters,params) {

        let data = {data : []};
        let url1 = RevenueServerManager.api_url+'getRevenue/015';
        let url2 = RevenueServerManager.api_url+'getRevenue/016';
        let url3 = RevenueServerManager.api_url+'getRevenue/017';
        let url4 = RevenueServerManager.api_url+'getRevenue/0151';
        let url5 = RevenueServerManager.api_url+'getRevenue/0161';
        let url6 = RevenueServerManager.api_url+'getRevenue/0171';

        switch(type){

            case 'split' :
                
             //   let dat = {};
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
                                if( Number.parseInt(elm.kpi) > 0) data['data'].push({rev_type : elm.rev_type, revenue : elm.kpi , _type : 'rev_split'});
                            });
                        })
                    ).then(function(){                            
                        return data;
                    })
                break;
                case 'split_gros' :
                
                    //let dat = {};
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
                                    if( Number.parseInt(elm.kpi) > 0) data['data'].push({rev_type : elm.rev_type, revenue : elm.kpi , _type : 'rev_split'});
                                });
                            })
                        ).then(function(){                            
                            return data;
                        })
                    break;                
                case 'month_trend':
                    switch (params) {
                        case 'vue0':
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
        
                                        if( Number.parseInt(elm.kpi) > 0)  data['data'].push({month : elm.month, revenue : Number.parseInt(elm.kpi), rev_type : elm.rev_type,_type : 'month_trend'});
                                    });
                                })
                            ).then(function(){
                                return data;
                            })
                            break;
                    
                        case 'vue1':
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
        
                                        if( Number.parseInt(elm.kpi) > 0)  data['data'].push({month : elm.month, revenue : Number.parseInt(elm.kpi), rev_type : elm.rev_type,_type : 'month_trend'});
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
                                    url : url5,
                                    data : filters,
                                    dataType: 'json',
                                    headers : {
                                        "Authorization" : "Bearer "+getToken()
                                    }
                                }).done(function(res){
                                    //res = JSON.parse(res)
                                    res.data.forEach(elm => {
        
                                        if( Number.parseInt(elm.kpi) > 0)  data['data'].push({month : elm.month, revenue : Number.parseInt(elm.kpi), rev_type : elm.rev_type,_type : 'month_trend'});
                                    });
                                })
                            ).then(function(){
                                return data;
                            })
                            break;
                    }

                    break;
                case 'dt_trend' :

                    switch (params) {
                        case 'vue0':

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
                                    if( Number.parseInt(elm.kpi) > 0)  data['data'].push({upd_dt : elm.upd_dt, revenue :  Number.parseInt(elm.kpi), _type : 'dt_trend',rev_type : elm.rev_type,period : elm.month });
                                });
                            }).then(function(){
                                return data;
                            })
                            
                            break;

                        case 'vue1':
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
                                    if( Number.parseInt(elm.kpi) > 0)  data['data'].push({upd_dt : elm.upd_dt, revenue :  Number.parseInt(elm.kpi), _type : 'dt_trend',rev_type : elm.rev_type,period : elm.month });
                                });
                            }).then(function(){
                                return data;
                            })
                        break;
                    
                        case 'vue2':
                            return $.ajax({
                                method : 'GET',
                                url : url6,
                                data : filters,
                                dataType: 'json',
                                headers : {
                                    "Authorization" : "Bearer "+getToken()
                                }
                            }).done((res) => {
                                res.data.forEach(elm => {
                                    if( Number.parseInt(elm.kpi) > 0)  data['data'].push({upd_dt : elm.upd_dt, revenue :  Number.parseInt(elm.kpi), _type : 'dt_trend',rev_type : elm.rev_type,period : elm.month });
                                });
                            }).then(function(){
                                return data;
                            })                            
                            break;
                    }
                break;                    
            
        }
    }  
    
    
    static getRevGrpOff(type,filters){

        let data = {data : []};
        let url1 = RevenueServerManager.api_url+'getRevenue/018';
        let url2 = RevenueServerManager.api_url+'getRevenue/0181';
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
                            
                            data.data = getHierachy(res.data,['revenue_type','type', 'offer_group','tp_id'],'kpi')
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
                                elm._type = '_grpoff';
                                data.data.push(elm);
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
                                url : url2,
                                data : filters,
                                dataType: 'json',
                                headers : {
                                    "Authorization" : "Bearer "+getToken()
                                }
                            }).done(function(res){
                                
                                data.data = getHierachy(res.data,['revenue_type','type', 'offer_group','tp_id'],'kpi')
                            })
                        ).then(function(){                            
                            return data;
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
        }

    } 
    
    
    static getRevLine(type,filters) {

        let data = {data : []};
        let url1 = RevenueServerManager.api_url+'getRevenue/019';
        let url2 = RevenueServerManager.api_url+'getRevenue/020';
        let url3 = RevenueServerManager.api_url+'getRevenue/021';
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


    static getSales(type,filters){

        let data = {data : []};
        let url1 = RevenueServerManager.api_url+'getRevenue/022';
        let url2 = RevenueServerManager.api_url+'getRevenue/023';
        let url3 = RevenueServerManager.api_url+'getRevenue/024';
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
                            
                            data.data = getHierachy(res.data,['cat','tp'],'revenue')
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
                                elm._type = '_rsales';
                                data.data.push(elm);
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
    
                                    data['data'].push({month : elm.month, revenue : Number.parseInt(elm.revenue), cat : elm.cat,_type : 'month_trend'});
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
                            data['data'].push({upd_dt : elm.upd_dt, revenue :  Number.parseInt(elm.revenue), _type : 'dt_trend',cat : elm.cat,period : elm.month });
                        });
                    }).then(function(){
                        return data;
                    })
                break;                                        
                
                
        }

    }    
    
    static getRevPay(type,filters){

        let data = {data : []};
        let url1 = RevenueServerManager.api_url+'getBill/002';
        let url2 = RevenueServerManager.api_url+'getBill/003';
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
                                    data['data'].push({month : elm.month, revenue : Number.parseInt(elm.kpi), _kpi : elm.category_client,_type : 'month_trend'});
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
                            data['data'].push({upd_dt : elm.upd_dt, revenue :  Number.parseInt(elm.kpi), _type : 'dt_trend',_kpi : elm.category_client,period : elm.month });
                        });
                    }).then(function(){
                        return data;
                    })
                break;                                        
                
                
        }

    }  
    
    
    static getRevZone(type,filters){


        let data = {data : []};
        let url1 = RevenueServerManager.api_url+'getRevenue/025';
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
                            res.data.sort((a,b) => a.kpi - b.kpi);
                            res.data.forEach(elm => {

                                data.data.push({zone : elm.zone, revenue :  Number.parseInt(elm.kpi)})
                            })
                        })
                    ).then(function(){                            
                        return data;
                    })
                break;

        }

    }        

    static getRevBill(type,filters){


        let data = {data : []};
        let url1 = RevenueServerManager.api_url+'getRevenue/026';
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
                            res.data.sort((a,b) => a.kpi - b.kpi);
                            res.data.forEach(elm => {

                                data.data.push({bill : elm.billing_type, revenue :  Number.parseInt(elm.kpi)})
                            })
                        })
                    ).then(function(){                            
                        return data;
                    })
                break;

        }

    }

}


export class SalesServerManager {
    constructor(url){
         SalesServerManager.api_url =  url;
    }
    
    
    static getStat(type,filters) {
        let data = {data : [{}]};
        let url = SalesServerManager.api_url+'getSale/002';
        let url1 = SalesServerManager.api_url+'getSale/0020';
        return $.when(
            $.ajax({
                method : 'GET',
                url : url,
                data : filters,
                dataType : 'json',
                headers : {
                    "Authorization" : "Bearer "+getToken()
                }
            }).done(function(res){
                data['data'].push({kpi : 'rsales' , value : res['data'][0]['rsales'], var : (res['data'][0]['rsales_7'] != 0 && res['data'][0]['rsales'] != null  && res['data'][0]['rsales_7'] != null )? (100*(res['data'][0]['rsales'] - res['data'][0]['rsales_7']) /res['data'][0]['rsales_7']).toFixed(2) : 100 });           
               // data['data'].push({kpi : 'qsales' , value : res['data'][0]['qsales'], var : (res['data'][0]['qsales_7'] != 0 && res['data'][0]['qsales'] != null && res['data'][0]['qsales_7'] != null )? (100*(res['data'][0]['qsales'] - res['data'][0]['qsales_7']) /res['data'][0]['qsales_7']).toFixed(2) : 100 });           
                data['data'].push({kpi : 'rproduit' , value : res['data'][0]['rproduit'], var : (res['data'][0]['rproduit_7'] != 0 && res['data'][0]['rproduit'] != null && res['data'][0]['rproduit_7'] != null )? (100*(res['data'][0]['rproduit'] - res['data'][0]['rproduit_7']) /res['data'][0]['rproduit_7']).toFixed(2) : 100 });           
                data['data'].push({kpi : 'rsouscription' , value : res['data'][0]['rsouscription'], var : (res['data'][0]['rsouscription_7'] != 0 && res['data'][0]['rsouscription'] != null  && res['data'][0]['rsouscription_7'] != null )? (100*(res['data'][0]['rsouscription'] - res['data'][0]['rsouscription_7']) /res['data'][0]['rsouscription_7']).toFixed(2) : 100 });           
                data['data'].push({kpi : 'rrecharge' , value : res['data'][0]['rrecharge'], var : (res['data'][0]['rrecharge_7'] != 0 && res['data'][0]['rrecharge'] != null  && res['data'][0]['rrecharge_7'] != null)? (100*(res['data'][0]['rrecharge'] - res['data'][0]['rrecharge_7']) /res['data'][0]['rrecharge_7']).toFixed(2) : 100 });     
                data['data'].push({kpi : 'rservice' , value : res['data'][0]['rservice'], var : (res['data'][0]['rservice_7'] != 0 && res['data'][0]['rservice'] != null  && res['data'][0]['rservice_7'] != null)? (100*(res['data'][0]['rservice'] - res['data'][0]['rservice_7']) /res['data'][0]['rservice_7']).toFixed(2) : 100 });     

            }),

            $.ajax({
                method : 'GET',
                url : url1,
                data : filters,
                dataType : 'json',
                headers : {
                    "Authorization" : "Bearer "+getToken()
                }
            }).done(function(res){
                data['data'].push({kpi : 'qsales' , value : res['data'][0]['qsales'], var : (res['data'][0]['qsales_7'] != 0 && res['data'][0]['qsales'] != null && res['data'][0]['qsales_7'] != null )? (100*(res['data'][0]['qsales'] - res['data'][0]['qsales_7']) /res['data'][0]['qsales_7']).toFixed(2) : 100 });           

            }),            

            ).then(function(d){
                    return data;
            });
    }



    
    static getSales(type,filters) {

        let data = {data : []};
        let url1 = SalesServerManager.api_url+'getSale/003';
        let url2 = SalesServerManager.api_url+'getSale/004';
        let url3 = SalesServerManager.api_url+'getSale/005';
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
                                data['data'].push({cat : elm.category, montant : elm.kpi});
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
    
                                    data['data'].push({month : elm.month, montant : Number.parseInt(elm.kpi), cat : elm.category,_type : 'month_trend'});
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
                            data['data'].push({upd_dt : elm.upd_dt, montant :  Number.parseInt(elm.kpi), _type : 'dt_trend',cat : elm.category,period : elm.upd_dt.substr(0,7) });
                        });
                    }).then(function(){
                        return data;
                    })
                break;                    
            
        }
    } 
    
    
    static getSaleSplit(type,filters){

        let data = {data : []};
        let url1 = SalesServerManager.api_url+'getSale/006';
        let url2 = SalesServerManager.api_url+'getSale/007';
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
                            
                            data.data = getHierachy(res.data,['cat','tp', 'prod'],'montant')
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
                                elm._type = '_grpoff';
                                data.data.push(elm);
                            });
                        })
                    ).then(function(){
                        return data;
                    })
                break;
                
                case 'pop1' :
                
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
                                data.data = res.data// getTreeHierachy(res.data,['pop', 'user', 'cat','tp', 'prod'],'pop',['qty','montant'])
                            })
                        ).then(function(){    
                            return data;
                        })
                    break;
    
                case 'pop2' :
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
                                    elm._type = '_popusr';
                                    data.data.push(elm);
                                });
                            })
                        ).then(function(){
                            return data;
                        })
                    break;                
        }

    }     



    static getSalesTrend(type,filters,params) {

        let data = {data : []};
        let url1 = SalesServerManager.api_url+'getSale/008';
        let url2 = SalesServerManager.api_url+'getSale/009';
        let url3 = SalesServerManager.api_url+'getSale/010';
        let url4 = SalesServerManager.api_url+'getSale/011';
        let url5 = SalesServerManager.api_url+'getSale/012';
        let url6 = SalesServerManager.api_url+'getSale/013';
        let url7 = SalesServerManager.api_url+'getSale/014';
        switch(type){

            case 'tot' :
                switch (params) {
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
        
                                        data['data'].push({month : elm.month, amount : Number.parseInt(elm.kpi),_type : 'month_trend'});
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
                                data['data'].push({upd_dt : elm.upd_dt, amount :  Number.parseInt(elm.kpi), _type : 'dt_trend',period : elm.upd_dt.substr(0,7) });
                            });
                        }).then(function(){
                            return data;
                        })
                    break; 

            
                    case 'slot_trend' :
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
                                     data['data'].push({ amount : Number.parseFloat(elm.kpi),_type : 'slot_trend', slot : elm.slot, period : res['d1'] });
                                    
                                });                            
                            })
                            ).then(function(dat){
                                return data;
                            })
                    break;                     
                
                    default:
                        break;
                }
            break;

            case 'users' :
                    switch (params) {
                        case 'month_trend':
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
                                        //res = JSON.parse(res)
                                        res.data.forEach(elm => {
            
                                            data['data'].push({month : elm.month, montant : Number.parseInt(elm.kpi),_type : 'month_trend', user : elm.user});
                                        });
                                    })
                                ).then(function(){
                                    return data;
                                })
                            break;
                        case 'dt_trend' :
                            return $.ajax({
                                method : 'GET',
                                url : url5,
                                data : filters,
                                dataType: 'json',
                                headers : {
                                    "Authorization" : "Bearer "+getToken()
                                }
                            }).done((res) => {
                                res.data.forEach(elm => {
                                    data['data'].push({upd_dt : elm.upd_dt, montant :  Number.parseInt(elm.kpi), _type : 'dt_trend',period : elm.upd_dt.substr(0,7),user : elm.user });
                                });
                            }).then(function(){
                                return data;
                            })
                        break;                                                             
                default:
                        break;
                    }

                break;



            case 'pops' :
                    switch (params) {
                        case 'month_trend':
                            return $.when(
                                    $.ajax({
                                        method : 'GET',
                                        url : url6,
                                        data : filters,
                                        dataType: 'json',
                                        headers : {
                                            "Authorization" : "Bearer "+getToken()
                                        }
                                    }).done(function(res){
                                        //res = JSON.parse(res)
                                        res.data.forEach(elm => {
            
                                            data['data'].push({month : elm.month, montant : Number.parseInt(elm.kpi),_type : 'month_trend', pop : elm.pop});
                                        });
                                    })
                                ).then(function(){
                                    return data;
                                })
                            break;
                        case 'dt_trend' :
                            return $.ajax({
                                method : 'GET',
                                url : url7,
                                data : filters,
                                dataType: 'json',
                                headers : {
                                    "Authorization" : "Bearer "+getToken()
                                }
                            }).done((res) => {
                                res.data.forEach(elm => {
                                    data['data'].push({upd_dt : elm.upd_dt, montant :  Number.parseInt(elm.kpi), _type : 'dt_trend',period : elm.upd_dt.substr(0,7),pop : elm.pop });
                                });
                            }).then(function(){
                                return data;
                            })
                        break;                                                             
                default:
                        break;
                    }

                break;


        }
    }     
}


export class BillingServerManager {


    constructor(url){

            BillingServerManager.api_url =  url;
    }


    static getStat(type,filters) {        

        let data = {data : []};
        let url = BillingServerManager.api_url,
            url1 = url+'getBill/0041';
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
            data['data'].push({kpi : 'rv_postsimul' , value : res['data'][0]['rv_postsimul'], var : (res['data'][0]['rv_postsimul_'] != 0 && res['data'][0]['rv_postsimul'] != null && res['data'][0]['rv_postsimul_'] != null )? (100*(res['data'][0]['rv_postsimul'] - res['data'][0]['rv_postsimul_']) /res['data'][0]['rv_postsimul_']).toFixed(2) : 100 });           
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
        let url1 = BillingServerManager.api_url+'getBill/006';
        let url2 = BillingServerManager.api_url+'getBill/007';
        let url3 = BillingServerManager.api_url+'getBill/008';
        let url4 = BillingServerManager.api_url+'getBill/009';

        let url11 = BillingServerManager.api_url+'getBill/010';
        let url21 = BillingServerManager.api_url+'getBill/011';
        let url31 = BillingServerManager.api_url+'getBill/012';
        let url41 = BillingServerManager.api_url+'getBill/013';   
   
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
                        console.log(res)
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
            url1 = url+'getBill/0151',
            url2 = url+'getBill/0161'
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
                                        data.data.push({off_group : elm.off_group, recouvr : recouv})                                  
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
                        k1 = Number.parseFloat(res['data'][0]['graf_']);
			k2 = Number.parseFloat(res['data'][0]['graf']);
                        data['data'].push({kpi : 'graf' , value : k2, var : (k1 != 0 && k1 != null  )? (100*(k2 - k1)/k1).toFixed(2) : 100, _type : 'graf' }); 
                        k1 = Number.parseFloat(res['data'][0]['bisoft_']);
			k2 = Number.parseFloat(res['data'][0]['bisoft']);
                        data['data'].push({kpi : 'bisoft' , value : k2, var : (k1 != 0 && k1 != null )? (100*(k2 - k1)/k1).toFixed(2) : 100, _type : 'bisoft' }); 
                        k1 = Number.parseFloat(res['data'][0]['factura_']);
			k2 = Number.parseFloat(res['data'][0]['factura']);
                        data['data'].push({kpi : 'factura' , value : k2, var : (k1 != 0 && k1 != null )? (100*(k2 - k1)/k1).toFixed(2) : 100, _type : 'factura' }); 
                        k1 = Number.parseFloat(res['data'][0]['spop_']);
			k2 = Number.parseFloat(res['data'][0]['spop']);
                        data['data'].push({kpi : 'spop' , value : k2, var : (k1 != 0 && k1 != null )? (100*(k2 - k1)/k1).toFixed(2) : 100 , _type : 'spop'}); 
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
            }

    }


    static getMonLine(type, filters, params) {

        let data = {data : []};
        let url = MonitorServerManager.api_url,
            url1 = url+'getMon/003'
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

            }
}
}