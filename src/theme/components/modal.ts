import { modalAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  dialog: {
    borderRadius: '2xl',
  },
  footer: {
    pb: 6,
  },
});

export const modalTheme = defineMultiStyleConfig({
  baseStyle,
  sizes: {
    md: {
      dialog: {
        maxW: { base: '90vw', md: 'md' },
      },
    },
    lg: {
      dialog: {
        maxW: { base: '90vw', lg: 'lg' },
      },
    },
    xl: {
      dialog: {
        maxW: { base: '90vw', xl: 'xl' },
      },
    },
  },
});
