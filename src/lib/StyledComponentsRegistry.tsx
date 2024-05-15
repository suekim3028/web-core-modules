"use client";

import { useServerInsertedHTML } from "next/navigation";
import React, { useRef } from "react";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

const StyledComponentsRegistry = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Only create stylesheet once with lazy initial state
  // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const styledComponentsStyleSheet = useRef(new ServerStyleSheet()).current;

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  if (typeof window !== "undefined") return <>{children}</>;

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  );
};

export default React.memo(StyledComponentsRegistry);
