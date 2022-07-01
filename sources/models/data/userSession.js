// import { urls } from "models/referential/genReferentials";
import { getToken, setToken, parseJwt } from "models/utils/general/boot";

// let urls = [];
// urls["api_url"] = "https://server.krillsolutions.com/api/sbin/";
// urls["host"] = "https://server.krillsolutions.com/api/sbin/";
// urls["login_url"] = "https://server.krillsolutions.com/api/sbin/auth";

export const userData = {};
//let urls = {login_url : 'https://192.168.11.105/api/auth'}
function status() {
  // return refData.waitData.then((d) => {
  // const loginURL = urls["login_url"];
  const loginURL = host + "auth-sbin";
  return (
    webix
      .ajax()
      .headers({
        Authorization: "Bearer " + getToken(),
      })
      // .post(loginURL + "?token=" + getToken() + "&status")
      .post(loginURL + "?status&app_id=" + app_id)
      .then((a) => a.json())
  );
  // });
}

function login(user, pass) {
  // return refData.waitData.then((d) => {
  // const loginURL = urls["login_url"];
  const loginURL = host + "auth-sbin";
  return webix
    .ajax()
    .post(loginURL, {
      user,
      pass,
      app_id: app_id,
    })
    .then((a) => {
      setToken(a.json()["api_token"]);
      //setToken("TEST")
      return a.json();
    });
  // });
}

function logout() {
  window.localStorage.clear();
  webix.storage.session.remove("filter");
  // let filters = webix.storage.session.get("filter");
  // for (const key in filters) {
  //   if (key != "d1" && key != "d2") delete filters[key];
  // }
  // console.log(filters);
  // webix.storage.session.put("filter", filters);

  // return refData.waitData.then((d) => {
  // const loginURL = urls["login_url"];
  const loginURL = host + "auth-sbin";
  return (
    webix
      .ajax()
      .post(loginURL + "?logout")
      // .post(loginURL + "?token=" + getToken() + "&logout")
      .then((a) => {
        setToken("");
        webix.storage.session.remove("tk");
        return a.json();
      })
  );
  // });
}

export function initUserSession(app) {
  const user = app.getService("user");
  userData["info"] = user.getUser();

  return new webix.promise((res, rej) => {
    //decrypt token and return authorization
    var plain_token = parseJwt(userData["info"].api_token);
    userData["info"]["name"] = plain_token.user_name;
    res({
      authrz: Object.values(userData["info"].authrz),
      filters: userData["info"].filters,
    });
  });
}

export default {
  status,
  login,
  logout,
};
