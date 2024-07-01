import {
  Flex as FlexComponent,
  FlexProps,
  GridItem,
  GridItemProps,
} from "@chakra-ui/react";
import React, { forwardRef } from "react";

const FlexComponentGenerator = <
  U extends Record<string, string>,
  S extends U extends Record<infer V, string> ? V : string
>(
  colorGenerator: U
) => {
  const Component = forwardRef<
    HTMLDivElement,
    FlexProps &
      GridItemProps & { bgColor?: S; bgRgbColor?: string; isGridItem?: boolean }
  >(({ bgColor, bgRgbColor, isGridItem, ...props }, ref) => {
    return isGridItem ? (
      <GridItem
        display={"flex"}
        ref={ref}
        {...props}
        bgColor={bgColor ? colorGenerator[bgColor] : bgRgbColor}
      />
    ) : (
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
