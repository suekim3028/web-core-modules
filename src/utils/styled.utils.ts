"use client";
import { css } from "styled-components";

export const blur = (blur: number) => {
  return css`
    filter: blur(${blur}px);
    -webkit-filter: blur(${blur}px);
    -moz-filter: blur(${blur}px);
    -o-filter: blur(${blur}px);
    -ms-filter: blur(${blur}px);
  `;
};
