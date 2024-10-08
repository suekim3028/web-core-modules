import { useCallback } from "react";
import FormFactory, { FormItemElement, FormSubmitElement } from "./FormFactory";
import useFormItem, { ErrorState } from "./useFormItem";

type SignUpValue = {
  name: string;
  phone: string;
  isPrivacyAgreed: boolean;
};

const Example = () => {
  const formFactory = new FormFactory<SignUpValue>();
  return (
    <formFactory.FormProvider
      defaultValue={{
        name: undefined,
        phone: undefined,
        isPrivacyAgreed: false,
      }}
    >
      <formFactory.FormItem
        key="name"
        render={(link) => <NameForm {...link} />}
      />
      <formFactory.FormItem
        key="phone"
        render={(link) => <PhoneForm {...link} />}
      />
      <formFactory.Submit render={(link) => <SubmitButton {...link} />} />
    </formFactory.FormProvider>
  );
};

const NameForm: FormItemElement<SignUpValue, "name"> = (link) => {
  const validateName = useCallback((value: string | undefined): ErrorState => {
    if (value === "이름")
      return {
        isError: true,
        errorMsg: "'이름'만 입력할 수 있습니다.",
      };
    return { isError: false };
  }, []);

  const { valueChangeHandler } = useFormItem<SignUpValue, "name">({
    ...link,
    validateFn: validateName,
  });
  return <input onChange={(e) => valueChangeHandler(e.target.value)} />;
};

const PhoneForm: FormItemElement<SignUpValue, "phone"> = ({}) => {
  return <input />;
};

const SubmitButton: FormSubmitElement = ({ isSubmittable }) => {
  return <></>;
};
