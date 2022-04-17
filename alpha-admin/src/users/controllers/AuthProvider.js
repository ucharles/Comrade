import { Cookies } from "react-cookie";
import moment from "moment-timezone";

const cookies = new Cookies();

const authProvider = {
  login: ({ email, password }) => {
    const request = new Request(
      process.env.REACT_APP_BACKEND_URL + "/users/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
        returnSecureToken: true,
        credentials: "include",
        headers: {
          "content-Type": "application/json",
        },
      }
    );

    return fetch(request)
      .then((response) => {
        if (response.ok) {
          cookies.set("tz", encodeURIComponent(moment.tz.guess()), {
            path: "/",
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
          });
          return Promise.resolve();
        } else if (response.status < 200 || response.status >= 300) {
          return Promise.reject();
        }
      })
      .catch(() => {
        throw new Error("Network error");
      });
  },

  checkAuth: async () => {
    if (!cookies.get("loggedIn")) {
      return Promise.reject();
    }
    // timezone 쿠키가 존재하지 않거나, timezone이 올바르지 않을 경우
    // timezone 쿠키를 새로운 값으로 갱신, 유효기간 14일
    if (
      !cookies.get("tz") ||
      !moment.tz(decodeURIComponent(cookies.get("tz"))).isValid()
    ) {
      cookies.set("tz", encodeURIComponent(moment.tz.guess()), {
        path: "/",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      });
    }

    const request = new Request(
      process.env.REACT_APP_BACKEND_URL + "/users/token-check",
      { method: "GET", credentials: "include" }
    );
    return fetch(request)
      .then((response) => {
        if (response.ok) {
          return Promise.resolve();
        } else if (response.status < 200 || response.status >= 300) {
          return Promise.reject();
        }
      })
      .catch(() => {
        throw new Error();
      });
  },

  getPermissions: () => {
    return Promise.resolve();
  },

  logout: () => {
    const request = new Request(
      process.env.REACT_APP_BACKEND_URL + "/users/logout",
      { method: "GET", credentials: "include" }
    );

    return fetch(request)
      .then((response) => {
        if (response.ok) {
          return Promise.resolve();
        } else if (response.status < 200 || response.status >= 300) {
          return Promise.reject();
        }
      })
      .catch(() => {
        throw new Error("Network error");
      });
  },

  checkError: ({ status }) => {
    if (status === 401 || status === 403) {
      return Promise.reject();
    }
    return Promise.resolve();
  },
};

export default authProvider;
