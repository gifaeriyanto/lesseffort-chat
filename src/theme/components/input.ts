import { inputAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { CustomColor } from 'theme/foundations/colors';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys);

const outline = definePartsStyle({
  field: {
    borderColor: CustomColor.border,
    _hover: {
      borderColor: CustomColor.border,
    },
    _focus: {
      borderColor: 'whiteAlpha.200',
      boxShadow: 'none',
      bgColor: 'blackAlpha.300',
    },
  },
});

export const inputTheme = defineMultiStyleConfig({
  variants: { outline },
  defaultProps: {
    size: 'md',
  },
});
