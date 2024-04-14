import { Flex as FlexComponent, FlexProps } from "@chakra-ui/react";

const FlexComponentGenerator =
  <
    U extends Record<string, string>,
    S extends U extends Record<infer V, string> ? V : string
  >(
    colorGenerator: U
  ) =>
  ({
    bgColor,
    bgRgbColor,
    ...props
  }: FlexProps & { bgColor?: S; bgRgbColor?: string }) =>
    (
      <FlexComponent
        {...props}
        bgColor={bgColor ? colorGenerator[bgColor] : bgRgbColor}
      />
    );

export default FlexComponentGenerator;
