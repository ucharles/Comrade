import { useState, useEffect, useCallback } from "react";

let logoutTimer;

export const useAuth = () => {
  const [userId, setUserId] = useState();
  const [username, setUserName] = useState();
  const [tokenExpirationDateState, setTokenExpirationDateState] = useState();
  const [token, setToken] = useState();

  // 렌더가 끝난 후에 실행됨

  const login = useCallback((uid, username, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60); // 1h
    setTokenExpirationDateState(tokenExpirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        username: username,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
    setUserName(username);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDateState(null);
    setUserId(null);
    setUserName(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDateState) {
      const remainingTime =
        tokenExpirationDateState.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDateState]);

  useEffect(() => {
    // 토큰이 만료되었는지 확인하는 로직이 들어가야 함
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.username,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  return { token, login, logout, userId, username };
};
