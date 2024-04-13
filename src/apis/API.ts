import axios, { AxiosInstance, CreateAxiosDefaults } from "axios";
const qs = require("qs");

class APIClass implements APIInstance {
  private instance: AxiosInstance | null = null;
  private logRequests = false;
  private headers: Record<string, any> = {};

  constructor() {
    if (process?.env?.NODE_ENV === "development") {
      this.logRequests = true;
    }
  }

  public init(config?: CreateAxiosDefaults) {
    this.instance = axios.create({
      ...config,
      paramsSerializer: (p) => qs.stringify(p, { indices: false }),
    });
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

  public get: APIInstance["get"] = (...props) => {
    if (this.instance === null)
      throw new Error("API Instance must be initialized before use");
    return this.instance.get(...props);
  };

  public post: APIInstance["post"] = (...props) => {
    if (this.instance === null)
      throw new Error("API Instance must be initialized before use");
    return this.instance.post(...props);
  };
  public patch: APIInstance["patch"] = (...props) => {
    if (this.instance === null)
      throw new Error("API Instance must be initialized before use");
    return this.instance.patch(...props);
  };
  public delete: APIInstance["delete"] = (...props) => {
    if (this.instance === null)
      throw new Error("API Instance must be initialized before use");
    return this.instance.delete(...props);
  };
  public put: APIInstance["put"] = (...props) => {
    if (this.instance === null)
      throw new Error("API Instance must be initialized before use");
    return this.instance.put(...props);
  };
}

export interface APIInstance
  extends Pick<AxiosInstance, "get" | "put" | "post" | "delete" | "patch"> {}

export default new APIClass();
