"use client";
import { ReactNode, useCallback, useMemo, useRef, useState } from "react";
import { tsUtils } from "../../utils";
import { createFormHooks, FormContextValue } from "./createFormHooks";

// 타입을 내려보내기 위해서 class로 감싸서 provider랑 render 만듦
class FormFactory<T extends Object> {
  private formHooks = createFormHooks<T>();

  public FormProvider = ({
    children,
    defaultValue,
  }: {
    children: ReactNode;
    defaultValue: FormContextValue<T>["defaultValue"];
  }) => {
    const { formContext } = this.formHooks;
    const [isSubmittable, setIsSubmittable] = useState(false);

    const currentValue = useRef(defaultValue);
    const errorState = useRef<Record<keyof T, boolean>>(
      tsUtils.fromEntries(tsUtils.getKeys(defaultValue).map((k) => [k, false]))
    );

    console.log("form 전체 rerender");

    const onChangeItemError = useCallback((key: keyof T, isError: boolean) => {
      errorState.current = { ...errorState.current, [key]: isError };
      console.log("ERROR STATE:", errorState.current);
      setIsSubmittable(
        Object.values(errorState.current).every((v) => !Boolean(v))
      );
    }, []);

    const onChangeItemValue = useCallback(
      <K extends keyof T>(key: K, value: T[K] | undefined) => {
        console.log("===", { ...currentValue.current, [key]: value });
        currentValue.current = { ...currentValue.current, [key]: value };
      },
      []
    );

    const ctxValue = useMemo(
      () => ({
        isSubmittable,
        onChangeItemError,
        onChangeItemValue,
        defaultValue,
      }),
      [isSubmittable, onChangeItemError, onChangeItemValue, defaultValue]
    );

    return (
      <formContext.Provider value={ctxValue}>{children}</formContext.Provider>
    );
  };

  public FormItem = <K extends keyof T>({
    formKey,
    render,
  }: {
    formKey: K;
    render: FormItemElement<T, K>;
  }) => {
    const {
      defaultValue: _defaultValue,
      onChangeItemError: _onChangeItemError,
      onChangeItemValue: _onChangeItemValue,
    } = this.formHooks.useFormContext();

    const onChangeItemError = useCallback(
      (isError: boolean) => {
        return _onChangeItemError(formKey, isError);
      },
      [_onChangeItemError, formKey]
    );

    const onChangeItemValue = useCallback(
      (value: T[K] | undefined) => {
        return _onChangeItemValue(formKey, value);
      },
      [_onChangeItemValue, formKey]
    );

    const defaultValue = useMemo(
      () => _defaultValue[formKey],
      [_defaultValue, formKey]
    );
    return render({ onChangeItemError, onChangeItemValue, defaultValue });
  };

  public Submit = ({ render }: { render: FormSubmitElement }) => {
    const { isSubmittable } = this.formHooks.useFormContext();
    return render({ isSubmittable });
  };
}

export type FormItemElementProps<T extends Object, K extends keyof T> = {
  onChangeItemError: (isError: boolean) => void;
  onChangeItemValue: (value: T[K] | undefined) => void;
  defaultValue: T[K] | undefined;
};
export type FormItemElement<T extends Object, K extends keyof T> = (
  props: FormItemElementProps<T, K>
) => JSX.Element;

export type FormSubmitElement = ({
  isSubmittable,
}: {
  isSubmittable: boolean;
}) => JSX.Element;
export default FormFactory;
