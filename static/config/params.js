var app_id = "dash_app_sbin";

//var host = 'https://192.168.35.8/api/';
// var host = 'https://192.168.11.105/api/';
var host = "https://server.krillsolutions.com/api/sbin/";
var urls = {
  refdata: host + "getRef-sbin?kpi=00",
  distref: host + "getRef-sbin?kpi=dist",
  menudata: host + "getRef-sbin?kpi=01&p=" + app_id,
};

var api_url = "";

var default_dates = {
  d1: "",
  d2: "",
};

var periodSplit = ["1y", "1m", "1d"];

var traffType = ["voice", "sms", "data"];

var traffTypeSplit = [
  { name: "voice", split: ["pyg", "bndle", "free"] },
  { name: "sms", split: ["pyg", "bndle", "free"] },
  { name: "data", split: ["pyg", "bndle", "free"] },
];

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
            {
              id: "prepaid",
              name: "Prepaid",
              x: 0,
              y: 0,
              dx: 1,
              dy: 1,
            },
            {
              id: "postpaid",
              name: "Postpaid",
              x: 1,
              y: 0,
              dx: 1,
              dy: 1,
            },
            {
              id: "pmobile",
              name: "Pmobile",
              x: 2,
              y: 0,
              dx: 1,
              dy: 1,
            },
            {
              id: "pfixe",
              name: "Pfixe",
              x: 3,
              y: 0,
              dx: 1,
              dy: 1,
            },
            {
              id: "plte",
              name: "Plte",
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
            {
              id: "rtot",
              name: "Revenu total",
              x: 0,
              y: 0,
              dx: 1,
              dy: 1,
            },
            {
              id: "rpyg",
              name: "Revenu PYG",
              x: 1,
              y: 0,
              dx: 1,
              dy: 1,
            },
            {
              id: "rmob",
              name: "Revenu mobile",
              x: 2,
              y: 0,
              dx: 1,
              dy: 1,
            },
            {
              id: "rlte",
              name: "Revenu LTE",
              x: 5,
              y: 0,
              dx: 1,
              dy: 1,
            },
            {
              id: "rprepaid",
              name: "Revenu prep",
              x: 3,
              y: 0,
              dx: 1,
              dy: 1,
            },
            {
              id: "rpostpaid",
              name: "Revenu post",
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
      {
        id: "traffic",
        name: "traffic",
        stats: {
          grid_cols: 4,
          grid_rows: 1,
          col_count: 4,
          max_col_count: 4,
          cards: [
            {
              id: "voice",
              name: "voice",
              x: 0,
              y: 0,
              dx: 1,
              dy: 1,
            },
            {
              id: "sms",
              name: "sms",
              x: 1,
              y: 0,
              dx: 1,
              dy: 1,
            },
            {
              id: "data",
              name: "data",
              x: 2,
              y: 0,
              dx: 1,
              dy: 1,
            },
            {
              id: "rpyg",
              name: "rpyg",
              x: 3,
              y: 0,
              dx: 1,
              dy: 1,
            },
          ],
        },
        tabs: [
          {
            id: "tab:voix",
            name: "tab voix",
            title_id: "traffic_voix_tab",
            grid_cols: 9,
            grid_rows: 3,
            panels: [
              {
                id: "traffic_offer",
                name: "traffic offer",
                arrange: "rows",
                x: 0,
                y: 0,
                dx: 3,
                dy: 3,
                dashs: [
                  {
                    arrange: "rows",
                    childs: [
                      {
                        id: "traff_by_offer",
                        name: "traff by offer",
                        period_selector: false,
                      },
                      {
                        id: "traff_by_type_trend",
                        name: "traff By Type trend",
                        period_selector: true,
                        nb_period_select: 3,
                        period_prefix: "traffByType_",
                      },
                    ],
                  },
                ],
              },
              {
                id: "traffic_geo_int",
                name: "traffic geo int",
                arrange: "rows",
                x: 3,
                y: 0,
                dx: 3,
                dy: 3,
                dashs: [
                  {
                    arrange: "rows",
                    childs: [
                      {
                        id: "traff_int",
                        name: "traff in",
                        period_selector: false,
                      },
                      {
                        id: "traff_int_geo",
                        name: "traff in geo",
                        period_selector: false,
                      },
                    ],
                  },
                ],
              },
              {
                id: "traffic_other",
                name: "traffic other",
                arrange: "rows",
                x: 6,
                y: 0,
                dx: 3,
                dy: 3,
                dashs: [
                  {
                    arrange: "rows",
                    childs: [
                      {
                        id: "traff_by_dest",
                        name: "traff by dest",
                        period_selector: false,
                      },
                      {
                        id: "traff_by_op",
                        name: "traff by op",
                        period_selector: false,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "tab:sms",
            name: "tab sms",
            title_id: "traffic_sms_tab",
            grid_cols: 9,
            grid_rows: 3,
            panels: [
              {
                id: "traffic_offer",
                name: "traffic offer",
                arrange: "rows",
                x: 0,
                y: 0,
                dx: 3,
                dy: 3,
                dashs: [
                  {
                    arrange: "rows",
                    childs: [
                      {
                        id: "traff_by_offer",
                        name: "traff by offer",
                        period_selector: false,
                      },
                      {
                        id: "traff_by_type_trend",
                        name: "traff By Type trend",
                        period_selector: true,
                        nb_period_select: 3,
                        period_prefix: "traffByType_",
                      },
                    ],
                  },
                ],
              },
              {
                id: "traffic_geo_int",
                name: "traffic geo int",
                arrange: "rows",
                x: 3,
                y: 0,
                dx: 3,
                dy: 3,
                dashs: [
                  {
                    arrange: "rows",
                    childs: [
                      {
                        id: "traff_int",
                        name: "traff in",
                        period_selector: false,
                      },
                      {
                        id: "traff_int_geo",
                        name: "traff in geo",
                        period_selector: false,
                      },
                    ],
                  },
                ],
              },
              {
                id: "traffic_other",
                name: "traffic other",
                arrange: "rows",
                x: 6,
                y: 0,
                dx: 3,
                dy: 3,
                dashs: [
                  {
                    arrange: "rows",
                    childs: [
                      {
                        id: "traff_by_dest",
                        name: "traff by dest",
                        period_selector: false,
                      },
                      {
                        id: "traff_by_op",
                        name: "traff by op",
                        period_selector: false,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "tab:data",
            name: "tab data",
            title_id: "traffic_data_tab",
            grid_cols: 9,
            grid_rows: 6,
            panels: [
              {
                id: "traffic_offer_data",
                name: "traffic offer data",
                arrange: "rows",
                x: 0,
                y: 0,
                dx: 3,
                dy: 6,
                dashs: [
                  {
                    arrange: "rows",
                    childs: [
                      {
                        id: "traff_by_offer",
                        name: "traff by offer",
                        period_selector: false,
                      },
                      {
                        id: "traff_by_type_trend",
                        name: "traff By Type trend",
                        period_selector: true,
                        nb_period_select: 3,
                        period_prefix: "traffByType_",
                      },
                    ],
                  },
                ],
              },
              {
                id: "data_repartition",
                name: "data repartition",
                arrange: "rows",
                x: 3,
                y: 0,
                dx: 3,
                dy: 6,
                dashs: [
                  {
                    arrange: "rows",
                    childs: [
                      {
                        id: "data_parc",
                        name: "data parc",
                        period_selector: false,
                      },
                      {
                        id: "traff_data_site",
                        name: "traff data site",
                        period_selector: false,
                      },
                    ],
                  },
                ],
              },
              {
                id: "traffic_other",
                name: "traffic other",
                arrange: "rows",
                x: 6,
                y: 0,
                dx: 3,
                dy: 6,
                dashs: [
                  {
                    arrange: "rows",
                    childs: [
                      {
                        id: "traff_data_by_dest",
                        name: "traff data by dest",
                        period_selector: true,
                        nb_period_select: 2,
                        period_prefix: "traffByType_dest_",
                        nb: 1,
                      },
                      {
                        id: "data_split_type_split",
                        name: "data split type split",
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
        id: "bills",
        name: "bills",
        stats: {
          grid_cols: 6,
          grid_rows: 1,
          col_count: 6,
          max_col_count: 6,
          cards: [
            {
              id: "rv",
              name: "rv",
              x: 0,
              y: 0,
              dx: 1,
              dy: 1,
            },
            {
              id: "qte",
              name: "qte",
              x: 1,
              y: 0,
              dx: 1,
              dy: 1,
            },
            {
              id: "fpaid",
              name: "fpaid",
              x: 2,
              y: 0,
              dx: 1,
              dy: 1,
            },
            {
              id: "qpaid",
              name: "qpaid",
              x: 3,
              y: 0,
              dx: 1,
              dy: 1,
            },
            {
              id: "rv_post",
              name: "rv_post",
              x: 4,
              y: 0,
              dx: 1,
              dy: 1,
            },
            {
              id: "rv_pre",
              name: "rv_pre",
              x: 5,
              y: 0,
              dx: 1,
              dy: 1,
            },
          ],
        },
        tabs: [
          {
            id: "tab:resume",
            name: "tab resume",
            title_id: "Global",
            grid_cols: 6,
            grid_rows: 3,
            panels: [
              {
                id: "bills_fact",
                name: "bills fact",
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
                        id: "bill_by_bill_by_market",
                        name: "bill by bill by market",
                        period_selector: false,
                      },
                      {
                        id: "bill_by_offer",
                        name: "bill by offer",
                        period_selector: false,
                      },
                      {
                        id: "bParOff",
                        name: "bill by off trend",
                        period_selector: true,
                        nb_period_select: 2,
                      },
                    ],
                  },
                ],
              },
              {
                id: "bills_paie",
                name: "bills paie",
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
                        id: "bill_by_bill_by_market_p",
                        name: "bill by bill by market p",
                        period_selector: false,
                      },
                      {
                        id: "bill_by_offer_p",
                        name: "bill by offer p",
                        period_selector: false,
                      },
                      {
                        id: "pParOff",
                        name: "bill by offer trend p",
                        period_selector: true,
                        nb_period_select: 2,
                      },
                    ],
                  },
                ],
              },
              {
                id: "bills_recouvr",
                name: "bills recouvr",
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
                        id: "rec_by_offer",
                        name: "rec by offer",
                        period_selector: false,
                      },
                      {
                        id: "rec_trend",
                        name: "rec trend",
                        period_selector: false,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "tab:details",
            name: "tab details",
            title_id: "Detail",
            grid_cols: 7,
            grid_rows: 4,
            panels: [
              {
                id: "bills_pay_split",
                name: "bills pay split",
                arrange: "rows",
                x: 0,
                y: 0,
                dx: 2,
                dy: 4,
                dashs: [
                  {
                    arrange: "rows",
                    childs: [
                      {
                        id: "traff_by_offer",
                        name: "traff by offer",
                        period_selector: false,
                      },
                      {
                        id: "traff_by_type_trend",
                        name: "traff By Type trend",
                        period_selector: true,
                        nb_period_select: 3,
                        period_prefix: "traffByType_",
                      },
                    ],
                  },
                ],
              },
              {
                id: "traffic_geo_int",
                name: "traffic geo int",
                arrange: "rows",
                x: 3,
                y: 0,
                dx: 3,
                dy: 3,
                dashs: [
                  {
                    arrange: "rows",
                    childs: [
                      {
                        id: "traff_int",
                        name: "traff in",
                        period_selector: false,
                      },
                      {
                        id: "traff_int_geo",
                        name: "traff in geo",
                        period_selector: false,
                      },
                    ],
                  },
                ],
              },
              {
                id: "traffic_other",
                name: "traffic other",
                arrange: "rows",
                x: 6,
                y: 0,
                dx: 3,
                dy: 3,
                dashs: [
                  {
                    arrange: "rows",
                    childs: [
                      {
                        id: "traff_by_dest",
                        name: "traff by dest",
                        period_selector: false,
                      },
                      {
                        id: "traff_by_op",
                        name: "traff by op",
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
];

var product_for_recouvrement = [
  "LTE",
  "Téléphone",
  "ADSL",
  "FTTH",
  "GROS",
  "Internet",
];

var product_for_recouvrement = [
  "MOBILE",
  "LTE",
  "TELEPHONIE",
  "ADSL", //,"FTTH","INTERNET", "GROS"
];

var recouvr_months_offset = 3;

var fact_type = [
  { name: "PERIODIQUE", id: "period" },
  { name: "ISOLEE", id: "isolee" },
];
