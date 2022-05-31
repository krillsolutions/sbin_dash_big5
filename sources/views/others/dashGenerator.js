
function getPanels(panels) {

    let cells = []

    panels.forEach(p => {

        cells.push({
            view : "panel", x : p.x, y : p.y, dx : p.dx, dy : p.dy, header : p.header, 
            body : getGraphs(p.dashs,p.arrange)
        })
    })
    return cells
}

function getGraphs(dashs,arrange) {

    let components = {
        type : "clean",margin : 0
    }
    components[arrange] = []
    dashs.forEach(d => {
        if(d.childs) components[arrange].push(getGraphs(d.childs, d.arrange))
        else components[arrange].push(getComponent(d.id))
    })
    return components
}

function getDashAuthStruct(sAuth, sID, elm, hierachy = ["menus", "tabs", "panels","dashs", "childs"]) {
    let result = {...elm}
    let hierachyCP = [...hierachy]
    if(hierachy.length != 0) {
        let subKey = hierachy[0]
        delete result[subKey]
        if(!elm[subKey]) {
            result[subKey]= []
            return result
        }        
        sID = (sAuth.some(a => a == sID+"."+subKey))? sID+"."+subKey : sID
        let subElmt
        if(subKey == "panels") {
           subElmt = elm[subKey].map(d => {
            let r = {...d}   
            if(!sAuth.some(a => sID+"."+d.id)) r["dashs"] = []
            return r
           })
        }

        subElmt = elm[subKey].filter((e,i) => {
            if(subKey == "panels") return true
            let rootID  = (subKey == "dashs")? sID+".dash_"+(i+1) : sID+"."+e.id
            return sAuth.some(a => a == rootID)
        } )
        hierachyCP.shift()
    
        result[subKey] = subElmt.map((s,i) => {
            return getDashAuthStruct(sAuth,((subKey == "dashs")? sID+".dash_"+(i+1) : sID+"."+s.id),s,hierachyCP)
        })
    }    
    return result
}

