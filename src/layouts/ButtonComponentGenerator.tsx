import { Flex } from "@chakra-ui/react";
import Link from "next/link";
import { L } from "../..";

type ButtonSize = "XS" | "S" | "M" | "L" | "XL";

type ReadOnlyProperties = {
  readonly fontType: string;
  readonly buttonType: string;
  readonly iconNames: string;
};

/**
 * settings that differ by size
 */

export type ButtonSizeSetting<T extends ReadOnlyProperties> = Record<
  ButtonSize,
  {
    py: number;
    px: number;
    fontType: T["fontType"];
    iconSize: number;
    iconMr: number;
  }
>;

/**
 * settings that differ by type
 */

export type ButtonTypeSetting<
  T extends ReadOnlyProperties,
  ColorKeys extends string | number | symbol
> = Record<
  T["buttonType"],
  {
    backgroundStart: string;
    backgroundEnd: string;
    border?: string;
    textColor: ColorKeys;
    disabledBgColor?: ColorKeys;
    disabledTextColor?: ColorKeys;
  }
>;

type ButtonDefaultSetting = { borderRadius: number };

const ButtonComponentGenerator =
  <
    T extends ReadOnlyProperties,
    ColorSetting extends { [key: string]: string },
    GeneratorProps extends ButtonGeneratorProps<T, ColorSetting>
  >(
    sizeSettings: GeneratorProps["sizeSettings"],
    typeSettings: GeneratorProps["typeSettings"],
    colorSettings: GeneratorProps["colorSettings"],
    defaultSettings: GeneratorProps["defaultSettings"],
    renderIcon: GeneratorProps["renderIcon"],
    renderText: GeneratorProps["renderText"]
  ) =>
  (buttonProps: ButtonProps<T, keyof ColorSetting>) => {
    const { href, openInNewTab } = buttonProps;
    const generatorProps: ButtonGeneratorProps<T, ColorSetting> = {
      sizeSettings,
      typeSettings,
      colorSettings,
      defaultSettings,
      renderIcon,
      renderText,
    };

    if (!href) return <ButtonComponent {...buttonProps} {...generatorProps} />;

    return (
      <Link
        href={href}
        style={{ width: buttonProps.stretch ? "100%" : "fit-content" }}
        target={openInNewTab ? "_blank" : undefined}
      >
        <ButtonComponent {...buttonProps} {...generatorProps} />
      </Link>
    );
  };

const ButtonComponent = <
  T extends ReadOnlyProperties,
  ColorSetting extends { [key: string]: string }
>({
  title,
  type,
  size,
  icon,
  stretch,
  bgColor,
  bgRgbColor,
  textRgbColor,
  textColor,
  disabled,
  onClick,
  sizeSettings,
  typeSettings,
  colorSettings,
  renderIcon,
  renderText,
  ...props
}: ButtonProps<T, keyof ColorSetting> &
  ButtonGeneratorProps<T, ColorSetting>) => {
  const sizeSetting = sizeSettings[size];
  const typeSetting = typeSettings[type];

  const {
    backgroundStart,
    backgroundEnd,
    textColor: themeTextColor,
    border,
    disabledBgColor,
    disabledTextColor,
  } = typeSetting;

  const { py, px, fontType, iconSize, iconMr } = sizeSetting;

  return (
    <Flex
      w={stretch ? "100%" : undefined}
      // flex={0}
      // flexGrow={0}

      background={
        disabled && disabledBgColor
          ? colorSettings[disabledBgColor]
          : bgColor
          ? colorSettings[bgColor]
          : bgRgbColor ||
            `linear-gradient(90deg, ${backgroundStart}, ${backgroundEnd})`
      }
      py={`${py}px`}
      px={stretch ? undefined : `${px}px`}
      justifyContent={"center"}
      alignItems={"center"}
      borderRadius={"40px"}
      border={border ? `1px solid ${border}` : undefined}
      cursor={onClick && !disabled ? "pointer" : undefined}
      onClick={disabled ? undefined : onClick}
      {...props}
    >
      {!!icon && renderIcon(icon, iconSize)}
      {renderText(
        fontType,
        disabled && disabledTextColor
          ? disabledTextColor
          : textColor || themeTextColor,
        title,
        textRgbColor
      )}
    </Flex>
  );
};

type ButtonProps<
  T extends ReadOnlyProperties,
  ColorKeys extends string | number | symbol
> = {
  title: string;
  type: T["buttonType"];
  size: ButtonSize;
  icon?: T["iconNames"];
  stretch?: boolean;
  onClick?: () => void;
  disabled?: boolean;
} & L.SpaceProps & {
    bgColor?: ColorKeys;
    bgRgbColor?: string;
    textColor?: ColorKeys;
    textRgbColor?: string;
  } & (
    | {
        href?: undefined;
        openInNewTab?: undefined;
      }
    | {
        href?: string;
        openInNewTab?: boolean;
      }
  );

type ButtonGeneratorProps<
  T extends ReadOnlyProperties,
  ColorSetting extends Record<string, string>
> = {
  sizeSettings: ButtonSizeSetting<T>;
  typeSettings: ButtonTypeSetting<T, keyof ColorSetting>;
  colorSettings: ColorSetting;
  defaultSettings: ButtonDefaultSetting;
  renderIcon: (iconName: T["iconNames"], size: number) => JSX.Element;
  renderText: (
    type: T["fontType"],
    color: keyof ColorSetting,
    title: string,
    textRgbColor?: string
  ) => JSX.Element;
};

export default ButtonComponentGenerator;
