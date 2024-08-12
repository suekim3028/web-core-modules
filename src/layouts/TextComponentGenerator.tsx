import { Text as TextComponent, TextProps } from "@chakra-ui/react";
import React from "react";

export type TextComponentFactoryProps = Required<
  Pick<TextProps, "fontFamily" | "fontSize" | "lineHeight">
>;

export type TextComponentFactory<T extends string> = Record<
  T,
  TextComponentFactoryProps
>;

export function TextComponentGenerator<
  T extends TextComponentFactory<any>,
  V extends T extends TextComponentFactory<infer K> ? K : string,
  U extends Record<string, string>,
  S extends U extends Record<infer V, string> ? V : string
>({ factory, colorGenerator }: { factory: T; colorGenerator: U }) {
  const Component = (
    _props: TextProps & {
      type: V;
      color?: S;
      colorRgb?: string;
    }
  ) => {
    const { type, color, colorRgb, ...props } = _props;

    return (
      <TextComponent
        {...factory[type]}
        {...props}
        // margin={0}
        wordBreak={"break-all"}
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

  return React.memo(Component);
}
