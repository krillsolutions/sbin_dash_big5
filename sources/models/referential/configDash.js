export function clearDashAuthorized() {
  authorizations = [];
  webix.storage.local.remove("authorizations");
}

export function applyAuthorizations(
  p_menu_id,
  p_tab_id,
  type_comp
  // p_first_dash_id,
  // p_last_dash_id
) {
  // var dash_authorized = [];
  // for (let index = p_first_dash_id; index <= p_last_dash_id; index++) {
  //   dash_authorized.push(
  //     app_id + "." + p_menu_id + "." + p_tab_id + "." + index
  //   );
  // }
  // var authorized_menu = authorizations.filter(
  //   (e) =>
  //     e.split(".")[1] == p_menu_id &&
  //     e.split(".")[2] == p_tab_id &&
  //     e.split(".")[3] >= p_first_dash_id &&
  //     e.split(".")[3] <= p_last_dash_id
  // );
  // return dash_authorized.map((e) => {
  //   return authorized_menu.indexOf(e) != -1
  //     ? {
  //         dash: e.split(".")[3],
  //         authorized: true,
  //       }
  //     : {
  //         dash: e.split(".")[3],
  //         authorized: false,
  //       };
  // });

  var authorized_dash = authorizations.filter(
    (e) => e.split(".")[1] == p_menu_id && e.split(".")[2] == p_tab_id
  );

  console.log(authorized_dash);
  if (type_comp == "card") {
    return authorized_dash.map((e) => e.split(".")[3]);
  } else {
    return authorized_dash.map((e) => e.split(".")[4]);
  }
}
