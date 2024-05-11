"use client";
import { Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import ModalManager, { ModalItem } from "../../lib/ModalManager";

const ModalWrapper = ({ children }: { children: React.ReactNode }) => {
  const { closeAfterAnim, addListener } = ModalManager;
  const [modalItem, setModalItem] = useState<ModalItem | null>(null);

  const handleChangeComponent = (value: ModalItem | null) => {
    setModalItem(value);
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
      {!!modalItem && (
        <Flex
          onClick={modalItem.closeOnDim ? close : undefined}
          w="100%"
          h="100%"
          position={"absolute"}
          left={0}
          right={0}
          top={0}
          bottom={0}
          justifyContent={"center"}
          alignItems={modalItem.position === "bottom" ? "flex-end" : "center"}
          bgColor={"rgba(0,0,0,0.5)"}
          zIndex={10}
        >
          <Flex
            w="100%"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {modalItem.Component}
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default React.memo(ModalWrapper);
