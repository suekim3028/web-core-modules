import { Flex, SpaceProps } from "@chakra-ui/react";
import Link from "next/link";

type ButtonSize = "XS" | "S" | "M" | "L" | "XL";

export type ReadOnlyProperties = {
  fontTypes: Readonly<string[]>;
  buttonTypes: Readonly<string[]>;
  iconNames: Readonly<string[]>;
  colorSettings: Readonly<Record<string, string>>;
};

/**
 * settings that differ by size
 */

type ButtonSizeSetting<T extends ReadOnlyProperties> = Record<
  ButtonSize,
  {
    py: number;
    px: number;
    fontType: T["fontTypes"][number];
    iconSize: number;
    iconMr: number;
  }
>;

/**
 * settings that differ by type
 */

type ButtonTypeSetting<
  T extends ReadOnlyProperties,
  ColorKeys extends string | number | symbol
> = Record<
  T["buttonTypes"][number],
  {
    backgroundStart: string;
    backgroundEnd: string;
    border?: string;
    textColor: ColorKeys;
    disabledBgColor?: ColorKeys;
    disabledTextColor?: ColorKeys;
  }
>;

type ButtonDefaultSetting = { borderRadius: number; defaultSize: ButtonSize };

const ButtonComponentGenerator =
  <
    T extends ReadOnlyProperties,
    GeneratorProps extends ButtonGeneratorProps<T>
  >(
    { colorSettings }: T,
    {
      sizeSettings,
      typeSettings,
      defaultSettings,
      renderIcon,
      renderText,
    }: GeneratorProps
  ) =>
  (_buttonProps: ButtonProps<T>) => {
    const { openInNewTab, ...buttonProps } = _buttonProps;
    const { href } = buttonProps;
    const generatorProps: ButtonGeneratorProps<T> = {
      sizeSettings,
      typeSettings,
      colorSettings,
      defaultSettings,
      renderIcon,
      renderText,
    };

    if (!href)
      return (
        <ButtonComponent {...buttonProps} generatorProps={generatorProps} />
      );

    return (
      <Link
        href={href}
        style={{ width: buttonProps.stretch ? "100%" : "fit-content" }}
        target={openInNewTab ? "_blank" : undefined}
      >
        <ButtonComponent {...buttonProps} generatorProps={generatorProps} />
      </Link>
    );
  };

const ButtonComponent = <
  T extends ReadOnlyProperties,
  ColorSetting extends { [key: string]: string }
>({
  title,
  type,
  size: _size,
  icon,
  stretch,
  bgColor,
  bgRgbColor,
  textRgbColor,
  textColor,
  disabled,
  onClick,
  generatorProps: {
    sizeSettings,
    typeSettings,
    colorSettings,
    renderIcon,
    renderText,
    defaultSettings,
  },

  ...props
}: ButtonProps<T> & { generatorProps: ButtonGeneratorProps<T> }) => {
  const size = _size || defaultSettings.defaultSize;
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
      {!!icon && (
        <div style={{ marginRight: iconMr }}>
          {renderIcon({ name: icon, size: iconSize })}
        </div>
      )}
      {renderText({
        type: fontType,
        color:
          disabled && disabledTextColor
            ? disabledTextColor
            : textColor || themeTextColor,
        title: title,
        colorRgb: textRgbColor,
      })}
    </Flex>
  );
};

type ButtonProps<T extends ReadOnlyProperties> = {
  title: string;
  type: T["buttonTypes"][number];
  size?: ButtonSize;
  icon?: T["iconNames"][number];
  stretch?: boolean;
  onClick?: () => void;
  disabled?: boolean;
} & SpaceProps & {
    bgColor?: keyof T["colorSettings"];
    bgRgbColor?: string;
    textColor?: keyof T["colorSettings"];
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

type ButtonGeneratorProps<T extends ReadOnlyProperties> = {
  sizeSettings: ButtonSizeSetting<T>;
  typeSettings: ButtonTypeSetting<T, keyof T["colorSettings"]>;
  colorSettings: T["colorSettings"];
  defaultSettings: ButtonDefaultSetting;
  renderIcon: (props: {
    name: T["iconNames"][number];
    size: number;
  }) => JSX.Element;
  renderText: (props: {
    type: T["fontTypes"][number];
    color: keyof T["colorSettings"];
    title: string;
    colorRgb?: string;
  }) => JSX.Element;
};

export default ButtonComponentGenerator;
