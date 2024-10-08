import { useCallback, useEffect, useState } from "react";
import { FormItemElementProps } from "./FormFactory";

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

const booleanValidationFn = (value: any): ErrorState => ({
  isEmpty: !value,
  isError: !value,
});

const useFormItem = <T extends Object, K extends keyof T>({
  link: {
    onChangeItemError,
    onChangeItemValue,
    defaultValue,
    addValueChangeListenerByKey,
  },
  validateFn,
}: {
  link: FormItemElementProps<T, K>;
  validateFn: ValidationFn | "boolean";
}) => {
  const [errorState, setErrorState] = useState<ErrorState>({
    isError: false,
    isEmpty: false,
  });

  const valueChangeHandler = useCallback(
    (value: T[K] | undefined) => {
      const validationRes =
        validateFn === "boolean"
          ? booleanValidationFn(value)
          : validateFn(value);

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
