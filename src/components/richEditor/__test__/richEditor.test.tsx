import '@testing-library/jest-dom';

import React from 'react';
import { render } from '@testing-library/react';

import { RichEditor } from '..';

describe('RichEditor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const chakra = require('@chakra-ui/react');
    chakra.useTheme = jest.fn().mockReturnValue({
      colors: {
        border: '#fff',
        gray: {
          500: '#fff',
          600: '#fff',
        },
      },
    });
  });

  describe('render', () => {
    test('basic', () => {
      const { container } = render(<RichEditor onSubmit={jest.fn} />);
      expect(container).toBeInTheDocument();
    });
  });

  describe('action', () => {
    test.skip('on change', () => {
      // TODO onchange event
    });

    test.skip('on submit', () => {
      // TODO onsubmit event
    });
  });
});
