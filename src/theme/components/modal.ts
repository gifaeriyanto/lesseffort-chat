import { modalAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  dialog: {
    borderRadius: { base: 0, md: '2xl' },
  },
  footer: {
    pb: 6,
  },
});

export const modalTheme = defineMultiStyleConfig({
  baseStyle,
});
