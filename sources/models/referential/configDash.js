export function clearDashAuthorized() {
  authorizations = [];
  webix.storage.local.remove("authorizations");
}

export function applyAuthorizations(p_menu_id, type_comp, p_tab_id) {
  var authorized_dash = authorizations.filter(
    (e) => e.split(".")[1] == p_menu_id && e.split(".")[2] == type_comp
  );

  let authrz = authorized_dash.filter(
    (e) =>
      e.indexOf(e.split(".")[0] + "." + p_menu_id + ".tabs." + p_tab_id) != -1
  );
  if (type_comp == "stats") {
    return authorized_dash
      .filter((e) => e.split(".")[3])
      .map((e) => e.split(".").slice(-1)[0]);
  } else if (type_comp == "tabs") {
    return authrz.map((e) => {
      if (e.split(".").length > 4) {
        return e.replace(
          e.split(".")[0] + "." + p_menu_id + ".tabs." + p_tab_id + ".",
          ""
        );
      }
    });
  }
}
