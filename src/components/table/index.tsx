import React, { PropsWithChildren } from 'react';
import { Box, TableContainer, TableContainerProps } from '@chakra-ui/react';
import { CustomColor } from 'theme/foundations/colors';

export const ResponsiveTable: React.FC<
  PropsWithChildren & TableContainerProps
> = ({ children, ...props }) => {
  return (
    <TableContainer
      maxW="calc(100vw - 2rem)"
      overflow="auto"
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

export const ResponsiveTableMd = ({ children }: any) => {
  return (
    <ResponsiveTable mt={2} mb={4} _last={{ mb: '6px !important' }}>
      <Box as="table" w="full" maxW="full" whiteSpace="pre-wrap">
        {children}
      </Box>
    </ResponsiveTable>
  );
};
