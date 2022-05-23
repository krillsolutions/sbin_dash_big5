var app_id = "dash_app_sbin";

//var host = 'https://192.168.35.8/api/';
// var host = 'https://192.168.11.105/api/';
var host = "https://server.krillsolutions.com/api/sbin/";
var urls = {
  refdata: host + "getRef?kpi=00",
  distref: host + "getRef?kpi=dist",
  menudata: host + "getRef?kpi=01&p=" + app_id,
};

var api_url = "";

var default_dates = {
  d1: "",
  d2: "",
};

var periodSplit = ["1y", "1m", "1d"];

var traffType = ["voice", "sms", "data"];

var trafficYaxisType = {
  voice: {
    index: 0,
    name: "Voix (min.)",
  },
  sms: {
    index: 1,
    name: "SMS (Qte.)",
  },
  data: {
    index: 2,
    name: "Data (Octets)",
  },
};

var billings_rf = {
  b: {
    name: "Factures",
    bill_mk_tl: "Parc billing type/marché/Type de ligne",
    type_line: "Par type de ligne",
    type_line_trend: "Evolution",
  },

  p: {
    name: "Encaissements",
    bill_mk_tl: "Parc billing type/marché/Type de ligne",
    type_line: "Par type de ligne",
    type_line_trend: "Evolution",
  },
};

var authorizations = [];

var myFilters = {};

var all_apps = [
  {
    _id: {
      $oid: "6287b1900ade2bbd0c83cba1",
    },
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
            {
              id: "parc",
              name: "Parc",
              x: 0,
              y: 0,
              dx: 1,
              dy: 1,
            },
            {
              id: "revenue",
              name: "Revenue",
              x: 1,
              y: 0,
              dx: 1,
              dy: 1,
            },
            {
              id: "tvoix",
              name: "Voix",
              x: 2,
              y: 0,
              dx: 1,
              dy: 1,
            },
            {
              id: "tdata",
              name: "Data",
              x: 3,
              y: 0,
              dx: 1,
              dy: 1,
            },
            {
              id: "topup",
              name: "Recharge",
              x: 4,
              y: 0,
              dx: 1,
              dy: 1,
            },
            {
              id: "encaiss",
              name: "Encaissement",
              x: 5,
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
                dashs: [
                  {
                    arrange: "cols",
                    childs: [],
                  },
                ],
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
    ],
  },
];