let app = [
  {
    _id: { $oid: "6287b1900ade2bbd0c83cba1" },
    id: "dash_app_sbin",
    name: "DASHBOARD SBIN",
    menus: [
      {
        id: "home",
        name: "Home",
        stats: {
          grid_cols: 6,
          grid_rows: 1,
          col_count: 6,
          max_col_count: 6,
          cards: [
            { id: "parc", name: "Parc", x: 0, y: 0, dx: 1, dy: 1 },
            { id: "revenue", name: "Revenue", x: 1, y: 0, dx: 1, dy: 1 },
            { id: "tvoix", name: "Voix", x: 2, y: 0, dx: 1, dy: 1 },
            { id: "tdata", name: "Data", x: 3, y: 0, dx: 1, dy: 1 },
            { id: "topup", name: "Recharge", x: 4, y: 0, dx: 1, dy: 1 },
            { id: "encaiss", name: "Encaissement", x: 5, y: 0, dx: 1, dy: 1 },
          ],
        },
        tabs: [
          {
            id: "tab_1",
            name: "Tab 1",
            grid_cols: 6,
            grid_rows: 1,
            panels: [
              {
                id: "parc",
                name: "Parc",
                arrange: "rows",
                x: 0,
                y: 0,
                dx: 2,
                dy: 6,
                dashs: [
                  {
                    arrange: "cols",
                    childs: [
                      {
                        id: "parcProd",
                        name: "Parc par produit",
                        period_selector: false,
                      },
                      {
                        id: "parcHome",
                        name: "Parc trend",
                        period_selector: true,
                        nb_period_select: 2,
                      },
                    ],
                  },
                  {
                    arrange: "rows",
                    childs: [
                      {
                        id: "arpuHome",
                        name: "arpu Home",
                        period_selector: true,
                        nb_period_select: 2,
                      },
                    ],
                  },
                ],
              },
              {
                id: "arpu",
                name: "ARPU",
                arrange: "rows",
                x: 0,
                y: 6,
                dx: 2,
                dy: 4,
                dashs: [{ arrange: "cols", childs: [] }],
              },
              {
                id: "rev",
                name: "Revenu",
                arrange: "rows",
                x: 2,
                y: 0,
                dx: 2,
                dy: 5,
                dashs: [
                  {
                    arrange: "cols",
                    childs: [
                      {
                        id: "revByType",
                        name: "rev By Type",
                        period_selector: true,
                        nb_period_select: 3,
                      },
                    ],
                  },
                ],
              },
              {
                id: "traffics",
                name: "Revenu",
                arrange: "rows",
                x: 2,
                y: 5,
                dx: 2,
                dy: 5,
                dashs: [
                  {
                    arrange: "cols",
                    childs: [
                      {
                        id: "traff_per",
                        name: "traff per",
                        period_selector: true,
                        nb_period_select: 3,
                      },
                    ],
                  },
                ],
              },
              {
                id: "mnt_recharge",
                name: "Revenu",
                arrange: "rows",
                x: 4,
                y: 0,
                dx: 2,
                dy: 5,
                dashs: [
                  {
                    arrange: "cols",
                    childs: [
                      {
                        id: "topupHome",
                        name: "topup Home",
                        period_selector: true,
                        nb_period_select: 2,
                      },
                    ],
                  },
                ],
              },
              {
                id: "mnt_encaiss",
                name: "Encaissement",
                arrange: "rows",
                x: 4,
                y: 5,
                dx: 2,
                dy: 5,
                dashs: [
                  {
                    arrange: "cols",
                    childs: [
                      {
                        id: "payByType",
                        name: "pay By Type",
                        period_selector: true,
                        nb_period_select: 2,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "parc",
        name: "parc",
        stats: {
          grid_cols: 5,
          grid_rows: 1,
          col_count: 5,
          max_col_count: 5,
          cards: [
            { id: "prepaid", name: "Prepaid", x: 0, y: 0, dx: 1, dy: 1 },
            { id: "postpaid", name: "Postpaid", x: 1, y: 0, dx: 1, dy: 1 },
            { id: "pmobile", name: "Pmobile", x: 2, y: 0, dx: 1, dy: 1 },
            { id: "pfixe", name: "Pfixe", x: 3, y: 0, dx: 1, dy: 1 },
            { id: "plte", name: "Plte", x: 4, y: 0, dx: 1, dy: 1 },
          ],
        },
        tabs: [
          {
            id: "tab_1",
            name: "Tab 1",
            grid_cols: 10,
            grid_rows: 6,
            panels: [
              {
                id: "parc",
                name: "Parc",
                arrange: "rows",
                x: 0,
                y: 0,
                dx: 3,
                dy: 6,
                dashs: [
                  {
                    arrange: "cols",
                    childs: [
                      {
                        id: "bill_market_parc",
                        name: "bill market parc",
                        period_selector: false,
                      },
                    ],
                  },
                ],
              },
              {
                id: "offer_type",
                name: "offer type",
                arrange: "rows",
                x: 3,
                y: 0,
                dx: 4,
                dy: 6,
                dashs: [
                  {
                    arrange: "rows",
                    childs: [
                      {
                        id: "parc_by_type",
                        name: "parc by type",
                        period_selector: false,
                      },
                      {
                        id: "parc_prod_type",
                        name: "parc prod type",
                        period_selector: false,
                      },
                      {
                        id: "parcByType_prod",
                        name: "parc By Type prod",
                        period_selector: true,
                        nb_period_select: 2,
                      },
                    ],
                  },
                ],
              },
              {
                id: "parc_other",
                name: "parc other",
                arrange: "rows",
                x: 7,
                y: 0,
                dx: 3,
                dy: 6,
                dashs: [
                  {
                    arrange: "rows",
                    childs: [
                      {
                        id: "parc_status_net",
                        name: "parc status net",
                        period_selector: false,
                      },
                      {
                        id: "parc_net_add",
                        name: "parc net add",
                        period_selector: false,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "revenue",
        name: "revenue",
        stats: {
          grid_cols: 6,
          grid_rows: 1,
          col_count: 6,
          max_col_count: 6,
          cards: [
            { id: "rtot", name: "Revenu total", x: 0, y: 0, dx: 1, dy: 1 },
            { id: "rpyg", name: "Revenu PYG", x: 1, y: 0, dx: 1, dy: 1 },
            { id: "rmob", name: "Revenu mobile", x: 2, y: 0, dx: 1, dy: 1 },
            { id: "rlte", name: "Revenu LTE", x: 5, y: 0, dx: 1, dy: 1 },
            { id: "rprepaid", name: "Revenu prep", x: 3, y: 0, dx: 1, dy: 1 },
            { id: "rpostpaid", name: "Revenu post", x: 4, y: 0, dx: 1, dy: 1 },
          ],
        },
        tabs: [
          {
            id: "tab_1",
            name: "Tab 1",
            grid_cols: 8,
            grid_rows: 6,
            panels: [
              {
                id: "rev_global",
                name: "rev global",
                arrange: "rows",
                x: 0,
                y: 0,
                dx: 2,
                dy: 6,
                dashs: [
                  {
                    arrange: "rows",
                    childs: [
                      {
                        id: "rev_by_type_split",
                        name: "rev by type split",
                        period_selector: false,
                      },
                      {
                        id: "revByType",
                        name: "rev by type",
                        period_selector: true,
                        nb_period_select: 3,
                      },
                    ],
                  },
                ],
              },
              {
                id: "rev_by_line",
                name: "rev by line",
                arrange: "rows",
                x: 2,
                y: 0,
                dx: 2,
                dy: 6,
                dashs: [
                  {
                    arrange: "rows",
                    childs: [
                      {
                        id: "revByLine_view",
                        name: "parc by type",
                        period_selector: false,
                      },
                      {
                        id: "revByLine",
                        name: "rev By Line",
                        period_selector: true,
                        nb_period_select: 2,
                      },
                    ],
                  },
                ],
              },
              {
                id: "rev_by_op",
                name: "rev by op",
                arrange: "rows",
                x: 4,
                y: 0,
                dx: 2,
                dy: 6,
                dashs: [
                  {
                    arrange: "rows",
                    childs: [
                      {
                        id: "rev_by_op_view",
                        name: "rev by op view",
                        period_selector: false,
                      },
                      {
                        id: "tr_voice_by_op",
                        name: "tr voice by op",
                        period_selector: false,
                      },
                    ],
                  },
                ],
              },
              {
                id: "rev_other",
                name: "rev other",
                arrange: "rows",
                x: 6,
                y: 0,
                dx: 2,
                dy: 6,
                dashs: [
                  {
                    arrange: "rows",
                    childs: [
                      {
                        id: "rev_type_prod",
                        name: "rev type prod",
                        period_selector: false,
                      },
                      {
                        id: "rev_by_clt",
                        name: "rev by clt",
                        period_selector: false,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "recharge",
        name: "recharge",
        stats: {
          grid_cols: 5,
          grid_rows: 1,
          col_count: 5,
          max_col_count: 5,
          cards: [
            {
              id: "rectot",
              name: "rec total",
              x: 0,
              y: 0,
              dx: 1,
              dy: 1,
            },
            {
              id: "cash",
              name: "cash",
              x: 1,
              y: 0,
              dx: 1,
              dy: 1,
            },
            {
              id: "voucher",
              name: "voucher",
              x: 2,
              y: 0,
              dx: 1,
              dy: 1,
            },
            {
              id: "prepaid",
              name: "prepaid",
              x: 3,
              y: 0,
              dx: 1,
              dy: 1,
            },
            {
              id: "postpaid",
              name: "postpaid",
              x: 4,
              y: 0,
              dx: 1,
              dy: 1,
            },
          ],
        },
        tabs: [
          {
            id: "tab_1",
            name: "Tab 1",
            grid_cols: 6,
            grid_rows: 3,
            panels: [
              {
                id: "rec_by_type",
                name: "rec by type",
                arrange: "rows",
                x: 0,
                y: 0,
                dx: 2,
                dy: 3,
                dashs: [
                  {
                    arrange: "rows",
                    childs: [
                      {
                        id: "rec_by_type_view",
                        name: "rec by type view",
                        period_selector: false,
                      },
                      {
                        id: "recByType_trend",
                        name: "rec By Type trend",
                        period_selector: true,
                        nb_period_select: 3,
                      },
                    ],
                  },
                ],
              },
              {
                id: "rec_split",
                name: "rec split",
                arrange: "rows",
                x: 2,
                y: 0,
                dx: 2,
                dy: 3,
                dashs: [
                  {
                    arrange: "rows",
                    childs: [
                      {
                        id: "rec_by_chan",
                        name: "rec by chan",
                        period_selector: false,
                      },
                      {
                        id: "rec_by_value",
                        name: "rec by value",
                        period_selector: false,
                      },
                    ],
                  },
                ],
              },
              {
                id: "rec_by_prod",
                name: "rec by prod",
                arrange: "rows",
                x: 4,
                y: 0,
                dx: 2,
                dy: 3,
                dashs: [
                  {
                    arrange: "rows",
                    childs: [
                      {
                        id: "rec_by_prod_type",
                        name: "rec by prod type",
                        period_selector: false,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]

const menu = "home"
let config = {}

let appStruct = getDashAuthStruct(auth,app[0].id,app[0])

console.log(appStruct)

let tabs =  appStruct.menus.filter(e => e.id == menu)[0].tabs

let graphDashs = []

tabs.forEach(tab => {
    
    graphDashs.push({
        view : "dashboard", gridColumns : tab.grid_cols, gridRows : tab.grid_rows, cells : getPanels(tab.panels)
    })
})

console.log(graphDashs)




