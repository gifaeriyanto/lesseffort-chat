import { ComponentStyleConfig } from '@chakra-ui/react';
import { CustomColor } from 'theme/foundations/colors';

export const selectTheme: ComponentStyleConfig = {
  baseStyle: {},
  parts: ['field', 'icon'],
  variants: {
    outline: {
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
    },
  },
  defaultProps: {
    size: 'md',
  },
};
