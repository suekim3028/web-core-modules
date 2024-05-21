export class LocalStorageItem<T> {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  public get() {
    if (typeof window === 'undefined') {
      console.log('no window');
      return null;
    }
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
    if (typeof window === 'undefined' || !data) {
      console.log('no window');
      return;
    }

    try {
      localStorage.setItem(this.key, JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  }

  public remove() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.key);
  }
}
