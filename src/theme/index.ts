import { extendTheme, ThemeOverride } from '@chakra-ui/react';
import { InputTheme } from 'theme/components/input';
import { colors, CustomColor } from 'theme/foundations/colors';

const config: ThemeOverride = {
  colors,
  components: {
    Input: InputTheme,
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
    global: () => ({
      'html, body': {
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: 'tall',
        bgColor: CustomColor.background,
      },
      html: {
        h: '100%',
      },
      body: {
        h: '100vh',
        p: 4,
      },
      ['*::-webkit-scrollbar']: {
        width: '4px',
        height: '4px',
      },

      ['*::-webkit-scrollbar-track']: {
        bgColor: 'transparent',
      },

      ['*::-webkit-scrollbar-thumb']: {
        bgColor: 'gray.400',
        borderRadius: 'full',
      },
    }),
  },
};

export const theme = extendTheme(config);
