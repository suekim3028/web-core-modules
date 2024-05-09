import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from "axios";
const qs = require("qs");

type InterceptedInternalRequestConfig<T> = InternalAxiosRequestConfig<T> & {
  requestAt: Date;
};

class APIConstructor implements IApi {
  private instance: AxiosInstance | null = null;
  private showLogOnResponse = false;
  private headers: Partial<AxiosRequestHeaders> = {};

  constructor() {
    if (process?.env?.NODE_ENV === "development") {
      this.showLogOnResponse = true;
    }
  }

  private hasDateInRequest = (
    config: AxiosRequestConfig
  ): config is InterceptedInternalRequestConfig<any> => {
    return "requestAt" in config;
  };

  private logResponse = (config: InternalAxiosRequestConfig) => {
    if (this.showLogOnResponse && this.hasDateInRequest(config)) {
      const timeDiffInSec = (
        (new Date().getTime() - config.requestAt.getTime()) /
        1000
      ).toFixed(2);

      let logText = `[${config.method?.toUpperCase()}] ${config.url}`;
      config.params && (logText += `\t${JSON.stringify(config.params)}`);
      logText += `\t${timeDiffInSec}s`;
      console.log(logText);
    }
  };

  private requestInterceptor(
    config: InternalAxiosRequestConfig<any>
  ): InterceptedInternalRequestConfig<any> {
    return {
      ...config,
      requestAt: new Date(),
      headers: {
        ...config.headers,
        ...this.headers,
      } as AxiosRequestHeaders,
    };
  }

  private responseInterceptor = {
    onFulfilled: <T>({ config, data, headers }: AxiosResponse<T>) => {
      this.logResponse(config);
      return data;
    },
    onRejected: ({ response }: { response: AxiosResponse }) => {
      return Promise.reject(); // TODO: error handling
    },
  };

  public init(config?: CreateAxiosDefaults) {
    this.instance = axios.create({
      ...config,
      paramsSerializer: (p) => qs.stringify(p, { indices: false }),
    });
    this.instance.interceptors.request.use(this.requestInterceptor.bind(this));
    this.instance.interceptors.response.use(
      this.responseInterceptor.onFulfilled.bind(this),
      this.responseInterceptor.onRejected.bind(this)
    );
    console.log(
      `[API] 👊 API instance is initiated with base URL : ${config?.baseURL}`
    );
  }

  public setHeaders(headers: Record<string, any>) {
    this.headers = { ...this.headers, ...headers };
  }

  public setHeaderToken(token: string) {
    this.headers["Authorization"] = token;
  }

  public getHeaderToken() {
    return this.headers["Authorization"] || null;
  }

  public removeHeaderToken() {
    delete this.headers["Authorization"];
  }

  public setVersion(version: string) {
    this.headers["App-Version"] = version;
  }

  private handleNoInstance = <T>(
    onInstance: (instance: AxiosInstance) => T
  ): T => {
    if (this.instance === null)
      throw new Error("API Instance must be initialized before use");
    return onInstance(this.instance);
  };

  public get: IApi["get"] = (...props) =>
    this.handleNoInstance((i) => i.get(...props));

  public post: IApi["post"] = (...props) =>
    this.handleNoInstance((i) => i.post(...props));

  public patch: IApi["patch"] = (...props) =>
    this.handleNoInstance((i) => i.patch(...props));

  public delete: IApi["delete"] = (...props) =>
    this.handleNoInstance((i) => i.delete(...props));

  public put: IApi["put"] = (...props) =>
    this.handleNoInstance((i) => i.put(...props));
}

type AxiosRequests = Pick<
  AxiosInstance,
  "get" | "put" | "post" | "delete" | "patch"
>;

type ExtractData<
  Request extends <T = any, R = AxiosResponse<T>>(...params: any) => Promise<R>
> = <T>(...params: Parameters<Request>) => Promise<T>;

type DataExtractedRequests = {
  [r in keyof AxiosRequests]: ExtractData<AxiosRequests[r]>;
};

export interface IApi extends DataExtractedRequests {}

export default new APIConstructor();
