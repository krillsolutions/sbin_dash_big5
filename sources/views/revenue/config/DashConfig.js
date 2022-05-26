import RevByTypeSplitView from "views/revenue/revenueByTypeSplit";
import RevByTypeTrendViewNew from "views/revenue/revenueByTypeTrendNew";
import RevByLineView from "views/revenue/revenueByLine";
import RevByLineTrendView from "views/revenue/revenueByLineTrend";
import RevByOPView from "views/revenue/revByOP";
import TrVoiceByOPView from "views/revenue/traffByOP";
import RevTypeProdView from "views/revenue/revenueByTypeByProd";
import RevByCltView from "views/revenue/revByClient";

export const dashComponentsRevenue = {
  rev_by_type_split: RevByTypeSplitView,
  revByType: RevByTypeTrendViewNew,
  revByLine_view: RevByLineView,
  revByLine: RevByLineTrendView,
  rev_by_op_view: RevByOPView,
  tr_voice_by_op: TrVoiceByOPView,
  rev_type_prod: RevTypeProdView,
  rev_by_clt: RevByCltView,
};
