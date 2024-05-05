import { useEffect, useState } from "react";
import { Subject } from "rxjs";

class _ModalManager {
  private componentQueue: JSX.Element[] = [];
  private isOn: boolean = false;

  private componentEvent$ = new Subject<JSX.Element>();

  public addListener = (cb: (Component: JSX.Element) => void) => {
    return this.componentEvent$.subscribe(cb);
  };

  public show = (Component: JSX.Element) => {
    if (this.isOn) {
      this.componentQueue.push(Component);
    } else {
      this.isOn = true;
      this.componentEvent$.next(Component);
    }
  };

  public close = () => {
    this.isOn = false;
    const shifted = this.componentQueue.shift();
    if (shifted) {
      this.isOn = true;
      this.componentEvent$.next(shifted);
    }
  };
}

const ModalManager = new _ModalManager();

export const ModalWrapper = ({ children }: { children: React.ReactNode }) => {
  const { close: _close, show, addListener } = ModalManager;
  const [Component, setComponent] = useState<JSX.Element | null>(null);

  const handleChangeComponent = (Component: JSX.Element) => {
    setComponent(Component);
  };

  const close = () => {};

  useEffect(() => {
    const unsubscribe = addListener(handleChangeComponent);
  }, []);
  return <></>;
};

export default ModalManager;
