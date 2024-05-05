import type {
  TextComponentFactory,
  TextComponentFactoryProps,
} from "./TextComponentGenerator";
import { TextComponentGenerator } from "./TextComponentGenerator";

import ButtonComponentGenerator from "./ButtonComponentGenerator";

import type { FlexProps, SpaceProps } from "@chakra-ui/react";
import type { ReadOnlyProperties } from "./ButtonComponentGenerator";
import FlexComponentGenerator from "./FlexComponentGenerator";

export {
  ButtonComponentGenerator,
  FlexComponentGenerator,
  FlexProps,
  ReadOnlyProperties,
  SpaceProps,
  TextComponentFactory,
  TextComponentFactoryProps,
  TextComponentGenerator,
};
