import BillsGraphDashView from "views/bills/graphDash";
import BillsDetGraphDashView from "views/bills/billsDetDash";
// console.log("inside tab config");
export function tabComponentsBill(app, id) {
  return {
    "tab:resume": new BillsGraphDashView(app, "", id),
    "tab:details": new BillsDetGraphDashView(app, "", id),
  };
}
