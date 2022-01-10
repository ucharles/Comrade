import { useState, useCallback, useRef, useEffect } from "react";

// 살려줘 하나도 모르겠어
// ;;진짜 모르겠따
// 내가 이걸 이해하려면 뭘 알아야 하지...
// useCallback, useRef, AbortController

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  // active HTTP request here
  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      try {
        setIsLoading(true);
        // 최신 브라우저에서 지원하는 API
        const httpAbortCtrl = new AbortController();
        // useRef 에 현재의 데이터를 래핑?... 현재의 상태를 저장한 뒤에,
        // 화면을 갱신하고 싶을 때만 갱신한다는 건가?
        activeHttpRequests.current.push(httpAbortCtrl);

        // fetch 내부에 AbortControll를 등록함으로써, HTTP 요청을 취소 가능.
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal,
        });
        const responseData = await response.json();

        // 현재의 activeHttpRequest 에서 httpAbortCtrl을 제외시킴.
        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );

        if (!response.ok) {
          // if status code is 400 or 500
          throw new Error(responseData.message);
        }
        setIsLoading(false);
        return responseData;
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  // run only once
  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);
  // 결과를 출력하기 전에 httpRequest를 차단하는 건가?

  return { isLoading, error, sendRequest, clearError };
};
