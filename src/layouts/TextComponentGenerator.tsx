import { Text as TextComponent, TextProps } from "@chakra-ui/react";

export type TextComponentFactoryProps = Required<
  Pick<TextProps, "fontFamily" | "fontSize" | "lineHeight">
>;

export type TextComponentFactory<T extends string> = Record<
  T,
  TextComponentFactoryProps
>;

export const TextComponentGenerator =
  <
    T extends TextComponentFactory<any>,
    V extends T extends TextComponentFactory<infer K> ? K : string,
    U extends Record<string, string>,
    S extends U extends Record<infer V, string> ? V : string
  >({
    factory,
    colorGenerator,
  }: {
    factory: T;
    colorGenerator: U;
  }) =>
  ({
    type,
    color,
    colorRgb,
    ...props
  }: TextProps & {
    type: V;
    color?: S;
    colorRgb?: string;
  }) => {
    return (
      <TextComponent
        {...factory[type]}
        {...props}
        whiteSpace={"pre-line"}
        color={
          color && color in colorGenerator
            ? colorGenerator[color]
            : color || colorRgb
        }
      >
        {props.children}
      </TextComponent>
    );
  };
