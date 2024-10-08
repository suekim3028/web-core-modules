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

const useFormItem = <T extends Object, K extends keyof T>({
  onChangeItemError,
  onChangeItemValue,
  defaultValue,
  validateFn,
}: FormItemElementProps<T, K> & {
  validateFn: (value: T[K] | undefined) => ErrorState;
}) => {
  const [errorState, setErrorState] = useState<ErrorState>({
    isError: false,
    isEmpty: false,
  });

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

  return { valueChangeHandler, errorState };
};

export default useFormItem;
