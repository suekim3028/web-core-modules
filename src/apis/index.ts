const removeSlash = (url: string) => (url.startsWith('/') ? url.slice(1) : url);
enum Method {
  'GET' = 'GET',
  'PUT' = 'PUT',
  'POST' = 'POST',
  'DELETE' = 'DELETE',
  'PATCH' = 'PATCH',
}

export const returnFetch = <ErrorData>({
  baseUrl,
  tokenHeaderFn,
  onUnauthorizedError,
}: {
  baseUrl: string;
  tokenHeaderFn: () => Promise<Record<string, string> | null>;
  onUnauthorizedError: () => Promise<void>;
}) => {
  const fetchFn = async <T, M extends Method>(
    method: M,
    ...params: FetchParams<T, ErrorData>
  ): Promise<Response<T, ErrorData>> => {
    const [url, config, options] = params;

    const finalUrl = options?.useFullUrl
      ? url
      : `${removeSlash(baseUrl)}/${removeSlash(url)}`;

    console.log({ finalUrl });

    const tokenHeader = await tokenHeaderFn();
    console.log(tokenHeader);

    if (!tokenHeader) console.log('[API] api call with no token');

    console.log({ tokenHeader });
    const headers = {
      'Content-Type': 'application/json',
      ...(tokenHeader || {}),
      ...(config?.headers || {}),
    };

    if (config?.isMultipartFormData) {
      delete (headers as any)['Content-Type'];
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
          config?.body || ''
        )} ${options?.dummyData ? 'WITH DUMMY DATA' : ''}`,
        { configData }
      );

      if (options?.dummyData)
        return { isError: false, data: options.dummyData };

      const res = await fetch(options?.dummyUrl || finalUrl, configData);

      if (res.status == 201) return { data: undefined as T, isError: false };

      const data = await res.json();

      if (res.ok) {
        return { data: data as T, isError: false };
      } else {
        console.log('[API] error but expected!');
        return {
          isError: true,
          isExpectedError: true,
          error: data as ErrorData,
          status: res.status,
        };
      }
    } catch (e) {
      console.log('[API] unexpected error!');
      return { isError: true, isExpectedError: false };
    }
  };

  const createMethod = <M extends Method>(method: M) => {
    return async <T>(...params: FetchParams<T, ErrorData>) => {
      const res = await fetchFn<T, M>(method, ...params);
      if (res?.status === 401) {
        console.log('[API] unauthorized error. trying to retry after handler');
        await onUnauthorizedError();
        return await fetchFn<T, M>(method, ...params);
      } else {
        return res;
      }
    };
  };

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
    useFullUrl?: boolean;
  }
];

type FetchConfig = {
  headers?: object;
  body?: any;
  isMultipartFormData?: boolean;
};

type Response<T, ErrorData> =
  | {
      isError: false;
      data: T;
      isExpectedError?: undefined;
      status?: undefined;
      error?: undefined;
    }
  | {
      isError: true;
      data?: undefined;
      isExpectedError: true;
      status: number;
      error: ErrorData;
    }
  | {
      isError: true;
      data?: undefined;
      isExpectedError: false;
      status?: undefined;
      error?: ErrorData;
    };
