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
  const loginURL = host + "auth";
  return (
    webix
      .ajax()
      .headers({
        authorizations: "Bearer " + getToken(),
      })
      // .post(loginURL + "?token=" + getToken() + "&status")
      .post(loginURL + "?status")
      .then((a) => a.json())
  );
  // });
}

function login(user, pass) {
  // return refData.waitData.then((d) => {
  // const loginURL = urls["login_url"];
  const loginURL = host + "auth";
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
  // return refData.waitData.then((d) => {
  // const loginURL = urls["login_url"];
  const loginURL = host + "auth";
  return webix
    .ajax()
    .post(loginURL + "?token=" + getToken() + "&logout")
    .then((a) => {
      setToken("");
      webix.storage.session.remove("tk");
      return a.json();
    });
  // });
}

export function initUserSession(app) {
  const user = app.getService("user");
  userData["info"] = user.getUser();

  return new webix.promise((res, rej) => {
    //decrypt token and return authorization
    var plain_token = parseJwt(userData["info"].api_token);
    userData["name"] = plain_token.user_name;
    res({
      authrz: Object.values(plain_token.authrz),
      filters: plain_token.filters,
    });
  });
}

export default {
  status,
  login,
  logout,
};
