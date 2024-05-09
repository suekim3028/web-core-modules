import { Subject } from "rxjs";

class _ModalManager {
  private componentQueue: JSX.Element[] = [];
  private isOn: boolean = false;
  private closeEvent: boolean = false;

  private componentEvent$ = new Subject<JSX.Element>();
  private closeEvent$ = new Subject<boolean>();

  public addListener = (
    onShow: (Component: JSX.Element) => void,
    onClose: () => void
  ) => {
    const showSub = this.componentEvent$.subscribe(onShow);
    const closeSub = this.closeEvent$.subscribe(onClose);

    return () => {
      showSub.unsubscribe();
      closeSub.unsubscribe();
    };
  };

  public show = (Component: JSX.Element) => {
    if (this.isOn) {
      this.componentQueue.push(Component);
    } else {
      this.isOn = true;
      this.componentEvent$.next(Component);
    }
  };

  public closeAfterAnim = () => {
    this.isOn = false;
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
