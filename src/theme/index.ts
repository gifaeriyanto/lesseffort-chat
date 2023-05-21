import { extendTheme, ThemeOverride } from '@chakra-ui/react';
import { inputTheme } from 'theme/components/input';
import { popoverTheme } from 'theme/components/popover';
import { selectTheme } from 'theme/components/select';
import { skeletonTheme } from 'theme/components/skeleton';
import { textareaTheme } from 'theme/components/textarea';
import { colors, CustomColor } from 'theme/foundations/colors';

const config: ThemeOverride = {
  colors,
  components: {
    Input: inputTheme,
    Popover: popoverTheme,
    Select: selectTheme,
    Skeleton: skeletonTheme,
    Textarea: textareaTheme,
  },
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  fonts: {
    body: '"Inter", sans-serif',
    heading: '"Inter", sans-serif',
  },
  lineHeights: {
    lg: '1.7',
    md: '1.5',
    sm: '1.3',
  },
  radii: {
    lg: '0.571rem',
    md: '0.286rem',
    sm: '0.143rem',
  },
  styles: {
    global: ({ colorMode }) => ({
      'html, body': {
        fontSize: '16px',
        fontWeight: 500,
        lineHeight: 'tall',
        bgColor: colorMode === 'dark' ? CustomColor.background : 'gray.200',
      },
      html: {
        h: '100%',
      },
      body: {
        h: '100vh',
      },
      '*::-webkit-scrollbar': {
        width: '4px',
        height: '4px',
      },
      '*::-webkit-scrollbar-track': {
        bgColor: 'transparent',
      },
      '*::-webkit-scrollbar-thumb': {
        bgColor: 'gray.400',
        borderRadius: 'full',
      },
    }),
  },
};

export const theme = extendTheme(config);
