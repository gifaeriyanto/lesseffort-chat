import { cssVar, defineStyle, defineStyleConfig } from '@chakra-ui/react';

const $startColor = cssVar('skeleton-start-color');
const $endColor = cssVar('skeleton-end-color');

const gray = defineStyle({
  _light: {
    [$startColor.variable]: 'colors.gray.300',
    [$endColor.variable]: 'colors.gray.400',
  },
  _dark: {
    [$startColor.variable]: 'colors.gray.500',
    [$endColor.variable]: 'colors.gray.600',
  },
});

export const skeletonTheme = defineStyleConfig({
  variants: { gray },
  defaultProps: {
    variant: 'gray',
  },
});
