import { createContext, useContext } from "react";

export type FormContextValue<T extends Object> = {
  isSubmittable: boolean;
  onChangeItemError: (key: keyof T, isError: boolean) => void;
  onChangeItemValue: <K extends keyof T>(
    key: K,
    value: T[K] | undefined
  ) => void;
  defaultValue: { [k in keyof T]: T[k] | undefined };
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
