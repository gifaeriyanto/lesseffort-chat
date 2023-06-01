import React, { PropsWithChildren } from 'react';
import { TableContainer, TableContainerProps } from '@chakra-ui/react';
import { ReactMarkdownProps } from 'react-markdown/lib/complex-types';
import { CustomColor } from 'theme/foundations/colors';

export const ResponsiveTable: React.FC<
  PropsWithChildren & TableContainerProps
> = ({ children, ...props }) => {
  return (
    <TableContainer
      maxW="calc(100vw - 2rem)"
      overflow="auto"
      className="halo"
      sx={{
        'td, th': {
          borderColor: CustomColor.border,
          _light: {
            borderColor: CustomColor.lightBorder,
          },
        },
      }}
      {...props}
    >
      {children}
    </TableContainer>
  );
};
