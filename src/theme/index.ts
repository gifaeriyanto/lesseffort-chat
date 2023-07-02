import { extendTheme, ThemeOverride } from '@chakra-ui/react';
import { buttonTheme } from 'theme/components/button';
import { inputTheme } from 'theme/components/input';
import { menuTheme } from 'theme/components/menu';
import { modalTheme } from 'theme/components/modal';
import { popoverTheme } from 'theme/components/popover';
import { selectTheme } from 'theme/components/select';
import { skeletonTheme } from 'theme/components/skeleton';
import { textareaTheme } from 'theme/components/textarea';
import { tooltipTheme } from 'theme/components/tooltip';
import { accentColor, colors, CustomColor } from 'theme/foundations/colors';
import { isRelaxMode } from 'utils/url';

const config: ThemeOverride = {
  colors,
  components: {
    Button: buttonTheme,
    Input: inputTheme,
    Menu: menuTheme,
    Modal: modalTheme,
    Popover: popoverTheme,
    Select: selectTheme,
    Skeleton: skeletonTheme,
    Textarea: textareaTheme,
    Tooltip: tooltipTheme,
  },
  config: {
    initialColorMode: 'system',
    useSystemColorMode: true,
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
    global: () => {
      let fontSize = localStorage.getItem('fontSize') || '16px';
      if (isRelaxMode()) {
        fontSize = '14px';
      }

      return {
        'html, body': {
          fontSize,
          fontWeight: 500,
          lineHeight: 'tall',
          bgColor:
            localStorage.getItem('chakra-ui-color-mode') === 'dark'
              ? CustomColor.background
              : 'gray.200',
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
        _selection: {
          bgColor: accentColor('600'),
          color: 'white',
        },
        'button:focus-visible, button[data-focus-visible], a:focus-visible, a[data-focus-visible]':
          {
            boxShadow: 'none !important',
          },
      };
    },
  },
};

export const theme = extendTheme(config);
