import { refData, urls } from "models/referential/genReferentials";
import { getToken, setToken, parseJwt } from "models/utils/general/boot";

export const userData = {};
//let urls = {login_url : 'https://192.168.11.105/api/auth'}
function status() {
  return refData.waitData.then((d) => {
    const loginURL = urls["login_url"];
    return webix
      .ajax()
      .post(loginURL + "?token=" + getToken() + "&status")
      .then((a) => a.json());
  });
}

function login(user, pass) {
  return refData.waitData.then((d) => {
    const loginURL = urls["login_url"];
    return webix
      .ajax()
      .post(loginURL, {
        user,
        pass,
      })
      .then((a) => {
        setToken(a.json()["api_token"]);
        //setToken("TEST")
        return a.json();
      });
  });
}

function logout() {
  return refData.waitData.then((d) => {
    const loginURL = urls["login_url"];
    return webix
      .ajax()
      .post(loginURL + "?token=" + getToken() + "&logout")
      .then((a) => {
        setToken("");
        webix.storage.session.remove("tk");
        return a.json();
      });
  });
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
