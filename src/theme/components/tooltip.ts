import { defineStyleConfig } from '@chakra-ui/react';

// define the base component styles
const baseStyle = {
  _dark: {
    borderRadius: 'lg',
    bgColor: 'gray.500',
    color: 'gray.100',
    p: '0.75rem',
  },
};

// export the component theme
export const tooltipTheme = defineStyleConfig({ baseStyle });
