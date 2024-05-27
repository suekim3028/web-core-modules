import { Flex as FlexComponent, FlexProps } from "@chakra-ui/react";
import { forwardRef } from "react";

const FlexComponentGenerator = <
  U extends Record<string, string>,
  S extends U extends Record<infer V, string> ? V : string
>(
  colorGenerator: U
) =>
  forwardRef<HTMLDivElement, FlexProps & { bgColor?: S; bgRgbColor?: string }>(
    ({ bgColor, bgRgbColor, ...props }, ref) => (
      <FlexComponent
        ref={ref}
        {...props}
        bgColor={bgColor ? colorGenerator[bgColor] : bgRgbColor}
      />
    )
  );

export default FlexComponentGenerator;
