import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const md = defineStyle({
  borderRadius: 'xl',
});

export const buttonTheme = defineStyleConfig({
  sizes: { md },
});
