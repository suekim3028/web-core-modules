import { Subscription } from "rxjs";

// 수정 진행중인 value
export type WIPValue<T extends Object> = { [k in keyof T]: T[k] | undefined };

/**
 * Form Context value
 */
export type FormContextValue<T extends Object> = {
  isSubmittable: boolean;
  onChangeItemError: (key: keyof T, isError: boolean) => void;
  onChangeItemValue: <K extends keyof T>(key: K, value: WIPValue<T>[K]) => void;
  defaultValue: WIPValue<T>;
  getCurrentValue: () => WIPValue<T>;
  addValueChangeListenerByKey: <K extends keyof T>(
    formKey: K,
    cb: (v: WIPValue<T>[K]) => void
  ) => Subscription;
};

export type ErrorState =
  | {
      isError: true;
      isEmpty: boolean;
      errorMsg?: string;
    }
  | {
      isError: false;
      isEmpty: boolean;
      errorMsg?: undefined;
    };

export type ValidationFn = <T extends Object, K extends keyof T>(
  value: T[K] | undefined
) => ErrorState;
