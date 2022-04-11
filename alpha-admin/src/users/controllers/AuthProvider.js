import { Cookies } from "react-cookie";

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
