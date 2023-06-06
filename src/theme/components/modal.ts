import { modalAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  dialog: {},
});

export const modalTheme = defineMultiStyleConfig({
  baseStyle,
  sizes: {
    md: {
      dialog: {
        maxW: { base: '90vw', md: 'md' },
        borderRadius: '2xl',
      },
      footer: {
        pb: 6,
      },
    },
  },
});
