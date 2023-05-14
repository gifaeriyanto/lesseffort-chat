import { popoverAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  body: {},
  content: {
    padding: 3,
  },
});

export const popoverTheme = defineMultiStyleConfig({ baseStyle });
