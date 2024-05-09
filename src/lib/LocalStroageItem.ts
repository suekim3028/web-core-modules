export class LocalStorageItem<T extends object> {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  public get() {
    const item = localStorage.getItem(this.key);
    if (!item) return null;
    const parsedItem = JSON.parse(item);
    if (typeof parsedItem != "object") return null;
    return parsedItem as Partial<T>;
  }

  public set(data: Partial<T>) {
    const item = this.get();
    const updated = item ? { ...item, ...data } : data;
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  public remove() {
    localStorage.removeItem(this.key);
  }
}
