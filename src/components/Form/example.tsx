"use client";
import { Button, Flex } from "@chakra-ui/react";
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
        formKey="name"
        render={(link) => <NameForm {...link} />}
      />
      <formFactory.FormItem
        formKey="phone"
        render={(link) => <PhoneForm {...link} />}
      />
      <formFactory.FormItem
        formKey="isPrivacyAgreed"
        render={(link) => <PrivacyForm {...link} />}
      />

      <formFactory.Submit render={(link) => <SubmitButton {...link} />} />
    </formFactory.FormProvider>
  );
};

const NameForm: FormItemElement<SignUpValue, "name"> = (link) => {
  const validateName = useCallback((value: string | undefined): ErrorState => {
    if (value !== "이름")
      return {
        isError: true,
        errorMsg: "'이름'만 입력할 수 있습니다.",
        isEmpty: !value,
      };
    return { isError: false, isEmpty: !value };
  }, []);

  const { valueChangeHandler, errorState } = useFormItem<SignUpValue, "name">({
    ...link,
    validateFn: validateName,
  });

  const { isEmpty, isError, errorMsg } = errorState;

  return (
    <Flex gap={"10px"} mt={"30px"}>
      이름
      <Flex flexDirection={"column"}>
        <Flex
          p={"3px"}
          borderRadius={"4px"}
          border={`1px solid ${isError && !isEmpty ? "red" : "black"}`}
        >
          <input
            defaultValue={link.defaultValue}
            onChange={(e) => valueChangeHandler(e.target.value)}
            style={{
              fontSize: "20px",
              borderStyle: "none",
            }}
          />
        </Flex>
        {!!errorMsg && !isEmpty && (
          <Flex mt={"10px"} color={"red"}>
            {errorMsg}
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

const PhoneForm: FormItemElement<SignUpValue, "phone"> = (link) => {
  console.log(`전화번호 아이템 RERENDER`);
  const validatePhone = useCallback((value: string | undefined): ErrorState => {
    if (value !== "123")
      return {
        isError: true,
        errorMsg: "'123'만 입력할 수 있습니다.",
        isEmpty: !value,
      };
    return { isError: false, isEmpty: !value };
  }, []);

  const { valueChangeHandler, errorState } = useFormItem<SignUpValue, "name">({
    ...link,
    validateFn: validatePhone,
  });

  const { isEmpty, isError, errorMsg } = errorState;

  return (
    <Flex gap={"10px"} mt={"20px"}>
      전화번호
      <Flex flexDirection={"column"}>
        <Flex
          p={"3px"}
          borderRadius={"4px"}
          border={`1px solid ${isError && !isEmpty ? "red" : "black"}`}
        >
          <input
            defaultValue={link.defaultValue}
            onChange={(e) => valueChangeHandler(e.target.value)}
            style={{
              fontSize: "20px",
              borderStyle: "none",
            }}
          />
        </Flex>
        {!!errorMsg && !isEmpty && (
          <Flex mt={"10px"} color={"red"}>
            {errorMsg}
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

const PrivacyForm: FormItemElement<SignUpValue, "isPrivacyAgreed"> = (link) => {
  console.log(`개인정보 동의 아이템 RERENDER`);
  const validatePrivacyAgreed = useCallback(
    (value: boolean | undefined): ErrorState => {
      return {
        isError: !value,
        isEmpty: !value,
      };
    },
    []
  );

  const { valueChangeHandler, errorState } = useFormItem<
    SignUpValue,
    "isPrivacyAgreed"
  >({
    ...link,
    validateFn: validatePrivacyAgreed,
  });

  const { isEmpty, isError, errorMsg } = errorState;

  return (
    <Flex gap={"10px"} mt={"20px"}>
      개인정보 동의
      <Flex flexDirection={"column"}>
        <input
          type={"checkbox"}
          onChange={(e) => valueChangeHandler(Boolean(e.target.checked))}
        />
      </Flex>
    </Flex>
  );
};

const SubmitButton: FormSubmitElement = ({
  isSubmittable,
  getCurrentValue,
}) => {
  return (
    <Button
      isDisabled={!isSubmittable}
      size={"md"}
      mt={"20px"}
      width={"100px"}
      height={"40px"}
      onClick={() => alert(getCurrentValue())}
    >
      회원가입
    </Button>
  );
};

export default Example;
