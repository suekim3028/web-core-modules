import { Flex as FlexComponent, FlexProps } from "@chakra-ui/react";
import React, { forwardRef } from "react";

const FlexComponentGenerator = <
  U extends Record<string, string>,
  S extends U extends Record<infer V, string> ? V : string
>(
  colorGenerator: U
) => {
  const Component = forwardRef<
    HTMLDivElement,
    FlexProps & {
      bgColor?: S;
      bgRgbColor?: string;
      // borderColor?: S | undefined;
      // borderRgbColor?: string;
    }
  >(({ bgColor, bgRgbColor, ...props }, ref) => {
    return (
      <FlexComponent
        ref={ref}
        {...props}
        bgColor={bgColor ? colorGenerator[bgColor] : bgRgbColor}
      />
    );
  });

  Component.displayName = "FlexComponent";

  return React.memo(Component);
};

export default FlexComponentGenerator;
