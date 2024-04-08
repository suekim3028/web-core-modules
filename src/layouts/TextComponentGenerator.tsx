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
    V extends T extends TextComponentFactory<infer K> ? K : string
  >(
    factory: T
  ) =>
  (
    props: TextProps & {
      type: V;
    }
  ) => {
    return (
      <TextComponent {...props} {...factory[props.type]}>
        {props.children}
      </TextComponent>
    );
  };
