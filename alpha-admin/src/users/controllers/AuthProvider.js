import { Cookies } from "react-cookie";

const cookies = new Cookies();

// eslint-disable-next-line
export default {
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
          const expirationTime = new Date(
            new Date().getTime() +
              process.env.REACT_APP_JWT_EXPIRES_TOSECONDS * 1000
          );
          cookies.set("expirationTime", expirationTime.toISOString());
          return Promise.resolve(expirationTime.toISOString());
        } else if (response.status < 200 || response.status >= 300) {
          return Promise.reject();
        }
      })
      .catch(() => {
        throw new Error("Network error");
      });
  },

  checkAuth: () => {
    return Promise.resolve();
  },

  // checkAuth 대신 사용
  getPermissions: () => {
    const request = new Request(
      process.env.REACT_APP_BACKEND_URL + "/users/token-check",
      { method: "GET", credentials: "include" }
    );

    return fetch(request)
      .then((response) => {
        return response.status >= 200 && response.status < 300
          ? Promise.resolve()
          : Promise.reject();
      })
      .catch(() => {
        throw new Error("Network error");
      });
  },

  logout: () => {
    cookies.remove("expirationTime");

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
      cookies.remove("expirationTime");
      return Promise.reject();
    }
    return Promise.resolve();
  },
};
