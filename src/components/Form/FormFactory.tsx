"use client";
import { ReactNode, useCallback, useMemo, useRef, useState } from "react";
import { Subject } from "rxjs";
import { tsUtils } from "../../utils";
import { createFormHooks, FormContextValue, WIPValue } from "./createFormHooks";

// 타입을 내려보내기 위해서 class로 감싸서 provider랑 render 만듦
class FormFactory<T extends Object> {
  private formHooks = createFormHooks<T>();

  // 전체 Form 을 감싸는 Provider
  public FormProvider = ({
    children,
    defaultValue,
  }: {
    children: ReactNode;
    defaultValue: FormContextValue<T>["defaultValue"];
  }) => {
    const { formContext } = this.formHooks;

    // 현재 모든 form item의 isError가 false인지
    const [isSubmittable, setIsSubmittable] = useState(false);

    // 현재 모든 value
    const currentValue = useRef(defaultValue);

    // 현재 key별 isError 여부
    const errorState = useRef<Record<keyof T, boolean>>(
      tsUtils.fromEntries(tsUtils.getKeys(defaultValue).map((k) => [k, false]))
    );

    // 다른 form item의 value change에 대한 listener
    const listeners = useRef(
      (<K extends keyof T>() =>
        new Subject<{ key: K; value: WIPValue<T>[K] }>())()
    );

    const addValueChangeListenerByKey = <K extends keyof T>(
      formKey: K,
      cb: (v: WIPValue<T>[K]) => void
    ) => {
      return listeners.current.subscribe(({ key, value }) => {
        if (key !== formKey) return;
        cb(value as WIPValue<T>[K]);
      });
    };

    const onChangeItemError = useCallback((key: keyof T, isError: boolean) => {
      errorState.current = { ...errorState.current, [key]: isError };

      setIsSubmittable(
        Object.values(errorState.current).every((v) => !Boolean(v))
      );
    }, []);

    const onChangeItemValue = useCallback(
      <K extends keyof T>(key: K, value: T[K] | undefined) => {
        listeners.current.next({ key, value });
        currentValue.current = { ...currentValue.current, [key]: value };
      },
      []
    );

    const getCurrentValue = useCallback(() => currentValue.current, []);

    const ctxValue = useMemo(
      () => ({
        isSubmittable,
        onChangeItemError,
        onChangeItemValue,
        defaultValue,
        getCurrentValue,
        addValueChangeListenerByKey,
      }),

      [
        isSubmittable,
        onChangeItemError,
        onChangeItemValue,
        defaultValue,
        getCurrentValue,
        addValueChangeListenerByKey,
      ]
    );

    return (
      <formContext.Provider value={ctxValue}>{children}</formContext.Provider>
    );
  };

  // 각각의 세부 FormItem
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
      addValueChangeListenerByKey,
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
    return render({
      onChangeItemError,
      onChangeItemValue,
      defaultValue,
      addValueChangeListenerByKey,
    });
  };

  // Submit 컴포넌트
  public Submit = ({ render }: { render: FormSubmitElement }) => {
    const { isSubmittable, getCurrentValue } = this.formHooks.useFormContext();
    return render({ isSubmittable, getCurrentValue });
  };
}

export type FormItemElementProps<T extends Object, K extends keyof T> = {
  onChangeItemError: (isError: boolean) => void;
  onChangeItemValue: (value: T[K] | undefined) => void;
  defaultValue: T[K] | undefined;
} & Pick<FormContextValue<T>, "addValueChangeListenerByKey">;

export type FormItemElement<T extends Object, K extends keyof T> = (
  props: FormItemElementProps<T, K>
) => JSX.Element;

export type FormSubmitElement = <T extends Object>(
  props: Pick<FormContextValue<T>, "isSubmittable" | "getCurrentValue">
) => JSX.Element;
export default FormFactory;
