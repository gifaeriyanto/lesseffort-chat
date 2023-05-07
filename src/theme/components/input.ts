import { ComponentStyleConfig } from '@chakra-ui/react';
import { CustomColor } from 'theme/foundations/colors';

export const InputTheme: ComponentStyleConfig = {
  baseStyle: {},
  parts: ['field', 'addon'],
  variants: {
    outline: {
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
    },
  },
  defaultProps: {
    size: 'md',
  },
};
