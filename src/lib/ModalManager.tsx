import { Subject } from "rxjs";

export type ModalItem = {
  Component: JSX.Element;
  closeOnDim: boolean;
  position?: "bottom" | "center";
};

class _ModalManager {
  private componentQueue: ModalItem[] = [];
  private isOn: boolean = false;
  private closeEvent: boolean = false;

  private componentEvent$ = new Subject<ModalItem | null>();
  private closeEvent$ = new Subject<boolean>();

  public addListener = (
    onShow: (value: ModalItem | null) => void,
    onClose: () => void
  ) => {
    const showSub = this.componentEvent$.subscribe(onShow);
    const closeSub = this.closeEvent$.subscribe(onClose);

    return () => {
      showSub.unsubscribe();
      closeSub.unsubscribe();
    };
  };

  public show = (item: ModalItem) => {
    if (this.isOn) {
      this.componentQueue.push(item);
    } else {
      this.isOn = true;
      this.componentEvent$.next(item);
    }
  };

  public closeAfterAnim = () => {
    this.isOn = false;
    this.componentEvent$.next(null);

    const shifted = this.componentQueue.shift();
    if (shifted) {
      this.isOn = true;
      this.componentEvent$.next(shifted);
    }
  };

  public close = () => {
    this.closeEvent$.next(!this.closeEvent);
    this.closeEvent = !this.closeEvent;
  };
}

const ModalManager = new _ModalManager();

export default ModalManager;
