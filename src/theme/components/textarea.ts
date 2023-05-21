import { defineStyle, defineStyleConfig } from '@chakra-ui/react';
import { CustomColor } from 'theme/foundations/colors';

const outline = defineStyle({
  borderColor: CustomColor.border,
  _hover: {
    borderColor: CustomColor.border,
  },
  _focus: {
    borderColor: 'whiteAlpha.200',
    boxShadow: 'none',
    bgColor: 'blackAlpha.300',
  },
  _light: {
    borderColor: CustomColor.lightBorder,
    _hover: {
      borderColor: CustomColor.lightBorder,
    },
    _focus: {
      borderColor: CustomColor.lightBorder,
      boxShadow: 'none',
      bgColor: 'gray.100',
    },
  },
});

export const textareaTheme = defineStyleConfig({
  variants: { outline },
});
