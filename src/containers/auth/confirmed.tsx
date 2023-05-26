import React from 'react';
import { Box, Flex, Heading } from '@chakra-ui/react';

export const ConfirmedContainer: React.FC = () => {
  return (
    <Flex minH="100vh" justify="center" align="center">
      <Box
        bgColor={{ md: 'gray.600' }}
        w="full"
        maxW="30rem"
        p="3rem"
        borderRadius="xl"
        _light={{ bgColor: { md: 'gray.50' } }}
      >
        <Heading mb={2} textAlign="center">
          Thanks for joining us
        </Heading>
      </Box>
    </Flex>
  );
};
