import { createContext, ReactNode, useRef, useState } from "react";

type FormContextValue<T extends Object> = {};

const Form = <T extends Object>({ children }: { children: ReactNode }) => {
  const handleItemErrorChange = () => {};
  const FormContext = createContext<FormContextValue<T> | null>(null);

  const Provider = ({ children }: { children: ReactNode }) => {
    //
  };
  const Render = <K extends keyof T>() => {
    const [isError, setIsError] = useState(false);
  };

  return <></>;
};

// 타입을 내려보내기 위해서 class로 감싸서 provider랑 render 만듦
class FormFactory<T extends Object> {
  private formContext = createContext<FormContextValue<T> | null>(null);

  public Provider = createProvider<T>(this.formContext);

  public Render<K extends keyof T>({ children }: { children: ReactNode }) {
    return <RenderComponent<T, K>>{children}</RenderComponent>;
  }
}

const createProvider = <T extends Object>(
  context: React.Context<FormContextValue<T> | null>
) => {
  const FormProviderComponent = ({ children }: { children: ReactNode }) => (
    <context.Provider value={{}}>{children}</context.Provider>
  );

  return FormProviderComponent;
};

const RenderComponent = <FormValue extends Object, K extends keyof FormValue>({
  children,
}: {
  children: ReactNode;
}) => {
  const [isError, setIsError] = useState(false);
  return <></>;
};

type ErrorState =
  | {
      isError: true;
      errorMsg: string;
    }
  | {
      isError: false;
      errorMsg?: undefined;
    };

type FormItemContextValue<T> = {
  setValue: (value: T) => void;
  errorState: ErrorState;
};

const FormItemComponent = <T extends any>() => {};

const FormItemProvider = <FormData extends Object, K extends keyof FormData>({
  children,
}: {
  children: ReactNode;
}) => {
  type FormItemValue = FormData[K];
  const value = useRef<FormItemValue | null>(null);
};

const A = () => {
  return (
    <Form<{ a: number }>>
      <></>
    </Form>
  );
};
