export class LocalStorageItem<T> {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  public get() {
    const item = localStorage.getItem(this.key);
    if (!item) return null;

    try {
      const parsedItem = JSON.parse(item);

      return parsedItem as Partial<T>;
    } catch {
      this.remove();
      return null;
    }
  }

  public set(data: Partial<T>) {
    if (!data) return;

    try {
      localStorage.setItem(this.key, JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  }

  public remove() {
    localStorage.removeItem(this.key);
  }
}
