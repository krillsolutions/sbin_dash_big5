var token = ""
export function setToken(tk) {

        token = tk
        webix.storage.session.put('tk',tk)
}

export function getToken() {
        return (token != '')? token : webix.storage.session.get('tk')
}

export function boot() {
        let d1 = ( default_dates.d1 == '') ? webix.Date.dateToStr('%Y-%m-%d')(webix.Date.add(new Date(), -1, 'day')) : default_dates.d1,
            d2 = (default_dates.d2 == '')?  webix.Date.dateToStr('%Y-%m-%d')(webix.Date.add(new Date(), -1, 'day')): default_dates.d2;
            console.log(d2);
    if ( webix.storage.session.get('filter') == null) webix.storage.session.put('filter', { d1 : d1, d2 : d2 } );

    if(webix.storage.session.get('menucollapsed')) gconfig['menucollapsed'] = webix.storage.session.get('menucollapsed');
    else{
        webix.storage.session.put('menucollapsed', true);
        gconfig['menucollapsed'] = true;
    }

}

export function getPeriod() {

        let filt = webix.storage.session.get('filter');
        return {d1 : filt.d1, d2 : filt.d2};

}

export function getFilter() {

        let filt = webix.storage.session.get('filter');
        return filt;

}

export function getFilterString() {


        let filter = {},
        filter_t = {...getFilter()}
    for(let f in filter_t) {

        if(typeof filter_t[f] == 'object' && filter_t[f].length) {
            filter[f] = filter_t[f].map(d => "'"+d+"'").join(',')  
            continue                              
        }
        filter[f] = filter_t[f]

        }
        return filter
}

function groupBy(xs, key) {
        return xs.reduce(function(rv, x) {
          (rv[x[key]] = rv[x[key]] || []).push(x);
          return rv;
        }, {});
      }

export function getTreeHierachy(data,levels=[], name = "name", values = ["value"],deep = 0, id=0) {

        if(levels.length != 0){let lv = [...levels]
            let dp = (deep == 0)? lv.length : deep,
                p = dp - lv.length
            let dat = groupBy(data,lv[0]);lv.shift()
            let res = []
        let parts = {}
        for (const v of values) {
                parts[v] =  d3.sum(data, d => d[v])
        }
        let i = 0
            for (const key in dat) {
                    i++
                    const element = dat[key]
                    let ID = (p == 0)? ""+i : id+"."+i
                    let dd = {id : ID  }
                    dd[name] = key
                    for (const val of values) {
                        dd[val] = d3.sum(element, d => d[val])
                        if(parts[val] && parts[val] != 0) dd[val+"_percent"] = 100*(dd[val]/parts[val]).toFixed(2)
                    }
                                    
                    //let dd = {name : key , value : d3.sum(element, d => d[value]) };
                    let children = getTreeHierachy(element,lv,name,values,dp, ID)
                    if(children.length != 0) {
                        dd.data = children
                    }
                    res.push(dd)                 
            }
            return res
        }
        else {
                return []
        }
    
    }


export const gconfig =  {

        'app' : '', dashboards : { home : '', traffic_voix : '', 'traffic_sms' : '', traffic_data: '', parc : '', revenue : "", om : '', monitor : '', wimax : '' , recharge : '', traffic : '', sales : ''}
}
