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
  (
    props: TextProps & {
      type: V;
      color?: S | string;
    }
  ) => {
    return (
      <TextComponent
        {...props}
        {...factory[props.type]}
        whiteSpace={"pre-line"}
        color={
          props.color && props.color in colorGenerator
            ? colorGenerator[props.color]
            : props.color
        }
      >
        {props.children}
      </TextComponent>
    );
  };
