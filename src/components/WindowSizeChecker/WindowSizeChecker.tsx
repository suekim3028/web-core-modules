"use client";

import { commonHooks } from "../../..";
import { WindowSizeInstance } from "../../lib/WindowSize";

const WindowSizeChecker = (consts: {
  WINDOW_MAX_WIDTH: number;
  WINDOW_MIN_WIDTH: number;
}) => {
  commonHooks.useWindowSize(consts, (size) => {
    WindowSizeInstance.width = size.width;
    WindowSizeInstance.height = size.height;
  });

  return <></>;
};

export default WindowSizeChecker;
