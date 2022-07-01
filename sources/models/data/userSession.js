import { getToken, setToken, parseJwt } from "models/utils/general/boot";

export const userData = {};
function status() {
  const loginURL = host + "auth-sbin";
  return webix
    .ajax()
    .headers({
      Authorization: "Bearer " + getToken(),
    })
    .post(loginURL + "?status&app_id=" + app_id)
    .then((a) => a.json());
}

function login(user, pass) {
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
      return a.json();
    });
}

function logout() {
  window.localStorage.clear();
  webix.storage.session.remove("filter");

  const loginURL = host + "auth-sbin";
  return webix
    .ajax()
    .post(loginURL + "?logout")
    .then((a) => {
      setToken("");
      webix.storage.session.remove("tk");
      return a.json();
    });
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
