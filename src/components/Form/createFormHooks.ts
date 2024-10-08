import { createContext, useContext } from "react";
import { Subscription } from "rxjs";

export type WIPValue<T extends Object> = { [k in keyof T]: T[k] | undefined };
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

export const createFormHooks = <T extends Object>() => {
  const formContext = createContext<FormContextValue<T> | null>(null);
  const useFormContext = () => {
    const ctx = useContext(formContext);
    if (!ctx)
      throw new Error("FormContext must be used in form context provider");
    return ctx;
  };

  return { formContext, useFormContext };
};
