import { inputAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { CustomColor } from 'theme/foundations/colors';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys);

const outline = definePartsStyle({
  field: {
    bgColor: 'gray.700',
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
      bgColor: 'gray.100',
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
  },
});

export const inputTheme = defineMultiStyleConfig({
  variants: {
    outline,
    filled: {
      field: {
        _focus: {
          borderColor: 'transparent',
        },
        _focusVisible: {
          borderColor: 'transparent',
        },
      },
    },
  },
  sizes: {
    sm: {
      field: {
        borderRadius: 'lg',
      },
    },
    md: {
      field: {
        borderRadius: 'lg',
      },
    },
  },
  defaultProps: {
    size: 'md',
  },
});
