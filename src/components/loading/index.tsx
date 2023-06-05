import React from 'react';
import { Box, Flex, FlexProps } from '@chakra-ui/react';
import { TypingDots } from 'components/typingDots';

export interface LoadingProps extends FlexProps {}

export const Loading: React.FC<LoadingProps> = ({ ...props }) => {
  return (
    <Flex justify="center" align="center" color="gray.400" py={4} {...props}>
      <Box
        w="108px"
        bgColor="gray.500"
        px={4}
        borderRadius="full"
        _light={{ bgColor: 'gray.100' }}
      >
        Loading
        <TypingDots />
      </Box>
    </Flex>
  );
};
