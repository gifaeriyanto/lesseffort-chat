import React from 'react';
import { Box, Flex, FlexProps, Icon } from '@chakra-ui/react';
import { CiFolderOff } from 'react-icons/ci';

export interface EmptyProps extends FlexProps {
  message: string;
}

export const Empty: React.FC<EmptyProps> = ({ message, ...props }) => {
  return (
    <Flex
      justify="center"
      align="center"
      direction="column"
      gap={4}
      color="gray.400"
      h={{ base: 'calc(100vh - 200px)', md: '100vh' }}
      {...props}
    >
      <Icon as={CiFolderOff} fontSize="7xl" />
      <Box maxW="85vw" textAlign="center" fontSize="sm">
        {message}
      </Box>
    </Flex>
  );
};
