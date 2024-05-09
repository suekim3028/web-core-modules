export class LocalStorageItem<T extends object> {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  public get() {
    const item = localStorage.getItem(this.key);
    if (!item) return null;
    return JSON.parse(item) as T;
  }

  public set(data: T) {
    localStorage.setItem(this.key, JSON.stringify(data));
  }
}
