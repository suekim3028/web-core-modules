import { createContext, useContext } from "react";
import { FormContextValue } from "./types";

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
