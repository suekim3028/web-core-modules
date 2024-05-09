"use client";
import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ModalManager from "../../lib/ModalManager";

const ModalWrapper = ({ children }: { children: React.ReactNode }) => {
  const { close: _close, closeAfterAnim, addListener } = ModalManager;
  const [Component, setComponent] = useState<JSX.Element | null>(null);

  const handleChangeComponent = (Component: JSX.Element) => {
    setComponent(Component);
  };

  const close = () => {
    // TODO: animation..?
    closeAfterAnim();
  };

  useEffect(() => {
    const unsub = addListener(handleChangeComponent, close);
    return unsub;
  }, []);

  return (
    <>
      {children}
      <Flex
        position={"fixed"}
        left={0}
        right={0}
        top={0}
        bottom={0}
        justifyContent={"center"}
        alignItems={"center"}
        bgColor={"rgba(0,0,0,0.1)"}
      >
        {Component}
      </Flex>
    </>
  );
};

export default ModalWrapper;
