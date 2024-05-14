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

    const token = await getToken();

    if (!token) console.log("[API] api call with no token");

    const headers = {
      "Content-Type": "application/json",
      ...(token ? tokenHandler(token) : {}),
      ...(config?.headers || {}),
    };

    if (config?.isMultipartFormData) {
      delete (headers as any)["Content-Type"];
    }

    const body = config?.body
      ? config?.isMultipartFormData
        ? config?.body
        : JSON.stringify(config.body)
      : undefined;

    const configData: RequestInit = {
      headers,
      method,
      body,
    };

    try {
      console.log(
        `[${method}] ${options?.dummyUrl || finalUrl} ${JSON.stringify(
          config?.body || ""
        )} ${options?.dummyData ? "WITH DUMMY DATA" : ""}`,
        { configData }
      );

      if (options?.dummyData)
        return { isError: false, data: options.dummyData };

      const res = await fetch(options?.dummyUrl || finalUrl, configData);

      const data = await res.json();

      // TOOD: 이후 삭제
      if ("code" in data && "message" in data && "value" in data) {
        throw new Error(data.message);
      }

      return { data: data as T, isError: false };
    } catch (e) {
      console.error(e);
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
    dummyUrl?: string;
  }
];

type FetchConfig = {
  headers?: object;
  body?: any;
  isMultipartFormData?: boolean;
};
