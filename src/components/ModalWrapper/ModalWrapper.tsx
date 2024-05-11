"use client";
import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
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
          position={"fixed"}
          left={0}
          right={0}
          top={0}
          bottom={0}
          justifyContent={"center"}
          alignItems={"center"}
          bgColor={"rgba(0,0,0,0.5)"}
          zIndex={10}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {modalItem.Component}
          </div>
        </Flex>
      )}
    </>
  );
};

export default ModalWrapper;
