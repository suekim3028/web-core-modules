import { useCallback, useEffect } from "react";
import { FormItemElementProps } from "./FormFactory";

export type ErrorState =
  | {
      isError: true;
      errorMsg?: string;
    }
  | {
      isError: false;
      errorMsg?: undefined;
    };

const useFormItem = <T extends Object, K extends keyof T>({
  onChangeItemError,
  onChangeItemValue,
  defaultValue,
  validateFn,
}: FormItemElementProps<T, K> & {
  validateFn: (value: T[K] | undefined) => ErrorState;
}) => {
  const valueChangeHandler = useCallback(
    (value: T[K] | undefined) => {
      const validationRes = validateFn(value);

      onChangeItemError(validationRes.isError);
      onChangeItemValue(value);
    },
    [onChangeItemError, onChangeItemValue, validateFn]
  );

  useEffect(() => {
    valueChangeHandler(defaultValue);
  }, [defaultValue, valueChangeHandler]);

  return { valueChangeHandler };
};

export default useFormItem;
