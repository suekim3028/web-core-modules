"use client";
import { useEffect, useState } from "react";

const getSize = ({
  WINDOW_MAX_WIDTH,
  WINDOW_MIN_WIDTH,
}: {
  WINDOW_MAX_WIDTH: number;
  WINDOW_MIN_WIDTH: number;
}) => {
  return {
    width: Math.max(
      Math.min(window.innerWidth, WINDOW_MAX_WIDTH),
      WINDOW_MIN_WIDTH
    ),
    height: window.innerHeight,
  };
};

export const useWindowSize = (consts: {
  WINDOW_MAX_WIDTH: number;
  WINDOW_MIN_WIDTH: number;
}) => {
  const [size, setSize] = useState<{
    width: number;
    height: number;
  }>();
  useEffect(() => {
    const handleResize = () => setSize(getSize(consts));
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return size;
};
