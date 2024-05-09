const removeSlash = (url: string) => (url.startsWith("/") ? url.slice(1) : url);
enum Method {
  "GET" = "GET",
  "PUT" = "PUT",
  "POST" = "POST",
  "DELETE" = "DELETE",
  "PATCH" = "PATCH",
}

export const returnFetch = <ErrorData>({
  baseUrl,
  getToken,
  tokenHandler,
  onError,
}: {
  baseUrl: string;
  getToken: () => Promise<string | null> | string | null;
  tokenHandler: (token: string) => Record<string, string>;
  onError: (error: ErrorData) => void;
}) => {
  const fetchFn = async <T, M extends Method>(
    method: M,
    ...params: FetchParams<T, ErrorData>
  ): Promise<{ data: T; isError: false } | { data: null; isError: true }> => {
    const [url, config, options] = params;
    const finalUrl = `${removeSlash(baseUrl)}/${removeSlash(url)}`;
    console.log({ finalUrl });

    const token = await getToken();
    console.log({ token });

    if (!token) console.log("[API] api call with no token");
    const configData: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token ? tokenHandler(token) : {}),
        ...(config?.headers || {}),
      },
      method,
      body: config?.body ? JSON.stringify(config.body) : undefined,
    };

    try {
      console.log(
        `[${method}] ${finalUrl} ${options?.dummyData ? "WITH DUMMY DATA" : ""}`
      );

      if (options?.dummyData)
        return { isError: false, data: options.dummyData };
      const res = await fetch(finalUrl, configData);

      const data = await res.json();

      return { data: data as T, isError: false };
    } catch (e) {
      console.log("========API ERROR========");
      const _onError = options?.onError || onError;
      _onError(options?.error || (e as ErrorData));
      return { data: null, isError: true };
    }
  };

  const createMethod =
    <M extends Method>(method: M) =>
    <T>(...params: FetchParams<T, ErrorData>) =>
      fetchFn<T, M>(method, ...params);

  return {
    get: createMethod(Method.GET),
    post: createMethod(Method.POST),
    patch: createMethod(Method.PATCH),
    delete: createMethod(Method.DELETE),
    put: createMethod(Method.PUT),
  };
};

type FetchParams<T, ErrorData> = [
  url: string,
  config?: FetchConfig,
  options?: {
    dummyData?: T;
    onError?: (e: ErrorData) => void;
    error?: ErrorData;
  }
];

type FetchConfig = {
  headers?: object;
  body?: any;
};
