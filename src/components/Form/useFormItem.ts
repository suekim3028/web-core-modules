"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FormItemElementProps } from "./FormFactory";
import { ErrorState, ValidationFn } from "./types";

const useFormItem = <T extends Object, K extends keyof T>({
  link: {
    onChangeItemError,
    onChangeItemValue,
    defaultValue,
    addValueChangeListenerByKey,
  },
  validateFn: _validateFn,
}: {
  link: FormItemElementProps<T, K>;
  validateFn: ValidationFn | "boolean" | "always";
}) => {
  const [errorState, setErrorState] = useState<ErrorState>({
    isError: false,
    isEmpty: false,
  });

  const validateFn = useMemo((): ValidationFn => {
    switch (_validateFn) {
      case "always":
        return (value) => ({ isEmpty: !!value, isError: false });
      case "boolean":
        return (value: any): ErrorState => ({
          isEmpty: !value,
          isError: !value,
        });
      default:
        return _validateFn;
    }
  }, [_validateFn]);

  const valueChangeHandler = useCallback(
    (value: T[K] | undefined) => {
      const validationRes = validateFn(value);

      setErrorState(validationRes);
      onChangeItemError(validationRes.isError);
      onChangeItemValue(value);
    },
    [onChangeItemError, onChangeItemValue, validateFn]
  );

  useEffect(() => {
    valueChangeHandler(defaultValue);
  }, [defaultValue, valueChangeHandler]);

  return { valueChangeHandler, errorState, addValueChangeListenerByKey };
};

export default useFormItem;
